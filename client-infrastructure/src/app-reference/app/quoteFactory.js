'use strict';

/*
global app
*/

app.factory('quoteFactory', function($rootScope, $location, resourceFactory){

	function getOperationsResource(properties){
		var urls = {};
		for(var key in properties){
			if (properties[key].self.indexOf('operations') > -1){
				urls[properties[key].self] = properties[key].self;
			}
		}
		return urls;
	}

	return {
		toCoverage: function(resource) {
			$rootScope.resourceUrl = resource.href;
			$location.path('/screen/coverage');
		},
		back: function() {
			$rootScope.resourceUrl = null;
			$location.path('/screen/dashboard');
		},
		saveQuote: function(/*resource, properties, callback*/){
			/*var payloads = {};
			if (properties) {
				for(var key in properties){
					if(properties[key] && properties[key].self){
						var href = properties[key].self;
						payloads[href] = payloads[href] || {};
						if (properties[key].editable) {
							payloads[href][key] = properties[key].value;
						}
					}
				}

				Object.keys(payloads).forEach(function(resourceURL){
					resourceFactory.patch(resourceURL, payloads[resourceURL]).then(function() {
						if (callback) {
							callback();
						}
					});
				});
			}*/
			$rootScope.$broadcast('patch_renderer', {save: true});
		},
		searchByName: function(element){

			var url = '';

			return element.field.getParentResource().then(function(response){
				var data = response.data || response;
				if (data){
					if (data['quote_owner:type'] === 'Personne'){
						url = $rootScope.hostURL + 'persons?_num=30&person:last_name='+element.$viewValue;
					}else{
						url = $rootScope.hostURL + 'organizations?_num=30&organization:legal_name='+element.$viewValue;
					}
				}

				return resourceFactory.get(url).then(function(response){
					var data = response.data || response;
					return data._links.item;
				
				});
			});	
		},
		selectPersonOrg: function(element){

			var payload = {};
			var link = '';

			return element.field.getParentResource().then(function(response){
				var data = response.data || response;
				if (data){
					if (data['quote_owner:type'] === 'Personne'){
						link = 'quote_owner:person_link';
					}else{
						link = 'quote_owner:organization_link';
					}

					payload[link] = element.$item.href;
					resourceFactory.patch(element.property.self, payload).then(function() {
						//update dependencies
						$rootScope.$broadcast('refreshTable', { name: 'quote_risk_owner_list'});
						$rootScope.$broadcast('refreshTable', { name: 'quote_driver_list'});
					
					});
					
				}

			});	
		},
		callbackQuoteOwner: function(resource, properties) {

			//We need to check ifsome operations resource has been patched. In that case we have to call 
			//execute to confitrm this resource. 
			var operationsURL = getOperationsResource(properties);
			Object.keys(operationsURL).forEach(function(key){
				resourceFactory.post(operationsURL[key] + '/execute', {}, $rootScope.headers).then(function(response) {
					resourceFactory.get(operationsURL[key]).then(function(response) {
						resourceFactory.refresh(response.data._links.up.href);
					});
					resourceFactory.refresh(response.data._links.up.href);
					resourceFactory.refresh(resource.href);
				});
			});
			

			//update dependencies
			$rootScope.$broadcast('refreshTable', { name: 'quote_risk_owner_list'});
			$rootScope.$broadcast('refreshTable', { name: 'quote_driver_list'});
		},
		addAddress: function(params){
			if (params && params.dependencies){
				var personUrl;
				for(var i=0; i< params.dependencies.length; i++){
					if(params.dependencies[i].resource === 'quote_owner:person_link'){
						personUrl = params.dependencies[i].href;
						break;
					}
				}

				if(personUrl){
					resourceFactory.post(personUrl + '/operations/createPostalAddress', {}, $rootScope.headers).then(function(response){
						if (response){

							resourceFactory.refresh(personUrl + '/operations/createPostalAddress', {}, $rootScope.headers).then(function(response){
								if (response){
									$rootScope.$broadcast('refreshPopUp', { name: 'quote_owner'});
								}
							});
						}
					});	
				}
			}

		},

		/*
		Check the existence of temporary resources and remove them just in case. 
		*/
		closeOwnerPopUp: function(params, resourceToRender){
			if (resourceToRender){
				var postalCode = resourceToRender['postal_address:postal_code'];
				//If editable means that it is a new 
				if(postalCode && postalCode.editable){
					resourceFactory.get(postalCode.self).then(function(response){
						var parentResource = response.data._links.up.href;
						resourceFactory.delete(postalCode.self, {}, $rootScope.headers).then(function(response){
							if (response){
								//Refresh the Person/XXXX/Operations/CreatePostalAddress resource
								resourceFactory.refresh(parentResource);
								//Refresh the quoteOwner resource
								resourceFactory.refresh(params.href);
							}
						});

						
					});
					
				}
			}
		},
		searchVehicleMake: function(element) {
			var url = $rootScope.hostURL + 'referential_vehicle_makes?referential_vehicle:make='+element.$viewValue;
			return resourceFactory.get(url).then(function(response) {
				var data = response.data || response;
				return data._links.item;
			});
		}

	};
});