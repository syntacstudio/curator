"use strict"
const dev_uri = window.location.href;
const path_uri = (window.location.href.includes('/en/') ? "../" : " ");
const path_dir  =  (window.location.href.includes('/en/') ? "en/" : "");
const product_api = path_uri + "storages/data/"+path_dir+"products.json";
const article_api = path_uri + "storages/data/"+path_dir+"article.json";
const promotion_api = path_uri + "storages/data/"+path_dir+"promotion.json";
const chat_api = path_uri + "storages/data/"+path_dir+"chat.json";
const chat_shuffle_api = path_uri + "storages/data/"+path_dir+"chat-shuffle.json";
const product_temp = path_uri + "storages/templates/"+path_dir+"products.hbs";
const product_temp_whistlist = path_uri + "storages/templates/"+path_dir+"products-whistlist.hbs";
const products_mini = path_uri + "storages/templates/"+path_dir+"products_mini.hbs";
const products_sorter = path_uri + "storages/templates/"+path_dir+"product_sorter.hbs";
const paginator_temp = path_uri + "storages/templates/"+path_dir+"paginator.hbs";
const prod_err = path_uri + "storages/templates/"+path_dir+"product_not_found.hbs";
const article_template = path_uri + "storages/templates/"+path_dir+"blog.hbs";
const article_template_whistlist = path_uri + "storages/"+path_dir+"templates/blog-whistlist.hbs";
const article_template_shuffle = path_uri + "storages/templates/"+path_dir+"article_shufles.hbs";
const promotion_promo = path_uri + "storages/templates/"+path_dir+"promotion-promo.hbs";
const promotion_home = path_uri + "storages/templates/"+path_dir+"home_promote.hbs";


let product_data = [];
let promo_data = [];
let article_data = [];
let chat_data = [];
let chat_sfuffle_data = [];
let _act_popup_data = "";
const day_ellapse  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
/**
 ** do main 
 **/
const request = {
   get: function(url) {
        var result = null;
        var tmp = [];
        location.search.substr(1).split("&").forEach(function(item) {
            tmp = item.split("=");
            if (tmp[0] === url) result = decodeURIComponent(tmp[1]);
        });
        return result;
    },
    hastag: function(url) {

    },
    replace: function(url) {
        history.replaceState({}, 'foo', url);
    }
}

/**
 ** storage configurator
 **/
let contact_id = 0;
const storage = {
    set: function(name, value) {
        localStorage.setItem(name, value);
        return "success";
    },
    get: function(name) {
        return localStorage.getItem(name);
    },
    destroy: function(name) {
        localStorage.removeItem(name);
        return "success";
    },
    flush: function() {
        localStorage.clear();
        return "success";
    }
}

/** 
 ** make randomize number
 **/
function makeRandom(max_val, max_length) {
    if (max_length  > max_val)  return false;
    var max_assoc = [];
    while (max_assoc.length < max_length) {
        var rands = Math.floor(Math.random() * max_val);
        if (max_assoc.indexOf(rands) == -1) {
            max_assoc.push(rands);
        }
    }
    return max_assoc;
}

/**
 ** handle get api
 **/
async function getApi(uri) {
    var arr = [];
    await fetch(uri).then(async (result) => {
        arr = await result.json();
    }).catch((e) => {
        console.log(e);
    });
    return await arr;
}

