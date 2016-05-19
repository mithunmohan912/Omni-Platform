'use strict';

/*
global app
*/

app.factory('coverageFactory', function($rootScope, $location){
	return {
		back: function() {
			$location.path('/screen/quote');
		}
	};
});