'use strict';

/*
global app
*/

app.factory('coverageFactory', function($rootScope, $location, resourceFactory){
	return {
		toOffer: function() {
			resourceFactory.refresh($rootScope.resourceUrl + '/operations/transferToOffer/status_report').then(function(response) {
				var data = response.data || response;
				if (data.consistent) {
					resourceFactory.post($rootScope.resourceUrl + '/operations/transferToOffer/execute', {}, $rootScope.headers).then(function(response) {
						$rootScope.resourceUrl = response.headers()['content-location'];
						$location.path('/screen/offer');
					});
				} else {
					$rootScope.errordata = data.messages;
					$rootScope.showError = true;
				}
			});
		},
		toQuote: function() {
			$location.path('/screen/quote');
		}
	};
});