async function getFile(uri) {
    let data = 0;
    await fetch(uri).then(async (result) => {
        data = await result.text();
    }).catch((e) => {
        console.log(e);
    });
    return await data;
}
async function getProductData(type = 'all', limit = 'max') {
    var data_ass = [];
    var arr_state = [];
    let temp = [];
    if (product_data.length === 0) {
        await getApi(product_api).then((result) => {
            result.forEach(async (data, key) => {
                data_ass.push(data);
                if (!doFindUri(arr_state, data["type"])) {
                    arr_state.push({
                        "uri": data['type'],
                        "value": 1
                    });
                } else {
                    for (var i = 0; i < arr_state.length; i++) {
                        if (arr_state[i]["uri"] == data["type"]) {
                            arr_state.splice(i, i + 1, {
                                "uri": arr_state[i]["uri"],
                                "value": arr_state[i]["value"] + 1
                            });
                        }
                    }

                }
            })
        })
        product_data.push({
            "type": arr_state,
            "data": data_ass
        });
    }
    let bind_key = 0;
    await product_data[0]["data"].forEach(async (data, key) => {
        if (type == "all") {
            if (limit == 'max') {
                await temp.push(data);
            } else if (limit != "max") {
                if (parseInt(bind_key) < parseInt(limit)) {
                    bind_key += 1;
                    await temp.push(data);
                }
            }
        } else {
            if (data["type"] == type) {
                if (limit == 'max') {
                    await temp.push(data);
                } else if (limit != "max") {
                    if (parseInt(bind_key) < parseInt(limit)) {
                        bind_key += 1;
                        await temp.push(data);
                    }
                }
            }
        }
        // console.log(bind_key)

    });
    //console.log(product_data)
    return await {
        "type": product_data[0]["type"],
        "data": temp
    };
}
async function getArticleData(param = []) {
    var __new_data = [];
    var limit = (param["limit"] ? param["limit"] : false);
    var id = (param["id"] ? param["id"] : false);
    var shuffle = (param["shuffle"] ? param["shuffle"] : false);
    let item_key = 0;
    var id_filter = [];
    var filtered_id = [];
    var shuffled = [];
    let __asyn__ardate = article_data.length === 0 ? await getApi(article_api) : article_data;
    __asyn__ardate.forEach(async (data, key) => {
        if (id) {
            if (data["id"] == id) {
                return await filtered_id.push(data)
            }
        }
        return await id_filter.push(data);
    })
    if (id) {
        return Promise.resolve(filtered_id);
    }
    if (shuffle) {
        makeRandom(id_filter.length,(limit ? limit : id_filter.length)).forEach(async  function(element, index) {
            return await shuffled.push(id_filter[element]);
        });
        return await  Promise.resolve(shuffled);
    }
    return limit?id_filter.slice(0,limit) : id_filter;
}
async function getChatData(param = []) {
    var __new_data = [];
    var limit = (param["limit"] ? param["limit"] : false);
    var id = (param["id"] ? param["id"] : false);
    let item_key = 0;
    var id_filter = [];
    var filtered_id = [];
    var shuffled = [];
    let __asyn__ardate = article_data.length === 0 ? await getApi(chat_api) : chat_data;
    __asyn__ardate.forEach(async (data, key) => {
        if (id !== false) {
            if (data["id"] === id) {
                return await filtered_id.push(data)
            }
        }
        return await id_filter.push(data);
    })
    if (id !== false) {
        return Promise.resolve(filtered_id);
    }
  
    return limit?id_filter.slice(0,limit) : id_filter;
}

async function getShuffleChat() {
   return  await article_data.length === 0 ? await getApi(chat_shuffle_api) : chat_shuffle_data;
}


async function getPromoData(param = []) {
    var __new_data = [];
    var limit = (param["limit"] ? param["limit"] : false);
    var id = (param["id"] ? param["id"] : false);
    var shuffle = (param["shuffle"] ? param["shuffle"] : false);
    let item_key = 0;
    var id_filter = [];
    var filtered_id = [];
    var shuffled = [];
    let __asyn__ardate = promo_data.length === 0 ? await getApi(promotion_api) : promo_data;
    __asyn__ardate.forEach(async (data, key) => {
        if (id) {
            if (data["id"] == id) {
                return await filtered_id.push(data)
            }
        }
        return await id_filter.push(data);
    })
    if (id) {
        return Promise.resolve(filtered_id);
    }
    if (shuffle) {
        makeRandom(id_filter.length,(limit ? limit : id_filter.length)).forEach(async  function(element, index) {
            return await shuffled.push(id_filter[element]);
        });
        return await  Promise.resolve(shuffled);
    }
    return limit?id_filter.slice(0,limit) : id_filter;
}




async function getProductContent(id) {
    var assert = [];
    await getProductData("all", 'max').then((data) => {
        data["data"].forEach((data, key) => {
            if (data["id"] == id) {
                assert = data;
            }
        })
    })
    return await assert;

}

async function createPaginator(target, length, limit) {
    var file = await getFile(paginator_temp);
    var template = Handlebars.compile(file);
    var __paginate_arr = [];
    for (var i = 0; i < Math.ceil(length / limit); i++) {
        __paginate_arr.push({
            "page": i + 1
        })
    }
    var target = $(target);
    if (length == 0 || length <= limit) {
        target.empty()
        return false;
    }
    target.html(template({
        "page": __paginate_arr
    }));
}
/**
 ** register handlebars helpers
 **/

Handlebars.registerHelper('uppercase', function(string) {
    return string.toUpperCase();
});
Handlebars.registerHelper('grep', function(string) {
    return string.split("-").join(" ");
});
Handlebars.registerHelper('grep-up', function(string) {
    return string.split("-").join(" ").toUpperCase();
});


Handlebars.registerHelper('lowercase', function(arr, limit) {
    return string.toLowerCase();
});

Handlebars.registerHelper('limit', function(data, limit) {
    return data.substring(0,limit);
});

Handlebars.registerHelper('is_index', function(index, target) {
    return index === target;
});

Handlebars.registerHelper('page_uri', function(newuri) {
    var searchParams = new URLSearchParams(window.location.search);
    var uri = searchParams.get("page") ? searchParams.get("page") : 1;
    var end_param = window.location.href.includes("?") != true ? "?" : "&";''
    end_param = end_param + (window.location.href.includes("?") != true ? "page" : "page");
    var new_uri = window.location.href.split(end_param + uri).join("").split(end_param);
    var end_uri  =  window.location.href.split("?page="+uri).join("?kayuku_param=all").split(end_param+"="+uri).join("")+ end_param + "=" + newuri;
    return end_uri;
});


