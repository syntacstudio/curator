(async ()=>{
	var source = await getProductData("all", 20);
    var query = request.get('kayuku_query');
    query = query ? query.split("+") : null;
    var page = request.get('page') ? request.get('page') : 1;
    var bind = request.get('kayuku_bind');
    $("input[name=kayuku_query]").val(request.get('kayuku_query'));

    // createing filtrator
    const assign_prod = async (min = 1, max = 10000000) => {
        var __assert_prod = [];
        const product_file = await getFile(product_temp_whistlist);
        const source_prod = await getProductData((bind ? bind : "all"), 20);
        let assiggn_prod_list  = 0;
        await source_prod["data"].forEach(async (result, key) => {
	            var temp_prod = [];
	            var temp_price = [];
	            if (query) {
	                for (var i = 0; i < query.length; i++) {
	                    if (result["status"].toLowerCase().includes(query[i].toLowerCase()) || result["description"].toLowerCase().includes(query[i].toLowerCase()) || result["type"].toLowerCase().includes(query[i].toLowerCase()) || result["name"].toLowerCase().includes(query[i].toLowerCase())) {
	                        await temp_prod.push(result)
	                    }
	                }
	            } else {
	                temp_prod.push(result);
	            }

	          for (var i = 0; i < temp_prod.length; i++) {
    	                if (min != 0 && max != "n") {
    	                    if (temp_prod[i]["price"] <= max && temp_prod[i]["price"] >= min) {
                                assiggn_prod_list += 1;
                                if (key >= parseInt(page) * 8 - 8   && key < parseInt(page) * 8) {
    	                          await __assert_prod.push(temp_prod[i]);
                                }
    	                    }
    	                } else {
                            assiggn_prod_list += 1;
                             if (key >= parseInt(page) * 8 - 8   && key < parseInt(page) * 8) {
    	                         await __assert_prod.push(temp_prod[i]);
                             }
    	                }
	               }

	      })

        const template = Handlebars.compile(product_file);
        var target = $("#__prod_view_get");
        target.html(template({
            "data": __assert_prod
        }));
        //console.log(__assert_prod.length)
        //console.log(assiggn_prod_list)
        await createPaginator("#__prod_paginator",assiggn_prod_list,8)
        if (assiggn_prod_list == 0 || __assert_prod.length == 0) {
        	target.html(await getFile(prod_err));
        }


    }

    // call sign create product
    await assign_prod();
    createlazy()
})()