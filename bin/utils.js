// define global package 
const path = require("path");
const fs = require("fs");
const env = require("dotenv").config();
const fse = require("fs-extra");
const edge = require("edge.js");
const mime  =  require("mime");
const recursiveReadSync = require('recursive-readdir-sync')
require('events').EventEmitter.defaultMaxListeners = 0
// normalisation url directory 
const normalize = (dir) => {
    return path.normalize(dir);
}
// handling replace directory
const getDir = (dir) => {
    return normalize(__dirname.split("bin").join(dir));
}
// helpers
const helpers = require(path.normalize(getDir("app/helpers/helpers.js")));
// handling register edge default directory
edge.registerViews(path.join(process.env.COMPILE_DIR));
//handling protector 
const protector = () => {
    var arr = [];
    JSON.parse(fs.readFileSync(getDir("app/protector.json").toString("utf8"))).forEach(function(data, key) {
        data = getDir(process.env.COMPILE_DIR + data)
        arr.push(data)
    });
    return arr;
}
// get mime condition
const getMime  =  (filename)=> {
	return   mime.getType(filename) != null ?   mime.getType(filename) : "text/html" ;

}
// protection directory 
const protect = async (files) => {
    let protect = 0;
    JSON.parse(fs.readFileSync(getDir("app/protector.json")).toString("utf8")).forEach(async (element, index) => {
        if (files.includes(element)) {
            protect = 1;
        }
    });
    //console.log(files)
    if (protect != 0) {
        return null;
    }
    return await files;
}
// handling register data 
const registerData = async () => {
    let parser = [];
    let data_get = "";
    await JSON.parse(fs.readFileSync(getDir("app/data/register.json")).toString("utf8")).forEach(function(data, key) {
        data_get = `${data_get}${key !== 0 ? "," : ""}"${data["name"]}":${fs.readFileSync(getDir("app/data/"+data["file"])).toString("utf8")}`;
    });
    data_get = `{${data_get}}`;
    return await JSON.parse(data_get);
}
// get file data
const getFile = async (file) => {
	var data;
	try {
		data = (file.includes(".html") || file.includes(".edge")  || file.includes(".json") ? await fs.readFileSync(file).toString("utf8") : await fs.readFileSync(file) ) ;
	} catch(e) {
		data =  null;
	}
   return  data;
}
// write file 
const writeFile = async (file, name) => {
    name = name.replace(getDir(process.env.COMPILE_DIR), "").replace(".edge", ".html")
    try {
        fse.outputFile(getDir(`${process.env.PUBLIC_DIR}/${name.split(".edge").join(".html")}`), file, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Writted : " + getDir(`${process.env.PUBLIC_DIR}/${name}`))
            }
        });
    } catch (err) {
        console.log(err);
    }
}
// replace ment
const replace = async (file, mode, name) => {
    const replacement = JSON.parse(fs.readFileSync(getDir("app/helpers/helpers.json")).toString("utf8"));
    let rendered = file;
    try {
        if (mode == "before") {
            replacement.forEach((element, index) => {
                if (element["mode"] == "all" || element["mode"] == process.env.APP_MODE) {
                    if (element["subdir"] == "all" || name.includes(element["subdir"]) == true) {
                        if (element["compile"] == "all" || element["compile"] == mode) {
                            rendered = rendered.split(element["find"]).join(element["replace"])
                        }

                    }
                }
            });

        }
    } catch(e) {
        //console.log(e);
    }
    return rendered;
}
// read All File
const getAllFile =  async () =>{
	return await recursiveReadSync(getDir(process.env.COMPILE_DIR));
}
// read directory
const readDir = async (dir) => {
    return await recursiveReadSync(dir);
}
// add socket 
const addSocket  = (file)=> {
    var tempme  =  `<script type="text/javascript" src="/socket/autoload.js" defer ></script>\n</html>`
    file  =  process.env.AUTOLOAD == "true" ? file.replace("</html>",tempme) : file;
   // console.log(file)
    return file;
}
//  compiling data
const compile = async (file, name) => {
    file = await replace(file, "before", name);
    try {
	    file = edge.renderString(file, {
	        data: await registerData(),
	        env: process.env
	    })
    } catch(e) {
    	 file  = edge.render(normalize('layouts/woops-errors'), {
            errors: e.toString(),
            files: name
        }) 
    }
    file = await replace(file, "after", name);
 
    return file;
}
/**
** handling compile data
**/
const createCompile =  async (file)=>{
	var data = await getFile(file);
    data = await compile(data, file);
    await writeFile(data, file)
}
/**
** rendereing data all completion
**/
const renderAll = async ()=>{
	getAllFile().then(async (data)=>{
		data.forEach( async (item, key)=> {
			 if (await protect(item) != null) createCompile(item);
		});
	});
} 


