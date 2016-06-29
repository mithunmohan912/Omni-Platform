'use strict';

/*
global app
*/

app.factory('dashboardFactory', function($rootScope, resourceFactory){
	return {
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
		createQuote: function(scope, actionURL, options, properties, defaultValues) {

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
		searchQuotes: function(scope, actionURL, options, properties) {
			if (scope.metamodelObject.resourceUrl) {
				var payload = {};
				for (var prop in properties) {
					if (properties[prop].value) {
						payload[prop] = properties[prop].value;
					}
				}
				localStorage.setItem('quotes_search_params', JSON.stringify(payload));
				if (Object.keys(payload).length > 0){
					resourceFactory.get(scope.metamodelObject.resourceUrl, payload);
				} else {
					resourceFactory.refresh(scope.metamodelObject.resourceUrl, payload);
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
		}
	};
});