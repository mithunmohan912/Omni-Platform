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
		saveQuote: function(resource, properties){
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
					resourceFactory.patch(resourceURL, payloads[resourceURL]);
				}
			}
		}
	};
});