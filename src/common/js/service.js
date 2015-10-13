'use strict';
/*
global app,showMessage 
*/
app.service('OCAppConfig', function($resource, $rootScope){	
    this.load = function() {
        $resource('assets/resources/config/appConf.json').get(function(data) {
            if (data.config !== undefined) {
			$rootScope.config = data.config.base;
                if (!$rootScope.HostURL) {
                    $rootScope.HostURL = $rootScope.config.hostURL;
                }
                $rootScope.cleanAPIURL = $rootScope.config.cleanAPIURL;
				if(!data.config.base)	{
                    showMessage('This application \'s configuration is not available', '30');
                }
               
            }
        });
    };
});

app.service('OCRoles', function($resource, $rootScope, $location) {
    this.load = function(roleList, url) {
        $resource('ocinfra/assets/resources/config/roles.json').get(function(data) {
            angular.forEach(data.Roles, function(key) {
                if (key[roleList] !== undefined) {
                    $rootScope.roleConfig = key[roleList];
                }
            });
            if (url !== undefined) {
				$location.path(url);
            }
        });
    };
    return this;
});


app.service('HttpService', function($http,DataMappingService) {
    this.options = function( url,$rootScope) {
     $http(
			{
				method : 'OPTIONS',
				url : url,
			}
		).success(function(data){
			 angular.forEach(data, function(value){
				if(Array.isArray(value)) {
					if ($rootScope.optionData === undefined) {
						$rootScope.optionData=[];
					}
					$rootScope.optionData[url]= value;
				}
				
				// Set links and desc in scope
				
			});
			 
		});
    };
	
	this.search = function( url,headers,params,listDispScope) {
     $http(
			{
				method : 'GET',
				url: url,
                headers: headers,
                params: params
			}
		).success(function(data){
			 if (data.item) {
                    listDispScope.stTableList = data.item;
                    listDispScope.showResult = true;
                } else {
                    listDispScope.stTableList = [];
                    listDispScope.showResult = false;
                }
		});
    };
	
	this.get = function( url,headers, $scope) {
     $http(
			{
				method : 'GET',
				url: url,
                headers: headers,
			}
		).success(function(data){
			 if (data) {
				    $scope.data=data;
					DataMappingService.map($scope);
			 }
		});
    };
	
	this.addUpdate = function( method, url,headers, payLoad,objectName) {
    $http({
				method: method,
				url: url,
				headers: headers,
				data: payLoad
			}).success(function(data){
			 if (data) {
				 var resource=objectName.charAt(0).toUpperCase() + objectName.substring(1);
				 if(method==='PATCH'){
					  showMessage(resource+' Updated successfully');
				 } else{
					  showMessage(resource+' Added successfully');
				 }
				
			 }
			});
    };
	
    return this;
});





