let _act_view_prod_data = "";

$(document).ready(function () {
    const id = request.get("product_id");
    getProductContent(id).then(function (result) {
        var image_temp = "";
        _act_view_prod_data = "";
        var arr_scoup = ["front"];
        document.title = (window.location.href.includes("/en/") ? `Buy ${result["name"]}` : `Beli ${result["name"]}`);
        document.getElementById('_pp_rate').setAttribute("rate", result["rate"]);
        document.getElementById("_pp_name").innerHTML = result["name"];
        document.getElementById("_pp_price_bf").innerHTML = result["price"];
        document.getElementById("_pp_price_af").innerHTML = result["price"] - result["discount"];
        document.getElementById("_pp_product_available").innerHTML = result["stock"];
        document.getElementById("_popup_product_cart").setAttribute("data-id", result["id"]);
        document.getElementById("popup-questity-controler").value = 1;
        result["images"].forEach((data, key) => {
            if (key == 0) {
                var temp_node = "";
                document.getElementById("preview-view-image").setAttribute("src", "assets/images/products/" + data["front"]);
                temp_node = temp_node + '<div class="list mg-l-5 active" data-active="front"><img class="background-white" src="assets/images/products/' + data['front'] + '"></div>';
                arr_scoup.push(data['front']);
                if (data["side"].length > 1) {
                    temp_node = temp_node + '<div class="list mg-l-5" data-active="side"><img class="background-white" src="assets/images/products/' + data['side'] + '"></div>';
                    arr_scoup.push(data['side']);
                }
                document.getElementById("previewer-image-page").innerHTML = temp_node;
            }
            if (data["side"].length > 1) {
                image_temp = image_temp + '<div class="float-left pg-r-10"> <label class="change-color-properties-popup"> <input class="_data_input_check_pp" type="radio" front="' + data["front"] + '"  side="' + data["side"] + '" name="color-desc-module-popup_biew" ' + (key == 0 ? "checked" : "") + '> <span class="canvas  mt" style="background-color:' + data["color"] + '"></span> </label> </div>';
            }
        })
        document.getElementById("_pp_change-color").innerHTML = image_temp;
        _act_view_prod_data = arr_scoup;
    })
});

$(document).on('click', '#previewer-image-page .list', function (event) {
    event.preventDefault();
    var el = $(this);
    var active = el.data('active');
    $("#previewer-image-page .list").removeClass('active');
    $('#preview-view-image').fadeOut('fast', function () {
        el.addClass('active');
        $("#preview-view-image").attr('src', el.find('img').attr('src'));
        $("#preview-view-image").fadeIn('fast');
    });
    _act_view_prod_data.splice(0, 1, active);
});

$(document).on('change', '._data_input_check_pp', function (event) {
    event.preventDefault();
    var tgr = $(document).find('#previewer-image-page');
    var front = $(this).attr('front');
    var side = $(this).attr('side');
    tgr.find('.list[data-active=front] img').attr('src', path_uri + "assets/images/products/" + front);
    tgr.find('.list[data-active=side] img').attr('src', path_uri + "assets/images/products/" + side);
    _act_view_prod_data.splice(1, 1, front);
    _act_view_prod_data.splice(2, 2, side);
    $('#preview-popup-image').fadeOut('fast', function () {
        if (_act_view_prod_data[0] == "front") {
            $("#preview-view-image").attr('src', path_uri + "assets/images/products/" + front);
        } else {
            $("#preview-view-image").attr('src', path_uri + "assets/images/products/" + side);
        }
        $("#preview-view-image").fadeIn('fast');
    });
});

(async () => {
    const product = await getFile(product_temp);
    var source = await getProductData("all", "max");
    const template = Handlebars.compile(product);
    var target = $("#randomize_product_view");
    var data  =  async ()=>{
         var arr_comp = [];
             await makeRandom(source["data"].length, 5).forEach(async (index) => {
                arr_comp.push(source["data"][index]);
              });
        return await arr_comp;
    }
    target.append(template({
        "data": await data()
    })); 

})()