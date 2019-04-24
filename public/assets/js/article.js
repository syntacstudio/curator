
// /block-continous
//block-share

let last_dep  =  $('.block-share').position().top;

$(window).scroll(function(event) {
	getChareScroll()
});

function getChareScroll() {
	if ($(window).scrollTop() >=   $('.block-continous').offset().top && $('.any-prod-data-assert').offset().top >= $(window).scrollTop()) {
		 $('.block-share').addClass('active');
	} else {
		$('.block-share').removeClass('active');
	}
}


