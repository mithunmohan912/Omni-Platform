'use strict';

/*
exported OCController
*/

LoginController.$inject = ['$scope', '$rootScope', '$location', '$cookieStore', '$http', '$resource', 'OCRoles', 'tmhDynamicLocale', 'LoginSrv', 'FieldService', 'OCInfraConfig', 'OCMetadata'];
ScreenController.$inject = ['$http', '$scope', '$rootScope', '$controller', '$injector', '$routeParams', '$location', 'growl', 'MetaModel', 'resourceFactory', 'TableMetaModel', 'EnumerationService', 'CheckVisibleService'];
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
//jshint ignore :start


/**
 * @file angular-bootstrap-tour is micro-library.
 * Scaffolded with generator-microjs
 * @author  <Ben March>
 */


(function angularBootstrapTour(app) {
    'use strict';

    //all components moved to separate files

}(angular.module('bm.bsTour', [])));



(function (app) {
    'use strict';

    app.provider('TourConfig', [function () {

        var config = {
            prefixOptions: false,
            prefix: 'bsTour'
        };

        this.set = function (option, value) {
            config[option] = value;
        };

        this.$get = [function () {

            var service = {};

            service.get = function (option) {
                return config[option];
            };

            return service;

        }];

    }]);

}(angular.module('bm.bsTour')));



(function (app) {
    'use strict';

    app.controller('TourController', ['$filter', '$timeout', function ($filter, $timeout) {

        var self = this,
            steps = [],
            tour,
            newStepFound = angular.noop,
            dummyStep = {};

        /**
         * Sorts steps based on "order" and set next and prev options appropriately
         *
         * @param {Array} steps
         * @returns {Array}
         */
        function orderSteps(steps) {
            var ordered = $filter('orderBy')(steps, 'order');

            angular.forEach(ordered, function (step, index) {
                step.next = ordered[index + 1] ? index + 1 : - 1;
                step.prev = index - 1;
            });

            return ordered;
        }

        /**
         * As steps are linked, add them to the tour options
         */
        self.refreshTour = function () {
            //remove dummy steps that were previously added
            steps = steps.filter(function (step) {
                return step !== dummyStep;
            });

            //if the first or last step redirects to another page, BT needs a step (dummyStep)
            if (steps[0] && steps[0].redirectPrev) {
                steps.unshift(dummyStep);
            }
            if (steps[steps.length-1] && steps[steps.length-1].redirectNext) {
                steps.push(dummyStep);
            }

            //refresh
            if (tour) {
                tour._options.steps = [];
                tour.addSteps(orderSteps(steps));
            }
        };

        /**
         * Adds a step to the tour
         *
         * @param {object} step
         */
        self.addStep = function (step) {
            if (~steps.indexOf(step)) {
                return;
            }

            steps.push(step);
            self.refreshTour();
            newStepFound(step);
        };

        /**
         * Removes a step from the tour
         *
         * @param step
         */
        self.removeStep = function (step) {
            if (!~steps.indexOf(step)) {
                return;
            }

            steps.splice(steps.indexOf(step), 1);
            self.refreshTour();
        };

        /**
         * Returns the list of steps
         *
         * @returns {Array}
         */
        self.getSteps = function () {
            return steps;
        };

        /**
         * Tells the tour to pause while ngView loads
         *
         * @param waitForStep
         */
        self.waitFor = function (waitForStep) {
            tour.end();
            newStepFound = function (step) {
                if (step.stepId === waitForStep) {
                    tour.setCurrentStep(steps.indexOf(step));
                    $timeout(function () {
                        tour.start(true);
                    });
                }
            };
        };

        /**
         * Initialize the tour
         *
         * @param {object} options
         * @returns {Tour}
         */
        self.init = function (options) {
            options.steps = orderSteps(steps);
            tour = new Tour(options);
            return tour;
        };


    }]);

}(angular.module('bm.bsTour')));



(function (app) {
    'use strict';

    function directive () {
        return ['TourHelpers', function (TourHelpers) {

            return {
                restrict: 'EA',
                scope: true,
                controller: 'TourController',
                link: function (scope, element, attrs, ctrl) {

                    //Pass static options through or use defaults
                    var tour = {},
                        templateReady,
                        events = 'onStart onEnd afterGetState afterSetState afterRemoveState onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'name container keyboard storage debug redirect duration basePath backdrop orphan'.split(' ');

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, tour, options);

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, tour, events);

                    //Compile template
                    templateReady = TourHelpers.attachTemplate(scope, attrs, tour);

                    //Monitor number of steps
                    scope.$watchCollection(ctrl.getSteps, function (steps) {
                        scope.stepCount = steps.length;
                    });

                    //If there is an options argument passed, just use that instead
                    //@deprecated use 'options' instead
                    if (attrs.tourOptions) {
                        angular.extend(tour, scope.$eval(attrs.tourOptions));
                    }

                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(tour, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }

                    //Initialize tour
                    templateReady.then(function () {
                        scope.tour = ctrl.init(tour);
                        scope.tour.refresh = ctrl.refreshTour;
                    });

                }
            };

        }];
    }

    app.directive('tour', directive());
    app.directive('bsTour', directive());

}(angular.module('bm.bsTour')));



