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

			$scope.$on('resourceDirectory', function(event, params) {
				if ((params.previous && params.previous.data && params.previous.data._links.up.href === $scope.resourceUrl) || 
					params.response.data._links.up.href === $scope.resourceUrl) {
					if (params.response.config.method == 'DELETE' || params.response.config.method == 'PATCH' || params.response.config.method == 'POST') {
						//refresh collection and items
						$scope.inProgress = true;
						MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, {}, null, true).then(function(resultSet){
							$scope.resultSet = resultSet;
							$scope.inProgress = false;
						});
					} else {
						//refresh items
						if (!$scope.inProgress) {
							MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);
						}
					}
				}
			});

			$scope.$on('refreshTable', function(event, params) {
				if (params.name === $scope.metamodelObject.name) {
					MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet, null, true);
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
						$scope.items = [];
						newValue[$scope.resourceUrl].items.forEach(function(item){
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
								$scope.items.push(newItem);
							}
						});
					}
				});
				
				$scope.factoryName = $scope.factoryName || metamodelObject.factoryName;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(e) {
					console.log($scope.factoryName + ' not found');
				}
			}

			function _isInput(type) {
				return type !== "status" && type !== "icon" && type !== "literal" && type !== "blank" && type !== "actions";
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

			$scope.execute = function(action, displayedItem, field) {
				if(!action.method){
					if($scope.metamodelObject.buttonMethod && action.buttonAction){
						$scope.actionFactory[$scope.metamodelObject.buttonMethod](displayedItem, field);
					} else {
						if (field && field.method) {
							$scope.actionFactory[field.method](displayedItem, field);
						} else {
							$scope[action.value](displayedItem, field);
						}
					}
				} else {
					$scope.actionFactory[action.method](displayedItem, field);
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
			 						if (properties[property.id]){
			 							status = status && properties[property.id].consistent;
			 						}
				 				});
							}
						});
		               
					}
 				}
				return status;
			};

			$scope.edit = function(itemSelected) {
				$scope.itemSelected = itemSelected;
				//Bootstrap takes care of openin a pop up
			};

 			$scope.update = function(displayedItem, field) {
				if(displayedItem.patchable){
					var payload = {};
 					payload[field.id] = displayedItem.properties[field.id].value;
					//patch resource
					resourceFactory.patch(displayedItem.href, payload);
	 			}
	 		};

	 		$scope.delete = function(displayedItem) {
	 			if (displayedItem.deletable) {
	 				//delete resource
	 				resourceFactory.delete(displayedItem.href);
	 			}
	 		};

	 		$scope.add = function() {
	 			resourceFactory.get($scope.resourceUrl).then(function(response) {
	 				response.data._options.links.forEach(function(link) {
	 					if (link.rel === 'create') {
	 						var hrefToPost = link.href;
	 						resourceFactory.post(hrefToPost, {}, $rootScope.headers).then(function(response) {
				 				//select the new resource
				 				var href = response.data._links.self.href;
				 				$scope.edit({href: href});
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