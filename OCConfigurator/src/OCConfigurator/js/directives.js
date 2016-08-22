'use strict';

/* Directives */
//in progress item
//this directive makes an item draggable (this is working out of the rootScope, need to correct it. 
var isFieldDragged = false;
var draggedIndex;
var draggedObject;
var draggedScope;
var droppedGroup;
var droppedIndex;
var droppedScope;
var unbindSection;
var outDrag;

app.directive('draggable', function($document) {
	  return function(scope, element, attr) {
			$("#fl_menu").css("display", "block");	
			$("#previewmenu").css("display", "block");
			$("#editmenu").css("display", "block");
			$("#redomenu").css("display", "block");
			$("#previewmenu").css("display", "block");
			$("#showJSON").css("display", "block");
			$("#save").css("display", "block");
			$("#jsonEditor").css("display", "block");
			$("#advJsonEditor").css("display", "block");
			$("#showEvents").css("display","block");
			$("#SuccessIcon").css("display", "none");
			$("#ErrorIcon").css("display", "none");
			$("#revision").css("display", "block");
			$("#gridJSONEditor").css("display", "none");
			$("#themeSwitcher").css("display", "block");
			//$("#showFSIT").css("display","block");
			if($('#canvasMainForm') != undefined){				  
				  $("#canvasMainForm").css("height", ($(window).height() - 155));
			  }
			if($('#fieldProperty') != undefined){				  
				  $("#fieldProperty").children().css("height", ($(window).height() - 300));
			  }
				makeDraggable();
				
				if($(element).attr('id') == "subsection"){
					$(element).on('mouseover', function (event) {
						
				        event.stopPropagation();
				        $(this).find('#subSectionDelete').css('display','block');
				        $(this).addClass('show-placeholder');
				    });
					
					$(element).on('mouseout', function (event) {
				        event.stopPropagation();
				        $(this).find('#subSectionDelete').css('display','none');
				        $(this).removeClass('show-placeholder');
				    });
				}
				else if($(element).attr('id') == "field" || $(element).attr('id') == "hfield"){
					
					$(element).on('mouseover', function (event) {
				        event.stopPropagation();
				        $(this).find('#fieldDelete').css('display','block');
				        $(this).addClass('show-placeholder');
				        
				        
				    });
					
					$(element).on('mouseout', function (event) {
						event.stopPropagation();
				        $(this).find('#fieldDelete').css('display','none');
				        $(this).removeClass('show-placeholder');
				    });
				}
				
				
				
								
				element.bind('mouseup', function(event) {
			        
			        event.target.focus();
			     });
				
				
				//Droppable area.
				$( ".droppedFields" ).droppable({
					drop: function( event, ui,scope ) {
							
					if(ui.draggable.attr('id') == "addControl"){
						outDrag.css("overflow", "");
						var newField = { label:'New Field', labelspan: '8', fieldspan: '6', type: 'text',properties:angular.element(this).scope().properties };						
						angular.element(this).scope().subsections.element.push(newField);
						angular.element(this).scope().$apply();
						undoChangesTrack(angular.element(this).scope().m, "Add New Field", angular.element("html").scope());
						$(this.lastElementChild).find('input').click();
					}
					else if(ui.draggable.attr('id') == "addSpacer"){
						outDrag.css("overflow", "");
							var newField = { order: 0, label:'', fieldspan: '6',type:'spacer', properties:[{name:"indicator",value:"add"}] };
							angular.element(this).scope().subsections.element.push(newField);
							angular.element(this).scope().$apply();
							undoChangesTrack(angular.element(this).scope().m, "Add Spacer", angular.element("html").scope());
					}
					else if(ui.draggable.attr('id') == "addControlGroup"){
						outDrag.css("overflow", "");
						var newField = {type:"grouptext", label:"New Field", fieldspan:"6", controlgroup :[{type:"text",size:"3",properties:[{name:"indicator",value:"add"}]},{type:"text",size:"8",properties:[{name:"indicator",value:"add"}]}]};
						angular.element(this).scope().subsections.element.push(newField);
						angular.element(this).scope().$apply();
						undoChangesTrack(angular.element(this).scope().m, "Add Control Group", angular.element("html").scope());
						$(this.lastElementChild).find('label span').click();
					}
					else if(ui.draggable.attr('id') == "addGrid"){
						outDrag.css("overflow", "");
						var newField = { label:'New Grid', fieldspan: '11', type: 'grid', gridId: 'GridTemplate',properties:[{name:"indicator",value:"add"}] };
						angular.element(this).scope().subsections.element.push(newField);
						angular.element(this).scope().$apply();
						undoChangesTrack(angular.element(this).scope().m, "Add Grid", angular.element("html").scope());
						$(this.lastElementChild).find('input').click();
					}
					else if(ui.draggable.attr('id') == "hfield"){
						debugger;
						outDrag.css("overflow", "");
						draggedObject.fieldspan = "6";
						draggedObject.type = "text";
						angular.element(this).scope().subsections.element.push(draggedObject);
						angular.element(this).scope().$apply();
						draggedScope.subsections.element.splice(draggedIndex,1);
						draggedScope.$apply();
						undoChangesTrack(angular.element(this).scope().m, "Drag " + draggedObject.name + " Field", angular.element("html").scope());
						$(this.lastElementChild).find('input').click();
						draggedIndex = null;
				        draggedObject = null;
				        draggedScope = null;
					}
					else if(ui.draggable.attr('id') == "addElement"){
						outDrag.css("overflow", "");
						var newField = { label: ui.draggable.attr('fieldLabel'), labelspan: '8', fieldspan: '6', type: ui.draggable.attr('fieldType'),
						properties:angular.element(this).scope().properties };						
						angular.element(this).scope().subsections.element.push(newField);
						angular.element(this).scope().$apply();
						undoChangesTrack(angular.element(this).scope().m, "Add New Field", angular.element("html").scope());
						$(this.lastElementChild).find('input').click();
					}
					$(".droppedFields").removeClass("ui-state-hover");
			        $(".droppedSubSections").removeClass("ui-state-hover");
			        $(".droppedSections").removeClass("ui-state-hover");
			        $("form").unbind("mousemove");		
					}
				});	

				// Make the droppedFields sortable and connected with other droppedFields containers
				$( ".droppedFields" ).sortable({
												cancel: null, // Cancel the default events on the controls
												containment: 'body',
												scroll: true,
												scrollSensitivity: 100,
												connectWith: ".droppedFields",
												start: function(event, ui){
													
													$("div[id='mainList']").unbind('mouseover mouseout');
													unbindSection = $(ui.item[0]).closest('#subsection');
													unbindSection.unbind('mouseover mouseout');
													//event.stopPropagation();
													$(".droppedSections").removeClass("ui-state-hover");
													$(".droppedSubSections").removeClass("ui-state-hover");
										        	$(".droppedFields").addClass("ui-state-hover");
										        	
										        	isFieldDragged = true;
													draggedIndex = angular.element(ui.item[0]).scope().$index;
													draggedObject = angular.element(ui.item[0]).scope().field;
													draggedScope = angular.element($(ui.item[0]).parent()).scope();
													
													autoScroll();
													
												},
												stop: function(event, ui){
													
													//unbindSection.bind('mouseover mouseout');
													
													$("form").unbind("mousemove");
													$("div[id='mainList']").on('mouseover', function (event) {
														event.stopPropagation();$(this).find('#sectionDeleteArea').css('display','block');$(this).addClass('show-placeholder');
												    });
													
													$("div[id='mainList']").on('mouseout', function (event) {
												        event.stopPropagation();$(this).find('#sectionDeleteArea').css('display','none');$(this).removeClass('show-placeholder');
												    });
													
													
													
													unbindSection.on('mouseover', function (event) {
												        event.stopPropagation(); $(this).find('#subSectionDelete').css('display','block');$(this).addClass('show-placeholder');});
													unbindSection.on('mouseout', function (event) {
												        event.stopPropagation();$(this).find('#subSectionDelete').css('display','none');$(this).removeClass('show-placeholder');});
													
													droppedGroup = angular.element($(ui.item[0]).parent()).scope().subsections;
													droppedIndex = $(ui.item[0]).index();
													droppedScope = angular.element($(ui.item[0]).parent()).scope();
													draggedScope.subsections.element.splice(draggedIndex,1);
													draggedScope.$apply();
													droppedGroup.element.splice(droppedIndex, 0, draggedObject);
													droppedScope.$apply();
													$(".droppedFields").removeClass("ui-state-hover");
											        $(".droppedSubSections").removeClass("ui-state-hover");
											        $(".droppedSections").removeClass("ui-state-hover");
											        undoChangesTrack(droppedScope.m, "Drag " + draggedObject.label + " Field", angular.element("html").scope());
											        draggedIndex = null;
											        draggedObject = null;
											        draggedScope = null;
											        droppedGroup = null;
											        droppedIndex = null;
											        droppedScope = null;
											        
											        isFieldDragged = false;
												}
											}).disableSelection();
			
				
				
				$( ".droppedSubSections" ).droppable({
					revert:true,
					drop: function( event, ui,scope ) {
						
						if(ui.draggable.attr('id') == "addSubSection"){
							outDrag.css("overflow", "");
							var newGroup = {element:[{label:'New Field', fieldspan: '6', type: 'text',properties:[{name:"indicator",value:"add"}]}]};
							angular.element(this).scope().sections.subsection.push(newGroup);
							angular.element(this).scope().$apply();
							undoChangesTrack(angular.element(this).scope().m, "Add Sub-Section", angular.element("html").scope());
							$(this.lastElementChild).find('label span').click();
					        $(this.lastElementChild).find('input').focus();
						}
						
						$(".droppedFields").removeClass("ui-state-hover");
				        $(".droppedSubSections").removeClass("ui-state-hover");
				        $(".droppedSections").removeClass("ui-state-hover");
				        $("form").unbind("mousemove");
				    }
				});
				
				/* Make the droppedFields sortable and connected with other droppedFields containers*/
				$( ".droppedSubSections" ).sortable({
												cancel: null, // Cancel the default events on the controls
												scroll: true,
												containment: "#canvasMainForm",
												scrollSensitivity: 10,
												connectWith: ".droppedSubSections",
												start: function(event, ui){
													$("div[id='mainList']").unbind('mouseover mouseout');
													$(".droppedFields").removeClass("ui-state-hover");
													$(".droppedSections").removeClass("ui-state-hover");
										        	$(".droppedSubSections").addClass("ui-state-hover");
										        	
													draggedIndex = angular.element(ui.item[0]).scope().$index;
													draggedObject = angular.element(ui.item[0]).scope().subsections;
													draggedScope = angular.element(ui.item[0]).scope();
													autoScroll();
												},
												stop: function(event, ui){

													$("form").unbind("mousemove");
															
													$("div[id='mainList']").on('mouseover', function (event) {
														event.stopPropagation();$(this).find('#sectionDeleteArea').css('display','block');$(this).addClass('show-placeholder');
												    });
													
													$("div[id='mainList']").on('mouseout', function (event) {
												        event.stopPropagation();$(this).find('#sectionDeleteArea').css('display','none');$(this).removeClass('show-placeholder');
												    });
													droppedGroup = angular.element($(ui.item[0]).parent()).scope().sections.subsection;
													droppedIndex = $(ui.item[0]).index();
													droppedScope = angular.element($(ui.item[0]).parent()).scope();
													draggedScope.sections.subsection.splice(draggedIndex,1);
													draggedScope.$apply();
													droppedGroup.splice(droppedIndex, 0, draggedObject);
													droppedScope.$apply();
													$(".droppedFields").removeClass("ui-state-hover");
											        $(".droppedSubSections").removeClass("ui-state-hover");
											        $(".droppedSections").removeClass("ui-state-hover");
											        undoChangesTrack(droppedScope.m, "Drag Of Sub-Section", angular.element("html").scope());
											        
											        draggedIndex = null;
											        draggedObject = null;
											        draggedScope = null;
											        droppedGroup = null;
											        droppedIndex = null;
											        droppedScope = null;
											        
											        isFieldDragged = false;
												}
											}).disableSelection();
				
				$( ".droppedSections" ).droppable({
					revert:true,
					drop: function( event, ui,scope ) {
						
						if(ui.draggable.attr('id') == "addSection"){
							outDrag.css("overflow", "");
							var newSection = {sectionsize: '12', subsection:[{element:[{label:'New Field', fieldspan: '6', type: 'text',properties:[{name:"indicator",value:"add"}]}]}]};
							angular.element(this).scope().a.section.push(newSection);
							angular.element(this).scope().$apply();
							undoChangesTrack(angular.element(this).scope().m, "Add Section", angular.element("html").scope());
							$(this.lastElementChild).find('input').focus();
						}
												
						$(".droppedFields").removeClass("ui-state-hover");
				        $(".droppedSubSections").removeClass("ui-state-hover");
				        $(".droppedSections").removeClass("ui-state-hover");
				        
				        
					}
				});
				
				
			
	  };
});



