'use strict';

/*
	global angular
*/

angular.module('omnichannel').directive('tableRender', function(MetaModel, $resource, $location, $injector){
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
						_init(data.tableMetaModel);
			        });
				}
			});

			function _init(metamodelObject){
				$scope.resultSet = {};
				$scope.metamodelObject = metamodelObject;

				$scope.resourceUrl = $scope.resourceUrl || metamodelObject.resourceUrl;

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
				try {
					$scope.actionFactory = $injector.get($scope.screenFactoryName);
				} catch(e) {
					console.log($scope.screenFactoryName + "not found");
				}
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
});