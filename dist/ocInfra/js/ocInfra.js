'use strict';

/*
exported OCController
*/

function OCController($scope, $rootScope, $routeParams, $location, $http, $resource,FieldService,OCMetadata) {  
	$rootScope.showHeader = true;
    var reqParm = null;

    if ($routeParams.screenId.indexOf(':') !== -1) {
        reqParm = $routeParams.screenId.split(':');
        $rootScope.screenId = reqParm[1];
    } else {
        reqParm = $routeParams.screenId;
        $rootScope.screenId = reqParm;
    }
    var metadataLocation = $rootScope.config.templates.metaData;
    OCMetadata.load($scope,metadataLocation);
    $scope.checkvisible = function(field) {
            return FieldService.checkVisibility(field, $scope);    
     };
    $scope.doaction = function(method, subsections, action, actionURL) {
        if (method === 'navigate'){
            $scope.navigate(actionURL);
        }
    };
    $rootScope.navigate = function(actionURL) {
        $location.path(actionURL);
    };
}
OCController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http', '$resource', 'FieldService', 'OCMetadata'];
'use strict';
/*global OCController,LoginController*/

/*
exported showHostErrorMessage
*/

var app = angular.module('omnichannel', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies']).
config(['$routeProvider', '$locationProvider', '$httpProvider', 'tmhDynamicLocaleProvider', function($routeProvider, $locationProvider, $httpProvider, tmhDynamicLocaleProvider) {
$routeProvider.
   when('/:screenId', {
       templateUrl: function(){
           return 'ocInfra/templates/screen.html';
        }, 
          controller: OCController
     }).
    when('/', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: LoginController
    });
  	
    tmhDynamicLocaleProvider.localeLocationPattern('vendors/angular-i18n/angular-locale_{{locale}}.js');
	 
    
}]);

app.run(['$rootScope', '$location', '$cookieStore', 'OCInfraConfig', function($rootScope,  $location,  $cookieStore, OCInfraConfig ) {
	
   $rootScope.$on('$locationChangeStart', function () {
	 
	 if ($cookieStore.get('userid') === null || $cookieStore.get('userid') === undefined) {
            $location.url('/');
       }
   });	
	 $rootScope.showHeader = false;
   OCInfraConfig.load();
}]);

function showHostErrorMessage(message, severity) {

    var errorPopup = $('#errorPopup');
    //var errorIcon = $('#errorIcon');

    errorPopup.removeClass('alert-error');
    errorPopup.removeClass('alert-warning');
    errorPopup.removeClass('alert-info');

  
    if (severity === '30') {
        errorPopup.addClass('alert-error');
        //errorIcon.addClass( 'fa-exclamation-triangle' );
    } else if (severity === '20') {
        errorPopup.addClass('alert-remove');
        //errorIcon.addClass( 'fa-warning' );
    } else {
        errorPopup.addClass('alert-info');
        //errorIcon.addClass( 'fa-info' );
    }

    $('#errorMessage').html(message);
    $('#errorPopup').show();
}

'use strict';

/*
global app
*/


app.directive('ocLogodir', function() {
  return {
  	  restrict: 'E',
      template: '<div class="oc-logo" style="margin-left: auto;margin-right: auto;"></div>'
  };
});


'use strict';


/*
global app, showMessage 
*/


app.factory('MetaData', ['$resource', '$rootScope', '$location', '$browser', '$q', function($resource, $rootScope, $location, $browser, $q) {

    this.load = function(scope, screenId, supportPayLoad, actionPayLoad, onSuccess) {
        $resource('assets/resources/metadata/' + screenId + '.json').get(function(m) {
            scope.screenId = screenId;
            $rootScope.title = m.metadata.title;

            if (m.include && m.include.length > 0) {
                loadReferencedMetaModels(scope, m, screenId, supportPayLoad, actionPayLoad, onSuccess, $resource, $q, $rootScope, $browser);
            } else {
                setScreenData($rootScope, m, screenId, $browser, supportPayLoad, onSuccess);
            }

        }, function() {
            $rootScope.showIcon = false;
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        });
    };
    return this;
}]);

function loadReferencedMetaModels(scope, metaModel, screenId, supportPayLoad, actionPayLoad, onSuccess, $resource, $q, $rootScope, $browser) {
    var promises = [];
    angular.forEach(metaModel.include, function(value) {
        promises.push($resource('assets/resources/metadata/' + value + '.json').get(function(m) {
            $rootScope.metadata[value] = m.metadata;
        }, function() {
            $rootScope.showIcon = false;
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        }).$promise);
    });
    $q.all(promises).then(function() {
        setScreenData($rootScope, metaModel, screenId, $browser, supportPayLoad, onSuccess);
    });
}

