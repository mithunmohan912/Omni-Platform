'use strict';

/*global ScreenController,CKEDITOR*/
/*
exported showHostErrorMessage
*/


var app = angular.module('app', ['bm.bsTour','ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','omnichannel', 'pascalprecht.translate']).
config(['$routeProvider', '$locationProvider', '$httpProvider', 'tmhDynamicLocaleProvider','TourConfigProvider', '$translateProvider', function($routeProvider, $locationProvider, $httpProvider, tmhDynamicLocaleProvider,TourConfigProvider, $translateProvider) {
    
TourConfigProvider.set('prefixOptions', false);
        TourConfigProvider.set('prefix', 'bsTour');

    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/resources/i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en-gb');
    $translateProvider.useSanitizeValueStrategy('escape'); 

    $routeProvider.
    when('/', {
        templateUrl: function() {
          return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    }).
    when('/:screenId', {
        templateUrl: function() {
          return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    }).
    when('/screen/:screenId', {
        templateUrl: function() {
          return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    }).
    when('/:regionId/screen/:screenId', {
        templateUrl: function() {
            return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    }).
    when('/:regionId/screen/:screenId/:newTransaction', {
        templateUrl: function() {
            return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    });

    tmhDynamicLocaleProvider.localeLocationPattern('../vendors/angular-i18n/angular-locale_{{locale}}.js');

    $httpProvider.interceptors.push(function($q, $rootScope) {
        return {
            'request': function(config) {
                $rootScope.loader.loading = true;
                return config || $q.when(config);
            },
            'response': function(response) {

                $rootScope.loader.loading = false;
                return response || $q.when(response);
            },
            'responseError': function(rejection) {

                $rootScope.loader.loading = false;
                return $q.reject(rejection);
            }
        };
    });

}]);

app.run(function($rootScope, $http, $location, $resource,  $cookieStore,tmhDynamicLocale /*, $templateCache*/ , OCAppConfig) {
    
    if($rootScope.isAuthSuccess === undefined || $rootScope.isAuthSuccess === false) {
        $location.url('/screen/anonymous');
    }

    $rootScope.$on('$locationChangeStart', function (event,newUrl) {
    var screenId = $rootScope.screenId;
    if (newUrl.endsWith('/otp') && $rootScope.authnCallbackData !== undefined) {
    	return;
    } 
    if($rootScope.screenId === undefined){
        $location.url('/screen/anonymous');
    } else if (screenId === 'anonymous'){
        if($rootScope.isAuthSuccess === undefined || $rootScope.isAuthSuccess === false) {
            $location.url($rootScope.nextURL);
        }
    } else {
        if($rootScope.isAuthSuccess === undefined || $rootScope.isAuthSuccess === false) {
            $location.url('/screen/anonymous');
        }
    }
});
   
    //persist few objects at app level
    $rootScope.routeParams = {};
    $rootScope.user = {};
    $rootScope.loader = {
        loading: false
    };
    $rootScope.showHeader = false;

       // default locale
    $rootScope.newlocale = 'en-gb';
    $rootScope.locale = {};
    $rootScope.isCopy = false;
    $rootScope.allData = [];
    OCAppConfig.load();
    $rootScope.resourceData = [];
    $rootScope.resourceURI = [];
    $rootScope.errordata = [];

    $resource('assets/resources/i18n/' + $rootScope.newlocale + '.json').get(function(data) {
        $rootScope.locale = data;
        tmhDynamicLocale.set($rootScope.newlocale);
    }, function() {});
});

app.factory('anonymousFactory', function($rootScope, MetaModel, resourceFactory, $location){
    return {
        navigateAsAnonymous: function(params){
            $rootScope.user = undefined;
            sessionStorage.username = undefined;
            
            $rootScope.nextURL = params.inputComponent.actionURL;
            $rootScope.navigate(params.inputComponent.actionURL);
            
            if($rootScope.regionId === undefined){
                var arr = params.inputComponent.actionURL.split('/');
                $rootScope.regionId = arr[1];
            }
        },
        navigateToLogin: function(params){
            $rootScope.resourceHref = undefined;
            $rootScope.nextURL = params.inputComponent.actionURL;
            $rootScope.navigate(params.inputComponent.actionURL);    
        },
        navigateToScreen: function(params){
            $rootScope.resourceHref = undefined;
            $rootScope.nextURL = params.inputComponent.actionURL;
            $rootScope.navigate(params.inputComponent.actionURL);
            if($rootScope.regionId === undefined){
                var arr = params.inputComponent.actionURL.split('/');
                $rootScope.regionId = arr[1];
            }
        },
        actionHandling: function(params){
            $rootScope.user = undefined;
            sessionStorage.username = undefined;
            
            $rootScope.nextURL = params.inputComponent.actionURL;
            
             if($rootScope.regionId === undefined){
                var arr = params.inputComponent.actionURL.split('/');
                $rootScope.regionId = arr[1];
            }
            new Promise(function(resolve) {
                MetaModel.handleAction($rootScope, params.scope, params.inputComponent, undefined, params.properties, resourceFactory, params.defaultValues, $location, resolve); 
            }).then(function(){
                if(params.inputComponent.actionURL){
                    $location.path(params.inputComponent.actionURL);
                }
            });
        }
    };
});

app.factory('dashboardFactory', function($rootScope, anonymousFactory){
    return {
        navigateToScreen: function(params){
            anonymousFactory.navigateToScreen(params);
        }
    };
});

app.factory('quotessearchFactory', function($rootScope, resourceFactory, MetaModel, anonymousFactory, $location, $filter, growl){
    return {
        actionHandling: function(params){      
            MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location); 
        },
        navigateToScreen: function(params){
            anonymousFactory.navigateToScreen(params);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            $rootScope.resourceHref = resource.href;
            MetaModel.handleAction($rootScope, $scope, inputComponent, resource.href, undefined, resourceFactory, undefined, $location);
        },
        actionHandlingWithValidation: function(params){
            var validation = false;
            //Iterate through the properties to determine if atleast one is valued
            angular.forEach(params.properties, function(val, key){
                var value = params.properties[key].value;

                if(value === null || value === undefined || value === '' || value === 'undefined'){
                    //continue
                }else{
                    validation = true;
                }
            });

            if(params.defaultValues !== undefined){
                for(var key in params.defaultValues){
                    if(!params.properties[key]){
                        params.defaultValues[key].metainfo = {};
                        params.properties[key]= params.defaultValues[key];
                    }
                } 
            }
            
            if(validation){
                MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location); 
            }else{
                growl.error($filter('translate')('VALIDATION_ATLEAST_ERR_MSG'));
            }
        },
        actionHandlingWithDefaults: function(params){
            if(params.defaultValues !== undefined){
                for(var key in params.defaultValues){
                    if(!params.properties[key]){
                        params.defaultValues[key].metainfo = {};
                        params.properties[key]= params.defaultValues[key];
                    }
                } 
            }
            MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location);
        },
        homeOwnerDropdown: function(){
            return [$filter('translate')('_IN005')];
        }
    };
});

app.factory('autosearchFactory', function($rootScope, quotessearchFactory, $filter){
    return {
        actionHandling: function(params){
            quotessearchFactory.actionHandling(params);
        },
        navigateToScreen: function(params){
            quotessearchFactory.navigateToScreen(params);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            quotessearchFactory.itemActionHandling(resource, inputComponent, $scope);
        },
        autoQuoteDropdown: function(){
            return [$filter('translate')('_MC011'),
                    $filter('translate')('_MD005'),
                    $filter('translate')('_MA002'),
                    $filter('translate')('_MC002'),
                    $filter('translate')('_AX009')];
        }
    };
});

app.factory('insuredloginFactory', function($rootScope, MetaModel, quotessearchFactory){
    return {
        actionHandling: function(params){
          quotessearchFactory.actionHandlingWithDefaults(params); 
        },
        navigateToScreen: function(params){
            quotessearchFactory.navigateToScreen(params);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            quotessearchFactory.itemActionHandling(resource, inputComponent, $scope);
        }
    };
});

app.factory('quotescreateFactory', function($rootScope, $location, MetaModel, quotessearchFactory, resourceFactory, $q){
    return {
        navigateToTab: function(params){
            if(params.inputComponent.action){
                new Promise(function(resolve) {
                    MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, undefined, $location, resolve);
                }).then(function(){
                    if(params.inputComponent.actionURL){
                        quotessearchFactory.navigateToScreen(params);
                    }
                });
            } else if(params.inputComponent.actionURL){
               quotessearchFactory.navigateToScreen(params);
            }
        },
        navigateToWizard: function(params){
            if(params.inputComponent.action){
                // We shouldn't have .then that does nothing because we break the promise chain. new Promise doesn't work in IE, we use $q instead
                return $q(function(resolve) {
                    MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location, resolve);
                });
            } 
        },
        navigateToScreen: function(params){
            quotessearchFactory.navigateToScreen(params);
        }
    };
});