Handlebars.registerHelper('prev_page', function(page) {
    var searchParams = new URLSearchParams(window.location.search);
    var uri = searchParams.get("page") ? searchParams.get("page") : 1;
    var end_param = window.location.href.includes("?") != true ? "?" : "";
    end_param = end_param + (window.location.href.includes("?") != true ? "?page=" : "&page");
    var new_uri = window.location.href.split(end_param + "=" + uri).join("") + end_param + "=" + (parseInt(uri) - 1);
    return new_uri;
});

Handlebars.registerHelper('page_prev_status', function(page) {
    var uri = request.get("page") ? request.get("page") : 1;
    if (uri <= 1) {
        return "disabled";
    }
});

Handlebars.registerHelper('page_indetifier', function(page) {
    var uri = request.get("page") ? request.get("page") : 1;
    if (uri == page) {
        return "disabled";
    }
});

Handlebars.registerHelper('active_page', function(page) {
    var uri = request.get("page") ? request.get("page") : 1;
    if (uri === 1 && page == 1) {
        return "active";
    }
    return uri == page ? "active" : "";
});

Handlebars.registerHelper('page_next_status', function(page) {
    var uri = request.get("page") ? request.get("page") : 1;
    if (uri >= page.length) {
        return "disabled";
    }
});

Handlebars.registerHelper('next_page', function(page) {
    var searchParams = new URLSearchParams(window.location.search);
    var uri = searchParams.get("page") ? searchParams.get("page") : 1;
    var end_param = window.location.href.includes("?") != true ? "?" : "";
    end_param = end_param + (window.location.href.includes("?") != true ? "?page=" : "&page");
    var new_uri = window.location.href.split(end_param + "=" + uri).join("") + end_param + "=" + (parseInt(uri) + 1);
    return new_uri;

});

Handlebars.registerHelper('value_assign', (arr, limit) => {
    var _arrcon = 0;
    for (var i = 0; i < arr.length; i++) {
        _arrcon = _arrcon + arr[i]["value"];
    }
    return (window.location.href.includes('/en/') ? "ALL" : "SEMUA") + `(${_arrcon})`;
});

/**
 ** public static variable 
 **/
const user = [{
    "username": "admin",
    "password": "admin",
    "name": "Administrator"
}, {
    "username": "user",
    "password": "user",
    "name": "Tofik Hidayat"
}, {
    "username": "flipflops",
    "password": "voco2k19",
    "name": "Fliplofs team"

}];
/**
 ** shadow  parentize
 **/

//storage.set('ioauth',JSON.stringify(user));
$(function() {
    var ioauth = (JSON.parse(storage.get('ioauth')) ? JSON.parse(storage.get('ioauth')) : "");
    if (ioauth.length == 0) {
        storage.set('ioauth', JSON.stringify(user));
    }
})

/**
 ** this handle sortener language
 **/

$("*[langue-mode]").click(function(event) {
    event.preventDefault();
    event.stopPropagation();
    var getpath  =  (window.location.pathname.substr(-1) == "/"  ? "/index.html" : (window.location.pathname.substr(-4)== "/en/" ? "/en/index.html" : window.location.pathname ));
    var path = getpath.split("/en/").join(""); 
    var lang = $(this).attr('langue-mode'); 
    var lang_stat  =  window.location.href.includes("/en/") ? "en"  : "id";
    var end_uri =  $("*meta[name=page]").attr('content');
    path =  path.split(end_uri).join(`${lang == "en"  ? "en/" :"/" }`+end_uri);
    if (lang != lang_stat ) {
         return  window.location.href = window.location.protocol+"//"+window.location.host + path + window.location.search;
    }
    return window.location.href  =  window.location.href;
});
/**
 ** create login 
 **/

function doFindArr(target, param) {
    for (var i = 0; i < target.length; i++) {
        if (target[i].name == param) {
            return target[i].value;
        }
    }
}

function doFindObj(target, param) {
    for (var i = 0; i < target.length; i++) {
        if (target[i] == param) {
            return target[i];
        }
    }
}

function doFindUri(target, param) {
    for (var i = 0; i < target.length; i++) {
        if (target[i]["uri"] == param) {
            return target[i];
        }
    }
}

/* handle oncheck*/
$(document).on('click', '*[oncheck]', function(event) {
    if ($(this).prop('checked') == true) {
        $($(this).attr('oncheck')).prop('checked', true);
    } else {
        $($(this).attr('oncheck')).prop('checked', false);
    }
});

function doLogin(dom) {
    var username = doFindArr(dom.serializeArray(), 'username');
    var password = doFindArr(dom.serializeArray(), 'password');
    var ioauth = JSON.parse(storage.get('ioauth'));
    var apera = 0;
    for (var i = 0; i < ioauth.length; i++) {
        if (ioauth[i].username == username && ioauth[i].password == password) {
            apera = ioauth[i];
            break;
        }
    }
    console.log(apera.length)
    console.log(apera)
    if (apera.length == 0 || apera <= 0) {
        dom.find('.validator-component').addClass('fail');
    } else {
        dom.find('.validator-component').removeClass('fail');
        storage.set('auth', JSON.stringify({
            "username": apera['username'],
            "name": apera['name'],
            "password": apera['password']
        }));
        window.location.href = "account.html";
    }

}

