'use strict';

/* Controllers */
function HeaderCtrl($scope) {

}
function FooterCtrl($scope) {

}
function PreviewCtrl($scope, $routeParams, CanvasMetaModel, $browser,
		$rootScope) {
	/*
	 * var CanvasmetaData = CanvasMetaModel.resource($routeParams.screenId);
	 * $scope.m = CanvasmetaData.query();
	 */
	$('#fsitTextDiv').hide();
	$scope.m = window.opener.$windowScope;
	$rootScope.gridMetaData = window.opener.$windowRootScope;

	if ($.parseJSON(localStorage.getItem("result")) != null) {
		$scope.data = $.parseJSON(localStorage.getItem("result"));
	}
	$('#header').removeClass('canvas-header');
	$('#optionalbar').removeClass('canvas-optionbar');
	$('#canvasMainForm').removeClass('canvas-form');
	$('#outerpart').removeClass('canvas-outerdiv');
	$("#themeSwitcher").css("display", "block");
	$("#showFSIT").css("display", "none");
	$browser.notifyWhenNoOutstandingRequests(function() {
		disableFields();
	});

	// auto complete option set up.
	$scope.autoCompleteOption = function(field) {

		$scope.options = [];

		angular.forEach(field.options, function(option, key) {
			$scope.options.push(option.description);
		});

		return $scope.options;
	};
}

function GridDesignCtrl($scope, $routeParams, CanvasMetaModel, $rootScope, $http, $browser, $timeout) {
	$scope.newField;
	$scope.gridColumnColl;
	$rootScope.openModal();
	if ($routeParams.gridId != undefined){
		$scope.gridId = $routeParams.gridId;
	}else{
		$scope.gridId = "GridTemplate";
	}
		
	$http.get($rootScope.listURI.ApplicationURL
					+ $rootScope.listURI.GetGridMetaModelURI.replace('{name}',$scope.gridId))
	.success(
			function(GridJson) {
				$rootScope.gridMetaData = GridJson.gridMetaData;
				$rootScope.gridColumnDefs = GridJson.gridMetaData.element;
				$rootScope.gridTitle = GridJson.gridMetaData.title;
				$rootScope.gridFunction = GridJson.gridMetaData.operation.jsfunction;
				$rootScope.gridColumnDefs.gridName = $scope.gridId;
				$rootScope.listURI.GetMetaModelHistoryURI=	$rootScope.listURI.GetGridMetaModelHistoryURI.replace('{name}',$scope.gridId);
				$rootScope.listURI.GetMetaModelVersionURI=  $rootScope.listURI.GetGridMetaModelVersionURI.replace('{name}',$scope.gridId);
				
				$($(".accordion-group")[0]).css("display", "none");
				$("#showFSIT").css("display", "none");
				$("#previewmenu").css("display", "none");
				$("#editmenu").css("display", "none");
				$("#redomenu").css("display", "none");
				$("#previewmenu").css("display", "none");
				$("#showJSON").css("display", "none");
				$("#save").css("display", "none");
				$("#jsonEditor").css("display", "none");
				$("#advJsonEditor").css("display", "none");
				$("#showEvents").css("display","none");
				$("#SuccessIcon").css("display", "none");
				$("#ErrorIcon").css("display", "none");
				$("#revision").css("display", "block");
				$("#themeSwitcher").css("display", "none");
				$("#saveGrids").css("display", "block");
				$("#gridJSONEditor").css("display", "block");
				
				$rootScope.closeModal();
			});
	
	
	

	$scope.gridOptions = {
		data : 'gridData',
		columnDefs : 'gridColumnDefs',
		showFilter : false,
		displaySelectionCheckbox : false,
		showFooter : true,
		footerTemplate : '<div class="subsectiondiv" style="text-align:left;"><div class="titlebox ">Hidden Columns</div><span ng-repeat="columns in gridColumnDefs" class="{{columns.visible}}gridFooter badge">{{columns.displayName}}</span></div>',
		showColumnMenu : false,
		multiSelect : false,
		jqueryUIDraggable : false,
		enableColumnResize: false,
		enableSorting : false,
		enablePaging: false
	};
	
	$scope.editGridField = function (field, type, control){
		$scope.newField ={};
		$scope.newField.griddata = $rootScope.gridMetaData;
		
		$scope.gridColumnColl = $rootScope.gridColumnDefs;
		
		var columnNumber;
		// $scope.newField.selectedColumn = "FirstColumn";
		
		if (control.target.className.indexOf("ngHeaderText") != -1
				|| control.target.className.indexOf("ngViewport") != -1
				|| control.target.className.indexOf("gridFooter") != -1) {

			if (control.target.className.indexOf("ngHeaderText") != -1) {
				columnNumber = control.target.className.indexOf("colt") + 4;
				$scope.newField.element = $rootScope.gridColumnDefs[control.target.className
						.charAt(columnNumber)];
				$scope.selectedColumn = $rootScope.gridColumnDefs[control.target.className
						.charAt(columnNumber)].displayName;
			} else {
				if (control.target.className.indexOf("gridFooter") != -1) {
					var elm = 0;
					for (elm; elm < $rootScope.gridColumnDefs.length; elm++) {
						var element = $rootScope.gridColumnDefs[elm];
						if (element.displayName == control.target.innerText) {
							break;
						}
					}
					$scope.newField.element = $rootScope.gridColumnDefs[elm];
					$scope.selectedColumn = control.target.innerText;
				} else {
					$scope.newField.element = $rootScope.gridColumnDefs[0];
					$scope.selectedColumn = $rootScope.gridColumnDefs[0].displayName;
				}
			}
			$scope.newField.columnWidth = angular.copy($scope.newField.element.width.replace('%',''));
			$("#newField-grid").val($scope.selectedColumn);

			$('#GroupLevelProperties').hide();
			$('#ViewLevelProperties').hide();
			$('#SectionLevelProperties').hide();
			$('#HiddenFieldProperties,#HiddenFieldAdvanceProperties').hide();
			$('#GroupElementLevelProperties').hide();
			$('#GroupLevelAdvanceProperties').hide();
			$('#ViewLevelAdvanceProperties').hide();
			$('#SubSectionLevelProperties').hide();
			$('#GridLevelProperties').show();
			
			$timeout(function() {
				if ($(".accordion-body")[1].style.height == "0px") {
					$(".accordion-toggle").eq(1).click();
				}
			}, 200);
	 }
	};
	
	$scope.addGridColumn = function() {
		var newGridCol = {
			"field" : "",
			"visible" : true,
			"align" : "center",
			"type" : "text",
			"displayName" : "NewColumn",
			"editable" : "false",
			"width" : "10%"
		};
		$rootScope.gridColumnDefs.push(newGridCol);
	};
	
	$scope.spliceGridColumn = function(colName) {
		var elm = 0;
		for (elm; elm < $rootScope.gridColumnDefs.length; elm++) {
			var element = $rootScope.gridColumnDefs[elm];
			if (element.displayName == colName) {
				break;
			}
		}
		$rootScope.gridColumnDefs.splice(elm, 1);
	};
	
}