app.factory('autocreateFactory', function($rootScope, quotescreateFactory, resourceFactory){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToWizard: function(params){
            quotescreateFactory.navigateToWizard(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        },
        //typeAhead function OC-672
        search: function(element){
            var url = '';
            var newUrl = '';
            return element.field.getParentResource().then(function(response){
                var data = response.data || response;
                if(data){
                    url = $rootScope.hostURL;
                    var regionToSORMap = $rootScope.regionToSoR;
                    var applName = regionToSORMap[$rootScope.regionId];
                    newUrl = url.replace(':regionId',applName);
                    url = newUrl + element.field.options.apiTypeAhead;
                    for(var i=0; i<element.field.options.fieldTypeAhead.length; i=i+2){
                        url = url + element.field.options.fieldTypeAhead[i] + element.resources[element.field.options.fieldTypeAhead[i+1]].value;
                    }
                }
                return resourceFactory.get(url).then(function(response){
                    var data = response.data || response;
                    return data._links.item;
                
                });
            });
        },
        
        selectOption: function(element){
            var payload = {};
            var link = '';
            return element.field.getParentResource().then(function(response){
                var data = response.data || response;
                if (data){                   
                        link = element.id;       
                        payload[link] = element.$item.name;                   
                }
            }); 
        }
    };
});

