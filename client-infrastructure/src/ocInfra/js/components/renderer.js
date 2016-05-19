'use strict';

/*
	global angular
*/

angular.module('omnichannel').directive('renderer', function(MetaModel, $resource, $rootScope, $injector, resourceFactory){

	return {
		restrict: 'E',
		scope: {
			metamodel: '=',
			resourceUrl: '=',
			factoryName: '='
		},
		link: function($scope){
			var metamodelObject = $rootScope.metamodel? $rootScope.metamodel[$scope.metamodel]: null;
			if (!metamodelObject) {
				MetaModel.load($rootScope, $rootScope.regionId, $scope.metamodel, function(data) {
					_processMetamodel(data);
					_init(data);
				});
			} else {
				_processMetamodel(metamodelObject);
				_init(metamodelObject);
			}

			/*$scope.$watch('metamodel', function(newValue){
				if(newValue){
					var metamodelObject = $rootScope.metamodel? $rootScope.metamodel[newValue]: null;
					if (!metamodelObject) {
						MetaModel.load($rootScope, $rootScope.regionId, newValue, function(data) {
							_processMetamodel(data);
							_init(data);
						});
					} else {
						_processMetamodel(metamodelObject);
						_init(metamodelObject);
					}
				}
			});*/

			$scope.$watch('resourceUrl', function(newValue, oldValue){
				if(newValue !== oldValue){
					if($scope.metamodelObject){
						//_processMetamodel($scope.metamodelObject);
						_init($scope.metamodelObject);
					}
				}
			});

			// $scope.isVisible = function(property, metamodelProperty){
			$scope.isVisible = function(property){
				if(property === undefined){
					return false;
				}

				return true;
			};

			function _processMetamodel(metamodel){
				if(metamodel && metamodel.sections){
					metamodel.sections.forEach(function(section){
						// We don't want to process sections of type 'reference' because they will be processed by its own instance of the renderer directive
						if(!section.type || section.type !== 'reference'){
							var rowNumbers = [];
							section.rows = [];
							
							section.properties.forEach(function(property){
								if(property.row !== undefined){
									if(rowNumbers[property.row] === undefined){
										rowNumbers[property.row] = 0;
									}
									rowNumbers[property.row]++;
								}

								//we need to process an array even if id is a single value. 
								if (property.id && !Array.isArray(property.id)){
									property.id = [property.id]; 
								}
							});

							var propertyMapFilter = function(property){
								if(property.row !== undefined && property.row === i){
									return property;
								}
							};
							for(var i = 0; i < rowNumbers.length; i++){
								if(rowNumbers[i] !== undefined){
									var propertiesInRow = section.properties.map(propertyMapFilter);

									section.rows.push(propertiesInRow);

									for(var j = 0; j < propertiesInRow.length; j++){
										if(propertiesInRow[j] !== undefined){
											section.properties.splice(section.properties.indexOf(propertiesInRow[j]), 1);
											
											var calculatedColspan = 12;
								
											if(section.properties.length > 1 && propertiesInRow[j].row){
												calculatedColspan = 12 / ((rowNumbers[propertiesInRow[j].row] > 4) ? 4 : rowNumbers[propertiesInRow[j].row]);
											}

											propertiesInRow[j].colspan = propertiesInRow[j].colspan || calculatedColspan;

											section.properties.push(propertiesInRow[j]);
										}
									}
								}
							}

							for(var index = section.properties.length - 1; index >= 0; index--){
								if(section.properties[index].row === undefined){
									section.rows.unshift([section.properties[index]]);
								}
							}

							section.rows.forEach(function(properties){
								while(properties.indexOf(undefined) >= 0) {
									properties.splice(properties.indexOf(undefined), 1);
								}
							});
						}
					});
				}
			}

			function _init(metamodelObject){
				$scope.metamodelObject = metamodelObject;
				$scope.resultSet = {};
				$scope.boundUrls = [];

				$scope.resourceUrlToRender = $scope.resourceUrl || $scope.metamodelObject.resourceUrl || $rootScope.resourceUrl;
				if ($scope.resourceUrlToRender === undefined) {
					return;
				}

				$scope.$watchCollection('resultSet', function(newValue){
					if(newValue){
						//$scope.resourcesToBind = $scope.resourcesToBind || {};
						//keep the ui inputs
						var propertiesToKeep = {};
						if ($scope.resourcesToBind && $scope.resourcesToBind.properties) {
							for (var property in $scope.resourcesToBind.properties) {
								if (property.indexOf(':') === -1) {
									propertiesToKeep[property] = $scope.resourcesToBind.properties[property];
								}
							}
						}
						$scope.resourcesToBind = { properties: propertiesToKeep };

						for(var url in newValue){
							$scope.resourcesToBind[newValue[url].identifier] = newValue[url];
						}

						$scope.boundUrls = [];
						//This var will contain the properties names. In case we found the same property in different resources, we keep the one defined first in metamodel
						$scope.propertiesCollection = [];

						// Extract the urls of the properties we have bound, so we can then update the view when any of those properties gets updated		
						for(var i = 0; i < $scope.metamodelObject.sections.length; i++){
							// We don't want to process sections of type 'reference' because they will be processed by its own instance of the renderer directive
							if(!$scope.metamodelObject.sections[i].type || $scope.metamodelObject.sections[i].type !== 'reference') {
								for(var j = 0; j < $scope.metamodelObject.sections[i].properties.length; j++){

									
									// if we potentially have the same property coming from different resources. 
									if (Array.isArray($scope.metamodelObject.sections[i].properties[j].id)){
										var idValues = $scope.metamodelObject.sections[i].properties[j].id;
										ID_LOOP:
										for(var k = 0; k < idValues.length; k++){

											for(var resource in $scope.resourcesToBind){
												if (resource !=='properties'){

													//If the resource is part of a collection and we are only interested in on of the collection items. 
													if ($scope.metamodelObject.sections[i].properties[j].selector){
														if (seekSelectorInResource($scope.resourcesToBind[resource], $scope.metamodelObject.sections[i].properties[j].selector)){
															//do nothing; 
														}else{
															continue; //We discard this resource. 
														}
													}

													$scope.resourcesToBind.properties = $scope.resourcesToBind.properties || {};	
													//if we have found a value in one of the resources, we are done and no need to go on. 
													if ($scope.metamodelObject.sections[i].properties[j].id[k] in $scope.resourcesToBind[resource].properties){	
														$scope.resourcesToBind.properties[$scope.metamodelObject.sections[i].properties[j].id[k]] = 
															$scope.resourcesToBind[resource].properties[$scope.metamodelObject.sections[i].properties[j].id[k]];
															// storeProperty($scope.metamodelObject.sections[i].properties[j].id[k]);

														if($scope.boundUrls.indexOf($scope.resourcesToBind.properties[$scope.metamodelObject.sections[i].properties[j].id[k]].self) < 0) {
															$scope.boundUrls.push($scope.resourcesToBind.properties[$scope.metamodelObject.sections[i].properties[j].id[k]].self);	
														}
														break ID_LOOP;
													}
												}
											}
											
										}
									} 
								}
							}
						}
						


					}
				});
	

				$scope.$on('resourceDirectory', function(event, data){
					if($scope.boundUrls.indexOf(data.url) >= 0){
						//_init(metamodelObject);
						if (data.response.config.method !== 'DELETE') {
							MetaModel.prepareToRender($scope.resourceUrlToRender, $scope.metamodelObject, $scope.resultSet);
						}
					}
				});
				
				$scope.factoryName = $scope.factoryName || metamodelObject.factoryName;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(e) {
					console.log($scope.factoryName + ' not found');
				}
				
				MetaModel.prepareToRender($scope.resourceUrlToRender, $scope.metamodelObject, $scope.resultSet);
			}

			function seekSelectorInResource(resource, selector){
				if (resource.properties[selector] && resource.properties[selector].value === true){
					return true;
				}else{
					return false;
				}
			}


			$scope.execute = function(action) {
				if($scope.actionFactory && $scope.actionFactory[action]){
					$scope.actionFactory[action]($scope.resultSet[$scope.resourceUrlToRender], $scope.resourcesToBind.properties);
				} else {
					if ($scope[action]) {
						$scope[action]($scope.resultSet[$scope.resourceUrlToRender], $scope.resourcesToBind.properties);
					}
				}
			};
			/* Commented for JSHint because it is not used (yet) */
			/*
			function _sanitize(oldProperties, newProperties){
				var properties = {};

				for(var key in oldProperties){
					if(newProperties && key in newProperties && newProperties[key].value !== oldProperties[key].value){
						properties[key] = newProperties[key];
					}
				}

				return properties;
			}
			*/

			$scope.$on('patch_renderer', function(event, data){
				if (data.resourceUrl === $scope.resourceUrlToRender) {
					var payloads = {};
					var propertiesBound = $scope.resourcesToBind.properties;
					if (propertiesBound) {
						for(var key in propertiesBound){
							if(propertiesBound[key] && propertiesBound[key].self && propertiesBound[key].editable){
								var href = propertiesBound[key].self;
								payloads[href] = payloads[href] || {};
							}
						}

						payloads.forEach(function(url){
							resourceFactory.get(url).then(function(resourceToPatch) {
								var payloadToPatch = payloads[url];
								for(var property in resourceToPatch){
									if(property.indexOf(':') > 0 && property.indexOf('_') > 0){
										if(property in propertiesBound && propertiesBound[property].value !== resourceToPatch[property]){
											payloadToPatch[property] = $scope.resourcesToBind.properties[property].value;
										}
									}
								}
								if(Object.keys(payloadToPatch).length > 0){
									resourceFactory.patch(url, payloadToPatch);
								}
							});
						});
					}
				}
			});

			$scope.$on('reset_renderer', function(event, data){
				if (data.resourceUrl === $scope.resourceUrlToRender) {
					var payloads = {};
					
					if ($scope.resourcesToBind) {

					 	for(var key in data.links){
							if($scope.resourcesToBind[data.links[key]]){
								payloads[data.links[key]] = '';
							}
						}

					resourceFactory.patch(data.resourceUrl, payloads);
						
					}
				}
			});
		},
		templateUrl: 'src/ocInfra/templates/components/renderer.html'
	};
});