// Controller for the main partial, rootScope is injected as this partial needs
function CanvasCtrl($scope, $routeParams, $resource, $http, sharedProperties,
		$rootScope, CanvasMetaModel, $browser, $timeout) {

	$scope.isCollapsed = false;
	$scope.fields = {};
	$rootScope.m = [];
	$scope.newField = {};
	$scope.newSection = {};
	$scope.mainView = {};
	$scope.newField.viewName;
	$('#fsitTextDiv').hide();
	//$('#headerLinks').show();

	// POINT IN specific properties
	$scope.stateclassitem = {};	
	$scope.defaultToG = {};	
	$scope.GroupPrintIndG = {};	
	$scope.stateclasscd = [];
	$rootScope.supportType = '';
	// $rootScope.supportProperties = {};
	$rootScope.foreignPropertyKeys = [];
	$rootScope.pagePromises = [];
	$("#showFSIT").css("display", "block");
	sharedProperties.setProperty(false);
	// for display of the preview menu and other header menus

	// indicator to decide the flow for new metamodel
	$rootScope.AddNew = "false";
	$rootScope.openModal();
	var selectedAttr;
	if ($routeParams.KEY == null) {

		var CanvasmetaData = CanvasMetaModel.resource($routeParams.screenId);
		$scope.m = CanvasmetaData.query();
		$rootScope.metamodel = CanvasmetaData.query();
		$rootScope.m = $scope.m;		 
		if ($routeParams.ElementType != undefined){		
			selectedAttr = $routeParams.ElementType;
		}		
		$scope.fields = $rootScope.m;
		$scope.screenId = $routeParams.screenId;
		$rootScope.setType = selectedAttr;
		$rootScope.screenId = $routeParams.screenId;		
		// $scope.mainView.title = $routeParams.screenId;

		
		if ($routeParams.AddNew != null) {
			$rootScope.AddNew = "true";
			$rootScope.NewName = $routeParams.NewName;
		} else {
			$rootScope.AddNew = "false";
		}
	} else {
		$("#showFSIT").css("display", "block");
		// REST call for getting the metamodel from integration

		var queryObj = {};

		// extract params from query string queryObj[KEY]
		queryObj['location'] = $routeParams.KEY.substring(0, 2);
		queryObj['masterCo'] = $routeParams.KEY.substring(2, 4);
		queryObj['policyCo'] = $routeParams.KEY.substring(4, 6);
		queryObj['state'] = $routeParams.KEY.substring(6, 8);
		queryObj['lineOfBus'] = $routeParams.KEY.substring(8, 11).trim();
		queryObj['insLine'] = $routeParams.KEY.substring(11, 14).trim();
		queryObj['product'] = $routeParams.KEY.substring(14, 20).trim();
		queryObj['coverage'] = $routeParams.KEY.substring(20, 26).trim();
		queryObj['setType'] = $routeParams.setType;
		queryObj['item'] = $routeParams.item;
		selectedAttr = queryObj['setType'];

		$scope.m = $rootScope.m;

		$http(
				{
					method : 'GET',
					url : $rootScope.listURI.ApplicationURL
							+ $rootScope.listURI.RetrieveMetaModelDBServiceURI,
					async : false,
					params : {
						location : queryObj['location'],
						masterCo : queryObj['masterCo'],
						policyCo : queryObj['policyCo'],
						lineOfBus : queryObj['lineOfBus'],
						insLine : queryObj['insLine'],
						state : queryObj['state'],
						product : queryObj['product'],
						coverage : queryObj['coverage'],
						item : queryObj['item'],
						setType : queryObj['setType']
					}
				}).success(function(metadata) {

			$rootScope.m[0] = angular.fromJson(metadata.mmContent).metadata;
			$scope.m[0] = $rootScope.m[0];
			$scope.fields = $rootScope.m[0];
			$scope.mainView.title = $rootScope.m[0].title;
			$scope.mainView.subtitle = $rootScope.m[0].subtitle;
			$rootScope.screenId = metadata.mmName;
			var FormId = $rootScope.m[0].formid;
			if (FormId.indexOf('Template') != -1) {
				$rootScope.AddNew = "true";
				$rootScope.NewName = metadata.mmName;
				$rootScope.m[0].formid = FormId.replace('Template_', '');
			} else {
				$rootScope.AddNew = "false";
			}
		}).error(function(errordata) {

		});

		$rootScope.location = queryObj['location'];
		$rootScope.masterCo = queryObj['masterCo'];
		$rootScope.policyCo = queryObj['policyCo'];
		$rootScope.lineOfBus = queryObj['lineOfBus'];
		$rootScope.insLine = queryObj['insLine'];
		$rootScope.state = queryObj['state'];
		$rootScope.product = queryObj['product'];
		$rootScope.coverage = queryObj['coverage'];
		$rootScope.item = queryObj['item'];
		$rootScope.setType = queryObj['setType'];

	}

	// undoChangesTrack($scope.m); //undo functionality Changes

	$scope.attrs = [];
	$scope.attrsJson = [];
	$scope.screens = [];
	$scope.pages = [];

	if (selectedAttr != undefined && selectedAttr!="undefined") {
		$http.get($rootScope.listURI.ApplicationURL
			+ $rootScope.listURI.GetAttributesFullServiceURI
			+ '/' + selectedAttr + '/json')
			.success(function(data) {
				$scope.attrsJson = data.ShortNameDefinition.ShortNameDefs.ShortNameDef;
			});
	} else {
		$http.get($rootScope.listURI.ApplicationURL
			+ $rootScope.listURI.GetAttributesFullServiceURI
			+ '/' + $rootScope.screenId + '/screen')
		.success(function(data) {
			if (data.ShortNameDef) { $scope.attrsJson = data.ShortNameDef; }
		});
	}

	//Retrieve and store the list of pages
	$http.get($rootScope.listURI.ApplicationURL	+ '/metamodel')
		.success(function(data) {
			$scope.pages = data;
		});
	
	
	$scope.oldDefaultTo = "";
	$scope.editField = function(field, type, control) {
		$rootScope.supportType = '';
		$("#newField-supportType").val('');
		$scope.supportType = '';
		$rootScope.fieldQuery = '';
		var GroupId, FormId;
		GroupId = $rootScope.m[0].groupid;
		FormId = $rootScope.m[0].formid;
		$http
				.get(
						$rootScope.listURI.ApplicationURL + $rootScope.listURI.UpdateSupportMetaDataURI + '/' + GroupId + '/'
								+ FormId)
				.success(
						function(data) {							
							//debugger;
							$rootScope.supportProperties = angular
									.fromJson(data);
							var supportPorpNm = field.name + ".type";
							var supportSQLPropNm = field.name + ".supportinfo";
							$scope.supportType = '';
							if ($rootScope.supportProperties[supportPorpNm] != undefined) {
								if ($rootScope.supportProperties[supportPorpNm] == 'SP') {
									$rootScope.supportType = 'generic';
									$scope.supportType = 'generic';
									$rootScope.queryType = $rootScope.supportProperties[supportPorpNm];
									$("#newField-supportType").val('generic');
								}
								if ($rootScope.supportProperties[supportPorpNm] == 'SQL') {
									$rootScope.supportType = 'query';
									$scope.supportType = 'query';
									$rootScope.queryType = $rootScope.supportProperties[supportPorpNm];
									$("#newField-supportType").val('query');
									if($rootScope.fieldQuery == ''){
									$rootScope.fieldQuery = $rootScope.supportProperties[supportSQLPropNm];
									}
								}
							}
							if ($rootScope.supportProperties[supportSQLPropNm] != undefined) {
								$rootScope.supportType = 'query';
								$scope.supportType = 'query';
								$rootScope.queryType = $rootScope.supportProperties[supportPorpNm];
								$("#newField-supportType").val('query');
								if($rootScope.fieldQuery == ''){
								$rootScope.fieldQuery = $rootScope.supportProperties[supportSQLPropNm];
								}
							}
							if ($rootScope.supportType != "generic"
									&& $rootScope.supportType != "query") {
								$('#editQueryLookup1').css("display", "none");
								$('#editQueryLookup').css("display", "none");
								$rootScope.supportType = '';
								$rootScope.queryType = "other";

							} else {
								$('#editQueryLookup1').css("display", "inline");
								$('#editQueryLookup').css("display", "inline");

							}
						});

		// placeholder class
		$("#SuccessIcon").css("display", "none");
		$("#ErrorIcon").css("display", "none");
		if (field.name != undefined) {
			if (field.name != '') {
				$('#editAttrI1').css("display", "inline");
				$('#editAttrI2').css("display", "inline");
				$('#deleteAttrI1').css("display", "inline");
				$('#deleteAttrI2').css("display", "inline");
			} else {
				$('#editAttrI1').css("display", "none");
				$('#editAttrI2').css("display", "none");
				$('#deleteAttrI1').css("display", "none");
				$('#deleteAttrI2').css("display", "none");
			}
		} else {
			$('#editAttrI1').css("display", "none");
			$('#editAttrI2').css("display", "none");
			$('#deleteAttrI1').css("display", "none");
			$('#deleteAttrI2').css("display", "none");
		}
		sharedProperties.setProperty(true);

		// $scope.$apply();
		if (type != 'page') {
			// $scope.editing = $scope.fields.indexOf(field);
			$scope.newField = {};
			$scope.newField = field;
			$scope.newField.parentField = "Field";
			$scope.old_attr = field.name;
			$scope.label_old = field.label;
			$scope.name_old = field.name;
			$rootScope.supportType = '';
			$scope.stateclassitem = {};	
			$scope.defaultToG = {};	
			$scope.GroupPrintIndG = {};	
			$scope.stateclasscd = [];
			$('#stateclassitemSel').get(0).value = '';
			$('#GroupRqPTGSel').get(0).value='';
		
			 
			$(control.currentTarget).closest("div.control-group").addClass("show-selected-border");
			if($rootScope.prevFieldName != undefined && $rootScope.prevFieldName != field.name){
				$rootScope.prevSelectedField.removeClass("show-selected-border");
			}
			if($rootScope.prevFieldName == undefined && $rootScope.prevSelectedField != undefined){
				$rootScope.prevSelectedField.removeClass("show-selected-border");
			}
			
			$rootScope.prevSelectedField = $(control.currentTarget).closest("div.control-group");
			$rootScope.prevFieldName = field.name;
			
			
			$scope.supportType = '';			
			$scope.GroupRqPTG = '';
	
			
			$rootScope.selectedIndex = angular.element(control.target).scope().$index;
			$rootScope.selectedScope = angular.element(control.target).scope();
			//defaulting of ACL rules with selected elements
			
			$rootScope.accControlElementdata =[];
			if($rootScope.accessControldata.elements){
			for (var accCtr =0; accCtr < $rootScope.accessControldata.elements.length; accCtr++){
				if ($rootScope.accessControldata.elements[accCtr].element == field.name) {				
					$rootScope.accControlElementdata.push($rootScope.accessControldata.elements[accCtr]);				
				}
			}
			}
		
			if (field.help == undefined) {
				$scope.newField.help = "none";
			}
			if ($scope.newField.properties != null
					&& $scope.newField.type != "grouptext") {
				for ( var ctrElemProp = 0; ctrElemProp < $scope.newField.properties.length; ctrElemProp++) {
					var PropName = $scope.newField.properties[ctrElemProp].name;
					var PropValue = $scope.newField.properties[ctrElemProp].value;
					if (PropName == 'USRENTRYFIELD') {						
						$scope.stateclasscd.push(PropValue);						
						$scope.defaultToG = PropValue;
						$('#stclcdtext').val(PropValue);
						$('#stclcd').val(PropValue);
					}
					if (PropName == 'REQUIRED_PT') {						
						$scope.GroupRqPTG = PropValue;
						$('#GroupRqPTGSel').val(PropValue);
					}
					if (PropName == 'SC_CODE') {
						$scope.stateclassitem = PropValue;
						$('#stateclassitemSel').val(PropValue);
					}
					if (PropName == 'PRINTIND') {						
						$scope.GroupPrintIndG = PropValue;
						$('#GroupPrintIndGSel').val(PropValue);
					}
					if (PropName == 'query') {
						$rootScope.supportType = 'query';
						$scope.supportType = 'query';
						$("#newField-supportType").val('query');
						$rootScope.fieldQuery = PropValue;
					}
					if (PropName == 'lookUp') {
						$rootScope.supportType = 'generic';
						$scope.supportType = 'generic';
						$("#newField-supportType").val('generic');
						$rootScope.fieldLookup = PropValue;
					}

				}

				var hasIndicator = false;
				var prop;
				for (prop = 0; prop < $scope.newField.properties.length; prop++) {
					if ($scope.newField.properties[prop].name == "indicator") {
						hasIndicator = true;
						break;
					}
				}
				if (hasIndicator) {
					if ($scope.newField.properties[prop].value != 'add') {
						$scope.newField.properties[prop].value = 'update';
					}
				} else {
					var updArr = {};
					updArr.name = "indicator";
					updArr.value = "update";
					$scope.newField.properties.push(updArr);
				}
			} else {
				if ($scope.newField.type != "grouptext") {
					$scope.newField.properties = [];
					var updArr = {};
					updArr.name = "indicator";
					updArr.value = "update";
					$scope.newField.properties.push(updArr);
				}
			}
			if (type == 'control') {
				if ($scope.newField.type == "grouptext") {
					$scope.newField.controlCount = $scope.newField.controlgroup.length;
				}
				if ($scope.newField.type == "select") {
					if ($scope.newField.options.length > 0){
						$scope.newField.selectedoption = $scope.newField.options[0];
					}
				}

				/*
				 * $("#GroupLevelProperties").closest('div').parent().css({
				 * position:'absolute', zindex: 9999 }).toggle().show();
				 */
				// $('#GroupLevelProperties').show();
				$('#ViewLevelProperties').hide();
				$('#SectionLevelProperties').hide();
				$('#GroupElementLevelProperties').show();
				$('#HiddenFieldProperties,#HiddenFieldAdvanceProperties').hide();
				$('#GroupLevelAdvanceProperties').show();
				$('#ViewLevelAdvanceProperties').hide();
				$('#SubSectionLevelProperties').hide();
				$('#GridLevelProperties').hide();
				// calculatePosition(control, "GroupLevelProperties");

			}
			if (type == 'subfield') {
				$scope.newField.parentField = "SubField";
				$('#GroupLevelProperties').hide();
				$('#ViewLevelProperties').hide();
				$('#SectionLevelProperties').hide();
				$('#HiddenFieldProperties,#HiddenFieldAdvanceProperties').hide();
				$('#GroupElementLevelProperties').show();
				$('#GroupLevelAdvanceProperties').show();
				$('#ViewLevelAdvanceProperties').hide();
				$('#SubSectionLevelProperties').hide();
				$('#GridLevelProperties').hide();
				/*
				 * $("#GroupElementLevelProperties").closest('div').parent().css({
				 * position:'absolute', zindex: 9999 }).toggle().show();
				 * $('#GroupElementLevelProperties').show();
				 * 
				 * calculatePosition(control, "GroupElementLevelProperties");
				 */

			}
			if (type == 'grid') {
				var columnNumber;
				// $scope.newField.selectedColumn = "FirstColumn";
				$scope.newField.griddata = $rootScope.gridMetaData;
				
				$scope.gridColumnColl = $rootScope.gridColumnDefs;
				if (control.target.className.indexOf("ngHeaderText") != -1
						|| control.target.className.indexOf("ngViewport") != -1
						|| control.target.className.indexOf("gridFooter") != -1) {

					if (control.target.className.indexOf("ngHeaderText") != -1) {
						columnNumber = control.target.className.indexOf("colt") + 4;
						$scope.newField.element = $rootScope.gridColumnDefs[control.target.className
								.charAt(columnNumber)];
						$scope.selectedColumn = $rootScope.gridColumnDefs[control.target.className
								.charAt(columnNumber)].displayName;
					} else {
						if (control.target.className.indexOf("gridFooter") != -1) {
							var elm = 0;
							for (elm; elm < $rootScope.gridColumnDefs.length; elm++) {
								var element = $rootScope.gridColumnDefs[elm];
								if (element.displayName == control.target.innerText) {
									break;
								}
							}
							$scope.newField.element = $rootScope.gridColumnDefs[elm];
							$scope.selectedColumn = control.target.innerText;
						} else {
							$scope.newField.element = $rootScope.gridColumnDefs[0];
							$scope.selectedColumn = $rootScope.gridColumnDefs[0].displayName;
						}
					}
					$scope.newField.columnWidth = angular.copy($scope.newField.element.width.replace('%',''));
					$("#newField-grid").val($scope.selectedColumn);

					$('#GroupLevelProperties').hide();
					$('#ViewLevelProperties').hide();
					$('#SectionLevelProperties').hide();
					$('#HiddenFieldProperties,#HiddenFieldAdvanceProperties').hide();
					$('#GroupElementLevelProperties').hide();
					$('#GroupLevelAdvanceProperties').hide();
					$('#ViewLevelAdvanceProperties').hide();
					$('#SubSectionLevelProperties').hide();
					$('#GridLevelProperties').show();
				}
			}
		}

		// Open property window.
		$timeout(function() {
			if ($(".accordion-body")[1].style.height == "0px") {
				$(".accordion-toggle").eq(1).click();
			}
		}, 200);

		// state-class Default to is only visible to 73, 84 setTypes
		if (selectedAttr == '73' || selectedAttr == '84') {
			$('#stateElement').css("display", "block");
			$('#stateGroup').css("display", "block");
			$('#stclcdtextE').css("display", "block");
			$('#stclcdtext').css("display", "block");
			$('#stclcdE').css("display", "none");
			$('#stclcd').css("display", "none");
		} else {
			$('#stateElement').css("display", "none");
			$('#stateGroup').css("display", "none");
			$('#stclcdtextE').css("display", "block");
			$('#stclcdtext').css("display", "block");
			$('#stclcdE').css("display", "none");
			$('#stclcd').css("display", "none");
		}
		//Alert control panel that the page may have changed
		$rootScope.$broadcast("pageChanged", field);
	};

	$scope.addGridColumn = function() {
		var newGridCol = {
			"field" : "",
			"visible" : true,
			"align" : "center",
			"type" : "text",
			"displayName" : "NewColumn",
			"editable" : "false",
			"width" : "10%"
		};
		$rootScope.gridColumnDefs.push(newGridCol);
	};

	$scope.addWidthPercentage = function() {
		angular.forEach($rootScope.gridMetaData.element, function(element){
			if(element.displayName == $scope.newField.element.displayName){
				element.width = $scope.newField.columnWidth + '%';
			}
		});
	};
	
	$scope.spliceGridColumn = function(colName) {
		var elm = 0;
		for (elm; elm < $rootScope.gridColumnDefs.length; elm++) {
			var element = $rootScope.gridColumnDefs[elm];
			if (element.displayName == colName) {
				break;
			}
		}
		$rootScope.gridColumnDefs.splice(elm, 1);
	};

	// retrieve template main view prop
	$http.get('data/mainViewProperties.json').success(function(mainViewData) {
		$scope.mainViewPropData = mainViewData;
		$rootScope.mainViewPropData = mainViewData;
	});

	$scope.hideHelp = function() {
		$(".popover").hide();
	};

	$scope.editMainView = function(field, control) {
		$("#SuccessIcon").css("display", "none");
		$("#ErrorIcon").css("display", "none");
		$scope.mainView = field.a;
		$scope.mainView.title = $scope.m[0].title;
		$scope.mainView.subtitle = $scope.m[0].subtitle;
		$scope.mainView.groupid = $scope.m[0].groupid;
		$scope.mainView.formid = $scope.m[0].formid;
		// build descriptive main view poperties
		$scope.mainViewProp = PropToScreen($scope.m[0].properties,
				$scope.mainViewPropData, $rootScope.setType);

		// $('#GroupLevelProperties').hide();

		/*
		 * $("#ViewLevelProperties").closest('div').parent().css({
		 * position:'absolute', zindex: 9999, top:
		 * $(control.currentTarget).position().top - 30, left: control.pageX
		 * }).toggle().show();
		 */

		$('#ViewLevelProperties').show();
		$('#SectionLevelProperties').hide();
		$('#GroupElementLevelProperties').hide();
		$('#HiddenFieldProperties,#HiddenFieldAdvanceProperties').hide();
		$('#GroupLevelAdvanceProperties').hide();
		$('#SubSectionLevelProperties').hide();
		$('#ViewLevelAdvanceProperties').show();
		$('#GridLevelProperties').hide();
		// $('#arrowDiv').addClass("arrow-left");
		// $('#arrowDiv').removeClass("arrow-right");
		// $('#arrowDiv').css({top: '40px'});
		// Open property window.
		$timeout(function() {
			if ($(".accordion-body")[1].style.height == "0px") {
				$(".accordion-toggle")[1].click();
			}
		}, 200);
	};

	$scope.editSection = function(field, type, control) {
		$("#SuccessIcon").css("display", "none");
		$("#ErrorIcon").css("display", "none");
		if (!sharedProperties.getProperty()) {
			$scope.newSection = field;
			/*
			 * $("#SectionLevelProperties").closest('div').parent().css({
			 * position:'absolute', zindex: 9999, top: control.pageY - 100 ,
			 * left: control.pageX + 40 }).toggle().show();
			 */
			$('#SectionLevelProperties').show();
			$('#ViewLevelProperties').hide();
			$('#GroupElementLevelProperties').hide();
			// $('#GroupLevelProperties').hide();
			$('#HiddenFieldProperties,#HiddenFieldAdvanceProperties').hide();
			$('#GroupLevelAdvanceProperties').hide();
			$('#ViewLevelAdvanceProperties').hide();
			$('#SubSectionLevelProperties').hide();
			$('#GridLevelProperties').hide();

		}
		sharedProperties.setProperty(false);
		// Open property window.
		$timeout(function() {
			if ($(".accordion-body")[1].style.height == "0px") {
				$(".accordion-toggle")[1].click();
			}
		}, 200);
	};

	$scope.editSubSection = function(field, type, control) {
		$("#SuccessIcon").css("display", "none");
		$("#ErrorIcon").css("display", "none");
		if (!sharedProperties.getProperty()) {
			$scope.newSubSection = field;

			$('#SubSectionLevelProperties').show();
			$('#SectionLevelProperties').hide();
			$('#ViewLevelProperties').hide();
			$('#GroupElementLevelProperties').hide();
			$('#HiddenFieldProperties,#HiddenFieldAdvanceProperties').hide();
			$('#GroupLevelAdvanceProperties').hide();
			$('#ViewLevelAdvanceProperties').hide();
			$('#GridLevelProperties').hide();

		}
		sharedProperties.setProperty(true);
		// Open property window.
		$timeout(function() {
			if ($(".accordion-body")[1].style.height == "0px") {
				$(".accordion-toggle")[1].click();
			}
		}, 200);
	};

	$scope.editHiddenField = function(field, type, control) {
		$("#SuccessIcon").css("display", "none");
		$("#ErrorIcon").css("display", "none");
		if (!sharedProperties.getProperty()) {
			$scope.newField = field;

			$('#HiddenFieldProperties,#HiddenFieldAdvanceProperties').show();
			$('#SectionLevelProperties').hide();
			$('#ViewLevelProperties').hide();
			$('#GroupElementLevelProperties').hide();
			$('#GroupLevelProperties').hide();
			$('#GroupLevelAdvanceProperties').hide();
			$('#ViewLevelAdvanceProperties').hide();
			$('#SubSectionLevelProperties').hide();
			$('#GridLevelProperties').hide();

		}
		sharedProperties.setProperty(false);
		// Open property window.
		$timeout(function() {
			if ($(".accordion-body")[1].style.height == "0px") {
				$(".accordion-toggle")[1].click();
			}
		}, 200);
		//Alert control panel that the page may have changed
		$rootScope.$broadcast("pageChanged", field);
	};

	$scope.updatePageProp = function() {
		$("#SuccessIcon").css("display", "none");
		$("#ErrorIcon").css("display", "none");
		$scope.m[0].title = $scope.mainView.title;
		$scope.m[0].subtitle = $scope.mainView.subtitle;
		$scope.m[0].groupid = $scope.mainView.groupid;
		$scope.m[0].formid = $scope.mainView.formid;
		$scope.m[0].properties = ScreenToProp($scope.mainViewProp);
	};

	$scope.splice = function(field, element) {
		element.splice(element.indexOf(field), 1);
	};

	$scope.addOption = function(type) {

		if ($scope.newField.options.length == undefined) {
			$scope.newField.options = [];
		}
		$scope.newField.options.push({
			description : '',
			value : ''
		});
		if(type=='select'){
			$scope.newField.options[$scope.newField.options.length - 1].description = "New Option"; 
			//$scope.newField.selectedoption = $scope.newField.options[$scope.newField.options.length - 1];
		}

	};

	$scope.addAutoCompleteOption = function() {

		if ($scope.newField.options == undefined
				|| $scope.newField.options.length == undefined) {
			$scope.newField.options = [];
		}
		$scope.newField.options.push({
			'description' : ''
		});

	};

	$scope.tokenize = function(slug1, slug2) {
		var result = slug1;
		result = result.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
		result = result.replace(/-/gi, "_");
		result = result.replace(/\s/gi, "-");
		if (slug2) {
			result += '-' + $scope.token(slug2);
		}
		return result;
	};
	$scope.typeSwitch = function(type) {
		var theTypes = [ 'checkboxes', 'radio' ];
		if (theTypes.indexOf(type) === -1) {
			return type;
		}
		return 'multiple';
	};
	
	
	$scope.sliderDrag = function(event, ui) {
		if(ui.value >=0 && ui.value <=9){
			ui.handle.innerHTML = "<span style='padding-left:5px;'>" + ui.value + "</span>";
		}else{
			ui.handle.innerHTML = "<span>" + ui.value + "</span>";
		}
	};
	
	$scope.makeGroupMandatory = function(field) {
		if(field.type == "grouptext" && field.required == "required"){
			for (var curr=0; curr<= (field.controlgroup.length -1); curr++){
				field.controlgroup[curr].required = "required";
			}
		}
		else if(field.type == "grouptext" && field.required == "false"){
			for (var curr=0; curr<= (field.controlgroup.length -1); curr++){
				field.controlgroup[curr].required = "false";
			}
		}
	};
	
	
	$scope.log = function(theVar) {
		console.log(theVar);
	};

	$scope.updateLabel = function(field) {
		if (field.properties != null) {
			var fieldPropertyArray = field.properties;
			var prop = "label_old";
			delete fieldPropertyArray[prop];
			var newLabelarr = {};
			newLabelarr.name = "label_old";
			newLabelarr.value = field.label;
			field.properties.push(newLabelarr);
		}
	};

	$scope.updateGroupControl = function(updateField, control) {

		var addControl;
		if (updateField.controlCount != "" && updateField.controlCount >= 2) {
			if (updateField.controlCount > updateField.controlgroup.length) {
				for ( var i = updateField.controlgroup.length; i < updateField.controlCount; i++) {
					addControl = {
						type : "text",
						size : "4"
					};
					updateField.controlgroup.push(addControl);
				}
			} else if (updateField.controlCount < updateField.controlgroup.length) {
				for ( var i = updateField.controlgroup.length - 1; i >= updateField.controlCount; i--) {
					updateField.controlgroup.splice(i, 1);
				}
			}
		}
	};

	$scope.deleteField = function(control) {
		
		sharedProperties.setProperty(true);
		var deleteScope = angular.element(
				$(control.currentTarget).closest('#field')).scope();
		var deleteIndex = angular.element(
				$(control.currentTarget).closest('#field')).scope().$index;
		
		var fieldName;
		
		if (deleteScope.field.label == "New Field")
			fieldName = "Delete " + deleteScope.field.label;
		else
			fieldName = "Delete " + deleteScope.field.label + " Field";
		
		deleteScope.$parent.subsections.element[deleteIndex].indicator = 'delete';
		deleteScope.$parent.subsections.element.splice(deleteIndex, 1);
		//deleteScope.$apply();
		undoChangesTrack(deleteScope.m, fieldName, $rootScope);
		//Alert control panel that the page may have changed
		$rootScope.$broadcast("pageChanged", field);

	};

	$scope.deleteHiddenField = function(control) {
		sharedProperties.setProperty(true);
		var deleteScope = angular.element($(control.currentTarget)).scope();
		var deleteIndex = angular.element($(control.currentTarget)).scope().$index;
		var fieldName = "Delete " + deleteScope.field.name + " Field";
		
		deleteScope.$parent.$parent.subsections.element[deleteIndex].indicator = 'delete';
		deleteScope.$parent.$parent.subsections.element.splice(deleteIndex, 1);
		//deleteScope.$apply();
		undoChangesTrack(deleteScope.m, fieldName, $rootScope);

	};

	$scope.deleteSubSection = function(control) {

		sharedProperties.setProperty(true);
		var deleteScope = angular.element(
				$(control.currentTarget).closest('#subsection')).scope();
		var deleteIndex = angular.element(
				$(control.currentTarget).closest('#subsection')).scope().$index;
		var fieldName = "Delete Sub-Section";
		
		deleteScope.$parent.sections.subsection.splice(deleteIndex, 1);
		deleteScope.$parent.sections.subsection[deleteIndex].indicator = 'delete';
		//deleteScope.$apply();
		undoChangesTrack(deleteScope.m, fieldName, $rootScope);
	};

	$scope.deleteSectionArea = function(control) {

		sharedProperties.setProperty(true);
		var deleteScope = angular.element(
				$(control.currentTarget).closest('#mainList')).scope();
		var deleteIndex = angular.element(
				$(control.currentTarget).closest('#mainList')).scope().$index;
		var fieldName = "Delete Section";
		
		deleteScope.$parent.a.section.splice(deleteIndex, 1);
		//deleteScope.$apply();
		undoChangesTrack(deleteScope.m, fieldName, $rootScope);
	};

	$scope.collapseHiddenArea = function(control) {
		$scope.isCollapsed = !$scope.isCollapsed;
		if ($scope.isCollapsed) {
			$('#collapseIcon').removeClass('icon-minus');
			$('#collapseIcon').addClass('icon-plus');
		} else {
			$('#collapseIcon').removeClass('icon-plus');
			$('#collapseIcon').addClass('icon-minus');
		}

	};

	// for adding a new attr
	$scope.addNewAttr = function(addOrEdit, ctrl) {
		window.open("#/newAttr/" + $rootScope.screenId + "/"
				+ $rootScope.setType + "?addOrEdit=" + addOrEdit + "&attrName="
				+ ctrl.name);
	};

	// updates the element properties from Attribute Json
	$scope.old_attr;
	$scope.label_old;
	$scope.name_old;
	$scope.datatype_old;
	$scope.UpdateElementProp = function(ctrl) {
		var oldAttrValue = $scope.old_attr;
		var newAttrValue = ctrl.name;
		var attrsArray = $scope.attrsJson;
		if (ctrl.name == '' || ctrl.name.length == 1) {
			return;
		}
		if (newAttrValue != '' && oldAttrValue != newAttrValue) {
			var newAttrFound = false;
			// search new prop
			for ( var attrCounter = 0; attrCounter < attrsArray.length; attrCounter++) {
				if (attrsArray[attrCounter].ShortName == newAttrValue) {
					newAttrFound = true;
					var dataTypeVal = attrsArray[attrCounter].dataType;
					switch (dataTypeVal) {
					case "D":
						ctrl.type = "date";
						break;
					case "F":
					case "N":
					case "P":
						ctrl.type = "number";
						break;
					case "T":
					case "V":
						ctrl.type = "text";
						break;
					}
					var updNewPositionArr = {};
					var updNewDatatypeArr = {};
					var updNewLengthArr = {};
					var updNewOffsetArr = {};
					var updINDDArr = {};
					var updERRCDArr = {};
					updNewPositionArr.name = "position";
					updNewPositionArr.value = attrsArray[attrCounter].decimalPositions;
					updNewDatatypeArr.name = "datatype";
					updNewDatatypeArr.value = attrsArray[attrCounter].dataType;
					updNewLengthArr.name = "reclength";
					updNewLengthArr.value = attrsArray[attrCounter].length;
					updNewOffsetArr.name = "offset";
					updNewOffsetArr.value = attrsArray[attrCounter].offset;
					updINDDArr.name = "INDD";
					updINDDArr.value = "";
					updERRCDArr.name = "ERRORCD";
					updERRCDArr.value = "";
					// push the new properties from the Attributes json
					for ( var delprop = ctrl.properties.length - 1; delprop >= 0; delprop--) {
						if (ctrl.properties[delprop].name == "offset"
								|| ctrl.properties[delprop].name == "position"
								|| ctrl.properties[delprop].name == "datatype"
								|| ctrl.properties[delprop].name == "reclength"
								|| ctrl.properties[delprop].name == "INDD"
								|| ctrl.properties[delprop].name == "ERRORCD") {
							ctrl.properties.splice(delprop, 1);
						}
					}
					ctrl.properties.push(updNewPositionArr);
					ctrl.properties.push(updNewDatatypeArr);
					ctrl.properties.push(updNewLengthArr);
					ctrl.properties.push(updNewOffsetArr);
					ctrl.properties.push(updINDDArr);
					ctrl.properties.push(updERRCDArr);
					break;
				}
			}
			;

			// no further processing required in no new match found in attrs
			if (!newAttrFound)
				return;

			// search old prop
			for ( var attrCounter = 0; attrCounter < attrsArray.length; attrCounter++) {
				if (attrsArray[attrCounter].ShortName == oldAttrValue) {
					var updOldLabelArr = {};
					var updOldNameArr = {};
					var updOldDataTypeArr = {};
					updOldLabelArr.name = "label_old";
					updOldLabelArr.value = $scope.label_old;
					updOldNameArr.name = "name_old";
					updOldNameArr.value = $scope.name_old;
					updOldDataTypeArr.name = "datatype_old";
					updOldDataTypeArr.value = attrsArray[attrCounter].dataType;

					// push the old prop
					for ( var delprop = ctrl.properties.length - 1; delprop >= 0; delprop--) {
						if (ctrl.properties[delprop].name == "label_old"
								|| ctrl.properties[delprop].name == "name_old"
								|| ctrl.properties[delprop].name == "datatype_old") {
							ctrl.properties.splice(delprop, 1);
						}
					}
					ctrl.properties.push(updOldLabelArr);
					ctrl.properties.push(updOldNameArr);
					ctrl.properties.push(updOldDataTypeArr);
					break;
				}
			}
			;
		}
	};

	$browser.notifyWhenNoOutstandingRequests(function() {
		var changeTrack = [];
		var changeList = [];
		var currentTrack = 0;
		
		var GroupId, FormId;
		GroupId = $rootScope.m[0].groupid;
		FormId = $rootScope.m[0].formid;
		$http
				.get(
						$rootScope.listURI.ApplicationURL + $rootScope.listURI.UpdateSupportMetaDataURI + '/' + GroupId + '/'
								+ FormId)
				.success(
						function(data) {$rootScope.supportProperties = angular.fromJson(data);});
		
		if (localStorage.getItem("undoChanges") != null) {
			changeTrack = JSON.parse(localStorage.getItem("undoChanges"));
			currentTrack = JSON.parse(localStorage.getItem("currentTrack"));
			changeList = JSON.parse(localStorage.getItem("changeList"));
			
			changeTrack.length = 0;
			currentTrack = 0;
			changeList.length = 0;
			
			localStorage.setItem("undoChanges", JSON.stringify(changeTrack));
			localStorage.setItem("changeList", JSON.stringify(changeList));
			localStorage.setItem("currentTrack", currentTrack);
		}
		
		
		undoChangesTrack($scope.m , "Original Metadata", $rootScope);
	});
	
	$timeout(function wrapper() {
		if($("#subsection").attr("id") != undefined){
			$rootScope.closeModal();
		}else{
			$timeout(wrapper, 100);
		} 
	}, 100);
	
}

