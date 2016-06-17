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
		createQuote: function() {
			//example car
			var payload = {
				'quote:distributor_id': '998877', 
				'quote:product_id': 'MC011'
			};
			resourceFactory.post($rootScope.hostURL+'quotes', payload, $rootScope.headers).then(function(response) {
				$rootScope.resourceUrl= response.data._links.self.href;
				$rootScope.navigate('/screen/quote');
			});	
		},
		searchQuotes: function(resource, properties) {
			if (resource.href) {
				var payload = {};
				for (var prop in properties) {
					if (properties[prop].value) {
						payload[prop] = properties[prop].value;
					}
				}
				resourceFactory.refresh(resource.href, payload);
			} else {
				resourceFactory.execute($rootScope.hostURL+'quotes', {}, {}, 'OPTIONS').then(function(response) {
					for (var link in response.data.links) {
						if (response.data.links[link].rel === 'search') {
							$rootScope.resourceUrl= response.data.links[link].href;
							break;
						}
					}
				});
			}
		}
	};
});