app.factory('ownerInfoFactory', function($rootScope, quotescreateFactory){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        }
    };
});
app.factory('gopaperlessFactory', function($rootScope, quotessearchFactory){
    return {
        actionHandling: function(params){
            var scope = params.scope;
            var resourceUrl = scope.resourceUrlToRender;
            params.optionUrl = resourceUrl;
            for(var key in params.defaultValues){
                if(!params.properties[key]){
                    params.defaultValues[key].metainfo = {};
                    params.properties[key]= params.defaultValues[key];
                }
            } 
            quotessearchFactory.actionHandling(params);
        }
    };
});

app.factory('makepaymentFactory', function($rootScope, quotessearchFactory){
    return {
        actionHandling: function(params){
            quotessearchFactory.actionHandling(params);
        }
    };
});

app.factory('preferpaperFactory', function($rootScope, gopaperlessFactory){
   return {
        actionHandling:function(params){ 
        gopaperlessFactory.actionHandling(params);
        }
    };
});

app.factory('clientssearchFactory', function($rootScope, quotessearchFactory){
   return {
        actionHandling: function(params){
            quotessearchFactory.actionHandlingWithDefaults(params);
        },
        navigateToScreen: function(params){
            quotessearchFactory.navigateToScreen(params);
        },
       itemActionHandling: function(resource, inputComponent, $scope){
            quotessearchFactory.itemActionHandling(resource, inputComponent, $scope);
        }
    };
}); 