(function (app) {
    'use strict';

    app.factory('TourHelpers', ['$templateCache', '$http', '$compile', 'TourConfig', '$q', function ($templateCache, $http, $compile, TourConfig, $q) {

        var helpers = {},
            safeApply;

        /**
         * Helper function that calls scope.$apply if a digest is not currently in progress
         * Borrowed from: https://coderwall.com/p/ngisma
         *
         * @param {$rootScope.Scope} scope
         * @param {Function} fn
         */
        safeApply = helpers.safeApply = function(scope, fn) {
            var phase = scope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        };

        /**
         * Compiles and links a template to the provided scope
         *
         * @param {String} template
         * @param {$rootScope.Scope} scope
         * @returns {Function}
         */
        function compileTemplate(template, scope) {
            return function (/*index, step*/) {
                var $template = angular.element(template); //requires jQuery
                return $compile($template)(scope);
            };

        }

        /**
         * Looks up a template by URL and passes it to {@link helpers.compile}
         *
         * @param {String} templateUrl
         * @param {$rootScope.Scope} scope
         * @returns {Promise}
         */
        function lookupTemplate(templateUrl, scope) {

            return $http.get(templateUrl, {
                cache: $templateCache
            }).success(function (template) {
                if (template) {
                    return compileTemplate(template, scope);
                }
                return '';
            });

        }

        /**
         * Converts a stringified boolean to a JS boolean
         *
         * @param string
         * @returns {*}
         */
        function stringToBoolean(string) {
            if (string === 'true') {
                return true;
            } else if (string === 'false') {
                return false;
            }

            return string;
        }

        /**
         * Helper function that attaches proper compiled template to options
         *
         * @param {$rootScope.Scope} scope
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         */
        helpers.attachTemplate = function (scope, attrs, options) {

            var deferred = $q.defer(),
                template;

            if (attrs[helpers.getAttrName('template')]) {
                template = compileTemplate(scope.$eval(attrs[helpers.getAttrName('template')]), scope);
                options.template = template;
                deferred.resolve(template);
            } else if (attrs[helpers.getAttrName('templateUrl')]) {
                lookupTemplate(attrs[helpers.getAttrName('templateUrl')], scope).then(function (template) {
                    if (template) {
                        options.template = template.data;
                        deferred.resolve(template);
                    }
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;

        };

        /**
         * Helper function that attaches event handlers to options
         *
         * @param {$rootScope.Scope} scope
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         * @param {Array} events
         */
        helpers.attachEventHandlers = function (scope, attrs, options, events) {

            angular.forEach(events, function (eventName) {
                if (attrs[helpers.getAttrName(eventName)]) {
                    options[eventName] = function (tour) {
                        safeApply(scope, function () {
                            scope.$eval(attrs[helpers.getAttrName(eventName)]);
                        });
                    };
                }
            });

        };

        /**
         * Helper function that attaches observers to option attributes
         *
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         * @param {Array} keys attribute names
         */
        helpers.attachInterpolatedValues = function (attrs, options, keys) {

            angular.forEach(keys, function (key) {
                if (attrs[helpers.getAttrName(key)]) {
                    options[key] = stringToBoolean(attrs[helpers.getAttrName(key)]);
                    attrs.$observe(helpers.getAttrName(key), function (newValue) {
                        options[key] = stringToBoolean(newValue);
                    });
                }
            });

        };

        /**
         * Returns the attribute name for an option depending on the prefix
         *
         * @param {string} option - name of option
         * @returns {string} potentially prefixed name of option, or just name of option
         */
        helpers.getAttrName = function (option) {
            if (TourConfig.get('prefixOptions')) {
                return TourConfig.get('prefix') + option.charAt(0).toUpperCase() + option.substr(1);
            } else {
                return option;
            }
        };

        return helpers;

    }]);

}(angular.module('bm.bsTour')));


(function (app) {
    'use strict';

    function directive() {
        return ['TourHelpers', '$location', function (TourHelpers, $location) {

            return {
                restrict: 'EA',
                scope: true,
                require: '^tour',
                link: function (scope, element, attrs, ctrl) {

                    //Assign required options
                    var step = {
                            element: element,
                            stepId: attrs.tourStep
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'content title path animation container placement backdrop redirect orphan reflex duration nextStep prevStep nextPath prevPath'.split(' '),
                        orderWatch,
                        skipWatch,
                        templateReady;

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
                        ctrl.refreshTour();
                    });

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, step, events);

                    //Compile templates
                    templateReady = TourHelpers.attachTemplate(scope, attrs, step);

                    //Check whether or not the step should be skipped
                    function stepIsSkipped() {
                        var skipped;
                        if (attrs[TourHelpers.getAttrName('skip')]) {
                            skipped = scope.$eval(attrs[TourHelpers.getAttrName('skip')]);
                        }
                        if (!skipped) {
                            skipped = !!step.path || (element.is(':hidden') && !attrs.availableWhenHidden);
                        }
                        return skipped;
                    }
                    skipWatch = scope.$watch(stepIsSkipped, function (skip) {
                        if (skip) {
                            ctrl.removeStep(step);
                        } else {
                            ctrl.addStep(step);
                        }
                    });

                    scope.$on('$destroy', function () {
                        ctrl.removeStep(step);
                        orderWatch();
                        skipWatch();
                    });

                    //If there is an options argument passed, just use that instead
                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(step, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }

                    //set up redirects
                    function setRedirect(direction, path, targetName) {
                        var oldHandler = step[direction];
                        step[direction] = function (tour) {
                            if (oldHandler) {
                                oldHandler(tour);
                            }
                            ctrl.waitFor(targetName);

                            TourHelpers.safeApply(scope, function () {
                                $location.path(path);
                            });
                        };
                    }
                    if (step.nextPath) {
                        step.redirectNext = true;
                        setRedirect('onNext', step.nextPath, step.nextStep);
                    }
                    if (step.prevPath) {
                        step.redirectPrev = true;
                        setRedirect('onPrev', step.prevPath, step.prevStep);
                    }

                    //Add step to tour
                    templateReady.then(function () {
                        ctrl.addStep(step);
                        scope.tourStep = step;
                    });

                }
            };

        }];
    }

    app.directive('tourStep', directive());
    app.directive('bsTourStep', directive());

}(angular.module('bm.bsTour')));

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
   /*
   if ($cookieStore.get('userid') === null || $cookieStore.get('userid') === undefined) {
            $location.url('/');
       }*/
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
	global angular
*/

angular.module('omnichannel').directive('renderer', ['MetaModel', '$resource', '$q', function(MetaModel, $resource, $q/*$filter, $resource, MetaModel, resourceFactory*/){

	return {
		restrict: 'E',
		scope: {
			metamodel: '=',
			resourceUrl: '='
		},
		link: function($scope){
			$scope.$watchGroup(['metamodel', 'resourceUrl'], function(newValue, oldValue){
				if(newValue[0] && newValue[1]){
					var path = 'assets/resources/metamodel/'+ newValue[0] + '.json';
					$resource(path).get(function(data) {
						_init(data.metamodel);
			        });
				}
			});

			function _init(metamodelObject){
				$scope.metamodelObject = metamodelObject;
				$scope.resultSet = {};

				MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);
				
				$scope.$watchCollection('resultSet', function(newValue, oldValue){
					if(newValue){
						$scope.resourcesToBind = {};
						for(var resource in newValue){
							$scope.resourcesToBind[newValue[resource].identifier] = newValue[resource];
						}

						for(var resource in $scope.resourcesToBind){
							$scope.resourcesToBind.properties = $scope.resourcesToBind.properties || {};
							for(var i = 0; i < $scope.metamodelObject.sections.length; i++){
								for(var j = 0; j < $scope.metamodelObject.sections[i].properties.length; j++){
									if($scope.metamodelObject.sections[i].properties[j].id in $scope.resourcesToBind[resource].properties){
										$scope.resourcesToBind.properties[$scope.metamodelObject.sections[i].properties[j].id] = $scope.resourcesToBind[resource].properties[$scope.metamodelObject.sections[i].properties[j].id];
									}
								}
							}
						}
					}
				});
				
				
			}
		},
		templateUrl: 'src/ocInfra/templates/components/renderer.html'
	};
}]);
'use strict';