//this is referenced from 'draggable' directive
function makeDraggable() {
	$(".selectorField").draggable({ helper: "clone",stack: "div", cursor: "move", cancel: null,
		scroll: true,
		revert: function(event, ui, scope){
			$("form").unbind("mousemove");
			$(".droppedSubSections").removeClass("ui-state-hover");
			$(".droppedFields").removeClass("ui-state-hover");
			$(".droppedSections").removeClass("ui-state-hover");
			$(".droppedHiddenFields").removeClass("ui-state-hover");
			outDrag.css("overflow", "");
		},
		drag : function(event, ui, scope){
			
			//$("#fieldProperty").hide();
			outDrag = $(this).parents("div");
			outDrag.css("overflow", "visible");
			if($(event.target).attr('id') == "addControl" || $(event.target).attr('id') == "addControlGroup" || $(event.target).attr('id') == "addSpacer" ||$(event.target).attr('id') == "addGrid"){
				$(".droppedFields").addClass("ui-state-hover");
	        	$(".droppedSubSections").removeClass("ui-state-hover");
	        	$(".droppedSections").removeClass("ui-state-hover");
	        	$(".droppedHiddenFields").removeClass("ui-state-hover");
	        	autoScroll();
			}
			else if($(event.target).attr('id') == "addSubSection"){
				$(".droppedFields").removeClass("ui-state-hover");
	        	$(".droppedSubSections").addClass("ui-state-hover");
	        	$(".droppedSections").removeClass("ui-state-hover");
	        	$(".droppedHiddenFields").removeClass("ui-state-hover");
	        	autoScroll();
			}
			else if($(event.target).attr('id') == "addSection"){
				$(".droppedFields").removeClass("ui-state-hover");
	        	$(".droppedSubSections").removeClass("ui-state-hover");
	        	$(".droppedHiddenFields").removeClass("ui-state-hover");
	        	$(".droppedSections").addClass("ui-state-hover");
	        	autoScroll();
	        }
			else if($(event.target).attr('id') == "addHiddenControl"){
				$(".droppedFields").removeClass("ui-state-hover");
	        	$(".droppedSubSections").removeClass("ui-state-hover");
	        	$(".droppedSections").removeClass("ui-state-hover");
	        	$(".droppedHiddenFields").addClass("ui-state-hover");
	        	
	        	angular.element($(".droppedHiddenFields").closest('form')).scope().isCollapsed = false;
	        	angular.element($(".droppedHiddenFields").closest('form')).scope().$apply();
	        	$("#collapseIcon").removeClass('icon-plus');
	        	$("#collapseIcon").addClass('icon-minus');
	        	
	        	$("#canvasMainForm").animate({
	                scrollTop: $("#canvasMainForm").height() + 1000
	            }, 300);
			}
			else if($(event.target).attr('id') == "hfield"){
				
				draggedScope = angular.element($(event.target)).scope();
				draggedObject = angular.element($(event.target)).scope().field;
				draggedIndex = angular.element($(event.target)).scope().$index;
				
				$(".droppedFields").addClass("ui-state-hover");
	        	$(".droppedSubSections").removeClass("ui-state-hover");
	        	$(".droppedSections").removeClass("ui-state-hover");
	        	$(".droppedHiddenFields").removeClass("ui-state-hover");
	        	//$("form").animate({ scrollTop: 0 }, "slow");
	        	autoScroll();
			}
			
		}
	});
	
	
}

