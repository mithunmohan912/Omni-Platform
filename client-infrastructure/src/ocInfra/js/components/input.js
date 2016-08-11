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
app.directive('inputRender', function($compile, $http, $rootScope, $templateCache, uibButtonConfig, $injector, $location, $timeout, resourceFactory){

	function _backendToFrontendType(typeObject){
		switch(typeObject.type){
			case 'integer':
			case 'number':
				if(!typeObject.enum){
					return 'number';
				}
				break;
			case 'boolean':
				return 'toggle';
			case 'string':
				if(!typeObject.enum){
					return 'text';
				}
				break;
			default:
				break;
		}


		switch(typeObject.format){
			case 'uri':
			case 'time':
				return 'text';
			case 'date':
				return 'date';
			default:
				break;
		}

		return typeObject.enum ? 'select' : 'text';
	}

	function _getValueForUiInput($scope){
		if($scope.metamodel.value){
			return $scope.metamodel.value;
		} else if($scope.metamodel.init){
			if($scope.actionFactory && $scope.actionFactory[$scope.metamodel.init]){
				return $scope.actionFactory[$scope.metamodel.init]();
			} else if(_searchInParents($scope, $scope.metamodel.init)){
				return _searchInParents($scope, $scope.metamodel.init)();
			}
		} else {
			return undefined;
		}
	}

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

    function _prepareColspanAndOffset(element){
    	var colspan = {
    		xs: {},
    		sm: {},
    		md: {},
    		lg: {}
    	};

    	var offset = {
    		xs: 0,
    		sm: 0,
    		md: 0,
    		lg: 0
    	};

    	if(element.inputColspan && !(element.inputColspan instanceof Object)){
    		var initialColspan = element.inputColspan;
    		element.inputColspan = {
    			xs: initialColspan,
    			sm: initialColspan,
    			md: initialColspan,
    			lg: initialColspan
    		};
    	}

    	if(element.inputOffset && !(element.inputOffset instanceof Object)){
    		var initialOffset = element.inputOffset;
    		element.inputOffset = {
    			xs: initialOffset,
    			sm: initialOffset,
    			md: initialOffset,
    			lg: initialOffset
    		};
    	}


    	colspan.xs.input = (!element.inputColspan) ? ((element.label) ? 8 : 12) : element.inputColspan.xs;
    	colspan.xs.label = 12 - colspan.xs.input;
    	colspan.sm.input = (!element.inputColspan) ? ((element.label) ? 8 : 12) : element.inputColspan.sm;
    	colspan.sm.label = 12 - colspan.sm.input;
    	colspan.md.input = (!element.inputColspan) ? ((element.label) ? 8 : 12) : element.inputColspan.md;
    	colspan.md.label = 12 - colspan.md.input;
    	colspan.lg.input = (!element.inputColspan) ? ((element.label) ? 8 : 12) : element.inputColspan.lg;
    	colspan.lg.label = 12 - colspan.lg.input;

    	offset.xs = element.inputOffset.xs || 0;
    	offset.sm = element.inputOffset.sm || 0;
    	offset.md = element.inputOffset.md || 0;
    	offset.lg = element.inputOffset.lg || 0;

    	element.inputColspan = colspan;
    	element.inputOffset = offset;
    }

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
		controller: function($scope){
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
						var enumeration = {};
						var data = null;
						if(field.options.getData){
							data = field.options.getData( {'id': id, 'property': field.property, '$injector': $injector} );
							if(Array.isArray(data)){
								data.forEach(function(item){
									enumeration[item] = item;
								});
							} else {
								enumeration = data;
							}

							return enumeration;
						} else {
							//console.warn('input.js -> select_getData(): No getData method for select input.');
							if(Array.isArray(field.attributes.enum)){
								field.attributes.enum.forEach(function(item){
									enumeration[item] = item;
								});
							}

							return enumeration;
						}
					}
				},
				'updateMode': 'change'
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
				'options': {
					'true_label': true,
					'false_label': false
				},
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
									payload[property] = ($scope.resources[property].value !== undefined) ? $scope.resources[property].value : null;
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

				if(!$scope.property && $scope.resources && $scope.metamodel.uiInput){
					console.log('input.js -> load(): Property "' + $scope.metamodel.id + '" not found. Creating it...');
					$scope.resources[$scope.metamodel.id] = {'required': $scope.metamodel.required || false, 'editable': true, 'metainfo':{ 'uiInput': true }, value: _getValueForUiInput($scope) };
					$scope.property = $scope.resources[$scope.metamodel.id];
					if (!$scope.metamodel.value && $scope.actionFactory[$scope.metamodel.init]){
						$scope.property.value = $scope.actionFactory[$scope.metamodel.init]($scope);
					}
				}

				// Get the url of the template we will use based on input type
				var inputType = $scope.metamodel.type || _backendToFrontendType($scope.property.metainfo) || $scope.property.metainfo.type;
				//var baseUrl = (!$scope.baseUrl || $scope.baseUrl == '') ? 'src/ocInfra/templates/components' : $scope.baseUrl;

				$scope.baseUrl = $scope.baseUrl || $rootScope.templatesURL;
				$scope.inputHtmlUrl = $scope.baseUrl + 'input-' + inputType + '.html';

				// Update mode: blur or change. In some cases (toggle and checkbox we need to trigger the update callback on change and not on blur)
				$scope.updateMode = ((!$scope.updateMode || $scope.updateMode === '') && defaults[inputType]) ? defaults[inputType].updateMode : $scope.updateMode;
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
					'position':$scope.metamodel.position,
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
					'format': $scope.metamodel.format || (defaults[inputType]) ? defaults[inputType].format : undefined,
					'tooltip': $scope.metamodel.tooltip,	// Check for backend values. It may be that the backend give us this value already translated??
					'inputColspan': ($scope.metamodel.attributes && $scope.metamodel.attributes.colspan) ? $scope.metamodel.attributes.colspan : 8,
					'inputOffset': ($scope.metamodel.attributes && $scope.metamodel.attributes.offset) ? $scope.metamodel.attributes.offset : 0
				};

				_prepareColspanAndOffset($scope.field);


				// Union of ui attributes and backend attributes. First the default values, then we put the backend metadatas and finally the UI metadatas
				var attributes = (inputType === 'toggle' && $scope.metamodel.attributes) ? $scope.metamodel.attributes : (defaults[inputType]) ? angular.copy(defaults[inputType].attributes) : {};
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
				var options = (defaults[inputType]) ? angular.copy(defaults[inputType].options) : {};
				$scope.field.options = options;

				for(var options_key in $scope.metamodel.options){
					// Avoid override of default methods (they start with underscore)
					var validKey = options_key;
					do{
						validKey = validKey.indexOf('_') === 0 ? validKey.substring(1) : validKey;
					}while(validKey.indexOf('_') === 0);
					
					// Get the action for the options from the factory of the current screen
					if(inputType !== 'toggle'){
						$scope.field.options[validKey] = $scope.actionFactory[$scope.metamodel.options[options_key]] || _searchInParents($scope, $scope.metamodel.options[options_key]) || $scope.metamodel.options[options_key]; 
					} else {
						$scope.field.options[validKey] = $scope.metamodel.options[validKey] || (defaults[inputType]) ? defaults[inputType].options[validKey] : undefined;						
					}

					/*if (validKey === 'getData') {
						$scope.field.options[validKey] = $scope.actionFactory[$scope.metamodel.options[key]];
					} else {
						$scope.field.options[validKey] = $scope.metamodel.options[key];
					}*/
				}

				if(inputType === 'toggle'){
					$scope.field.colspan.toggles = 12/Object.keys($scope.field.options).length;
				}

			};

			/* Watchers to react to changes in the property */
			$scope.$watchGroup(['property', 'metamodel'], function(newValue){
				if((newValue[0] && newValue[1]) || (newValue[0] === undefined && newValue[1] && newValue[1].uiInput)){
					$scope.load();
				}
			});
		},
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
});
