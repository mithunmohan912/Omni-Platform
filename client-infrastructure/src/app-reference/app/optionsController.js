'use strict';

/*
global app, column
*/

app.controller('OptionsController', [ '$scope', function($scope){

	function init(){
		$scope.optionsTable = [];

		var allOptions = [];

		for(var item in $scope.resourcesToBind[column.id].items){
			allOptions = allOptions.concat($scope.resultSet[item.href].properties.options_table.value);
		}

		$scope.optionsTable = allOptions;
	}

	console.error($scope.resultSet);
	console.error($scope.resourcesToBind);

	$scope.$watch('resourcesToBind', function(newValue){
		if(newValue) {
			init();
		}
	}, true);

	$scope.$watch('resultSet', function(newValue){
		if(newValue) {
			init();
		}
	}, true);
}]);
