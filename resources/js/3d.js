/**
** handle protection protocol 
**/
var  colorlize_body  = getComputedStyle(document.documentElement).getPropertyValue('--body-color');
	 colorlize_body =  colorlize_body.replace("#","0x");

$(".open-3d-tab").parent().click(function(event) {
	$(".open-3d-tab").parent().removeClass('active');
	$(this).addClass('active');
	$(".tab-afvenoor").removeClass('active');
	$($(this).children('button').data('target')).addClass('active');
});


$(".parent-texture input").change(function(event) {
	var elem  =`<div class="af-list float-left">${$(this).closest('.af-parent').children('.af-list').html()}</div>`;
	var parent  = $(this).closest('.parent-texture')
	parent.before(elem.split("active").join("")); 
});

$(".invit-craftment").click(function(event) {
	var def  =  window.location.href.includes("/en/") ? "Invite Craftsmen" : "Undang Pengrajin";
	var un  =  window.location.href.includes("/en/") ? "Cancel" : "Batal";
	if ($(this).attr('get') == "true") {
		$(this).attr('get', 'false');
		$("#counter-event").text(parseInt($("#counter-event").text()) - 1)
		$(this).text(def)
	} else {
		$(this).text(un)
		$(this).attr('get', 'true');
		$("#counter-event").text(parseInt($("#counter-event").text()) + 1)

	}
});