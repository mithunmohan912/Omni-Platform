'use strict';

/*
global angular
*/

angular.module('omnichannel').directive('renderer', function(MetaModel, $resource, $rootScope, $injector, resourceFactory, $q){

	return {
		restrict: 'E',
		scope: {
			metamodel: '=',
			resourceUrl: '=?',
			factoryName: '='
		},
		link: function($scope){
			var metamodelObject = $rootScope.metamodel? $rootScope.metamodel[$scope.metamodel]: null;
			if (!metamodelObject) {
				MetaModel.load($rootScope, $rootScope.regionId, $scope.metamodel, function(data) {
					_processMetamodel(data);
					_options(data);
					//_init(data);
				});
			} else {
				_processMetamodel(metamodelObject);
				_options(metamodelObject);
				//_init(metamodelObject);
			}

			$scope.$watch('resourceUrl', function(newValue, oldValue){
				if(newValue !== oldValue){
					if($scope.metamodelObject){
						//_processMetamodel($scope.metamodelObject);
						//_options($scope.metamodelObject);
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

			function _options(metamodelObject){
				
				$scope.factoryName = $scope.factoryName || metamodelObject.factoryName;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(e) {
					console.log($scope.factoryName + ' not found');
				}

				$scope.optionsMap = {};
				$scope.metamodelObject = metamodelObject;
				var resource = $scope.metamodelObject.resource;
				$scope.resourcesToBind = { properties : {} };
				var newURL = {};
				if($rootScope.regionId !== undefined && resource !== undefined){
					var url = $rootScope.hostURL + resource;
                    //Retrieve regionToSORMap from the rootScope
                    var regionToSORMap = $rootScope.regionToSoR;
                    //Retrieve the application name for the given region Id
                    var applName = regionToSORMap[$rootScope.regionId];
                    //Replace the regionId with application name in the URL
                    newURL = url.replace(':regionId',applName);
                    $scope.metamodelObject.optionUrl = newURL;
                    $scope.resourceUrlToRender = newURL;
                } else if(resource !== undefined){
                	newURL = $rootScope.hostURL + resource;
                	$scope.metamodelObject.optionUrl = newURL;
                    $scope.resourceUrlToRender = newURL;
                }

				$scope.optionUrl = $scope.metamodelObject.optionUrl;
				if($scope.optionUrl === undefined){
					return;
				}

				$scope.$watchCollection('optionsMap', function(newValue){
					if(newValue){
						for (var url in newValue) {
							var optionsMapForResource = newValue[url];
							if(optionsMapForResource !== undefined && $scope.metamodelObject.actionOnScreen){
								var optionsObj = optionsMapForResource.get($scope.metamodelObject.actionOnScreen);
								if(optionsObj !== undefined){
									console.log('optionsMap action' + optionsObj.action);
									$scope.metamodelObject.resourceUrl = optionsObj.href;
									$scope.resourcesToBind[$scope.metamodelObject.resourceUrl] = optionsObj;
									$scope.resourcesToBind[$scope.metamodelObject.resourceUrl].properties = optionsObj.properties;
									_init($scope.metamodelObject);	
								}
							}
						}
					}
				});
				
				MetaModel.prepareOptions($scope.optionUrl, $scope.optionsMap);

			}

			function _init(metamodelObject){
				$scope.metamodelObject = metamodelObject;
				$scope.resultSet = {};
				$scope.boundUrls = [];
				//Initial resource specified in metamodel?
				

				$scope.factoryName = $scope.factoryName || metamodelObject.factoryName;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(e) {
					console.log($scope.factoryName + ' not found');
				}
				//$scope.resourcesToBind = { properties : {} };
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
							if(url !== 'deferred' && url !== 'pending'){
								$scope.resourcesToBind[newValue[url].identifier] = newValue[url];
							}
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

										for(var k = 0; k < idValues.length; k++){
											var resourceSelected = { resource: null, points: 0 };
											for(var resource in $scope.resourcesToBind){
												console.log('Resource---'+resource);
												if (resource !=='properties'){
													//If the resource is part of a collection and we are only interested in on of the collection items. 
													if ($scope.metamodelObject.sections[i].properties[j].selector){
														seekSelectorInResource($scope.resourcesToBind[resource], $scope.metamodelObject.sections[i].properties[j].selector, resourceSelected);
													} else if ($scope.metamodelObject.sections[i].properties[j].id[k] in $scope.resourcesToBind[resource].properties){	
														resourceSelected.resource = resource;
													}
												}
											}

											$scope.resourcesToBind.properties = $scope.resourcesToBind.properties || {};	
											//if we have found a value in one of the resources, we are done and no need to go on. 
											if (resourceSelected.resource && $scope.metamodelObject.sections[i].properties[j].id[k] in $scope.resourcesToBind[resourceSelected.resource].properties){	
												$scope.resourcesToBind.properties[$scope.metamodelObject.sections[i].properties[j].id[k]] = 
												$scope.resourcesToBind[resourceSelected.resource].properties[$scope.metamodelObject.sections[i].properties[j].id[k]];
												// storeProperty($scope.metamodelObject.sections[i].properties[j].id[k]);

												if($scope.boundUrls.indexOf($scope.resourcesToBind.properties[$scope.metamodelObject.sections[i].properties[j].id[k]].self) < 0) {
													$scope.boundUrls.push($scope.resourcesToBind.properties[$scope.metamodelObject.sections[i].properties[j].id[k]].self);	
												}
												break;
											}
										}
									} 
								}
							}
						}
					}
				});
	

				$scope.$on('resourceDirectory', function(event, params){
					if($scope.boundUrls.indexOf(params.url) >= 0){
						if (params.response.config.method !== 'DELETE') {
							/*
								We use the promise to get all values into the resultSet before changing the scope's resultSet. This
								way we prevent the screen from flashing (the screen was being left blank before starting the rendering process again).
							*/
							MetaModel.prepareToRender($scope.resourceUrlToRender, $scope.metamodelObject, {}).then(function(resultSet){
								$scope.resultSet = resultSet;
							});
						}
					}
				});
				MetaModel.prepareToRender($scope.resourceUrlToRender, $scope.metamodelObject, $scope.resultSet);
			}

			function seekSelectorInResource(resource, selector, resourceSelected){
				var selectors = Array.isArray(selector)?selector:[selector];
				var points = 0;
				selectors.forEach(function(sel) {
					//If we found the selctor among the resource properties, we discard it if the selector is not true
					if (resource.properties[sel]) {
						points += 2;
						if (resource.properties[sel].value === true){
							points += 1;
						}
					}
				});
				
				if (points >= resourceSelected.points) {
					resourceSelected.resource = resource.identifier;
					resourceSelected.points = points;
					return true;
				}
				return false;
			}


			$scope.execute = function(action, actionURL) {

				if($scope.actionFactory && $scope.actionFactory[action]){
					if($scope.resourcesToBind.properties !== undefined){
						if($scope.optionUrl && $scope.optionsMap[$scope.optionUrl] && $scope.optionsMap[$scope.optionUrl].get(actionURL)){
							$scope.resourcesToBind.properties = $scope.optionsMap[$scope.optionUrl].get(actionURL).properties;	
						}
						$scope.actionFactory[action]($scope, actionURL, $scope.optionsMap[$scope.optionUrl], $scope.resourcesToBind.properties);
					}
				} else {
					if ($scope[action]) {
						if($scope.resultSet !== undefined && $scope.resourceUrlToRender !== undefined && $scope.resultSet[$scope.resourceUrlToRender] !== undefined && $scope.resourcesToBind.properties !== undefined){
							$scope[action]($scope.resourcesToBind.properties);
						}
					}
				}			
				var optionsMapForResource = $scope.optionsMap[$scope.optionUrl];
				if(optionsMapForResource !== undefined  && actionURL !== undefined){
					var optionsObj = optionsMapForResource.get(actionURL);
					if(optionsObj !== undefined){
						/*
						$rootScope.resourceUrlToRender = optionsObj.href;	
						$scope.metamodelObject.resourceUrl = optionsObj.href;
						$scope.resourcesToBind[$scope.metamodelObject.resourceUrl] = optionsObj;
						$scope.resourcesToBind[$scope.metamodelObject.resourceUrl].properties = optionsObj.properties;
						_init($scope.metamodelObject);
						*/
						$scope.resourceUrl = optionsObj.href;
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
					var promises = [];
					var propertiesBound = $scope.resourcesToBind.properties;
					if (propertiesBound) {
						for(var key in propertiesBound){
							if(propertiesBound[key] && propertiesBound[key].self && propertiesBound[key].editable){
								var href = propertiesBound[key].self;
								payloads[href] = payloads[href] || {};
							}
						}

						var payloadKeys = Object.keys(payloads);
						payloadKeys.forEach(function(url){
							resourceFactory.get(url).then(function(response) {
								var resourceToPatch = response.data;
								var payloadToPatch = payloads[url];
								for(var property in resourceToPatch){
									if(property.indexOf(':') > 0 && property.indexOf('_') !== 0){
										if(property in propertiesBound && propertiesBound[property].value !== resourceToPatch[property]){
											payloadToPatch[property] = $scope.resourcesToBind.properties[property].value? $scope.resourcesToBind.properties[property].value:null;
										}
									}
								}
								if(Object.keys(payloadToPatch).length > 0){
									promises.push(resourceFactory.patch(url, payloadToPatch));
									$q.all(promises).then(function() {
										if (data.callback) {
											$scope.execute(data.callback);
										}
									});
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


			$scope.$on('close_popUp_renderer', function(event, data){
				if (data.resourceUrl === $scope.resourceUrlToRender) {
					if (data.callback) {
						$scope.execute(data.callback);
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
						resourceFactory.patch(data.resourceUrl, payloads).then(function() {
							if (data.callback) {
								$scope.execute(data.callback);
							}
						});
						
					}
				}
			});
		},
		templateUrl: $rootScope.templatesURL + 'renderer.html'
	};
});