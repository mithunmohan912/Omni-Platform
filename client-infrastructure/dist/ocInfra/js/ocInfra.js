'use strict';
/*global validateLogin,showMessage*/

/*
exported AnonymousController
*/

LoginController.$inject = ['$scope', '$rootScope', '$location', '$cookieStore', '$http', '$resource', 'OCRoles', 'tmhDynamicLocale', 'LoginSrv', 'FieldService', 'OCInfraConfig', 'OCMetadata'];
ScreenController.$inject = ['$http', '$scope', '$rootScope', '$controller', '$injector', '$routeParams', '$location', 'growl', 'MetaData', 'HttpService', 'dataFactory', 'TableMetaData', 'EnumerationService'];
function AnonymousController($scope, $rootScope, $location, $cookieStore, $http, $resource, OCRoles, tmhDynamicLocale,LoginSrv,FieldService,OCInfraConfig,OCMetadata, MetaData, EnumerationService, dataFactory) {
    $rootScope.screenId = 'anonymous';
    var metadataLocation = $rootScope.metadataPath;
    OCMetadata.load($scope,metadataLocation);


    $scope.checkvisible = function(field) {
            return FieldService.checkVisibility(field, $scope);    
     };
    $rootScope.showHeader = false;	
    $scope.doaction = function(method, subsections, action, actionURL) {
        if(method === 'login'){
            $rootScope.nextURL = actionURL;
            $rootScope.navigate(actionURL);
        } else if(method === 'navigate'){
            $rootScope.nextURL = actionURL;
            $rootScope.navigate(actionURL);
            // if create anonymous quotes => regionId doesn't value.
            // Need to set value to create empty quote
            if($rootScope.regionId === undefined){
                var arr = actionURL.split('/');
                $rootScope.regionId = arr[1];
            }
            new Promise(function(resolve) {
                MetaData.actionHandling($scope, $rootScope.regionId, $rootScope.screenId, 'create', dataFactory, undefined, resolve);
            }).then(function(){
                EnumerationService.loadEnumerationByTab();
            }); 
        } else if(method === 'asiaQuoteScreen'){

        }
    };

    $rootScope.navigate = function(actionURL) {
        $location.path(actionURL);
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
'use strict';
/*global ScreenController,LoginController*/

/*
exported showHostErrorMessage
*/



var app = angular.module('omnichannel', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','angular-growl']).
config(['$routeProvider', '$locationProvider', '$httpProvider', 'tmhDynamicLocaleProvider','growlProvider', function($routeProvider, $locationProvider, $httpProvider, tmhDynamicLocaleProvider,growlProvider) {

growlProvider.globalTimeToLive(3000);
growlProvider.globalEnableHtml(true);
growlProvider.onlyUniqueMessages(true);

$routeProvider.
   when('/', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: LoginController
    }).
   when('/login', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: LoginController
    }).
   when('/:screenId', {
       templateUrl: function(){
           return 'ocInfra/templates/screen.html';
        }, 
          controller: ScreenController
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

/*
exported ScreenController
*/

app.factory('MetaData', ['$resource', '$rootScope', '$location', '$browser', '$q', 'dataFactory', function($resource, $rootScope, $location, $browser, $q, dataFactory) {

    this.load = function(scope, regionId, screenId, supportPayLoad, actionPayLoad, onSuccess, resolve) {
        var path;
        scope.regionId = regionId;
        if(regionId){
             path='assets/resources/metadata/regions/'+regionId+'/'+ screenId + '.json';
        }
        else{
            path='assets/resources/metadata/'+ screenId + '.json';
        }
        $resource(path).get(function(m) {
            scope.screenId = screenId;
            $rootScope.title = m.metadata.title;

            if (m.include && m.include.length > 0) {
                loadReferencedMetaModels(scope, m, screenId, supportPayLoad, actionPayLoad, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve);
            } else {
                setScreenData($rootScope, scope, m, screenId, $browser, supportPayLoad, onSuccess);
            }
            
            loadOptions(m, scope, regionId, screenId,dataFactory, $rootScope);

            
        }, function() {
            $rootScope.showIcon = false;
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        });
    };


    this.actionHandling=function($scope, regionId, screenId, action, dataFactory, tab, resolve){
        //Retrieve the meta-model for the given screen Id from the scope
        var metaModel = $scope.metadata[screenId];
    
        //Retrieve the resource list from the meta-model
        var resourcelist = metaModel.resourcelist;

        if(resourcelist !== undefined && resourcelist.length > 0){
            //Iterate through the resource list for the meta model
            angular.forEach(resourcelist, function(resource) {
                var keyForOptionsMap = regionId +':'+resource;
                //Retrieve the optionsMap for the resource
                if($scope.optionsMap === undefined){
                    $scope.optionsMap = [];
                }
                
                var optionsMapForResource = $scope.optionsMap[keyForOptionsMap];
                console.log('SCREEN ACTION-'+action);
                // make sure alway update OptionsData when update by tab
                if(action === 'update' && tab !== undefined){
                    optionsMapForResource = undefined;
                }
                if(optionsMapForResource === undefined){
                    loadOptionsDataForMetadata(resourcelist, $scope, regionId, dataFactory, $rootScope, action, tab, resolve);
                }else{
                    var options = optionsMapForResource.get(action);
                    httpMethodToBackEnd($scope, dataFactory, $rootScope, options, resolve);   
                }
                 
            });
        }
    };

    this.setHeaders = function($rootScope){
        $rootScope.headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-IBM-Client-id' : 'f9220738-65e5-432d-9b8f-05e8357d1a61',
            'x-IBM-Client-Secret' : 'gT1lS3aV8yS1iS3lY3kB7bL8pH0cH6nJ6yT4jH1aQ6pL8aR6hI' 
        };

        if($rootScope.user && $rootScope.user.name){
            $rootScope.headers.username = $rootScope.user.name;
        }
    };
    return this;
}]);

function loadOptions(m, scope, regionId, screenId,dataFactory, $rootScope){
        //Read metadata from the root scope
        var action;
        var metaModel = scope.metadata[screenId];

        //Retrieve resource list from the meta model
        var resourcelist;
        if(metaModel !== undefined){
            resourcelist = metaModel.resourcelist;
        }

        if(resourcelist !== undefined && resourcelist.length > 0){
            loadOptionsDataForMetadata(resourcelist, scope, regionId, dataFactory, $rootScope, action);
        }
}

function loadOptionsDataForMetadata(resourcelist, scope, regionId, dataFactory, $rootScope, action, tab, resolve){

        if(resourcelist !== undefined && resourcelist.length > 0){
            //Iterate through the resource list of meta model
            angular.forEach(resourcelist, function(resource) {
                
                console.log('RESOURCE : '+resource);

                //Formulate the URL for the options call
                var url;                
                if($rootScope.resourceHref) {
                    url = $rootScope.resourceHref;
                }
                else {
                    url = scope.HostURL + resource;
                }
                //Retrieve regionToSORMap from the rootScope
                var regionToSORMap = scope.regionToSoR;
                //Retrieve the application name for the given region Id
                var applName = regionToSORMap[regionId];
                //Replace the regionId with application name in the URL
                var newURL = url.replace(':regionId',applName);
                //Formulate the key for storing the options map for the given resource on the region
                var keyForOptionsMap = regionId +':'+resource;
                //Fetch the options map for the given resource

                if(scope.optionsMap === undefined){
                    scope.optionsMap = [];
                }

                var optionsMapForResource = scope.optionsMap[keyForOptionsMap];
                // make sure alway update OptionsData when update by tab
                if(action === 'update' && tab !== undefined){
                    optionsMapForResource = undefined;
                }

                if(optionsMapForResource === undefined){
                    optionsMapForResource = new Map();
                    
                    //Options call for the resources in the meta model.
                    dataFactory.options(newURL, $rootScope.headers).success(function(data){
                        //Fetch the options response
                        var optiondataobj = data._options.links;
                        var options;
                        if(tab !== undefined) {
                            //Fetch the links response
                            var tabObj = data._links[tab];

                            if(tabObj !== undefined){

                                var tabUrl = tabObj.href;

                                dataFactory.options(tabUrl, $rootScope.headers).success(function(data){

                                    var detailTabUrl = data._links.item.href;

                                    dataFactory.options(detailTabUrl, $rootScope.headers).success(function(data){

                                        optiondataobj = data._options.links;

                                        setOptionsMapForResource(optiondataobj, optionsMapForResource);

                                        scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                                        if(action !== undefined){
                                            options = optionsMapForResource.get(action);
                                            httpMethodToBackEnd(scope, dataFactory, $rootScope, options, resolve);
                                        }

                                    });
                                });
                            } else {

                                setOptionsMapForResource(optiondataobj, optionsMapForResource);

                                scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                                if(action !== undefined){
                                    options = optionsMapForResource.get(action);
                                    httpMethodToBackEnd(scope, dataFactory, $rootScope, options, resolve);
                                }
                            }
                        }  else {

                            setOptionsMapForResource(optiondataobj, optionsMapForResource);

                            scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                            if(action !== undefined){
                                options = optionsMapForResource.get(action);
                                httpMethodToBackEnd(scope, dataFactory, $rootScope, options, resolve);
                            }
                        }
                    });
                }
            });
        }
    return 'success';
}

function setOptionsMapForResource(optiondataobj, optionsMapForResource){
    angular.forEach(optiondataobj, function(ref) {            
        var object = {};
        object.action = ref.rel;
        object.url = ref.href;
        object.httpmethod = ref.method;
        object.schema = ref.schema;
        console.log('ACTION : '+object.action);
        console.log('HTTP METHOD : ' +object.httpmethod);
        console.log('URL : '+object.url);
        console.log('SCHEMA : '+object.schema);
        //optionsMapForResource.set(object.action, object);
        if(optionsMapForResource.get(object.action) !== undefined){
            optionsMapForResource.set(object.action+'1', object);    
        }else{
            optionsMapForResource.set(object.action, object);    
        }
    });
}

function httpMethodToBackEnd($scope, dataFactory, $rootScope, options, resolve){


    //Retrieve the URL, Http Method and Schema from the options object
    var url = options.url;
    var httpmethod = options.httpmethod;
    var schema = options.schema;
    console.log('Perform '+httpmethod +' operation on URL - '+url +' with following params - ');

    var params={};
    //Set the params data from the screen per the schema object for the given action (from the options object)
    params = setData($scope, schema, params);

    if(httpmethod==='GET'){    
        //Call the get method on the Data Factory with the URL, Http Method, and parameters
        dataFactory.get(url,params,$rootScope.headers).success(function(data){
            //Load the results into the search results table
            var listDispScope = angular.element($('.table-striped')).scope(); 
            if(data._links.item){
                listDispScope.stTableList=data._links.item;
                listDispScope.showResult = true;
            }else{
                listDispScope.stTableList = [];
                listDispScope.showResult = false;
            }
        });
    } else if(httpmethod==='POST'){
        //Call the post method on the Data Factory
        dataFactory.post(url,params,$rootScope.headers).success(function(data){
            if (data) {
                $rootScope.resourceHref = data._links.self.href;
                console.log('Quote ID:' + data['quote-doc-id']);
                showMessage('Successfully created !!');
                if(resolve) {
                    resolve();
                }
            }
        });
    } else if(httpmethod==='PATCH'){
        //Call the patch method on the Data Factory
        dataFactory.patch(url,params,$rootScope.headers).success(function(data){
            if (data) {
                if(resolve) {
                    resolve();
                }
            }
        });
    }
}

function loadReferencedMetaModels(scope, metaModel, screenId, supportPayLoad, actionPayLoad, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve) {
    var promises = [];
    var path;
    if(regionId){
         path='assets/resources/metadata/regions/'+regionId+'/';
    }
    else{
        path='assets/resources/metadata/';
    }
    angular.forEach(metaModel.include, function(value) {
        promises.push($resource(path + value + '.json').get(function(m) {
            $rootScope.metadata[value] = m.metadata;
        }, function() {
            $rootScope.showIcon = false;
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        }).$promise);
    });
    $q.all(promises).then(function() {
        setScreenData($rootScope, scope, metaModel, screenId, $browser, supportPayLoad, onSuccess, resolve);
    });
}

function setScreenData($rootScope, scope, m, screenId, $browser, supportPayLoad, onSuccess, resolve) {
    var metadata = m.metadata;
    var resourcelist = metadata.resourcelist;
    
    if(resourcelist !== undefined && resourcelist.length >0){
        angular.forEach(resourcelist, function(resource){
            scope.metadata[resource] = m.metadata;    
        });
    }

    scope.metadata[screenId] = m.metadata;

    $browser.notifyWhenNoOutstandingRequests(function() {
        changeMandatoryColor($rootScope);
        $rootScope.$apply();

    });

    if (onSuccess) {
        onSuccess(m.metadata);
    }
    if(resolve){
        resolve();
    }
}

function setData($scope, schema, object){

    angular.forEach(schema.properties, function(val, key){  
            
            var value = $scope.data[key];
            var type = val.type;
            
            if(type !== undefined && type==='static'){
                value = val.value;
            }

            if(value === null || value === undefined || value === '' || value === 'undefined'){
                //continue
            }else{
    
                var format = val.format;
    
                if(format !== undefined && format==='date'){
                    //Format the date in to yyyy/mm/dd format
                    value = formatIntoDate(value);
                }
    
                if(typeof value === 'object') {
                    if(value.key !== undefined){
                        value = value.key;
                    }else{
                        value = value.value;
                    }
                } 
    
                console.log(key +' : '+value);
                object[key] = value;
            }
    });
    return object;
}

function formatIntoDate(value){
    if(typeof value === 'string') {
        return value;
    }
   return value.getFullYear() + '-' + (('0' + (value.getMonth() + 1)).slice(-2)) + '-' + ('0' + value.getDate()).slice(-2);
}

app.factory('TableMetaData', ['$resource', '$rootScope', function($resource, $rootScope) {
    this.load = function(tableId, onSuccess) {
        $resource('assets/resources/metadata/table/' + $rootScope.regionId +'/' + tableId + '.json').get(function(m) {
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
        $resource('ocInfra/assets/resources/i18n/' + newlocale + '.json').get(function(data) {
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
    var metadataLocation = $rootScope.metadataPath;
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
                    $resource('ocInfra/assets/resources/i18n/' + $rootScope.newlocale + '.json').get(function(data) {
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
global app
*/


    app.factory('dataFactory', ['$http', function($http) {

    var dataFactory = {};

    dataFactory.getData = function (urlBase) {
        return $http.get(urlBase);
    };

    dataFactory.get = function (urlBase,params,headers) {
        var obj =   $http(
            {
                method : 'GET',
                url : urlBase,
                params : params,
                headers : headers
            }
        );   
        return obj;
    };

    dataFactory.post = function (urlBase,params,headers) {
       var obj = $http({
                method: 'POST',
                url: urlBase,
                headers: headers,
                data: params
            });
        return obj;
    };

    dataFactory.insert = function (urlBase,obj) {

        return $http.post(urlBase, obj);
    };

    dataFactory.update = function (urlBase,obj) {
        return $http.put(urlBase + '/' + obj.id, obj);
    };

    dataFactory.delete = function (urlBase,id) {
        return $http.delete(urlBase + '/' + id);
    };

    dataFactory.options=function(urlBase, headers){
        var obj =   $http(
            {
                method : 'GET',
                url : urlBase,
                headers : headers
            }
        );   
        return obj;
    };

    dataFactory.patch = function (urlBase,params,headers) {
        var obj = $http({
                method: 'PATCH',
                url: urlBase,
                headers: headers,
                data: params
            });
        return obj;
    };
 return dataFactory;

}]);
'use strict';
/*
global angular
*/

/*
exported ScreenController
*/

var screenname;
function ScreenController($http, $scope, $rootScope,$controller, $injector,$routeParams, $location, growl,MetaData, HttpService, dataFactory, TableMetaData, EnumerationService) {
	   
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
	
	//$scope.loadMetaData();

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
                MetaData.actionHandling($scope, regionId, screenId, 'create', dataFactory, undefined, resolve);
            }).then(function(){
                EnumerationService.loadEnumerationByTab();
            }); 
		}
        else if(action==='calculate'){
        	new Promise(function(resolve) {
                MetaData.actionHandling($scope, regionId, screenId, 'update', dataFactory, 'quote:quote_risk_list', resolve);
            }).then(function(){
                var url=$rootScope.resourceHref + '/operations/tariff_calculation/execute';
                var params = {};
                dataFactory.post(url,params,$rootScope.headers).success(function(data){
                	var urlDetail;
                	if(Array.isArray(data.messages)){
                		urlDetail = data.messages[1].message[0];
                	} else {
                		urlDetail = data.messages.context;
                	}
                	dataFactory.get(urlDetail,params,$rootScope.headers).success(function(data){
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
                $rootScope.currRel = tabObj.link;
            } 
        });
    }
    new Promise(function(resolve) {
        MetaData.load($scope, (regionExist ? reqParmRegion[1] : reqParmRegion), (screenExist ? reqParmScreen[1] : reqParmScreen), seedPayLoad, undefined, undefined, resolve);
    }).then(function(){
        loadRelationshipByStep($scope.preStep);
        EnumerationService.loadEnumerationByTab();
        // load data for tab click
        if($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself'){
            $scope.loadDataByTab($rootScope.currRel);
        } else {
            HttpService.get($rootScope.resourceHref, $rootScope.headers, $scope);
            EnumerationService.executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'create');
        }
    });

    $scope.selecttab=function(step1, rel){
		var screenId = $rootScope.screenId;
		var regionId = $rootScope.regionId;
        $rootScope.step = step1;
        $rootScope.currRel = rel;

		new Promise(function(resolve) {  
		   	// patch for previous tab
			if($rootScope.step !== $scope.preStep && rel !== 'undefined') {
                loadRelationshipByStep($scope.preStep);
                MetaData.actionHandling($scope, regionId, screenId, 'update', dataFactory, $scope.currRel, resolve);
	        } else {
                HttpService.get($rootScope.resourceHref, $rootScope.headers, $scope);
            }
            $scope.preStep = $rootScope.step;
            loadRelationshipByStep($scope.preStep);
		}).then(function(){
		  
			// load data for tab click
	        if($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself'){
	            $scope.loadDataByTab($rootScope.currRel);
	        } else {
	            HttpService.get($rootScope.resourceHref, $rootScope.headers, $scope);
	            EnumerationService.executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'create');
	        }

		});  

    };




	$scope.loadDataByTab = function (tab) {

	    var url = $rootScope.resourceHref;

		if (url !== undefined) {
			dataFactory.options(url, $rootScope.headers).success(function(data){
	            //Fetch the links response
	            var tabUrl = data._links[tab].href;

	            dataFactory.options(tabUrl, $rootScope.headers).success(function(data){

	                var detailTabUrl = data._links.item.href;

	                HttpService.get(detailTabUrl, $rootScope.headers, $scope);

	                EnumerationService.executeEnumerationFromBackEnd(detailTabUrl, $rootScope.headers, 'update');
	            });
	        });
		}

	};
 
}
'use strict';
/*
global app 
*/
/*
exported checkVisibility
*/
app.service('OCInfraConfig', ['$resource', '$rootScope', function($resource, $rootScope){	
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


app.service('HttpService', ['$http', 'DataMappingService', 'growl', function($http,DataMappingService,growl) {
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
}]);

app.service('EnumerationService', ['$rootScope', 'dataFactory', function($rootScope, dataFactory){

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

   $scope.checkShow = function(opt) {
        if (opt.visibleflag === undefined) {
            return true;
        }
        
        if ( $rootScope.config[opt.visibleflag] === undefined || $rootScope.config[opt.visibleflag] === true) {
            return true;
        } else {
            return false;
        }
    };

    $scope.doActionItem = function(actionType, item, tableName,url) {
       
        var field;
        if (actionType === 'edit') {
         $rootScope.resourceHref = item.href;
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