function HomeCtrl($http, $scope, $rootScope) {
	$scope.title = 'UX PointIn';
	$scope.allJsonList = [];
	$scope.allElementTypes = [];
	$scope.GridMetaDataList = [];
	$('#fsitTextDiv').hide();
	$("#fl_menu").css("display", "none");	
	$("#previewmenu").css("display", "none");
	$("#editmenu").css("display", "none");
	$("#redomenu").css("display", "none");
	$("#previewmenu").css("display", "none");
	$("#showJSON").css("display", "none");
	$("#save").css("display", "none");
	$("#jsonEditor").css("display", "none");
	$("#advJsonEditor").css("display", "none");
	$("#showEvents").css("display","none");
	$("#SuccessIcon").css("display", "none");
	$("#ErrorIcon").css("display", "none");
	$("#showFSIT").css("display", "none");
	$("#revision").css("display", "none");
	$("#themeSwitcher").css("display", "none");
	$("#saveGrids").css("display", "none");
	$("#gridJSONEditor").css("display", "none");
	//Function to display the Express processing Popup
	function showExpressProcessingPopover(appName){

		var EPContainerDiv = $('#' + appName);
		
		if($(EPContainerDiv).hasClass('active')){
			$(EPContainerDiv).removeClass('active');
		}
		else{
			$(EPContainerDiv).addClass('active');
		}
	}

	
	$scope.showExpProcessingPopup = function(appName){
		showExpressProcessingPopover(appName);
	};
	
		
	$http.get('data/home-links.json').success(function(data) {
		$rootScope.homeConfig = data;
	});
	$http
			.get('data/OCConfigurator-settings.json')
			.success(
					function(data) {
						$rootScope.listURI = data;

						$http
								.get($rootScope.listURI.ApplicationURL + $rootScope.listURI.GetMetaModelListURI)
								.success(
										function(dataJson) {

											var index = 0;
											for ( var i in dataJson) {

												$scope.allJsonList[index++] = dataJson[i];

											}
											;

										});
						
						$http.get($rootScope.listURI.ApplicationURL + $rootScope.listURI.GetGridMetaModelListURI)
						.success(
								function(griddataJson) {
									var index = 0;
									for ( var i in griddataJson) {

										$scope.GridMetaDataList[index++] = griddataJson[i];

									}
									;
									//$scope.GridMetaDataList = dataJson;
								});

				/*		$http
								.get(
										$rootScope.listURI.ApplicationURL + $rootScope.listURI.GetListScreensServiceJSONURI)
								.success(
										function(screenData) {
											var ind = 0;
											for ( var j in screenData.ScreenTypes.Screen) {

												$scope.allElementTypes[ind++] = screenData.ScreenTypes.Screen[j].screenTypeNumber
														+ ": "
														+ screenData.ScreenTypes.Screen[j].screenDesc;

											}
											; 
										
										});*/
					});

	$http.get('data/appconfig.json').success(function(data) {
		$scope.config = data;

	});

	$("#fl_menu").css("display", "none");
	// $("#deleteElements").css("display", "none");

	localStorage.setItem("result", null);
}

var Metamodel;
var GridMetamodel;
var ElementTyepe;
var redirectUrl;
function createURL(addNewInd) {
	Metamodel = $("#model").get(0).value;
	ElementTyepe = $("#type").get(0).value;
	if (Metamodel == '') {
		Metamodel = 'Template_Default';
	} else {
		// Metamodel = Metamodel;
	}
	if (ElementTyepe == '') {
		ElementTyepe = '10';
	} else {
		ElementTyepe = ElementTyepe.substring(0, ElementTyepe.indexOf(':'));
	}
	if (addNewInd) {
		Metamodel = 'Template_Default';
		window.location = '#/OCConfigurator-nb-main/' + Metamodel + "/" 
				+ "?AddNew&NewName=" + $("#model").get(0).value;
	} else {
		redirectUrl = '#/OCConfigurator-nb-main/' + Metamodel + "/" ;
		$('#launch').attr("href", redirectUrl);
	}
}

function createGridURL(addNewInd) {
	GridMetamodel = $("#gridModel").get(0).value;
	
	if (GridMetamodel == '') {
		GridMetamodel = 'GridTemplate';
	}
	
	if (addNewInd) {
		
	} else {
		redirectUrl = '#/designGrids/' + GridMetamodel + "/" ;
		$('#GridLaunch').attr("href", redirectUrl);
	}
	
}

function MetaModelUpdateJSON($scope, $routeParams, $http, $rootScope) {

	// for FSIT popover
	$scope.dynamicPopover = '<div class="input"><input type="text" value="Hi I am pop over"></input></div>';

}