//in progress item
//This directive is used to achieve auto suggest function to the attribute text
app.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 0);
                }
            });
    };
});

//make property on pop over
app.directive('properties', function() {
	  return {
	    
	    restrict:['A'],
	       link: function(scope, element, attrs) {
	    	  element.popover({
	    	      placement : 'right', 
	    	      title : '<div style="text-align:center; font-size:14px;">Properties</div>', 
	    	      html: true, 
	    	      content: scope.prop, 
	    	});

	    	  function getContent(control)
	    	  {
	    		  return $(".propertybar").innerHTML;  
	    	  }
	    	
	      }
	  };
	});


//This directive is used to reduce the size of hidden div to make it non draggable.
app.directive('hiddenDisplay', function($timeout) {
    return function(scope, iElement, iAttrs) {
    		
    	iElement.parent().closest('div').css({'display':'none'})
    };
});

//This directive is used to show hidden section at bottom and should be non-draggable.
app.directive('hiddensection', function($timeout) {
    return function(scope, iElement, iAttrs) {
    		
    		iElement.closest('.ui-sortable').addClass('droppedHiddenFields');
    		iElement.closest('.section-hidden').addClass('subsectiondiv');
    		iElement.closest('.section-hidden').find('.titlebox').text("Hidden Fields");
    		iElement.closest('.section-hidden').find('.icon-minus').attr('id',"collapseIcon")
    		iElement.closest('.section-hidden').find('.icon-minus').css('display','block');
    		
    		$(".droppedHiddenFields").droppable({
				revert:true,
				drop: function( event, ui,scope ) {
					
					if(ui.draggable.attr('id') == "addHiddenControl"){
						outDrag.css("overflow", "");
						var newHiddenField = {type: "hidden", required: "false"};
						angular.element(this).scope().subsections.element.push(newHiddenField);
						angular.element(this).scope().$apply();
						undoChangesTrack(angular.element(this).scope().m, "Add Hidden Field", angular.element("html").scope());
						$(this.lastElementChild).find('div').click();
					}
											
					$(".droppedFields").removeClass("ui-state-hover");
			        $(".droppedSubSections").removeClass("ui-state-hover");
			        $(".droppedSections").removeClass("ui-state-hover");
			        $(".droppedHiddenFields").removeClass("ui-state-hover");
			        
				}
			});
    		
    };
});


