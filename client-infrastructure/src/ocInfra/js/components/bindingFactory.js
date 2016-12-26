'use strict';

/*
global app
*/

app.factory('bindingFactory', function(MetaModel, $rootScope){

	var resourceToBindDirectory = resourceToBindDirectory || {} ;

	function _setResourceToBindDirectory(metamodel,  resourceToBind){
		if (metamodel){
			resourceToBindDirectory[metamodel] = resourceToBind;
		}
	}

	function _getResourceToBindDirectory(metamodel){
		return resourceToBindDirectory[metamodel];
		}


	function _populateResourceToBind($scope, metamodelName, resultSet){

		if (_.isEmpty($scope)){
			$scope.metamodelObject = $rootScope.metamodel[metamodelName];
			$scope.resourcesToBind = resultSet;
			$scope.resourcesToBind.properties = {};
		}


		$scope.boundUrls = [];
		$scope.boundUrls.push($scope.resourceUrl);
		//This var will contain the properties names. In case we found the same property in different resources, we keep the one defined first in metamodel
		$scope.propertiesCollection = [];
		var searchIdsInAttributes = function(property) {
								if (property.id && !Array.isArray(property.id)){
									property.id = [property.id];
								}
								savePropertyInResourcesToBind(property, $scope);
							};
		// Extract the urls of the properties we have bound, so we can then update the view when any of those properties gets updated		
		for(var i = 0; i < $scope.metamodelObject.sections.length; i++){
			// We don't want to process sections of type 'reference' because they will be processed by its own instance of the renderer directive
			if(!$scope.metamodelObject.sections[i].type || $scope.metamodelObject.sections[i].type !== 'reference') {
				for(var j = 0; j < $scope.metamodelObject.sections[i].properties.length; j++){

					if (!$scope.metamodelObject.sections[i].properties[j].uiInput) {
						savePropertyInResourcesToBind($scope.metamodelObject.sections[i].properties[j], $scope); 
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

		
		_setResourceToBindDirectory(($scope.metamodel?$scope.metamodel:$scope.metamodelObject.name), $scope.resourcesToBind);


	}


	function savePropertyInResourcesToBind(property, $scope) {
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
					if (resourceSelected.resource && typeof $scope.resourcesToBind[resourceSelected.resource]!== 'undefined' && property.id[k] in $scope.resourcesToBind[resourceSelected.resource].properties){

		                var id = property.id[k];
				        if (!$scope.resourcesToBind.properties[id]){
	                        $scope.resourcesToBind.properties[id] = 
	                        $scope.resourcesToBind[resourceSelected.resource].properties[id];
	                    }else{
	                         angular.extend( $scope.resourcesToBind.properties[id], $scope.resourcesToBind[resourceSelected.resource].properties[id]);
                      	}

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


	return {
		'setResourceToBindDirectory': _setResourceToBindDirectory,
		'getResourceToBindDirectory': _getResourceToBindDirectory,
		'populateResourceToBind':_populateResourceToBind

	};
});