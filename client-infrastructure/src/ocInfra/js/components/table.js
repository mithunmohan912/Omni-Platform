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

			/*$scope.$watch('metamodel', function(newValue){
				if(newValue){
					var metamodelObject = $rootScope.metamodel? $rootScope.metamodel[newValue]: null;
					if (!metamodelObject) {
						MetaModel.load($rootScope, $rootScope.regionId, newValue, function(data) {
							_init(data);
						});
					} else {
						_init(metamodelObject);
					}
				}
			});*/

			$scope.$on('resourceDirectory', function(event, params) {
				for (var resource in $scope.resultSet) {
					if (params.url === resource) {
						if (params.response.config.method === 'DELETE' || params.response.config.method === 'PATCH') {
							if (params.response.config.method === 'DELETE') {
								delete $scope.resultSet[params.url];
							}
							//refresh collection and items
							MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet, null, true);
						} else {
							//refresh items
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
						$scope.modalMetamodelObject = metamodelObject;
					}
                }

				$scope.resourceUrl = $scope.resourceUrl || $scope.metamodelObject.resourceUrl;
				MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);

				$scope.$watchCollection('resultSet', function(newValue){
					if(newValue && newValue[$scope.resourceUrl]) {
						$scope.items = [];
						newValue[$scope.resourceUrl].items.forEach(function(item){
							$scope.items.push(newValue[item.href]);
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

			$scope.execute = function(action, displayedItem, field) {
				if(!action.method){
					if($scope.metamodelObject.buttonMethod && action.buttonAction){
						$scope.actionFactory[$scope.metamodelObject.buttonMethod](displayedItem, field);
					} else {
						$scope[action.value](displayedItem, field);
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
					resourceFactory.patch(displayedItem.href, payload).then(function() {
						//refresh collection and items
						//MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet, null, true);
					});
					
	 			}
	 		};

	 		$scope.delete = function(displayedItem) {
	 			if (displayedItem.deletable) {
	 				//delete resource
	 				resourceFactory.delete(displayedItem.href).then(function() {
						//refresh collection and items
						//MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet, null, true);
	 				});
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

				 				//refresh only the collection
				 				resourceFactory.refresh($scope.resourceUrl).then(function(/*response*/) {
				 					//MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);
				 				});

				 			});
	 					}
	 				});
	 			});
	 		};

		},
		link : function (/*$scope*/) {
		},
		templateUrl: 'src/ocInfra/templates/components/table.html'
	};
});