/** 
 ** create register 
 **/

function doRegister(dom) {
    var username = doFindArr(dom.serializeArray(), 'email');
    var password = doFindArr(dom.serializeArray(), 'password');
    var name = doFindArr(dom.serializeArray(), 'fname') + " " + doFindArr(dom.serializeArray(), 'lname');
    var ioauth = storage.get('ioauth');
    if (ioauth) {
        ioauth = JSON.parse(ioauth);
    } else {
        ioauth = [];
    }
    ioauth.push({
        "username": username,
        "name": name,
        "password": password
    });
    storage.set('ioauth', JSON.stringify(ioauth));
    storage.set('auth', JSON.stringify({
        "username": username,
        "name": name,
        "password": password
    }));
    window.location.href = "account.html";
}

/***
 ** lgout 
 **/

function logout() {
    storage.destroy('auth');
    window.location.href = window.location.href;
}

/**
 **  validator autentication 
 */
function doAutentication() {
    var auth = storage.get('auth');
    $("body").addClass('autenticated-auth');
    if (auth) {
        auth = JSON.parse(auth);
        $("body").addClass('autenticated-auth');
        $(".auth-user").text(auth['name'])
    } else {
        // $("body").addClass('unautenticated-auth');
    }
}

/**
 ** flex popup
 **/
const defpop = (text, image, title, price) => {
    return `<div class="flex-popup background-white wd-100-p">
                    <div class="popup-content float-left border-box">
                        <div class="pg-10 border-box">
                            <div class="popup-header wd-100-p">
                                <h5 class="font-light color-dark uppercase">${text}</h5> </div>
                            <div class="popup-content-inspace clear pg-y-10 wd-100-p flex">
                                <div class="overflow-hiden flex wd-100-p">
                                    <div class="border border-1 flex overflow-hidden wd-100-p">
                                        <div class="flex-image float-left border-box"> <img src="${dev_uri.includes("/en/") ? "../":""}assets/images/products/${image}" alt=""> </div>
                                        <div class="flex-text float-left border-box pg-l-10">
                                            <h4 class="text-left title font-light color-primary truncates">${title}</h4>
                                            <h4 class="text-left font-bold color-dark">IDR ${price}</h4> </div>
                                    </div>
                                </div>
                            </div>
                            <div class="popup-footer flex justify-content-center "> <a href="cart.html" class="view-cart color-primary text-decoration-none center"><small>VIEW CART</small></a> </div>
                        </div>
                    </div>
                    <div class="popup-close pg-5 float-right border-box">
                        <button class="block pg-x-0 pointer border-0 background-transparent pg-x-0 close-flex"> <img src="assets/images/icons/dark-times.svg" alt=""> </button>
                    </div>
                </div>`;
}

const flexpopup = {
    push: async (id) => {
        flexpopup.flush(id)
    },
    flush: async (id) => {
        var data = await getProductContent(id);
        if ($(".flex-popup-parent > .flex-popup").length > 0) {
            $(".flex-popup-parent > .flex-popup").fadeOut('fast', function() {
                $(".flex-popup-parent > .flex-popup").remove();
                $(".flex-popup-parent").append(defpop);
            })
        } else {
            $(".flex-popup-parent").append(defpop((window.location.href.includes("/en/") ? "added to cart" : "ditambahkan ke keranjang"), data["images"][0]["front"], data["name"], data["price"]));
        }
        setTimeout(function() {
            $(".flex-popup-parent .flex-popup").fadeOut('fast', function() {
                $(".flex-popup-parent .flex-popup").remove();
            })
        }, 50000)
    },
    notif: function(data) {
        var nof = `<div class="flex-popup background-white notif">
                    <div class="popup-content float-left border-box">
                        <div class="pg-10 border-box">
                            <div class="popup-content clear pg-y-5  color-primary font-light">
                                <h4 class="font-light center mg-t-0">${data}</h4> </div>
                        </div>
                    </div>
                    <div class="popup-close pg-5 float-right border-box">
                        <button class="block pg-x-0 pointer border-0 background-transparent pg-x-0 close-flex"> <img src="assets/images/icons/dark-times.svg" alt=""> </button>
                    </div>
                </div>`;
        $(".flex-popup-parent").append(nof)
        setTimeout(function() {
            $(".flex-popup-parent .flex-popup.notif").fadeOut('fast', function() {
                $(".flex-popup-parent .flex-popup.notif").remove();
            })
        }, 2000)
    }
}

/**
 ** this handle trigger event button acive me 
 **/
$(document).on('click', '.trigger-active', function(event) {
    event.preventDefault();
    event.stopPropagation();
    $($(this).data('destroy')).removeClass('active');
    $(this).toggleClass('active');
});

