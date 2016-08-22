
// Function written for sliding bars and expanding/collapsing rows

function toggleSidebar(sidebar,status)
{debugger;
	if (status=="show")
	{ //In a condition where status is passed as open with value of sidebar as Right
		if(sidebar=="Right"){
			$('#slider'+sidebar).attr("class","imgSideBarTabClose");
			$("#menuright").collapse(status);
		}else{
			$('#slider'+sidebar).attr("class","imgSideBarTabOpen");
			$("#menuleft").collapse(status);
		}
	}else{
		//In a condition where no status is passed and we just need to switch the image icon to Open/Close 
		if($('#slider'+sidebar).hasClass('imgSideBarTabClose'))
		{
			$('#slider'+sidebar).attr("class","imgSideBarTabOpen");
		}else
		{
			$('#slider'+sidebar).attr("class","imgSideBarTabClose");
		}
	}
}

function toggleExpander(id)
{
	if($('#'+id).hasClass('imgCollapse'))
	{
		$('#'+id).attr("class","imgExpand");
	}else
	{
		$('#'+id).attr("class","imgCollapse");
	}
}

function updateScreenHeight()
{
	if(screenname=='screen')
	{
		var staticdatabarHt = $('.staticdatabar').height();
		var titlebarHt =  $('.titlebar').height();
		var maindivHt = $(".maindiv").height();
		var leftFrameHt = $(".sidebardiv").height();
		if(leftFrameHt>maindivHt)
		{
			$('.innerdiv').height(staticdatabarHt + titlebarHt + leftFrameHt + 100);
		}else{
			$('.innerdiv').height(staticdatabarHt + titlebarHt + maindivHt + 100);
		}
	}
}

$( window ).resize(function() {
	updateScreenHeight();
});