function LeftControlPalette($scope, $http,$rootScope) {
	$scope.allElementTypes = [];
	$scope.SelectedViewType;
	$scope.SelectedUserGroup;	
	/*for property hints*/
	$scope.showHintPopup = function(divId, callingEvent,hintText){
		$rootScope.canvashint = hintText;
		$('#'+divId).addClass('active');
		$('#'+divId).removeClass('hide');		
		$('#'+divId).offset({top: callingEvent.pageY+20,left: callingEvent.target.offsetWidth});		
	}; 
	$scope.hideHintPopup = function(divId){
		$('#'+divId).removeClass('active');	
		$('#'+divId).addClass('hide');	
	};
	//ACL Rules API
	 $http.get($rootScope.listURI.ApplicationURL
				+ $rootScope.listURI.GetACLUserRolesURI).success(function(userroledata) {	
	    	$scope.usergroups =  angular.fromJson(userroledata.usergroups);
	    });
	 $http.get($rootScope.listURI.ApplicationURL
				+ $rootScope.listURI.GetViewAccessControl + '/' + $rootScope.screenId).success(function(accessControldata) {	
			$rootScope.accessControldata =  angular.fromJson(accessControldata);
			$rootScope.accessControldata.screen = $rootScope.screenId;
			var arrACLdataSanitize = $rootScope.accessControldata;
			for (var ACLCtr = 0;ACLCtr < arrACLdataSanitize.elements.length;ACLCtr++ ){				
				arrACLdataSanitize.elements[ACLCtr].name = arrACLdataSanitize.elements[ACLCtr].element;
				arrACLdataSanitize.elements[ACLCtr].mask = arrACLdataSanitize.elements[ACLCtr].mask.toString();
			}
	    }).error(function(errorData) {	
			$rootScope.accessControldata = {"screenId" : $rootScope.screenId,"screen":$rootScope.screenId};
	    });
	 $scope.addNewACLRule = function(element){		 
		 $rootScope.accControlElementdata.push({"usergroup":"","element":element.name,"name":element.name,"mask":""});
		 //$rootScope.accessControldata.elements.push({"usergroup":"","element":element.name,"mask":""});
	 };
	 $scope.updateACLRule = function(element){	
		 if ($rootScope.accessControldata.elements){
		 for (var accCtr = $rootScope.accessControldata.elements.length -1; accCtr >=0 ; accCtr--){
				if ($rootScope.accessControldata.elements[accCtr].element == element.name) {				
					$rootScope.accessControldata.elements.splice(accCtr,1);				
				}
			}
		 }else{
			 $rootScope.accessControldata.elements = [];
		 }
		 for (var accCtr = 0; accCtr < $rootScope.accControlElementdata.length ; accCtr++){
			 $rootScope.accessControldata.elements.push($rootScope.accControlElementdata[accCtr]);
		 }
	 };
	 $scope.deleteACLRule = function(element,ruleDeleted){
		 for (var accCtr = $rootScope.accessControldata.elements.length -1; accCtr >=0 ; accCtr--){
				if ($rootScope.accessControldata.elements[accCtr].element == element.name) {				
					$rootScope.accessControldata.elements.splice(accCtr,1);				
				}
			}
		 delete $rootScope.accControlElementdata[ruleDeleted];
		 for (var accCtr = 0; accCtr < $rootScope.accControlElementdata.length ; accCtr++){
			 $rootScope.accessControldata.elements.push($rootScope.accControlElementdata[accCtr]);
		 }
	 };
	//Retrieve the list of attributes for a given metamodel page
	$scope.setPage = function(ctrl) {
		$scope.syncForeignControls();
		if ($scope.attrPage === ctrl.page) {
			//The same page was specified, use last results
			return;
		}
		//console.log("setPage: " + ctrl.page);
		$scope.attrPage = ctrl.page;
		$scope.attrs = [];
		$rootScope.getPageControls(ctrl.page).then(function(data) {
			for (var i=0; i < data.length; i++) {
				$scope.attrs.push(data[i].name);
			}
		});
	};
	//Traverse the passed metamodel and return an array of controls, either hidden or non-hidden. If a
	//  pageName is included then only controls from that page will be returned.
	//$rootScope.metamodel[0]
	$rootScope.getModelControls = function(includeVisible, includeHidden, metaModel, pageName) {
		var Controls = [], i, j, k, l, control;
		if (metaModel === undefined || metaModel === null) metaModel = $rootScope.m[0];
		if (includeVisible === undefined) includeVisible = true;
		if (includeHidden === undefined) includeHidden = true;
		if (metaModel.section) {
			//Loop through the subsections
			for (k=0; k < metaModel.section.length; k++) {
				for (i=0; i < metaModel.section[k].subsection.length; i++) {
					if ( (metaModel.section[k].subsection[i].subsectiontitle !== "hiddenfields" && includeVisible) || 
						(metaModel.section[k].subsection[i].subsectiontitle === "hiddenfields" && includeHidden) ) {
						//Enumerate the controls in this section
						for (j=0; j < metaModel.section[k].subsection[i].element.length; j++) {
							control = metaModel.section[k].subsection[i].element[j];
							if (control.type === "grouptext") {
								//Iterate also through the group controls
								for (l=0; l < control.controlgroup.length; l++) {
									if (control.controlgroup[l].name && (pageName === undefined || control.controlgroup[l].page === pageName)) {
										Controls.push(control.controlgroup[l]);
									}
								}
							} else {
								if (control.name && (pageName === undefined || control.page === pageName)) {
									Controls.push(control);
								}
							}
						}
					}
				}
			}
		} else {
			//Other page types have a group array
			var Groups = metaModel.group;
			//Loop through the group sections
			for (var i=0; i < Groups.length; i++) {
				//Enumerate the controls in this section
				for (var j=0; j < Groups[i].element.length; j++) {
					if (pageName === undefined || control[l].page === pageName) {
						Controls.push(Groups[i].element[j]);
					}
				}
			}
		}
		return Controls;
	};
	//Returns an array of control names for only visible controls from the host page.
	$rootScope.getVisibleControlNames = function() {
		var Controls = $rootScope.getModelControls(true, false);
		var hostPage = $rootScope.screenId;
		var Names = [];
		
		for (var i=0; i < Controls.length; i++) {
			if (Controls[i].page && Controls[i].page === hostPage) {
				Names.push(Controls[i].name);
			}
		}
		return Names;
	};
	//Returns a list of hidden controls that have neither default nor reference set but are required.
	$rootScope.getIncompleteHidden = function() {
		var controls = [];
		var hostPage = $rootScope.screenId;
		
		var hiddenControls = $rootScope.getModelControls(false, true);
		//Enumerate the controls in this section
		for (var i=0; i < hiddenControls.length; i++) {
			/*
			if ( (hiddenControls[i].required) && (hiddenControls[i].required === "required") &&
				(hiddenControls[i].page !== hostPage) &&
				( 
						((hiddenControls[i].defaultValue === "") && (hiddenControls[i].reference === "")) || 
						((hiddenControls[i].defaultValue !== "") && (hiddenControls[i].reference !== "")) 
				) )*/
			if ($rootScope.getIsIncomplete(hiddenControls[i])) {
			  controls.push(hiddenControls[i]);
			}
		}
		return controls;
	};
	//Returns TRUE if the passed hidden control should be considered incomplete for entry purposes.
	$rootScope.getIsIncomplete = function(control) {
		var hostPage = $rootScope.screenId;
		if ( (control.required) && (control.required === "required") &&
				(control.page !== hostPage) &&
				( 
						((control.defaultValue === "") && (control.reference === "")) || 
						((control.defaultValue !== "") && (control.reference !== "")) 
				) 
			) {
			return true;
		}
		return false;
	}
	//Retrieves all controls from another page. Returns a promise that will have the 
	//  controls array as argument.
	$rootScope.getPageControls = function(pageName) {
		//Check our cache of promises
		if ($rootScope.pagePromises[pageName] === undefined) {
			$rootScope.pagePromises[pageName] = $http.get($rootScope.listURI.ApplicationURL	+ '/metamodel/' + pageName)
				.then(function(response) {
					if (!response.data.exception) {
						//Store the properties file keys for later use
						var propsURL = $rootScope.listURI.ApplicationURL + $rootScope.listURI.UpdateSupportMetaDataURI + '/' + response.data.metadata.groupid + '/' + response.data.metadata.formid;
						$rootScope.foreignPropertyKeys.push(propsURL);
						//Modify the payload into an array of controls 
						var Controls = $rootScope.getModelControls(true, true, response.data.metadata);
						//Filter out foreign controls from THAT model
						for (var i=(Controls.length-1); i >= 0; i--) {
							if (Controls[i].page !== pageName) {
								Controls.splice(i, 1);
							}
						}
						return Controls;
					}
				});
		}
		return $rootScope.pagePromises[pageName];
	};
	//Returns the hidden controls subsection of the passed model. If the model is not passed,
	//  it will use the live page model.
	$rootScope.getHiddenControlsElements = function(model) {
		var i, j;
		if (model === undefined) model = $rootScope.m[0];
		//Loop through the non-hidden subsections
		for (j=0; j < model.section.length; j++) {
			for (i=0; i < model.section[j].subsection.length; i++) {
				if (model.section[j].subsection[i].subsectiontitle === "hiddenfields") {
					return model.section[j].subsection[i];
				}
			}
		}
	};
	//Removes all hidden controls from the given page.
	$rootScope.deletePageHiddenControls = function(pageName) {
		var section = $rootScope.getHiddenControlsElements();
		//Enumerate the controls in this section
		for (var i=(section.element.length-1); i >= 0; i--) {
			if (section.element[i].page === pageName) {
				console.log("deletePageHiddenControls: Removing hidden control " + section.element[i].name);
				section.element.splice(i, 1);
			}
		}
	};
	//Removes a control specified by page/name from the hidden fields section.
	$rootScope.deletePageHiddenControl = function(controlPage, controlName) {
		var section = $rootScope.getHiddenControlsElements();
		//Enumerate the controls in this section
		for (var i=(section.element.length-1); i >= 0; i--) {
			if ((section.element[i].page === controlPage) && (section.element[i].name === controlName)) {
				//console.log("deletePageHiddenControls: Removing hidden control " + section.element[i].name);
				section.element.splice(i, 1);
			}
		}
	};
	//Given an array of controls, returns an array of unique foreign page names used.
	$rootScope.getPageNames = function(controls) {
		var pageNames = [];
		var hostPage = $rootScope.screenId;
		
		for (var i=0; i < controls.length; i++) {
			if ((controls[i].page !== undefined) && 
				(controls[i].page.length > 0) && 
				(controls[i].page !== hostPage) &&
				(pageNames.indexOf(controls[i].page) === -1)) 
				pageNames.push(controls[i].page);
		}
		return pageNames;
	};
	//Searches the given controls array for a control name.
	$rootScope.findControlByName = function(controls, controlName) {
		for (var i=0; i < controls.length; i++) {
			if (controls[i].name === controlName) {
				return controls[i];
			}
		}
		return null;
	};
	//Examines the current set of visible controls for a list of referenced pages. This list is
	//  then used to sync controls from foreign pages into the hidden fields of this host page.
	$rootScope.syncForeignControls = function() {
		var visiblePages = $rootScope.getPageNames($rootScope.getModelControls(true, false));
		var hiddenPages = $rootScope.getPageNames($rootScope.getModelControls(false, true));
		var hiddenSection = $rootScope.getHiddenControlsElements();
		var i,j, visiblePageName;
		
		//Remove any pages in hidden that are no longer referenced
		for (i=0; i < hiddenPages.length; i++) {
			if (visiblePages.indexOf(hiddenPages[i]) === -1) {
				console.log("syncForeignControls: Deleting all hidden controls for unreferenced page [" + hiddenPages[i] + "]");
				$rootScope.deletePageHiddenControls(hiddenPages[i]);
			}
		}
		for (i=0; i < visiblePages.length; i++) {
			visiblePageName = visiblePages[i];
			//Get the controls for each foreign page. Add or remove them from hidden as necessary based on 
			//  which ones are in visible controls for the host page.
			$rootScope.getPageControls(visiblePageName).then(function(data) {
				var foreignControls = data;
				var visibleControls = $rootScope.getModelControls(true, false, null, visiblePageName);
				var hiddenControls = $rootScope.getModelControls(false, true, null, visiblePageName);
				//For each hidden control from this page, remove it from hidden if it has been added to visible by the user.
				for (j=0; j < hiddenControls.length; j++) {
					if ($rootScope.findControlByName(visibleControls, hiddenControls[j].name)) {
						console.log("syncForeignControls: Removing hidden control now in visible [" + hiddenControls[j].name + "]");
						$rootScope.deletePageHiddenControl(visiblePageName, hiddenControls[j].name);
					}
				}
				var addControls = [];
				for (j=0; j < foreignControls.length; j++) {
					//If the control is not in the hidden controls and not in the visible controls, add it to hidden
					if (!$rootScope.findControlByName(hiddenControls, foreignControls[j].name) && 
						!$rootScope.findControlByName(visibleControls, foreignControls[j].name)) {
						foreignControls[j].type = "hidden";
						addControls.push(foreignControls[j]);
					}
				}
				if (addControls.length > 0) {
					hiddenSection.element = hiddenSection.element.concat(addControls);
					console.log("syncForeignControls: Added " + addControls.length + " foreign hidden controls");
				}
			});
		}
	};
	//Validate the controls on the page and show messages for any problems encountered.
	$rootScope.validateControls = function() {
		var controls = $rootScope.getIncompleteHidden();
		
		if (controls.length > 0) {
			showMessage("The " + controls.length + " shaded hidden controls must have a value set for either their 'Reference' or 'Default' fields but not both.", "30" );
			return false;
		}
		return true;
	};
	//For each referenced page, retrieve the properties file and merge them into the rootScope. Returns
	//  an array of promises that will resolve when all properties are merged.
	$rootScope.getAllPageProperties = function() {
		var promises = [];
		
		for (var i=0; i < $rootScope.foreignPropertyKeys.length; i++) {
			promises.push($http.get($rootScope.foreignPropertyKeys[i])
			  .success(function(data) {
				  var properties = angular.fromJson(data);
				  //Merge these properties into the rootScope
				  $.extend($rootScope.supportProperties, properties);
			  }));
		}
		return promises;
	};
	$scope.$on("pageChanged", function(event, data) {
		$scope.setPage(data);
	});
	$scope.setAttr = function(ctrl) {
		var SelectedViewType = $('#ViewSelectedtype').get(0).value;
		SelectedViewType = SelectedViewType.substring(0, SelectedViewType.indexOf(':'));
		$http.get($rootScope.listURI.ApplicationURL
			+ $rootScope.listURI.GetAttributesFullServiceURI
			+ '/' + SelectedViewType + '/json')
		.success(function(data) {
			$scope.attrsJson = data.ShortNameDefinition.ShortNameDefs.ShortNameDef;
		});
	};
	
	$http
			.get('data/OCConfigurator-control-palette.json')
			.success(
					function(paletteData) {
						$scope.accordions = angular
								.fromJson(paletteData.accordions);
						// for control palette in the left side 
						$http
								.get('data/controls.json')
								.success(
										function(dataControls) {
											$scope.controls = angular
													.fromJson(dataControls);
											for ( var objAc = 0; objAc < $scope.accordions.length; objAc++) {
												if ($scope.controls[$scope.accordions[objAc].id] != null)
													$scope.accordions[objAc].controls = $scope.controls[$scope.accordions[objAc].id];
											}
										});
					});
	$http
	.get(
			$rootScope.listURI.ApplicationURL + $rootScope.listURI.GetListScreensServiceJSONURI)
	.success(
			function(screenData) {
				var ind = 0;
				for ( var j in screenData.ScreenTypes.Screen) {

					$scope.allElementTypes[ind++] = screenData.ScreenTypes.Screen[j].screenTypeNumber
							+ ": "
							+ screenData.ScreenTypes.Screen[j].screenDesc;

				}
				;
			
			});
	// for moving the value back to metamodel
	$scope.moveValue = function(obj, key, newvalue) {
		if (key == 'required' && newvalue == 'true') {
			newvalue = 'required';
		}
		obj[key] = newvalue;
	};
	$scope.setFocusBack = function(id) {
		$('#' + id).focus();
	};
	// Description translator
	$scope.SetDescription = function(accName, obj, key) {
		var ctrlArr = $scope.controls[accName];
		var objDispArr = 'nomatch';
		for ( var ctrlCtr = 0; ctrlCtr < ctrlArr.length; ctrlCtr++) {
			if (ctrlArr[ctrlCtr].propName == key) {
				objDispArr = ctrlArr[ctrlCtr];
				if (key == 'required' && obj.required == 'required') {
					$scope.Fieldrequired = "true";
				}
				return objDispArr;
			}
		}
		return objDispArr;
	};

}

