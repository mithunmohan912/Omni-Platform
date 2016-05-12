'use strict';

/*
global app
*/

app.factory('dashboardFactory', function($rootScope){
	return {
		dashboardToQuote: function(item){
			$rootScope.resourceUrl = item.href;
			$rootScope.navigate('/screen/quote');
		}
	};
});