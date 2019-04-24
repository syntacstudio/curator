'use strict'

/**
 ** handle dom on ready 
 ** time ellapsed
 **/
$(function(event) {
    scrollHeader();
    activeMode();
})

/**
 ** handle mode actibe page
 **
 **/
function activeMode() {
    var active = $('meta[name=page]').attr('initial');
    if (active) {
        $(document).find('*[pageactive=' + active + ']').addClass('page-active');
        $(document).find('.page-mode-' + active).addClass('page-active');
        $(document).find('.page-mode-' + active).attr('page-side', "true");
    }
}

/**
 ** handle window on scroll event
 ** @event scroll
 **/
$(window).scroll(function(event) {
    scrollHeader()
});

/**
 ** this handle global function 
 ** @range global
 **/

$("a").click(function(event) {
    if ($(this).attr('href') == "#") {
        event.preventDefault();
    }
});

$(".heade-apacher").click(function(event) {
    $('body').removeClass('expand');
});
/**
 ** this handle open popup
 ** @event click
 **/

$(document).on('click', '.open-popup', function(event) {
    event.preventDefault();
    $('.popup').removeClass('active');
    var target = $(this).data('target');

    $(target).addClass('active');
    var contact_id = $(this).attr('target');
    $(target).find('.popup-node.start').removeClass('none');
    $(target).find('.popup-node.loading').addClass('none');
    $(target).find('.popup-node.final').addClass('none');
    if ($(this).attr('interval')) {
        setTimeout(function() {
            $(target).removeClass('active');
        }, parseInt($(this).attr('interval')))
    }
    if ($(this).attr('next')) {
        $($(this).attr('next')).addClass('active');
    }
    if ($(this).data('focus')) {
        $($(this).data('focus')).trigger('focus');
    }
});
$(document).on('click', '.close-popup', function(event) {
    event.preventDefault();
    $(this).closest('.popup').removeClass('active');
    $(document).find('.validator-component').removeClass('final');
});
/* end define swipe*/
/**
 ** this handle if document was clicked 
 ** @event click 
 **/
$(document).find('html').click(function(event) {
    $(".dropdown").removeClass('active');
    $(".dropdown").attr("drop", "false");
    $(".dropdown").removeClass('on-drop');
});

/**
 ** handle dropdown hover  
 ** @event on hover
 **/
$(".dropdown-hover").hover(function() {
    if ($(window).width() > 768) {
        $(this).closest('.dropdown-hover').addClass('active');
    }
}, function() {
    if ($(window).width() > 768) {
        $(this).closest('.dropdown-hover').removeClass('active');
    }

});

/**
 ** handle dropdown click
 ** @event on click
 **/
$(".dropdown-click").click(function(event) {
    event.stopPropagation();
    $(".dropdown").removeClass('active');
    if ($(this).closest('.dropdown').attr("drop") != "true") {
        $(this).closest('.dropdown').addClass('active');
        $(".dropdown").attr("drop", "false");
        $(this).attr("drop", "true");
    } else {
        $(this).closest('.dropdown').removeClass('active');
        $(this).closest('.dropdown').attr("drop", "false");
    }
});

/**
 ** this handle scrolling header event
 ** @event on scroll
 ** @called on dom ready , on window scroll
 **/
function scrollHeader() {
    if ($(window).width() > 768) {
        if ($(window).scrollTop() > 100) {
            $("#header-scroll").addClass('scroll-bottom').removeClass('scroll-top');
            $("#header").addClass('scroll-bottom').removeClass('scroll-top');
            $("#body").addClass('scroll')
        } else {
            $("#header-scroll").addClass('scroll-top').removeClass('scroll-bottom');
            $("#header").addClass('scroll-top').removeClass('scroll-bottom');
            $("body").removeClass('scroll')
        }
    }
}

/**
 ** handle headder button on click
 **  @event on click
 **/

$(".header-trigger").click(function(event) {
    $("body").toggleClass("expand");
});

/* handle banner change object */
$(document).on('click', '.change-banner-data', function(event) {
    event.preventDefault();
    var image = $(this).find('img').attr('src');
    $("#banner-bg").attr('style', 'background-image:url("' + image + '")')
    $("#banner-card-desc").text($(this).find('.text-title').text())
    $("#banner-desc").text($(this).find('.text-desc').text())
    $("#banner-url").text($(this).find('.text-url').text())
    $("#banner-url").attr('href', $(this).find('.text-url-text').text())
});

/**
 ** handle tabs product
 ** @param product
 ** @event click
 **/
$(document).on("click", ".list-product-nav", function(event) {
    event.preventDefault();
    request.replace($(this).attr('href'))
    var target = $(this).data('target');
    $(".list-product-nav").removeClass('active');
    $(this).addClass('active');
    $(".product-page-nav").removeClass('active');
    $(target).addClass('active');
});

/**
 ** this handle disabled click to specifict element
 ** @event click
 **/
$(document).on('click', '.popover-static', function(event) {
    event.preventDefault();
    event.stopPropagation();
});

/**
 ** handle dropdown headder on click
 ** @event onclick 
 ** @target responsive 
 **/
