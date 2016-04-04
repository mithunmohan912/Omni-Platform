'use strict';
/*
global angular
*/

/*
exported ScreenController
*/

var screenname;
function ScreenController($http, $scope, $rootScope,$controller, $injector,$routeParams, $location, growl,MetaData, HttpService, dataFactory, TableMetaData) {
	   
     //console.log('hello');

    $rootScope.enumData = {};
    $rootScope.optionsMap = [];
    $scope.checkRegionId = $rootScope.regionId;

	    $scope.showErr = function () {
       
        growl.addErrorMessage('<b>Error:</b> Uh oh!');
        growl.addInfoMessage('Im  a info message');
        growl.addWarnMessage('Im  a warn message');
        growl.addSuccessMessage('Im  a success message');
    };


    
	screenname  = 'Omnichannel';
	$rootScope.showHeader = true;
	$scope.disableNext = false;
	var seedPayLoad = {};
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

	MetaData.setHeaders($rootScope);

    function loadEnumerationByTab(){
    	if($rootScope.resourceHref && $rootScope.currRel){
		    var url = $rootScope.resourceHref + '/' +  $rootScope.currRel + 's';
		    dataFactory.options(url, $rootScope.headers).success(function(data){
		    	var urlDetail = data._links.item.href;
			    executeEnumerationFromBackEnd(urlDetail, $rootScope.headers, 'update');
		    });
		    
		}
    }

    function executeEnumerationFromBackEnd(url, headers, action){
    	dataFactory.options(url, headers).success(function(data){
            angular.forEach(data._options.links, function(value){
                if(value.rel === action){
                    angular.forEach(value.schema.properties, function(value, key){
                        if(value.enum) {
                            processEnumeration($rootScope, value.enum, key);
                        }
                    });
                }
            });
        });
    }

    var processEnumeration = function($rootScope, enumValue, key) {
        var enumeration={};
        var contractKey = null;
        if (enumValue){
            enumeration[key]=processOptionsResult(enumValue);
            angular.extend($rootScope.enumData, enumeration);
        }else{
            enumeration[key]=$rootScope.enumData[key];
        }
        enumeration[contractKey]=enumeration[key];
        angular.extend($rootScope.enumData, enumeration);
    };


    var processOptionsResult = function(enumArray){
        var processedArray = [];
        angular.forEach(enumArray, function(value){
            processedArray.push(value);
        });
        return processedArray;
    };

    $scope.loadTableMetadata = function(section) {
       
        $scope.field={};

    	//console.log('@@@@@@@@'+section);
        TableMetaData.load(section.name, function(tableMetaData) {
        	//console.log('tableMetaData' + tableMetaData);
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
			var response = evaluateExpression(field.visibleWhen.expression);
			
			return response;
		}
		return true;
	};

	function evaluateExpression(expression)
	{    var response = true;
		response = $scope.data[expression.field] === expression.value;
		
		return response;
	}
	
	$scope.loadMetaData = function() {
		$rootScope.metadata = {};
		MetaData.load($scope, (regionExist ? reqParmRegion[1] : reqParmRegion), (screenExist ? reqParmScreen[1] : reqParmScreen), seedPayLoad);
		if(seedPayLoad){
			$scope.loadData();
		}
	};

	$scope.loadData = function () {

		if($rootScope.isPrev){
			//console.log($rootScope.allData);
			$scope.data = angular.copy($rootScope.allData);
			$scope.disableNext = false;
			return true;
		}
        var url = $rootScope.resourceHref;
			
		if (url !== undefined) {
		   HttpService.options(url, $rootScope.headers, $scope);
           HttpService.get(url,$rootScope.headers,$scope);
		}

	};
	
	$scope.loadMetaData();

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
	
	//$scope.Injectfactory();

	$rootScope.isPrev = false;

	


	
	$scope.loadOptionData = function() {
		 var url = $rootScope.resourceHref;
		 if (url === undefined) {	
				url = $rootScope.HostURL+$scope.screenId;
		 }
		 
	};


	$scope.loadOptionData();

	$scope.doaction = function(method, subsections, action, actionURL, nextScreenId) {
		console.log(nextScreenId);
		var url;
		var screenId = $rootScope.screenId;
		var regionId = $rootScope.regionId;
		if(action === 'get'){
			 url = $rootScope.HostURL+screenId;
			 $scope.factory.get(url);
		}
		else if(action === 'delete'){
			 url = $rootScope.HostURL+'quotes';
			dataFactory.delete(url,subsections.id).success(function(data){
            	growl.addSuccessMessage(data.message);
			});
		}
		else if(action==='add'){
            $rootScope.navigate(actionURL);
            new Promise(function(resolve) {
                MetaData.actionHandling($scope, regionId, screenId, 'create', dataFactory,resolve);
            }).then(function(){
                loadEnumerationByTab();
            }); 
		}
        else if(action==='calculate'){
        	new Promise(function(resolve) {
                MetaData.editHandling($scope, regionId, screenId, 'update', dataFactory, 'risk', resolve);
            }).then(function(){
                var url=$rootScope.resourceHref + '/operations/tariff_calculation/execute';
                var params = {};
                dataFactory.post(url,params,$rootScope.headers).success(function(data){
                    dataFactory.get(data.messages.context,params,$rootScope.headers).success(function(data){
                        $scope.data = data;
                        console.log('Compute successfully !!');
                    });
                });
            });  
        }
		else {
			MetaData.actionHandling($scope, regionId, screenId, action, dataFactory);			
        }
    };
	
	  $scope.deleteRow = function(row) {
        var listDispScope = angular.element($('.table-striped')).scope();
		var url = row._link.self.href;
		var id='';
         dataFactory.delete(url,id);
	     var index=0;
		 angular.forEach(listDispScope.stTableList, function(item){
           if(item.$$hashKey===row.$$hashKey){
             listDispScope.stTableList.splice(index);	
            }
           index=index+1;
		});	
      };
	  
	  
	$rootScope.next = function() {
        $scope.next();
    };
	
	$scope.next = function() {
	};
	 
	$rootScope.step=1;

	$scope.getenumdata=function(){ 
       
	   	var url = 'https://oc-sample-dropdown.getsandbox.com/omnichannel/sample/select';
        
         	dataFactory.getData(url).success(function(data){
			 $scope.enumdata=data;
					

     	
     });

    };

    $scope.preStep = 1;
    $scope.preRel = undefined;
    $rootScope.currRel = undefined;

    function loadRelationshipByStep(step){
        var list = $rootScope.metadata[$rootScope.screenId].sections;
        angular.forEach(list, function(tabObj){
            if(step === tabObj.step){
                $rootScope.currRel = tabObj.rel;
            } 
        });
    }
    new Promise(function(resolve) {
        MetaData.load($scope, (regionExist ? reqParmRegion[1] : reqParmRegion), (screenExist ? reqParmScreen[1] : reqParmScreen), seedPayLoad, undefined, undefined, resolve);
    }).then(function(){
        loadRelationshipByStep($scope.preStep);
    }); 

    $scope.selecttab=function(step1, rel){
		var screenId = $rootScope.screenId;
		var regionId = $rootScope.regionId;
        $rootScope.step = step1;
        $rootScope.currRel = rel;

		new Promise(function(resolve) {  
		   	// patch for previous tab
			if($rootScope.step !== $scope.preStep) {
                loadRelationshipByStep($scope.preStep);
                if($scope.currRel === 'self') {
                    MetaData.actionHandling($scope, regionId, screenId, 'update', dataFactory,resolve);
                } else {
                    MetaData.editHandling($scope, regionId, screenId, 'update', dataFactory, $scope.currRel,resolve);
                }
                $scope.preStep = $rootScope.step;
                loadRelationshipByStep($scope.preStep);
	        }
		}).then(function(){
		  
			// load data for tab click
	        if($rootScope.currRel !== 'undefined'){
	            $scope.loadDataByTab($rootScope.currRel);
	        } else {
	            HttpService.get($rootScope.resourceHref, $rootScope.headers, $scope);
	            executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'create');
	        }

		});  

    };


	$scope.loadDataByTab = function (tab) {

	    var url = $rootScope.resourceHref;

		if (url !== undefined) {
			dataFactory.options(url, $rootScope.headers).success(function(data){
	            //Fetch the links response
	            var tabUrl = data._links['quote:quote_' + tab + '_list'].href;

	            dataFactory.options(tabUrl, $rootScope.headers).success(function(data){

	                var detailTabUrl = data._links.item.href;

	                HttpService.get(detailTabUrl, $rootScope.headers, $scope);

	                executeEnumerationFromBackEnd(detailTabUrl, $rootScope.headers, 'update');
	            });
	        });
		}

	};
 
}