/*
	global angular
*/

angular.module('omnichannel').directive('tableRender', ['MetaModel', '$resource', '$location', '$injector', function(MetaModel, $resource, $location, $injector){
	return {
		restrict: 'E',
		scope: {
			metamodel: '=',
			resourceUrl: '='
		},
		link: function($scope){

			$scope.$watchGroup(['metamodel', 'resourceUrl'], function(newValue, oldValue){
				if(newValue[0] && newValue[1]){
					var path = 'assets/resources/metamodel/'+ newValue[0] + '.json';
					$resource(path).get(function(data) {
						_init(data.tableMetaModel);
			        });
				}
			});

			function _init(metamodelObject){
				$scope.resultSet = {};
				$scope.metamodelObject = metamodelObject;
				MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);

				$scope.$watchCollection('resultSet', function(newValue, oldValue){
					if(newValue){
						$scope.items = [];
						newValue[$scope.resourceUrl].items.forEach(function(item){
							$scope.items.push(newValue[item.href]);
						});
					}
				});

				
				$scope.screenFactoryName = $location.path().split('/screen/')[1].split('/')[0] + 'Factory';
				$scope.actionFactory = $injector.get($scope.screenFactoryName);
			}


			$scope.execute = function(action, displayedItem, field) {
				if(!action.method){
					if($scope.metamodelObject['buttonMethod'] && action.buttonAction){
						$scope.actionFactory[$scope.metamodelObject['buttonMethod']](displayedItem, field);
					} else {
						$scope[action.value](displayedItem, field);
					}
				} else {
					$scope.actionFactory[action.method](displayedItem, field);
				}
			};

			$scope.isValidStatus = function(displayeditem){
 				
 			};

 			// FIXME TODO: Possibly needed if there are different modes (same collection, different items, i.e: automobile, trailer, etc)
 			$scope.isCreateable = function(index, modePost) {

			};

			$scope.isVisible = function(column) {
				// FIXME TODO: Visibility to hide columns on UI fields probably
				return true;
			};


		},
		templateUrl: 'src/ocInfra/templates/components/table.html'
	};
}]);
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
app.directive('formatDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {
            // formatters sets the value from the model to the view
            
            modelCtrl.$formatters.push(function(modelValue) {
                if (modelValue) {
                    var date = new Date(modelValue);
                    modelCtrl.$modelValue = date;
                    return date;
                }
            });

        }
    };
});


'use strict';


/*
global app
*/

/*
exported ScreenController
*/

