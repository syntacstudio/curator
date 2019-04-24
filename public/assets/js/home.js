jQuery(document).ready(function($) {
    /**
     ** handle carousel baner
     **/
    $('#banner-carousel').slick({
        dots: false,
        infinite: true,
        speed: 700,
        cssEase: 'ease-in-out',
        centerPadding: '0px',
        focusOnSelect: true,
        autoplay: true,
        lazyLoad: 'ondemand',
        prevArrow: $(document).find('.on-prev-banner'),
        nextArrow: $(document).find('.on-next-banner'),
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
    });

    /**
     ** handle carousel promotion
     **/

     //promotion_home


     /**
     ** handeling prmotion template
     **/
     getPromoData({limit:5, shuffle:true}).then(async (result)=>{
        const prmotion_temp  =  await getFile(promotion_home)
        const template_prmom  =  Handlebars.compile(prmotion_temp);
        $("#carousel-promote").html(template_prmom({"data":result}));

        $("#carousel-promote").slick({
            dots: true,
            appendDots: $("#carousel-promote-dot"),
            focusOnSelect: true,
            infinite: true,
            prevArrow: $('.on-prev-promote'),
            nextArrow: $('.on-next-promote'),
            autoplaySpeed: 4000,
            speed: 900,
            autoplay: true,
            mobileFirst: true,
            pauseOnHover: true,
            cssEase: 'ease-in-out',
            slidesToScroll: 1,
            responsive: [{
                breakpoint: 320,
                settings: {
                    centerMode: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }]
        });

        /**
         ** handle casrusel banner on hange 
         ** @param click , change
         **/
        $('#carousel-promote').on("afterChange", function(event) {
            var data = $(document).find('#carousel-promote  .slick-slide.slick-current.slick-active .disc-promote').html();
            $("#promotion-interfaces").html(data);
        });

        if ($(window).width() > 768) {
            $('.paroller').paroller({
                type: 'foreground',
                direction: 'vertical'
            });
        }

     })
    



    

});


/**
 ** handle casrusel banner on hange 
 ** @param click , change
 **/
$('#carousel-banner').on("afterChange", function(event) {
    var image = $(document).find('#carousel-banner .slick-active img').attr('src');
    $("#banner-bg").attr('style', 'background-image:url("' + image + '")')
    $(".banner-card  .clear").fadeOut(400, function() {
        $("#banner-card-desc").text($(document).find('#carousel-banner .slick-slide.slick-current.slick-active .text-title').text())
        $("#banner-desc").text($(document).find('#carousel-banner .slick-slide.slick-current.slick-active .text-desc').text())
        $("#banner-url").text($(document).find('#carousel-banner .slick-slide.slick-current.slick-active .text-url-text').text())
        $("#banner-url").attr('href', $(document).find('#carousel-banner .slick-slide.slick-current.slick-active .text-url').text())
        $(".banner-card  .clear").fadeIn(400, function() {});
    });

});

/* handle banner change image backgrouns */
$(document).on('click', '.select-image-preview-banner', function(event) {
    event.preventDefault();
    var parent = $(this).closest('.banner-parent');
    parent.find('.select-image-preview-banner').removeClass('active');
    var pgr_a = $(this).closest('.banner-parent').find('.preview-full');
    var pgr_b = $(this).closest('.banner-parent').find('.preview-selector-mode img');
    var th = $(this);
    if (parent.attr('data-status') == "side") {
        pgr_a.attr('src', th.data('side'));
        pgr_b.attr('src', th.data('front'));
    } else {
        pgr_a.attr('src', th.data('front'));
        pgr_b.attr('src', th.data('side'));
    }
    parent.attr('data-color', $(this).data('color'));
    $(this).addClass('active');
});

$(document).on('click', '.preview-selector-mode img', function(event) {
    event.preventDefault();
    var parent = $(this).closest('.banner-parent');
    if (parent.attr('data-status') == "side") {
        parent.attr('data-status', "front");
    } else {
        parent.attr('data-status', "side");
    }
    var th = $(this);
    var pgr_a = $(this).closest('.banner-parent').find('.preview-full');
    var pgr_c = pgr_a.attr('src');
    pgr_a.attr('src', th.attr('src'));
    th.attr('src', pgr_c);

});

$(document).ready(async function() {
    const temp_tabulation = `
     {{#each type}}
         <li class="float-left  {{#unless @last}}  pg-r-30 {{/unless}} ">
                <a href="#{{uri}}" class="list-product-nav {{#if @first}} active {{/if}} uppercase" data-target="#__{{uri}}__tabuation" >{{uri}}</a>
        </li>
    {{/each}}`;
    const temp_view_tabulation = `
    {{#each type}}
    <div class="product-list product-page-nav {{#if @first}} active {{/if}}" id="__{{uri}}__tabuation">
    </div>
    {{/each}}`;
    const product_file = await getFile(product_temp);
    const template = Handlebars.compile(product_file);

    const temp_tabulation_render = Handlebars.compile(temp_tabulation);
    const temp_tabulation_property = Handlebars.compile(temp_view_tabulation);
    const all_prod = await getProductData();
    $("#__tabulation_dinamic_menu").html(temp_tabulation_render({
        "type": all_prod["type"]
    }))
    await $("#__tabulation_content").html(temp_tabulation_property({
        "type": all_prod["type"]
    }));
    await all_prod["type"].forEach(async function(element, index) {
        var source = await getProductData(element["uri"], 10);
        var target = document.getElementById(`__${element["uri"]}__tabuation`);
        target.innerHTML = await template({
            "data": source["data"]
        });
    })
    /**
    ** handle article 
    **/
    const articledata  = await  getArticleData({limit:2,shuffle:true});
    //console.log(articledata )
    const article_file  =  await getFile(article_template);
    const compiled_article  = Handlebars.compile(article_file);
    $("#__home_blog").html(compiled_article({"data":articledata}));

     createlazy()
});