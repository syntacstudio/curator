const express = require('express');  
const serverless = require('serverless-http');
const app  = express();
const port = 8080;

app.get("/",(req,res)=>{
	res.send("Hello Curator :)");
})

/*
app.listen(port,()=>{
	console.log(`Curator Listen On port ${port}`)
})
*/
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // you can do other things here
  const result = await handler(event, context);
  // and here
  return result;
};

