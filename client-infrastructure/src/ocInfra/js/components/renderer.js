'use strict';

/*
	global angular
*/

angular.module('omnichannel').directive('renderer', function(MetaModel, $resource, $rootScope/*$filter, $resource, MetaModel, resourceFactory*/){

	return {
		restrict: 'E',
		scope: {
			metamodel: '=',
			resourceUrl: '='
		},
		link: function($scope){
			$scope.$watch('metamodel', function(newValue, oldValue){
				if(newValue){
					var path = 'assets/resources/metamodel/'+ newValue + '.json';
					$resource(path).get(function(data) {
						_init(data.metamodel);
			        });
				}
			});

			function _init(metamodelObject){
				$scope.metamodelObject = metamodelObject;
				$scope.resultSet = {};

				$scope.resourceUrl = $scope.resourceUrl || metamodelObject.resourceUrl || $rootScope.resourceUrl;

				if(!$scope.resourceUrl){
					return;
				}

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
});