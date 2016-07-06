'use strict';

/*
global angular
*/

angular.module('omnichannel').directive('tableRender', function(MetaModel, $resource, $location, $injector, $rootScope, resourceFactory){
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
					(params.url in $scope.resultSet)) {

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

		},
		link : function (/*$scope*/) {
		},
		templateUrl: $rootScope.templatesURL + 'table.html'
	};
});