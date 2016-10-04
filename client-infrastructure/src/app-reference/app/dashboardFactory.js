
'use strict';

/*
global app
*/

app.factory('dashboardFactory', function($rootScope, resourceFactory){
	return {
		isRequired: function req(){
			// just logging to see how many times the bound function is executed
			req.memo = (req.memo !== undefined) ? req.memo : 1;
			console.log(req.memo++);

			return true;
		},
		dashboardToQuote: function(resource){
			resourceFactory.get(resource.href).then(function(response) {
				if (response.data._links) {
					if ('quote:offer' in response.data._links) {
						$rootScope.resourceUrl = response.data._links['quote:offer'].href;
						$rootScope.navigate('/screen/offer');
					} else {
						$rootScope.resourceUrl= resource.href;
						$rootScope.navigate('/screen/quote');
					}
				}
			});
			
		},
		createQuote: function(params) {
			var properties = params.properties;
			var defaultValues = params.defaultValues;

			//Default values:
			var payload = {};
			for (var key in properties) {
				if (properties[key].value) {
					payload[key] = properties[key].value;
				} else if (defaultValues[key] && defaultValues[key].value) {
					payload[key] = defaultValues[key].value;
				}
			}
			resourceFactory.post($rootScope.hostURL+'quotes', payload, $rootScope.headers).then(function(response) {
				$rootScope.resourceUrl= response.data._links.self.href;
				$rootScope.navigate('/screen/quote');
			});	
		},
		searchQuotes: function(params) {
			var scope = params.scope;
			var properties = params.properties;

			if (scope.resourceUrl) {
				var payload = {};
				for (var prop in properties) {
					if (properties[prop].value) {
						payload[prop] = properties[prop].value;
					}
				}
				sessionStorage.setItem('quotes_search_params', JSON.stringify(payload));
				if (Object.keys(payload).length > 0){
					resourceFactory.get(scope.resourceUrl, payload);
				} else {
					resourceFactory.refresh(scope.resourceUrl, payload);
				}
			} else {
				resourceFactory.execute($rootScope.hostURL+'quotes', {}, $rootScope.headers, 'OPTIONS').then(function(response) {
					for (var link in response.data.links) {
						if (response.data.links[link].rel === 'search') {
							$rootScope.resourceUrl= response.data.links[link].href;
							break;
						}
					}
				});
			}
		},
		deleteQuote: function(resource) {
			resourceFactory.delete(resource.href);
		},
		isIdEditable: function(resource) {
			var edit = true;
			return edit;
		}
	};
});