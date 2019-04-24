'use strict'
// define global variabel
const fs = require("fs");
const fse = require("fs-extra")
const url = require("url");
const path = require("path");
const formater = require("html-formatter")
const http = require("http");
const edge = require("edge.js");
const env = require("dotenv").config()
const mime = require("mime");
const WebSocket = require("faye-websocket");
const chokidar = require('chokidar');
const recursiveReadSync = require('recursive-readdir-sync')
let is_reload = "reloadAll";
// define configured  method
const utils = require("./utils");
const watcher = chokidar.watch([utils.getDir("resources"), utils.getDir(process.env.PUBLIC_DIR), utils.getDir("app")])
require('events').EventEmitter.defaultMaxListeners = 0
/**
 ** handling server  
 **/
const server = http.createServer(async (req, res) => {
    let uri = url.parse(req.url, true)
    let path = uri.pathname;
    var apimode = await utils.getAPi(path);
    var socketMode = await utils.getSocket(path);
    if (apimode !== null) {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.write(apimode)
    } else if (socketMode !== null) {
        res.writeHead(200, {
            "Content-Type": "text/javascript"
        });
        res.write(socketMode)
    } else {
        if (utils.getMime(path) == "text/html") {
            var result  =   await utils.resFile(path);
            res.writeHead(result["status"], {
                 "Content-Type": await utils.getMime(path)
            });
            res.write(result["data"]);
        } else {
            var result  =  await utils.getasset(path);
            res.writeHead(result["status"], {
                 "Content-Type": await utils.getMime(path)
            });
            res.write(result["data"]);
        }
    }

    return res.end();
})


/**
 ** handling server socket
 **/

server.on('upgrade', async (request, socket, body) => {
     let readystat = 0;
    if (WebSocket.isWebSocket(request)) {
        var ws = new WebSocket(request, socket, body);
        if (process.env.AUTOLOAD == "true") {
            let readystat = 0;
            watcher
                .on("ready", () => {
                     ws.send(process.env.AUTOLOAD)
                    setTimeout(() => readystat = 1, 1000)
                })
                .on("add", async (file) => {
                    if (file.includes("sass") || file.includes("SASS") || file.includes("css") || file.includes("CSS")) {
                        if (readystat == 1 ) ws.send("reloadCss");
                    } else {
                        if (readystat == 1) ws.send("reloadFull");
                    }
                })
                .on("change", async (file) => {
                    ws.send("")
                    if (file.includes("sass") || file.includes("SASS") || file.includes("css") || file.includes("CSS")) {
                        ws.send("reloadCss");
                    } else {
                        ws.send("reloadFull");
                    }
                })
                .on("ulink", async (file) => {
                    if (readystat == 1) {
                        await utils.renderAll();
                    }

                })

        }
    }
})
server.listen(process.env.PORT, process.env.HOST);
console.log(`Server Listen on  ${process.env.HOST}:${process.env.PORT}`)
/**
 **  handling watcher 
 **/
if (process.env.COMPILE == "true") {
    let readystat = 0;
    watcher
        .on("ready", async () => {
            setTimeout(() => readystat = 1, 1000)
        })
        .on("add", async (file) => {
            if (process.env.COMPILE == "true") {
                if (file.includes(process.env.COMPILE_DIR) && file.includes(process.env.PUBLIC_DIR) == false) {
                    if (await utils.protect(file) != null) {
                        if (await utils.protect(file) != null) await utils.createCompile(file);
                    } else {
                        if (readystat == 1) {
                            await utils.renderAll();
                        }
                    }
                }
            }

        })
        .on("change", async (file) => {
            if (process.env.COMPILE == "true") {
                if (file.includes(process.env.COMPILE_DIR) && file.includes(process.env.PUBLIC_DIR) == false) {
                    if (await utils.protect(file) != null) {
                        if (await utils.protect(file) != null) await utils.createCompile(file);
                    } else {
                        await utils.renderAll();
                    }
                }
            }

        })
        .on("ulink", async (file) => {
            if (process.env.COMPILE == "true") {
                await utils.renderAll();
            }
        })
}