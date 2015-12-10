function updateTheme(theme)
{
	if(theme!='')
	{
		$('#theme').attr('href','css/'+theme+'.css');
	}
}

//Load default theme from the below line
$(document).ready(function() {
	
	jQuery.browser = {};
    jQuery.browser.msie = false;
    
    var nAgt = navigator.userAgent;
    
	if ( nAgt.indexOf("MSIE") > -1 ) {
		//alert('IE9');
		$.get('css/IE9theme.css')
	    .done(function() { 
	    	$('#theme').attr('href','css/IE9theme.css');
	    });
		}
	else
		{
	$.get('css/csctheme.css')
    .done(function() { 
    	$('#theme').attr('href','css/csctheme.css');
    });
		}
});



$float_speed=500; //milliseconds
$float_easing="easeOutQuint";
$menu_fade_speed=2500; //milliseconds
$closed_menu_opacity=0.40;

//cache vars
$fl_menu=$("#fl_menu");
$fl_menu_menu=$("#fl_menu .menu");
$fl_menu_label=$("#fl_menu .label");
$fl_delete = $("#deleteElements");

$(window).load(function() {

  menuPosition=150;
  //FloatMenu();
  if($('#sidebar') != undefined){
	  $("#accordion").accordion();
  }
  
});

/*$(window).scroll(function () {
  FloatMenu();
});*/

function FloatMenu(){
	
  var scrollAmount=$(document).scrollTop();
  var newPosition=menuPosition+scrollAmount;

  $("#fl_menu").children().stop().animate({top: newPosition + 'px'}, 500, "easeOutQuint");
     // $fl_delete.stop().animate({top: newPosition + 170}, $float_speed, $float_easing);
 
	
}

/*$("ul#showFSIT > a.dropdown-toggle").click(function(e) {
    e.stopPropagation();
});*/