function setScreenData($rootScope, m, screenId, $browser, supportPayLoad, onSuccess) {

    $rootScope.metadata[screenId] = m.metadata;

    $browser.notifyWhenNoOutstandingRequests(function() {
        changeMandatoryColor($rootScope);
        $rootScope.$apply();

    });

    if (onSuccess) {
        onSuccess(m.metadata);
    }

}



app.factory('TableMetaData', ['$resource', function($resource) {

    this.load = function(tableId, onSuccess) {
        //$rootScope.tableMetaData = {};
        $resource('assets/resources/metadata/table/' + tableId + '.json').get(function(m) {

            //$rootScope.tableMetaData = m.tableMetaData;

            if (onSuccess) {
                onSuccess(m.tableMetaData);
            }

        }, function() {

            return;
        });
    };

    return this;
}]);

function changeMandatoryColor($rootScope) {
    if ($rootScope.screenId !== undefined) {
        $('#' + $rootScope.metadata[$rootScope.screenId].formid + ' input[ng-required=\'true\']').css('background-color', $rootScope.requiredColor);
        $('#' + $rootScope.metadata[$rootScope.screenId].formid + ' select[ng-required=\'true\']').css('background-color', $rootScope.requiredColor);
    }
}
'use strict';
/*global app*/

app.controller('HeaderController', ['$scope', '$rootScope', '$http', '$location', '$cookieStore', '$resource', 'tmhDynamicLocale', function($scope, $rootScope, $http, $location, $cookieStore, $resource, tmhDynamicLocale) {	
    $rootScope.logout = function() {
        delete $rootScope.user;
        delete localStorage.username;
        delete $http.defaults.headers.common.Authentication;
        localStorage.clear();
		sessionStorage.clear();
		$cookieStore.remove('userid');
        $rootScope.staticInfo = {};
		$location.url( '/');
            
    };

       $scope.setLocate = function(newlocale) {
                 
        $rootScope.newlocale = newlocale;
        angular.forEach($rootScope.localeOpts.options, function(val) {
                        if(val.value === $rootScope.newlocale){
                        $rootScope.selectedLanguage = val.description;
            }
        }); 
        $resource('assets/resources/i18n/' + newlocale + '.json').get(function(data) {
            $rootScope.locale = data;
            tmhDynamicLocale.set(newlocale);

        }, function() {});
    };

}]);  




'use strict';
/*global validateLogin,showMessage*/

/*
exported LoginController
*/

function LoginController($scope, $rootScope, $location, $cookieStore, $http, $resource, OCRoles, tmhDynamicLocale,LoginSrv,FieldService,OCInfraConfig,OCMetadata) {
    $rootScope.screenId = 'login';
    var metadataLocation = $rootScope.infraConfig.metaData;
    OCMetadata.load($scope,metadataLocation);
    $scope.checkvisible = function(field) {
            return FieldService.checkVisibility(field, $scope);    
     };
    $rootScope.showHeader = false;	
    $scope.doaction = function(method, subsections, action, actionURL, nextScreenId) {
        if (method === 'submit'){
            $scope.submit(nextScreenId);
        }
    };
    $scope.submit= function (nextScreenId){
	 var FormID = $('form').attr('id');		
	 validateLogin(FormID); 
	  if ($('#' + FormID).valid()) {
            if (!navigator.onLine) {
                showMessage('Network is not available', '30');
            } else {
				LoginSrv.runLogin($scope, nextScreenId);
            }
        }
    };
}
LoginController.$inject = ['$scope', '$rootScope', '$location', '$cookieStore', '$http', '$resource', 'OCRoles', 'tmhDynamicLocale', 'LoginSrv', 'FieldService', 'OCInfraConfig', 'OCMetadata'];