app.directive('sectionDelete', function($timeout) {
    return function(scope, iElement, iAttrs) {
    		
    		if($(iElement).attr('id') == "mainList"){
				$(iElement).on('mouseover', function (event) {
					
			        event.stopPropagation();
			        $(this).find('#sectionDeleteArea').css('display','block');
			        $(this).addClass('show-placeholder');
			    });
				
				$(iElement).on('mouseout', function (event) {
			        event.stopPropagation();
			        $(this).find('#sectionDeleteArea').css('display','none');
			        $(this).removeClass('show-placeholder');
			    });
			}
			
    };
});


app.directive('saveonexit', function($document) {
	  return function(scope, element, attr) {
		  	$(window).bind("beforeunload", function(){
		  		
		  		var resultsView = {};
		  		$(document).find('form').find('input, textarea, select').each(function() {
		  			resultsView[$(this).attr('id')] = $(this).attr('value');
		  	    });
		  		var str = JSON.stringify(resultsView);
		  		localStorage.setItem("result", str);
		  		//return true;
		  	});
	  };
});



app.directive('hidesection', function($document) {
	  return function(scope, element, attr) {
		  if(angular.element($(element)).scope().subsections.subsectiontitle == "hiddenfields")
			  {
			  $(element).removeClass("subsectiondiv");
			  }
		  	
	  };
});



