'use strict';
/*
global angular,optionsProcessor
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
			'Accept' : 'application/json, text/plain, */*',
            'Content-Type' : 'application/json, text/plain, */*'
			}; 
		var params = {};		
        if(action==='search'){
			url = $rootScope.HostURL;
			// Option processing
			optionsProcessor($rootScope,$scope,reqParm, params,action,url);	 
			// Option processing		
		
			var listDispScope = angular.element($('.table-striped')).scope();
			HttpService.search(url,headers,params,listDispScope);
			$scope.listDispScope=listDispScope;
        } else  if(action==='add'){
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
			objectName=reqParm.replace('Detail','');
			// Option processing
			optionsProcessor($rootScope,$scope,reqParm, params,action,url,payLoad,objectName);	
			// Option processing		
		   HttpService.addUpdate(method,url,headers,payLoad,objectName);
			
		}
    };
	
	  $scope.deleteRow = function(row) {
        var listDispScope = angular.element($('.table-striped')).scope();
		var url = row._link.self.href;
         var headers = {
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
	 
	  $rootScope.step=1;

	   $scope.getenumdata=function(){ 

	   	var url = 'https://oc-sample-dropdown.getsandbox.com/omnichannel/sample/select';
         var headers = {
             'Content-Type': 'application/json'
         };
         $http(
			{
				method : 'GET',
				url: url,
                headers: headers
                
			}
		).success(function(data){
			 $scope.enumdata=data;
					});

     	
     };


          
$scope.selecttab=function(step1){

            
        $rootScope.step = step1;
    };
 
}
