'use strict';
/*
global angular
*/

/*
exported ScreenController
*/

var screenname;
function ScreenController($http, $scope, $rootScope,$controller, $injector,$routeParams, $location, growl,MetaModel, resourceFactory, TableMetaModel, EnumerationService, CheckVisibleService, $q) {

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
    $scope.disableNext = false;
    $rootScope.metamodel= {}; 
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
    }else{
        $rootScope.regionId = undefined;
    }
    
    //if($routeParams.screenId === undefined){
       // $routeParams.screenId='login';
          //  $location.path('/screen/login');
   // }
    if ($routeParams.screenId.indexOf(':') !== -1) {
        reqParmScreen = $routeParams.screenId.split(':');
        $rootScope.screenId = reqParmScreen[1];
        screenExist = true;
    } else {
        reqParmScreen = $routeParams.screenId;
        $rootScope.screenId = reqParmScreen;
    }
      
    // reset data after edited and back to search screen
    if($routeParams.screenId.indexOf('search') !== -1 || $routeParams.screenId.indexOf('dashboard')!== -1 ){
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

    $scope.getNamesList = function(viewValue, field){        
        if(field.typeahead){
            var url = '';
            var param = '';
            var vehicle_make = '';
            var vehicle_model = '';
            
            if (field.typeaheadField === 'referential_vehicle:make') {
                vehicle_make = field.typeaheadField + '=' + viewValue;
                param = vehicle_make;
                url = $rootScope.HostURL + 'referential_vehicle_makes?' + param;
            } else if (field.typeaheadField === 'referential_vehicle:model') {   
                vehicle_model = field.typeaheadField + '=' + viewValue;         
                var arrparent = $rootScope.metamodel[$rootScope.currName].sections; 
                for(var i = 0; i < arrparent.length; i++){
                    var arr = arrparent[i].elements;
                    for(var j = 0; j < arr.length; j++){
                        var object = arr[j];
                        if(object.name === field.enableWhen.expression.field){                            
                            if(object.typeaheadField !== undefined && object.typeaheadField !== null && object.typeaheadField !== ''){
                                vehicle_make = object.typeaheadField + '=' + $scope.data[field.enableWhen.expression.field] + '&';
                            }
                        }
                    }
                }               
                param =  vehicle_make + vehicle_model;
                url = $rootScope.HostURL + 'referential_vehicle_models?' + param;
            } else {
                url = $rootScope.HostURL + 'persons?' + field.typeaheadField + '=' + viewValue;
            }

            var regionToSORMap = $rootScope.regionToSoR;
            var applName = regionToSORMap[$rootScope.regionId];
            url = url.replace(':regionId',applName);
            resourceFactory.options(url, $rootScope.headers).success(function(responseData){
                var data = responseData.data || responseData;
                $rootScope.typeaheadData[field.typeaheadField] = [];
                $scope.typeaheadData[field.typeaheadField] = [];
                var items = convertToArray(data._links.item);
                angular.forEach(items, function(value){
                    if(value.summary[field.typeaheadField]){
                        $rootScope.typeaheadData[field.typeaheadField].push(value.summary[field.typeaheadField]);
                    }
                });
                $scope.typeaheadData[field.typeaheadField] = $rootScope.typeaheadData[field.typeaheadField];
            });
        }
    };

    $scope.checkEnable = function(field)
    {
        if(field.enableWhen)
        {
            return ($scope.data[field.enableWhen.expression.field] !== undefined && $scope.data[field.enableWhen.expression.field] !== null && $scope.data[field.enableWhen.expression.field] !== '') ? false : true;
        }
        return false;
    };

    function convertToArray(data) {
        if(data !== undefined && data.length === undefined){
            var array = [];
            array.push(data);
            return array;
        }
        return data;
    }

	MetaModel.setHeaders($rootScope);

    $scope.loadTableMetadata = function(section) {
       
        $scope.field={};

        TableMetaModel.load(section.name, function(tableMetaModel) {
            $scope.field.tableMetaModel = tableMetaModel;           
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

	// Dynamic Injection of Factory

    // function _injectfactory(){
    //     _clearFactory();

    //     $scope.factoryName = $scope.screenId + 'Factory';
    //     try {
           
    //         $scope.factory = $injector.get($scope.factoryName);
            
    //         Object.keys($scope.factory).forEach(function(method){
    //             $scope[method] = (function(operation) {
    //                 var operation = operation;
    //                 return function(params) {
    //                     return $scope.factory[operation]($scope, params);
    //                 };
    //             })(method);

    //         });
            

    //     } catch(e){
    //         console.log($scope.factoryName+' not found!');
    //     }
    // }

    // function _clearFactory(){
    //     if($scope.factoryName && $scope.factory){
    //         for (var operation in $scope.factory) {
    //             delete $scope[operation];
    //         }
    //     }
    // }
    
    
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

    $scope.doaction = function(method, subsections, action, actionURL, nextScreenId, tab, tabNavigate) {

       console.log(nextScreenId);
        var screenId = $rootScope.screenId;
        var regionId = $rootScope.regionId;
        $rootScope.action = action;
        if(action==='navigate'){
	        var resourcelist=$rootScope.metamodel[screenId].resourcelist;
            var url = $rootScope.HostURL + resourcelist;
            var regionToSORMap = $rootScope.regionToSoR;
            var applName = regionToSORMap[regionId];
            var newURL = url.replace(':regionId',applName);
            $rootScope.resourceHref =newURL;
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
            if ($scope.isValid() && !$scope.isPending()) {
            if(msg !== undefined){
                msg.destroy();    
            }
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
            $q(function(resolve) {
                var optionFlag = false;
                $scope.patchFieldName = undefined;
                MetaModel.actionHandling(undefined, $scope, regionId, screenId, action, resourceFactory, nameTab, optionFlag, resolve);
            }).then(function(){
                if(tab !== undefined){
                        //var url=$rootScope.resourceHref + '/operations/tariff_calculation/execute';
                        resourceFactory.options($rootScope.resourceHref, $rootScope.headers).success(function(responseData){
                            var data = responseData.data || responseData;
                            var urlOperations = data._links[tab[1]].href;
                            resourceFactory.options(urlOperations, $rootScope.headers).success(function(responseData){
                                var data = responseData.data || responseData;
                                var urlCalculation;
                                var item = data._links.item;
                                if(Array.isArray(item)){
                                    // get first element of array
                                    urlCalculation = item[0].href;
                                } else {
                                    urlCalculation = item.href;
                                }
                                resourceFactory.options(urlCalculation, $rootScope.headers).success(function(responseData){
                                    var data = responseData.data || responseData;
                                    var urlExecute = data._links[tab[2]].href;
                                    var params = {};
                                    resourceFactory.post(urlExecute,params,$rootScope.headers).success(function(responseData){
                                        var data = responseData.data || responseData;
                                        var urlDetail;
                                        if(Array.isArray(data.messages)){
                                            // get last element of array
                                            urlDetail = data.messages[data.messages.length - 1].message[0];
                                        } else {
                                            urlDetail = data.messages.context;
                                        }
                                        resourceFactory.refresh(urlDetail,params,$rootScope.headers).success(function(responseData){
                                            var data = responseData.data || responseData;
                                            $scope.data = data;
                                            console.log('Compute successfully !!');
                                            // go to next tab to see premium
                                            $rootScope.step = $rootScope.step + 1;
                                            loadRelationshipByStep($rootScope.step);
                                            $scope.preStep = $rootScope.step;
                                            EnumerationService.executeEnumerationFromBackEnd(data, 'create');
                                        });
                                    }).error(function(err){

                                        // Show error message when Calculate Premium failed 
                                        var mess = '';
                                        if(err.Errors){
                                            var arrayErr = convertToArray(err.Errors);                                           
                                            mess = arrayErr.map(function(elem){
                                                return elem.Reason;
                                            }).join('\n');                                            
                                        } else{
                                            mess = $rootScope.locale.CALC_PREMIUM_OP_FAILED;                                                
                                        } 
                                        growl.error(mess); 
                                    });
                                });
                            });
                        });
                }else if (tabNavigate !== undefined) {
                    $rootScope.step = $rootScope.step + 1;
                    loadRelationshipByStep($rootScope.step);
                    $scope.preStep = $rootScope.step;
                } else{
                    EnumerationService.loadEnumerationByTab();
                }
            });
        } }
    };

    $scope.getRelationshipOfNavigateStep = function(step){
        var list = $rootScope.metamodel[$rootScope.screenId].sections;
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
        resourceFactory.getData(url).success(function(responseData){
            var data = responseData.data || responseData;
            $scope.enumdata=data;       
     });
    };

    $scope.preStep = 1;
    $scope.preRel = undefined;
    $rootScope.currRel = undefined;
    $rootScope.currName = undefined;
    $scope.pendingFields = [];

    function loadRelationshipByStep(step){
        if($rootScope.metamodel[$rootScope.screenId]){
            var list = $rootScope.metamodel[$rootScope.screenId].sections;
            angular.forEach(list, function(tabObj){
                if(step === tabObj.step){
                    $rootScope.currRel = tabObj.link;
                    $rootScope.currName = tabObj.$ref;
                } 
            });
        }
    }
    $q(function(resolve) {
        MetaModel.load($scope, (regionExist ? reqParmRegion[1] : reqParmRegion), (screenExist ? reqParmScreen[1] : reqParmScreen), resolve);
    }).then(function(){
    
        loadRelationshipByStep($scope.preStep);
         if($rootScope.regionId === 'us') {
            $rootScope.currRel = 'itself';
        } 

        if($rootScope.screenId.indexOf('search') !== -1 ){
           EnumerationService.loadEnumerationByTab();
        }  
        // load data for tab click
        if($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself' && $scope.regionId !== 'us'){
            $scope.loadDataByTab($rootScope.currRel);
        } else if($rootScope.resourceHref !== undefined) {
            var params = {};
            if($rootScope.action !== undefined)
            {
                resourceFactory.get($rootScope.resourceHref, params, $rootScope.headers).success(function(responseData){
                    var data = responseData.data || responseData;
                    if (data) {
                        $scope.data=data;
                        EnumerationService.executeEnumerationFromBackEnd(data, 'create');
                        if($rootScope.regionId === 'us'){
                            EnumerationService.executeEnumerationFromBackEnd(data, 'fetch');    
                        }
                    }
                });
            }            
        }
    });

    $scope.selecttab = function(step1, rel) {
        if ($scope.isValid() && !$scope.isPending()) {
            if(msg !== undefined){
                msg.destroy();    
            }
            $rootScope.step = step1;
            $rootScope.currRel = rel;
            
            loadRelationshipByStep($scope.preStep);
            $scope.preStep = $rootScope.step;
            loadRelationshipByStep($scope.preStep);            
            if ($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself') {
                    $scope.loadDataByTab($rootScope.currRel);
            } else {
                var params = {};
                resourceFactory.get($rootScope.resourceHref, params, $rootScope.headers).success(function(responseData){           
                var data = responseData.data || responseData;
                    if (data) {
                        $scope.data=data;
                        EnumerationService.executeEnumerationFromBackEnd(data, 'create');
                    }
                });                
            }

        }
    };

    $scope.patchField = function(fieldName){
        if($.inArray(fieldName, $scope.pendingFields) === -1){
            $scope.pendingFields.push(fieldName);
        }        
        $scope.patchFieldName = fieldName;
        // not apply patch field for us
        if ($rootScope.regionId !== 'us') { 
            if($scope.isValidByField(fieldName)){
                $q(function(resolve) {
                    MetaModel.actionHandling(undefined, $scope, $rootScope.regionId, $rootScope.screenId, 'update', resourceFactory, $rootScope.currRel, true, resolve);                  
                }).then(function(){
                    var index = $scope.pendingFields.indexOf(fieldName);
                    $scope.pendingFields.splice(index, 1);
                });
            }
        }
    };


    $scope.loadDataByTab = function (tab) {

        var url = $rootScope.resourceHref;

        if (url !== undefined) {
            if($rootScope.action !== undefined) {
                resourceFactory.options(url, $rootScope.headers).success(function(responseData){

                    var data = responseData.data || responseData;
               
                    //Fetch the links response
                    if(data !== undefined && data._links !== undefined && data._links[tab] !== undefined){
                        var tabUrl = data._links[tab].href;

                        resourceFactory.options(tabUrl, $rootScope.headers).success(function(responseData){

                            var data = responseData.data || responseData;
               
                            var detailTabUrl = data._links.item.href;

                            var params = {};
                            resourceFactory.get(detailTabUrl, params, $rootScope.headers).success(function(responseData){

                                 var data = responseData.data || responseData;
               
                                if (data) {
                                    $scope.data=data;
                                    EnumerationService.executeEnumerationFromBackEnd(data, 'update');
                                }
                            });                        
                        });    
                    }
                });
            }
        }

    };

    var msg;

    $scope.isPending = function(){
        var message = '';
        if ($rootScope.regionId !== 'us') { 
            if ($scope.pendingFields && $scope.pendingFields.length > 0) {            
                $scope.pendingFields.forEach(function(key) {
                    var label = $scope.translateKeyToLabelByTab(key);
                    message += $rootScope.locale[label] + $rootScope.locale.IS_BEING_PATCHED + '<br />';
                });            
                msg = growl.error(message);
                return true;
            } 
        }
        return false;
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
           msg = growl.error(message);
            return false;
        }

        return true;
    };

    $scope.isValidByField = function(fieldName){
        var message = '';
        if($scope.isMandatoryField(fieldName)){
            if($scope.data[fieldName] !== undefined && $scope.data[fieldName] !== null){
                return true;
            }
            var label = $scope.translateKeyToLabelByTab(fieldName);
            message = $rootScope.locale[label] + $rootScope.locale.IS_REQD;
            growl.error(message);
            return false;
        }
        return true;
    };

    $scope.isMandatoryField = function(fieldName){
        var arrMandatoryField = $scope.loadmandatoryField();
        if($.inArray(fieldName, arrMandatoryField) !== -1){                    
            return true;
        }
        return false;
    }; 

    $scope.loadmandatoryField = function(){
        var mandatoryField = [];
        var arrparent;
        if($rootScope.currName)
        {
        arrparent = $rootScope.metamodel[$rootScope.currName].sections;
        }
        else
        {
        arrparent = $rootScope.metamodel[$rootScope.screenId].sections;
        }
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
         var arrparent;
        if($rootScope.currName){
        arrparent = $rootScope.metamodel[$rootScope.currName].sections;
        }
        else
        {
         arrparent = $rootScope.metamodel[$rootScope.screenId].sections;
        }
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