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
    var metamodelLocation = $rootScope.config.templates.metaModel;
    OCMetadata.load($scope,metamodelLocation);
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

growlProvider.globalTimeToLive(30000);
growlProvider.globalDisableCountDown(true);
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
   
   if (sessionStorage.username === null || sessionStorage.username === undefined) {
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

app.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue === undefined){
                inputValue = ''; 
           } 
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         };
         if(attrs.capitalize === 'true'){
           modelCtrl.$parsers.push(capitalize);
           capitalize(scope[attrs.ngModel]);  // capitalize initial value
         }
     }
   };
});
'use strict';

/*
global app
*/

app.directive('decimalInput', function(){
    // Regex to match numbers (positive/negative) with dots and commas
    var regex_valid_chars = /^\$?-?\d+([\.\,]{0,1}\d*){0,1}$/;

    // Function to parse a str as a float. Returns the number parsed with the specified precision, NaN or undefined
    function _parseFloat(str, precision){
        var numberToParse;
        if(!str){
            return undefined;
        }

        // We need it to be a string
        str += '';

        // If the number has both decimal and milliard separators
        if(str.indexOf(',') > 0 && str.indexOf('.') > 0){
            if(str.lastIndexOf(',') > str.lastIndexOf('.')){
                numberToParse = str.substring(0, str.lastIndexOf(',')).replace(/,/g, '').replace(/\./g,'');
                numberToParse += str.substring(str.lastIndexOf(',')).replace(',','.');
            } else {
                numberToParse = str.substring(0, str.lastIndexOf('.')).replace(/,/g, '').replace(/\./g,'');
                numberToParse += str.substring(str.lastIndexOf('.'));
            }
        }
        // Cases for numbers with just decimal separator
        else if(str.indexOf(',') > 0){
            numberToParse = str.substring(0, str.lastIndexOf(',')).replace(/,/g, '');
            numberToParse += str.substring(str.lastIndexOf(','), (str.lastIndexOf(',') + precision) < str.length ? str.lastIndexOf(',')+precision+1 : str.length).replace(',','.');
        } else if(str.indexOf('.') > 0){
            numberToParse = str.substring(0, str.lastIndexOf('.')).replace(/\./g,'');
            numberToParse += str.substring(str.lastIndexOf('.'), (str.lastIndexOf('.') + precision) < str.length ? str.lastIndexOf('.')+precision+1 : str.length);
        } else {
            return parseFloat(str);
        }

        return parseFloat(numberToParse);
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            decimalPrecision: '=?',
            decimalMin: '=?',
            decimalMax: '=?'
        },
        link: function($scope, element, attrs, controller){
            // 2 decimals by default
            $scope.decimalPrecision = $scope.decimalPrecision || 2;
            $scope.decimalMin = $scope.decimalMin || 0;
            $scope.decimalMax = $scope.decimalMax || 9999999;

             controller.$parsers.unshift(function (viewValue) {

                if(!viewValue || viewValue === ''){
                    controller.$setValidity('decimal', true);
                    return viewValue;
                }

                if (regex_valid_chars.test(viewValue)) {
                    controller.$setValidity('decimal', true);
                    var number = _parseFloat(viewValue, $scope.decimalPrecision);
                    if(number < $scope.decimalMin){
                        number = $scope.decimalMin;
                        viewValue = number + '';
                    } else if(number > $scope.decimalMax){
                        number = $scope.decimalMax;
                        viewValue = number + '';
                    }

                    // If the viewValue ends with a character (dot, comma, zero) then we won't update the view because more numbers will be introduced
                    if(!isNaN(parseInt(viewValue.charAt(viewValue.length-1))) && parseInt(viewValue.charAt(viewValue.length-1)) !== 0){
                        controller.$setViewValue(number+'');
                        controller.$render();
                    } else{
                        if(viewValue.indexOf(',') > 0){
                            viewValue = viewValue.split(',')[1].length > $scope.decimalPrecision ? viewValue.substring(0, viewValue.indexOf(',') + $scope.decimalPrecision + 1) : viewValue;
                        } else if(viewValue.indexOf('.') > 0){
                            viewValue = viewValue.split('.')[1].length > $scope.decimalPrecision ? viewValue.substring(0, viewValue.indexOf('.') + $scope.decimalPrecision + 1) : viewValue;
                        }
                        controller.$setViewValue(viewValue);
                        controller.$render();
                    }
                    return number;
                } else {
                    // If the new value is not valid, lets keep the old model value
                    if(viewValue.length === 1 && viewValue.charAt(0) === '-'){
                        return viewValue;
                    } else if(isNaN(parseFloat(controller.$modelValue))){
                        controller.$setViewValue('0');
                    } else {
                        controller.$setViewValue(controller.$modelValue+'');
                    }
                    controller.$render();
                    return controller.$modelValue;
                }
            });

            controller.$formatters.unshift(
               function (modelValue) {

                    if(modelValue){
                        return parseFloat(modelValue).toFixed($scope.decimalPrecision);
                    }
                    // If there is no model value we can either set 0 as default value, or let the placeholder kick in. In this case
                    // we let the placeholder to appear
               }
           );
        }
    };
    });
'use strict';

/*
global app
*/

app.directive('formatDate', ['$filter', function($filter) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelController) {
            modelController.$parsers.push(function(viewValue){
                return $filter('date')(viewValue, 'yyyy-MM-dd');
            });
        }
    };
}]);
'use strict';

/*
global app
*/


/**
  * @ngdoc directive	 
  * @name OCDR.directive:input-render
  * @description 
  *	InputRender is an AngularJS directive in charge of creating input elements alongside with their labels.

  * @restrict 'E'
  * @element
  * @scope 
  * @param {Object} property Entity object containing the property that will be used to render and bind the input
  * @param {Object} metamodel Object representing the metadata defined in a JSON file
  */
