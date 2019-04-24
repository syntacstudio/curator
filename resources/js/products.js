jQuery(document).ready(function($) {

    /**
     ** handle carousel promotion
     **/

});

$(document).on('click', '.selector-view', function(event) {
    event.preventDefault();
    $(".selector-view").removeClass('active');
    if ($(this).data('type') == "gird") {
        $("#selector-gird").addClass('active');
        $("#side-content").removeClass('side-list');
        $("#side-content").addClass('side-gird');

    } else {
        $("#selector-list").addClass('active');
        $("#side-content").addClass('side-list');
        $("#side-content").removeClass('side-gird');
    }

});

$(function() {
    if (request.get("pgam") == "review") {
        $(document).find('.review-me-on').trigger('click');
    }

    doScrol();
    setTimeout(function(args) {
        $("#side-content").addClass('side-gird');
    }, 1000)
    /* slider range */
   
});

/* handle sortener */
$(".sortener-parent .sortener").click(function(event) {
    //event.stopPropagation();
});


$(window).scroll(doScrol);

function doScrol() {
    var tgrs =  $(window).scrollTop();
    if (tgrs > 300) {
        $(".sortener-parent").addClass('active');
    } else {
        $(".sortener-parent").removeClass('active');
    }
}


$(document).on('click', '.remove-me-product-async', function(event) {
    event.preventDefault();
    var el  = $(this).closest('.prod-list');
    el.slideUp('fast',function(){
        el.remove();
    })
});


$(document).on('click', '.remove-list-my-prod', function(event) {
    event.preventDefault();
    var target = $('.remove-product:checked').closest('.prod-list');
    var edl = 0;
    var intrev = setInterval(function(e) {
        $(target[edl]).remove();
        if (edl >= target.length) {
            this.clearInterval();
        }
        edl += 1;
    }, 500)
});