/**
 ** share event
 **/
$(document).on('click', '.share', function(event) {
    event.preventDefault();
    var target = $(this).data('share');
    var url = $("#url-components").val();
    var title = document.title;
    var windowHeight = 350,
        windowWidth = 520,
        alignTop = (screen.height / 2) - (windowHeight / 2),
        alignLeft = (screen.width / 2) - (windowWidth / 2);
    var descr = $('meta[name=description]').attr('content');
    if (target == "facebook") {
        var targeturl = 'https://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url
        window.open(targeturl, "", "top=" + alignTop + ",left=" + alignLeft + ",width=" + windowWidth + ",height=" + windowHeight);
    } else if (target == "twitter") {
        var targeturl = 'https://twitter.com/share?url=' + url;
        window.open(targeturl, "", "top=" + alignTop + ",left=" + alignLeft + ",width=" + windowWidth + ",height=" + windowHeight);
    } else if (target == "url") {
        target = $("#url-components");
        target.val(window.location.href);
        target.select();
        document.execCommand("copy");
        flexpopup.notif(window.location.href.includes("/en/") ? 'URL COPPIED' : 'URL TERSALIN' );
    }
});

/**
 ** handle global resource 
 **/

 $(document).on('click', '.invit-craftment', function(event) {
     event.preventDefault();
      flexpopup.notif(window.location.href.includes("/en/") ? 'CRAFTMENTS WAS INVITED' : 'PENGRAJIN TELAH DI UNDANG' );
 });

/* handle data click to focus an elemtn */
$(document).on('click', '*[data-touch]', function(event) {
    event.preventDefault();
    $(document).find($(this).data('touch')).trigger('click');
});
$(document).on('click', '*[data-focus]', function(event) {
    event.preventDefault();
    $(document).find($(this).data('focus')).trigger('focus');
});

$(".on-focus").focusin(function(event) {
    $(this).parent().addClass('focus');
    // $(this).closest('form').find('input').trigger('focus');
});
$(".on-focus").focusout(function(event) {
    $(this).parent().removeClass('focus');
});

/**
 ** this handle validator
 ** handle form  validator 
 ** @param [json, non null]
 **/
$(document).on('submit', '.form-validator', function(event) {
    event.preventDefault();
    var target = $(this);
    var data = $(this).serializeArray();
    var err = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].value.length < 2) {
            target.find('*[name=' + data[i].name + ']').parent().addClass('fail')
            err += 1;
        } else {
            target.find('*[name=' + data[i].name + ']').parent().removeClass('fail')
        }
    }
    if (err == 0) {
        if ($(this).attr('form-mode') == "login") {
            doLogin($(this));
        } else if ($(this).attr('form-mode') == "register") {
            doRegister($(this));
        } else if ($(this).attr('form-mode') == "loading") {
            $('.popup.active').removeClass('active');
            $('#popup-loading').addClass('active');
            $(this).trigger("reset");
            setTimeout(function() {
                $('.popup.active').removeClass('active');
            }, 500)
        } else if ($(this).attr('form-mode') == "delete") {
            $('.popup.active').removeClass('active');
            $('#popup-loading').addClass('active');
            $('*[target=' + contact_id + ']').closest('.box-oponents').slideUp();
            setTimeout(function() {
                $('.popup.active').removeClass('active');
                contact_id = 0;
            }, 500)
        } else if ($(this).attr('form-mode') == "add-address") {
            var temp = $("#adress-template-user").html().split('<kota>').join(doFindArr(data, 'kota')).split("<provinsi>").join(doFindArr(data, 'provinsi')).split("<pos>").join(doFindArr(data, 'post')).split("<alamat>").join(doFindArr(data, 'alamat')).split("<id>").join(Math.random().toFixed(6).substr(3))

            $('.popup.active').removeClass('active');
            $('#popup-loading').addClass('active');
            setTimeout(function() {
                $('.popup.active').removeClass('active');
                contact_id = 0;
            }, 500)
            $(this).trigger("reset");
            $("#row-contact").prepend(temp);

        } else if ($(this).attr('form-mode') == "payment" || $(this).attr('form-mode') == "redirect") {
            window.location.href = $(this).attr('action');
        }

    }
});

/**
 ** handle scallanble image
 **/
function scalable() {
    $('.scalable').empty();
    $('.scalable')
        .on('mouseover', function() {
            if (window.innerWidth > 767) {
                $(this).children('.scalable-image').css({
                    'transform': 'scale(' + $(this).attr('data-scale') + ')'
                });
            }
        })
        .on('mouseout', function() {
            if (window.innerWidth > 767) {
                $(this).children('.scalable-image').css({
                    'transform': 'scale(1)',
                    'transform-origin': "0% 0%"
                });
            }
            /// console.log("demo")
        })
        .on('mousemove', function(e) {
            if (window.innerWidth > 767) {
                $(this).children('.scalable-image').css({
                    'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 + '%'
                });
            }
        })
        .each(function() {
            $(this)
                .append('<div class="scalable-image"></div>')
                .children('.scalable-image').css({
                    'background-image': 'url(' + $(this).attr('data-image') + ')'
                });
        })

}