app.directive('inputRender', ['$compile', '$http', '$rootScope', '$templateCache', 'uibButtonConfig', '$injector', '$location', '$timeout', 'resourceFactory', function($compile, $http, $rootScope, $templateCache, uibButtonConfig, $injector, $location, $timeout, resourceFactory){

	return {
		restrict: 'E',
		replace: 'true',
		scope: {
			property: '=',
			metamodel: '=',
			resources: '=',
			updateMode: '@',
			onUpdate: '@',
			baseUrl: '@',
			factoryName: '=',
			resourceUrl: '='
		},
		controller: ['$scope', function($scope){
			/* Default attributes and actions for inputs */
			var defaults = {};
			defaults.autocomplete = {
				'attributes': {
					'typeahead-wait-ms': 1000,
					'typeahead-focus-first': false,
					'typeahead-min-length': 3,
					'maxlength': 9999999,
					'capitalize': false
				},
				'options': {
					'_getData': function($viewValue, id, field){
						// If the user defined an action for getting the data, we invoke it
						if(field.options.getData){
							return field.options.getData( {'$viewValue': $viewValue, 'field': field, 'resources': $scope.resources}).then(function(data){
								data = data || [];
								if(data && !Array.isArray(data)){
									return [data];
								} else {
									return data;
								}
							});
						} else {
							//default action
							if (field.options.href && field.options.params) {
								return $scope.getData({'$viewValue': $viewValue, 'field': field, 'resources': $scope.resources});
							}
							//console.warn('input.js -> autocomplete_getData(): No getData method for autocomplete input.');
						}
					},
					'_select': function($item, id, field){
						// field.options.select is the action defined by the user to be invoked when a value from the dropdown is selected
						if(field.options.select){
							field.options.select( {'$item': $item, 'id': id, 'field': field, 'property': field.property, '$injector': $injector, 'resources': $scope.resources} );
						} else {
							console.warn('input.js -> autocomplete_select(): No select callback for autocomplete input.');
						}
					},
					'_typeaheadBlur': function(event, field){
						// field.options.typeaheadBlur is the action defined by the user to be invoked when the autocomplete loses the focus
						if(field.options.typeaheadBlur){
							field.options.typeaheadBlur( {'event': event, 'id': field.id, '$injector': $injector} );
						} else if(event && event.target && event.target.attributes && event.target.attributes['aria-owns']){
							// Unset moveInProgress variable to avoid the dropdown being shown when it has no longer the focus
							// var typeaheadDropdown = document.getElementById(event.target.attributes['aria-owns'].value);
							// angular.element(typeaheadDropdown).scope().moveInProgress = true;
						} else {
							console.warn('input.js -> autocomplete_typeaheadBlur(): Typeahead dropdown not found in view.');
						}
					},
					'_typeaheadFocus': function(event, field){
						// field.options.typeaheadFocus is the action defined by the user to be invoked when the autocomplete gets the focus
						if(field.options.typeaheadFocus){
							field.options.typeaheadFocus( {'event': event, 'id': field.id, '$injector': $injector} );
						} else if(event && event.target && event.target.attributes && event.target.attributes['aria-owns']){
							// Set moveInProgress variable to enable dropdown visibility when it gains the focus
							var typeaheadDropdown = document.getElementById(event.target.attributes['aria-owns'].value);
							angular.element(typeaheadDropdown).scope().moveInProgress = false;
						} else {
							console.warn('input.js -> autocomplete_typeaheadFocus(): Typeahead dropdown not found in view.');
						}
					}
				}
			};

			defaults.decimal = {
				'attributes': {
					'decimalprecision': 2,
					'minimum': 0,
					'maximum': 9999999
				},
				'options': {}
			};

			defaults.money = {
				'attributes': {
					'currency': ['eur', 'usd', 'gbp', 'yen', 'rub', 'won'],
					'decimalprecision': 2,
					'minimum': 0,
					'maximum': 9999999
				},
				'options': {}
			};

			defaults.email = {
				'attributes': {
					'maxlength': 9999999
				},
				'options': {}
			};

			defaults.number = {
				'attributes': {
					'min': 0,
					'max': 9999999
				},
				'options': {}
			};

			defaults.percentage = {
				'attributes': {
					'decimalprecision': 2,
					'minimum': 0,
					'maximum': 9999999
				},
				'options': {}
			};

			defaults.select = {
				'attributes': {
					'capitalize': false
				},
				'options': {
					'_getData': function(id, field){
						/*
							field.options.getData: action defined by the user that will be invoked to fill the dropdown options.
							By default, and because we are backend driven, we pull the data from the 'enum' property of the field we are binding to.
						*/
						if(field.options.getData){
							return field.options.getData( {'id': id, 'property': field.property, '$injector': $injector} );
						} else {
							//console.warn('input.js -> select_getData(): No getData method for select input.');
							return field.attributes.enum;
						}
					}
				}
			};

			defaults.radio = {
				'attributes': {
					'capitalize': false
				},
				'updateMode': 'change'
			};

			defaults.textMask = {
				'attributes': {
					'capitalize': false,
					'mask': ''
				},
				'options': {}
			};

			defaults.text = {
				'attributes': {
					'capitalize': false,
					'maxlength': 9999999
				},
				'options': {},
				'format': 'text'
			};

			defaults.textarea = {
				'attributes': {
					'maxlength': 9999999
				},
				'options': {}
			};

			defaults.toggle = {
				'attributes': {
					'true_label': '_TRUE',
					'false_label': '_FALSE'
				},
				'options': {},
				'updateMode': 'change'
			};

			defaults.date = {
				'attributes': {
					'dateformat': 'dd/MM/yyyy',
					'startWeek': 1,
					'trigger': 'focus',
					'autoclose': true
				},
				'options': {}
			};

			defaults.checkbox = {
				'attributes': {},
				'options': {},
				'updateMode': 'change'
			};

			defaults.label = {
				'attributes': {},
				'options': {}
			};

			// FIXME: multiselect not finished yet. We don't know any backend response to be displayed this way
			// We allow the user to display a checkbox to reflect the state of the item (but we could do the same through CSS)
			defaults.multiselect = {
				'attributes': {
					'showcheckbox': false
				},
				'options': {
					'_onclick': function(/*entityHref*/){
						/*
							FIXME: Do something here to select the item in the multiselect. If we use several checkboxes we get this select/unselect functionality by default.
							Analyze what is better to do, multiple checkboxes or simple divs with onclick callback
						*/
					}
				}
			};

			defaults.range = {
				'attributes': {},
				'options': {}
			};

			// Patch on blur default function
			$scope.patch = function(params, next){
				//FIXME: to avoid to patch the resource twice, when the field is defined as an autocomplete with patchOnBlur, 
				//there is one patch when selecting the value in the dropdown and when losing the focus.
				if (!$scope.timeout) {
					$scope.timeout = true;
					$timeout(function() {
						$scope.timeout = false;
						var payload = {};
						resourceFactory.get(params.property.self).then(function(response){
							/*
							Let's patch all the properties that have changed for that resource. If we patch only the property that triggered the patch
							we may lose already modified information when the response come back from the backend
							*/
							var resourceToPatch = response.data;
							for(var property in resourceToPatch){
								if(property in $scope.resources && $scope.resources[property].value !== resourceToPatch[property]){
									payload[property] = $scope.resources[property].value?$scope.resources[property].value:null;
								}													
							}
							if(Object.keys(payload).length > 0){
								resourceFactory.patch(params.property.self, payload, {}).then(function(){
									if(next){
										next(params);
									}
								}, function(error){
									console.error(error);
									resourceFactory.refresh(params.property.self, {}, {});
								});
							}
						});
					}, params.scope.metamodel.type === 'autocomplete'?500:0);
				}
				
			};


			// Ger data default function for the autocomplete input
			$scope.getData = function(params) {
				var url = $rootScope.hostURL + params.field.options.href+'?'+params.field.options.params+'='+params.$viewValue;
				return resourceFactory.get(url).then(function(response) {
					response = response.data || response;
					var items = response._links.item || [];
					if(items && !Array.isArray(items)){
						return [items];
					} else {
						return items;
					}
				});

			};

			/* Function that (re)load the input with the new property */
			$scope.load= function(){
				// Configuration for toggles
				uibButtonConfig.activeClass = 'btn-active';

				if($location.path().split('/screen/')[1] !== undefined){
					$scope.screenFactoryName = $location.path().split('/screen/')[1].split('/')[0] + 'Factory';
				}else{
					$scope.screenFactoryName = $location.path().split('/')[0] + 'Factory';
				}

				$scope.actionFactory = {};
				$scope.factoryName = $scope.metamodel.factoryName || $scope.factoryName || $scope.screenFactoryName;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(error) {
					console.warn($scope.factoryName + ' not found');
				}

				if(!$scope.property && $scope.resources){
					console.log('input.js -> load(): Property "' + $scope.metamodel.id + '" not found. Creating it...');
					$scope.resources[$scope.metamodel.id] = {'required': false, 'editable': true, 'metainfo':{}, value: $scope.metamodel.value};
					$scope.property = $scope.resources[$scope.metamodel.id];
				}

				// Get the url of the template we will use based on input type
				var inputType = $scope.metamodel.type || $scope.property.metainfo.type;
				//var baseUrl = (!$scope.baseUrl || $scope.baseUrl == '') ? 'src/ocInfra/templates/components' : $scope.baseUrl;

				$scope.baseUrl = $scope.baseUrl || $rootScope.templatesURL;
				$scope.inputHtmlUrl = $scope.baseUrl + 'input-' + inputType + '.html';

				// Update mode: blur or change. In some cases (toggle and checkbox we need to trigger the update callback on change and not on blur)
				$scope.updateMode = (!$scope.updateMode || $scope.updateMode === '') ? defaults[inputType].updateMode : $scope.updateMode;
				$scope.updateMode = (!$scope.updateMode || $scope.updateMode === '') ? 'blur' : $scope.updateMode;
				if($scope.onUpdate && $scope.onUpdate !== '' && !$scope.update){
					// Get the callback function from the action factory of the current screen
					$scope.update = $scope.actionFactory[$scope.onUpdate];
					if(!$scope.update){
						$scope.update = _searchInParents($scope, $scope.onUpdate);
					}
				}

				// Field to bind to the input
				$scope.field = {
					'property': $scope.property,
					'label': $scope.metamodel.label,
					'id': $scope.metamodel.id,
					'name': $scope.metamodel.name || $scope.metamodel.id || '',
					'placeholder': $scope.metamodel.placeholder,
					'resourceUrl': $scope.resourceUrl,
					'selector': $scope.metamodel.selector,
					'onBlur': function(){
						if($scope.updateMode === 'blur'){
							if($scope.metamodel.patchOnBlur){
								$scope.patch( {'id': $scope.field.id, 'property': $scope.field.property, '$injector': $injector, 'scope': $scope}, $scope.update );
							}else if($scope.update){
								$scope.update( {'id': $scope.field.id, 'property': $scope.field.property, '$injector': $injector, 'scope': $scope} );
							}
						}
					},
					'onChange': function(){
						if($scope.updateMode === 'change'){
							if($scope.metamodel.patchOnBlur){
								$scope.patch( {'id': $scope.field.id, 'property': $scope.field.property, '$injector': $injector, 'scope': $scope}, $scope.update );
							} else if($scope.update){
								$scope.update( {'id': $scope.field.id, 'property': $scope.field.property, '$injector': $injector, 'scope': $scope} );
							}
						}
					},
					'isVisible': function(){
						/*
							Visibility should be at renderer level (or the directive that is going to include the input) to prevent empty spaces.
							For example, the renderer creates a div with 'x' width to place the input, but the input is not visible. From the renderer point of view
							it doesn't know that the input is hidden, so it preserves the space.
						*/
						//return true;
						return $scope.metamodel.visible || (($scope.metamodel.visibleWhen) ? _evaluateExpression($scope.metamodel.visibleWhen.expression, $scope, $scope.resources) : true);
					},
					'getParentResource' : function(){
						return resourceFactory.get($scope.field.property.self);
					},
					'attributes': {},
					'options': {},
					'labelsize': $scope.metamodel['label-size']? ($scope.metamodel['label-size']==='lg'? 8: 4): 4,
					'icon': $scope.metamodel.icon,
					'class': $scope.metamodel.classInput,
					'format': $scope.metamodel.format || defaults[inputType].format,
					'tooltip': $scope.metamodel.tooltip	// Check for backend values. It may be that the backend give us this value already translated??
				};


				// Union of ui attributes and backend attributes. First the default values, then we put the backend metadatas and finally the UI metadatas
				var attributes = angular.copy(defaults[inputType].attributes);
				$scope.field.attributes = attributes;

				// In case that we have several default values in an array, we select the first one
				for(var key in attributes){
					if(attributes[key] && Array.isArray(attributes[key])){
						attributes[key.toLowerCase()] = attributes[key][0];
					}
				}

				if($scope.property !== undefined && $scope.property.metainfo !== undefined){
					for(var metainfo_key in $scope.property.metainfo){
						if(metainfo_key !== 'type'){
							attributes[metainfo_key.toLowerCase()] = $scope.property.metainfo[metainfo_key];
						}
					}	
				}

				if($scope.metamodel.attributes !== undefined){
					for(var attributes_key in $scope.metamodel.attributes){
						if(attributes[attributes_key] && Array.isArray(attributes[attributes_key])){
							attributes[attributes_key.toLowerCase()] = attributes[attributes_key].indexOf($scope.metamodel.attributes[attributes_key]) >= 0 ? $scope.metamodel.attributes[attributes_key] : attributes[attributes_key][0];
						} else {
							attributes[attributes_key.toLowerCase()] = $scope.metamodel.attributes[attributes_key];
						}
					}
				}

				// Union of ui options and default options. First we put the default options and then the user options defined in the UI metadata
				var options = angular.copy(defaults[inputType].options);
				$scope.field.options = options;

				for(var options_key in $scope.metamodel.options){
					// Avoid override of default methods (they start with underscore)
					var validKey = options_key;
					do{
						validKey = validKey.indexOf('_') === 0 ? validKey.substring(1) : validKey;
					}while(validKey.indexOf('_') === 0);
					
					// Get the action for the options from the factory of the current screen

					$scope.field.options[validKey] = $scope.actionFactory[$scope.metamodel.options[options_key]] || _searchInParents($scope, $scope.metamodel.options[options_key]) || $scope.metamodel.options[options_key]; 
					/*if (validKey === 'getData') {
						$scope.field.options[validKey] = $scope.actionFactory[$scope.metamodel.options[key]];
					} else {
						$scope.field.options[validKey] = $scope.metamodel.options[key];
					}*/
				}

			};

			/* Watchers to react to changes in the property */
			$scope.$watchGroup(['property', 'metamodel'], function(newValue){
				if((newValue[0] && newValue[1]) || (newValue[0] === undefined && newValue[1] && newValue[1].uiInput)){
					$scope.load();
				}
			});



			function _searchInParents(scope, fieldName){
				if(typeof fieldName !== 'string'){
					return undefined;
				}
				if(fieldName in scope){
					return scope[fieldName];
				} else if(fieldName.indexOf('.') > 0){
					var firstObj = fieldName.substring(0, fieldName.indexOf('.'));
					if(firstObj in scope){
						return scope.$eval(fieldName);
					} else if(scope.$parent){
						return _searchInParents(scope.$parent, fieldName);
					}
				} else if(scope.$parent){
					if(scope.$parent.resourcesToBind){
						if (fieldName in scope.$parent.resourcesToBind.properties) {
							return scope.$parent.resourcesToBind.properties[fieldName];
						} else {
							return _searchInParents(scope.$parent, fieldName);
						}
					} else {
						return _searchInParents(scope.$parent, fieldName);
					}
				}

				return undefined;
			}
			function _evaluateExpression(expression, $scope, resource) {
		        var response = true;
		        if (expression.operator) //Recursive case
		        {
		            if (expression.operator === 'AND') {
		                angular.forEach(expression.conditions, function(val) {
		                    if (response) {
		                        response = response && _evaluateExpression(val, $scope, resource);
		                    }
		                });
		            } else if (expression.operator === 'OR') {
		                response = false;
		                angular.forEach(expression.conditions, function(val) {
		                    if (!response) {
		                        response = response || _evaluateExpression(val, $scope, resource);
		                    }
		                });
		            }
		        } else //Base case
		        {
		        	if (expression.existsInEntity){
		        		response = resource && resource[expression.field] && resource[expression.field].value !== null;
		        	}else{
		        		var field; 
		        		if (resource && resource[expression.field]) {
							field = resource[expression.field];
		        		} else {
		        			field = _searchInParents($scope, expression.field);
		        		}
		        		var value = field instanceof Object? field.value: field;
		        		response = value === expression.value;
		        	}
		            
		        }
		        return response;
		    }
		}],
		link: function($scope, element){
			var unwatch = $scope.$watch('inputHtmlUrl', function(newValue){
				if(newValue){

					if(!$templateCache.get(newValue)){
						$templateCache.put(newValue, 'Pending');

						$http.get(newValue).then(function(response){
							$templateCache.put(newValue, response.data);
							$rootScope.$broadcast(newValue, response.data);
							
							element.html(response.data);
							$compile(element.contents())($scope);
							unwatch();
						});
					} else {
						if($templateCache.get(newValue) === 'Pending'){
							$rootScope.$on(newValue, function(event){
								element.html($templateCache.get(event.name));
								$compile(element.contents())($scope);
							});
						} else {
							element.html($templateCache.get(newValue));
							$compile(element.contents())($scope);
						}
						unwatch();
					}
				}
			});
		}
	};
}]);

'use strict';

/*
global app
*/

