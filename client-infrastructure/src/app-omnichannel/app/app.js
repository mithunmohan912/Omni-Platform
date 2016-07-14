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

    if(sessionStorage.username === null || sessionStorage.username === undefined) {
        $location.url('/screen/anonymous');
    }

    $rootScope.$on('$locationChangeStart', function () {
    var screenId = $rootScope.screenId;

    if($rootScope.screenId === undefined){
        $location.url('/screen/anonymous');
    } else if (screenId === 'anonymous'){
        if(sessionStorage.username === null || sessionStorage.username === undefined) {
            $location.url($rootScope.nextURL);
        }
    } else {
        if(sessionStorage.username === null || sessionStorage.username === undefined) {
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
        navigateToScreen: function(params){
            $rootScope.resourceHref = undefined;
            if(params.inputComponent.actionURL === '/login'){
                $rootScope.nextURL = params.inputComponent.actionURL;
                $rootScope.navigate(params.inputComponent.actionURL);    
            }else{
               $rootScope.nextURL = params.inputComponent.actionURL;
                $rootScope.navigate(params.inputComponent.actionURL);
                if($rootScope.regionId === undefined){
                    var arr = params.inputComponent.actionURL.split('/');
                    $rootScope.regionId = arr[1];
                }
            }
        },
        actionHandling: function(params){
            $rootScope.nextURL = params.inputComponent.actionURL;
            
             if($rootScope.regionId === undefined){
                var arr = params.inputComponent.actionURL.split('/');
                $rootScope.regionId = arr[1];
            }
            new Promise(function(resolve) {
                MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location, resolve); 
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

app.factory('quotessearchFactory', function($rootScope, resourceFactory, MetaModel, anonymousFactory, $location){
    return {
        actionHandling: function(params){
            MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location);
        },
        navigateToScreen: function(params){
            anonymousFactory.navigateToScreen(params);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            MetaModel.handleAction($rootScope, $scope, inputComponent, resource.href, undefined, resourceFactory, undefined, $location);
        }
    };
});

app.factory('autosearchFactory', function($rootScope, quotessearchFactory){
    return {
        actionHandling: function(params){
            quotessearchFactory.actionHandling(params);
        },
        navigateToScreen: function(params){
            quotessearchFactory.navigateToScreen(params);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            quotessearchFactory.itemActionHandling(resource, inputComponent, $scope);
        }
    };
});

app.factory('quotescreateFactory', function($rootScope, $location, MetaModel, quotessearchFactory, resourceFactory){
    return {
        navigateToTab: function(params){
            if(params.inputComponent.action){
                new Promise(function(resolve) {
                    MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, undefined, $location, resolve);
                }).then(function(){
                    if(params.inputComponent.actionURL){
                        $location.path(params.inputComponent.actionURL);
                    }
                });
            } else if(params.inputComponent.actionURL){
                $location.path(params.inputComponent.actionURL);
            }
        },
        navigateToScreen: function(params){
            quotessearchFactory.navigateToScreen(params);
        }
    };
});

app.factory('autocreateFactory', function($rootScope, quotescreateFactory){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
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

app.factory('additionalInfoFactory', function($rootScope, quotescreateFactory, MetaModel, resourceFactory, $location){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        },
        calculatePremium: function(params){
            if(params.inputComponent.action){
                MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, undefined, $location);
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

app.factory('loginFactory', function($rootScope, $filter, $http, growl){
    return {
        navigateToScreen: function(params){
            $rootScope.showIcon = true;
                 $http({
                    url: 'assets/resources/config/users.json',
                    method: 'GET'
                }).success(function(data) {
                    //extract user
                    var user = [];

                    $rootScope.isAuthSuccess = false;
                    angular.forEach(data.users, function(key) {
                        if (key.name === params.scope.resourcesToBind.properties.inputUsername.value && key.password === params.scope.resourcesToBind.properties.inputPassword.value) {
                            $rootScope.isAuthSuccess = true;
                            user = key;
                        }
                    });

                        if (!$rootScope.isAuthSuccess) {
                        growl.error($filter('translate')('INVALID_CREDENTIALS'));
                        return false;
                    }
                    
                    if($rootScope.isAuthSuccess){
                        $rootScope.user = user;
                        sessionStorage.username = user.name;    
                    }
                    
                    $rootScope.nextURL = params.inputComponent.actionURL;
                    $rootScope.navigate(params.inputComponent.actionURL);  
                }).error(function(data) {
                    $rootScope.showIcon = false;
                    if (data && data.exception) {
                        growl.error(data.exception.message, '30');
                    } else {
                        growl.error($filter('translate')('GENERAL_ERROR'));
                    }
                });
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