'use strict';
/*
global app,showMessage 
*/
app.service('LoginSrv', ['$rootScope', '$resource', '$cookieStore', '$http', 'OCRoles', 'tmhDynamicLocale', function($rootScope,$resource,  $cookieStore, $http,  OCRoles, tmhDynamicLocale){	
    this.runLogin = function($scope,nextScreenId) {
				$rootScope.showIcon = true;
				 $http({
                    url: 'ocInfra/assets/resources/config/users.json',
                    method: 'GET'
                }).success(function(data) {
                    //extract user
                    var user = [];
                    $rootScope.isAuthSuccess = false;
                    angular.forEach(data.users, function(key) {
                        if (key.name === $scope.data.inputUsername && key.password === $scope.data.inputPassword) {
                            $rootScope.isAuthSuccess = true;
                            user = key;
                        }
                    });

                    if (!$rootScope.isAuthSuccess) {
                        showMessage('Check Username or Password, incorrect Credentials !');
                        return false;
                    }
                    $rootScope.user = user;
                    localStorage.username = user.name;
                    localStorage.distributorId = user.distributor_id;
                    $cookieStore.put('userid',localStorage.username);
                    localStorage.Authentication = user.token;
                    var defaultLocale = user.personalizationData.locale;
                    $rootScope.newlocale = defaultLocale;
                    $resource('assets/resources/i18n/' + $rootScope.newlocale + '.json').get(function(data) {
                        $rootScope.locale = data;
                        tmhDynamicLocale.set($rootScope.newlocale);
                        OCRoles.load(user.roles[0], nextScreenId);
                    }, function() {});
                }).error(function(data) {
                    $rootScope.showIcon = false;
                    if (data && data.exception) {
                        showMessage(data.exception.message, '30');
                    } else {
                        showMessage('Unable to connect the server. Please check your internet connection or contact system admin.');
                    }
                });
               
    };
}]);


app.service('OCRoles', ['$resource', '$rootScope', '$location', function($resource, $rootScope, $location) {
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
}]);

'use strict';

/*
exported optionsProcessor
*/

function optionsProcessor($rootScope,$scope, reqParm,params,action,url,payLoad,objectName){	

	 if(action==='search'){
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
	 } else if(action==='submit'){
			var options= [];		
			angular.forEach($rootScope.optionData[url], function(value){
			if((value.rel==='create')||(value.rel==='update'&& value.method==='PATCH')){
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

			});		
	 }
	 
}



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
 
}

'use strict';
/*
global app,showMessage 
*/
/*
exported checkVisibility
*/
app.service('OCInfraConfig', ['$resource', '$rootScope', function($resource, $rootScope){	
    this.load = function() {
    	$rootScope.infraConfig = {};
        $resource('ocInfra/assets/resources/config/OCInfraConfig.json').get(function(data) {
			$rootScope.infraConfig = data.config.base;
			
			$rootScope.infraConfig.metaData = data.config.base.templates.metaData; 
            });
    };
}]);

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

app.service ('OCMetadata', ['$rootScope', '$resource', function($rootScope, $resource) {
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
}]);

app.service('OCRoles', ['$resource', '$rootScope', '$location', function($resource, $rootScope, $location) {
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
}]);


app.service('HttpService', ['$http', 'DataMappingService', function($http,DataMappingService) {
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
}]);

'use strict';

/*
global app
*/

app.controller('TableController', ['$browser', '$scope', '$rootScope', 'TableMetaData', '$location', function($browser, $scope, $rootScope, TableMetaData,$location) {

    $scope.showResult = true;
    $scope.riskDataSet = [];
    $rootScope.rowCollection = {};

    $scope.loadTableMetadata = function() {
        TableMetaData.load($scope.field.name, function(tableMetaData) {
            $scope.field.tableMetaData = tableMetaData;           
        });
    };

   
    $scope.doActionItem = function(actionType, item, tableName,url) {
       
        var field;
        if (actionType === 'edit') {
         $rootScope.resourceHref = item._link.self.href;
		 $rootScope.navigate(url);
        } else if (actionType === 'delete') {
            field = angular.element($('#' + tableName)).scope().field;
            $scope.deleteRow(item, field);
        }
    };
	
    $scope.loadTableMetadata();	
	
	
	$scope.editItem = function(item, url) {
		 $rootScope.resourceHref = item._link.self.href;
		 $rootScope.navigate(url);
       };
	   
	$scope.selectItem = function(item, url) {
		 $rootScope.resourceHref = item._link.self.href;
		 $rootScope.navigate(url);
       };   
	
   $rootScope.navigate = function(url) {
	        $location.path(url);
    };
   
}]);

'use strict';


/*
exported  showMessage,validateLogin
*/

function showMessage(message) {
    $('#messageID').html(message);
    $('#popupdiv').modal('show');
}



function validateLogin(FormID) {

    $('#' + FormID).validate({
        focusInvalid: false,
        onkeyup: false,
        onclick: false,
        focusCleanup: false,
        onfocusout: false,
        onfocus: false,
        onsubmit: false,

        rules: {
            inputUsername: {
                required: true
            },
            inputPassword: {
                required: true
            }
        },
        messages: {
            inputUsername: 'Username and Password are required.',
            inputPassword: 'Username and Password are required.'
        },

        errorPlacement: function(error, element) {
            $('#' + element.attr('id')).addClass('highlight');
            //showMessage(error.text());
        }
    });

}