app.directive('popupRender',  ['MetaModel', '$resource', '$rootScope', '$location', '$injector', function(MetaModel, $resource, $rootScope, $location, $injector){

return {
		restrict: 'E',
		scope: {
			uiId: '@',
			metamodel: '=',
			resourceUrl: '=',
			factoryName: '='
		},

		controller: ['$scope', function($scope){

			$scope.popup = {
				'id': $scope.uiId || '_popup' + Math.floor(Math.random()*1000000000000),
				'labels': {},
				'actions': {}
			};
			
			$scope.resultSet = {};

			$scope.resetDisabled = false;

			var metamodelObject = $rootScope.metamodel? $rootScope.metamodel[$scope.metamodel]: null;
			if (!metamodelObject) {
				MetaModel.load($rootScope, $rootScope.regionId, $scope.metamodel, function(data) {
					_init(data);
				});
			} else {
				_init(metamodelObject);
			}


			$scope.$on('resource_directory', function(event, params){
				if($scope.resourceUrl && params.url.indexOf($scope.resourceUrl) >= 0){
					if (params.response.config.method !== 'DELETE') {
						$scope.resultSet = {};
						MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);
					}
				}
			});

			$scope.$watch('resourceUrl', function(){
				if ($scope.metamodelObject) {
					//Since we share the same metamodel for different popups, screens, we must define a type to be able to difference the titles. 
					if ($scope.resourceUrl){
						MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);
					}	
				}				
			});

			$scope.$on('refresh_popUp', function(event, params) {
				if (params.name === $scope.metamodelObject.name) {
					MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet, null, true);
				}
			});

			$scope.$watchCollection('resultSet', function(newValue){
				//This should always get the data from ResourceDirectory and not calling the API
					if(newValue[$scope.resourceUrl] && newValue[$scope.resourceUrl].properties){
						var typeValue = newValue[$scope.resourceUrl].properties[$scope.metamodelObject.type] ? newValue[$scope.resourceUrl].properties[$scope.metamodelObject.type].value : '';
						if (typeValue){
							$scope.popup.labels.title = typeValue.toUpperCase() + '_' + ($scope.metamodelObject.labels.title || $scope.popup.labels.titleDefault);
						}else{
							$scope.popup.labels.title = ($scope.metamodelObject.labels.title || $scope.popup.labels.titleDefault);
						}
						
						$scope.popUpResourceToBind = newValue[$scope.resourceUrl];
						$scope.resetDisabled = checkReset();
					}

			});



			function _defaultSave(){
				var callback = ($scope.metamodelObject.actions && $scope.metamodelObject.actions.ok && $scope.metamodelObject.actions.ok.callback)? $scope.metamodelObject.actions.ok.callback: null;
				$scope.$broadcast('patch_renderer', { resourceUrl: $scope.resourceUrl || $rootScope.resourceUrl, callback: callback});

			}

			function _defaultClose() {
				var callback = ($scope.metamodelObject.actions && $scope.metamodelObject.actions.close && $scope.metamodelObject.actions.close.callback)? $scope.metamodelObject.actions.close.callback: null;
				$scope.$broadcast('close_popUp_renderer', { resourceUrl: $scope.resourceUrl, callback: callback });
			}

			function _defaultReset() {
				if ($scope.metamodelObject.actions.reset.links){
					var callback = $scope.metamodelObject.actions.reset.callback? $scope.metamodelObject.actions.reset.callback: null;
					$scope.$broadcast('reset_renderer', { resourceUrl: $scope.resourceUrl, links: $scope.metamodelObject.actions.reset.links, callback: callback });
				}
			}
			
			function _init(metamodelObject){
				$scope.metamodelObject = metamodelObject;

				// Default labels and actions
				_initLabels();
				_initActions();

				$scope.screenFactoryName = $scope.metamodelObject.factoryName || $scope.factoryName;
				try {
					$scope.actionFactory = $injector.get($scope.screenFactoryName);
				} catch(e) {
					console.log($scope.screenFactoryName + 'not found');
				}
			}	


			function _initLabels(){
				$scope.popup.labels.titleDefault = '_POPUP_TITLE';
				$scope.popup.labels.ok = '_SAVE';
				$scope.popup.labels.close = '_CLOSE';
				$scope.popup.labels.reset = '_RESET';
				$scope.popup.actions._ok = _defaultSave;
				$scope.popup.actions._close =_defaultClose;
				$scope.popup.actions._reset =_defaultReset;


				// User defined labels and actions
				if($scope.metamodelObject.labels){
					$scope.popup.labels.title =  $scope.metamodelObject.labels.title || $scope.popup.labels.titleDefault;
					$scope.popup.labels.ok = $scope.metamodelObject.labels.ok || $scope.popup.labels.ok;
					$scope.popup.labels.close = $scope.metamodelObject.labels.close || $scope.popup.labels.close;
					$scope.popup.labels.cancel = $scope.metamodelObject.labels.cancel || $scope.popup.labels.cancel;
					$scope.popup.labels.reset = $scope.metamodelObject.labels.reset || $scope.popup.labels.reset;
				}

			}

			function _initActions(){

				if($scope.metamodelObject.actions){
					$scope.popup.actions._ok = ($scope.metamodelObject.actions.ok && $scope.metamodelObject.actions.ok.method) ? $scope.metamodelObject.actions.ok.method: $scope.popup.actions._ok;
					$scope.popup.actions._close = ($scope.metamodelObject.actions.close && $scope.metamodelObject.actions.close.method) ? $scope.metamodelObject.actions.close.method:$scope.popup.actions._close;
					$scope.popup.actions._cancel = ($scope.metamodelObject.actions.cancel && $scope.metamodelObject.actions.cancel.method) ? $scope.metamodelObject.actions.cancel.method:$scope.popup.actions._cancel;
					$scope.popup.actions._reset = ($scope.metamodelObject.actions.reset && $scope.metamodelObject.actions.reset.method) ? 
						$scope.metamodelObject.actions.reset.method:$scope.popup.actions._reset;
				}

			}

			function checkReset(){

				//Check links defined in metamodel
				if ($scope.popUpResourceToBind && $scope.metamodelObject.actions && $scope.metamodelObject.actions.reset){
					for (var i=0; i<$scope.metamodelObject.actions.reset.links.length; i++){

						for (var j=0; j<$scope.popUpResourceToBind.dependencies.length; j++){
							if ($scope.popUpResourceToBind.dependencies[j].resource === $scope.metamodelObject.actions.reset.links[i]){
								//It means ther's al least one link to be reset, so we must not disable the reset button. 
								return false;
							}
						}
					}
				}
				return true;
			}

			$scope.execute = function(action) {
				if (typeof action === 'function') {
					//default actions case
					action();
					
				} else if($scope.actionFactory[action]){
					$scope.actionFactory[action]($scope.resultSet[$scope.resourceUrl], $scope.popUpResourceToBind.properties);
				}

			};
		}],
		templateUrl: $rootScope.templatesURL + 'popup.html'
	};
}]);
'use strict';

/*
global angular
*/

angular.module('omnichannel').directive('renderer', ['MetaModel', '$resource', '$rootScope', '$injector', 'resourceFactory', '$q', '$location', function(MetaModel, $resource, $rootScope, $injector, resourceFactory, $q, $location){

	return {
		restrict: 'E',
		scope: {
			metamodel: '=',
			resourceUrl: '=?',
			factoryName: '='
		},
		link: function($scope){
			var metamodelObject = $rootScope.metamodel? $rootScope.metamodel[$scope.metamodel]: null;
			if ($rootScope.regionId !== undefined || !metamodelObject) {
				MetaModel.load($rootScope, $rootScope.regionId, $scope.metamodel, function(data) {
					_processMetamodel(data);
					_options(data);
					_init(data);
				});
			} else {
				_processMetamodel(metamodelObject);
				_options(metamodelObject);
				_init(metamodelObject);
			}

			$scope.$watch('resourceUrl', function(newValue, oldValue){
				if(newValue !== oldValue){
					if($scope.metamodelObject){
						//_processMetamodel($scope.metamodelObject);
						_init($scope.metamodelObject);
					}
				}
			});

			// $scope.isVisible = function(property, metamodelProperty){
			$scope.isVisible = function(property){
				if(property === undefined){
					return false;
				}

				return true;
			};

			function _processMetamodel(metamodel){
				if(metamodel && metamodel.sections){
					metamodel.sections.forEach(function(section){
						// We don't want to process sections of type 'reference' because they will be processed by its own instance of the renderer directive
						if(!section.type || section.type !== 'reference'){
							var rowNumbers = [];
							section.rows = [];
							
							section.properties.forEach(function(property){
								if(property.row !== undefined){
									if(rowNumbers[property.row] === undefined){
										rowNumbers[property.row] = 0;
									}
									rowNumbers[property.row]++;
								}

								//we need to process an array even if id is a single value. 
								if (property.id && !Array.isArray(property.id)){
									property.id = [property.id]; 
								}
							});

							var propertyMapFilter = function(property){
								if(property.row !== undefined && property.row === i){
									return property;
								}
							};

							for(var i = 0; i < rowNumbers.length; i++){
								if(rowNumbers[i] !== undefined){
									var propertiesInRow = section.properties.map(propertyMapFilter);

									section.rows.push(propertiesInRow);

									for(var j = 0; j < propertiesInRow.length; j++){
										if(propertiesInRow[j] !== undefined){
											section.properties.splice(section.properties.indexOf(propertiesInRow[j]), 1);
											
											var calculatedColspan = 12;
								
											if(section.properties.length > 1 && propertiesInRow[j].row){
												calculatedColspan = 12 / ((rowNumbers[propertiesInRow[j].row] > 4) ? 4 : rowNumbers[propertiesInRow[j].row]);
											}

											propertiesInRow[j].colspan = propertiesInRow[j].colspan || calculatedColspan;

											section.properties.push(propertiesInRow[j]);
										}
									}
								}
							}

							for(var index = section.properties.length - 1; index >= 0; index--){
								if(section.properties[index].row === undefined){
									section.rows.unshift([section.properties[index]]);
								}
							}

							section.rows.forEach(function(properties){
								while(properties.indexOf(undefined) >= 0) {
									properties.splice(properties.indexOf(undefined), 1);
								}
							});
						}
					});
				}
			}

			function _options(metamodelObject){
				
				$scope.factoryName = $scope.factoryName || metamodelObject.factoryName;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(e) {
					console.log($scope.factoryName + ' not found');
				}

				$scope.optionsMap = {};
				$scope.metamodelObject = metamodelObject;
				var resource = $scope.metamodelObject.resource;
				$scope.resourcesToBind = { properties : {} };
				var newURL = {};
				if($rootScope.resourceHref){
					 $scope.optionUrl = $rootScope.resourceHref;
                    $scope.resourceUrlToRender = $rootScope.resourceHref;
				} else if($rootScope.regionId !== undefined && resource !== undefined){
					var url = $rootScope.hostURL + resource;
                    //Retrieve regionToSORMap from the rootScope
                    var regionToSORMap = $rootScope.regionToSoR;
                    //Retrieve the application name for the given region Id
                    var applName = regionToSORMap[$rootScope.regionId];
                    //Replace the regionId with application name in the URL
                    newURL = url.replace(':regionId',applName);
                    $scope.optionUrl = newURL;
                    $scope.resourceUrlToRender = newURL;
                } else if(resource !== undefined){
                	newURL = $rootScope.hostURL + resource;
                  
                  //we need to check the sesssion storage just in case we are coming from another SPA
                  newURL = sessionStorage.getItem(resource + '_url') ? sessionStorage.getItem(resource + '_url') : newURL;
                  $scope.metamodelObject.optionUrl = newURL ;
                  $scope.resourceUrlToRender = newURL;
                  $scope.resourceUrl = newURL;
                }

				$scope.optionUrl = $scope.metamodelObject.optionUrl;


				if($scope.optionUrl === undefined){
					return;
				}

				$scope.$watchCollection('optionsMap', function(newValue){
					if(newValue){
						Object.keys(newValue).forEach(function(url){
							var optionsMapForResource = newValue[url];

							if(optionsMapForResource !== undefined && $scope.metamodelObject.actionOnScreen){
								var optionsObj = optionsMapForResource.get($scope.metamodelObject.actionOnScreen);
								if(optionsObj !== undefined){
									console.log('optionsMap action' + optionsObj.action);

									var data = JSON.parse(sessionStorage.getItem(resource + '_' + optionsObj.action + '_data'));
									var params = JSON.parse(sessionStorage.getItem(resource + '_' + optionsObj.action + '_params'));

									sessionStorage.removeItem(resource + '_' + optionsObj.action + '_data');
									sessionStorage.removeItem(resource + '_' + optionsObj.action + '_params');                  

									resourceFactory.execute(optionsObj.href, data, params, null, optionsObj.httpmethod).then(function(response){
										if (optionsObj.httpmethod === 'POST') {
											$scope.resourceUrl = response.data._links.self.href;
										} else {
											$scope.resourceUrl = optionsObj.href;
											$scope.resourcesToBind[$scope.metamodelObject.resourceUrl] = optionsObj;
											$scope.resourcesToBind[$scope.metamodelObject.resourceUrl].properties = optionsObj.properties;
										}

										_init($scope.metamodelObject);

									});									
										
								}
							}
						});		
						
					}
				});
				MetaModel.prepareOptions($rootScope, $scope.optionUrl, $scope.optionsMap);
			}

			function _init(metamodelObject){
				$scope.metamodelObject = metamodelObject;
				$scope.resultSet = {};
				$scope.boundUrls = [];
				//Initial resource specified in metamodel?

				if ($scope.metamodelObject.resourceUrl && $scope.metamodelObject.resourceUrl.indexOf($rootScope.hostURL) === -1){
					$scope.metamodelObject.resourceUrl = $rootScope.hostURL + $scope.metamodelObject.resourceUrl;
				}

				$scope.resourcesToBind = { properties: {} };

				$scope.boundUrls.push($scope.resourceUrl);


				$scope.factoryName = metamodelObject.factoryName || $scope.factoryName;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(e) {
					console.log($scope.factoryName + ' not found');
				}

				if(!$scope.activeTab){
					$scope.activeTab = $location.path().substring($location.path().lastIndexOf('/')+1);
				} 

				$scope.resourceUrlToRender = $scope.resourceUrl || $scope.metamodelObject.resourceUrl || $rootScope.resourceUrl;
				if ($scope.resourceUrlToRender === undefined || $scope.resourceUrlToRender === '') {
					return;
				}

				$scope.$watchCollection('resultSet', function(newValue){
					if(newValue){
						//$scope.resourcesToBind = $scope.resourcesToBind || {};
						//keep the ui inputs
						var propertiesToKeep = {};
						if ($scope.resourcesToBind && $scope.resourcesToBind.properties) {
							for (var property in $scope.resourcesToBind.properties) {
								if (property.indexOf(':') === -1) {
									propertiesToKeep[property] = $scope.resourcesToBind.properties[property];
								}
							}
						}
						$scope.resourcesToBind = { properties: propertiesToKeep };

						for(var url in newValue){
							if(url !== 'deferred' && url !== 'pending'){
								$scope.resourcesToBind[newValue[url].identifier] = newValue[url];
							}
						}

						$scope.boundUrls = [];
						$scope.boundUrls.push($scope.resourceUrl);
						//This var will contain the properties names. In case we found the same property in different resources, we keep the one defined first in metamodel
						$scope.propertiesCollection = [];
						var searchIdsInAttributes = function(property) {
												if (property.id && !Array.isArray(property.id)){
													property.id = [property.id];
												}
												savePropertyInResourcesToBind(property);
											};
						// Extract the urls of the properties we have bound, so we can then update the view when any of those properties gets updated		
						for(var i = 0; i < $scope.metamodelObject.sections.length; i++){
							// We don't want to process sections of type 'reference' because they will be processed by its own instance of the renderer directive
							if(!$scope.metamodelObject.sections[i].type || $scope.metamodelObject.sections[i].type !== 'reference') {
								for(var j = 0; j < $scope.metamodelObject.sections[i].properties.length; j++){

									if (!$scope.metamodelObject.sections[i].properties[j].uiInput) {
										savePropertyInResourcesToBind($scope.metamodelObject.sections[i].properties[j]); 
										//search ids in attributes
										for (var attribute in $scope.metamodelObject.sections[i].properties[j].attributes) {
											if (Array.isArray($scope.metamodelObject.sections[i].properties[j].attributes[attribute])){
												$scope.metamodelObject.sections[i].properties[j].attributes[attribute].forEach(searchIdsInAttributes);
											}
										}
									}
								}
							}
						}
					}
				});
	

				$scope.$on('resource_directory', function(event, params){
					if($scope.boundUrls.indexOf(params.url) >= 0){
						if (params.response.config.method !== 'DELETE') {
							/*
								We use the promise to get all values into the resultSet before changing the scope's resultSet. This
								way we prevent the screen from flashing (the screen was being left blank before starting the rendering process again).
							*/
							MetaModel.prepareToRender($scope.resourceUrlToRender, $scope.metamodelObject, {}).then(function(resultSet){
								$scope.resultSet = resultSet;
							});
						}
					}
				});
				MetaModel.prepareToRender($scope.resourceUrlToRender, $scope.metamodelObject, $scope.resultSet);
			}


			function savePropertyInResourcesToBind(property) {
				if (!property.uiInput) {
					if (Array.isArray(property.id)){
						var idValues = property.id;
						for(var k = 0; k < idValues.length; k++){
							var resourceSelected = { resource: null, points: 0 };
							for(var resource in $scope.resourcesToBind){
								if (resource !=='properties'){

									//If the resource is part of a collection and we are only interested in on of the collection items. 
									if (property.selector){
										seekSelectorInResource($scope.resourcesToBind[resource], property.selector, resourceSelected);
									} else if (property.id[k] in $scope.resourcesToBind[resource].properties){	
										resourceSelected.resource = resource;
									}
								}
							}

							$scope.resourcesToBind.properties = $scope.resourcesToBind.properties || {};	
							//if we have found a value in one of the resources, we are done and no need to go on. 
							if (resourceSelected.resource && property.id[k] in $scope.resourcesToBind[resourceSelected.resource].properties){

				                var id = property.id[k];
							
				                  $scope.resourcesToBind.properties[id] = 
				                  $scope.resourcesToBind[resourceSelected.resource].properties[id];
                

								if($scope.boundUrls.indexOf($scope.resourcesToBind.properties[id].self) < 0) {
									$scope.boundUrls.push($scope.resourcesToBind.properties[id].self);	
								}
								break;
							}
							
						}
					} 
				}
			}


			function seekSelectorInResource(resource, selector, resourceSelected){
				var selectors = Array.isArray(selector)?selector:[selector];
				var points = 0;
				selectors.forEach(function(sel) {
					//If we found the selctor among the resource properties, we discard it if the selector is not true
					if (resource.properties[sel]) {
						points += 2;
						if (resource.properties[sel].value === true){
							points += 1;
						}
					}
				});
				
				if (points >= resourceSelected.points) {
					resourceSelected.resource = resource.identifier;
					resourceSelected.points = points;
					return true;
				}
				return false;
			}


			$scope.execute = function(inputComponent) {
				if($scope.actionFactory && $scope.actionFactory[inputComponent.method]){
					
					var defaultValues = {};
					if(inputComponent.method){
						defaultValues = MetaModel.getDefaultValues(inputComponent.method, $scope.metamodelObject);
					}

					if($scope.resourcesToBind.properties !== undefined){
						$scope.actionFactory[inputComponent.method]({'scope': $scope, 'inputComponent': inputComponent, 
							'optionUrl': $scope.optionUrl, 'properties': $scope.resourcesToBind.properties, 'defaultValues': defaultValues});

					}
				} else {
					if ($scope[inputComponent.method]) {
						if($scope.resultSet !== undefined && $scope.resourceUrlToRender !== undefined && $scope.resultSet[$scope.resourceUrlToRender] !== undefined && $scope.resourcesToBind.properties !== undefined){
							$scope[inputComponent.method]({'properties': $scope.resourcesToBind.properties});
						}
					}
				}
			};

			$scope.$on('patch_renderer', function(event, data){
				if (data.resourceUrl === $scope.resourceUrlToRender || data.save) {
					var payloads = {};
					var promises = [];
					var propertiesBound = $scope.resourcesToBind.properties;
					if (propertiesBound) {
						for(var key in propertiesBound){
							if(propertiesBound[key] && propertiesBound[key].self && propertiesBound[key].editable){
								var href = propertiesBound[key].self;
								payloads[href] = payloads[href] || {};
							}
						}

						var payloadKeys = Object.keys(payloads);
						payloadKeys.forEach(function(url){
							resourceFactory.get(url).then(function(response) {
								var resourceToPatch = response.data;
								var payloadToPatch = payloads[url];
								for(var property in resourceToPatch){
									if(property.indexOf(':') > 0 && property.indexOf('_') !== 0){
										if(property in propertiesBound && propertiesBound[property].value !== resourceToPatch[property]){
											payloadToPatch[property] = $scope.resourcesToBind.properties[property].value? $scope.resourcesToBind.properties[property].value:null;
										}
									}
								}
								if(Object.keys(payloadToPatch).length > 0){
									promises.push(resourceFactory.patch(url, payloadToPatch));
									$q.all(promises).then(function() {
										if (data.callback) {
											$scope.execute({ 'method': data.callback});
										}
									});
								}else if (data.callback){
									$scope.execute({ 'method': data.callback});
								}
							});
						});
						if (payloadKeys.length === 0 && data.callback){
							$scope.execute({ 'method': data.callback});
						}
					}
				}
			});


			$scope.$on('close_popUp_renderer', function(event, data){
				if (data.resourceUrl === $scope.resourceUrlToRender) {
					if (data.callback) {
						$scope.execute(data.callback);
					}
				}
			});

			$scope.$on('reset_renderer', function(event, data){
				if (data.resourceUrl === $scope.resourceUrlToRender) {
					var payloads = {};
					
					if ($scope.resourcesToBind) {

					 	for(var key in data.links){
							if($scope.resourcesToBind[data.links[key]]){
								payloads[data.links[key]] = '';
							}
						}
						resourceFactory.patch(data.resourceUrl, payloads).then(function() {
							if (data.callback) {
								$scope.execute(data.callback);
							}
						});
						
					}
				}
			});
		},
		templateUrl: $rootScope.templatesURL + 'renderer.html'
	};
}]);
'use strict';