///////////////////////// Handling server side
// resgetFIleFile
const resFile =  async (path)=>{
	var route  = await createRoute();
	asdata  = null;
	for (var i = 0;  i < route.length; ++i) {
		if (route[i]["route"] === path.toLowerCase()) {
			return  {"status":200,"data": addSocket(await compile ( await getFile(getDir(process.env.COMPILE_DIR+"/"+route[i]["file"])),getDir(process.env.COMPILE_DIR+"/"+route[i]["file"])))}
		}
	}
	return await createErr();
}
const getAPi = async (path)=>{
	var api  = JSON.parse( await getFile(getDir("app/api.json")));
	for (var i = 0; i < api.length; i++) {
		if (api[i]["route"]== path ) {
			return await getFile(getDir("app/api/"+api[i]["file"]));
		}
	}
	return null;
}
const getSocket = async  (path)=> {
	if (path == "/socket/autoload.js") {
		return await getFile(getDir("app/components/socket.js"));
	}
	return null;
}

// create 404 
const createErr =  async (url)=>{
  return {"status":404,"data":addSocket(await edge.render("404",{url:url,env:process.env}))};
}
// rendering assets 
const getasset  = async (path)=>{
	var data =   {"status":200,"data": await  getFile(getDir(process.env.PUBLIC_DIR+path))};
	if (data["data"]  != null) {
		return data; 
	} else {
		return  await createErr(path) ;
	}
}
// craetting router 
 const createRoute =  async ()=>{
 	router  = [];
  	if (process.env.ROUTER != "manual" ) {
  	   recursiveReadSync(getDir(process.env.COMPILE_DIR)).forEach( async (data, key)=>{
  	   	 if(await  protect(data) != null) {
  	   	 	 router.push({
  	   	 	 	"route":data.replace(getDir(process.env.COMPILE_DIR),"").replace(".edge",".html"),
  	   	 	 	"file" : data.replace(getDir(process.env.COMPILE_DIR+"/"),"")
  	   	 	 });
  	   	 	 router.push({
  	   	 	 	"route":data.replace(getDir(process.env.COMPILE_DIR),"").replace(".edge",""),
  	   	 	 	"file" : data.replace(getDir(process.env.COMPILE_DIR+"/"),"")
  	   	 	 });
  	   	 	 if (data.includes("index.edge")) {
	  	   	 	  router.push({
	  	   	 	 	"route":data.replace(getDir(process.env.COMPILE_DIR),"").replace("index.edge",""),
	  	   	 	 	"file":data.replace(getDir(process.env.COMPILE_DIR+"/"),"")
	  	   	 	 });
  	   	 	 }
  	   	 }
  	   });
  	} else {
  		router  =  JSON.parse(await getFile(getDir("app/route.json")));
  	}
  	return router
 }

module.exports = {
    normalize,
    protect,
    compile,
    registerData,
    writeFile,
    getFile,
    getDir,
    protector,
    writeFile,
    getAllFile,
    createRoute,
    getMime,
    createCompile,
    renderAll,
    createErr,
    getasset,
    resFile,
    getAPi,
    getSocket

}