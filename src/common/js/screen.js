'use strict';
/*
global angular,showMessage
*/

/*
exported ScreenController
*/

var screenname;
function ScreenController($http, $scope, $rootScope, $routeParams, $location, MetaData, HttpService) {
	screenname  = 'Omnichannel';
	$rootScope.showHeader = true;
	$scope.disableNext = false;
	var seedPayLoad = {};
	$scope.rulesDataList = [];
	var reqParm = null;
	var exist = false;
	$scope.data = {};
	$scope.remove = 'ban-circle';
	$scope.removestyle = 'red';	
	$scope.dateOptions = {
     	changeYear: true,
        changeMonth: true,
        yearRange: '1900:2030',
    };
	$rootScope.typeahead =[];
	
	if ($routeParams.screenId.indexOf(':') !== -1) {
		reqParm = $routeParams.screenId.split(':');
		$rootScope.screenId = reqParm[1];
		exist = true;
	} else {
		reqParm = $routeParams.screenId;
		$rootScope.screenId = reqParm;
	}

	
	$rootScope.navigate = function(url, product_id) {
        $rootScope.product_id = product_id;
        $location.path(url);
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
		MetaData.load($scope, (exist ? reqParm[0] : reqParm), seedPayLoad);
		if(seedPayLoad){
			$scope.loadData();
		}
	};

	$scope.loadData = function () {	
		 if($rootScope.isPrev){
				console.log($rootScope.allData);
				$scope.data = angular.copy($rootScope.allData);
				$scope.disableNext = false;
				return true;
			}
         var url = $rootScope.resourceHref;
		
	     var headers = {
			'Content-Type' : 'application/json'
            };
			
		 if (url !== undefined) {	
		   HttpService.options(url,$scope);
           HttpService.get(url,headers,$scope);
		 }
	};
	
	$scope.loadMetaData();
	$rootScope.isPrev = false;
	
	$scope.loadOptionData = function() {
		 var url = $rootScope.resourceHref;
		 if (url === undefined) {	
				url = $rootScope.HostURL;
		 }
		  HttpService.options(url,$rootScope);
	};
	
	$scope.loadOptionData();
   
		
	$scope.doaction = function(method, subsections, action, actionURL) {
		var url;
		var objectName;
		var headers= {
			//'Access-Control-Allow-Origin': '*',
			//'Access-Control-Allow-Methods':'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
			//'Access-Control-Allow-Headers':'X-Requested-With, content-type',
			// 'NSP_USERID': localStorage.username,
			'Accept' : 'application/json, text/plain, */*',
            'Content-Type' : 'application/json, text/plain, */*'
			};   
        if(action==='search'){
			
		url = $rootScope.HostURL;
		var params = {};	
		
		// Option processing
        var searchOption= [];	
		if($rootScope.optionData!==undefined && $rootScope.optionData[url]!== undefined) {
		angular.forEach($rootScope.optionData[url], function(value){

		if(value.rel==='search'){
				searchOption.push(value);
			}
		 });			
			
	    objectName=reqParm.replace('search','');
		angular.forEach(searchOption, function(value){
		var object=value.schema[objectName];	
		var requiredVariables= object.required;		
			angular.forEach(requiredVariables, function(value){
			var field = objectName.concat('.').concat(value);	
			params[value]	=$scope.data[field];
			});		
			
	     });		
		}		 
		// Option processing		
		
	    var listDispScope = angular.element($('.table-striped')).scope();
			HttpService.search(url,headers,params,listDispScope);
			$scope.listDispScope=listDispScope;
        }   else  if(action==='add'){
			 $rootScope.resourceHref=undefined;
			 $rootScope.navigate(actionURL);
		} else  if(action==='submit'){
		   var addResource=false;
		   method='PATCH';
		   url = $rootScope.resourceHref;
			
			if (url === undefined) {
			    addResource=true;
				 method='POST';
				url = $rootScope.HostURL;
			}
			var payLoad = {};
			
			
			// Option processing
			var options= [];		
			angular.forEach($rootScope.optionData[url], function(value){
			if((addResource && value.rel==='create')||(!addResource && value.rel==='update'&& value.method==='PATCH')){
				options.push(value);
			}});			
			
			objectName=reqParm.replace('Detail','');
			angular.forEach(options, function(value){
				var object=value.schema[objectName];	
				var requiredVariables= object.required;		
				angular.forEach(requiredVariables, function(value){
				var field = objectName.concat('.').concat(value);	
				payLoad[value]	=$scope.data[field];
				});	
				
			//	for(var name in object.properties) {
				 angular.forEach(object.properties, function(value, key){
				 var objProperty = object.properties[key];
				 if(Array.isArray(objProperty)) {
					  var subRequiredObj= objProperty[0];
					  var subobj	=[];
					  var subRequiredObjVariables= subRequiredObj.required;		
					  angular.forEach(subRequiredObjVariables, function(value){
							var field = key.concat('.').concat(value);	
							subobj[value]=$scope.data[field];
						});	
					 payLoad[key]	=subobj;	
				 }
				 });	
			//	}

			});			
		// Option processing		
		 
			 $http({
				method: method,
				url: url,
				headers: headers,
				data: payLoad
			}).success(function(data){
			 if (data) {
				 var resource=objectName.charAt(0).toUpperCase() + objectName.substring(1);
				 showMessage(resource+' Added/Updated successfully');
			 }
			});
			
		}
    };
	
	  $scope.deleteRow = function(row) {
        var listDispScope = angular.element($('.table-striped')).scope();
		var url = row._link.self.href;
         var headers = {
          //   'NSP_USERID': localStorage.username,
             'Content-Type': 'application/json'
         };
         $http({
             method: 'DELETE',
             url: url,
             headers: headers,
             data: {}
         });
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
 
}
