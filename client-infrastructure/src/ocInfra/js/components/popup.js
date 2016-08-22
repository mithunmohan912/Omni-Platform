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
					if ($scope.resourceUrl){
						$scope.actionFactory[action]($scope.resultSet[$scope.resourceUrl], $scope.popUpResourceToBind.properties);
					}
					else{
						$scope.actionFactory[action]();
					}
					
				}

			};
		},
		templateUrl: $rootScope.templatesURL + 'popup.html'
	};
});