/*
global angular
*/

angular.module('omnichannel').directive('tableRender', ['MetaModel', '$resource', '$location', '$injector', '$rootScope', 'resourceFactory', function(MetaModel, $resource, $location, $injector, $rootScope, resourceFactory){
	return {
		restrict: 'E',
		replace: 'true',
		scope: {
			metamodel: '=',
			resourceUrl: '=',
			factoryName: '='
		},
		controller: ['$scope', function($scope){
			var metamodelObject = $rootScope.metamodel? $rootScope.metamodel[$scope.metamodel]: null;
			if (!metamodelObject) {
				MetaModel.load($rootScope, $rootScope.regionId, $scope.metamodel, function(data) {
					_init(data);
				});
			} else {
				_init(metamodelObject);
			}

			$scope.$on('resource_directory', function(event, params) {
				if ((params.url === $scope.resourceUrl) ||
					(params.previous && params.previous.data && params.previous.data._links.up.href === $scope.resourceUrl) || 
					(params.response.data._links && params.response.data._links.up && params.response.data._links.up.href === $scope.resourceUrl) ||
					($scope.resultSet && params.url in $scope.resultSet)) {

					if (params.response.config.method === 'DELETE' || params.response.config.method === 'PATCH' || params.response.config.method === 'POST') {
						//refresh collection and items
						$scope.inProgress = true;
						MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, {}, null, true).then(function(resultSet){
							$scope.resultSet = resultSet;
							$scope.inProgress = false;
						});
					} else {
						//refresh items
						if (!$scope.inProgress) {
							$scope.inProgress = true;
							MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, {}).then(function(resultSet) {
								$scope.resultSet = resultSet;
								$scope.inProgress = false;
							});
						}
					}
				}
			});

			$scope.$on('refresh_table', function(event, params) {
				if (params.name === $scope.metamodelObject.name) {
					$scope.inProgress = true;
					MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, {}, null, true).then(function(resultSet) {
						$scope.resultSet = resultSet;
						$scope.inProgress = false;
					});
				}
			});

			function _init(metamodelObject){
				$scope.resultSet = {};
				$scope.itemSelected = {};
				$scope.metamodelObject = metamodelObject;

				var modalRef = $scope.metamodelObject.modalRef;
                if (modalRef) {
                	var modalMetamodel = $rootScope.metamodel? $rootScope.metamodel[modalRef]: null;
					if (!modalMetamodel) {
						MetaModel.load($rootScope, $rootScope.regionId, modalRef, function(data) {
							$scope.modalMetamodelObject = data;
						});
					} else {
						$scope.modalMetamodelObject = modalMetamodel;
					}
                }

				$scope.resourceUrl = $scope.resourceUrl || $scope.metamodelObject.resourceUrl;
				MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);

				$scope.$watchCollection('resultSet', function(newValue){
					if(newValue && newValue[$scope.resourceUrl]) {
						$scope.table = angular.copy(newValue[$scope.resourceUrl]);
						$scope.table.items = [];
						newValue[$scope.resourceUrl].items.forEach(function(item){
							if ($scope.metamodelObject.filters) {
								_isFiltered(item).then(function(filtered) {
					                if (!filtered) {
					                	_addItem(newValue, item);
					                }
					            });
							} else {
								_addItem(newValue, item);
							} 
							
						});
					}

					//buttons
					_getButtonsFromOptions();
				});
				
				$scope.factoryName = metamodelObject.factoryName || $scope.factoryName ;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(e) {
					console.log($scope.factoryName + ' not found');
				}
			}

			function _addItem(newValue, item) {
				var newItem = angular.copy(newValue[item.href]);
              	var newValueItem = _getResultSetItem(newValue, newItem);

              	$scope.itemResourcesToBind = { properties : {} };
              	for(var resource in newValueItem) {
                	$scope.itemResourcesToBind[newValueItem[resource].identifier] = newValueItem[resource];
              	}

              	for(var i = 0; i < $scope.metamodelObject.properties.length; i++) {
               		var metamodelProperty = $scope.metamodelObject.properties[i];
                	var idValues = metamodelProperty.id; 
                	if (!Array.isArray(metamodelProperty.id)) {
                  		idValues = [metamodelProperty.id];
                	}
                	if (_isInput(metamodelProperty.type)) {
                  		metamodelProperty.id = idValues;
                	}
               		for(var j = 0; j < idValues.length; j++) {
                  		var resourceSelected = _getResourceSelected(idValues[j]);
                  		if (resourceSelected && resourceSelected.properties && idValues[j] in resourceSelected.properties) {  
                    		$scope.itemResourcesToBind.properties[idValues[j]] = resourceSelected.properties[idValues[j]];      
                  		}
                	}
              	}

              	if (Object.keys($scope.itemResourcesToBind.properties).length > 0) {
                	newItem.properties = $scope.itemResourcesToBind.properties;
              	}
              	if (newItem) {
                	$scope.table.items.push(newItem);
              	}
			}

			function _isFiltered(item) {
		        var filters = $scope.metamodelObject.filters;
		        return resourceFactory.get(item.href).then(function(resource) {
		          if (filters) {
		            for (var filter in filters) {
		              var values = $scope.metamodelObject.filters[filter];
		              if (values.indexOf(resource.data[filter]) !== -1) {
		                return false;
		              } else {
		                return true;
		              }
		            }
		          } else {
		            return false;
		          }
		        });
		    }

			function _getButtonsFromOptions() {
				$scope.buttons = [];
				if ($scope.metamodelObject.buttons) {
					var label = $scope.metamodelObject.buttons.label;
					//look for the POST operation by default to create the possible buttons
					resourceFactory.get($scope.resourceUrl).then(function(response) {
						response.data._options.links.forEach(function(link) {
							if (link.rel === 'create') {
								var params = {};
								if (link.schema.required && link.schema.required.length > 0) {
									//FIXME. if there is more than one attribute required
									var required = link.schema.required[0];
									if (link.schema.properties && required in link.schema.properties) {
										var property = link.schema.properties[required];
										if (property.enum) {
											property.enum.forEach(function(value) {
												params = {};
												params[required] = value;
												$scope.buttons.push({
													label: 'ADD_'+value.toUpperCase().trim(),
													action: { value: 'add', buttonAction: true, params: params }
												});
											});
										}
									}
								}
								if ($scope.buttons.length === 0) {
									$scope.buttons.push({
										label: label,
										action: { value: 'add', buttonAction: true, params: params }
									});
								}
							}
						});
					});
				}
			}

			function _isInput(type) {
				return type !== 'status' && type !== 'icon' && type !== 'literal' && type !== 'blank' && type !== 'actions';
			}

			function _getResourceSelected(id) {
				var resourceSelected = null;
				var resourceSelectedPreferred = null;
				for(var resource in $scope.itemResourcesToBind) {
					if (resource !=='properties'){
						if (id in $scope.itemResourcesToBind[resource].properties){	
							resourceSelected = $scope.itemResourcesToBind[resource];
							for(var property in resourceSelected.properties) {
								if (property.indexOf('preferred') !== -1 && resourceSelected.properties[property].value) {
									resourceSelectedPreferred = resourceSelected;
								}
							}
						}
					}
				}
				return resourceSelectedPreferred || resourceSelected;
			}

			function _getResultSetItem(resultSet, item) {
				var resultSetItem = {};
				if (item && item.href) {
					resultSetItem[item.href] = item;
					if (item.dependencies) {
						item.dependencies.forEach(function(dependency) {
							for(var resource in resultSet) {
								if (resource.indexOf(dependency.href) !==-1) {
									resultSetItem[resource] = resultSet[resource];
								}
							}
						});
					}
				}
				return resultSetItem;
			}

			$scope.execute = function(action, displayedItem) {
				if(action.buttonAction){
					if ($scope.metamodelObject.buttons.method) {
						$scope.actionFactory[$scope.metamodelObject.buttons.method](action.params);
					} else {
						$scope[action.value](action.params, $scope.metamodelObject.buttons.callback);
					}
				} else {
					if (action.method) {
						$scope.actionFactory[action.method](displayedItem, action, $scope);
					} else {
						$scope[action.value](displayedItem, action.callback);
					}
				}
			};

			$scope.isValidStatus = function(displayedItem){
 				var status = true;
 				if (displayedItem) {
 					var properties = displayedItem.properties;
					if ($scope.modalMetamodelObject) {
						$scope.modalMetamodelObject.sections.forEach(function(section) {
			 				if (section.properties) {
			                    section.properties.forEach(function(property){
			 						var ids = property.id;
			 						if(!Array.isArray(ids)){
			 							ids = [ids];
			 						}
			 						ids.forEach(function(id){
			 							if (properties[id]){
				 							status = status && properties[id].consistent;
				 						}
			 						});
				 				});
							}
						});
		               
					}
 				}
				return status;
			};

			$scope.edit = function(itemSelected, callback) {
				$scope.itemSelected = itemSelected;
				//Bootstrap takes care of openin a pop up
				if (callback) {
					if ($scope.actionFactory[callback]) {
						$scope.actionFactory[callback](itemSelected);
					}
				}
			};

	 		$scope.delete = function(displayedItem, callback) {
	 			if (displayedItem.deletable) {
	 				//delete resource
	 				resourceFactory.delete(displayedItem.href).then(function(response) {
	 					if (callback) {
	 						if ($scope.actionFactory[callback]) {
								$scope.actionFactory[callback](response);
							}
	 					}
	 				});
	 			}
	 		};

	 		$scope.add = function(params, callback) {
	 			resourceFactory.get($scope.resourceUrl).then(function(response) {
	 				response.data._options.links.forEach(function(link) {
	 					if (link.rel === 'create') {
	 						var hrefToPost = link.href;
	 						resourceFactory.post(hrefToPost, params, $rootScope.headers).then(function(response) {
				 				//select the new resource
				 				var href = response.data._links.self.href;
				 				$scope.edit({href: href});

				 				if (callback) {
				 					if ($scope.actionFactory[callback]) {
										$scope.actionFactory[callback](response);
									}
				 				}
				 			});
	 					}
	 				});
	 			});
	 		};

		}],
		link : function (/*$scope*/) {
		},
		templateUrl: $rootScope.templatesURL + 'table.html'
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

    this.setAction = function(action){
        $rootScope.actionAfterNavigation = action;
    };

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
            if($rootScope.metamodel !== undefined){
                $rootScope.metamodel[screenId] = m.metamodel;    
            }

            // Initialize colspan and offset if they do not exist
            m.metamodel.colspan = m.metamodel.colspan || 12;
            m.metamodel.offset = m.metamodel.offset || 0;

            if (m.include && m.include.length > 0) {
                loadReferencedMetaModels(growl, scope, m, screenId, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve);
            } else {
                setScreenData($rootScope, scope, m, screenId, $browser, onSuccess, resolve);
            }
            loadOptions(growl, scope, screenId, regionId, $rootScope, resourceFactory);
        }, function() {
            $rootScope.showIcon = false;
            //showMessage($rootScope.appConfig.timeoutMsg);
            growl.error($rootScope.appConfig.timeoutMsg);
            return;
        });
    };