app.factory('hoquoteinquireFactory', function($rootScope, resourceFactory, MetaModel, anonymousFactory, $location){
    return {
        actionHandling: function($scope, inputComponent, rootURL, properties, defaultValues){
            MetaModel.handleAction($rootScope, $scope, inputComponent.action, inputComponent.actionURL, rootURL, properties, resourceFactory, defaultValues, $location);
        },
        navigateToScreen: function($scope, inputComponent){
            $rootScope.resourceHref = undefined;
            anonymousFactory.navigateToScreen($scope, inputComponent);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            MetaModel.handleAction($rootScope, $scope, inputComponent.action, inputComponent.actionURL, resource.href, undefined, resourceFactory, undefined, $location);
        },
        navigateToTab: function(params){
            if(params.inputComponent.action){
                new Promise(function(resolve) {
                    MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, undefined, $location, resolve);
                }).then(function(){
                    if(params.inputComponent.actionURL){
                        anonymousFactory.navigateToScreen(params);
                    }
                });
            } else if(params.inputComponent.actionURL){
               anonymousFactory.navigateToScreen(params);
            }
        }
    };
});

app.factory('clientinquireFactory', function($rootScope, hoquoteinquireFactory){
    return {
        actionHandling: function(params){
            hoquoteinquireFactory.actionHandling(params);
        },
        navigateToScreen: function(params){
            hoquoteinquireFactory.navigateToScreen(params);
        },
        itemActionHandling: function(params){
            hoquoteinquireFactory.itemActionHandling(params);
        },
          navigateToTab: function(params){
            hoquoteinquireFactory.navigateToTab(params);
        }
    };
});

app.factory('inqlocationInfoFactory', function($rootScope, hoquoteinquireFactory){
    return {
        navigateToTab: function(params){
            hoquoteinquireFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            hoquoteinquireFactory.navigateToScreen(params);
        }
    };
});

app.factory('inqcoverageInfoFactory', function($rootScope, hoquoteinquireFactory){
    return {
        navigateToTab: function(params){
            hoquoteinquireFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            hoquoteinquireFactory.navigateToScreen(params);
        }
    };
});

app.factory('inqadditClientInfoFactory', function($rootScope, hoquoteinquireFactory){
    return {
        navigateToTab: function(params){
            hoquoteinquireFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            hoquoteinquireFactory.navigateToScreen(params);
        }
    };
});

app.factory('autoOwnerInfoFactory', function($rootScope, quotescreateFactory){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        }
    };
});

app.factory('riskInfoFactory', function($rootScope, quotescreateFactory){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        }
    };
});

app.factory('autoRiskInfoFactory', function($rootScope, quotescreateFactory, additionalInfoFactory){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        },
        calculatePremium: function(params){
            additionalInfoFactory.calculatePremium(params);
        }
        
    };
});

app.factory('additionalInfoFactory', function($rootScope, quotescreateFactory, quotessearchFactory, MetaModel, resourceFactory, $location){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        },
        calculatePremium: function(params){
            if(params.inputComponent.action){
                new Promise(function(resolve) {
                    MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, undefined, $location, resolve);
                }).then(function(){
                    if(params.inputComponent.actionURL){
                        quotessearchFactory.navigateToScreen(params);
                    }
                });
            } else if(params.inputComponent.actionURL){
               quotessearchFactory.navigateToScreen(params);
            } 
        }
    };
});

app.factory('premiumInfoFactory', function($rootScope, quotescreateFactory){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        }
    };
});

app.factory('autoPremiumInfoFactory', function($rootScope, quotescreateFactory){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        }
    };
});

