'use strict';

/*
global angular
*/

angular.module('omnichannel').directive('renderer', function(MetaModel, $resource, $rootScope, $injector, resourceFactory, $q, $location){

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
					_init(data);
				});
			} else {
				_processMetamodel(metamodelObject);
				_options(metamodelObject);
				_init(metamodelObject);
			}

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

			$scope.opened= function (section){

				if (typeof section.collapse !== 'undefined'){
					if (section.collapse){
						section.collapse = false;
					}else{
						section.collapse = true;
					}	
				}
			};

			function _prepareColspanAndOffset(element){
				if(element.colspan){
					var initialColspan = 12;
					if(!(element.colspan instanceof Object)){
						initialColspan = element.colspan;
						element.colspan = {};
					}

					element.colspan.xs = element.colspan.xs || initialColspan;
					element.colspan.sm = element.colspan.sm || element.colspan.xs;
					element.colspan.md = element.colspan.md || element.colspan.sm;
					element.colspan.lg = element.colspan.lg || element.colspan.md;
				}

				if(element.offset){
					var initialOffset = 0;
					if(!(element.offset instanceof Object)){
						initialOffset = element.offset;
						element.offset = {};
					}

					element.offset.xs = element.offset.xs || initialOffset;
					element.offset.sm = element.offset.sm || initialOffset;
					element.offset.md = element.offset.md || initialOffset;
					element.offset.lg = element.offset.lg || initialOffset;
				}

				element.colspan = element.colspan || { xs:12, sm:12, md:12, lg:12, default: true };
				element.offset = element.offset || { xs:0, sm:0, md:0, lg:0, default: true };
			}

			function _processMetamodel(metamodel){
				if(metamodel && metamodel.sections){
					metamodel.sections.forEach(function(section){
						// We don't want to process sections of type 'reference' because they will be processed by its own instance of the renderer directive
						if(!section.type || section.type !== 'reference'){

							_prepareColspanAndOffset(section);

							section.colspan = section.colspan || { xs:12, sm:12, md:12, lg:12, default: true };
							section.offset = section.offset || { xs:0, sm:0, md:0, lg:0, default: true };
							
							section.properties.forEach(function(property){
								_prepareColspanAndOffset(property);

								if(property.type === 'iconGroup'){
									for(var iconIndex = 0; iconIndex < property.icons.length; iconIndex++){
										var icon = property.icons[iconIndex];
										_prepareColspanAndOffset(icon);

										icon.colspan = icon.colspan || { xs:12, sm:12, md:12, lg:12, default: true };
										icon.offset = icon.offset || { xs:0, sm:0, md:0, lg:0, default: true };
									}
								}

								//we need to process an array even if id is a single value. 
								if (property.id && !Array.isArray(property.id)){
									property.id = [property.id]; 
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
				if($rootScope.resourceHref){
					$scope.metamodelObject.optionUrl = $rootScope.resourceHref;
                    $scope.resourceUrlToRender = $rootScope.resourceHref;
				} else if($rootScope.regionId !== undefined && resource !== undefined){
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
                  
                  //we need to check the sesssion storage just in case we are coming from another SPA
                  newURL = sessionStorage.getItem(resource + '_url') ? sessionStorage.getItem(resource + '_url') : newURL;
                  $scope.metamodelObject.optionUrl = newURL ;
                  $scope.resourceUrlToRender = newURL;
                  $scope.resourceUrl = newURL;
                }

				$scope.optionUrl = $scope.metamodelObject.optionUrl;


				if($scope.optionUrl === undefined){
					return;
				}

				$scope.$watchCollection('optionsMap', function(newValue){
					if(newValue){
						Object.keys(newValue).forEach(function(url){
							var optionsMapForResource = newValue[url];

							if(optionsMapForResource !== undefined && $scope.metamodelObject.actionOnScreen){
								var optionsObj = optionsMapForResource.get($scope.metamodelObject.actionOnScreen);
								if(optionsObj !== undefined){
									console.log('optionsMap action' + optionsObj.action);

									var data = JSON.parse(sessionStorage.getItem(resource + '_' + optionsObj.action + '_data'));
									var params = JSON.parse(sessionStorage.getItem(resource + '_' + optionsObj.action + '_params'));

									sessionStorage.removeItem(resource + '_' + optionsObj.action + '_data');
									sessionStorage.removeItem(resource + '_' + optionsObj.action + '_params');                  

									resourceFactory.execute(optionsObj.href, data, params, null, optionsObj.httpmethod).then(function(response){
										if (optionsObj.httpmethod === 'POST') {
											$scope.resourceUrl = response.data._links.self.href;
										} else {
											$scope.resourceUrl = optionsObj.href;
											$scope.resourcesToBind[$scope.metamodelObject.resourceUrl] = optionsObj;
											$scope.resourcesToBind[$scope.metamodelObject.resourceUrl].properties = optionsObj.properties;
										}

										_init($scope.metamodelObject);

									});									
										
								}
							}
						});		
						
					}
				});
				MetaModel.prepareOptions($rootScope, $scope.optionUrl, $scope.optionsMap);
			}

			function _init(metamodelObject){
				$scope.metamodelObject = metamodelObject;
				$scope.resultSet = {};
				$scope.boundUrls = [];
				$scope.showIcon  = {};
				//Initial resource specified in metamodel?
				 if($rootScope.user && $rootScope.user.roles && $rootScope.user.roles[0] === 'ROLE_DEV'){
                     $scope.showIcon = true;
                 }else{
                 	$scope.showIcon = false;	
                 }
				if ($scope.metamodelObject.resourceUrl && $scope.metamodelObject.resourceUrl.indexOf($rootScope.hostURL) === -1){
					$scope.metamodelObject.resourceUrl = $rootScope.hostURL + $scope.metamodelObject.resourceUrl;
				}

				$scope.resourcesToBind = { properties: {} };

				$scope.boundUrls.push($scope.resourceUrl);

 
				$scope.factoryName = metamodelObject.factoryName || $scope.factoryName;
				try {
					$scope.actionFactory = $injector.get($scope.factoryName);
				} catch(e) {
					console.log($scope.factoryName + ' not found');
				}

				if(!$scope.activeTab){
					$scope.activeTab = $location.path().substring($location.path().lastIndexOf('/')+1);
				} 

				$scope.resourceUrlToRender = $scope.resourceUrl || $scope.metamodelObject.resourceUrl || $rootScope.resourceUrl;
				if ($scope.resourceUrlToRender === undefined || $scope.resourceUrlToRender === '') {
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
						$scope.boundUrls.push($scope.resourceUrl);
						//This var will contain the properties names. In case we found the same property in different resources, we keep the one defined first in metamodel
						$scope.propertiesCollection = [];
						var searchIdsInAttributes = function(property) {
												if (property.id && !Array.isArray(property.id)){
													property.id = [property.id];
												}
												savePropertyInResourcesToBind(property);
											};
						// Extract the urls of the properties we have bound, so we can then update the view when any of those properties gets updated		
						for(var i = 0; i < $scope.metamodelObject.sections.length; i++){
							// We don't want to process sections of type 'reference' because they will be processed by its own instance of the renderer directive
							if(!$scope.metamodelObject.sections[i].type || $scope.metamodelObject.sections[i].type !== 'reference') {
								for(var j = 0; j < $scope.metamodelObject.sections[i].properties.length; j++){

									if (!$scope.metamodelObject.sections[i].properties[j].uiInput) {
										savePropertyInResourcesToBind($scope.metamodelObject.sections[i].properties[j]); 
										//search ids in attributes
										for (var attribute in $scope.metamodelObject.sections[i].properties[j].attributes) {
											if (Array.isArray($scope.metamodelObject.sections[i].properties[j].attributes[attribute])){
												$scope.metamodelObject.sections[i].properties[j].attributes[attribute].forEach(searchIdsInAttributes);
											}
										}
									}
								}
							}
						}

						var isSectionConsistent = function(properties) {
							var consistent = true;
							angular.forEach(properties, function(currentProperty){
								if (currentProperty.consistent === false){
									consistent = false;
								}
							});

							return consistent;
						};

						$rootScope.consistentInd = $rootScope.consistentInd || {};
						 
						if (!_.isEmpty($scope.resourcesToBind.properties)){
							$rootScope.consistentInd[$scope.metamodel] = isSectionConsistent($scope.resourcesToBind.properties);	
						}
					}
				});
	

				$scope.$on('resource_directory', function(event, params){
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


			function savePropertyInResourcesToBind(property) {
				if (!property.uiInput) {
					if (Array.isArray(property.id)){
						var idValues = property.id;
						for(var k = 0; k < idValues.length; k++){
							var resourceSelected = { resource: null, points: 0 };
							for(var resource in $scope.resourcesToBind){
								if (resource !=='properties'){

									//If the resource is part of a collection and we are only interested in on of the collection items. 
									if (property.selector){
										seekSelectorInResource($scope.resourcesToBind[resource], property.selector, resourceSelected);
									} else if (property.id[k] in $scope.resourcesToBind[resource].properties){	
										resourceSelected.resource = resource;
									}
								}
							}

							$scope.resourcesToBind.properties = $scope.resourcesToBind.properties || {};	
							//if we have found a value in one of the resources, we are done and no need to go on. 
							if (resourceSelected.resource && property.id[k] in $scope.resourcesToBind[resourceSelected.resource].properties){

				                var id = property.id[k];
							
				                $scope.resourcesToBind.properties[id] = 
				                $scope.resourcesToBind[resourceSelected.resource].properties[id];

								if($scope.boundUrls.indexOf($scope.resourcesToBind.properties[id].self) < 0) {
									$scope.boundUrls.push($scope.resourcesToBind.properties[id].self);	
								}
								break;
							}
							
						}
					} 
				}
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


			$scope.execute = function(inputComponent) {
				if($scope.actionFactory && $scope.actionFactory[inputComponent.method]){
					
					var defaultValues = {};
					if(inputComponent.action){
						defaultValues = MetaModel.getDefaultValues(inputComponent.action, $scope.metamodelObject);
					}

					if($scope.resourcesToBind.properties !== undefined){
						$scope.actionFactory[inputComponent.method]({'scope': $scope, 'inputComponent': inputComponent, 
							'optionUrl': $scope.optionUrl, 'properties': $scope.resourcesToBind.properties, 'defaultValues': defaultValues});

					}
				} else {
					if ($scope[inputComponent.method]) {
						if($scope.resultSet !== undefined && $scope.resourceUrlToRender !== undefined && $scope.resultSet[$scope.resourceUrlToRender] !== undefined && $scope.resourcesToBind.properties !== undefined){
							$scope[inputComponent.method]({'properties': $scope.resourcesToBind.properties});
						}
					}
				}

				if (inputComponent.method){
					$scope.$broadcast(inputComponent.method, $scope);
				}
			};

			$scope.$on('patch_renderer', function(event, data){
				if (data.resourceUrl === $scope.resourceUrlToRender || data.save) {
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
											$scope.execute({ 'method': data.callback});
										}
									});
								}else if (data.callback){
									$scope.execute({ 'method': data.callback});
								}
							});
						});
						if (payloadKeys.length === 0 && data.callback){
							$scope.execute({ 'method': data.callback});
						}
					}
				}
			});

			//OC-958 and OC-957	

			// $scope.$on('close_popUp_renderer', function(event, data){
			// 	if (data.resourceUrl === $scope.resourceUrlToRender) {
			// 		if (data.callback) {
			// 			$scope.execute(data.callback);
			// 		}
			// 	}
			// });

			// $scope.$on('reset_renderer', function(event, data){
			// 	if (data.resourceUrl === $scope.resourceUrlToRender) {
			// 		var payloads = {};
					

			// 		if ($scope.resourcesToBind) {

			// 		 	for(var key in data.links){
			// 				if($scope.resourcesToBind[data.links[key]]){
			// 					payloads[data.links[key]] = '';
			// 				}
			// 			}
			// 			resourceFactory.patch(data.resourceUrl, payloads).then(function() {
			// 				if (data.callback) {
			// 					$scope.execute(data.callback);
			// 				}
			// 			});
						
			// 		}
			// 	}
			// });
		
		    $scope.$on('pdf_update', function(event, params){

		        $scope.pdfUrl = params.url;
		        
		    });
		},
		templateUrl: $rootScope.templatesURL + 'renderer.html'
	};
});