app.factory('MetaModel', ['$resource', '$rootScope', '$location', '$browser', '$q', 'resourceFactory', 'growl', function($resource, $rootScope, $location, $browser, $q, resourceFactory, growl) {
    var self = this;
    this.load = function(scope, regionId, screenId, onSuccess, resolve) {
        var path;
        scope.regionId = regionId;
        if(regionId){
             path='assets/resources/metamodel/regions/'+regionId+'/'+ screenId + '.json';
        }
        else{
            path='assets/resources/metamodel/'+ screenId + '.json';
        }
        $resource(path).get(function(m) {
            scope.screenId = screenId;
            $rootScope.title = m.metamodel.title;

            if (m.include && m.include.length > 0) {
                loadReferencedMetaModels(growl, scope, m, screenId, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve);
            } else {
                setScreenData($rootScope, scope, m, screenId, $browser, onSuccess, resolve);
            }
            loadOptions(growl, scope, screenId, regionId, $rootScope, resourceFactory);
        }, function() {
            $rootScope.showIcon = false;
            //showMessage($rootScope.appConfig.timeoutMsg);
            growl.addErrorMessage($rootScope.appConfig.timeoutMsg);
            return;
        });
    };


    this.actionHandling=function(item, $scope, regionId, screenId, action, resourceFactory, tab, optionFlag, resolve){
        //Retrieve the meta-model for the given screen Id from the scope
        var metaModel = $scope.metamodel[screenId];
        
        //Add new values to $scope.data
        //incase the data is Date the code will select current data and reforamt 
        if(metaModel.defaultValue !== undefined){
            angular.forEach(metaModel.defaultValue, function(resource) {
                if(action ===resource.action){
                    if(resource.value === 'Date'){
                        resource.value = formatIntoDate(new Date());    
                    }
                    $scope.data[resource.field] = resource.value;
                }
            });
        }

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
                // make sure alway update OptionsData when update by tab
                if(optionFlag || tab !== undefined){
                    optionsMapForResource = undefined;
                }

                if(optionsMapForResource === undefined){
                    loadOptionsDataForMetamodel(growl, item, resourcelist, $scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve);
                }else{
                    var options = optionsMapForResource.get(action);
                    if(options !== undefined){
                        httpMethodToBackEnd(growl, item, $scope, resourceFactory, $rootScope, options, resolve);       
                    } else{
                        loadOptionsDataForMetamodel(growl, item, resourcelist, $scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve);
                    }
                }
            });
        }
    };

    this.setHeaders = function($rootScope){
        $rootScope.headers = { 
            'Accept': 'application/vnd.hal+json, application/json',
            'Content-Type': 'application/json',
            'x-IBM-Client-id' : 'f9220738-65e5-432d-9b8f-05e8357d1a61',
            'x-IBM-Client-Secret' : 'gT1lS3aV8yS1iS3lY3kB7bL8pH0cH6nJ6yT4jH1aQ6pL8aR6hI' 
        };

        if($rootScope.user && $rootScope.user.name){
            $rootScope.headers.username = $rootScope.user.name;
        }

        $rootScope.headers = null;
    };
    
    /*============================================= Helper methods for components =============================================*/
    /*
        This function is in charge of analyzing the metamodel object and create an array with all the urls (resource 
        dependencies) that must be queried based on a $http response.
        Entry parameters:
            - responseData: Success $http response data object.
            - metamodel: Object representing the UI metamodel.
        Output:
            - An array containing all the resource urls that must be retrieved.
    */
    function _extractBusinessDependencies(responseData, metamodel){
        if(!metamodel){
            console.warn('No metamodel object to extract business dependencies');
            return [];
        } else if(!metamodel.businessObject){
            return [];
        }

        var dependencies = [];
        var keySet = [];

        // Process http response to know which is the main key of the entity
        for(var property in responseData){
            if(property.indexOf('_') !== 0 && property.indexOf(':') > 0){
                var propertyKey = property.split(':')[0];
                if(keySet.indexOf(propertyKey) === -1){
                    keySet.push(propertyKey);
                }
            }
        }

        // If our business object specifies a dependency for the key obtained before, we extract those links to query them
        keySet.forEach(function(objectKey){
            if(objectKey in metamodel.businessObject){
                metamodel.businessObject[objectKey].forEach(function(businessDependency){
                    if(businessDependency in responseData._links){
                        dependencies.push({ href: responseData._links[businessDependency].href, resource: businessDependency });
                    }
                });
            }
        });

        return dependencies;
    }

    /*
        Based on a valid (success) data http response (data object contained in $http response) this function 
        creates and returns an object (map) where the keys are the names of the properties and the values are 
        objects containing the following information:
            - metamodel: Object representing the metamodel specified by the backend, such as maximum lengths.
            - value: Value of the property.
            - required: Boolean that indicates whether or not this property is required.
            - editable: Boolean that indicates whether or not this property is editable.
            - self: String URL of the entity this property belongs to.
            - consistent: Boolean representing the status (valid or not) of this property in the backend.
            - statusMessages: Object containing 3 arrays, one for every type of severity message (information, 
              warning, error), and the counter that indicates how many errors and warnings we have to deal with.
        Entry parameters:
            - responseData: Success $http response data object.
        Output:
            - Object containing the processed properties.
    */
    function _processProperties(responseData){
        var propertiesObject = {};

        if(responseData && responseData._options && responseData._embedded){
            // First get the PATCH and self links to use them later
            var updateCRUD;
            var resourceURL;

            responseData._options.links.forEach(function(crud){
                if(crud.rel === 'update'){
                    updateCRUD = crud;
                }
            });


            for(var link in responseData._links){
                 if(responseData._links[link].rel === 'self'){
                    resourceURL = responseData._links[link].href;
                }
            };

            // Process the entity properties
            for(var property in responseData._options.properties){
                if(responseData._options.properties[property].format !== 'uri'){
                    propertiesObject[property] = {};
                    propertiesObject[property].metamodel = responseData._options.properties[property];
                    propertiesObject[property].value = responseData[property];
                    propertiesObject[property].self = resourceURL;
                    propertiesObject[property].required = (responseData._options.required && responseData._options.required.indexOf(property) >= 0);
                    propertiesObject[property].editable = (updateCRUD !== undefined && (property in updateCRUD.schema.properties));
                    propertiesObject[property].statusMessages = {information: [], warning: [], error: [], errorCount: 0};
                    propertiesObject[property].consistent = true;
                }
            }

            // Process status of the properties (based on status_report coming from backend)
            for(var i = 0; i < responseData._embedded.length; i++) {
                if(responseData._embedded[i].rel.indexOf('status_report') >= 0){
                    for(var j = 0; j < responseData._embedded[i].data.messages.length; j++){
                        var item = responseData._embedded[i].data.messages[j];
                        if(item.context in propertiesObject){
                            propertiesObject[item.context].statusMessages[item.severity].push(item);
                            if(item.severity !== 'information'){
                                propertiesObject[item.context].consistent = false;
                                propertiesObject[item.context].statusMessages.errorCount++;
                            }
                        }
                    }

                    break;
                }
            }
        }

        return propertiesObject;
    }

    function _extractItemDependencies(responseData, summaryData){
        var itemDependencies = [];

        if(responseData && responseData._links){
            for(var linkKey in responseData._links){
                if(linkKey === 'item'){
                    var items = responseData._links[linkKey];
                    
                    if(!Array.isArray(items)){
                        items = [items];
                    }

                    for(var j = 0; j < items.length; j++){
                        var item = items[j];
                        itemDependencies.push({ href: item.href, title: item.title });
                        if(item.summary){
                            // By calling _processResponse without arguments we get the 'skeleton' for a resource
                            summaryData[item.href] = _processResponse();
                            for(var property in item.summary){
                                summaryData[item.href].properties[property] = { value: item.summary[property] };
                            }
                        }
                    }
                }
            }
        }

        return itemDependencies;
    }

    function _processResponse(responseData, metamodel, summaryData){
        var resource = {
            'dependencies':[],
            'properties': {},
            'items': [],
            'deletable': false,
            'patchable': false,
            'creatable': false
        };
        
        if(responseData && responseData._links && responseData._options){
            resource['href'] = responseData._links.self.href;
            resource['up'] = responseData._links.up.href;

            resource.properties = _processProperties(responseData);
            resource.dependencies = _extractBusinessDependencies(responseData, metamodel);
            resource.items = _extractItemDependencies(responseData, summaryData);

            // Process CRUD operations to check whether or not we can PATCH, DELETE...
            responseData._options.links.forEach(function(apiOperation){
                if(apiOperation.rel === 'update'){
                    resource.patchable = true;
                } else if(apiOperation.rel === 'delete'){
                    resource.deletable = true;
                } else if(apiOperation.rel === 'create'){
                    resource.creatable = true;
                }
            });
        }

        return resource;
    };


    /*============================================= END Helper methods for components =============================================*/

    /*============================================= Component methods =============================================*/
    /*
        This function queries the backend with the given URL and all the URLs found in the business object
        configuration specified in the metamodel object.
        Entry parameters:
            - rootURL -> URL of the resource to get
            - metamodel -> Metamodel object
            - resultSet -> Object where the retrieved resources will be inserted
        Output:
            - None. It will insert the results in the third parameter.
    */
    this.prepareToRender = function(rootURL, metamodel, resultSet, dependencyName){
        // Entry validation
        if(!resultSet){
            return;
        }

        var responseGET = resourceFactory.get(rootURL);
        // Maybe we get a promise, maybe the cached response
        if(responseGET.then){
            responseGET.then(function success(httpResponse){
                var responseData = httpResponse.data || httpResponse;
                var summaryData = {};

                // Add the resource to the result set
                resultSet[rootURL] = _processResponse(responseData, metamodel, summaryData);
                resultSet[rootURL].identifier = rootURL.substring(rootURL.lastIndexOf('/')+1);
                resultSet[rootURL].href = rootURL.substring(0, rootURL.lastIndexOf('/')+1)+resultSet[rootURL].identifier;
                resultSet[rootURL].identifier = dependencyName || resultSet[rootURL].identifier;

                // Analyze business dependencies in order to extract them
                resultSet[rootURL].dependencies.forEach(function(url){
                    self.prepareToRender(url.href, metamodel, resultSet, url.resource);
                });

                // Shall we stick with the summaries or shall we retrieve the whole item ??
                if(metamodel.collectionsToProcess && metamodel.collectionsToProcess.indexOf(resultSet[rootURL].identifier) >= 0){
                    resultSet[rootURL].items.forEach(function(url){
                        self.prepareToRender(url.href, metamodel, resultSet);
                    });
                } else {
                    for(var resourceURL in summaryData){
                        resultSet[resourceURL] = summaryData[resourceURL];
                        resultSet[resourceURL].identifier = resourceURL.substring(resourceURL.lastIndexOf('/')+1);
                        resultSet[resourceURL].href = resourceURL;
                    }
                }
            }, function error(errorResponse){
                // FIXME TODO: Do something useful if required, for now just logging
                console.error(errorResponse);
                throw errorResponse;
            });
        }
    };
    /*============================================= END Component methods =============================================*/

    return this;
}]);

