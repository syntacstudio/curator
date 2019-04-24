(async ()=>{
	const page  =  request.get("page") ? request.get("page") : 1;
	const query  = request.get("kayuku_query") ? request.get("kayuku_query")  : "" ;

	await getArticleData({limit:11}).then(async (result)=>{
		var __arrscoup  = [];
		var key  = 0;
		var count = query.length != 0 ? 12 : 6;
		result.forEach(async (data,item)=>{
			if (data["name"].includes(query) || data["date"].includes(query) || data["description"].includes(query) ) {
			 key +=1;	
			  if (key > parseInt(page) * count - count   &&  key <= parseInt(page) * count) {
    	             await __arrscoup.push(data);
               }
			}
			 
		})
		var temp  =  await getFile(article_template_whistlist);
		var template  =  Handlebars.compile(temp);
		$("#__article_get_all").html(template({"data":__arrscoup}));
		if (__arrscoup.length == 0 ) $("#__article_get_all").html(await getFile(prod_err));
		if(__arrscoup.length == 0) {
				$("#__cross-article_view").remove();
				$(".any-product").remove();
		}
		createPaginator("#__article__paginator",key ,count);
	})//
	createlazy();
})()