this.handleAction=function($rootScope, $scope, inputComponent, rootURL, properties, resourceFactory, defaultValues, $location, resolve){        
    var options = {};
    if(rootURL === undefined){
        var url = $rootScope.hostURL + inputComponent.resource;
        //Retrieve regionToSORMap from the rootScope
        var regionToSORMap = $rootScope.regionToSoR;
        //Retrieve the application name for the given region Id
        var applName = regionToSORMap[$rootScope.regionId];
        //Replace the regionId with application name in the URL
        rootURL = url.replace(':regionId',applName);
    }
    //Pick the URL for the business dependency on which your metamodel depends. 
    if(properties !== undefined){
        angular.forEach(properties, function(val, key) {
            var url = properties[key].self;
            if(url !== undefined && url !== rootURL){
                rootURL = url;
            }
        });
    }
    
    console.log('Invoke options on - '+rootURL);

    if(!$rootScope.optionsMapForURL){
        $rootScope.optionsMapForURL = new Map();
    }

    if(!$rootScope.optionsMapForURL.get(rootURL)){
    
            callOptions($rootScope, rootURL, function(optionsObj){
                options = optionsObj.get(inputComponent.action);
                if(!properties){
                    properties = options.properties;
                }
                if(options !== undefined){
                    invokeHttpMethod(growl, undefined, $scope, resourceFactory, properties, $rootScope, options, defaultValues, inputComponent.actionURL, $location, resolve);       
                }
            });
    }else{
        options = $rootScope.optionsMapForURL.get(rootURL).get(inputComponent.action);
        if(!properties){
            properties = options.properties;
        }
        if(options !== undefined){
            invokeHttpMethod(growl, undefined, $scope, resourceFactory, properties, $rootScope, options, defaultValues, inputComponent.actionURL, $location, resolve);       
        } 
    } 
};

    this.prepareOptions = function($rootScope, rootURL, optionsMap){
        if(!$rootScope.optionsMapForURL){
            $rootScope.optionsMapForURL = new Map();
        }
        if($rootScope.optionsMapForURL.get(rootURL)){
            optionsMap[rootURL] = $rootScope.optionsMapForURL.get(rootURL);
            return;
        } 
        var methodResourceFactory = resourceFactory.refresh;
        var params = {};
         var responseGET = methodResourceFactory(rootURL, params, $rootScope.headers);
          if(responseGET.then){
            responseGET.then(function success(httpResponse){
                console.log('OPTIONS CALL INVOKED URL:'+rootURL);
                var responseData = httpResponse.data || httpResponse;
                // Add the resource to the result set
                $rootScope.optionsMapForURL.set(rootURL, _processOptions(responseData));
                optionsMap[rootURL] = $rootScope.optionsMapForURL.get(rootURL);
            }, function error(errorResponse){
                // FIXME TODO: Do something useful if required, for now just logging
                console.error(errorResponse);
                throw errorResponse;
            });
        }
    };

    this.actionHandling=function(item, $scope, regionId, screenId, action, resourceFactory, tab, optionFlag, resolve){
        //Retrieve the meta-model for the given screen Id from the scope
        var metaModel = $scope.metamodel[screenId] || $scope.metamodelObject;
        
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
                        $rootScope.actionAfterNavigation = undefined;
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
            'Content-Type': 'application/json'
        };

        if($rootScope.user && $rootScope.user.name){
            $rootScope.headers.username = $rootScope.user.name;
        }
    };

    function callOptions($rootScope, rootURL, callback){
        if(!$rootScope.optionsMapForURL){
            $rootScope.optionsMapForURL = new Map();
        }
        
        var methodResourceFactory = resourceFactory.refresh;
        var params = {};
         var responseGET = methodResourceFactory(rootURL, params, $rootScope.headers);
          if(responseGET.then){
            responseGET.then(function success(httpResponse){
                console.log('OPTIONS CALL INVOKED URL:'+rootURL);
                var responseData = httpResponse.data || httpResponse;
                // Add the resource to the result set
                $rootScope.optionsMapForURL.set(rootURL, _processOptions(responseData));
                if(typeof callback === 'function'){
                  callback($rootScope.optionsMapForURL.get(rootURL));  
                } 
            }, function error(errorResponse){
                // FIXME TODO: Do something useful if required, for now just logging
                console.error(errorResponse);
                throw errorResponse;
            });
        }
    }    
    /*============================================= Helper methods for components =============================================*/
    /*
        This function is in charge of analyzing the metamodel object and create an array with all the urls (resource 
        dependencies) that must be queried based on a $http response.
        Entry parameters:
            - responseData -> Success $http response data object.
            - metamodel -> Object representing the UI metamodel.
        Output:
            - An array containing all the resource urls that must be retrieved (empty array if no dependencies).
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

        // Process http response to know which keys are contained in this resource
        for(var property in responseData){
            var propertyKey = {};
            if(property.indexOf('_') !== 0 && property.indexOf(':') > 0){
                propertyKey = property.split(':')[0];
            
                if(keySet.indexOf(propertyKey) === -1){
                    keySet.push(propertyKey);
                }
            } else if(property.indexOf('-') > 0){
                propertyKey = property.split('-')[0];
            
                if(keySet.indexOf(propertyKey) === -1){
                    keySet.push(propertyKey);
                }
            }
        }

        // If our business object specifies a dependency for any of the keys obtained before, we extract those links to query them
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

    function _processOptions(responseData){
        var optionsMapForResource = new Map();
        
        if(responseData && responseData._options){
            var optiondataobj = responseData._options.links;
            if(optiondataobj !== undefined){
                angular.forEach(optiondataobj, function(optionsObj){
                    var object = {};
                    if(optionsObj !== undefined){
                        object.action = optionsObj.rel;
                        object.href = optionsObj.href;
                        object.httpmethod = optionsObj.method;
                        var schema = optionsObj.schema;
                        var propertiesObject = {};
                        if(schema !== undefined){
                            var optionProp = schema.properties;
                            if(optionProp !== undefined){
                                angular.forEach(optionProp, function(val, key){
                                    propertiesObject[key] = {};
                                    propertiesObject[key].metainfo = schema.properties[key];
                                    propertiesObject[key].value = '';
                                    propertiesObject[key].url = optionsObj.href;
                                    propertiesObject[key].required = (schema.required && schema.required.indexOf(key) >= 0);
                                    propertiesObject[key].editable = true;
                                    propertiesObject[key].statusMessages = {information: [], warning: [], error: [], errorCount: 0};
                                    propertiesObject[key].consistent = true;
                                });
                            }
                            object.properties = propertiesObject; 
                        }
                    }
                    if(!optionsMapForResource.get(object.action)){
                        optionsMapForResource.set(object.action, object);
                    }
                });    
            }
        }
        return optionsMapForResource;
    }
    /*
        Based on a valid (success) data http response (data object contained in $http response) this function 
        creates and returns an object (map) where the keys are the names of the properties and the values are 
        objects containing the following information:
            - metainfo: Object representing the meta-information specified by the backend, such as maximum lengths.
            - value: Value of the property.
            - required: Boolean that indicates whether or not this property is required.
            - editable: Boolean that indicates whether or not this property is editable.
            - self: String URL of the entity this property belongs to.
            - consistent: Boolean representing the status (valid or not) of this property in the backend.
            - statusMessages: Object containing 3 arrays, one for every type of severity message (information, 
              warning, error), and the counter that indicates how many errors and warnings we have to deal with.
        Entry parameters:
            - responseData -> Success $http response data object.
        Output:
            - Object containing the processed properties.
    */
    function _processProperties(responseData){
        var propertiesObject = {};

        if(responseData && responseData._options){
            // First get the PATCH and self links to use them later
            var updateCRUD;
            var resourceURL;
            if(responseData._options.links){
                responseData._options.links.forEach(function(crud){
                    if(crud.rel === 'update'){
                        updateCRUD = crud;
                    }
                });
            }
            

            for(var link in responseData._links){
                 if(link === 'self'){
                    resourceURL = responseData._links[link].href;
                }
            }

            // Process the entity properties
            for(var property in responseData._options.properties){
                if(responseData._options.properties[property].format !== 'uri'){
                    propertiesObject[property] = {};
                    propertiesObject[property].metainfo = responseData._options.properties[property];
                    propertiesObject[property].value = responseData[property];
                    propertiesObject[property].self = resourceURL;
                    propertiesObject[property].required = (responseData._options.required && responseData._options.required.indexOf(property) >= 0);
                    propertiesObject[property].editable = (updateCRUD && updateCRUD.schema && (property in updateCRUD.schema.properties));
                    propertiesObject[property].statusMessages = {information: [], warning: [], error: [], errorCount: 0};
                    propertiesObject[property].consistent = true;
                }
            }

            // Process status of the properties (based on status_report coming from backend)
            if(responseData._embedded){
                for(var rel in responseData._embedded) {
                    if(rel.indexOf('status_report') >= 0 && responseData._embedded[rel].messages){
                        for(var j = 0; j < responseData._embedded[rel].messages.length; j++){
                            var item = responseData._embedded[rel].messages[j];
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
            
        }

        return propertiesObject;
    }

    /*
        Function that processes collection resources and extract its items urls to query them afterwards if required. In
        case that the response ($http success data object) contains a summary for the items, we add them to the object
        passed as second argument.
        Entry parameters:
            - responseData -> Data object contained in a success $http response.
            - summaryData -> Object where the summaries of the items will be injected.
        Output parameters:
            - An array with the urls of the collection's items (empty array if there are not items).
    */
    function _extractItemDependencies(responseData, summaryData){
        var itemDependencies = [];

        if(responseData && responseData._links){
            for(var linkKey in responseData._links){
                if(linkKey === 'item'){
                    var items = responseData._links[linkKey];
                    // If there is only one item, the response it's not an array but an object
                    if(!Array.isArray(items)){
                        items = [items];
                    }

                    for(var j = 0; j < items.length; j++){
                        var item = items[j];
                        itemDependencies.push({ href: item.href, title: item.title });
                        if(item.summary && summaryData){
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

    /*
        Based on a $http response data and a metamodel, this function will create an uniform object (same structure for
        collection resources and entity resources) containing the following information:
            - dependencies -> Array of urls for the related resources.
            - properties -> Object (map) with key equal to the name of the property and value equal to the object specified
              for function '_processProperties'.
            - items -> Array of urls for the items of the collection if any.
            - deletable -> Boolean indicating whether or not this resource allows the DELETE operation.
            - patchable -> Boolean indicating whether or not this resource allows the PATCH operation.
            - creatable -> Boolean indicating whether or not this resource allows the POST operation.
        Entry parameters:
            - responseData -> Data object contained in the $http success response.
            - metamodel -> UI metamodel object.
            - summaryData -> Object where the summary of the collection's items (if any) will be stored.
    */
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

            if(responseData._links.self){
                resource.href = responseData._links.self.href;    
            }

            if(responseData._links.up){
                resource.up = responseData._links.up.href;    
            }

            resource.properties = _processProperties(responseData);
            resource.dependencies = _extractBusinessDependencies(responseData, metamodel);
            resource.items = _extractItemDependencies(responseData, summaryData);

            // Process CRUD operations to check whether or not we can PATCH, DELETE...
            if(responseData._options.links){
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
           
        }

        return resource;
    }


    this.getDefaultValues = function(action, metaModel){
        var properties = {};

            if(metaModel.defaultValue !== undefined){
                angular.forEach(metaModel.defaultValue, function(resource) {
                    if(action ===resource.action){
                        if(resource.value === 'Date'){
                            resource.value = formatIntoDate(new Date());    
                        }

                        properties[resource.field] = {value: resource.value};
                        
                    }
                });
            }


        return properties;

    };

    /*============================================= END Helper methods for components =============================================*/

    /*============================================= Component methods =============================================*/
    /*
        This function queries the backend with the given URL and all the URLs found in the business object
        configuration specified in the metamodel object.
        Entry parameters:
            - rootURL -> URL of the resource to get.
            - metamodel -> UI metamodel object.
            - resultSet -> Object where the retrieved resources will be inserted.
            - dependencyName -> String that will be used as identifier of the resource.
        Output:
            - None. It will insert the results in the third parameter.
    */
    this.prepareToRender = function(rootURL, metamodel, resultSet, dependencyName, refresh){
        
        // Entry validation
        if(!resultSet){
            return $q(function(resolve, reject){
                reject('No result set to store the results');
            });
        } else if(!resultSet.deferred){
            resultSet.deferred = $q.defer();
            resultSet.pending = 1;
        }

        var methodResourceFactory = resourceFactory.get;
        if (refresh) {
            methodResourceFactory = resourceFactory.refresh;
        }
        var payload = JSON.parse(sessionStorage.getItem(metamodel.resource+'_'+metamodel.actionOnScreen+'_params'));
        sessionStorage.removeItem(metamodel.resource+'_'+metamodel.actionOnScreen+'_params');
        var responseGET = methodResourceFactory(rootURL, payload);
        // Cached response (resource directory) or not, we always get a promise
        if(responseGET.then){
            responseGET.then(function success(httpResponse){
                
                var responseData = httpResponse.data || httpResponse;
                var summaryData = {};
                resultSet.pending--;

                // Add the resource to the result set
                resultSet[rootURL] = _processResponse(responseData, metamodel, summaryData);
                resultSet[rootURL].identifier = rootURL.substring(rootURL.lastIndexOf('/')+1);
                // Build the right href. When there are url parameters, they are not included in the href so we need to include them
                resultSet[rootURL].href = rootURL.substring(0, rootURL.lastIndexOf('/')+1)+resultSet[rootURL].identifier;
                resultSet[rootURL].identifier = dependencyName || resultSet[rootURL].identifier;
               // $rootScope.resourceUrl = rootURL;

                // Analyze business dependencies in order to extract them
                resultSet[rootURL].dependencies.forEach(function(url){
                    console.log('Invoked for dependencies - '+url.href);
                    resultSet.pending++;
                    self.prepareToRender(url.href, metamodel, resultSet, url.resource);
                });

                // Shall we stick with the summaries or shall we retrieve the whole item ??
                if(!metamodel.summary){
                    resultSet[rootURL].items.forEach(function(url){
                        console.log('Invoked for items details - '+url.href);
                        resultSet.pending++;
                        self.prepareToRender(url.href, metamodel, resultSet, null, refresh);
                    });
                } else {
                    for(var resourceURL in summaryData){
                        resultSet[resourceURL] = summaryData[resourceURL];
                        resultSet[resourceURL].identifier = resourceURL.substring(resourceURL.lastIndexOf('/')+1);
                        resultSet[resourceURL].href = resourceURL;
                    }
                }

                if(resultSet.pending === 0){
                    var deferred = resultSet.deferred;
                    delete resultSet.deferred;
                    delete resultSet.pending;

                    deferred.resolve(resultSet);
                }
            }, function error(errorResponse){
                // FIXME TODO: Do something useful if required, for now just logging
                console.error(errorResponse);
                throw errorResponse;
            });
        }

        return resultSet.deferred.promise;
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

function sanitizeSchema(fieldName, options){
    angular.forEach(options.schema.properties, function(val, key) {
        if (key !== fieldName) {
            delete options.schema.properties[key];
        }
    });
    return options;
}

function loadOptionsDataForMetamodel(growl, item, resourcelist, scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve){
        if(resourcelist !== undefined && resourcelist.length > 0){
            //Iterate through the resource list of meta model
            angular.forEach(resourcelist, function(resource) {
                
                console.log('RESOURCE : '+resource);

                //Formulate the URL for the options call
                var url;
                var newURL;
                var patchFieldName;
                if(scope.patchFieldName){
                    patchFieldName = scope.patchFieldName;
                }

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
                    $rootScope.resourceHref = newURL;
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
                    resourceFactory.options(newURL, $rootScope.headers).success(function(responseData){
                    var data = responseData.data || responseData;
                    //Fetch the options response
                    var optiondataobj = data._options.links;
                    var options;
                    if(tab !== undefined) {
                        //Fetch the links response
                        var tabObj = data._links[tab];

                        if(tabObj !== undefined){

                            var tabUrl = tabObj.href;

                            resourceFactory.options(tabUrl, $rootScope.headers).success(function(responseData1){
                                var data1 = responseData1.data || responseData1;
                                var detailTabUrl = data1._links.item.href;
                                resourceFactory.options(detailTabUrl, $rootScope.headers).success(function(responseData2){
                                    var data2 = responseData2.data || responseData2;
                                    optiondataobj = data2._options.links;
                                    setOptionsMapForResource(optiondataobj, optionsMapForResource);
                                    scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                                    if(action !== undefined || $rootScope.actionAfterNavigation !== undefined){
                                        options = optionsMapForResource.get(action) || optionsMapForResource.get($rootScope.actionAfterNavigation);
                                        if(options !== undefined && patchFieldName !== undefined){
                                            options = sanitizeSchema(patchFieldName, options);
                                            httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                            $rootScope.actionAfterNavigation = undefined;
                                        }
                                        else{
                                            if(resolve) {
                                                resolve();
                                            }  
                                        }
                                    }
                                });
                            });
                        } else {
                            setOptionsMapForResource(optiondataobj, optionsMapForResource);
                            scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                            if(action !== undefined  || $rootScope.actionAfterNavigation !== undefined){
                                 options = optionsMapForResource.get(action) || optionsMapForResource.get($rootScope.actionAfterNavigation);
                                
                                if(options !== undefined){
                                    httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                    $rootScope.actionAfterNavigation = undefined;
                                }
                            }
                        }
                        } else {
                            setOptionsMapForResource(optiondataobj, optionsMapForResource);
                            scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                            if(action !== undefined  || $rootScope.actionAfterNavigation !== undefined){
                                options = optionsMapForResource.get(action) || optionsMapForResource.get($rootScope.actionAfterNavigation);
                                if(options !== undefined){
                                    httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                    $rootScope.actionAfterNavigation = undefined;
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

function convertToArray(data) {
    if(data !== undefined && data.length === undefined){
        var array = [];
        array.push(data);
        return array;
    }
    return data;
}

function invokeHttpMethod(growl, item, $scope, resourceFactory, properties, $rootScope, options, defaultValues, actionURL, $location, resolve){
    //Retrieve the URL, Http Method and Schema from the options object
    var url = options.href;
    var httpmethod = options.httpmethod;
    console.log(options.action + ' Action : Perform '+httpmethod +' operation on URL - '+url +' with following params - ');
    //$scope.resourceUrl = url;
    var params={};
    if(httpmethod==='GET'){
        //Set the params data from the screen per the schema object for the given action (from the options object)
        params = setDataToParams(properties, params);
        $rootScope.loader.loading=true;    
        //Call the get method on the Data Factory with the URL, Http Method, and parameters

        resourceFactory.get(url,params,$rootScope.headers).success(function(response){
            $scope.resourceUrl= url;
            $rootScope.resourceUrl = url;
            var responseData = response.data || response;
            $rootScope.loader.loading=false;
            if(actionURL){
                $rootScope.navigate(actionURL);
            }
            //Load the results into the search results table
            if(options.action==='search'){                
                return responseData._links.item;   
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            //showMessage($rootScope.locale.GET_OPERATION_FAILED);
            growl.error($rootScope.locale.GET_OPERATION_FAILED);
        });
    } else if(httpmethod==='POST'){
        properties = loadFromDefaultSet(properties, defaultValues);
        params = setDataToParams(properties, params);
        $rootScope.loader.loading=true;
        //Call the post method on the Data Factory
        resourceFactory.post(url,params,$rootScope.headers).success(function(httpResponse){
            var data = httpResponse.data || httpResponse;
        if (data) {
            $scope.resourceUrl= data._links.self.href;
            $rootScope.resourceUrl= data._links.self.href;
            if(actionURL){
                $rootScope.navigate(actionURL);
            }
           // $scope.optionUrl = data._links.self.href;
            $rootScope.resourceHref = data._links.self.href;
            $rootScope.loader.loading=false;
            if(resolve) {
                resolve();
            }                    
        }
        }).error(function(){
            $rootScope.loader.loading=false;
        });
    } else if(httpmethod==='PATCH'){

        $rootScope.loader.loading=true;
        //Call the patch method on the Data Factory
        //Set the params data from the screen per the schema object for the given action (from the options object)
        params = setDataToParams(properties, params);

        resourceFactory.patch(url,params,$rootScope.headers).success(function(responseData){
            var data = responseData.data || responseData;
            if (data) { 
                if(data.outcome === 'failure'){
                    angular.forEach(data.messages, function(value){
                        growl.error(value.message);
                    });
                }  
                $rootScope.loader.loading=false;
       
                if(resolve) {
                    resolve();
                }
            }
            if(actionURL){
                $location.path(actionURL);    
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            //showMessage($rootScope.locale.PATCH_OPERATION_FAILED);
            growl.error($rootScope.locale.PATCH_OPERATION_FAILED);
        });
    } else if(httpmethod==='DELETE'){
        resourceFactory.delete(url,$rootScope.headers).success(function(responseData){
	       var data=responseData.data || responseData ;
            if(data.outcome === 'success'){
                angular.forEach(data.messages, function(value){
                    growl.success(value.message);
                });
            }else{
                angular.forEach(data.messages, function(value){
                    growl.error(value.message);
                });
            }
        });
    }
}


function httpMethodToBackEnd(growl, item, $scope, resourceFactory, $rootScope, options, resolve){
    //Retrieve the URL, Http Method and Schema from the options object
    var url = options.url;
    var httpmethod = options.httpmethod;
    var schema = options.schema;
    console.log(options.action + ' Action : Perform '+httpmethod +' operation on URL - '+url +' with following params - ');

    var params={};
    //Set the params data from the screen per the schema object for the given action (from the options object)
    params = setData($scope, schema, params);

    if(httpmethod==='GET'){
        $rootScope.loader.loading=true;    
        //Call the get method on the Data Factory with the URL, Http Method, and parameters
        resourceFactory.get(url,params,$rootScope.headers).success(function(responseData){
            var data = responseData.data || responseData;
            $rootScope.loader.loading=false;
            //Load the results into the search results table
            if(options.action==='search'){
                if(data._links.item && Object.keys(data._links.item).length > 0){
                    $scope.stTableList = convertToArray(data._links.item);
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
            growl.error($rootScope.locale.GET_OPERATION_FAILED);
        });
    } else if(httpmethod==='POST'){
        $rootScope.loader.loading=true;
        //Call the post method on the Data Factory
        resourceFactory.post(url,params,$rootScope.headers).success(function(data){
        if (data) {
                if($rootScope.regionId === 'us' ){
                     if(data._links.self.quoteNumber !== undefined){
                        $scope.data['quote:identifier']=data._links.self.quoteNumber;
                        $scope.data['quote:annual_cost'] =data._links.self.premium;                        
                     } 
                     if(data.outcome === 'success'){
                            angular.forEach(data.messages, function(value){
                            growl.success(value.message);
                        });
                     } else{
                        //showMessage($rootScope.locale.CREATE_OPERATION_FAILED);
                        growl.error($rootScope.locale.CREATE_OPERATION_FAILED);
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
            if (data) { 
                if(data.outcome === 'success'){
                    angular.forEach(data.messages, function(value){
                        growl.success(value.message);
                    });
                }else{
                    angular.forEach(data.messages, function(value){
                        growl.error(value.message);
                    });
                }  
                $rootScope.loader.loading=false;
       
                if(resolve) {
                    resolve();
                }
            }
           resourceFactory.refresh(url,params,$rootScope.headers); 
        }).error(function(){
            $rootScope.loader.loading=false;
            //showMessage($rootScope.locale.PATCH_OPERATION_FAILED);
            growl.error($rootScope.locale.PATCH_OPERATION_FAILED);
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
                angular.forEach(data.messages, function(value){
                    growl.success(value.message);
                });
            }else{
                angular.forEach(data.messages, function(value){
                    growl.error(value.message);
                });
            }
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
            $rootScope.metamodel[value] = m.metamodel;
        }, function() {
            $rootScope.showIcon = false;
            //showMessage($rootScope.appConfig.timeoutMsg);
            growl.error($rootScope.appConfig.timeoutMsg);
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
    $rootScope.metamodel = scope.metamodel = scope.metamodel || {};
    scope.metamodel[screenId] = m.metamodel;
    
    if(m.metamodel.showHeader === undefined){
        m.metamodel.showHeader = true;
    }
    $rootScope.metamodel.showHeader = m.metamodel.showHeader;
    
    $browser.notifyWhenNoOutstandingRequests(function() {
        changeMandatoryColor($rootScope);
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

function loadFromDefaultSet(properties, defaultValues){
    if(properties !== undefined && defaultValues !== undefined){
        for (var key in properties) {
            if (!properties[key].value) {
                if(defaultValues[key] !== undefined){
                    properties[key].value = defaultValues[key].value;    
                }
            }
        }
    }
    return properties;
}

function setDataToParams(properties, params){
    if(properties !== undefined){
        angular.forEach(properties, function(val, key){
            var value = properties[key].value;
            var type = properties[key].metainfo.type;

            if(type !== undefined && type==='static'){
                value = properties[key].metainfo.value;
            }

            if(value === null || value === undefined || value === '' || value === 'undefined'){
                //continue
            }else{
    
                var format = properties[key].metainfo.format;
    
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
                params[key] = value;
            }
        });    
    }
    return params;
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

    $resource('assets/resources/metamodel/header.json').get(function(data) {

        $rootScope.headermetamodel = data.metamodel;
    }, function() {});

}]);

'use strict';
/*global validateLogin,growl*/

/*
exported LoginController
*/

function LoginController($scope, $rootScope, $location, $cookieStore, $http, $resource, OCRoles, tmhDynamicLocale,LoginSrv,FieldService,OCInfraConfig,OCMetadata) {
    $rootScope.screenId = 'login';
    var metamodelLocation = $rootScope.metamodelPath;
    OCMetadata.load($scope,metamodelLocation);


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
                growl.error($rootScope.locale.NETWORK_UNAVAILABLE, '30');
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
                        growl.error($rootScope.locale.INVALID_CREDENTIALS);
                        return false;
                    }
                    $rootScope.user = user;
                    
                    if($rootScope.user.name === 'pntuser'){
                        $rootScope.showIcon = true;
                    }else{
                        $rootScope.showIcon = false;
                    }

                    sessionStorage.username = user.name;
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
                        growl.error(data.exception.message, '30');
                    } else {
                        growl.error($rootScope.locale.GENERAL_ERROR);
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
    var PENDING_REQUEST = '0';

    function _addApiGatewayApiKeys(params) {
        if (params === undefined) {
            params = {};
        }
        if ($rootScope.config.apiGatewayApiKeys) {
            for(var key in $rootScope.config.apiGatewayApiKeys) {
                params[key] = $rootScope.config.apiGatewayApiKeys[key];
            }
        }
        return params;
    }

    function _getFromResourceDirectory(url) {
      return angular.copy(resourceDirectory[url]);
    }

    function _get(url, params, headers) {
        // Since the url params are not considered when updating the resource directory, we just reset it for the concrete URL if we have params
        if(params && Object.keys(params).length > 0){
            resourceDirectory[url] = null;
        }

        params = _addApiGatewayApiKeys(params);
        var promise;
        if (!resourceDirectory[url]) {
            resourceDirectory[url] = PENDING_REQUEST;
            promise = $http({
                    method : 'GET',
                    url : url,
                    params : params,
                    headers : headers
            });
            if (promise.then) {
                promise.then(function(response) {
                    var previous = resourceDirectory[url];
                    resourceDirectory[url] = response;
                    $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': previous });

                }, function(error) {
                    console.error(error);
                    throw error;
                });   
            }
        } else {
            promise = $q(function(resolve) {
                if (resourceDirectory[url] === PENDING_REQUEST) {
                    $rootScope.$on('resource_directory', function(event, data) {
                        if (data.url === url) {
                            resolve(resourceDirectory[url]);
                        }
                    });
                } else {
                    resolve(resourceDirectory[url]);
                }
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

    function _post(url, data, headers) {
        var params = _addApiGatewayApiKeys({});
        var promise = $http({
                method: 'POST',
                url: url,
                headers: headers,
                params: params,
                data: data
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[response.data._links.self.href] = response;
                $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': undefined });

            }, function(error) {
                //console.error(error);
                return error;
            });   
        }
        return promise;
    }

    function _delete(url, headers) {
        var params = _addApiGatewayApiKeys({});
        var promise = $http({
            method : 'DELETE',
            url : url,
            headers : headers,
            params: params
        });
        if (promise.then) {
            promise.then(function(response) {
                var previous = resourceDirectory[url];
                resourceDirectory[url] = null;
                $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': previous });
                

            }, function(error) {
                console.error(error);
                throw error;
            });   
        }
        return promise;
    }

    function _patch(url,data,headers) {
        var params = _addApiGatewayApiKeys({});
        var promise = $http({
                method: 'PATCH',
                url: url,
                headers: headers,
                params: params,
                data: data
        });
        if (promise.then) {
            promise.then(function(response) {
                var previous = resourceDirectory[url];

                resourceDirectory[url] = response;
                //Is this really needed?? After the patch call, the entity data is already up to date. 
                // data = {};
                // _refresh(url, data, headers);

                $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': previous });

                
            }, function(error) {
                console.error(error);
                throw error;
            }); 
        } 
        return promise;
    }

    function _execute(url, data, params, headers, method) {
        var promise = $http({
                method: method,
                url: url,
                headers: headers,
                data: data,
                params: params
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[response.data._links.self.href] = response;
                $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response });

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
        'getFromResourceDirectory': _getFromResourceDirectory,

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
            var params = _addApiGatewayApiKeys({});
            var obj =   $http(
                {
                    method : 'GET',
                    url : urlBase,
                    headers : headers,
                    params: params
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
        growl.error('<b>Error:</b> Uh oh!');
        growl.info('Im  a info message');
        growl.warn('Im  a warn message');
        growl.success('Im  a success message');
    };
   
    screenname  = 'OmniChannel';
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
    }else{
        $rootScope.regionId = undefined;
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
    if($routeParams.screenId.indexOf('search') !== -1 || $routeParams.screenId.indexOf('dashboard')!== -1 ){
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

    $scope.getNamesList = function(viewValue, field){        
        if(field.typeahead){
            var url = '';
            var param = '';
            var vehicle_make = '';
            var vehicle_model = '';
            
            if (field.typeaheadField === 'referential_vehicle:make') {
                vehicle_make = field.typeaheadField + '=' + viewValue;
                param = vehicle_make;
                url = $rootScope.HostURL + 'referential_vehicle_makes?' + param;
            } else if (field.typeaheadField === 'referential_vehicle:model') {   
                vehicle_model = field.typeaheadField + '=' + viewValue;         
                var arrparent = $rootScope.metamodel[$rootScope.currName].sections; 
                for(var i = 0; i < arrparent.length; i++){
                    var arr = arrparent[i].elements;
                    for(var j = 0; j < arr.length; j++){
                        var object = arr[j];
                        if(object.name === field.enableWhen.expression.field){                            
                            if(object.typeaheadField !== undefined && object.typeaheadField !== null && object.typeaheadField !== ''){
                                vehicle_make = object.typeaheadField + '=' + $scope.data[field.enableWhen.expression.field] + '&';
                            }
                        }
                    }
                }               
                param =  vehicle_make + vehicle_model;
                url = $rootScope.HostURL + 'referential_vehicle_models?' + param;
            } else {
                url = $rootScope.HostURL + 'persons?' + field.typeaheadField + '=' + viewValue;
            }

            var regionToSORMap = $rootScope.regionToSoR;
            var applName = regionToSORMap[$rootScope.regionId];
            url = url.replace(':regionId',applName);
            resourceFactory.options(url, $rootScope.headers).success(function(responseData){
                var data = responseData.data || responseData;
                $rootScope.typeaheadData[field.typeaheadField] = [];
                $scope.typeaheadData[field.typeaheadField] = [];
                var items = convertToArray(data._links.item);
                angular.forEach(items, function(value){
                    if(value.summary[field.typeaheadField]){
                        $rootScope.typeaheadData[field.typeaheadField].push(value.summary[field.typeaheadField]);
                    }
                });
                $scope.typeaheadData[field.typeaheadField] = $rootScope.typeaheadData[field.typeaheadField];
            });
        }
    };

    $scope.checkEnable = function(field)
    {
        if(field.enableWhen)
        {
            return ($scope.data[field.enableWhen.expression.field] !== undefined && $scope.data[field.enableWhen.expression.field] !== null && $scope.data[field.enableWhen.expression.field] !== '') ? false : true;
        }
        return false;
    };

    function convertToArray(data) {
        if(data !== undefined && data.length === undefined){
            var array = [];
            array.push(data);
            return array;
        }
        return data;
    }

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

	// Dynamic Injection of Factory

    // function _injectfactory(){
    //     _clearFactory();

    //     $scope.factoryName = $scope.screenId + 'Factory';
    //     try {
           
    //         $scope.factory = $injector.get($scope.factoryName);
            
    //         Object.keys($scope.factory).forEach(function(method){
    //             $scope[method] = (function(operation) {
    //                 var operation = operation;
    //                 return function(params) {
    //                     return $scope.factory[operation]($scope, params);
    //                 };
    //             })(method);

    //         });
            

    //     } catch(e){
    //         console.log($scope.factoryName+' not found!');
    //     }
    // }

    // function _clearFactory(){
    //     if($scope.factoryName && $scope.factory){
    //         for (var operation in $scope.factory) {
    //             delete $scope[operation];
    //         }
    //     }
    // }
    
    
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
	        var resourcelist=$rootScope.metamodel[screenId].resourcelist;
            var url = $rootScope.HostURL + resourcelist;
            var regionToSORMap = $rootScope.regionToSoR;
            var applName = regionToSORMap[regionId];
            var newURL = url.replace(':regionId',applName);
            $rootScope.resourceHref =newURL;
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
            if ($scope.isValid()) {
            if(msg !== undefined){
                msg.destroy();    
            }
            if(tab === undefined){
                $rootScope.resourceHref = undefined;
            }
            if(actionURL !== undefined){
                $rootScope.navigate(actionURL);    
            }
            var nameTab;
            if(tab !== undefined && Array.isArray(tab)){
                nameTab = tab[0];
            }
            new Promise(function(resolve) {
                var optionFlag = false;
                $scope.patchFieldName = undefined;
                MetaModel.actionHandling(undefined, $scope, regionId, screenId, action, resourceFactory, nameTab, optionFlag, resolve);
            }).then(function(){
                if(tab !== undefined){
                        //var url=$rootScope.resourceHref + '/operations/tariff_calculation/execute';
                        resourceFactory.options($rootScope.resourceHref, $rootScope.headers).success(function(responseData){
                            var data = responseData.data || responseData;
                            var urlOperations = data._links[tab[1]].href;
                            resourceFactory.options(urlOperations, $rootScope.headers).success(function(responseData){
                                var data = responseData.data || responseData;
                                var urlCalculation;
                                var item = data._links.item;
                                if(Array.isArray(item)){
                                    // get first element of array
                                    urlCalculation = item[0].href;
                                } else {
                                    urlCalculation = item.href;
                                }
                                resourceFactory.options(urlCalculation, $rootScope.headers).success(function(responseData){
                                    var data = responseData.data || responseData;
                                    var urlExecute = data._links[tab[2]].href;
                                    var params = {};
                                    resourceFactory.post(urlExecute,params,$rootScope.headers).success(function(responseData){
                                        var data = responseData.data || responseData;
                                        var urlDetail;
                                        if(Array.isArray(data.messages)){
                                            // get last element of array
                                            urlDetail = data.messages[data.messages.length - 1].message[0];
                                        } else {
                                            urlDetail = data.messages.context;
                                        }
                                        resourceFactory.refresh(urlDetail,params,$rootScope.headers).success(function(responseData){
                                            var data = responseData.data || responseData;
                                            $scope.data = data;
                                            console.log('Compute successfully !!');
                                            // go to next tab to see premium
                                            $rootScope.step = $rootScope.step + 1;
                                            loadRelationshipByStep($rootScope.step);
                                            $scope.preStep = $rootScope.step;
                                            EnumerationService.executeEnumerationFromBackEnd(data, 'create');
                                        });
                                    }).error(function(err){

                                        // Show error message when Calculate Premium failed 
                                        var mess = '';
                                        if(err.Errors){
                                            var arrayErr = convertToArray(err.Errors);                                           
                                            mess = arrayErr.map(function(elem){
                                                return elem.Reason;
                                            }).join('\n');                                            
                                        } else{
                                            mess = $rootScope.locale.CALC_PREMIUM_OP_FAILED;                                                
                                        } 
                                        growl.error(mess); 
                                    });
                                });
                            });
                        });
                }else{
                    EnumerationService.loadEnumerationByTab();
                }
            });
        } }
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
        resourceFactory.getData(url).success(function(responseData){
            var data = responseData.data || responseData;
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
    
        loadRelationshipByStep($scope.preStep);
         if($rootScope.regionId === 'us') {
            $rootScope.currRel = 'itself';
        } 

        if($rootScope.screenId.indexOf('search') !== -1 ){
           EnumerationService.loadEnumerationByTab();
        }  
        // load data for tab click
        if($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself' && $scope.regionId !== 'us'){
            $scope.loadDataByTab($rootScope.currRel);
        } else if($rootScope.resourceHref !== undefined) {
            var params = {};
             resourceFactory.get($rootScope.resourceHref, params, $rootScope.headers).success(function(responseData){
                var data = responseData.data || responseData;
                if (data) {
                    $scope.data=data;
                    EnumerationService.executeEnumerationFromBackEnd(data, 'create');
                    if($rootScope.regionId === 'us'){
                        EnumerationService.executeEnumerationFromBackEnd(data, 'fetch');    
                    }
                }
            });            
        }
    });

    $scope.selecttab = function(step1, rel) {
        if ($scope.isValid()) {
            if(msg !== undefined){
                msg.destroy();    
            }
            $rootScope.step = step1;
            $rootScope.currRel = rel;
            
            loadRelationshipByStep($scope.preStep);
            $scope.preStep = $rootScope.step;
            loadRelationshipByStep($scope.preStep);            
            if ($rootScope.currRel !== 'undefined' && $rootScope.currRel !== 'itself') {
                    $scope.loadDataByTab($rootScope.currRel);
            } else {
                var params = {};
                resourceFactory.get($rootScope.resourceHref, params, $rootScope.headers).success(function(responseData){           
                var data = responseData.data || responseData;
                    if (data) {
                        $scope.data=data;
                        EnumerationService.executeEnumerationFromBackEnd(data, 'create');
                    }
                });                
            }

        }
    };

    $scope.patchField = function(fieldName){

        $scope.patchFieldName = fieldName;
        // not apply patch field for us
        if ($rootScope.regionId !== 'us') { 
            if($scope.isValidByField(fieldName)){
                MetaModel.actionHandling(undefined, $scope, $rootScope.regionId, $rootScope.screenId, 'update', resourceFactory, $rootScope.currRel, true);
            }
        }
    };


    $scope.loadDataByTab = function (tab) {

        var url = $rootScope.resourceHref;

        if (url !== undefined) {
            resourceFactory.options(url, $rootScope.headers).success(function(responseData){

                var data = responseData.data || responseData;
           
                //Fetch the links response
                if(data !== undefined && data._links !== undefined && data._links[tab] !== undefined){
                    var tabUrl = data._links[tab].href;

                    resourceFactory.options(tabUrl, $rootScope.headers).success(function(responseData){

                        var data = responseData.data || responseData;
           
                        var detailTabUrl = data._links.item.href;

                        var params = {};
                        resourceFactory.get(detailTabUrl, params, $rootScope.headers).success(function(responseData){

                             var data = responseData.data || responseData;
           
                            if (data) {
                                $scope.data=data;
                                EnumerationService.executeEnumerationFromBackEnd(data, 'update');
                            }
                        });                        
                    });    
                }
            });
        }

    };

    var msg;

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
           msg = growl.error(message);
            return false;
        }

        return true;
    };

    $scope.isValidByField = function(fieldName){
        var message = '';
        if($scope.isMandatoryField(fieldName)){
            if($scope.data[fieldName] !== undefined && $scope.data[fieldName] !== null){
                return true;
            }
            var label = $scope.translateKeyToLabelByTab(fieldName);
            message = $rootScope.locale[label] + $rootScope.locale.IS_REQD;
            growl.error(message);
            return false;
        }
        return true;
    };

    $scope.isMandatoryField = function(fieldName){
        var arrMandatoryField = $scope.loadmandatoryField();
        if($.inArray(fieldName, arrMandatoryField) !== -1){                    
            return true;
        }
        return false;
    }; 

    $scope.loadmandatoryField = function(){
        var mandatoryField = [];
        var arrparent;
        if($rootScope.currName)
        {
        arrparent = $rootScope.metamodel[$rootScope.currName].sections;
        }
        else
        {
        arrparent = $rootScope.metamodel[$rootScope.screenId].sections;
        }
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
         var arrparent;
        if($rootScope.currName){
        arrparent = $rootScope.metamodel[$rootScope.currName].sections;
        }
        else
        {
         arrparent = $rootScope.metamodel[$rootScope.screenId].sections;
        }
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

        $resource('vendors/OcInfra/client-infrastructure/dist/ocInfra/assets/resources/config/OCInfraConfig.json').get(function(data) { 

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
                resourceFactory.options(urlDetail, $rootScope.headers).success(function(responseData){
                    var data = responseData.data || responseData;
                    self.executeEnumerationFromBackEnd(data, 'update');
                });
            } else {
                resourceFactory.options($rootScope.resourceHref, $rootScope.headers).success(function(responseData1){
                    var data1 = responseData1.data || responseData1;

                    if(data1._links[$rootScope.currRel] !== undefined){
                        var url = data1._links[$rootScope.currRel].href;
                        resourceFactory.options(url, $rootScope.headers).success(function(responseData2){
                            var data2 = responseData2.data || responseData2;
                            var urlDetail = data2._links.item.href;
                            resourceFactory.options(urlDetail, $rootScope.headers).success(function(responseData){
                                var data = responseData.data || responseData;
                                self.executeEnumerationFromBackEnd(data, 'update');
                            });
                        });    
                    }
                });
            }
        } else if($rootScope.resourceHref !== undefined){
            resourceFactory.options($rootScope.resourceHref, $rootScope.headers).success(function(responseData){
                            var data = responseData.data || responseData;
               self.executeEnumerationFromBackEnd(data, 'search');
            });
        }
    };

    self.executeEnumerationFromBackEnd = function (data, action){        
        angular.forEach(data._options.links, function(value){
            if(value.rel === action){
                angular.forEach(value.schema.properties, function(value, key){
                    if(value.enum) {
                        processEnumeration($rootScope, value.enum, key);
                    }
                });
            }
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
    this.checkVisibleOnRowValue = function(field, row, $scope) {
        if (field.visibleWhen) {
            var response = evaluateRowExpression(field.visibleWhen.expression, row, $scope);
            return response;
        }    
        return true;
    };
    function evaluateRowExpression(expression, row, $scope) {
        var response = true;
        if (expression.operator) //Recursive case
        {
            if (expression.operator === 'AND') {
                angular.forEach(expression.conditions, function(val) {
                    if (response) {
                        response = response && evaluateRowExpression(val, row, $scope);
                    }
                });
            } else if (expression.operator === 'OR') {
                response = false;
                angular.forEach(expression.conditions, function(val) {
                    if (!response) {
                        response = response || evaluateRowExpression(val, row, $scope);
                    }
                });
            }
        } else //Base case
        {
            response = row.summary[expression.field] === expression.value;
        }
        
        return response;
    }

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

app.controller('TableController', ['$browser', '$scope', '$rootScope', 'TableMetaModel', 'MetaModel', 'resourceFactory', '$location', 'CheckVisibleService', function($browser, $scope, $rootScope, TableMetaModel, MetaModel, resourceFactory, $location, CheckVisibleService) {

    $scope.showResult = true;
    $scope.riskDataSet = [];
    $rootScope.rowCollection = {};

    $scope.loadTableMetadata = function() {
        TableMetaModel.load($scope.field.name, function(tableMetaData) {
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
    $scope.checkShowRow = function(opt,row) {
        if (opt.visibleWhen) {
            return CheckVisibleService.checkVisibleOnRowValue(opt, row, $scope);
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
        
        if (url !== undefined) {
            $rootScope.navigate(url);
            MetaModel.setAction(action);
        } else{
        MetaModel.actionHandling(item, $scope, regionId, screenId, action, resourceFactory,undefined, optionFlag); 
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

