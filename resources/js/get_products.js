(async () => {
	// define contatnta query
    var source = await getProductData("all", "max");
    var query = request.get('kayuku_query');
    query = query ? query.split("+") : null;
    var page = request.get('page') ? request.get('page') : 1;
    var bind = request.get('kayuku_bind');

    // createing filtrator
    const assign_prod = async (min = 1, max = 10000000) => {
        var __assert_prod = [];
        const product_file = await getFile(product_temp);
        const source_prod = await getProductData((bind ? bind : "all"), "max");
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
                                if (key >= parseInt(page) * 12 - 12   && key < parseInt(page) * 12) {
    	                          await __assert_prod.push(temp_prod[i]);
                                }
    	                    }
    	                } else {
                            assiggn_prod_list += 1;
                             if (key >= parseInt(page) * 12 - 12   && key < parseInt(page) * 12) {
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
        await createPaginator("#__prod_paginator",assiggn_prod_list,12)
        if (assiggn_prod_list == 0 || __assert_prod.length == 0) {
        	target.html(await getFile(prod_err));
        }


    }

    // call sign create product
    assign_prod();
    //product type 
    const product_shuffle = await getFile(products_mini);
    const template_shuffle = Handlebars.compile(product_shuffle);
    var shufle_target = $("#preview-shuffle-data-get");
    var data = async () => {
        var arr_comp = [];
        await makeRandom(source["data"].length, 4).forEach(async (index) => {
            arr_comp.push(source["data"][index]);
        });
        return await arr_comp;
    }
    shufle_target.append(template_shuffle({
        "data": await data()
    }));
    // shuffle data product list side
    const target_type = $("#__nav_prod_type_list");
    const temp_type = await getFile(products_sorter);
    const temp_data = Handlebars.compile(temp_type);
    target_type.append(temp_data({
        "type": source["type"]
    }));
    // set active binding
    if (!request.get("kayuku_bind")) {
        $(".product-side-nav-list[bind=all]").addClass('active');
    } else {
        $(`.product-side-nav-list[bind=${request.get("kayuku_bind")}]`).addClass('active');
    }

    // call public lazyload 
    createlazy()



    /**
    ** handle properti jquery ui
    **/
    $(".range-slide-money").slider({
        min: 1,
        max:5000,
        range: true,
        values: [1, 5000],
        slide: function(event, ui) {
           var delay  = ()=>{
           	 $(".input-text-range-min").text(ui.values[0]*1000);
           	 $(".input-text-range-max").text(ui.values[1]*1000);
             //page =  1;
           	 assign_prod((ui.values[0]*1000),(ui.values[1]*1000)).then(createlazy)
           }
           setTimeout(delay,100)
        }
    });
})()
/*

 $('.__prod_action_sortener').click(function(event) {
 	event.preventDefault();
 	var searchParams = new URLSearchParams(window.location.search);
    searchParams.set('sorter',$(this).attr('href'))
    console.log(window.location.host+window.location.pathname +"?"+ searchParams.toString())

    window.location.href =  "home.local:8080/products.html?kayuku_bind=lampu&sorter=%3Fsorter%3Dsecond"; 	

 });
 */