$(".dropdown-menu-onres .dropdown-trigger").click(function(event) {
    if ($(window).width() <= 768) {
        event.stopPropagation();
        event.preventDefault();
        $(".dropdown").removeClass('on-drop');
        if ($(this).parent().attr("drop") != "true") {
            $(this).parent().addClass('on-drop');
            $(".dropdown").attr("drop", "false");
            $(this).parent().attr("drop", "true");
        } else {
            $(this).parent().removeClass('on-drop');
            $(this).parent().attr("drop", "false");
        }
    }
});

$(".dropdown-ultimate-open-cart").click(function(event) {
    event.preventDefault();
    event.stopPropagation()
    //alert("demo")
});

$(document).on('click', '.popup-parent , .close-popup', function(event) {
    event.preventDefault();
    $(this).closest('.popup').removeClass('active');
    $(document).find('.validator-component').removeClass('fail');
});
$(document).on('click', '.popup-content > * , .no-close', function(event) {
    //event.preventDefault();
    event.stopPropagation();
});

$(document).on('click', '.change-quantity', function(event) {
    event.preventDefault();
    var last = $(this).closest('.input-quatity').find('input').val();
    if ($(this).attr('type') == "minus" && last != 1) {
        $(this).closest('.input-quatity').find('input').val(parseInt(last) - 1)
    } else if ($(this).attr('type') == "plus") {
        $(this).closest('.input-quatity').find('input').val(parseInt(last) + 1)
    }
});

$(document).on('click', '.close-flex', function(event) {
    event.preventDefault();
    var obj = $(this).closest('.flex-popup');
    obj.fadeOut('fast', function() {
        obj.remove();
    })
});

$(document).on('click', '.add-to-cart', function(event) {
    event.preventDefault();
    flexpopup.push($(this).attr("data-id"));
});

$(document).on('click', '.remove-content-me', function(event) {
    event.preventDefault();
    $(this).closest('.comment-parent').slideUp(400);
});
$(document).on('click', '.remove-content-me-sub', function(event) {
    event.preventDefault();
    $(this).closest('.comment-parent-list.sub').slideUp(100);
});

$(document).on('submit', '.sub-comment-form', function(event) {
    event.preventDefault();
    var data = $(this).find('textarea').val();
    if (data.length > 0) {
        var object = $('#user-comments').html().split('<content>').join(data);
        var target = $(this).closest('.comment-parent').find('.parent-sub');
        $(this).trigger("reset");
        target.append(object)
    }
});

$(document).on('submit', '#form-comments', function(event) {
    event.preventDefault();
    var data = $(this).find('textarea').val();
    if (data.length > 0) {
        var object = $('#user-full-comment').html().split('<content>').join(data);
        var target = $("#discussion .parent-scrollable");
        $(this).trigger("reset");
        target.prepend(object)
    }
});
$(document).on('submit', '#form-review-product', function(event) {
    event.preventDefault();
    var data = $(this).find('textarea').val();
    if (data.length > 0) {
        var rate = $(document).find('#selector-value-rate').attr('rate');
        var object = $('#user-full-review').html().split('<content>').join(data).split('<rate>').join(rate);
        var target = $("#review .parent-scrollable");
        $(this).trigger("reset");
        //console.log(object)
        target.prepend(object)
    }
});

$(document).on('click', '#selector-value-rate li span', function(event) {
    event.preventDefault();
    $(this).closest('#selector-value-rate').attr('rate', $(this).parent().index() + 1);
});
$('.any-report').change(function(event) {
    if ($(this).prop('checked') == true) {
        $('.clock-content-report-any').slideDown('fast');
    } else {
        $('.clock-content-report-any').slideUp('fast');
    }
});

/**
 ** handle user drop
 **/
$(document).on('click', '.nav-user-side', function(event) {
    event.preventDefault();
    if ($(this).attr('page-side') != "true") {
        $(".nav-user-side").removeClass('page-active');
        $(this).attr('page-side', "true");
        $(this).addClass('page-active');
    } else {
        $(".nav-user-side").removeClass('page-active');
        $(".nav-user-side").attr('page-side', "false");
    }
});

$(".select-courier").change(function(event) {
    $(".price-courier").text($(this).val())
});

$("#donation-selector").change(function(event) {
    if ($(this).val() == "req") {
        $("#donation-num").slideDown(300);
    } else {
        $("#donation-num").slideUp(300);
        $("#donasi-parent").text($(this).val())
    }
});

$("#donation-num").keyup(function(event) {
    $("#donasi-parent").text($(this).val())
});

/**
 ** acordion payment control
 **/
$(".accord-list .accord-trigger").click(function(event) {
    if ($(this).closest('.accord-list').attr('ontrig') != "true") {
        $(".accord-list").removeClass('active');
        $(".accord-list").attr('ontrig', "false");
        $(this).closest('.accord-list').addClass('active');
        $(this).closest('.accord-list').attr('ontrig', 'true');
    } else {
        $(".accord-list").removeClass('active');
        $(".accord-list").attr('ontrig', "false");
    }
});

