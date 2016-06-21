'use strict';

/*
global app
*/

app.factory('offerFactory', function($rootScope, resourceFactory){
	return {
		back: function() {
			resourceFactory.get($rootScope.resourceUrl).then(function(response) {
				if (response.data._links) {
					if ('contract:quote' in response.data._links) {
						$rootScope.resourceUrl = response.data._links['contract:quote'].href;
						$rootScope.navigate('/screen/coverage');
					}
				}
			});
		},
		callbackPartyRole: function(resource){
			var partyRole = resource.data._links.self.href;
			var payload = { 'offer' : $rootScope.resourceUrl };
			resourceFactory.post($rootScope.hostURL + 'persons', payload, $rootScope.headers).then(function(response) {
				var person = response.data._links.self.href;
				var payload = { 'party_role:person': person };
				resourceFactory.patch(partyRole, payload);
				var address = response.data._links['person:postal_address_list'].href;
				resourceFactory.post(address, {}, $rootScope.headers);
			});
		}
	};
});