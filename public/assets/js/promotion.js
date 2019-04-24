(async ()=>{
	const page  =  request.get("page") ? request.get("page") : 1;
	const query  = request.get("kayuku_query") ? request.get("kayuku_query")  : "" ;
	$("#query__binding").val(query);
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
		if (__arrscoup.length == 0 ) $("#__promo_data_shuffle").html(await getFile(prod_err));
		createPaginator("#__promotion__pagination",key ,count);
	})//
	createlazy();

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