app.factory('loginFactory', function($rootScope, $filter, $http, anonymousFactory, growl){
    var authnChain = {
        authn: function(params){
            $rootScope.isAuthSuccess = false;
            if (params.scope.resourcesToBind.properties.inputUsername !== undefined && params.scope.resourcesToBind.properties.inputUsername.value !== undefined) {
                $rootScope.authnUsername = params.scope.resourcesToBind.properties.inputUsername.value;
            }
            if (params.scope.resourcesToBind.properties.inputPassword !== undefined && params.scope.resourcesToBind.properties.inputPassword.value !== undefined) {
                $rootScope.authnPassword = params.scope.resourcesToBind.properties.inputPassword.value;
            }
            if (params.scope.resourcesToBind.properties.inputRealm === undefined || params.scope.resourcesToBind.properties.inputRealm.value === undefined) {
                $rootScope.authnRealm = '';
            } else {
                $rootScope.authnRealm = params.scope.resourcesToBind.properties.inputRealm.value;
            }

            var authnCallbackData = {};
            if ($rootScope.authnCallbackData !== undefined) {
                authnCallbackData = $rootScope.authnCallbackData;
                console.log('authnCallbackData.authId : '+authnCallbackData.authId);
                var i;
                if (authnCallbackData.stage === 'LDAP1' || authnCallbackData.stage === 'DataStore1') {
                    for (i=0; i<authnCallbackData.callbacks.length; i++) {
                        if (authnCallbackData.callbacks[i].type === 'NameCallback' && authnCallbackData.callbacks[i].input[0].name === 'IDToken1') {
                            authnCallbackData.callbacks[i].input[0].value = params.scope.resourcesToBind.properties.inputUsername.value;
                            continue;
                        }
                        if (authnCallbackData.callbacks[i].type === 'PasswordCallback' && authnCallbackData.callbacks[i].input[0].name === 'IDToken2') {
                            authnCallbackData.callbacks[i].input[0].value = params.scope.resourcesToBind.properties.inputPassword.value;
                            continue;
                        }
                    }
                } else if (authnCallbackData.stage === 'OATH1') {
                    for (i=0; i<authnCallbackData.callbacks.length; i++) {
                        if (authnCallbackData.callbacks[i].type === 'PasswordCallback' &&
                            authnCallbackData.callbacks[i].input[0].name === 'IDToken1') {
                            authnCallbackData.callbacks[i].input[0].value = params.scope.resourcesToBind.properties.inputOtpCode.value;
                            continue;
                        }
                    }
                }
            }

            // authenticate user
            $http({
                method : 'POST',
                headers : {
                    'X-IBM-Client-ID' : $rootScope.config.apiGatewayApiKeys.client_id,
                    'X-IBM-Client-Secret' : $rootScope.config.apiGatewayApiKeys.client_secret,
                    'Content-Type' : 'application/json'
                },
                data : authnCallbackData,
                url : $rootScope.config.authnURL + '/authenticate'
            }).success(function(data) {
                if (data.authId !== undefined) {
                    console.log('Authenticate callback');
                    console.log('OpenAM authId : '+data.authId);
                    $rootScope.authnCallbackData = data;
                    if (data.stage === 'LDAP1' || data.stage === 'DataStore1') {
                        authnChain.authn(params);
                    }
                    else if (data.stage === 'OATH1') {
                        params.inputComponent.actionURL = '/screen/otp';
                        anonymousFactory.navigateToLogin(params);
                    }
                } else if (data.tokenId !== undefined) {
                    console.log('Authenticate successful');
                    console.log('OpenAM tokenId : '+data.tokenId);
                    sessionStorage.tokenId = data.tokenId;
                    sessionStorage.username = $rootScope.authnUsername;
                    $rootScope.isAuthSuccess = true;

                    // OAuth2 token service
                    // OAuth2 password flow
                    $http({
                        method : 'POST',
                        withCredentials : true,
                        headers : {
                            'X-IBM-Client-ID' : $rootScope.config.apiGatewayApiKeys.client_id,
                            'X-IBM-Client-Secret' : $rootScope.config.apiGatewayApiKeys.client_secret,
                            'Authorization' : 'Basic b2NkZXY6QzdENTZCODVFRjE1OTg3',
                            'Content-Type' : 'application/x-www-form-urlencoded'
                        },
                        data : 'grant_type=password&username='+$rootScope.authnUsername+'&password='+$rootScope.authnPassword,
                        url : $rootScope.config.oauth2URL + '/access_token'
                    }).success(function(data) {
                        console.log('OAuth2 token service successful');
                        console.log('OAuth2 access_token : '+data.access_token);
                        console.log('OIDC id_token : '+data.id_token);
                        sessionStorage.access_token = data.access_token;
                        sessionStorage.id_token = data.id_token;

                        // OAuth2 userinfo service
                        // default OIDC profile
                        $http({
                            method : 'POST',
                            withCredentials : true,
                            headers : {
                                'X-IBM-Client-ID' : $rootScope.config.apiGatewayApiKeys.client_id,
                                'X-IBM-Client-Secret' : $rootScope.config.apiGatewayApiKeys.client_secret,
                                'Authorization' : 'Bearer '+sessionStorage.access_token
                            },
                            url : $rootScope.config.oauth2URL + '/userinfo'
                        }).success(function(data) {
                            console.log('OAuth2 userinfo service successful');
                            console.log('OIDC profile name : '+data.name);
                        });
         
                        // OAuth2 tokeninfo service
                        // validate OAuth2 token
                        $http({
                            method : 'GET',
                            headers : {
                                'X-IBM-Client-ID' : $rootScope.config.apiGatewayApiKeys.client_id,
                                'X-IBM-Client-Secret' : $rootScope.config.apiGatewayApiKeys.client_secret
                            },
                            url : $rootScope.config.oauth2URL + '/tokeninfo?access_token='+sessionStorage.access_token
                        }).success(function(data) {
                            console.log('OAuth2 tokeninfo service successful');
                            console.log('OAuth2 tokeninfo expires_in : '+data.expires_in);
                        });         
                    });


                    $rootScope.authnUsername = undefined;
                    $rootScope.authnPassword = undefined;
                    $rootScope.authnCallbackData = undefined;
                    $rootScope.nextURL = params.inputComponent.actionURL;
                    $rootScope.navigate(params.inputComponent.actionURL);
                }
            }).error(function(data) {
                $rootScope.authnCallbackData = undefined;
                $rootScope.showIcon = false;
                if (data && data.exception) {
                    growl.error(data.exception.message, '30');
                } else {
                    growl.error($filter('translate')('INVALID_CREDENTIALS'));
                }
            });
        }
    };
    this.navigateToScreen = function(params) {
        authnChain.authn(params);
        $http({
                    url: 'assets/resources/config/users.json',
                    method: 'GET'
                     }).success(function(data) {
                    //extract user
                    var user = [];
                    angular.forEach(data.users, function(key) {
                        if (key.name === params.scope.resourcesToBind.properties.inputUsername.value && key.password === params.scope.resourcesToBind.properties.inputPassword.value) {
                            $rootScope.isAuthSuccess = true;
                            user = key;
                        }});
                        if($rootScope.isAuthSuccess){
                            $rootScope.user = user;
                            sessionStorage.username = user.name;    
                        }
                      }).error(function(data) {
                    $rootScope.showIcon = false;
                    if (data && data.exception) {
                        growl.error(data.exception.message, '30');
                    } else {
                        growl.error($filter('translate')('GENERAL_ERROR'));
                        }
                    });
    };
    return this;
});

