'use strict';
/*
global app 
*/
/*
exported checkVisibility
*/
app.service('OCInfraConfig', function($resource, $rootScope){	
    this.load = function() {
    	$rootScope.infraConfig = {};
        $resource('ocInfra/assets/resources/config/OCInfraConfig.json').get(function(data) {
			$rootScope.infraConfig = data.config.base;
			$rootScope.metadataPath = data.config.base.templates.metaData;
			angular.forEach($rootScope.infraConfig.properties, function(key) {
                    if (key.name === 'language') {
                        $rootScope.localeOpts = angular.fromJson('{"options":' + angular.toJson(key.options) + '}');
                        angular.forEach($rootScope.localeOpts.options, function(key) {
                            key.description = key.description;
                            //key.description = '<img src=\'' + key.image +'\'/>' + key.description;
                        });
                    } 
                });
            });
    };
});

app.service ('FieldService', function() {
    this.checkVisibility = function (field, $scope) {
	    if(field.visibleWhen) {
	    	if ($scope.data[field.visibleWhen.expression.field] === field.visibleWhen.expression.value) {
	    		return true;
	    		}	
	    } else {
	    	return true;
	    }	
	};   
});    

app.service ('OCMetadata', function($rootScope, $resource) {
	this.load = function(scope,metadataLocation) { 
		var screenId = $rootScope.screenId;
		var metadataName = metadataLocation + screenId + '.json';
    	$rootScope.metadata = {};
    	scope.data = {};
    	$resource(metadataName).get(function(data) {
        	$rootScope.metadata[screenId] = data.metadata;
        	$rootScope.title = data.metadata.title;
        	scope.screenId = screenId;
    	});
    };	
});

app.service('OCRoles', function($resource, $rootScope, $location) {
    this.load = function(roleList, url) {
        $resource('ocInfra/assets/resources/config/roles.json').get(function(data) {
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


app.service('HttpService', function($http,DataMappingService,growl) {
    this.options = function( url, headers, $rootScope) {
     $http(
			{
				method : 'OPTIONS',
				url : url,
				headers: headers
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
				    console.log('DataMappingService'+DataMappingService);
				    if(DataMappingService !== undefined){
					DataMappingService.map($scope);
				}
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
				 console.log(resource);
				 if(method==='PATCH'){
					  growl.addSuccessMessage(data.message);
				 } else{
					  growl.addSuccessMessage(data.message);
					  
				 }
				
			 }
			});
    };
	
    return this;
});

app.service('EnumerationService', function($rootScope, dataFactory){

    var self = this;

    self.loadEnumerationByTab = function (){
        if($rootScope.resourceHref && $rootScope.currRel){
            if($rootScope.currRel === 'itself'){
                var urlDetail = $rootScope.resourceHref;
                self.executeEnumerationFromBackEnd(urlDetail, $rootScope.headers, 'update');
            } else {
                dataFactory.options($rootScope.resourceHref, $rootScope.headers).success(function(data){
                    var url = data._links[$rootScope.currRel].href;
                    dataFactory.options(url, $rootScope.headers).success(function(data){
                        var urlDetail = data._links.item.href;
                        self.executeEnumerationFromBackEnd(urlDetail, $rootScope.headers, 'update');
                    });
                });
            }
        }
    };

    self.executeEnumerationFromBackEnd = function (url, headers, action){
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
    };

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

    return self;

});






