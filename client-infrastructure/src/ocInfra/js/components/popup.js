'use strict';

/*
global app
*/

app.directive('popupRender',  function(MetaModel, $resource, $rootScope, $location, $injector){

return {
		restrict: 'E',
		scope: {
			uiId: '@',
			metamodel: '=',
			resourceUrl: '=',
			factoryName: '='
		},

		controller: function($scope){

			$scope.popup = {
				'id': $scope.uiId || '_popup' + Math.floor(Math.random()*1000000000000),
				'labels': {},
				'actions': {}
			};
			
			$scope.resultSet = {};

			$scope.screenFactoryName = $location.path().split('/screen/')[1].split('/')[0] + 'Factory';
			try {
				$scope.actionFactory = $injector.get($scope.screenFactoryName);
			} catch(e) {
				console.log($scope.screenFactoryName + 'not found');
			}

			var metamodelObject = $rootScope.metamodel? $rootScope.metamodel[$scope.metamodel]: null;
			if (!metamodelObject) {
				MetaModel.load($rootScope, $rootScope.regionId, $scope.metamodel, function(data) {
					_init(data);
				});
			} else {
				_init(metamodelObject);
			}

			/*$scope.$watch('metamodel', function(newValue, oldValue){

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
			});
	*/
			$scope.$watch('resourceUrl', function(newValue){
				$scope.resourceUrl = newValue;
				_getTitle();

			});

			$scope.$watchCollection('resultSet', function(newValue){
				//This should always get the data from ResourceDirectory and not calling the API
					if(newValue[$scope.resourceUrl] && newValue[$scope.resourceUrl].properties){
						var typeValue = newValue[$scope.resourceUrl].properties[$scope.metamodelObject.type] ? newValue[$scope.resourceUrl].properties[$scope.metamodelObject.type].value : '';
						$scope.popup.labels.title = typeValue.toUpperCase() + '_' + $scope.popup.labels.title;
						$scope.entityToBind = newValue[$scope.resourceUrl];
					}

			});



			function _defaultSave(){
				$scope.$broadcast('patch_renderer', { resourceUrl: $scope.resourceUrl });
			}

			function _defaultClose() {
			}

			function _defaultReset() {
				if ($scope.metamodelObject.actions.reset.links){
					$scope.$broadcast('reset_renderer', { resourceUrl: $scope.resourceUrl, links: $scope.metamodelObject.actions.reset.links });
				}
			}
			
			function _init(metamodelObject){
				$scope.metamodelObject = metamodelObject;
				// Default labels and actions
				_initLabels();
				_initActions();
			}	


			function _initLabels(){
				$scope.popup.labels.title = '_POPUP_TITLE';
				$scope.popup.labels.ok = '_SAVE';
				$scope.popup.labels.close = '_CLOSE';
				$scope.popup.labels.reset = '_RESET';
				$scope.popup.actions._ok = _defaultSave;
				$scope.popup.actions._close =_defaultClose;
				$scope.popup.actions._reset =_defaultReset;


				// User defined labels and actions
				if($scope.metamodelObject.labels){
					$scope.popup.labels.title =  _getTitle();
					$scope.popup.labels.ok = $scope.metamodelObject.labels.ok || $scope.popup.labels.ok;
					$scope.popup.labels.close = $scope.metamodelObject.labels.close || $scope.popup.labels.close;
					$scope.popup.labels.cancel = $scope.metamodelObject.labels.cancel || $scope.popup.labels.cancel;
					$scope.popup.labels.reset = $scope.metamodelObject.labels.reset || $scope.popup.labels.reset;
				}

			}

			function _initActions(){

				if($scope.metamodelObject.actions){
					// $scope.popup.actions._ok = $scope.metamodelObject.actions.ok.method ? $scope.metamodelObject.actions.ok: $scope.popup.actions._ok;
					// $scope.popup.actions._close = $scope.metamodelObject.actions.close.method ? $scope.metamodelObject.actions.close:$scope.popup.actions._close;
					// $scope.popup.actions._cancel = $scope.metamodelObject.actions.cancel.method ? $scope.metamodelObject.actions.cancel:$scope.popup.actions._cancel;
					$scope.popup.actions._reset = ($scope.metamodelObject.actions.reset && $scope.metamodelObject.actions.reset.method) ? 
						$scope.metamodelObject.actions.reset.method:$scope.popup.actions._reset;
				}

			}

			function _getTitle(){
				$scope.popup.labels.title = $scope.metamodelObject.labels.title || $scope.popup.labels.title;	
				
				//Since we share the same metamodel for different popups, screens, we must define a type to be able to difference the titles. 
				if ($scope.metamodelObject.type && $scope.resourceUrl){
					MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);
				}		
			}

			$scope.execute = function(action) {
				if($scope.actionFactory[action]){
					$scope.actionFactory[action]();
				} else {
					//default actions case
					action();				
				}

			};
		},
		templateUrl: 'src/ocInfra/templates/components/popup.html'
	};
});