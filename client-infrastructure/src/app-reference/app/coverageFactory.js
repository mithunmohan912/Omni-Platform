'use strict';

/*
global app
*/

app.factory('coverageFactory', function($rootScope, $location, resourceFactory){
	return {
		next: function(resource) {
			resourceFactory.refresh(resource.href + '/operations/transferToOffer/status_report').then(function(response) {
				var data = response.data || response;
				if (data.consistent) {
					resourceFactory.post(resource.href + '/operations/transferToOffer/execute', {}, $rootScope.headers).then(function(response) {
						$rootScope.resourceUrl = response.headers()['content-location'];
						$location.path('/screen/offer');
					});
				} else {
					$rootScope.errordata = data.messages;
					$rootScope.showError = true;
				}
			});
		},
		back: function() {
			$location.path('/screen/quote');
		}
	};
});