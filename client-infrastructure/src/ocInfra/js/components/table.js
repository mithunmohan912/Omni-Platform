'use strict';

/*
global angular
*/

angular.module('omnichannel').directive('tableRender', function(MetaModel, $resource, $location, $injector, $rootScope, resourceFactory, stConfig){
	return {
		restrict: 'E',
		replace: 'true',
		scope: {
			metamodel: '=',
			resourceUrl: '=',
			factoryName: '='
		},
		controller: function($scope){
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
					(params.previous && params.previous.data && params.previous.data._links && params.previous.data._links.up && params.previous.data._links.up.href === $scope.resourceUrl) || 
					(params.response.data._links && params.response.data._links.up && params.response.data._links.up.href === $scope.resourceUrl) ||
					($scope.resultSet && params.url in $scope.resultSet)) {

					$scope.previousTable = [];
					if($scope.table){
						$scope.previousTable = $scope.table.items;
					}

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
					$scope.previousTable = [];
					if($scope.table){
						$scope.previousTable = $scope.table.items;
					}

					$scope.inProgress = true;
					MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, {}, null, true).then(function(resultSet) {
						$scope.resultSet = resultSet;
						$scope.inProgress = false;
					});
				}
			});

			$scope.$on('getBlock', function(event, params) {
				if (!_.isEmpty(params)){
	                var existingItems = resourceFactory.getFromResourceDirectory($scope.resourceUrl);
	                if(!_.isEmpty(existingItems.data._links)) {
	                    switch (params) {
	                      case 'prev': 
	                           $scope.resourceUrl = existingItems.data._links.prev.href;
	                           break; 
	                      default: 
	                           $scope.resourceUrl=existingItems.data._links.next.href;
	                    }
	                    if(!_.isEmpty($scope.resourceUrl)){
	                       MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);
	                    }
	                }
              	}
			});

			$scope.$on('initPagination', function() {
				_initBlockButtons();
			});

			function _initBlockButtons(){
				var items = resourceFactory.getFromResourceDirectory($scope.resourceUrl);
				if(!_.isEmpty(items.data._links)) {
					if (!items.data._links.prev){
						$scope.$broadcast('disableGetBlock', {link: 'prev', value: true});
					}else{
						$scope.$broadcast('disableGetBlock', {link: 'prev', value: false});
					}
					if(!items.data._links.next){
						$scope.$broadcast('disableGetBlock', {link: 'next', value: true});
					}else{
						$scope.$broadcast('disableGetBlock', {link: 'next', value: false});
					}	
				}
			}

			function _init(metamodelObject){
				$scope.resultSet = {};
				$scope.itemSelected = {};


			
				if(!metamodelObject.itemsByPage){
					metamodelObject.itemsByPage = $rootScope.config.itemsByPage ? $rootScope.config.itemsByPage : stConfig.pagination.itemsByPage;
				}

				$scope.metamodelObject = metamodelObject;
				stConfig.pagination.template = $rootScope.templatesURL + 'stpaging.html';

				$scope.resourceUrl = $scope.resourceUrl || $scope.metamodelObject.resourceUrl;
				MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);

				$scope.$watchCollection('resultSet', function(newValue){
					if(newValue && newValue[$scope.resourceUrl]) {
						$scope.table = angular.copy(newValue[$scope.resourceUrl]);
						$scope.table.items = [];
						// Reset the collection that is bound to the table
						$scope.groupedTable = {};

						newValue[$scope.resourceUrl].items.forEach(function(item){

							var oldItem;
							if($scope && $scope.previousTable){
								$scope.previousTable.forEach(function(obj){
									if(obj.href === item.href){
										oldItem = obj;
									}
								});
							}

							if ($scope.metamodelObject.filters) {
								_isFiltered(item).then(function(filtered) {
					                if (!filtered) {
					                	_addItem(newValue, item, oldItem);
					                }
					            });
							} else {
								_addItem(newValue, item, oldItem);
							} 
							
						});
					}

					//buttons
					_getButtonsFromOptions();
					//Enable/Disable next/prev Item blocks
					_initBlockButtons();
				});
				
				$scope.factoryName = metamodelObject.factoryName || $scope.factoryName ;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(e) {
					console.log($scope.factoryName + ' not found');
				}


				
			}


			function _addItem(newValue, item, oldItem) {
				var newItem = angular.copy(newValue[item.href]);
              	var newValueItem = _getResultSetItem(newValue, newItem);
              	$scope.itemResourcesToBind = { properties : {} };

              	for(var resource in newValueItem) {
                	$scope.itemResourcesToBind[newValueItem[resource].identifier] = newValueItem[resource];
              	}

              	// Process previous properties to keep ui input values
              	if(oldItem){
	              	for(var property in oldItem.properties){
	              		if(oldItem.properties[property].metainfo && oldItem.properties[property].metainfo.uiInput){
	              			$scope.itemResourcesToBind[newValueItem[resource].identifier].properties[property] = oldItem.properties[property];
	              		}
	              	}
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
              		// If we have groupBy property we will be grouping the table items, so we need to save the property to the bound properties
              		if($scope.metamodelObject.groupBy){
              			$scope.itemResourcesToBind.properties[$scope.metamodelObject.groupBy] = newItem.properties[$scope.metamodelObject.groupBy];
              		}
                	newItem.properties = $scope.itemResourcesToBind.properties;
              	}
              	if (newItem) {
              		/*
						The table component will behave always as a grouped table. In case there is no groupBy filter specified, items will go to the
						default group (which name should never appear as a property within the item properties). Then in the table template we iterate
						over the groups using the value of the property used for grouping to display a title for the group (default group does not print a title).
              		*/
              		if($scope.metamodelObject.groupBy){
              			$scope.groupedTable[newItem.properties[$scope.metamodelObject.groupBy].value] = $scope.groupedTable[newItem.properties[$scope.metamodelObject.groupBy].value] || {};
              			$scope.groupedTable[newItem.properties[$scope.metamodelObject.groupBy].value][newItem.identifier] = newItem;
              		} else {
              			$scope.groupedTable.infra_default_group_table = $scope.groupedTable.infra_default_group_table || {};
              			$scope.groupedTable.infra_default_group_table[newItem.identifier] = newItem;
              		}
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

		    function _createButtonFromOptions(label, params, creatable) {
		    	var button = {};
		    	button.label = label;
		    	button.action =  { 
		    		value: 'add', 
		    		buttonAction: true, 
		    		params: params 
		    	};
		    	button.creatable = creatable !== undefined? creatable : true;
		    	return button;
		    }

			function _getButtonsFromOptions() {
				$scope.buttons = [];

				if ($scope.metamodelObject.buttons) {
					var label = $scope.metamodelObject.buttons.label;
					var values = $scope.metamodelObject.buttons.values;

					if (label) {
						$scope.buttons.push(_createButtonFromOptions(label, {}));
					} else {
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
												//if there is a list of possible values
												if (values) {
													values.forEach(function(value) {
														var creatable = property.enum.indexOf(value) !== -1;
														label = 'ADD_'+value.toUpperCase().trim();
														params = {};
														params[required] = value;
														$scope.buttons.push(_createButtonFromOptions(label, params, creatable));
													});

												} else {
													property.enum.forEach(function(value) {
														label = 'ADD_'+value.toUpperCase().trim();
														params = {};
														params[required] = value;
														$scope.buttons.push(_createButtonFromOptions(label, params));
													});
												}
											}
										}
									}
								}
							});
						});
					}
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

			$scope.isValidStatus = false;
				
			$scope.$on('isValidStatus', function(event, params) {
				$scope.isValidStatus = !params?false:true;
			});


			

			$scope.edit = function(itemSelected, callback) {
				$scope.itemSelected = itemSelected;
				//Bootstrap takes care of openin a pop up
				if (callback) {
					if ($scope.actionFactory[callback]) {
						$scope.actionFactory[callback](itemSelected,$scope);
					}
				}
			};

	 		$scope.delete = function(itemSelected, callback) {
				$scope.itemSelected = itemSelected;
				//Bootstrap takes care of openin a pop up
				if (callback) {
					if ($scope.actionFactory[callback]) {
						$scope.actionFactory[callback](itemSelected,$scope);
					}
				}
			};


    $scope.checkShowItemRow = function(action, displayedItem) {
        if (action.visibleWhen) {
            return $scope.checkVisibleOnItemRowValue(action, displayedItem, $scope);
        }
        return true;
    };
    $scope.checkVisibleOnItemRowValue = function(action, displayedItem, $scope) {
        if (action.visibleWhen) {
            var response = evaluateItemRowExpression(action.visibleWhen.expression, displayedItem, $scope);
            return response;
        }    
        return true;
    };
    function evaluateItemRowExpression(expression, row, $scope) {
        var response = true;
        if (expression.operator) //Recursive case
        {
            if (expression.operator === 'AND') {
                angular.forEach(expression.conditions, function(val) {
                    if (response) {
                        response = response && evaluateItemRowExpression(val, row, $scope);
                    }
                });
            } else if (expression.operator === 'OR') {
                response = false;
                angular.forEach(expression.conditions, function(val) {
                    if (!response) {
                        response = response || evaluateItemRowExpression(val, row, $scope);
                    }
                });
            }
        } else //Base case
        {
        	var id= row.href;
            var val= expression.field;
            response = $scope.resultSet[id].properties[val].value === expression.value;
        }
        return response;
    }
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

		},
		link : function (/*$scope*/) {
		},
		templateUrl: $rootScope.templatesURL + 'table.html'
	};
});
angular.module('omnichannel').directive('staticTableRender', function(MetaModel, $resource, $location, $injector, $rootScope, resourceFactory, stConfig){
	return {
		restrict: 'E',
		replace: 'true',
		scope: {
			metamodel: '=',
			resourceUrl: '=',
			factoryName: '='
		},
		controller: function($scope){
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
					$scope.previousTable = [];
					if($scope.table){
						$scope.previousTable = $scope.table.items;
					}
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
					$scope.previousTable = [];
					if($scope.table){
						$scope.previousTable = $scope.table.items;
					}
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
				stConfig.pagination.template = $rootScope.templatesURL + 'stpaging.html';

				$scope.resourceUrl = $scope.resourceUrl || $scope.metamodelObject.resourceUrl;
				MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);
				$scope.$watchCollection('resultSet', function(newValue){
					if(newValue && newValue[$scope.resourceUrl]) {
						$scope.table = angular.copy(newValue[$scope.resourceUrl]);
						$scope.table.items = [];
						// Reset the collection that is bound to the table
						$scope.groupedTable = {};
						newValue[$scope.resourceUrl].items.forEach(function(item){
							var oldItem;
							if($scope && $scope.previousTable){
								$scope.previousTable.forEach(function(obj){
									if(obj.href === item.href){
										oldItem = obj;
									}
								});
							}
							if ($scope.metamodelObject.filters) {
								_isFiltered(item).then(function(filtered) {
					                if (!filtered) {
					                	_addItem(newValue, item, oldItem);
					                }
					            });
							} else {
								_addItem(newValue, item, oldItem);
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
			function _addItem(newValue, item, oldItem) {
				var newItem = angular.copy(newValue[item.href]);
              	var newValueItem = _getResultSetItem(newValue, newItem);
              	$scope.itemResourcesToBind = { properties : {} };
              	for(var resource in newValueItem) {
                	$scope.itemResourcesToBind[newValueItem[resource].identifier] = newValueItem[resource];
              	}
              	// Process previous properties to keep ui input values
              	if(oldItem){
	              	for(var property in oldItem.properties){
	              		if(oldItem.properties[property].metainfo && oldItem.properties[property].metainfo.uiInput){
	              			$scope.itemResourcesToBind[newValueItem[resource].identifier].properties[property] = oldItem.properties[property];
	              		}
	              	}
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
              		// If we have groupBy property we will be grouping the table items, so we need to save the property to the bound properties
              		if($scope.metamodelObject.groupBy){
              			$scope.itemResourcesToBind.properties[$scope.metamodelObject.groupBy] = newItem.properties[$scope.metamodelObject.groupBy];
              		}
                	newItem.properties = $scope.itemResourcesToBind.properties;
              	}
              	if (newItem) {
              		/*
						The table component will behave always as a grouped table. In case there is no groupBy filter specified, items will go to the
						default group (which name should never appear as a property within the item properties). Then in the table template we iterate
						over the groups using the value of the property used for grouping to display a title for the group (default group does not print a title).
              		*/
              		if($scope.metamodelObject.groupBy){
              			$scope.groupedTable[newItem.properties[$scope.metamodelObject.groupBy].value] = $scope.groupedTable[newItem.properties[$scope.metamodelObject.groupBy].value] || {};
              			$scope.groupedTable[newItem.properties[$scope.metamodelObject.groupBy].value][newItem.identifier] = newItem;
              		} else {
              			$scope.groupedTable.infra_default_group_table = $scope.groupedTable.infra_default_group_table || {};
              			$scope.groupedTable.infra_default_group_table[newItem.identifier] = newItem;
              		}
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
		    function _createButtonFromOptions(label, params, creatable) {
		    	var button = {};
		    	button.label = label;
		    	button.action =  { 
		    		value: 'add', 
		    		buttonAction: true, 
		    		params: params 
		    	};
		    	button.creatable = creatable !== undefined? creatable : true;
		    	return button;
		    }
			function _getButtonsFromOptions() {
				$scope.buttons = [];
				if ($scope.metamodelObject.buttons) {
					var label = $scope.metamodelObject.buttons.label;
					var values = $scope.metamodelObject.buttons.values;
					if (label) {
						$scope.buttons.push(_createButtonFromOptions(label, {}));
					} else {
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
												//if there is a list of possible values
												if (values) {
													values.forEach(function(value) {
														var creatable = property.enum.indexOf(value) !== -1;
														label = 'ADD_'+value.toUpperCase().trim();
														params = {};
														params[required] = value;
														$scope.buttons.push(_createButtonFromOptions(label, params, creatable));
													});
												} else {
													property.enum.forEach(function(value) {
														label = 'ADD_'+value.toUpperCase().trim();
														params = {};
														params[required] = value;
														$scope.buttons.push(_createButtonFromOptions(label, params));
													});
												}
											}
										}
									}
								}
							});
						});
					}
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
			$scope.move = function(url) {
				$location.path(url);
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
	 		$scope.delete = function(itemSelected, callback) {
	 			$scope.itemSelected = itemSelected;
				//Bootstrap takes care of openin a pop up
				if (callback) {
					if ($scope.actionFactory[callback]) {
						$scope.actionFactory[callback](itemSelected);
					}
				}
	 		};
    $scope.checkShowItemRow = function(action, displayedItem) {
        if (action.visibleWhen) {
            return $scope.checkVisibleOnItemRowValue(action, displayedItem, $scope);
        }
        return true;
    };
    $scope.checkVisibleOnItemRowValue = function(action, displayedItem, $scope) {
        if (action.visibleWhen) {
            var response = evaluateItemRowExpression(action.visibleWhen.expression, displayedItem, $scope);
            return response;
        }    
        return true;
    };
    function evaluateItemRowExpression(expression, row, $scope) {
        var response = true;
        if (expression.operator) //Recursive case
        {
            if (expression.operator === 'AND') {
                angular.forEach(expression.conditions, function(val) {
                    if (response) {
                        response = response && evaluateItemRowExpression(val, row, $scope);
                    }
                });
            } else if (expression.operator === 'OR') {
                response = false;
                angular.forEach(expression.conditions, function(val) {
                    if (!response) {
                        response = response || evaluateItemRowExpression(val, row, $scope);
                    }
                });
            }
        } else //Base case
        {
        	var id= row.href;
            var val= expression.field;
            response = $scope.resultSet[id].properties[val].value === expression.value;
        }
        return response;
    }
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
		},
		link : function (/*$scope*/) {
		},
		templateUrl: $rootScope.templatesURL + 'statictable.html'
	};
});

/*
	Directive to group the elements of the smart table used within the table component. Some points to keep in mind:
		- Attribute st-safe-src of the smart table should be an array. If you pass an object, then st-table attribute will get an array wrapping that object.
		- Elements within st-table collection will not point to the same elements inside st-safe-src. I suppose the smart table is copying them not pointing
		to the same elements.
		- We iterate over the $scope.groupedTable to get every group.
		- Finally we iterate over the st-table and we filter it to get the same items that we have in our groups. If we don't use the same objects contained
		within the st-table collection... pagination will not work.
	Warning: This filter directive is tighly coupled to the resource representation of backend resources since it uses the 'identifier' property which is
	created when parsing the responses inside the MetaData factory's prepareToRender method.
*/
angular.module('omnichannel').filter('infraGroupBy', function(){
	return function(collection, alreadyGrouped){
		if(collection && alreadyGrouped){

			var result = [];

			collection.forEach(function(elem){
				if(elem.identifier in alreadyGrouped){
					result.push(elem);
				}
			});

			return result;
		}
	};
});