/**
 ** handle lazyload
 **/
(async () => {
    /**
     ** handle dinamic navigator
     **/
    const data = await getProductData();
    const target = $(".__nav_auto_get");
    const temp = `
    <li class="dropdown-list overflow-hidden border-dox">
        <a href="products.html?kayuku_bind=all" class="dropdown capital ">${window.location.href.includes("/en/") ? " ALL PRODUCTS" : "SEMUA PRODUK"}</a>
    </li>
    {{#each type}}
        <li class="dropdown-list overflow-hidden border-dox">
            <a href="products.html?kayuku_bind={{uri}}" class="dropdown">{{grep-up uri}}</a>
        </li>    
    {{/each}}`;
    const template = Handlebars.compile(temp);
    target.html(template({
        "type": data["type"]
    }))
    /**
     ** call lazylod methods 
     **/
    createlazy()
    /*
    doAutentication();
    var el = $("meta[name=authenticable]").attr('content');

    if (el == "unauth" && storage.get('auth')) {
        //window.location.href = "cart.html";
    } else if (el == "auth" && !storage.get('auth')) {
        //window.location.href = "login.html";
    }*/
})();

function createlazy() {
    $('img[data-src]').Lazy({
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        visibleOnly: false,
        onError: function(element) {
            console.log('error loading  file ' + element.data('src'));
        }
    });

}

$('.auth-logout').click(logout);

$(".button-tabs").click(function(event) {
    $(".button-tabs").removeClass('active');
    $(this).addClass('active');
    $('.content-tabs').removeClass('active');
    $($(this).data('target')).addClass('active');
});
/**
 ** this handle element comments 
 **/
$(document).on('click', '.preview-me', function(event) {
    event.preventDefault();
    $(document).find('.insub-parent-object').removeClass('active');
    if ($(this).attr('excloud') != "true") {
        $(document).find('.preview-me').attr('excloud', "false");
        $(this).closest('.comment-parent').find('.insub-parent-object').addClass('active');
        $(this).attr('excloud', "true")
    } else {
        $(this).closest('.comment-parent').find('.insub-parent-object').removeClass('active');
        $(this).attr('excloud', "false")
    }
});
/* 
 ** this call ement to click and trgiiter to this parent
 **/
$(document).on('click', '.trigger-before', function(event) {
    event.preventDefault();
    $(this).parent().find('input').trigger('click');
});

/**
 ** open popup finel 
 **/
$(document).on('click', '.open-final-popup', function(event) {
    event.preventDefault();
    var el = $(this);
    el.closest('.popup').find('.popup-node.start').addClass('none');
    el.closest('.popup').find('.popup-node.loading').removeClass('none');
    setTimeout(function() {
        el.closest('.popup').find('.popup-node.loading').addClass('none');
        el.closest('.popup').find('.popup-node.final').removeClass('none');
    }, 1000)
});

/**
 **  check any emenent [radio , ckecbox] using  singgle click element
 **/
$(document).on('change', '*[data-check]', function(event) {
    event.preventDefault();
    var el = $(this);
    var target = $($(this).data('check'));
    if (el.prop('checked') == true) {
        target.prop('checked', true);
    } else {
        target.prop('checked', false);
    }
});
/**
 ** handle removeing whietlist product
 **/
$(document).on('click', '.remove-whist-list', function(event) {
    event.preventDefault();
    var target = $('.remove-whistlist:checked').closest('.list-of-product');
    var edl = 0;
    var intrev = setInterval(function(e) {
        $(target[edl]).hide('slow');
        if (edl >= target.length) {
            this.clearInterval();
        }
        edl += 1;
    }, 500)
});
/**
 ** handle removeing whietlist article
 **/
$(document).on('click', '.remove-me-whist-list', function(event) {
    event.stopPropagation()
    event.preventDefault();
    $(this).closest('.list-of-product').hide();
});

$(document).on('click', '.remove-blog-me', function(event) {
    event.stopPropagation()
    event.preventDefault();
    $(this).closest('.blog-list').remove();
});

$(document).on('click', '.remove-whist-list-blog', function(event) {
    event.preventDefault();
    var target = $('.remove-article:checked').closest('.blog-list');
    var edl = 0;
    var intrev = setInterval(function(e) {
        $(target[edl]).remove();
        if (edl >= target.length) {
            this.clearInterval();
        }
        edl += 1;
    }, 500)
});

/**
 ** handle user change profile piture 
 **/
$("#file-me").change(function(event) {
    var reader = new FileReader();
    reader.onload = function(event) {
        $('#user-change-profile').attr('src', event.target.result);
    }
    reader.readAsDataURL(this.files[0])
});
/* handling global data */
$(".change-image").change(function(event) {
    var reader = new FileReader();
    var el  = $(this);
    reader.onload = function(event) {
        $(el.attr('target')).attr('src', event.target.result);
    }
    reader.readAsDataURL(this.files[0])
});

