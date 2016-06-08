'use strict';

/*
global app
*/

app.factory('dashboardFactory', function($rootScope, resourceFactory){
	return {
		dashboardToQuote: function(resource){
			$rootScope.resourceUrl= resource.href;
			$rootScope.navigate('/screen/quote');
		},
		createQuote: function() {
			//example car
			var payload = {
				'quote:distributor_id': "998877", 
				'quote:product_id': "MC011"
			}
			resourceFactory.post($rootScope.hostURL+'quotes', payload, $rootScope.headers).then(function(response) {
				$rootScope.resourceUrl= response.data._links.self.href;
				$rootScope.navigate('/screen/quote');
			});	
		},
		searchQuotes: function(resource, properties) {
			var payload = {};
			for (var prop in properties) {
				if (properties[prop].value) {
					payload[prop] = properties[prop].value;
				}
			}
			resourceFactory.refresh(resource.href, payload);
		}
	};
});