const express = require('express');  
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app  = express();
const port = 8080;

app.use(bodyParser);
app.get("/",(req,res)=>{
	res.send("Hello Curator :)");
})

/*
app.listen(port,()=>{
	console.log(`Curator Listen On port ${port}`)
})
*/
module.exports.handler = serverless(app);
