'use strict';
/*
global angular
*/

/*
exported ScreenController
*/

var screenname;
function ScreenController($http, $scope, $rootScope,$controller, $injector,$routeParams, $location, growl,MetaData, resourceFactory, TableMetaData, EnumerationService, CheckVisibleService) {

    $rootScope.enumData = {};
    $rootScope.typeaheadData = {};
    $rootScope.optionsMap = [];
    $scope.checkRegionId = $rootScope.regionId;

    $scope.showErr = function () {       
        growl.error('<b>Error:</b> Uh oh!');
        growl.info('Im  a info message');
        growl.warn('Im  a warn message');
        growl.success('Im  a success message');
    };
   
	screenname  = 'OmniChannel';
	$rootScope.showHeader = true;
	$scope.disableNext = false;

	$scope.rulesDataList = [];
	var reqParmScreen = null;
	var reqParmRegion = null;
	var screenExist = false;
	var regionExist = false;
	$scope.data = {};
	$scope.remove = 'ban-circle';
	$scope.removestyle = 'red';	
	$scope.dateOptions = {
     	changeYear: true,
        changeMonth: true,
        yearRange: '1900:2030',
    };
	$rootScope.typeahead =[];

	if($routeParams.regionId !== undefined && $routeParams.regionId.length > 0){
	if ($routeParams.regionId.indexOf(':') !== -1) {
		reqParmRegion = $routeParams.regionId.split(':');
		$rootScope.regionId = reqParmRegion[1];
		regionExist = true;
	}else{
		reqParmRegion = $routeParams.regionId;
		$rootScope.regionId = reqParmRegion;
	}
	}

	if ($routeParams.screenId.indexOf(':') !== -1) {
		reqParmScreen = $routeParams.screenId.split(':');
		$rootScope.screenId = reqParmScreen[1];
		screenExist = true;
	} else {
		reqParmScreen = $routeParams.screenId;
		$rootScope.screenId = reqParmScreen;
	}
      
    // reset data after edited and back to search screen
    if($routeParams.screenId.indexOf('search') !== -1){
        $rootScope.resourceHref = undefined;
    }
	
	$rootScope.navigate = function(url, product_id) {
        $rootScope.product_id = product_id;
        $location.path(url);
    };

    $scope.getEnums = function(field) {
        if ($rootScope && $rootScope.enumData && $rootScope.enumData[field.name]) {
            return $rootScope.enumData[field.name];
        } else if (field.options) {
            return field.options;
        }
    };

    $scope.getNamesList = function(viewValue, typeahead, fieldName){
        
        if(typeahead){
            var url = $rootScope.HostURL + 'persons?' + fieldName + '=' + viewValue;
            var regionToSORMap = $rootScope.regionToSoR;
            var applName = regionToSORMap[$rootScope.regionId];
            url = url.replace(':regionId',applName);
            resourceFactory.options(url, $rootScope.headers).success(function(data){
                $rootScope.typeaheadData[fieldName] = [];
                $scope.typeaheadData[fieldName] = [];
                angular.forEach(data._links.item, function(value){
                    if(value.summary[fieldName]){
                        $rootScope.typeaheadData[fieldName].push(value.summary[fieldName]);
                    }
                });
                $scope.typeaheadData[fieldName] = $rootScope.typeaheadData[fieldName];
            });
        }
    };

	MetaData.setHeaders($rootScope);

    $scope.loadTableMetadata = function(section) {
       
        $scope.field={};

        TableMetaData.load(section.name, function(tableMetaData) {
            $scope.field.tableMetaData = tableMetaData;           
        });
    };
	
	$rootScope.navigate = function(url, product_id) {
        $rootScope.product_id = product_id;
        $location.path(url);
    };

    $scope.checkvisible = function(field)
	{
		if(field.visibleWhen)
		{
			return CheckVisibleService.checkVisible(field, $scope);
		}
		return true;
	};
	
	$scope.loadMetaData = function() {
		$rootScope.metadata = {};
		MetaData.load($scope, (regionExist ? reqParmRegion[1] : reqParmRegion), (screenExist ? reqParmScreen[1] : reqParmScreen));
	};

	// Dynamic Injection of Factory

	$scope.Injectfactory=function(){	
		$scope.factoryname=$scope.screenId+'factory';

        try{
          
	        $scope.factory = $injector.get($scope.factoryname);
	        //console.log('Injector has '+$scope.factoryname+' service!');
        }catch(e){
         console.log('Injector does not have '+$scope.factoryname+' service!');
        }
	};
	
	$rootScope.isPrev = false;
	
	$scope.loadOptionData = function() {
		 var url = $rootScope.resourceHref;
		 if (url === undefined) {	
				url = $rootScope.HostURL+$scope.screenId;
		 }
		 
	};

	$scope.loadOptionData();
    
    $scope.stTableList = [];
    $scope.displayed = [];
    $scope.stTableList.showResult = true;

	$scope.doaction = function(method, subsections, action, actionURL, nextScreenId, tab) {

       console.log(nextScreenId);
		var screenId = $rootScope.screenId;
		var regionId = $rootScope.regionId;
		if(action==='navigate'){
            $rootScope.resourceHref = undefined;
            $rootScope.navigate(actionURL);
        }
        else if(action==='nextTab'){
            var nextStep = $rootScope.step + 1;
            var nextLink = $scope.getRelationshipOfNavigateStep(nextStep);
            $scope.selecttab(nextStep, nextLink);
        }
        else if(action==='previousTab'){
            var preStep = $rootScope.step - 1;
            var preLink = $scope.getRelationshipOfNavigateStep(preStep);
            $scope.selecttab(preStep, preLink);
        } else {
            if(tab === undefined){
                $rootScope.resourceHref = undefined;
            }
            if(actionURL !== undefined){
                $rootScope.navigate(actionURL);    
            }
            var nameTab;
            if(tab !== undefined && Array.isArray(tab)){
                nameTab = tab[0];
            }
            new Promise(function(resolve) {
                var optionFlag = false;
                MetaData.actionHandling(undefined, $scope, regionId, screenId, action, resourceFactory, nameTab, optionFlag, resolve);
            }).then(function(){
                if(tab !== undefined){
                        //var url=$rootScope.resourceHref + '/operations/tariff_calculation/execute';
                        resourceFactory.options($rootScope.resourceHref, $rootScope.headers).success(function(data){
                            var urlOperations = data._links[tab[1]].href;
                            resourceFactory.options(urlOperations, $rootScope.headers).success(function(data){
                                var urlCalculation;
                                var item = data._links.item;
                                if(Array.isArray(item)){
                                    // get first element of array
                                    urlCalculation = item[0].href;
                                } else {
                                    urlCalculation = item.href;
                                }
                                resourceFactory.options(urlCalculation, $rootScope.headers).success(function(data){
                                    var urlExecute = data._links[tab[2]].href;
                                    var params = {};
                                    resourceFactory.post(urlExecute,params,$rootScope.headers).success(function(data){
                                        var urlDetail;
                                        if(Array.isArray(data.messages)){
                                            // get last element of array
                                            urlDetail = data.messages[data.messages.length - 1].message[0];
                                        } else {
                                            urlDetail = data.messages.context;
                                        }
                                        resourceFactory.get(urlDetail,params,$rootScope.headers).success(function(data){
                                            $scope.data = data;
                                            console.log('Compute successfully !!');
                                            // go to next tab to see premium
                                            $rootScope.step = $rootScope.step + 1;
                                            loadRelationshipByStep($rootScope.step);
                                            $scope.preStep = $rootScope.step;
                                            EnumerationService.executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'create');
                                        });
                                    }).error(function(){
                                        //showMessage($rootScope.locale.CALC_PREMIUM_OP_FAILED);
                        				growl.error($rootScope.locale.CALC_PREMIUM_OP_FAILED);
                                    });
                                });
                            });
                        });
                }else{
                    EnumerationService.loadEnumerationByTab();
                }
            });
        }
    };

    $scope.getRelationshipOfNavigateStep = function(step){
        var list = $rootScope.metadata[$rootScope.screenId].sections;
        for(var i = 0; i < list.length; i++){
            var tabObj = list[i];
            if(step === tabObj.step){
                return tabObj.link;
            }
        }
    };
  	  
	$rootScope.next = function() {
        $scope.next();
    };
	
	$scope.next = function() {
	};
	 
	$rootScope.step=1;

	$scope.getenumdata=function(){
	   	var url = 'https://oc-sample-dropdown.getsandbox.com/omnichannel/sample/select';
        resourceFactory.getData(url).success(function(data){
		$scope.enumdata=data;   	
     });
    };

    $scope.preStep = 1;
    $scope.preRel = undefined;
    $rootScope.currRel = undefined;
    $rootScope.currName = undefined;

    function loadRelationshipByStep(step){
        var list = $rootScope.metadata[$rootScope.screenId].sections;
        angular.forEach(list, function(tabObj){
            if(step === tabObj.step){
                $rootScope.currRel = tabObj.link;
                $rootScope.currName = tabObj.$ref;
            } 
        });
    }
    new Promise(function(resolve) {
        MetaData.load($scope, (regionExist ? reqParmRegion[1] : reqParmRegion), (screenExist ? reqParmScreen[1] : reqParmScreen), resolve);
    }).then(function(){
        loadRelationshipByStep($scope.preStep);
        EnumerationService.loadEnumerationByTab();
        // load data for tab click
        if($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself' && $scope.regionId !== 'us'){
            $scope.loadDataByTab($rootScope.currRel);
        } else if($rootScope.resourceHref !== undefined) {
            var params = {};
            resourceFactory.get($rootScope.resourceHref, params, $rootScope.headers).success(function(data){
                if (data) {
                    $scope.data=data;
                }
            });
            EnumerationService.executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'create');
        }
    });

    $scope.selecttab = function(step1, rel) {
        var screenId = $rootScope.screenId;
        var regionId = $rootScope.regionId;

        if ($scope.isValid()) {
            $rootScope.step = step1;
            $rootScope.currRel = rel;

            new Promise(function(resolve) {
                // patch for previous tab
                if ($rootScope.step !== $scope.preStep && rel !== 'undefined') {
                    loadRelationshipByStep($scope.preStep);
                    if (regionId !== 'us') {
                        var optionFlag = true;
                        MetaData.actionHandling(undefined, $scope, regionId, screenId, 'update', resourceFactory, $scope.currRel, optionFlag, resolve);
                    }
                    $scope.preStep = $rootScope.step;
                    loadRelationshipByStep($scope.preStep);
                }
            }).then(function() {
                // load data for tab click
                if ($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself') {
                    $scope.loadDataByTab($rootScope.currRel);
                } else {
                    var params = {};
                    resourceFactory.get($rootScope.resourceHref, params, $rootScope.headers).success(function(data){
                        if (data) {
                            $scope.data=data;
                        }
                    });
                    EnumerationService.executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'create');
                }

            });
        }
    };

	$scope.loadDataByTab = function (tab) {

	    var url = $rootScope.resourceHref;

		if (url !== undefined) {
			resourceFactory.options(url, $rootScope.headers).success(function(data){
	            //Fetch the links response
                if(data !== undefined && data._links !== undefined && data._links[tab] !== undefined){
                    var tabUrl = data._links[tab].href;

                    resourceFactory.options(tabUrl, $rootScope.headers).success(function(data){
                        var detailTabUrl = data._links.item.href;

                        var params = {};
                        resourceFactory.get(detailTabUrl, params, $rootScope.headers).success(function(data){
                            if (data) {
                                $scope.data=data;
                            }
                        });
                        EnumerationService.executeEnumerationFromBackEnd(detailTabUrl, $rootScope.headers, 'update');
                    });    
                }
	        });
		}

	};

	$scope.isValid = function(){
        var dataField = [];
        var mandatoryField = $scope.loadmandatoryField();
        var emptyField = [];
        var message = '';

        angular.forEach($scope.data, function(value, key){
             if(value !== '' && value !== undefined && key !== '_links' && key !== '_options' && value !== null){
                dataField.push(key);
             }
        });

        mandatoryField.forEach(function(entry) {
            if($.inArray(entry, dataField) === -1){                    
                console.log(entry);
                emptyField.push(entry);
            }
        });

        if(emptyField.length > 0){
            emptyField.forEach(function(key) {
                var label = $scope.translateKeyToLabelByTab(key);
                message += $rootScope.locale[label] + $rootScope.locale.IS_REQD + '<br />';
            });
            //showMessage(message);
            growl.error(message);
            return false;
        }

        return true;
    };

    $scope.loadmandatoryField = function(){
    	var mandatoryField = [];
    	var arrparent = $rootScope.metadata[$rootScope.currName].sections;
    	for(var i = 0; i < arrparent.length; i++){
    		var arr = arrparent[i].elements;
    		for(var j = 0; j < arr.length; j++){
	    		var object = arr[j];
	    		if(object.required !== undefined && object.required === 'required'){
	    			mandatoryField.push(object.name);
	    		}
	    	}
    	}
    	return mandatoryField;
    };

    $scope.translateKeyToLabelByTab = function(key){
    	var arrparent = $rootScope.metadata[$rootScope.currName].sections;
    	for(var i = 0; i < arrparent.length; i++){
    		var arr = arrparent[i].elements;
    		for(var j = 0; j < arr.length; j++){
	    		var object = arr[j];
	    		if(object.name === key){
	    			return object.label;
	    		}
	    	}
    	}
    };
}