function loadOptions(growl, scope, screenId, regionId, $rootScope, resourceFactory){
    if(screenId !== undefined){
        //Read metamodel from the root scope
        var metaModel = scope.metamodel[screenId];

        if(metaModel !== undefined){
            //Retrieve resource list from the meta model
            var resourcelist = metaModel.resourcelist;
            if(resourcelist !== undefined && resourcelist.length > 0){
                loadOptionsDataForMetamodel(growl, undefined, resourcelist, scope, regionId, $rootScope, resourceFactory);
            }
        }    
    }
}

function loadOptionsDataForMetamodel(growl, item, resourcelist, scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve){
        if(resourcelist !== undefined && resourcelist.length > 0){
            //Iterate through the resource list of meta model
            angular.forEach(resourcelist, function(resource) {
                
                console.log('RESOURCE : '+resource);

                //Formulate the URL for the options call
                var url;
                var newURL;
                if($rootScope.resourceHref) {
                    newURL = $rootScope.resourceHref;
                }
                else {
                    url = scope.HostURL + resource;
                    //Retrieve regionToSORMap from the rootScope
                    var regionToSORMap = scope.regionToSoR;
                    //Retrieve the application name for the given region Id
                    var applName = regionToSORMap[regionId];
                    //Replace the regionId with application name in the URL
                    newURL = url.replace(':regionId',applName);
                }

                console.log('OPTIONS CALL ON : '+newURL);
                //Formulate the key for storing the options map for the given resource on the region
                var keyForOptionsMap = regionId +':'+resource;
                //Fetch the options map for the given resource

                if(scope.optionsMap === undefined){
                    scope.optionsMap = [];
                }

                var optionsMapForResource = scope.optionsMap[keyForOptionsMap];
                // make sure alway update OptionsData when update by tab
                if(optionFlag || tab !== undefined){
                    optionsMapForResource = undefined;
                }

                if(optionsMapForResource === undefined){
                    optionsMapForResource = new Map();
                }
                    //Options call for the resources in the meta model.
                    resourceFactory.options(newURL, $rootScope.headers).success(function(data){
                    //Fetch the options response
                    var optiondataobj = data._options.links;
                    var options;
                    if(tab !== undefined) {
                        //Fetch the links response
                        var tabObj = data._links[tab];

                        if(tabObj !== undefined){

                            var tabUrl = tabObj.href;

                            resourceFactory.options(tabUrl, $rootScope.headers).success(function(data){
                                var detailTabUrl = data._links.item.href;
                                resourceFactory.options(detailTabUrl, $rootScope.headers).success(function(data){
                                    optiondataobj = data._options.links;
                                    setOptionsMapForResource(optiondataobj, optionsMapForResource);
                                    scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                                    if(action !== undefined){
                                       options = optionsMapForResource.get(action);
                                       if(options !== undefined){
                                           httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                       }
                                    }
                                });
                            });
                        } else {
                            setOptionsMapForResource(optiondataobj, optionsMapForResource);
                            scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                            if(action !== undefined){
                                options = optionsMapForResource.get(action);
                                if(options !== undefined){
                                    httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                }
                            }
                        }
                        } else {
                            setOptionsMapForResource(optiondataobj, optionsMapForResource);
                            scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                            if(action !== undefined){
                                options = optionsMapForResource.get(action);
                                if(options !== undefined){
                                    httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                }
                            }
                        }
                    });
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
        if(optionsMapForResource.get(object.action) !== undefined){
            optionsMapForResource.set(object.action, object);    
        }else{
            optionsMapForResource.set(object.action, object);    
        }
    });
}

function httpMethodToBackEnd(growl, item, $scope, resourceFactory, $rootScope, options, resolve){
    //Retrieve the URL, Http Method and Schema from the options object
    var url = options.url;
    var httpmethod = options.httpmethod;
    var schema = options.schema;
    // console.log(options.action + ' Action : Perform '+httpmethod +' operation on URL - '+url +' with following params - ');

    var params={};
    //Set the params data from the screen per the schema object for the given action (from the options object)
    params = setData($scope, schema, params);

    if(httpmethod==='GET'){
        $rootScope.loader.loading=true;    
        //Call the get method on the Data Factory with the URL, Http Method, and parameters
        resourceFactory.get(url,params,$rootScope.headers).success(function(data){
            $rootScope.loader.loading=false;
            //Load the results into the search results table
            if(options.action==='search'){
                if(data._links.item){
                    $scope.stTableList = data._links.item;
                    $scope.displayed = data._links.item;
                    $scope.stTableList.showResult = true;
                }else{
                    $scope.stTableList = [];
                    $scope.displayed = [];
                    $scope.stTableList.showResult = false;
                }    
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            //showMessage($rootScope.locale.GET_OPERATION_FAILED);
            growl.addErrorMessage($rootScope.locale.GET_OPERATION_FAILED);
        });
    } else if(httpmethod==='POST'){
        $rootScope.loader.loading=true;
        //Call the post method on the Data Factory
        resourceFactory.post(url,params,$rootScope.headers).success(function(data){
            if (data) {
                if($rootScope.regionId === 'us'){
                     if(data._links.self.quoteNumber !== undefined){
                        $scope.data['quote:identifier']=data._links.self.quoteNumber;
                        $scope.data['quote:annual_cost'] =data._links.self.premium;                        
                     }
                     else{
                        //showMessage($rootScope.locale.CREATE_OPERATION_FAILED);
                        growl.addErrorMessage($rootScope.locale.CREATE_OPERATION_FAILED);
                     }  
                } else {
                    $rootScope.resourceHref = data._links.self.href;
                    $rootScope.loader.loading=false;
                    if(resolve) {
                        resolve();
                    }                    
                }
            }
        }).error(function(){
            $rootScope.loader.loading=false;
        });
    } else if(httpmethod==='PATCH'){
        $rootScope.loader.loading=true;
        //Call the patch method on the Data Factory
        resourceFactory.patch(url,params,$rootScope.headers).success(function(data){
            $rootScope.loader.loading=false;
            if (data) {
                if(resolve) {
                    resolve();
                }
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            //showMessage($rootScope.locale.PATCH_OPERATION_FAILED);
            growl.addErrorMessage($rootScope.locale.PATCH_OPERATION_FAILED);
        });
    } else if(httpmethod==='DELETE'){
        resourceFactory.delete(url,$rootScope.headers).success(function(data){
            if(data.outcome === 'success'){  
                var index=0;
                angular.forEach($scope.stTableList, function(field){
                    if(item.$$hashKey===field.$$hashKey){
                        $scope.stTableList.splice(index, 1);    
                    } else{
                        index=index+1;     
                    }
                });
            }
            angular.forEach(data.messages, function(value){
                //showMessage(value.message);    
                growl.addErrorMessage(value.message);
            });
        });
    }
}

function loadReferencedMetaModels(growl, scope, metaModel, screenId, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve) {
    var promises = [];
    var path;
    if(regionId){
         path='assets/resources/metamodel/regions/'+regionId+'/';
    }
    else{
        path='assets/resources/metamodel/';
    }
    angular.forEach(metaModel.include, function(value) {
        promises.push($resource(path + value + '.json').get(function(m) {
            $rootScope.metamodel[value] = m.metaModel;
        }, function() {
            $rootScope.showIcon = false;
            //showMessage($rootScope.appConfig.timeoutMsg);
            growl.addErrorMessage($rootScope.appConfig.timeoutMsg);
            return;
        }).$promise);
    });
    $q.all(promises).then(function() {
        setScreenData($rootScope, scope, metaModel, screenId, $browser, onSuccess, resolve);
    });
}

function setScreenData($rootScope, scope, m, screenId, $browser, onSuccess, resolve) {
    var metamodel = m.metamodel;
    var resourcelist = metamodel.resourcelist;
    
    if(resourcelist !== undefined && resourcelist.length >0){
        angular.forEach(resourcelist, function(resource){
            scope.metamodel[resource] = m.metamodel;    
        });
    }
    scope.metamodel = scope.metamodel || {};
    scope.metamodel[screenId] = m.metamodel;

    $browser.notifyWhenNoOutstandingRequests(function() {
        //changeMandatoryColor($rootScope);
        $rootScope.$apply();

    });

    if(onSuccess){
        onSuccess(m.metamodel);
    }
    
    if(resolve){
        resolve();
    }
}

function setData($scope, schema, object){
    if(schema !== undefined){
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
    }
    
    return object;
}

function formatIntoDate(value){
    if(typeof value === 'string') {
        return value;
    }
   return value.getFullYear() + '-' + (('0' + (value.getMonth() + 1)).slice(-2)) + '-' + ('0' + value.getDate()).slice(-2);
}

app.factory('TableMetaModel', ['$resource', '$rootScope', function($resource, $rootScope) {
    this.load = function(tableId, onSuccess) {
        $resource('assets/resources/metamodel/table/' + $rootScope.regionId +'/' + tableId + '.json').get(function(m) {
            onSuccess(m.tableMetaModel);
        }, function() {
            return;
        });
    };

    return this;
}]);

function changeMandatoryColor($rootScope) {
    if ($rootScope.screenId !== undefined) {
        $('#' + $rootScope.metamodel[$rootScope.screenId].formid + ' input[ng-required=\'true\']').css('background-color', $rootScope.requiredColor);
        $('#' + $rootScope.metamodel[$rootScope.screenId].formid + ' select[ng-required=\'true\']').css('background-color', $rootScope.requiredColor);
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
        $location.url('/');

    };

    $scope.setLocate = function(newlocale) {

        $rootScope.newlocale = newlocale;
        angular.forEach($rootScope.localeOpts.options, function(val) {
            if (val.value === $rootScope.newlocale) {
                $rootScope.selectedLanguage = val.description;
            }
        });
        $resource('ocInfra/assets/resources/i18n/' + newlocale + '.json').get(function(data) {
            $rootScope.locale = data;
            tmhDynamicLocale.set(newlocale);

        }, function() {});


    };

    $resource('assets/resources/metadata/header.json').get(function(data) {

        $rootScope.headermetadata = data.metadata;
    }, function() {});

}]);

'use strict';
/*global validateLogin,growl*/

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
                growl.addErrorMessage($rootScope.locale.NETWORK_UNAVAILABLE, '30');
            } else {
				LoginSrv.runLogin($scope, nextScreenId);
            }
        }
    };
}





