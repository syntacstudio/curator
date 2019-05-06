# **CURATOR**
Curator is an html builder using the template engine edge from Adonis, we try to implement the template engine from the backend to the frontend, this template engine is very similar to the blade of Laravel.
Curator has also used Laravelmix for its bundler assets and already, includes bootstrap version 4 and other supporting components  

  # Installation
  1. You need Nodejs and latest version npm  [https://nodejs.org/en/](https://nodejs.org/en/)
  2. Run npm install --save-dev
  3. Setup .env file for setting configuration 
  4. Run Npm start for starting dev server and compile html  , and npm run watch for compile assets 
  5.  Happy coding
   
  
  # Features:
 1. Dev Server (inludes host and port) 
	  - You can set route host and port in .env file at root folder 
 2. Dotenv 
 3. Configure with Laravelmix [https://laravel-mix.com/](https://laravel-mix.com/)
 4. Template engine ( use edge ) [https://edge.adonisjs.com/](https://edge.adonisjs.com/)
 5. Compile to html file
 6. Data Parse
 7. Beauty Routing  (Manual And Automatic)
 8. Autoload 
 9. Pretify html

# Setup .ENV
<table border="1"> 
	 <thead>
	 	<th>No</th>
		<th>CODE</th>
		<th>Type</th>
		<th>Function </th>
		<th>Example</th>
	</thead>
	<tbody>
	    <tr>
	         <td>1</td>
			 <td>APP_NAME</td>
			 <td>String</td>
			 <td>Set global applicaton name</td>
			 <td>Curator</td>
	</tr>
	<tr>
	         <td>2</td>
			 <td>APP_MODE</td>
			 <td>String</td>
			 <td>Set  Application mode</td>
			 <td>development , deploy</td>
	</tr>
	<tr>
	         <td>3</td>
			 <td>HOST</td>
			 <td>String</td>
			 <td>Set  Application dev server host </td>
			 <td>0.0.0.0</td>
	</tr>
	<tr>
			<td>4</td>
			 <td>PORT</td>
			 <td>Integer</td>
			 <td>Set Application dev server port</td>
			 <td>9090 , 8080 , 80</td>
	</tr>
	<tr>
			<td>5</td>
			 <td>COMPILE_DIR</td>
			 <td>String</td>
			 <td>Set Compile edge file directory</td>
			 <td>resources/views</td>
	</tr>
	<tr>
			<td>6</td>
			 <td>PUBLIC_DIR</td>
			 <td>String</td>
			 <td>Set Compiles html file directory</td>
			 <td>9090 , 8080 , 80</td>
	</tr>
	<tr>
			<td>7</td>
			 <td>COMPILE</td>
			 <td>Boolean</td>
			 <td>Set compile mode </td>
			 <td>true , false</td>
	</tr>
	<tr>
        	<td>8</td>
			 <td>ROUTER </td>
			 <td>String</td>
			 <td>Set Router Type</td>
			 <td>manual  (you need define route in router file) , auto</td>
	</tr>
		<tr>
        	 <td>9</td>
			 <td>PRETIFY_HTML</td>
			 <td>Boolean</td>
			 <td>Pretifying Html file after compile </td>
			 <td>true , false</td>
	</tr>
	<tr>
        	<td>10</td>
			 <td>AUTOLOAD </td>
			 <td>Boolean</td>
			 <td>Set autolaod for dev server</td>
			 <td>true , false</td>
	</tr>
</tbody>
</table>	

# Creating Manual Route
Route file in app/route.json
	you can define your file and route name at this 
	but you need set router in .env file to manual

# Disable Compile Directory
This have function for disabling compile and acces directory at compile process
You can set in app/protector.json 

# Creating And Access Data
 Data file in app/data you need to define your json file in register.json for access data in your webpage  (example was includes)

# Creating Api For Dev server
Before use api you need to register route api in app/api.json
after that in app/api/*  you can create new api file (ex : user.json)
(example was includes )

# Replacing String On File
This have function to replace string in file in compile process
You can set on app/helpers/helpers.json
Parameter : 
1. compile : Process after compile or before compile
2. mode   :  Application mode in .env file
3. subdir :  file directory , this will be very useful if you use multiple languages
4. find  : words you want to find
5. replace : sentence or word that will replace it


# Helpers Function
 This Have function to manualy creatiing global function and you can access this on odge file
 You can set  helper function in app/helpers/helpers.js
 

# Note
1. Dont Modify bin directory 

# Components

1. [https://edge.adonisjs.com/](https://edge.adonisjs.com/)
2.  [https://laravel-mix.com/](https://laravel-mix.com/)
3. [https://jquery.com/](https://jquery.com/)
4. [https://www.npmjs.com/package/live-server](https://www.npmjs.com/package/live-server)
5. [https://github.com/axios/axios](https://github.com/axios/axios)
6. [https://getbootstrap.com/](https://getbootstrap.com/)
 
 	 




