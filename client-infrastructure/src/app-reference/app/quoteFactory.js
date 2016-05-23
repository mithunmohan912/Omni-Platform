'use strict';

/*
global app
*/

app.factory('quoteFactory', function($rootScope, $location, resourceFactory){
	return {
		next: function(resource) {
			$rootScope.resourceUrl = resource.href;
			$location.path('/screen/coverage');
		},
		back: function() {
			$rootScope.resourceUrl = null;
			$location.path('/screen/dashboard');
		},
		saveQuote: function(resource, properties, callback){
			var payloads = {};
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

				for(var resourceURL in payloads){
					resourceFactory.patch(resourceURL, payloads[resourceURL]).then(function(response) {
						if (callback) {
							callback();
						}
					});
				}
			}
		},
		searchByName: function(element){

			var url = "";

			return element.field.getParentResource(element.field.property.self).then(function(response){
				var data = response.data || response;
				if (data){
					if (data['quote_owner:type'] === 'Personne'){
						url = $rootScope.HostURL + 'persons?_num=30&person:last_name='+element.$viewValue;
					}else{
						//ORG????
						// url = $rootScope.HostURL + 'persons?_num=30&person:name='+element.$viewValue;
					}
				}

				return resourceFactory.get(url).then(function(response){
					var data = response.data || response;
					return data._links.item;
				
				});
			});	
		},
		selectPerson: function(element){

			var payload = {};
			var link = "";

			return element.field.getParentResource(element.field.property.self).then(function(response){
				var data = response.data || response;
				if (data){
					if (data['quote_owner:type'] === 'Personne'){
						link = "quote_owner:person_link"
					}else{
						link = "quote_owner:organization_link"
					}

					payload[link] = element.$item.href;
					resourceFactory.patch(element.property.self, payload).then(function(response) {
						//update dependencies
						$rootScope.$broadcast('refreshTable', { name: 'quote_risk_owner_list'});
						$rootScope.$broadcast('refreshTable', { name: 'quote_driver_list'});
					
					});
					
				}

			});	
		},
		callbackQuoteOwner: function(resource) {
			//update dependencies
			$rootScope.$broadcast('refreshTable', { name: 'quote_risk_owner_list'});
			$rootScope.$broadcast('refreshTable', { name: 'quote_driver_list'});
		}

	};
});