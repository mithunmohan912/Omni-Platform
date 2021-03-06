'use strict';

/*
global angular
*/


angular.module('omnichannel').directive('renderer', function(MetaModel, $resource, growl, $rootScope, $injector, resourceFactory, $q, $location, bindingFactory,validationFactory){


	// WARNING: Copied from input component controller
	function _searchInParents(scope, fieldName){
		if(typeof fieldName !== 'string'){
			return undefined;
		}
		if(fieldName in scope){
			return scope[fieldName];
		} else if(fieldName.indexOf('.') > 0){
			var firstObj = fieldName.substring(0, fieldName.indexOf('.'));
			if(firstObj in scope){
				return scope.$eval(fieldName);
			} else if(scope.$parent){
				return _searchInParents(scope.$parent, fieldName);
			}
		} else if(scope.$parent){
			if(scope.$parent.resourcesToBind){
				if (fieldName in scope.$parent.resourcesToBind.properties) {
					return scope.$parent.resourcesToBind.properties[fieldName];
				} else {
					return _searchInParents(scope.$parent, fieldName);
				}
			} else {
				return _searchInParents(scope.$parent, fieldName);
			}
		}

		return undefined;
	}

	return {
		restrict: 'E',
		scope: {
			metamodel: '=',
			resourceUrl: '=?',
			factoryName: '=',
			parentResources: '='
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

			$scope.getDefaultBehaviourAccordionSection = function(section){
				return (typeof section.accordion.defaultChecked !=='undefined' && section.accordion.defaultChecked === true)?section.accordion.collapse:!(section.accordion.collapse);
			};


			$scope.isCustomAccordionSection = function(section){
				return (section.accordion && typeof section.accordion.componentType !=='undefined' && section.accordion.componentType === 'custom');
			};



			$scope.isCustomAccordionSection = function(section){
				return (section.accordion && typeof section.accordion.componentType !=='undefined' && section.accordion.componentType === 'custom');
			};

			// $scope.isVisible = function(property, metamodelProperty){
			$scope.isVisible = function(property){
				if(property === undefined){
					return false;
				}

				return true;
			};

			$scope.opened= function (section){

				if (typeof section.accordion.collapse !== 'undefined'){
					if (section.accordion.collapse){
						section.accordion.collapse = false;
					}else{
						section.accordion.collapse = true;
					}	
					if (section.accordion.callback){
						if ($scope.actionFactory[section.accordion.callback]){
							$scope.actionFactory[section.accordion.callback](section.accordion.collapse);
						} 
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

								if(property.type === 'popup'){
									//OC-948: object to save the resource url (href property) to be bound to the popup component (indexed by popup.name)
									$scope.itemSelected = $scope.itemSelected || {};
									$scope.itemSelected[property.popup.name] = {};
								}

								//we need to process an array even if id is a single value. 
								if (property.id && !Array.isArray(property.id)){
									property.id = [property.id]; 
								}
							});
						} else if (section.type === 'reference') {
							//OC-956: new structure to save the resourcesToBind object for the children renderers (indexed by $ref)
							$scope.resourcesToBindRef = $scope.resourcesToBindRef || {};
							$scope.resourcesToBindRef[section.$ref] = { properties : {} };
						}

						// Now we prepare the visible functionality
						section.visible = section.visible || true;
						if(typeof section.visible !== 'function') {
							(function(visible){
								section.visible = function(){
									if(typeof visible === 'boolean'){
										return visible;
									} else {
										return $scope.actionFactory[visible]({ 'scope': $scope, 'metamodel': metamodel, 'resources': $scope.resourcesToBind.properties, 'searchInParents': _searchInParents });
									}
								};
							}(section.visible));
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

				//OC-956: if the resourcesToBind is passed by the parent renderer 
				$scope.resourcesToBind = $scope.parentResources || { properties : {} };

				var newURL = {};
				if($rootScope.resourceHref){
					$scope.metamodelObject.optionUrl = $rootScope.resourceHref;
                    $scope.resourceUrlToRender = $rootScope.resourceHref;
				} else if($rootScope.regionId !== undefined && resource !== undefined){
					var url = {};
					//WORK AROUND FOR RMA--
					if(resource.includes('http')){
						url = resource;
					}
					else{
						url = $rootScope.hostURL + resource;
					}
                    //Retrieve regionToSORMap from the rootScope
                    var regionToSORMap = $rootScope.regionToSoR;
                    //Retrieve the application name for the given region Id
                    var applName = regionToSORMap[$rootScope.regionId];
                    //Replace the regionId with application name in the URL
                    newURL = url.replace(':regionId',applName);
                    $scope.metamodelObject.optionUrl = newURL;
                    $scope.resourceUrlToRender = newURL;
                    //OC-1094
                    $scope.resourceUrl = newURL;
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
											$scope.resourcesToBind[$scope.resourceUrl] = optionsObj;
											$scope.resourcesToBind[$scope.resourceUrl].properties = optionsObj.properties;
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
				//OC-947: new property to manage the message erros to be shown in the popup after clicking the ok button
				$scope.submitted = false;
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

				//OC-956: if the resourcesToBind is passed by the parent renderer 
				$scope.resourcesToBind = $scope.parentResources || { properties: {} };

				$scope.boundUrls.push($scope.resourceUrl);

				bindingFactory.setResourceToBindDirectory($scope.metamodel, $scope.resourcesToBind);
 
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
						for(var url in newValue){
							if(url !== 'deferred' && url !== 'pending'){
								$scope.resourcesToBind[newValue[url].identifier] = newValue[url];
							}
						}

						bindingFactory.populateResourceToBind($scope);
						
						var isSectionConsistent = function(properties) {
							var consistent = true;
							angular.forEach(properties, function(currentProperty){

								if (currentProperty && currentProperty.consistent === false){
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
							setTimeout(function(){
								MetaModel.prepareToRender($scope.resourceUrlToRender, $scope.metamodelObject, {}).then(function(resultSet){
									$scope.resultSet = resultSet;
								});
							}, 0);
								
						}
					}
				});
				MetaModel.prepareToRender($scope.resourceUrlToRender, $scope.metamodelObject, $scope.resultSet);
			}

			$scope.canEnabled = function(method,currentStep){
		        var enabled = '';
		          if($scope.actionFactory[method]){
		             enabled = $scope.actionFactory[method]($scope.resourcesToBind,currentStep);
		          }       
		        return enabled;
		    };

	      	$scope.nextStep = function(method,currentStep){
				
		       	var nextStep = '';
		       	if($scope.actionFactory[method]){
		    		nextStep = $scope.actionFactory[method]($scope.resourcesToBind,currentStep,$scope);
		    	}
				return nextStep;
		    };

		    $scope.preStep = function(method,currentStep){
		    	var preStep = '';
		    	if($scope.actionFactory[method]){
		    		preStep = $scope.actionFactory[method]($scope.resourcesToBind,currentStep,$scope);
		    	}
				return preStep;
		    };

            $scope.enterValidation = function(){
                return $scope.isWizardValid;
            };
            
            $scope.selectTab = function(column, tab){
            	if(column && tab){
            		column.activeTab = tab.id;
            	}
            	$scope.execute(tab);
            };

			$scope.moveTab = function(column, tab){
            	if(column && tab){
            		column.activeTab = tab.id;
            	}
            	$scope.execute(tab);
            };

			$scope.execute = function(inputComponent) {
				if($scope.actionFactory && $scope.actionFactory[inputComponent.method]){
					
					var defaultValues = {};
					if(inputComponent.action){
						defaultValues = MetaModel.getDefaultValues(inputComponent.action, $scope.metamodelObject);
					}

					if($scope.resourcesToBind.properties !== undefined){
						$scope.actionFactory[inputComponent.method]({'scope': $scope, 'inputComponent': inputComponent, 
							'optionUrl': $scope.optionUrl, 'properties': $scope.resourcesToBind.properties, 'defaultValues': defaultValues, 'propertiesRef': $scope.resourcesToBindRef});

					}
				} else {
					if ($scope[inputComponent.method]) {
						if($scope.resultSet !== undefined && $scope.resourceUrlToRender !== undefined && $scope.resultSet[$scope.resourceUrlToRender] !== undefined && $scope.resourcesToBind.properties !== undefined){
							$scope[inputComponent.method]({'properties': $scope.resourcesToBind.properties, 'propertiesRef': $scope.resourcesToBindRef});
						}
					}
				}

				if (inputComponent.method){
					$scope.$broadcast(inputComponent.method, $scope);
				}
			};



			$scope.$on('patch_renderer', function(event, data){
				//OC-956: to avoid multiple callbacks, adding condition by name
				if (data.name === $scope.metamodelObject.name && data.resourceUrl === $scope.resourceUrlToRender) {
					var payloads = {};
					var promises = [];

					if ($scope.resourcesToBind.properties) {
						for(var key in $scope.resourcesToBind.properties){
							if($scope.resourcesToBind.properties[key] && $scope.resourcesToBind.properties[key].self && $scope.resourcesToBind.properties[key].editable){
								var href = $scope.resourcesToBind.properties[key].self;
								payloads[href] = payloads[href] || {};
							}
						}
						//OC-956: extract the properties of the children renderers
						if ($scope.resourcesToBindRef) {
							for (var ref in $scope.resourcesToBindRef) {
								for(var key2 in $scope.resourcesToBindRef[ref].properties){
									if($scope.resourcesToBindRef[ref].properties[key2] && $scope.resourcesToBindRef[ref].properties[key2].self && $scope.resourcesToBindRef[ref].properties[key2].editable){
										var href2 = $scope.resourcesToBindRef[ref].properties[key2].self;
										payloads[href2] = payloads[href2] || {};
									}
								}
							}
						}

						//var modalResourceToBind = bindingFactory.getResourceToBindDirectory($scope.metamodel); //--> tenemos que sacar de nuestro resourceBind Factory
 						//var propertiesBound = !_.isEmpty(modalResourceToBind) && !_.isEmpty(modalResourceToBind.properties) ? modalResourceToBind.properties: null;
 						$scope.$emit('isValidStatus',validationFactory.validatePropertiesByMetamodelName($scope.metamodel));  //validationFactory.validateProperties ($scope.metamodelObject.sections,propertiesBound));


						var consistent = true;
						var payloadKeys = Object.keys(payloads);
						payloadKeys.forEach(function(url, index){
							resourceFactory.get(url).then(function(response) {
								var resourceToPatch = response.data;
								var payloadToPatch = payloads[url];
								for(var property in resourceToPatch){
									if(property.indexOf(':') > 0 && property.indexOf('_') !== 0){
										if(property in $scope.resourcesToBind.properties && $scope.resourcesToBind.properties[property].value !== resourceToPatch[property] && 
											$scope.resourcesToBind.properties[property].self === url){
											payloadToPatch[property] = $scope.resourcesToBind.properties[property].value? $scope.resourcesToBind.properties[property].value:null;
										} else {
											//OC-956: extract the properties of the children renderers
											if ($scope.resourcesToBindRef) {
												for (var ref in $scope.resourcesToBindRef) {
													if(property in $scope.resourcesToBindRef[ref].properties && $scope.resourcesToBindRef[ref].properties[property].value !== resourceToPatch[property] && 
														$scope.resourcesToBindRef[ref].properties[property].self === url){
														payloadToPatch[property] = $scope.resourcesToBindRef[ref].properties[property].value? $scope.resourcesToBindRef[ref].properties[property].value:null;
													} 
												}
											}
										}
									}
								}

								var combinedResourcesProperties = [];

								if(Object.keys(payloadToPatch).length > 0){

									var modifiedHeaders = data.modifiedHeaders;
									var headers = null;
									var refresh = false;

									promises.push(resourceFactory.patch(url, payloadToPatch, headers, refresh, modifiedHeaders) );
									$q.all(promises).then(function(response) {
										if (data.callback) {
											$scope.execute({ 'method': data.callback});
										}
										if (response) {
											response.forEach(function(resp){
												var processedProperties = MetaModel.processProperties(resp.data);

												if ($scope.resourcesToBindRef) {
													combinedResourcesProperties = angular.copy($scope.resourcesToBindRef);
												}
												combinedResourcesProperties.resourceToBind = angular.copy($scope.resourcesToBind);


												for (var ref in combinedResourcesProperties) {
														for (var property in combinedResourcesProperties[ref].properties){	
															if (processedProperties[property] && !processedProperties[property].consistent){
																consistent = false;
																break;  	
															}		 
														}
														if (!consistent){
															break;
														}
													}

											});											
											
										
										}
										//OC-947: checking whether the resources are consistent
										if (consistent && data.closePopup) {
											data.closePopup();
										}
										//OC-947: mark the resource as submitted
										$scope.submitted = true;
										
									});
								} else {
									if (response) {
											//Why is response an array here?
											var processedProperties = MetaModel.processProperties(response.data);
											if ($scope.resourcesToBindRef) {
												combinedResourcesProperties = angular.copy($scope.resourcesToBindRef);
											}
											combinedResourcesProperties.resourceToBind = angular.copy($scope.resourcesToBind);
											

											for (var ref2 in combinedResourcesProperties) {
												for (var prop in combinedResourcesProperties[ref2].properties){
													
													if (processedProperties[prop] && !processedProperties[prop].consistent){
														consistent = false;
														break;  	
													}		 
												}
												if (!consistent){
													break;
												}													
											}											
											
										}
									if (promises.length === 0 && index === payloadKeys.length-1) {
										if (data.callback) {
											$scope.execute({ 'method': data.callback});
										} 
										
										//OC-947: close the popup if there is no patches
										if (consistent && data.closePopup){
											data.closePopup();
										}
										//OC-947: mark the resource as submitted
										$scope.submitted = true;
									} 
								}
							});
						});
						if (payloadKeys.length === 0) {
							if (data.callback){
								$scope.execute({ 'method': data.callback});
							}
							//OC-947: close the popup if there is no patches
							if (data.closePopup) {
								data.closePopup();
							}

							//OC-947: mark the resource as submitted
							$scope.submitted = true;
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