'use strict';
/*
global app 
*/
app.service('LoginSrv', ['$rootScope', '$resource', '$cookieStore', '$http', 'OCRoles', 'tmhDynamicLocale', 'growl', function($rootScope,$resource,  $cookieStore, $http,  OCRoles, tmhDynamicLocale, growl){	
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
                        growl.addErrorMessage($rootScope.locale.INVALID_CREDENTIALS);
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
                        growl.addErrorMessage(data.exception.message, '30');
                    } else {
                        growl.addErrorMessage($rootScope.locale.GENERAL_ERROR);
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

app.factory('resourceFactory', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var resourceDirectory = {};

    function _get(url, params, headers) {
        var promise;
        if (!resourceDirectory[url]) {
            promise = $http({
                    method : 'GET',
                    url : url,
                    data : params,
                    headers : headers
            });
            if (promise.then) {
                promise.then(function(response) {
                    resourceDirectory[url] = response.data;
                    $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

                }, function(error) {
                    console.error(error);
                    throw error;
                });   
            }
        } else {
            promise = $q(function(resolve) {
                resolve(resourceDirectory[url]);
            });
            promise.success = function(callback) {
                var _success = callback;
                promise.then(_success, null);
                return promise;
            };
            promise.error = function(callback) {
                var _error = callback;
                promise.then(null, _error);
                return promise;
            };
        }
        return promise;
    }

    function _refresh(url, params, headers) {
        resourceDirectory[url] = null;
        return _get(url, params, headers);
    }

    function _post(url, params, headers) {
        var promise = $http({
                method: 'POST',
                url: url,
                headers: headers,
                data: params
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[url] = response.data;
                $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

            }, function(error) {
                console.error(error);
                throw error;
            });   
        }
        return promise;
    }

    function _delete(url, headers) {
        var promise = $http({
            method : 'DELETE',
            ul : url,
            headers : headers
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[url] = null;
                $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

            }, function(error) {
                console.error(error);
                throw error;
            });   
        }
        return promise;
    }

    function _patch(url,params,headers) {
        var promise = $http({
                method: 'PATCH',
                url: url,
                headers: headers,
                data: params
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[url] = response.data;
                $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

            }, function(error) {
                console.error(error);
                throw error;
            }); 
        } 
        return promise;
    }

    function _execute(url, params, headers, method) {
        var promise = $http({
                method: method,
                url: url,
                headers: headers,
                data: params
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[url] = response;
                $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

            }, function(error) {
                console.error(error);
                throw error;
            }); 
        } 
        return promise;

    }

    return {
        'get': _get,
        'refresh': _refresh,
        'post': _post,
        'delete' : _delete,
        'patch': _patch,
        'execute': _execute,

        'getData' : function (urlBase) {
            return $http.get(urlBase);
        },
        'insert' : function (urlBase,obj) {
            return $http.post(urlBase, obj);
        },

        'update' : function (urlBase,obj) {
            return $http.put(urlBase + '/' + obj.id, obj);
        },
        'options' : function(urlBase, headers){
            var obj =   $http(
                {
                    method : 'GET',
                    url : urlBase,
                    headers : headers
                }
            );   
            return obj;
        }
    };

}]);
'use strict';
/*
global angular
*/

