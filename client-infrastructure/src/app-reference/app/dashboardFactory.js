'use strict';

/*
global app
*/

app.factory('dashboardFactory', function($rootScope){
	return {
		dashboardToQuote: function(resource){
			$rootScope.resourceUrl= resource.href;
			$rootScope.navigate('/screen/quote');
		}
	};
});