$(document).on('click', '*[remove-slide]', function(event) {
    event.preventDefault();
    var el = $(this).closest($(this).attr('remove-slide'))
    el.slideUp('fast', function() {
        el.remove();
    })
});

$(document).on('click', '#remove-cart-mode', function(event) {
    event.preventDefault();

    var obj = $(document).find('.cart-data-check:checked');
    var sint = 0;
    setInterval(function() {
        $(obj[sint]).closest('.list').slideUp('fast')
        if (sint == obj.length) {
            this.clearInterval();
        }
        sint += 1;
    }, 400)

});

/*
 ** handle form coupoun
 ** this protection by json
 **/
$(document).on('submit', '#form-coupon', async function(event) {
    event.preventDefault();
    var value = $(this).serializeArray()[0]['value'];
    var emb = 0;
    
    var enc  = await  getPromoData()
    await enc.forEach(async function(data, index) {
        if (value.toLowerCase() ==  data["code"].toLowerCase()) {
             return emb = await  index + 1;
        }
    });
    if (emb > 0) {
        var el_disc = enc[emb - 1]["discount"];
        var f_price = parseInt($("#pricing-f").text().split(".").join("").split(",").join(""));
        var target = $("#pricing");
        var disc = $("#discount");
        target.text(f_price - el_disc);
        disc.text(el_disc.toLocaleString())
        $('#popup-success').addClass('active');
    } else {
        $('#popup-fail').addClass('active');
    }

});
$(document).on('click', '.primary-address', function(event) {
    event.preventDefault();
    $(document).find('.primary-address').removeClass('active');
    $(this).addClass('active');
});

/* handle no change event */
$(document).find('.no-chage').keypress(function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
});

/* append value method */
$(document).on('change', '.append-value', function(event) {
    event.preventDefault();
    $($(this).data('target')).attr('action', $(this).val());
});

/* event rendere file to target by element */

$(".render-file").change(function(event) {
    var reader = new FileReader();
    var target = $(this).data('target');
    reader.onload = function(event) {
        $(target).attr('src', event.target.result);
    }
    reader.readAsDataURL(this.files[0])
});

/* even get element scrolling by id */
$('a.to-scroll').on('click', function(event) {
    var target = $($(this).attr('href'));
    if (target.length) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top
        }, 1000);
    }
});

$(window).scroll(function(event) {
    if ($(this).scrollTop() > 100) {
        $(".to-top-achor").addClass('active');
    } else {
        $(".to-top-achor").removeClass('active');
    }
});

$("#to-top").click(function(event) {
    $('html, body').stop().animate({
        scrollTop: 0
    }, 900);
});

