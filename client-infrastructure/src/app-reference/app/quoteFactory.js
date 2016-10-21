'use strict';

/*
global app
*/

app.factory('quoteFactory', function($rootScope, $location, resourceFactory, $resource, $http, pdfFactory){

	function _getOperationsResource(properties){
		var urls = {};
		for(var key in properties){
			if (properties[key].self.indexOf('operations') > -1){
				urls[properties[key].self] = properties[key].self;
			}
		}
		return urls;
	}

	return {

		showAlert: function(params, resp){
			console.log('Success Response in captcha functionality [Code:'+ params +resp);
		},

		toCoverage: function() {
			$location.path('/screen/coverage');
		},
		back: function() {
			$location.path('/screen/dashboard');
		},
		saveQuote: function(){
			$rootScope.$broadcast('patch_renderer', {name: 'quote', resourceUrl: $rootScope.resourceUrl});
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
						$rootScope.$broadcast('refresh_table', { name: 'quote_risk_owner_list'});
						$rootScope.$broadcast('refresh_table', { name: 'quote_driver_list'});
					
					});
					
				}

			});	
		},
		callbackQuoteOwner: function(params) {

			//We need to check ifsome operations resource has been patched. In that case we have to call 
			//execute to confitrm this resource. 
			var operationsURL = _getOperationsResource(params.properties);
			Object.keys(operationsURL).forEach(function(key){
				resourceFactory.post(operationsURL[key] + '/execute', {}, $rootScope.headers).then(function(response) {
					resourceFactory.get(operationsURL[key]).then(function(response) {
						resourceFactory.refresh(response.data._links.up.href);
					});
					resourceFactory.refresh(response.data._links.up.href);
					resourceFactory.refresh(params.scope.resourceUrl);
				});
			});
			

			//update dependencies
			$rootScope.$broadcast('refresh_table', { name: 'quote_risk_owner_list'});
			$rootScope.$broadcast('refresh_table', { name: 'quote_driver_list'});
		},
		addAddress: function(params){

			if (params && params.scope.resultSet[params.scope.resourceUrl] &&
				params.scope.resultSet[params.scope.resourceUrl].dependencies){
				var dependencies = params.scope.resultSet[params.scope.resourceUrl].dependencies;
				var personUrl;
				for(var i=0; i< dependencies.length; i++){
					if(dependencies[i].resource === 'quote_owner:person_link'){
						personUrl = dependencies[i].href;
						break;
					}
				}

				if(personUrl){
					resourceFactory.post(personUrl + '/operations/createPostalAddress', {}, $rootScope.headers).then(function(response){
						if (response){
							resourceFactory.refresh(personUrl + '/operations/createPostalAddress', {}, $rootScope.headers).then(function(response){
								if (response){
									$rootScope.$broadcast('refresh_popUp', { name: 'quote_owner'});
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
		closeOwnerPopUp: function(params){
			if (params.properties){
				var postalCode = params.properties['postal_address:postal_code'];
				//If editable means that it is a new 
				if(postalCode && postalCode.editable){
					resourceFactory.get(postalCode.self).then(function(response){
						var parentResource = response.data._links.up.href;
						resourceFactory.delete(postalCode.self, $rootScope.headers).then(function(response){
							if (response){
								//Refresh the Person/XXXX/Operations/CreatePostalAddress resource
								resourceFactory.refresh(parentResource);
								//Refresh the quoteOwner resource
								resourceFactory.refresh(params.scope.resourceUrl);
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
		},

		getPDF: function(element, scope){
			//TODO extract the url and send it as parameter
			pdfFactory.getPDF(element, scope);
		},

		savePDF: function(){
			pdfFactory.savePDF($rootScope.pdfBlob, 'OCPDF.pdf');
		},

		printPDF: function(){
			pdfFactory.printPDF($rootScope.pdfUrl);

		},
		callbackQuoteRisk: function() {
			console.log('callbackQuoteRisk');
		},
		changeQuoteData: function(params) {
			params.scope.itemSelected[params.inputComponent.name] = { href : $rootScope.resourceUrl };
		},
		resetOwnerPopUp: function(params) {
			var payloads = {};
			var links = ['quote_owner:person_link', 'quote_owner:organization_link'];
			if (params.dependencies) {
			 	for(var key in links){
			 		for(var dependency in params.dependencies) {
						if(dependency.resource === links[key]){
							payloads[links[key]] = '';
						}
			 		}
					
				}
				resourceFactory.patch(params.href, payloads).then(function() {
				});
			}
		}

	};
});