app.directive('uxvalidate', function() {
	return {
		restrict : 'A',

		link : function(scope, elem, attrs) {

			elem.on('change', function(evt) {
				var field = evt.target;
				validateField(field);
			});
			
		}
	};
});

function autoScroll(){
	$("form").bind("mousemove",function(e){
		  $("form").scrollTop(function(i,v) {
			  var h = $(window).height();
		        var y = e.clientY - h / 2;
		        return v + y * 0.01;
		    });
	  });
}


//override the default input to update on blur
//from http://jsfiddle.net/cn8VF/
app.directive('ngModelOnblur', function() {
 return {
     restrict: 'A',
     require: 'ngModel',
     link: function(scope, elm, attr, ngModelCtrl) {
         if (attr.type === 'radio' || attr.type === 'checkbox') return;
         
         elm.unbind('input').unbind('keydown').unbind('change');
         elm.bind('blur', function() {
             scope.$apply(function() {
                 ngModelCtrl.$setViewValue(elm.val());
             });         
         });
     }
 };
});

app.directive('json', function($compile, $timeout) {
return {
 restrict: 'E',
 scope: {
   child: '=',
   type: '='
 },
 link: function(scope, element, attributes) {
     
     var stringName = "Text";
     var objectName = "Catalog"; // or technically more correct: Map
     var arrayName = "List";
     var refName = "Reference";

     scope.valueTypes = [stringName, objectName, arrayName, refName];

     //////
     // Helper functions
     //////

     var getType = function(obj) {
         var type = Object.prototype.toString.call(obj);
         if (type === "[object Object]") {
             return "Object";
         } else if(type === "[object Array]"){
             return "Array";
         } else {
             return "Literal";
         }
     };
     var isNumber = function(n) {
       return !isNaN(parseFloat(n)) && isFinite(n);
     };
     scope.getType = function(obj) {
         return getType(obj);
     };
     scope.toggleCollapse = function() {
         if (scope.collapsed) {
             scope.collapsed = false;
             scope.chevron = "icon-chevron-down";
         } else {
             scope.collapsed = true;
             scope.chevron = "icon-chevron-right";
         }
     };
     scope.moveKey = function(obj, key, newkey) {
         //moves key to newkey in obj
         obj[newkey] = obj[key];
         delete obj[key];
     };
     scope.deleteKey = function(obj, key) {
         if (getType(obj) == "Object") {
             if( confirm('Delete "'+key+'" and all it contains?') ) {
                 delete obj[key];
             }
         } else if (getType(obj) == "Array") {
             if( confirm('Delete "'+obj[key]+'"?') ) {
                 obj.splice(key, 1);
             }
         } else {
             console.error("object to delete from was " + obj);
         }
     };
     scope.addItem = function(obj) {
         if (getType(obj) == "Object") {
             // check input for key
             if (scope.keyName == undefined || scope.keyName.length == 0){
                 alert("Please fill in a name");
             } else if (scope.keyName.indexOf("$") == 0){
                 alert("The name may not start with $ (the dollar sign)");
             } else if (scope.keyName.indexOf("_") == 0){
                 alert("The name may not start with _ (the underscore)");
             } else {
                 if (obj[scope.keyName]) {
                     if( !confirm('An item with the name "'+scope.keyName
                         +'" exists already. Do you really want to replace it?') ) {
                         return;
                     }
                 }
                 // add item to object
                 switch(scope.valueType) {
                     case stringName: obj[scope.keyName] = scope.valueName ? scope.possibleNumber(scope.valueName) : "";
                                     break;
                     case objectName:  obj[scope.keyName] = {};
                                     break;
                     case arrayName:   obj[scope.keyName] = [];
                                     break;
                     case refName: obj[scope.keyName] = {"Reference!!!!": "todo"};
                                     break;
                 }
                 //clean-up
                 scope.keyName = "";
                 scope.valueName = "";
                 scope.showAddKey = false;
             }
         } else if (getType(obj) == "Array") {
             // add item to array
             switch(scope.valueType) {
                 case stringName: obj.push(scope.valueName ? scope.valueName : "");
                                 break;
                 case objectName:  obj.push({});
                                 break;
                 case arrayName:   obj.push([]);
                                 break;
                 case refName: obj.push({"Reference!!!!": "todo"});
                                 break;
             }
             scope.valueName = "";
             scope.showAddKey = false;
         } else {
             console.error("object to add to was " + obj);
         }
     };
     scope.possibleNumber = function(val) {
         return isNumber(val) ? parseFloat(val) : val;
     };

     //////
     // Template Generation
     //////

     // Note:
     // sometimes having a different ng-model and then saving it on ng-change
     // into the object or array is necesarry for all updates to work
     
     // recursion
     var switchTemplate = 
         '<span ng-switch on="getType(val)" >'
             + '<json ng-switch-when="Object" child="val" type="\'object\'"></json>'
             + '<json ng-switch-when="Array" child="val" type="\'array\'"></json>'
             + '<span ng-switch-default class="jsonLiteral"><input type="text" ng-model="val" '
                 + 'placeholder="Empty" ng-model-onblur ng-change="child[key] = possibleNumber(val)"/>'
             + '</span>'
         + '</span>';
     
     // display either "plus button" or "key-value inputs"
     var addItemTemplate = 
     '<div ng-switch on="showAddKey" class="block" >'
         + '<span ng-switch-when="true">';
             if (scope.type == "object"){
                // input key
                 addItemTemplate += '<input placeholder="Name" type="text" ui-keyup="{\'enter\':\'addItem(child)\'}" '
                     + 'class="input-small addItemKeyInput" ng-model="$parent.keyName" />';
             }
             addItemTemplate += 
             // value type dropdown
             '<select ng-model="$parent.valueType" ng-options="option for option in valueTypes"'
                 + 'ng-init="$parent.valueType=\''+stringName+'\'" ui-keydown="{\'enter\':\'addItem(child)\'}"></select>'
             // input value
             + '<span ng-show="$parent.valueType == \''+stringName+'\'"> : <input type="text" placeholder="Value" '
                 + 'class="input-medium addItemValueInput" ng-model="$parent.valueName" ui-keyup="{\'enter\':\'addItem(child)\'}"/></span> '
             // Add button
             + '<button class="btn btn-default" ng-click="addItem(child)">Add</button> '
             + '<button class="btn btn-default" ng-click="$parent.showAddKey=false">Cancel</button>'
         + '</span>'
         + '<span ng-switch-default>'
             // plus button
             + '<button class="addObjectItemBtn" ng-click="$parent.showAddKey = true"><i class="icon-plus"></i></button>'
         + '</span>'
     + '</div>';
 
     // start template
     if (scope.type == "object"){
         var template = '<i ng-click="toggleCollapse()" ng-class="chevron"'
         + ' ng-init="chevron = \'icon-chevron-down\'"></i>'
         + '<span class="jsonItemDesc">'+objectName+'</span>'
         + '<div class="jsonContents" ng-hide="collapsed">'
             // repeat
             + '<span class="block" ng-hide="key.indexOf(\'_\') == 0" ng-repeat="(key, val) in child">'
                 // object key
                 + '<span class="jsonObjectKey">'
                     + '<input class="keyinput" type="text" ng-model="newkey" ng-init="newkey=key" '
                         + 'ng-change="moveKey(child, key, newkey)"/>'
                     // delete button
                     + '<i class="deleteKeyBtn icon-trash" ng-click="deleteKey(child, key)"></i>'
                 + '</span>'
                 // object value
                 + '<span class="jsonObjectValue">' + switchTemplate + '</span>'
             + '</span>'
             // repeat end
             + addItemTemplate
         + '</div>';
     } else if (scope.type == "array") {
         var template = '<i ng-click="toggleCollapse()" ng-class="chevron" ng-init="chevron = \'icon-chevron-down\'"></i>'
         + '<span class="jsonItemDesc">'+arrayName+'</span>'
         + '<div class="jsonContents" ng-hide="collapsed">'
             + '<ol class="arrayOl" ui-multi-sortable ng-model="child">'
                 // repeat
                 + '<li class="arrayItem" ng-repeat="val in child" ng-init="key=$index">' //key needed in moveKey()
                     // delete button
                     + '<i class="deleteKeyBtn icon-trash" ng-click="deleteKey(child, $index)"></i>'
                     /*+ '<i class="moveArrayItemBtn icon-align-justify"></i>'*/
                     + '<span>' + switchTemplate + '</span>'
                 + '</li>'
                 // repeat end
             + '</ol>'
             + addItemTemplate
         + '</div>';
     } else {
         console.error("scope.type was "+ scope.type);
     }

     var newElement = angular.element(template);
     $compile(newElement)(scope);
     element.replaceWith(newElement); 
 }
};
});