/** 
** handling floating chat 
**/
(async ()=>{

    var protocol  =  window.location.protocol.split(":")[0];
    if (protocol != "http" && protocol != "https"  ) {
        alert("Page Ini Hanya Bisa Di akses Bila Menggunakan protokol http/https , atau minimal dengan localost agar file  yang di panggil dengan xhr bisa di load.");
        return false;
    }


    if (document.querySelectorAll(".floating-chatbox").length == 0 ) {
        return false;
    }
    var d =  new Date();
    const chat_list_temp  = ` 
    {{#each data}}  
        <li class="chat-all-list clear overflow-hidden {{#if byme}} by-me {{/if}}">
        <div class="chat-proto">
            {{#unless image}}
            <p>{{listen}}</p>
            {{/unless}}
            {{#if image}}
                <img src="{{image}}" width="100" class="float-right">
            {{/if}}
          <div class="wd-100-p">
             <small>{{#if date}} {{date}} {{/if}} {{#unless date}} ${day_ellapse[d.getDay()]}.${d.getHours()}.${d.getMinutes() }  {{/unless}} </small>
             </div>
        </div>
    </li>
    {{/each}}`;
    const user_temp  =  `
     {{#each data}}
        <li class="chat-list-opponent pointer  pg-y-10 chat-get pg-x-15" data-target="{{id}}">
           <div class="clear chat-parental">
                <div class="chat-profile">
                        <a href="{{#unless admin}}seller.html?seller-id={{id}}&name={{name}} {{/unless}} {{#if admin}} # {{/if}}" class="relative">
                        <img src="${window.location.href.includes("/en/") ? "../" : ""}assets/images/profiles/{{profile}}" alt="">
                        <span class="user-status {{status}}"></span>
                    </a>
                </div>
                <div class="chat-data">
                    <div class="chat-name wd-100-p">
                        <h3 class="truncates color-dark title font-light chat-name-title">{{name}}</h3>
                        <p class="color-white-dark truncates"><small>{{listen.0.listen}}</small></p>
                    </div>
               </div>
            </div>
        </li>
     {{/each}}`;

    var data  = await getChatData();
    var chatTmp =  Handlebars.compile(user_temp);
    $("#__chat-list-user").html(chatTmp({"data":data}));


    $("#chat-filter").keyup(function(event) {
        var valme = $(this).val();
        if (valme.length > 0) {
            document.querySelectorAll("#__chat-list-user li").forEach( function(element, index) {
                element.classList.add("hide");
                if (element.querySelector(".chat-name-title").textContent.toLowerCase().includes(valme.toLowerCase())) {
                    return element.classList.remove('hide');
                }
            });
        } else {
           $("#__chat-list-user li").removeClass('hide'); 
        }
    });


    $(".form-typing").submit(async function(event) {
        event.preventDefault();
        var text  =  $(this).find('input[type=text]').val();
        if (text.length > 0) {
            $(this).trigger('reset')
           await  chatmake([{"listen":text.split("\n").join(""),"image":false,"byme":true}]);
             var dumy_text  =  await getShuffleChat();
             makeRandom(dumy_text.length,1).forEach(async(result)=>{
                $(".floating-chatbox .typing").removeClass('none');
                await setTimeout(()=>{
                    chatmake([dumy_text[result]])
                    $(".floating-chatbox .typing").addClass('none');
                },1000)
             })
        }

    });

    var chatmake =  async (data  = [])=>{
        var temp_marg =  Handlebars.compile(chat_list_temp);
        await $("#__chat_meta").append(temp_marg({"data":data}))
        setTimeout(()=>{
            $("#__chat_meta").scrollTop($("#__chat_meta").height() ** 2 )
        },100)
    }
    var createChatList =  async (id) =>{
        var data  = await getChatData({id:parseInt(id)});
        $("#__profile_chat_name").text(data[0]["name"]);
        $("#__profile_chat_image").attr('src', path_uri+`assets/images/profiles/${data[0]["profile"]}`);
        $("#pointer-status").attr('stat', data[0]["status"]);
        $("#__chat_meta").empty()
        chatmake(data[0]["listen"]);
    }

    $("#chat_get_upfile").change(async function() {
        var reader = new FileReader();
        reader.onload =async  (event)=>{
                 await  chatmake([{"listen":"","image":event.target.result,"byme":true}]);
                 //console.log(event.target.result)
                     var dumy_text  =  await getShuffleChat();
                     makeRandom(dumy_text.length,1).forEach(async(result)=>{
                        $(".floating-chatbox .typing").removeClass('none');
                        await setTimeout(()=>{
                            chatmake([dumy_text[result]])
                            $(".floating-chatbox .typing").addClass('none');
                        },1000)
                     })
              
        }
        var file  =  reader.readAsDataURL(this.files[0]);
     });


   $(".back-message-pop").click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).closest('.floating-chatbox').find('.chatbox-chat-tab').attr('act',"false");
        $(this).closest('.floating-chatbox').find('.chat-box-chat-list').attr('act',"true");
   
    });

    $(document).on('click', '.chat-list-opponent',async  function(event) {
        event.preventDefault();
        await createChatList($(this).data('target'));
        $(this).closest('.floating-chatbox').find('.chatbox-chat-tab').attr('act',"true");
        $(this).closest('.floating-chatbox').find('.chat-box-chat-list').attr('act',"false");
    });
    $(".floating-chatbox .is_expand:not(.back-message-pop)").click(function(event) {
        $(this).closest('.floating-chatbox').attr('show', 'false');
    });
     $(".floating-chatbox .is_close").click(function(event) {
        $(this).closest('.floating-chatbox').attr('show', 'true');
    });



/**
** handlign
** to user chat seller
**/
$(".button-t-send-seller-message ").click(async (event) => {
    if ($(window).width() > 768) {
        await createChatList(4);
        $('.floating-chatbox').find('.chatbox-chat-tab').attr('act',"true");
        $('.floating-chatbox').find('.chat-box-chat-list').attr('act',"false");
        $('.floating-chatbox').attr('show', 'true'); 
          $(".chat-trigger").attr('stat', 'show');
    } else {
        window.location.href="message.html?kayuku_message_bin=4";
    }
});

$(".chat-fger button").click(function(event) {
   var elem  =  $(this).closest('.chat-trigger');
   if (elem.attr('stat') == "hide") {
        elem.attr('stat', 'show');
        $(".floating-chatbox").attr('show', 'true');

   } else{
        elem.attr('stat', 'hide');
        $(".floating-chatbox").attr('show', 'false');
   }
});




})()


$(document).on('click', '.show-chat', function(event) {
    event.preventDefault();
    $(this).closest('.chat-trigger').attr('stat', 'show');
    $(".floating-chatbox").attr('show', 'true');
});

$(document).on('click', '.close-chat', function(event) {
    event.preventDefault();
    $(this).closest('.chat-trigger').attr('stat', 'hide');
    $(".floating-chatbox").attr('show', 'false');
});

scalable()


$(document).ready(function() {
    var mode  =  window.location.href.includes("/en/") ? "en" : "id";
    if (mode == "en") {
        $(".dropdown-trigger  img.flags").attr('src', "../assets/images/icons/flags/en.svg");
    }
});