
//Updating the font size when clicked on Font Resizer button

function toggleFontSize()
{
	var isUp=true;
	var size=0;
	if($('#divFontResizer').hasClass('resizerFontUp'))
	{
		$('#divFontResizer').attr('class','divFontResizer resizerFontDown'); //To change the Font Up/Down icon
		performResize(isUp);
		
	}else {
		isUp=false;
		$('#divFontResizer').attr('class','divFontResizer resizerFontUp');
		performResize(isUp);
	}
}

//Method created which increases/Decreases the Font/Control Size
function performResize(isUp)
{
	var currFFZoom = 1;
    var currZoom = 100;
    
	if ($.browser.mozilla){
		var step = 0.08;
		if(isUp==true)
		{
	        currFFZoom += step; 
		}else{
			currFFZoom ;
		}
		$('body').css('MozTransform','scale(' + currFFZoom + ')');
    } else {
        var step = 8;
        if(isUp==true)
		{
        	currZoom += step; 
		}else{
			currZoom;
		}
        $('body').css('zoom', ' ' + currZoom + '%');
    }
}