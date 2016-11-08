'use strict';

/*
global app
*/

app.directive('popupRender',  function(MetaModel, $resource, $rootScope, $location, $injector, bindingFactory, validationFactory){

return {
		restrict: 'E',
		scope: {
			uiId: '@',
			metamodel: '=',
			resourceUrl: '=?',
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
			
			$scope.resultSet = {};

			$scope.resetDisabled = false;

			$scope.resourceUrl = $scope.resourceUrl || $rootScope.resourceUrl;

			$scope.$on('resource_directory', function(event, params){
				if($scope.resourceUrl && params.url.indexOf($scope.resourceUrl) >= 0){
					if (params.response.config.method !== 'DELETE') {
						$scope.resultSet = {};
						MetaModel.prepareToRender($scope.resourceUrl, $scope.metamodelObject, $scope.resultSet);
					}
				}
			});

			$scope.$watch('resourceUrl', function(newValue, oldValue){
				if ($scope.metamodelObject) {
					//Since we share the same metamodel for different popups, screens, we must define a type to be able to difference the titles. 
					if (!$scope.resourceUrl && newValue !== oldValue){
						$scope.resourceUrl = $rootScope.resourceUrl;
					}	
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
							$scope.metamodelObject.labels.title = typeValue.toUpperCase() + '_' + ($scope.metamodelObject.labels.title || $scope.metamodelObject.labels.titleDefault);
						}else{
							$scope.metamodelObject.labels.title = ($scope.metamodelObject.labels.title || $scope.metamodelObject.labels.titleDefault);
						}
						
						$scope.popUpResourceToBind = newValue[$scope.resourceUrl];
						
						//OC-958 
						$scope.resetDisabled = false;
						// $scope.resetDisabled = checkReset();

					}

			});


			function _defaultSave(){
				var callback = ($scope.metamodelObject.actions && $scope.metamodelObject.actions.ok && $scope.metamodelObject.actions.ok.callback)? $scope.metamodelObject.actions.ok.callback: null;
				//OC-956: to avoid multiple callbacks, adding condition by name
				//OC-947: sending the method to close the popup to the renderer
				 $scope.$broadcast('patch_renderer', { resourceUrl: $scope.resourceUrl || $rootScope.resourceUrl, callback: callback, name: $scope.metamodelObject.name, closePopup: $scope.closePopup, modifiedHeaders: $scope.metamodelObject.actions && $scope.metamodelObject.actions.ok && $scope.metamodelObject.actions.ok.modifiedHeaders ? $scope.metamodelObject.actions.ok.modifiedHeaders : null}); 
			}

			function _defaultClose() {
				var callback = ($scope.metamodelObject.actions && $scope.metamodelObject.actions.close && $scope.metamodelObject.actions.close.callback)? $scope.metamodelObject.actions.close.callback: null;
				//OC-957
				// $scope.$broadcast('close_popUp_renderer', { resourceUrl: $scope.resourceUrl, callback: callback });
				if (callback){
					$scope.execute(callback);
				}
			}	

			function _defaultReset() {
				//if ($scope.metamodelObject.actions.reset.links){
					var callback = $scope.metamodelObject.actions.reset.callback? $scope.metamodelObject.actions.reset.callback: null;
					//OC-958
					// $scope.$broadcast('reset_renderer', { resourceUrl: $scope.resourceUrl, links: $scope.metamodelObject.actions.reset.links, callback: callback });
					if (callback){
						$scope.execute(callback);
					}
				//}
			}
			
			function _init(metamodelObject){
				$scope.metamodelObject = metamodelObject;

				// Default labels and actions
				_initLabels();
				_initActions();

				$scope.$emit('isValidStatus',validationFactory.validatePropertiesByMetamodelName($scope.metamodel));
 				
					
		        $scope.screenFactoryName = $scope.metamodelObject.factoryName || $scope.factoryName;
				try {
					$scope.actionFactory = $injector.get($scope.screenFactoryName);
				} catch(e) {
					console.log($scope.screenFactoryName + 'not found');
				}
			}	

			function _initLabels(){
				$scope.metamodelObject.labels.titleDefault = '_POPUP_TITLE';
				$scope.metamodelObject.labels.okDefault = '_SAVE';
				$scope.metamodelObject.labels.closeDefault = '_CLOSE';
				$scope.metamodelObject.labels.resetDefault = '_RESET';
				
				// User defined labels and actions
				if($scope.metamodelObject.labels){
					$scope.metamodelObject.labels.title =  $scope.metamodelObject.labels.title || $scope.metamodelObject.labels.titleDefault;
					$scope.metamodelObject.labels.ok = $scope.metamodelObject.labels.ok || $scope.metamodelObject.labels.okDefault;
					$scope.metamodelObject.labels.close = $scope.metamodelObject.labels.close || $scope.metamodelObject.labels.closeDefault;
					$scope.metamodelObject.labels.cancel = $scope.metamodelObject.labels.cancel || $scope.metamodelObject.labels.cancelDefault;
					$scope.metamodelObject.labels.reset = $scope.metamodelObject.labels.reset || $scope.metamodelObject.labels.resetDefault;
					$scope.metamodelObject.labels.bodycontent =  $scope.metamodelObject.labels.bodycontent;
					$scope.metamodelObject.labels.text =  $scope.metamodelObject.labels.text;
				}

			}

			function _initActions(){
				$scope.metamodelObject.actions.cancel = $scope.metamodelObject.actions.cancel;
				$scope.metamodelObject.actions.reset = $scope.metamodelObject.actions.reset;
				$scope.metamodelObject.actions._ok = _defaultSave;
				$scope.metamodelObject.actions._close =_defaultClose;
				$scope.metamodelObject.actions._reset =_defaultReset;

				if($scope.metamodelObject.actions){
					$scope.metamodelObject.actions._ok = ($scope.metamodelObject.actions.ok && $scope.metamodelObject.actions.ok.method) ? $scope.metamodelObject.actions.ok.method: $scope.metamodelObject.actions._ok;
					$scope.metamodelObject.actions._close = ($scope.metamodelObject.actions.close && $scope.metamodelObject.actions.close.method) ? $scope.metamodelObject.actions.close.method:$scope.metamodelObject.actions._close;
					$scope.metamodelObject.actions._cancel = ($scope.metamodelObject.actions.cancel && $scope.metamodelObject.actions.cancel.method) ? $scope.metamodelObject.actions.cancel.method:$scope.metamodelObject.actions._cancel;
					$scope.metamodelObject.actions._reset = ($scope.metamodelObject.actions.reset && $scope.metamodelObject.actions.reset.method) ? $scope.metamodelObject.actions.reset.method:$scope.metamodelObject.actions._reset;
				}

			}

			////OC-958
			// function checkReset(){

			// 	//Check links defined in metamodel
			// 	if ($scope.popUpResourceToBind && $scope.metamodelObject.actions && $scope.metamodelObject.actions.reset && $scope.metamodelObject.actions.reset.links){
			// 		for (var i=0; i<$scope.metamodelObject.actions.reset.links.length; i++){

			// 			for (var j=0; j<$scope.popUpResourceToBind.dependencies.length; j++){
			// 				if ($scope.popUpResourceToBind.dependencies[j].resource === $scope.metamodelObject.actions.reset.links[i]){
			// 					//It means ther's al least one link to be reset, so we must not disable the reset button. 
			// 					return false;
			// 				}
			// 			}
			// 		}
			// 	}
			// 	return true;
			// }

			$scope.$on('close_popup', function() {
				$scope.closePopup();
			});


			$scope.execute = function(action) {
				if (typeof action === 'function') {
					//default actions case
					action();
					
				} else if($scope.actionFactory[action]){
					if ($scope.resourceUrl){
						if( $scope.popUpResourceToBind !== undefined){
							$scope.actionFactory[action]($scope.resourceUrl, $scope, $scope.resultSet[$scope.resourceUrl], $scope.popUpResourceToBind.properties);	
						} else{
							$scope.actionFactory[action]($scope.resourceUrl, $scope, $scope.resultSet[$scope.resourceUrl]);
						}
						
					}
					else{
						$scope.actionFactory[action]($scope);
					}
					
				}

			};
		},
		link: function($scope, element){
			//OC-947: method to close the popup when the resources is consistent
			$scope.closePopup = function() {
				element.find('.modal').modal('hide');
			};
		},
		templateUrl: $rootScope.templatesURL + 'popup.html'
	};
});