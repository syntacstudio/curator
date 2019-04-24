let readystat  = 1;

var query = request.get('kayuku_query') ? request.get('kayuku_query') : " ";
query = query ? query.split("+") : null;
var page = request.get('page') ? request.get('page') : 1;
var bind = request.get('kayuku_bind');

(async ()=>{
    var source = await getProductData("all", "max");
    // createing filtrator
    const assign_prod = async (min = 1, max = 10000000) => {
        var __assert_prod = [];
        const product_file = await getFile(product_temp);
        const source_prod = await getProductData((bind ? bind : "all"), 8);
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
        }))
          createlazy();
        //console.log(__assert_prod.length)
        //console.log(assiggn_prod_list)
        if (assiggn_prod_list == 0 || __assert_prod.length == 0) {
            $(".is_product").remove();
            //target.html(await getFile(prod_err));
        } else {
            readystat  = 0;
        }


    }

    // call sign create product
    assign_prod();
    
    // this call promotion components


    await getPromoData().then(async (result)=>{
        var __arrscoup  = [];
        var key  = 0;
        var count = 6;
        result.forEach(async (data,item)=>{
            if (data["name"].includes(query) || data["description"].includes(query) ) {
             key +=1;   
              if (key > parseInt(page) * count - count   &&  key <= parseInt(page) * count) {
                     await __arrscoup.push(data);
               }
            }
             
        })
        var temp  =  await getFile(promotion_promo);
        var template  =  Handlebars.compile(temp);
        $("#__promo_data_shuffle").html(template({"data":__arrscoup}));
        if (__arrscoup.length == 0 ) {
             $(".is_prommo").remove();
        } else {    
              readystat  = 0;
        }
    })//
    createlazy();


    await getArticleData().then(async (result)=>{
        var __arrscoup  = [];
        var key  = 0;
        var count = 6;
        result.forEach(async (data,item)=>{
            if (data["name"].includes(query) || data["date"].includes(query) || data["description"].includes(query) ) {
             key +=1;   
              if (key > parseInt(page) * count - count   &&  key <= parseInt(page) * count) {
                     await __arrscoup.push(data);
               }
            }
             
        })
        var temp  =  await getFile(article_template);
        var template  =  Handlebars.compile(temp);
        $("#__article_get_all").html(template({"data":__arrscoup}));
        if(__arrscoup.length == 0) {
                $(".is_article").remove();
        } else {
             readystat  = 0;
        }
    
    })//
    createlazy();

    if (readystat  == 1) {
        $("#main-result").html(await getFile(prod_err));
    } else {
        document.querySelectorAll("*[data-uri]").forEach( function(element, index) {
            var ba  =  element.getAttribute("data-uri");
            element.setAttribute("href", ba+query);
           // console.log(ba+query)
        });
    }

})()

$(document).on('click','.open-popup-promo',async function(event){
    event.preventDefault();
    event.stopPropagation();
    var id  =  $(this).attr('data-id');
    target  =  $($(this).attr('data-target'));
    await getPromoData({id:id}).then(async (result)=>{
        result  =  result[0];
        await $("#__promo_image").attr('src', `${dev_uri.includes("/en/") ? "../":""}assets/images/promotions/${result['image']}`);
        await $("#__promo_title").text(result['name']);
        await $("#__starting").text(result['start']);
        await $("#__ending").text(result['end']);
        await $("#__promo__description").text(result['description']);
        await $("#__promo_code_").text(result['code']);
        await $("#__promo_code").val(result['code']);
        target.addClass('active');

    })  
})