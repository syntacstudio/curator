(async ()=>{
	await getArticleData({id:request.get("id")}).then(async (result)=>{
		if (result.length == 0 ) {
			window.location.href = "404.html";
		}
		$("#article_image_banner").attr('data-src', `${dev_uri.includes("/en/") ? "../" : ""}assets/images/blogs/${result[0]["image"]}`);
		$("#__date").text(result[0]["date"]);
		$("#__title").text(result[0]["name"]);
		document.title  =  result[0]["name"];
		$("#__description").html(result[0]["description"])
	})
	await getArticleData({limit:3,shuffle:true}).then(async (result)=>{
		var temp  =  await getFile(article_template);
		var template  =  Handlebars.compile(temp);
		$("#__prod_shuffle").html(template({"data":result}));
	});
	createlazy();
})()