var EditorInstanceCtrl = function($scope, $modalInstance, $filter){
	$scope.jsonData = $scope.$parent.m[0];

	$scope.jsonMetaString = angular.toJson($scope.$parent.m[0], true);

	$scope.done = function() {
		try {
			$scope.$parent.m[0] = JSON.parse($('#txtJSONString').val());
			$modalInstance.dismiss('cancel');
		} catch (e) {
			$("#warning").css({
				"display" : "block"
			});
			$scope.errormessage = e.name + " : " + e.message;
		}
		
		

	};
	
	$scope.hideFooter = function() {
		$('#jsonFooter').css('display', 'none');
	  };
	
	$scope.showFooter = function() {
			$('#jsonFooter').css('display', 'block');
		  };
	
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};

var GridEditorCtrl = function($scope, $rootScope, $modalInstance, $filter){
		
	$scope.jsonData = $rootScope.gridMetaData;

	$scope.jsonMetaString = angular.toJson($rootScope.gridMetaData, true);

	$scope.done = function() {
		try {
			$rootScope.gridMetaData = JSON.parse($('#txtJSONString').val());
			$rootScope.gridColumnDefs = $rootScope.gridMetaData.element;
			$rootScope.gridTitle = $rootScope.gridMetaData.title;
			$rootScope.gridFunction = $rootScope.gridMetaData.operation.jsfunction;
			$modalInstance.dismiss('cancel');
		} catch (e) {
			$("#warning").css({
				"display" : "block"
			});
			$scope.errormessage = e.name + " : " + e.message;
		}
		
		

	};
	
	$scope.hideFooter = function() {
		$('#jsonFooter').css('display', 'none');
	  };
	
	$scope.showFooter = function() {
			$('#jsonFooter').css('display', 'block');
		  };
	
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};