app.directive('hideerror', function() {
	return {
		restrict : 'A',

		link : function(scope, elem, attrs) {

			elem.on('click', function(evt) {
				hideMessage();
				if(evt.target.parentElement.className != "EPContainerDiv" && evt.target.className != "homeIconContainerDiv" && evt.target.className != "iconExpressProcessing" && evt.target.className != "input-medium ui-autocomplete-input" && evt.target.parentElement.className != "ui-menu-item" && evt.target.className != "ui-corner-all")
				$('.ux_bubble_autocomplete.active').removeClass('.ux_bubble_autocomplete active').addClass('.ux_bubble_autocomplete');
			});

		}
	};
});


app.directive('uxCurrency', function($filter) {

	return {

		require : '?ngModel',

		link : function(scope, element, attrs, ngModel) {
			
			ngModel.$parsers.push(function(value) {
				if(value) {
					var startIdx = 0;
					if(value.charAt(0) == attrs.uxCurrency) {
						startIdx = 1;
					}
					return value.substring(startIdx, value.length).replace(/,/g,'');
				}
			});

			ngModel.$formatters.push(function(value) {
				return $filter('currency')(value, attrs['ux-currency'] );
			});
			
		}
	};
});

app.directive('uxDatePicker', function() {

	return {

		require : '?ngModel',

		link : function(scope, element, attrs, ngModel) {
			
			var format = attrs.dateformat;
			var formatTo = "yyyy-mm-dd";

			if (!IsInputTypeSupported('date')) { // Non-HTML5

				formatTo = "mm/dd/yyyy";
				var opts = { showOn : "both", buttonText : '<i class="icoCalender"></i>' };

				element.attr('placeholder', 'mm/dd/yyyy');

				element.datepicker('destroy');
				element.datepicker(opts);

			}

			ngModel.$parsers.push(function(value) {
				var date = formatDate(value, format);
				return date;
			});

			ngModel.$formatters.push(function(value) {
				if(value=="0"){
					ngModel.$modelValue = "";
				}
				var date = formatDate(value, formatTo);
				return date;
			});

			/*function formatDate(dateObj, formatTo) {
				if (dateObj) {
					var date = $.datepicker.formatDate(formatTo, dateObj);
					return date;
				}
			}*/

		}
	};
});