$(".open-pay-tab").unbind('click').click(function(event) {
    $(".open-pay-tab").removeClass('active');
    $(this).addClass('active');
    $(".tabs-payment-object").addClass('none');
    $($(this).data('target')).removeClass('none');
});

/* handle promotion data */
$(document).on('click','.promotion-interv-data',function(event) {
    event.preventDefault();
    event.stopPropagation();
    var target = $(this).find('input');
    target.select();
    document.execCommand("copy");
    var btn = $(this).find('button');
    btn.text(dev_uri.includes("/en/") ? "Copied" : "Tersalin")
    var oc = dev_uri.includes("/en/") ? "Copy" : "Salin"
    setTimeout(function() {
        btn.text(oc);
    }, 700)
});

/* this handle modul popu product view */
$(document).on('click', '.previewer-image-popup .list', function(event) {
    event.preventDefault();
    var el = $(this);
    var active = el.data('active');
    $(".previewer-image-popup .list").removeClass('active');
    $('.preview-popup-image').fadeOut('fast', function() {
        el.addClass('active');
        $(".preview-popup-image").attr('src', el.find('img').attr('src'));
        $(".preview-popup-image").fadeIn('fast');
    });
    _act_popup_data.splice(0, 1, active);
});
$(document).on('change', '._data_input_check_pop', function(event) {
    event.preventDefault();
    var tgr = $(document).find('.previewer-image-popup');
    var front = $(this).attr('front');
    var side = $(this).attr('side');
    tgr.find('.list[data-active=front] img').attr('src', path_uri + "assets/images/products/" + front);
    tgr.find('.list[data-active=side] img').attr('src', path_uri + "assets/images/products/" + side);
    _act_popup_data.splice(1, 1, front);
    _act_popup_data.splice(2, 2, side);
    $('.preview-popup-image').fadeOut('fast', function() {
        if (_act_popup_data[0] == "front") {
            $(".preview-popup-image").attr('src', path_uri + "assets/images/products/" + front);
        } else {
            $(".preview-popup-image").attr('src', path_uri + "assets/images/products/" + side);
        }
        $(".preview-popup-image").fadeIn('fast');
    });
});

/**
 ** tlhis handle piopup parsing data 
 **/
$(document).on('click', '.open-popup-product', function(event) {
    event.preventDefault();
    event.stopPropagation();

    var target = $(this).data('target');
    if ($(target).hasClass('show-on-mobile-only') == true && $(window).width() > 768) {
        return false;
    }
    $(target).addClass('active');
    var id = parseInt($(this).data("id"));
    getProductContent(id).then(function(result) {
        var image_temp = "";
        _act_popup_data = "";
        var arr_scoup = ["front"];
        document.getElementById('_rate_on_popup').setAttribute("rate", result["rate"]);
        document.getElementById("_popup_product_name").innerHTML = result["name"];
        document.getElementById("_popup_product_price_bd").innerHTML = result["price"];
        document.getElementById("_popup_product_price_ad").innerHTML = result["price"] - result["discount"];
        document.getElementById("_popup_product_available").innerHTML = result["stock"];
        document.getElementById('url-components').value = "product-view.html?id=" + result["id"];
        document.getElementById('_popup_product_uri').setAttribute("href", "product-view.html?product_id=" + result["id"] + "&prod_name=" + result["name"].substring(0, 20));
        document.getElementById("_popup_product_cart").setAttribute("data-id", result["id"]);
        document.getElementById("popup-questity-controler").value = 1;
        result["images"].forEach((data, key) => {
            if (key == 0) {
                var temp_node = "";
                $(".preview-popup-image").attr("src", `${dev_uri.includes("/en/") ? "../":""}assets/images/products/` + data["front"]);
                temp_node = temp_node + `<div class="list mg-l-5 active" data-active="front">
                <img class="background-white" src="${dev_uri.includes("/en/") ? "../":""}assets/images/products/${data['front']}">
                </div>`;

                arr_scoup.push(data['front']);
                if (data["side"].length > 1) {
                    temp_node = temp_node + `<div class="list mg-l-5" data-active="side">
                    <img class="background-white" src="${dev_uri.includes("/en/") ? "../":""}assets/images/products/${data['side']}">
                    </div>`;
                    arr_scoup.push(data['side']);
                }
                $(".previewer-image-popup").html(temp_node);
            }
            if (data["side"].length > 1) {
                image_temp = image_temp + `<div class="float-left pg-r-10">
                <label class="change-color-properties-popup">
                    <input class="_data_input_check_pop" type="radio" front="${ data["front"] }"  side="${data["side"]}" name="color-desc-module-popup-<initialname>" ${(key == 0 ? "checked" : "")} >
                    <span class="canvas  mt" style="background-color:${data["color"] }"></span>
                    </label>
                </div>`;
            }
        }) 
        $("._popup_product_image_list").eq(0).html(image_temp.split("<initialname>").join("async"));
        $("._popup_product_image_list").eq(1).html(image_temp.split("<initialname>").join("previerwer"));
        _act_popup_data = arr_scoup;
    })
});

(async () => {
    var target = $(".dropdown-components-assert-data");
})()