function HandleClick($scope, sharedProperties, $rootScope, $routeParams, $http,
		$modal) {
	var isVisible = false;

	
	$scope.openJSONEditor = function(){
		var modalInstance = $modal.open({
			templateUrl : 'JSONEditor.html',
			controller : EditorInstanceCtrl

		});

	};
	
	$scope.gridJSONEditor = function(){
		var modalInstance = $modal.open({
			templateUrl : 'JSONEditor.html',
			controller : GridEditorCtrl

		});

	};
	$scope.showHintPopup = function(divId, callingEvent,hintText){
		$rootScope.canvashint = hintText;
		$('#'+divId).addClass('active');
		$('#'+divId).removeClass('hide');		
		$('#'+divId).offset({top: callingEvent.pageY+20,left: callingEvent.pageX - 150});		
	}; 
	$scope.hideHintPopup = function(divId){
		$('#'+divId).removeClass('active');	
		$('#'+divId).addClass('hide');	
	};
	
	$scope.openRevision = function(){
		   var leftmeta = {} ;
		   var rightmeta = {};
           var diffOrHistory = 'rev';
		var modalInstance = $modal.open({
			templateUrl : 'partials/revisions.html',
			controller : RevisionCtrl,
			resolve : {
				diffOrHistory : function() {
					return diffOrHistory;
				},
				leftmeta : function() {
					return leftmeta;
				},
				rightmeta : function() {
					return rightmeta;
				}
			}

		});

	};
	
	

	$scope.open = function(field, modalType) {
		$rootScope.supportType = $('#newField-supportType').get(0).value;
		if (modalType == 'dataSource') {
			$rootScope.modalType = "dataSource";
		} else {
			$rootScope.modalType = "verifyRE";
		}

		var modalInstance = $modal.open({
			templateUrl : 'VerifyRegularExp.html',
			controller : ModalInstanceCtrl,
			resolve : {
				field : function() {
					return field;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			field.regexp = selectedItem;
			// $scope.selected = selectedItem;
		});
	};

	$scope.changeControlType = function(editingField, ctrl) {
		switch (editingField.type) {
		case "radio":
			editingField.options = [ {
				"description" : "Yes",
				"value" : "Y"
			}, {
				"description" : "No",
				"value" : "N"
			} ];
			break;
		case "select":
			editingField.options = [ {
				"description" : "",
				"value" : ""
			} ];
			editingField.support = "true";
			break;
		case "hidden":
			//$scope.selectedScope
			//$scope.selectedIndex
			
			for(var sectionCount = 0; sectionCount <= $scope.m[0].section.length - 1; sectionCount++){
				for(var subsectionCount = 0; subsectionCount <= $scope.m[0].section[sectionCount].subsection.length - 1; subsectionCount++){
					if($scope.m[0].section[sectionCount].subsection[subsectionCount].subsectiontitle == "hiddenfields"){
						if ($rootScope.selectedScope.field.type == "grouptext"){
							$scope.m[0].section[sectionCount].subsection[subsectionCount].element.push($rootScope.selectedScope.subfield);
						}
						else{
							$scope.m[0].section[sectionCount].subsection[subsectionCount].element.push($rootScope.selectedScope.field);
						}
					}	
				}
			}
			
			if ($rootScope.selectedScope.field.type == "grouptext"){
				$rootScope.selectedScope.field.controlgroup.splice($rootScope.selectedIndex,1);
			}
			else{
				$rootScope.selectedScope.subsections.element.splice($rootScope.selectedIndex,1);
			}
			
			break;
		}
		;
	};

	$scope.setDataSupport = function(field, instance) {
		if (this.supportType != "generic" && this.supportType != "query"
				&& $("#newField-supportType").get(0).value == '') {
			field.support = "false";
			$rootScope.setDataSupport = '';
			if (instance == "1") {
				$('#editQueryLookup1').css("display", "none");
			} else {
				$('#editQueryLookup').css("display", "none");
			}
		} else {
			if (instance == "1") {
				$('#editQueryLookup1').css("display", "inline");
			} else {
				$('#editQueryLookup').css("display", "inline");
			}
		}
	};

	$scope.closeProperties = function() {

		/*
		 * if ($(".popover").get(0).title.indexOf('Query') > -1) { } else { if
		 * (!isVisible) { // $(".popover").hide(); } }
		 * 
		 * isVisible = false;
		 */
	};

	$scope.submitToNewWindow = function(url, type) {

		window.$windowScope = $scope.$parent.m;
		window.$windowRootScope = $rootScope.gridMetaData;
		
		if (type == "LARGE") {
			window.open(url, 'frame',
					'scrollbars=1, resizeable,top=0,left=0,height= '
							+ screen.height + ',width=' + screen.width);
		} else if (type == "TABLET") {
			window.open(url, 'frame',
					'scrollbars=1, resizeable,height=1024,width=768');
			// window.resizeTo(768,1024);
		} else if (type == "MOBILE") {
			window
					.open(url, 'frame',
							'scrollbars=1, resizeable,top=100,left=100,height=1136,width=640');
			// window.resizeTo(640,1136);
		} else {
			window
					.open(url, 'frame',
							'scrollbars=1, resizeable,top=100,left=100,height=200,width=300');
		}
	};

	$scope.showJSON = function() {

		if ($("#jsonPopup").has($(event)[0].srcElement).length == 0) {
			$scope.prettyJSON = JSON.stringify(JSON.parse("{\"metadata\":"
					+ angular.toJson($rootScope.m[0]) + "}"), undefined, 4);
			$('#jsonPopup').show();
		} else {
			event.stopPropagation();
		}

	};
	
	$scope.SaveGridMetadata =  function(){
		// Save Grid Metadata Resp API call with Grid name as parameter.
	var	TrackerText = 'Tracker ID_' + $('#trackingidg').get(0).value + ', User ID_' + $('#useridg').get(0).value + ', Remarks_' + $('#saveRemarksg').get(0).value;
            if($('#trackingidg').get(0).value ==''){TrackerText = TrackerText.replace('Tracker ID_','');}
            if($('#useridg').get(0).value ==''){TrackerText = TrackerText.replace(', User ID_','');}
            if($('#saveRemarksg').get(0).value ==''){TrackerText = TrackerText.replace(', Remarks_','');}

			var finalGMObj = {
				"gridMetaData" : $rootScope.gridMetaData
			};

			$http(
					{
						method : 'PUT',
						url : $rootScope.listURI.ApplicationURL
								+ $rootScope.listURI.AddGridMetaModelURI.replace('{name}',$rootScope.gridColumnDefs.gridName),
						data : finalGMObj,
						params : {							
							Remarks : TrackerText							
						}
					}).success(function(data) {
				$("#SuccessIcon").css("display", "block");
				$("#ErrorIcon").css("display", "none");
			}).error(function(data) {
				$("#SuccessIcon").css("display", "none");
				$("#ErrorIcon").css("display", "block");
			});

	};
	
	$scope.preventDefault = function() {
		event.stopPropagation();
	};
	
	$scope.PublishMetaData = function(event, showMenu, Publish) {
		//insert main view properties if not existing already
		if ($rootScope.m[0].properties == undefined){
			$scope.mainViewProp = PropToScreen($rootScope.m[0].properties,
			$rootScope.mainViewPropData, $rootScope.setType);
			$rootScope.m[0].properties = ScreenToProp($scope.mainViewProp);
		}
		if (!$scope.validateControls()) return;
		if ($('#trackingid').get(0).value == '' ||	$('#userid').get(0).value == '' || 	$('#saveRemarks').get(0).value == '') {
			$('#fsitText').focus();
			if (!showMenu) {
				event.stopPropagation();
			}
			return;
		}
		
		var TrackerText;
		if (Publish == 'true') {
			TrackerText = $('#fsitText').get(0).value;
		} else {
			TrackerText = $('#trackingid').get(0).value +
				', _ ' + $('#userid').get(0).value +
				', _ ' + $('#saveRemarks').get(0).value;
			if($('#trackingid').get(0).value ==''){TrackerText = TrackerText.replace('Tracker ID_','');}
			if($('#userid').get(0).value ==''){TrackerText = TrackerText.replace(', User ID_','');}
			if($('#saveRemarks').get(0).value ==''){TrackerText = TrackerText.replace(', Remarks_','');}
		}
		
		var sliceURIParam = $rootScope.listURI.GetMetaModelURI;
		sliceURIParam = sliceURIParam.replace("/{name}","");
		var urlstr = $rootScope.listURI.ApplicationURL + sliceURIParam + '/' + $rootScope.screenId;
		//Ensure that all foreign pages are synced
		$scope.syncForeignControls();
		var propertiesProcess = $rootScope.getAllPageProperties();
		$.when.apply($, propertiesProcess).then(function() {
		$http({
			method : 'GET',
			url : urlstr
		}).success(function(latestRev) {			
			/* global jsondiffpatch */
			/*    var instance = jsondiffpatch.create({
		        objectHash: function(obj) {
		        return obj._id || obj.id || obj.name || JSON.stringify(obj);
		        },
				    arrays: {
				        // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
				        detectMove: true,
				        // default false, the value of items moved is not included in deltas
				        includeValueOnMove: false
				    },
				    textDiff: {
				        // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
				        minLength: 60
				    }
				    });*/
		    var leftmeta = angular.toJson($rootScope.metamodel[0]) ;
		    var rightmeta = angular.toJson(latestRev.metadata);
		    var delta;
		    //var delta = instance.diff(leftmeta,rightmeta);
		    if (delta != undefined){
		    	var diffOrHistory = 'diff';
		    	var modalInstance = $modal.open({
					templateUrl : 'partials/revisions.html',
					controller : RevisionCtrl,
					resolve : {
						diffOrHistory : function() {
							return diffOrHistory;
						},
						leftmeta : function() {
							return leftmeta;
						},
						rightmeta : function() {
							return rightmeta;
						}
					}
				});				   
		    	return false;
		    }
			
		if ($rootScope.accessControldata.elements){
			
			var payLoad = $rootScope.accessControldata;
			payLoad.screen = $rootScope.accessControldata.screenId+":field";
			$http(
					{
						method : 'POST',
						url : $rootScope.listURI.ApplicationURL
								+ $rootScope.listURI.UpdateAccessControl,
						data : payLoad												
					}).success(function(data) {	
						var savedtoken = data;
					}).error(function(data) {
						var savedtoken = data;
			});	
		
		}		
			
		
			//$rootScope.openModal();
			// clear the Canvas processing properties from meta model
			var fullMMJson = [];
			fullMMJson = angular.copy($rootScope.m[0]);
			
			for ( var secCounter = 0; secCounter < fullMMJson.section.length; secCounter++) {
				var section = fullMMJson.section[secCounter];
				for ( var subsecCounter = 0; subsecCounter < section.subsection.length; subsecCounter++) {
					var subSection = section.subsection[subsecCounter];
					for ( var elementCounter = 0; elementCounter < subSection.element.length; elementCounter++) {
						var element = subSection.element[elementCounter];
						if (element.controlgroup != null) {
							for ( var cgCounter = 0; cgCounter < element.controlgroup.length; cgCounter++) {
								var field = element.controlgroup[cgCounter];						
								if (field.properties != null) {
									var fieldPropertyArray = field.properties;
									var prop1 = "indicator";
									var prop2 = "label_old";
									var prop3 = "name_old";
									var prop4 = "datatype_old";
									var prop5 = "supportType";
									var prop6 = "lookUp";
									var prop7 = "query";
									for ( var proTodelCount = field.properties.length - 1; proTodelCount >= 0; proTodelCount--) {
										if (fieldPropertyArray[proTodelCount].name == prop1
												|| fieldPropertyArray[proTodelCount].name == prop2
												|| fieldPropertyArray[proTodelCount].name == prop3
												|| fieldPropertyArray[proTodelCount].name == prop4
												|| fieldPropertyArray[proTodelCount].name == prop5
												|| fieldPropertyArray[proTodelCount].name == prop6
												|| fieldPropertyArray[proTodelCount].name == prop7)
											fieldPropertyArray.splice(
													proTodelCount, 1);
									}
								}
							}// controlgroups
						} else {// for elements with no control group
							if (element.properties != null) {
								var elementPropertyArray = element.properties;
								var prop1 = "indicator";
								var prop2 = "label_old";
								var prop3 = "name_old";
								var prop4 = "datatype_old";
								var prop5 = "supportType";
								var prop6 = "lookUp";
								var prop7 = "query";
								for ( var proTodelCount = element.properties.length - 1; proTodelCount >= 0; proTodelCount--) {
									if (elementPropertyArray[proTodelCount].name == prop1
											|| elementPropertyArray[proTodelCount].name == prop2
											|| elementPropertyArray[proTodelCount].name == prop3
											|| elementPropertyArray[proTodelCount].name == prop4
											|| elementPropertyArray[proTodelCount].name == prop5
											|| elementPropertyArray[proTodelCount].name == prop6
											|| elementPropertyArray[proTodelCount].name == prop7)
										elementPropertyArray.splice(proTodelCount,
												1);
								}
							}
						}
					}// subsection
				}// section
			}// metadata
			var SupportInfoError = false;
		
			for ( var secCounter = 0; secCounter < $rootScope.m[0].section.length; secCounter++) {
				var section = $rootScope.m[0].section[secCounter];
				for ( var subsecCounter = 0; subsecCounter < section.subsection.length; subsecCounter++) {
					var subSection = section.subsection[subsecCounter];
					for ( var elementCounter = 0; elementCounter < subSection.element.length; elementCounter++) {
						var element = subSection.element[elementCounter];					
						if (element.controlgroup == null) {
							
							
							if (element.support != undefined && element.support == "true"){
								if (element.properties == null){//error								
									if($scope.validateSupportProperties(element)){}else{return false;}
									
								}else{
									if (element.properties.length == 0){//error
										if($scope.validateSupportProperties(element)){}else{return false;}
										
									}else{
										//for each 
										SupportInfoError = true;  //assume its an error situation and then next logic looks for it
										for (var propCounter = 0; propCounter <element.properties.length; propCounter++ ){
										      var PropName =element.properties[propCounter].name;
											  var PropValue = element.properties[propCounter].value;
											  if (PropName == "supportType" && PropValue != ''){
										    	  SupportInfoError = false;
										    	  break;
												}
										      if (PropName == "query" && PropValue != ''){
										    	  SupportInfoError = false;
										    	  break;
												}
										      if (PropName == "lookUp" && PropValue != ''){
										    	  SupportInfoError = false;
										    	  break;
												}	
										}
										if (SupportInfoError){
											if($scope.validateSupportProperties(element)){}else{return false;}										
											}
									}
								}
								
							
							}
						
					}
				}// subsection
			}// section
				
		}// metadat
		
		$scope.submitMeta(Publish,fullMMJson,TrackerText);
		
		});
		});
	};	
	
	$scope.validateSupportProperties = function(elementTotest){
			var returnToken = true;										
			var supportPorpNm = elementTotest.name + ".type";
			var supportSQLPropNm = elementTotest.name + ".supportinfo";													
			if ($rootScope.supportProperties[supportPorpNm] == undefined && $rootScope.supportProperties[supportSQLPropNm] == undefined) {
					showMessage('Provide support data information for ' + elementTotest.label, '30' );
					returnToken = false;
					//$rootScope.closeModal();			
					
		}					
			return returnToken;
	};
	
	$scope.submitMeta = function(Publish,fullMMJson,TrackerText){
		// name_old and label_old.		
		
		if ($rootScope.AddNew == "true"){
			$rootScope.screenId = $rootScope.NewName; 
		}		
		
		var finalIObj = [ {
			"metadata" : $rootScope.m[0]
		}, {
			"metadata" : fullMMJson
		} ]; // this JSON should be of the format
		
		$http(
				{
					method : 'POST',
					url : $rootScope.listURI.ApplicationURL
							+ $rootScope.listURI.RetrieveMetaModelDBServiceURI + '/'
							+ $rootScope.screenId,
					data : finalIObj,					
					params : {
						location : $rootScope.location,
						masterCo : $rootScope.masterCo,
						policyCo : $rootScope.policyCo,
						lineOfBus : $rootScope.lineOfBus,
						insLine : $rootScope.insLine,
						state : $rootScope.state,
						product : $rootScope.product,
						coverage : $rootScope.coverage,
						item : $rootScope.item,
						setType : $rootScope.setType,
						Remarks : TrackerText,
						Publish : Publish
					}
				}).success(function(data) {
			$rootScope.metamodel[0] = angular.copy(fullMMJson);
			//$rootScope.closeModal();
			showMessage('Changes are saved', '40' );
			$('#fsitnmbr').hide();
			$("#SuccessIcon").css("display", "block");
			$("#ErrorIcon").css("display", "none");
		}).error(function(data) {
			//$rootScope.closeModal();
			showMessage('An error occured while saving the data.', '30' );
			$('#fsitnmbr').hide();
			$("#SuccessIcon").css("display", "none");
			$("#ErrorIcon").css("display", "block");
		});
	};

	$scope.stateCodes = [];
	$scope.classCodes = [];

	$http
	.get('data/OCConfigurator-settings.json')
	.success(
			function(data) {
				$rootScope.listURI = data;
	$http
			.get(
					$rootScope.listURI.ApplicationURL
							+ $rootScope.listURI.GetStateAttributesServiceJSONURI)
			.success(
					function(statedata) {

						for ( var i = 0; i < statedata.ShortNameDefinition.ShortNameDefs.ShortNameDef.length; i++) {
							$scope.stateCodes
									.push(statedata.ShortNameDefinition.ShortNameDefs.ShortNameDef[i].ShortName);
						}
						;
					});
	$http
			.get(
					$rootScope.listURI.ApplicationURL
							+ $rootScope.listURI.GetClassAttributesServiceJSONURI)
			.success(
					function(classdata) {

						for ( var i = 0; i < classdata.ShortNameDefinition.ShortNameDefs.ShortNameDef.length; i++) {
							$scope.classCodes
									.push(classdata.ShortNameDefinition.ShortNameDefs.ShortNameDef[i].ShortName);
						}
						;
					});
			});

	// state-class toggle method
	$scope.stateclasscd ={};
	$scope.toggleStateClass = function(ctrl, type, editingField) {
		if (ctrl.stateclassitem == '') {
			$scope.stateclasscd = [ '' ];
			$scope.stateclasscdE = [ '' ];
			
				$('#stclcdtext').show();
				$('#stclcd').hide();
			
		}

		if (ctrl.stateclassitem == 'S') {

			
				$scope.stateclasscd = $scope.stateCodes;
				$('#stclcdtext').hide();
				$('#stclcd').show();
			
			
		}

		if (ctrl.stateclassitem == 'C') {

			
				$scope.stateclasscd = $scope.classCodes;
				$('#stclcdtext').hide();
				$('#stclcd').show();

		}

		// update the metamodel with these picks
		var StateClassValue;

		
		StateClassValue = ctrl.stateclassitem;
		

		var updscCodeInd = {};

		updscCodeInd.name = "SC_CODE";
		updscCodeInd.value = StateClassValue;

		// del the old prop
		for ( var delprop = editingField.properties.length - 1; delprop >= 0; delprop--) {
			if (editingField.properties[delprop].name == "SC_CODE") {
				editingField.properties.splice(delprop, 1);
			}
		}
		// push the new prop
		editingField.properties.push(updscCodeInd);

	};

	$scope.setGridColumn = function(ctrl, editingField, type) {
		// $scope.newfield =

	};

	// handler for Default to
	$scope.setDefaultTo = function(ctrl, type, editingField) {

		var defaultToValue;
		
		defaultToValue = ctrl.defaultToG;
		
		
		

		var updDefaultToInd = {};

		updDefaultToInd.name = "USRENTRYFIELD";
		updDefaultToInd.value = defaultToValue.replace(/\_/g, ' ');

		// del the old prop
		for ( var delprop = editingField.properties.length - 1; delprop >= 0; delprop--) {
			if (editingField.properties[delprop].name == "USRENTRYFIELD") {
				editingField.properties.splice(delprop, 1);
			}
		}
		// push the new prop
		editingField.properties.push(updDefaultToInd);

	};

	// handler for Print Ind
	$scope.setPrintInd = function(ctrl, editingField, type) {
		var printIndValue;
		printIndValue = ctrl.GroupPrintIndG;		

		var updPrintInd = {};

		updPrintInd.name = "PRINTIND";
		updPrintInd.value = printIndValue;

		// del the old prop
		for ( var delprop = editingField.properties.length - 1; delprop >= 0; delprop--) {
			if (editingField.properties[delprop].name == "PRINTIND") {
				editingField.properties.splice(delprop, 1);
			}
		}
		// push the new prop
		editingField.properties.push(updPrintInd);
	};

	// handler for Required PT
	$scope.setRqPT = function(ctrl, editingField, type) {
		var requiredIndValue;
		
			requiredIndValue = ctrl.GroupRqPTG;
		

		var updrequiredPTInd = {};

		updrequiredPTInd.name = "REQUIRED_PT";
		updrequiredPTInd.value = requiredIndValue;

		// del the old prop
		for ( var delprop = editingField.properties.length - 1; delprop >= 0; delprop--) {
			if (editingField.properties[delprop].name == "REQUIRED_PT") {
				editingField.properties.splice(delprop, 1);
			}
		}
		// push the new prop
		editingField.properties.push(updrequiredPTInd);

	};

	
	// /Call to retrieve P&C Rules Launch URL STARTS
	$scope.initRules = function(event, PIREventName) {
		var dataString = {
			"metadata" : $rootScope.m[0]
		};
		dataString.metadata.name = $rootScope.screenId;
		dataString.metadata.eventName = PIREventName;
		// 
		$http({
			method : 'POST',
			url : $rootScope.listURI.ApplicationURL + $rootScope.listURI.InitRulesDesignURI + "/" + $rootScope.screenId,
			data : dataString,
			headers : {
				"metaModelName" : $rootScope.screenId
			}
		}).success(function(data) {
			// $("#SuccessIcon").css("display", "block");
			$("#ErrorIcon").css("display", "none");
			window.open(data);
		}).error(function(data) {
			$("#SuccessIcon").css("display", "none");
			$("#ErrorIcon").css("display", "block");
		});
	};

	// //ENDS
	// This is undo functionality.
	$scope.undoChanges = function(undoLevel) {
		
		var undoIndex = this.items.id;
		var changeTrack = [];
		var changeList = [];
		var currentTrack = 0;
		
		if (localStorage.getItem("undoChanges") != null) {
			changeTrack = JSON.parse(localStorage.getItem("undoChanges"));
			currentTrack = JSON.parse(localStorage.getItem("currentTrack"));
			changeList = JSON.parse(localStorage.getItem("changeList"));
		}
		
		if (undoIndex == 0) {
			$rootScope.m[0] = changeTrack[0][0];
			currentTrack = 0;
			
		} else {

			$rootScope.m[0] = changeTrack[undoIndex - 1][0];
			currentTrack = undoIndex - 1;
		}
		
		$rootScope.undoList.length = 0;
		$rootScope.redoList.length = 0;
		for(var counter = 0; counter < changeList.length; counter++ ){
			if(counter <= currentTrack){
				$rootScope.undoList.push(changeList[counter]); 
			}
			else{
				$rootScope.redoList.push(changeList[counter]);
			}
		}
		if($rootScope.redoList.length > 0){
			$('#rmList').addClass("dropdown-menu");
		}
		else{
			$('#rmList').removeClass("dropdown-menu");
		}
		
		
		// changeTrack.splice(changeTrack.length - 1);
		localStorage.setItem("undoChanges", JSON.stringify(changeTrack));
		localStorage.setItem("currentTrack", currentTrack);
		/*$scope.dynamicPopover = "";*/

	};

	$scope.redoChanges = function(redoLevel) {
		var redoIndex = this.items.id;
		var changeTrack = [];
		var changeList = [];
		var currentTrack = 0;
		if (localStorage.getItem("undoChanges") != null) {
			changeTrack = JSON.parse(localStorage.getItem("undoChanges"));
			currentTrack = JSON.parse(localStorage.getItem("currentTrack"));
			changeList = JSON.parse(localStorage.getItem("changeList"));
		}
		
		if ((redoIndex - (changeTrack.length - 1)) == 0) {
			$rootScope.m[0] = changeTrack[changeTrack.length - 1][0];
			currentTrack = changeTrack.length - 1;
		} else {

			$rootScope.m[0] = changeTrack[redoIndex][0];
			currentTrack = redoIndex;
		}
		
		
		$rootScope.undoList.length = 0;
		$rootScope.redoList.length = 0;
		for(var counter = 0; counter < changeList.length; counter++ ){
			if(counter <= currentTrack){
				$rootScope.undoList.push(changeList[counter]); 
			}
			else{
				$rootScope.redoList.push(changeList[counter]);
			}
		}
		
		if($rootScope.redoList.length > 0){
			$('#rmList').addClass("dropdown-menu");
		}
		else{
			$('#rmList').removeClass("dropdown-menu");
		}
		
		localStorage.setItem("undoChanges", JSON.stringify(changeTrack));
		localStorage.setItem("currentTrack", currentTrack);
		
		

	};

};

function calculatePosition(control, propertyWin) {

	var windowSize = $(window).height() + $(window).scrollTop();
	var calculateTop;
	var calculateLeft = $(control.currentTarget).position().left
			+ $(control.currentTarget).width() + $('#' + propertyWin).width();

	if (($(window).width() - 300) < calculateLeft) {
		$('#arrowDiv').removeClass("arrow-left");
		$('#arrowDiv').addClass("arrow-right");
		calculateLeft = $(control.currentTarget).position().left - 290;
	} else {
		$('#arrowDiv').addClass("arrow-left");
		$('#arrowDiv').removeClass("arrow-right");
		calculateLeft = $(control.currentTarget).position().left
				+ $(control.currentTarget).width() + 20;
	}

	if ((windowSize - $(control.currentTarget).position().top) < ($(
			'#' + propertyWin).height() - 20)) {
		calculateTop = $(control.currentTarget).position().top - 350;
		$('#arrowDiv').css({
			top : '340px'
		});
	} else if (($(control.currentTarget).position().top - $(window).scrollTop()) < ($(
			'#' + propertyWin).height() - 20)) {
		calculateTop = ($(control.currentTarget).position().top - 45);
		$('#arrowDiv').css({
			top : '40px'
		});
	} else {
		calculateTop = $(control.currentTarget).position().top - 130;
		$('#arrowDiv').css({
			top : '120px'
		});
	}

	$("#" + propertyWin).closest('div').parent().css({
		top : calculateTop,
		left : calculateLeft
	});
}

function NewattCtrl($scope, $routeParams, $rootScope, $http) {
	$rootScope.newattrscreenArr = [];
	$scope.addOrEdit = $routeParams.addOrEdit;

	if ($scope.addOrEdit == 'add') {
		$scope.subHeader = 'Add New Attribute';
		// for new attr properties
		$http.get('data/Template_Attribute.json').success(
				function(data) {
					$rootScope.newattrproperties = angular.fromJson(data);
					$rootScope.newattrscreenArr = CreateScreenArr(data,
							$scope.addOrEdit);
				});

	} else {

		var attName = $routeParams.attrName.replace(/\_/g, ' ');
		// get the selected attributes data
		$http.get(
				$rootScope.listURI.ApplicationURL + $rootScope.listURI.GetAttributesFullServiceURI + '/' + $routeParams.ElementType + '/'
						+ attName).success(
				function(data) {
					$rootScope.newattrproperties = angular.fromJson(data);
					$rootScope.newattrscreenArr = CreateScreenArr(data,
							$scope.addOrEdit);
				}).error(function(data) {
			$scope.subHeader = 'Attribute Not Found';
			$('#delbtn').css("display", "none");
			$('#subbtn').css("display", "none");

		});

		if ($scope.addOrEdit == 'edit') {
			$scope.subHeader = 'Edit Attribute';
		} else {
			$scope.subHeader = 'Delete Attribute';
			$('#delbtn').css("display", "inline");
			$('#subbtn').css("display", "none");
		}
	}

	// set scope level var
	$scope.ElementType = $routeParams.ElementType;
	// submit
	$scope.submitNewAttr = function(action) {
		// logic to update newattrproperties from newattrscreenArr
		for ( var propIndex = 0; propIndex < $rootScope.newattrscreenArr.length; propIndex++) {
			if ($rootScope.newattrscreenArr[propIndex].idStr == "setTypeNumber") {
				$rootScope.newattrproperties.id[$rootScope.newattrscreenArr[propIndex].idStr] = $scope.ElementType;
			} else {
				$rootScope.newattrproperties.id[$rootScope.newattrscreenArr[propIndex].idStr] = $rootScope.newattrscreenArr[propIndex].value;
			}
		}
		;
		var dataString = $rootScope.newattrproperties;
		var methodNm = "POST";
		var skipHttp = false;
		switch (action) {
		case "submit":
			if ($scope.addOrEdit == 'add') {
				methodNm = "POST";
			} else {
				methodNm = "PUT";
			}
			break;
		case "back":
			skipHttp = true;
			window.location = "#/OCConfigurator-nb-main/" + $routeParams.screenId + "/"
					+ $routeParams.ElementType;
			break;
		case "delete":
			methodNm = "DELETE";
			break;
		}
		if (!skipHttp)
			$http({
				method : methodNm,
				url : $rootScope.listURI.ApplicationURL + $rootScope.listURI.AddAttributeServiceURI,
				data : dataString
			}).success(function(data) {
				$("#SuccessIcon").css("display", "block");
				$("#ErrorIcon").css("display", "none");
			}).error(function(data) {
				$("#SuccessIcon").css("display", "none");
				$("#ErrorIcon").css("display", "block");
			});
	};
	// set to upper case
	$scope.cUpper = function(cObj) {
		cObj.value = cObj.value.toUpperCase();
	};
}

function minNum(nObj) {
	if (nObj.value == '')
		nObj.value = 0;
}
function minSpace(nObj) {
	if (nObj.value == '')
		nObj.value = ' ';
};
function CreateScreenArr(data, action) {
	var newattrscrArr = [];
	for ( var i in data.id) {
		var nameStr;
		var valueStr = data.id[i];
		var type = "text";
		var length = "1";
		nameStr = i;
		switch (i) {
		case "recordWrittenUser":
			type = "disabled";
			valueStr = "CANVAS";
			break;
		case "recordWrittenDate":
			type = "disabled";
			if (action != 'delete')
				valueStr = "" + new Date().getFullYear()
						+ new Date().getMonth() + new Date().getDate();
			break;
		case "recordWrittenTime":
			type = "disabled";
			if (action != 'delete')
				valueStr = "" + new Date().getHours() + new Date().getMinutes()
						+ new Date().getSeconds();
			break;
		case "setTypeNumber":
			nameStr = "viewTypeNumber";
			type = "elementType";
			break;
		case "startPosition":
			type = "number";
			break;
		case "length":
			type = "number";
			break;
		case "decimalPositions":
			type = "number";
			break;
		case "dataType":
			type = "dataType";
			break;
		case "attributeHeading":
			length = "9";
			break;
		case "attributeName":
			length = "20";
			if (action != 'add')
				type = "disabled";
			break;
		case "requiredByRating":
			type = "minSpance";
			break;
		case "displayIndicator":
			type = "minSpance";
			break;
		case "levelIndicator":
			type = "minSpance";
			break;
		}
		if (action == 'delete')
			type = "disabled";
		nameStr = nameStr.replace(/([A-Z])/g, ' $1');
		nameStr = nameStr.replace(/^./, function(str) {
			return str.toUpperCase();
		});
		newattrscrArr.push({
			"name" : nameStr,
			"value" : valueStr,
			"idStr" : i,
			"type" : type,
			"length" : length
		});
	}
	;
	return newattrscrArr;
};
function undoChangesTrack(currentMetadata, listName, $rootScope) {
	var changeTrack = [];
	var changeList = [];
	var currentTrack = 0;
	var metalength = 0; 
	
	if (localStorage.getItem("undoChanges") != null) {
		changeTrack = JSON.parse(localStorage.getItem("undoChanges"));
		currentTrack = JSON.parse(localStorage.getItem("currentTrack"));
		changeList = JSON.parse(localStorage.getItem("changeList"));
	}
	
	
	if((currentTrack == 0)||(currentTrack  == changeTrack.length)){
		changeList.push({"id":changeList.length,"item" :  listName });
		changeTrack.push(currentMetadata);
		currentTrack = currentTrack + 1;
	}
	else{
		metalength = changeTrack.length;
		for(var counter= metalength -1; counter >= 0; counter--){
			if(counter > currentTrack){
				changeTrack.pop(counter);
				changeList.pop(counter);
			}
		}
		
		changeList.push({"id":changeList.length,"item" :  listName });
		changeTrack.push(currentMetadata);
		currentTrack = currentTrack + 1;
	}
		
	
	localStorage.setItem("undoChanges", JSON.stringify(changeTrack));
	localStorage.setItem("changeList", JSON.stringify(changeList));
	localStorage.setItem("currentTrack", currentTrack);
	$rootScope.changeList = angular.fromJson(JSON.stringify(changeList));
	
	$rootScope.undoList = $rootScope.changeList;
	$rootScope.redoList.length = 0; 
	$('#rmList').removeClass("dropdown-menu");
	$rootScope.$apply();

}

var ModalInstanceCtrl = function($scope, $modalInstance, field, $rootScope,$http) {

	// test

	var supportDataString = {
		"Row" : [ {
			"description" : "Problem in REST",
			"value" : "Error:"
		} ]
	};

	if ($rootScope.modalType == "dataSource") {
		if ($("#newField-supportType").get(0).value == "generic") {
			$scope.modalHeaderText = "Look up:";
			$scope.labelDS = "Look up:";
			$scope.displayQuery = 'none';
			$scope.displayLookup = 'block';
			$scope.attrs = $rootScope.attrs;
			if ($rootScope.fieldLookup == undefined
					|| $rootScope.fieldLookup == '') {
				$scope.Fieldlookup = angular.copy(field.name);
			} else {
				$scope.Fieldlookup = $rootScope.fieldLookup;
			}

		} else {
			$scope.modalHeaderText = "Query:";
			$scope.labelDS = "SQL Query:";
			$scope.displayLookup = 'none';
			$scope.displayQuery = 'inline';
			$scope.dynamicHelpPopoverTitle = 'SQL Query Hint:';
			$scope.dynamicHelpPopover = 'Alias for description and value are mandatory. If a variable name is used, it should be encapsulated in @ like @ABCD@';
			$scope.FieldQuery = $rootScope.fieldQuery;
		}
		$scope.displayVR = 'none';
		$scope.displayDS = 'block';
	} else {
		$scope.modalHeaderText = "Regular Expression Validation";
		$scope.displayVR = 'block';
		$scope.displayDS = 'none';
	}
	/*
	 * for ( var ctrElemProp = 0; ctrElemProp < field.properties.length;
	 * ctrElemProp++) { var PropName = field.properties[ctrElemProp].name; var
	 * PropValue = field.properties[ctrElemProp].value; if (PropName ==
	 * 'lookUp') { $scope.Fieldlookup = PropValue; } if (PropName == 'query') {
	 * $scope.FieldQuery = PropValue; } }
	 */

	$scope.helpSQL = function() {

	};

	$scope.regularExpression = field.regexp;

	$scope.verify = function() {
		var regExp;
		var isValid;

		try {
			regExp = new RegExp($('#regExp').get(0).value);
		} catch (e) {
			$("#success").css({
				"display" : "none"
			});
			$("#fail").css({
				"display" : "none"
			});
			$("#warning").css({
				"display" : "block"
			});
			$('#regExp').get(0).value = "";
		}

		isValid = regExp.test($('#regExpVal').get(0).value);

		if (isValid == false) {
			$("#success").css({
				"display" : "none"
			});
			$("#warning").css({
				"display" : "none"
			});
			$("#fail").css({
				"display" : "block"
			});
		} else {
			$("#fail").css({
				"display" : "none"
			});
			$("#warning").css({
				"display" : "none"
			});
			$("#success").css({
				"display" : "block"
			});
		}
	};

	$scope.removeIcon = function() {
		$("#success").css({
			"display" : "none"
		});
		$("#fail").css({
			"display" : "none"
		});
		$("#warning").css({
			"display" : "none"
		});
	};

	$scope.ok = function() {
		$modalInstance.close($('#regExp').get(0).value);
	};

	$scope.buildRegEX = function() {
		window.open("http://gskinner.com/RegExr/", 'frame',
				'scrollbars=1, resizeable,top=0,left=0,height= '
						+ screen.height + ',width=' + screen.width);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.displayAttrText = 'none';
	$scope.displaySupportGrid = 'none';
	$scope.displayAttrText = 'none';
	$scope.supportDataString = [];
	$scope.filterOptions =  { filterText: '', useExternalFilter: false };
	$scope.supportgridOptions = {
		data : 'supportDataString',
		showFilter : false,
		selectedItems: [],
		showSelectionCheckbox: true,
		filterOptions: $scope.filterOptions,
		columnDefs : [ 
		{
			field : 'action',
			displayName : '',
			width:'10%'
		},
		{
			field : 'description',
			displayName : 'Description'
		}, 
		{
			field : 'value',
			displayName : 'Value'

		},
		 {
			field : 'action',
			displayName : 'Apply Mask',
			cellTemplate: "<i style='font-size: medium;color:black;margin-left:10px;'  ng-hide='check' class='icon-plus'  ng-click='saveSupportRestriction(row);check=true;' ng-init='check=false' ></i><i  style='font-size: medium;color:green;margin-left:10px;'  ng-show='check' class='icon-check' ng-show=row.getProperty('assigned')></i>"
		}]


	};
	$scope.attrGrabJson = [];
	$scope.previewData = function() {
		var sqlStr = $("#inputbox").get(0).value;
		var sqlStrArr = sqlStr.split('@');
		var incrmnt = 0;
		for ( var ctri = 0; ctri < sqlStrArr.length; ctri++) {
			var isOdd = function(x) {
				return x & 1;
			};
			if (isOdd(ctri)) {
				var newAttr = sqlStrArr[ctri];
				var attrFound = $.inArray(newAttr, $scope.attrGrabJson);
				if (attrFound == -1) {
					$scope.attrGrabJson[incrmnt] = newAttr;
					incrmnt++;
				}
			}
		}
		;

		var validationAction = validateSQLString($("#inputbox").get(0).value,
				$scope.attrGrabJson, 'preview');
		if (validationAction == "") {
			var attrArr = $scope.attrGrabJson;
			var elmStr = '';
			for ( var ctrn = 0; ctrn < attrArr.length; ctrn++) {
				elmStr = elmStr + '"' + attrArr[ctrn] + '":"'
						+ $('#' + attrArr[ctrn]).get(0).value + '",';
			}
			;
			elmStr = '{' + elmStr.substring(0, elmStr.length - 1) + '}';
			$scope.displayAttrText = 'none';
			$scope.displaySupportErr = 'none';
			var headerObj = {
				"query" : $("#inputbox").get(0).value,
				"params" : elmStr
			};

			$http({
				method : 'GET',
				url : $rootScope.listURI.ApplicationURL + $rootScope.listURI.GetSQLQueryResultsURI,
				headers : headerObj
			})
					.success(function(data) {
						var errorString = {
							"Row" : [ {
								"description" : "Attributes used",
								"value" : ""
							} ]
						};
						$scope.errorDataString = errorString;
						if ($scope.attrGrabJson.length == 0) {
							$scope.displaySupportErr = 'none';
							$scope.displayAttrText = 'none';
						} else {
							$scope.displaySupportErr = 'block';
							$scope.displayAttrText = 'block';
						}
						$scope.displaySupportGrid = 'block';

						$scope.supportDataString = data.Row;

					})
					.error(
							function(data) {
								var errorString;
								$scope.displaySupportErr = 'block';
								$scope.displaySupportGrid = 'none';
								if ($scope.attrGrabJson.length == 0) {
									errorString = {
										"Row" : [ {
											"description" : "Correct the Query, Table/Column Name",
											"value" : "Error:"
										} ]
									};
									$scope.displayAttrText = 'none';
								} else {
									errorString = {
										"Row" : [
												{
													"description" : "Correct the Query, Table/Column Name",
													"value" : "Error:"
												},
												{
													"description" : "Attributes used",
													"value" : ""
												} ]
									};
									$scope.displayAttrText = 'block';
								}
								$scope.errorDataString = errorString;
							});
		} else {
			if (validationAction == "error") {
				var errorString = {
					"Row" : [ {
						"description" : "Specify the value and description column alias",
						"value" : "Error:"
					} ]
				};
				$scope.errorDataString = errorString;
				$scope.displaySupportErr = 'block';
				$scope.displaySupportGrid = 'none';
				$scope.displayAttrText = 'none';
			} else {
				var errorString = {
					"Row" : [ {
						"description" : "Specify the value of the Attributes used",
						"value" : ""
					} ]
				};
				$scope.errorDataString = errorString;
				$scope.displaySupportErr = 'block';
				$scope.displaySupportGrid = 'none';
				$scope.displayAttrText = 'block';
			}
			;
		}
		;
	};

	$scope.okDS = function() {
		var validationAction = validateSQLString($("#inputbox").get(0).value,
				$scope.attrGrabJson, 'save');
		if (validationAction == "" || $rootScope.supportType == "generic") {
			field.support = "true";

			var updsupportType = {};

			updsupportType.name = "supportType";
			updsupportType.value = $rootScope.supportType;

			// del the old prop
			for ( var delprop = field.properties.length - 1; delprop >= 0; delprop--) {
				if (field.properties[delprop].name == "supportType") {
					field.properties.splice(delprop, 1);
				}
			}
			// push the new prop
			field.properties.push(updsupportType);
			if (this.Fieldlookup != null && this.Fieldlookup != ""
					&& this.Fieldlookup != " ") {
				var updlookUp = {};

				updlookUp.name = "lookUp";
				updlookUp.value = this.Fieldlookup;

				// del the old prop
				for ( var delprop = field.properties.length - 1; delprop >= 0; delprop--) {
					if (field.properties[delprop].name == "lookUp") {
						field.properties.splice(delprop, 1);
					}
				}
				for ( var delprop = field.properties.length - 1; delprop >= 0; delprop--) {
					if (field.properties[delprop].name == "query") {
						field.properties.splice(delprop, 1);
					}
				}
				// push the new prop
				field.properties.push(updlookUp);
			}

			if (this.FieldQuery != null && this.FieldQuery != ""
					&& this.FieldQuery != " ") {
				var updquery = {};
				updquery.name = "query";
				updquery.value = $("#inputbox").get(0).value;
				this.FieldQuery = $("#inputbox").get(0).value;
				$rootScope.fieldQuery = this.FieldQuery;
				// del the old prop
				for ( var delprop = field.properties.length - 1; delprop >= 0; delprop--) {
					if (field.properties[delprop].name == "query") {
						field.properties.splice(delprop, 1);
					}
				}
				for ( var delprop = field.properties.length - 1; delprop >= 0; delprop--) {
					if (field.properties[delprop].name == "lookUp") {
						field.properties.splice(delprop, 1);
					}
				}
				// push the new prop
				field.properties.push(updquery);
			}
			// hide modal
			$modalInstance.dismiss('cancel');
		} else {
			if (validationAction == "error") {
				var errorString = {
					"Row" : [ {
						"description" : "Specify the value and description column names",
						"value" : "Error:"
					} ]
				};
				$scope.errorDataString = errorString;
				$scope.displaySupportErr = 'block';
				$scope.displaySupportGrid = 'none';
				$scope.displayAttrText = 'none';
			}
		}
	};

	$scope.saveSupportRestriction = function(rowObj){
		
	  if($("#inputbox").get(0).value != ""){
		var propName;
		
		if(rowObj!=""){
			propName = rowObj.entity.value.trim();
		}
		else{
			propName = $("#inputbox").get(0).value;
		}
		var payLoad = {  
				"elements":
					[
						{
							"usergroup": "ROLE_TechProcess",
		                  	"name": field.name+":"+propName,										
							"mask":"2"
						}
					],
				"screen": $rootScope.m[0].formid+":"+"support"    
		};
		$resource($rootScope.listURI.ApplicationURL+ $rootScope.listURI.UpdateAccessControl).save(payLoad,function(data){
		showMessage(data.Message, "10");
		});
	  }else{
		  showMessage("Enter the Restriction Name", "");
	  }	
	};
	

	/*$scope.saveSupportRestriction = function(rowObj){
		
	  if($("#inputbox").get(0).value != ""){
		var propName;
		
		if(rowObj!=""){
			propName = rowObj.entity.value.trim();
		}
		else{
			propName = $("#inputbox").get(0).value;
		}
		var payLoad = {  
				"elements":
					[
						{
							"usergroup": "ROLE_TechProcess",
		                  	"name": field.name+":"+propName,										
							"mask":"2"
						}
					],
				"screen": $rootScope.m[0].formid+":"+"support"    
		};
		$http(
					{
						method : 'POST',
						url : $rootScope.listURI.ApplicationURL
								+ $rootScope.listURI.UpdateAccessControl,
						data : payLoad												
					}).success(function(data) {	
						showMessage(data.Message, "10");
					});		



		//$resource($rootScope.listURI.ApplicationURL+ $rootScope.listURI.UpdateAccessControl).save(payLoad,function(data){
		//showMessage(data.Message, "10");
		//});
	  }else{
		  showMessage("Enter the Restriction Name", "");
	  }	
	};
	*/
	
$scope.saveMultipleSupportRestriction = function(){
		
		var allChecked = $("input.ngSelectionHeader:checkbox").prop('checked');
		var elements=[];
			angular.forEach($scope.supportgridOptions.selectedItems,function(item,index){
					
					elements.push(
						{
							"usergroup": "ROLE_TechProcess",
		                  	"name": field.name+":"+item.value,										
							"mask":"2"
						}
					);

			});

		var payLoad = {  
				"elements":elements,
				"screen": $rootScope.m[0].formid+":"+"support"
		};
		
		$http(
					{
						method : 'POST',
						url : $rootScope.listURI.ApplicationURL
								+ $rootScope.listURI.UpdateAccessControl,
						data : payLoad												
					}).success(function(data) {	
						showMessage(data.Message, "10");
					});	
		
	};

};

function ScreenToProp(scrnArr) {
	var screenArr = angular.copy(scrnArr);
	for ( var iScrArr = 0; iScrArr < screenArr.length; iScrArr++) {
		var indexP = 0;
		if (screenArr[iScrArr].type != "hidden") {

			for ( var propObj in screenArr[iScrArr]) {
				if (propObj != "name" && propObj != "value") {
					delete screenArr[iScrArr][propObj];
				} else {
					if (propObj == "value") {
						if (screenArr[iScrArr].value == true) {
							screenArr[iScrArr].value = "Y";
						} else {
							if (screenArr[iScrArr].value == false)
								screenArr[iScrArr].value = " ";
						}
					}
				}

				indexP++;
			}
		} else {
			delete screenArr[iScrArr];
		}
	}
	return screenArr;
}

function PropToScreen(metaPropArrO, screenPropArrO, viewType) {
	var metaPropArr = angular.copy(metaPropArrO);
	var screenPropArr = angular.copy(screenPropArrO);

	if (screenPropArr.viewType[viewType] == null) {
		screenPropArr = screenPropArr.viewType["default"];
	} else {
		screenPropArr = screenPropArr.viewType[viewType];
	}
	if (metaPropArr != null) {
		for ( var iCntr = 0; iCntr < metaPropArr.length; iCntr++) {
			for ( var jCtr = 0; jCtr < screenPropArr.length; jCtr++) {
				if (metaPropArr[iCntr] != null && screenPropArr[jCtr].name == metaPropArr[iCntr].name
						&& metaPropArr[iCntr].name != 'DISPLAYSEQ') {
					if (metaPropArr[iCntr].value != ''
							&& metaPropArr[iCntr].value != ' '
							&& metaPropArr[iCntr].value != 'N') {
						screenPropArr[jCtr].value = true;
					} else {
						screenPropArr[jCtr].value = false;
					}
					break;
				} else {
					if (metaPropArr[iCntr] != null && metaPropArr[iCntr].name == 'DISPLAYSEQ') {
						screenPropArr[jCtr].value = metaPropArr[iCntr].value;
					}
				}
			}
		}
	}
	return screenPropArr;
}

function trigSuggest(SourceArr) {
	var triggered = false;
	var trigger = "@";
	var skipIteration = false;
	if (!skipIteration) {
		skipIteration = true;
		for ( var attrIns in SourceArr) {
			SourceArr[attrIns] = SourceArr[attrIns] + '@';
		}
		$("textarea").autocomplete(
				{
					source : SourceArr,
					search : function() {
						if (!triggered) {
							return false;
						}
					},
					select : function(event, ui) {
						var text = this.value;
						var pos = text.lastIndexOf(trigger);

						this.value = text.substring(0, pos + trigger.length)
								+ ui.item.value;

						triggered = false;

						return false;
					},
					focus : function() {
						return false;
					},
					minLength : 0
				}).bind("keyup", function() {
			var text = this.value;
			var len = text.length;
			var last;
			var query;
			var index;

			if (triggered) {
				index = text.lastIndexOf(trigger);
				query = text.substring(index + trigger.length);
				$(this).autocomplete("search", query);
			} else if (len >= trigger.length) {
				last = text.substring(len - trigger.length);
				triggered = (last === trigger);
			}
		});
	}
}

function GridCtrl($scope, $rootScope, GridMetaData, GridData, $routeParams,
		$location, $http) {

	$http
			.get("data/" + $scope.field.gridId + ".json")
			.success(
					function(GridJson) {

						$rootScope.gridMetaData = GridJson.gridMetaData;
						$rootScope.gridColumnDefs = GridJson.gridMetaData.element;
						$rootScope.gridTitle = GridJson.gridMetaData.title;
						$rootScope.gridFunction = GridJson.gridMetaData.operation.jsfunction;

					});

	$scope.gridOptions = {
		data : 'gridData',
		columnDefs : 'gridColumnDefs',
		showFilter : false,
		displaySelectionCheckbox : false,
		showFooter : true,
		footerTemplate : '<div class="subsectiondiv" style="text-align:left;"><div class="titlebox ">Hidden Columns</div><span ng-repeat="columns in gridColumnDefs" class="{{columns.visible}}gridFooter badge">{{columns.displayName}}</span></div>',
		showColumnMenu : false,
		multiSelect : false,
		jqueryUIDraggable : false,
		enableColumnResize: false,
		enableSorting : false,
		enablePaging: false,
		afterSelectionChange : function() {
			//$rootScope[$rootScope.gridFunction](this);
		}
	};
}

function onColumnClick() {

	angular.element(event.target).scope().newField.element = angular.element(
			event.target).scope().gridColumnColl[event.target.selectedIndex];
	angular.element(event.target).scope().$apply();
};

function SelectOptions() {
	angular.element(event.target).scope().newField.selectedoption = angular.element(event.target).scope().newField.options[event.target.selectedIndex];
	
	angular.element(event.target).scope().$apply();
};

function ConversionUtilCtrl($http, $scope, $browser, $rootScope) {

	// for retrieving the View List from REST

	$http({
		method : 'GET',
		url : $rootScope.listURI.ApplicationURL + $rootScope.listURI.GetConversionLIstURI,
		headers : {
			"viewListPath" : $scope.retrieveViewListPath
		}
	}).success(function(viewNamesData) {
		$scope.viewNames = viewNamesData;
	});

	$browser.notifyWhenNoOutstandingRequests(function() {
		// set multiselect rich control
		$('#viewList').multiselect(
				{
					onChange : function(element, checked) {
						$('#viewList-text').text(
								'Selected: ' + $('#viewList').val()).addClass(
								'alert alert-info');
					},
					includeSelectAllOption : true,
					enableFiltering : true,
					maxHeight : 300
					
				});
		$('.multiselect').addClass('btn btn-default');

	});

	// temporary initialize
	$scope.bulkInd = true;
	

	// on submit of the screen
	$scope.postBulkConvert = function() {
		var dataString = {
			"viewNames" : $scope.viewNames
		};

		$http({
			method : 'POST',
			url : $rootScope.listURI.ApplicationURL + $rootScope.listURI.ConvertViewsURI,
			data : dataString,
			headers : {
				"bulk" : $scope.bulkInd
			}
		}).success(function(data) {
			$("#SuccessIcon").css("display", "block");
			$("#ErrorIcon").css("display", "none");
		}).error(function(data) {
			$("#SuccessIcon").css("display", "none");
			$("#ErrorIcon").css("display", "block");
		});

	};
}

function showmetaDiv() {
	$('#metaDiv').show();
	$('#toolDiv').hide();
}

function validateSQLString(str, attrArr, actionType) {
	var actionInd = "";
	var regVal = str.search(/value/i);
	var regDesc = str.search(/description/i);
	if (regVal == -1 || regDesc == -1) {
		actionInd = "error";
		return actionInd;
	}
	if (actionType == 'save') {
		return actionInd;
	}
	var regAttr = str.search(/@/i);
	var valMiss = false;
	if (attrArr.length == 0) {
		valMiss = true;
	}
	for ( var ctr = 0; ctr < attrArr.length; ctr++) {
		if ($('#' + attrArr[ctr]).get(0) == undefined) {
			valMiss = true;
			break;
		}
		if ($('#' + attrArr[ctr]).get(0).value == "") {
			valMiss = true;
			break;
		}
	}
	;
	if (regAttr != -1 && valMiss) {
		actionInd = "noAttr";
		return actionInd;
	}
	return actionInd;
}

function PreviewGridCtrl($scope, $rootScope) {

	$rootScope.gridColumnDefs = $rootScope.gridMetaData.element;
	
	
	$rootScope.pagingOptions = {
	        //pageSizes: [40, 80, 120],
	        pageSize: $rootScope.gridMetaData.pageSize,
	        currentPage: 1
	    };	

	
	$scope.gridOptions = {
		data : 'gridData',
		columnDefs : 'gridColumnDefs',
		displaySelectionCheckbox : false,
		showFooter : true,
		multiSelect : false,
		showGroupPanel: false,
		showFilter : false,
		jqueryUIDraggable : $rootScope.gridMetaData.draggability,
		enableColumnResize: $rootScope.gridMetaData.resizableColumn,
		enableSorting : $rootScope.gridMetaData.enableSorting,
		enablePinning: $rootScope.gridMetaData.pinnableColumn,
		showColumnMenu : $rootScope.gridMetaData.showColumnMenu,
		enablePaging: $rootScope.gridMetaData.enablePaging,
		pagingOptions: $rootScope.pagingOptions,
		/*filterOptions: $scope.filterOptions,*/
		afterSelectionChange : function() {
			//$rootScope[$rootScope.gridFunction](this);
		}
	};
}

function RevisionCtrl($scope, $rootScope, $http, $modalInstance, diffOrHistory, leftmeta, rightmeta, $browser){
	$scope.diffOrHist;
	if (diffOrHistory === 'diff'){
		$scope.diffOrHist = 'diff';
		$scope.warningmsg = 'You are working on an older version, take latest.';		
	}else{
		$scope.warningmsg = 'Difference between current copy and selected revision';
	}
	$browser.notifyWhenNoOutstandingRequests(function() {
		if (diffOrHistory === 'diff'){
			$('#jsonDiffResults').show();
			$('#revisionList').hide();
			$('#btnShowRev').show();
			$('#btnCompare').hide();
			$('#btnLoadSelected').hide();			
			implJsondiff(leftmeta, rightmeta);	
		}	
	});	
	$scope.VersionHistory;
	$scope.pagedData = [];
	var sliceURIParam = $rootScope.listURI.GetMetaModelHistoryURI;
	sliceURIParam = sliceURIParam.replace("{name}",$rootScope.screenId);
	$http.get($rootScope.listURI.ApplicationURL + sliceURIParam)
	.success(function(Historydata){
		$scope.VersionHistory = Historydata.VersionHistory;	
		$scope.pagedData =  Historydata.VersionHistory;
	});
	  
	
	$scope.filterOptions = {
		    filterText: '',
		  };
		 
	$scope.totalServerItems = 0;
	$scope.pagingOptions = {
	        pageSizes: [5, 10, 20],
	        pageSize: 5,
	        currentPage: 1
	    };
	
	$scope.setPagingData = function(data, page, pageSize){	
		$scope.pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.sortInfo =    { fields: 'VersionNumber', directions: 'desc' };
    
	 $scope.$watch('pagingOptions', function (newVal, oldVal) {
	        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
	        	$scope.setPagingData($scope.VersionHistory, $scope.pagingOptions.currentPage ,$scope.pagingOptions.pageSize);
	        }
	    }, true);
	$scope.gridSelections = [];
	$scope.revisionGridOptions = {
			data : 'pagedData',
			multiSelect : false,
			enablePaging : true,
			totalServerItems:'totalServerItems',
	        pagingOptions: $scope.pagingOptions,
			filterOptions: $scope.filterOptions,
			selectedItems: $scope.gridSelections,
			enableSorting: true,
			sortinfo: $scope.sortInfo,
	        showFooter: true,
	        
			columnDefs : [ {
				field : 'VersionNumber',				
				displayName : 'Version',
				width: '15%'
			}, {
				field : 'VersionDate',
				displayName : 'Date',
				width: '35%'
			}, {
				field : 'VersionTags',
				displayName : 'Remarks',				
				cellTemplate: '<div class="ngCellText" style="white-space:normal" ><span ng-repeat="Tag in row.entity.VersionTags" title={{Tag}} >{{Tag}} </span></div>'
			} ]
	};
	
	
	
	$scope.loadSelected = function(){
		$scope.diffOrHist = 'nodiff';
		var selectedVersion = $scope.gridSelections[0].VersionNumber;
		var urlstr =  $rootScope.listURI.ApplicationURL + $rootScope.listURI.GetMetaModelVersionURI;
		urlstr = urlstr.replace("{name}", $rootScope.screenId);
		urlstr = urlstr.replace("{versionNo}",selectedVersion);	
		$http({
			method : 'GET',
			url : urlstr
			}).success(function(revData) {
				if (urlstr.indexOf('metamodel/grid') === -1){
				$scope.$parent.m[0] = angular.fromJson(revData.metadata);		
				}
				else{
					$rootScope.gridMetaData = revData.gridMetaData;
					$rootScope.gridColumnDefs = revData.gridMetaData.element;
					$rootScope.gridTitle = revData.gridMetaData.title;
					$rootScope.gridFunction = revData.gridMetaData.operation.jsfunction;
					$rootScope.gridColumnDefs.gridName = $scope.gridId;
				}
				$modalInstance.dismiss('cancel');
			});
		
	};
	
	$scope.getLatest = function(){
		var sliceURIParam = $rootScope.listURI.GetMetaModelURI;
		sliceURIParam = sliceURIParam.replace("/{name}","");
		var urlstr = $rootScope.listURI.ApplicationURL + sliceURIParam + '/' + $rootScope.screenId;
		$http({
			method : 'GET',
			url : urlstr
			}).success(function(latestRev) {
				$scope.$parent.m[0] = angular.fromJson(latestRev.metadata);
				var latestmeta = angular.copy(angular.fromJson(latestRev.metadata));
				$scope.$parent.metamodel[0] = latestmeta;
				$modalInstance.dismiss('cancel');
			});
	};
	
	$scope.CompareSelected = function(){
		$scope.diffOrHist = 'nodiff';
		$('#jsonDiffResults').show();
		$('#revisionList').hide();
		$('#btnShowRev').show();
		$('#btnCompare').hide();
		$('#btnLoadSelected').hide();
		var selectedVersion = $scope.gridSelections[0].VersionNumber;
		var urlstr =  $rootScope.listURI.ApplicationURL + $rootScope.listURI.GetMetaModelVersionURI;
		urlstr = urlstr.replace("{name}", $rootScope.screenId);
		urlstr = urlstr.replace("{versionNo}",selectedVersion);	
		$http({
			method : 'GET',
			url : urlstr
			}).success(function(revData) {
				if (urlstr.indexOf('metamodel/grid') === -1){
				  startCompare(angular.toJson(revData.metadata),angular.toJson($scope.$parent.m[0]));		    
				}else{
				    startCompare(angular.toJson(revData.gridMetaData),angular.toJson($rootScope.gridMetaData));
				}    	
			});	
				
	};
	$scope.cancelrev = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.ShowRevisions = function(){
		$scope.diffOrHist = 'nodiff';
		$('#jsonDiffResults').hide();
		$('#revisionList').show();
		$('#btnShowRev').hide();
		$('#btnCompare').show();
		$('#btnLoadSelected').show();
	};

	
}
function ImportCtrl($http, $scope, $rootScope,$routeParams){
	$rootScope.openModal();
	var urlstr = '';
	$scope.Type = $routeParams.type;
	if ($routeParams.type == "meta"){
		urlstr = $rootScope.listURI.ApplicationURL + $rootScope.listURI.ImportMetaModelURI;
	}
	if ($routeParams.type == "grid"){
		urlstr = $rootScope.listURI.ApplicationURL + $rootScope.listURI.ImportGridMetaModelURI;
	}
	if ($routeParams.type == "support"){
		urlstr = $rootScope.listURI.ApplicationURL + $rootScope.listURI.ImportSupportMetaDataURI;
	}	
	
	if (urlstr != ''){
	$http({
		method : 'POST',
		url : urlstr
		}).success(function(importedData) {
			$rootScope.closeModal();
			if(importedData.length === 0){
				$('#viewList-text').text('All of the ' + $scope.Type + ' data files are already imported').addClass(
				'alert alert-info');
			}else{
			$('#viewList-text').text(importedData).addClass(
			'alert alert-info');
			}
		});
	}
			
}
