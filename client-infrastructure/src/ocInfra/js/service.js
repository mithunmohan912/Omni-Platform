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
			$rootScope.metamodelPath = data.config.base.templates.metaModel;
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
	this.load = function(scope,metamodelLocation) { 
		var screenId = $rootScope.screenId;
		var metamodelName = metamodelLocation + screenId + '.json';
    	$rootScope.metamodel = {};
    	scope.data = {};
    	$resource(metamodelName).get(function(data) {
        	$rootScope.metamodel[screenId] = data.metamodel;
        	$rootScope.title = data.metamodel.title;
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


app.service('EnumerationService', function($rootScope, resourceFactory){

    var self = this;

    self.loadEnumerationByTab = function (){
        if($rootScope.resourceHref && $rootScope.currRel){
            if($rootScope.currRel === 'itself'){
                var urlDetail = $rootScope.resourceHref;
                self.executeEnumerationFromBackEnd(urlDetail, $rootScope.headers, 'update');
            } else {
                resourceFactory.options($rootScope.resourceHref, $rootScope.headers).success(function(data){
                    var url = data._links[$rootScope.currRel].href;
                    resourceFactory.options(url, $rootScope.headers).success(function(data){
                        var urlDetail = data._links.item.href;
                        self.executeEnumerationFromBackEnd(urlDetail, $rootScope.headers, 'update');
                    });
                });
            }
        } else if($rootScope.resourceHref !== undefined){
            self.executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'search');
        }
    };

    self.executeEnumerationFromBackEnd = function (url, headers, action){
        resourceFactory.options(url, headers).success(function(data){
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

app.service('CheckVisibleService', function(){

    this.checkVisible = function(field, $scope) {
        if (field.visibleWhen) {
            var response = evaluateExpression(field.visibleWhen.expression, $scope);
            return response;
        }    
        return true;
    };

    function evaluateExpression(expression, $scope) {
        var response = true;
        if (expression.operator) //Recursive case
        {
            if (expression.operator === 'AND') {
                angular.forEach(expression.conditions, function(val) {
                    if (response) {
                        response = response && evaluateExpression(val, $scope);
                    }
                });
            } else if (expression.operator === 'OR') {
                response = false;
                angular.forEach(expression.conditions, function(val) {
                    if (!response) {
                        response = response || evaluateExpression(val, $scope);
                    }
                });
            }
        } else //Base case
        {
            response = $scope.data[expression.field] === expression.value;
        }
        return response;
    }

    return this;

});