/*
exported ScreenController
*/

var screenname;
function ScreenController($http, $scope, $rootScope,$controller, $injector,$routeParams, $location, growl,MetaModel, resourceFactory, TableMetaModel, EnumerationService, CheckVisibleService) {

    $rootScope.enumData = {};
    $rootScope.typeaheadData = {};
    $rootScope.optionsMap = [];
    $scope.checkRegionId = $rootScope.regionId;

    $scope.showErr = function () {       
        growl.addErrorMessage('<b>Error:</b> Uh oh!');
        growl.addInfoMessage('Im  a info message');
        growl.addWarnMessage('Im  a warn message');
        growl.addSuccessMessage('Im  a success message');
    };
   
	screenname  = 'OmniChannel';
	$rootScope.showHeader = true;
	$scope.disableNext = false;

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

    $scope.getNamesList = function(viewValue, typeahead, fieldName){
        
        if(typeahead){
            var url = $rootScope.HostURL + 'persons?' + fieldName + '=' + viewValue;
            var regionToSORMap = $rootScope.regionToSoR;
            var applName = regionToSORMap[$rootScope.regionId];
            url = url.replace(':regionId',applName);
            resourceFactory.options(url, $rootScope.headers).success(function(data){
                $rootScope.typeaheadData[fieldName] = [];
                $scope.typeaheadData[fieldName] = [];
                angular.forEach(data._links.item, function(value){
                    if(value.summary[fieldName]){
                        $rootScope.typeaheadData[fieldName].push(value.summary[fieldName]);
                    }
                });
                $scope.typeaheadData[fieldName] = $rootScope.typeaheadData[fieldName];
            });
        }
    };

	MetaModel.setHeaders($rootScope);

    $scope.loadTableMetadata = function(section) {
       
        $scope.field={};

        TableMetaModel.load(section.name, function(tableMetaModel) {
            $scope.field.tableMetaModel = tableMetaModel;           
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
			return CheckVisibleService.checkVisible(field, $scope);
		}
		return true;
	};
	
	$scope.loadMetaModel = function() {
		$rootScope.metamodel = {};
		MetaModel.load($scope, (regionExist ? reqParmRegion[1] : reqParmRegion), (screenExist ? reqParmScreen[1] : reqParmScreen));
	};

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
	
	$rootScope.isPrev = false;
	
	$scope.loadOptionData = function() {
		 var url = $rootScope.resourceHref;
		 if (url === undefined) {	
				url = $rootScope.HostURL+$scope.screenId;
		 }
		 
	};

	$scope.loadOptionData();
    
    $scope.stTableList = [];
    $scope.displayed = [];
    $scope.stTableList.showResult = true;

	$scope.doaction = function(method, subsections, action, actionURL, nextScreenId, tab) {

       console.log(nextScreenId);
		var screenId = $rootScope.screenId;
		var regionId = $rootScope.regionId;
		if(action==='navigate'){
            $rootScope.resourceHref = undefined;
            $rootScope.navigate(actionURL);
        }
        else if(action==='nextTab'){
            var nextStep = $rootScope.step + 1;
            var nextLink = $scope.getRelationshipOfNavigateStep(nextStep);
            $scope.selecttab(nextStep, nextLink);
        }
        else if(action==='previousTab'){
            var preStep = $rootScope.step - 1;
            var preLink = $scope.getRelationshipOfNavigateStep(preStep);
            $scope.selecttab(preStep, preLink);
        } else {
            if(tab === undefined){
                $rootScope.resourceHref = undefined;
            }
            if(actionURL !== undefined){
                $rootScope.navigate(actionURL);    
            }
            new Promise(function(resolve) {
                var optionFlag = false;
                MetaModel.actionHandling(undefined, $scope, regionId, screenId, action, resourceFactory, tab, optionFlag, resolve);
            }).then(function(){
                    if(tab !== undefined){
                        var url=$rootScope.resourceHref + '/operations/tariff_calculation/execute';
                        var params = {};
                        resourceFactory.post(url,params,$rootScope.headers).success(function(data){
                            var urlDetail;
                            if(Array.isArray(data.messages)){
                                // get last element of array
                                urlDetail = data.messages[data.messages.length - 1].message[0];
                            } else {
                                urlDetail = data.messages.context;
                            }
                            resourceFactory.get(urlDetail,params,$rootScope.headers).success(function(data){
                            $scope.data = data;
                            console.log('Compute successfully !!');
                            // go to next tab to see premium
                            $rootScope.step = $rootScope.step + 1;
                            loadRelationshipByStep($rootScope.step);
                            $scope.preStep = $rootScope.step;
                            EnumerationService.executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'create');
                        });
                    }).error(function(){
                        //showMessage($rootScope.locale.CALC_PREMIUM_OP_FAILED);
                        growl.addErrorMessage($rootScope.locale.CALC_PREMIUM_OP_FAILED);
                    });
                }else{
                    EnumerationService.loadEnumerationByTab();
                }

            });		
        }
    };

    $scope.getRelationshipOfNavigateStep = function(step){
        var list = $rootScope.metamodel[$rootScope.screenId].sections;
        for(var i = 0; i < list.length; i++){
            var tabObj = list[i];
            if(step === tabObj.step){
                return tabObj.link;
            }
        }
    };
  	  
	$rootScope.next = function() {
        $scope.next();
    };
	
	$scope.next = function() {
	};
	 
	$rootScope.step=1;

	$scope.getenumdata=function(){
	   	var url = 'https://oc-sample-dropdown.getsandbox.com/omnichannel/sample/select';
        resourceFactory.getData(url).success(function(data){
		$scope.enumdata=data;   	
     });
    };

    $scope.preStep = 1;
    $scope.preRel = undefined;
    $rootScope.currRel = undefined;
    $rootScope.currName = undefined;

    function loadRelationshipByStep(step){
        var list = $rootScope.metamodel[$rootScope.screenId].sections;
        angular.forEach(list, function(tabObj){
            if(step === tabObj.step){
                $rootScope.currRel = tabObj.link;
                $rootScope.currName = tabObj.$ref;
            } 
        });
    }
    new Promise(function(resolve) {
        MetaModel.load($scope, (regionExist ? reqParmRegion[1] : reqParmRegion), (screenExist ? reqParmScreen[1] : reqParmScreen), resolve);
    }).then(function(){
        if($location.path().split('/screen/')[1].split('/')[0] === 'dashboard'){
            $rootScope.resourceHref = $rootScope.config.hostURL + 'quotes?_inquiry=ci_saved_items';
        }
        $scope.resourceUrl = $rootScope.resourceHref;
    /*
        loadRelationshipByStep($scope.preStep);
        EnumerationService.loadEnumerationByTab();
        // load data for tab click
        if($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself' && $scope.regionId !== 'us'){
            $scope.loadDataByTab($rootScope.currRel);
        } else if($rootScope.resourceHref !== undefined) {
            var params = {};
            resourceFactory.get($rootScope.resourceHref, params, $rootScope.headers).success(function(data){
                if (data) {
                    $scope.data=data;
                }
            });
            EnumerationService.executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'create');
        }*/
    });

    $scope.selecttab = function(step1, rel) {
        var screenId = $rootScope.screenId;
        var regionId = $rootScope.regionId;

        if ($scope.isValid()) {
            $rootScope.step = step1;
            $rootScope.currRel = rel;

            new Promise(function(resolve) {
                // patch for previous tab
                if ($rootScope.step !== $scope.preStep && rel !== 'undefined') {
                    loadRelationshipByStep($scope.preStep);
                    if (regionId !== 'us') {
                        var optionFlag = true;
                        MetaModel.actionHandling(undefined, $scope, regionId, screenId, 'update', resourceFactory, $scope.currRel, optionFlag, resolve);
                    }
                    $scope.preStep = $rootScope.step;
                    loadRelationshipByStep($scope.preStep);
                }
            }).then(function() {
                // load data for tab click
                if ($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself') {
                    $scope.loadDataByTab($rootScope.currRel);
                } else {
                    var params = {};
                    resourceFactory.get($rootScope.resourceHref, params, $rootScope.headers).success(function(data){
                        if (data) {
                            $scope.data=data;
                        }
                    });
                    EnumerationService.executeEnumerationFromBackEnd($rootScope.resourceHref, $rootScope.headers, 'create');
                }

            });
        }
    };

	$scope.loadDataByTab = function (tab) {

	    var url = $rootScope.resourceHref;

		if (url !== undefined) {
			resourceFactory.options(url, $rootScope.headers).success(function(data){
	            //Fetch the links response
                if(data !== undefined && data._links !== undefined && data._links[tab] !== undefined){
                    var tabUrl = data._links[tab].href;

                    resourceFactory.options(tabUrl, $rootScope.headers).success(function(data){
                        var detailTabUrl = data._links.item.href;

                        var params = {};
                        resourceFactory.get(detailTabUrl, params, $rootScope.headers).success(function(data){
                            if (data) {
                                $scope.data=data;
                            }
                        });
                        EnumerationService.executeEnumerationFromBackEnd(detailTabUrl, $rootScope.headers, 'update');
                    });    
                }
	        });
		}

	};

	$scope.isValid = function(){
        var dataField = [];
        var mandatoryField = $scope.loadmandatoryField();
        var emptyField = [];
        var message = '';

        angular.forEach($scope.data, function(value, key){
             if(value !== '' && value !== undefined && key !== '_links' && key !== '_options' && value !== null){
                dataField.push(key);
             }
        });

        mandatoryField.forEach(function(entry) {
            if($.inArray(entry, dataField) === -1){                    
                console.log(entry);
                emptyField.push(entry);
            }
        });

        if(emptyField.length > 0){
            emptyField.forEach(function(key) {
                var label = $scope.translateKeyToLabelByTab(key);
                message += $rootScope.locale[label] + $rootScope.locale.IS_REQD + '<br />';
            });
            //showMessage(message);
            growl.addErrorMessage(message);
            return false;
        }

        return true;
    };

    $scope.loadmandatoryField = function(){
    	var mandatoryField = [];
    	var arrparent = $rootScope.metamodel[$rootScope.currName].sections;
    	for(var i = 0; i < arrparent.length; i++){
    		var arr = arrparent[i].elements;
    		for(var j = 0; j < arr.length; j++){
	    		var object = arr[j];
	    		if(object.required !== undefined && object.required === 'required'){
	    			mandatoryField.push(object.name);
	    		}
	    	}
    	}
    	return mandatoryField;
    };

    $scope.translateKeyToLabelByTab = function(key){
    	var arrparent = $rootScope.metamodel[$rootScope.currName].sections;
    	for(var i = 0; i < arrparent.length; i++){
    		var arr = arrparent[i].elements;
    		for(var j = 0; j < arr.length; j++){
	    		var object = arr[j];
	    		if(object.name === key){
	    			return object.label;
	    		}
	    	}
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


app.service('EnumerationService', ['$rootScope', 'resourceFactory', function($rootScope, resourceFactory){

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

}]);

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








'use strict';

/*
global app
*/

app.controller('TableController', ['$browser', '$scope', '$rootScope', 'TableMetaData', 'MetaData', 'resourceFactory', '$location', 'CheckVisibleService', function($browser, $scope, $rootScope, TableMetaData, MetaData, resourceFactory, $location, CheckVisibleService) {

    $scope.showResult = true;
    $scope.riskDataSet = [];
    $rootScope.rowCollection = {};

    $scope.loadTableMetadata = function() {
        TableMetaData.load($scope.field.name, function(tableMetaData) {
            $scope.field.tableMetaData = tableMetaData;           
        });
    };

   $scope.checkShow = function(opt) {
        if (opt.visibleWhen) {
            return CheckVisibleService.checkVisible(opt, $scope);
        }

        if (opt.visibleflag === undefined) {
            return true;
        }

        if ( $rootScope.config[opt.visibleflag] === undefined || $rootScope.config[opt.visibleflag] === true) {
            return true;
        } else {
            return false;
        }

    };

    $scope.doActionItem = function(action, item, tableName,url) {
       
        var screenId = $rootScope.screenId;
        var regionId = $rootScope.regionId;
        $rootScope.resourceHref = item.href;
        
        var optionFlag = true;
        
        MetaData.actionHandling(item, $scope, regionId, screenId, action, resourceFactory, optionFlag); 

        if (url !== undefined) {
            $rootScope.navigate(url);
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