app.factory('otpFactory', function($rootScope, loginFactory){
    return {
        navigateToScreen: function(params){
            loginFactory.navigateToScreen(params);
        }
    };
});

app.directive('ckEditor', [function () {
        return {
            require: '?ngModel',
            restrict: 'C',
            link: function (scope, elm, attr, model) {
                var isReady = false;
                var data = [];
                var ck = CKEDITOR.replace(elm[0]);

                function setData() {
                    if (!data.length) {
                        return;
                    }

                    var d = data.splice(0, 1);
                    ck.setData(d[0] || '<span></span>', function () {
                        setData();
                        isReady = true;
                    });
                }

                ck.on('instanceReady', function () {
                    if (model) {
                        setData();
                    }
                });

                elm.bind('$destroy', function () {
                    ck.destroy(false);
                });

                if (model) {
                    ck.on('change', function () {
                        scope.$apply(function () {
                            var data = ck.getData();
                            if (data === '<span></span>') {
                                data = null;
                            }
                            model.$setViewValue(data);
                        });
                    });

                    model.$render = function () {
                        if (model.$viewValue === undefined) {
                            model.$setViewValue(null);
                            model.$viewValue = null;
                        }

                        data.push(model.$viewValue);

                        if (isReady) {
                            isReady = false;
                            setData();
                        }
                    };
                }
            }
        };
    }]);