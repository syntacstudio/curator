'use rstrict'
const express = require('express');  
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app  = express();
const port = 8080;
const date  = new Date();

app.use(bodyParser);
app.get("/",(req,res)=>{
	res.send(`Hello Curator :) \n ${date.getHours}`);
})

/*
app.listen(port,()=>{
	console.log(`Curator Listen On port ${port}`)
})
*/
console.log("curator is live ");
module.exports = app;
module.exports.handler = serverless(app);