function IsInputTypeSupported(typeName) {

    var input = document.createElement("input");
    // attempt to set the specified type
    input.setAttribute("type", typeName);
    // If the "type" property equals "text" then that input type is not supported by the browser
    var val = (input.type !== "text");
    //delete input;
    return val;
}


function formatDate(date, format) {

	if (date) {
		
		var dd = "", mm = "", yyyy = "", c  = "0";
		var yy1 = "19", yy2 = "";
		
		if (date.indexOf("-") != -1) { // YYYY-MM-DD

			var datePart = date.split("-");
			dd = datePart[2],  mm = datePart[1], yy2 = datePart[0].substring(2, 4);
			
		} else if (date.indexOf("/") != -1) {

			var datePart = date.split("/");

			if (datePart[2].length == 2) { // MM/DD/YY

				yy2 = datePart[2];

				dd = datePart[1] , mm = datePart[0];

			} else { // MM/DD/YYYY
				
				dd = datePart[1], mm = datePart[0], yy2 = datePart[2].substring(2, 4);
			}

		} else if (date.length == 7) { // CYYMMDD
			
			c = date.substring(0, 1);
			yy2 = date.substring(1, 3);


			dd = date.substring(5, 7), mm = date.substring(3, 5);
		}
		
		if (yy2 <= 39) {
			yy1 = "20";
			c = "1";
		}
		yyyy = yy1 + yy2;
		
		if(format == "mm/dd/yyyy") {
			date = mm + '/' + dd + '/' + yyyy; 
		//
		} else if (format == "mm/dd/yy") {
			date = mm + '/' + dd + '/' + yyyy.substring(2, 4);
		//
		} else if (format == "yyyy-mm-dd") {
			date = yyyy + '-' + mm + '-' + dd;
		//
		} else if (format == "yymmdd") {
			date = yyyy.substring(2, 4) + mm + dd;
		//
		} else if (format == "mmddyy") {
			date =  mm + dd + yyyy.substring(2, 4);
		//
		} else { // CYYMMDD
			date = c + yyyy.substring(2, 4) + mm + dd;
		}
		
		return date;
	}
}

