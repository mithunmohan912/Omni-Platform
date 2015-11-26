'use strict';

/*
global app
*/

app.controller('TableController', function($browser, $scope, $rootScope, TableMetaData,$location) {

    $scope.showResult = true;
    $scope.riskDataSet = [];
    $rootScope.rowCollection = {};

    $scope.loadTableMetadata = function() {
        TableMetaData.load($scope.field.name, function(tableMetaData) {
            $scope.field.tableMetaData = tableMetaData;           
        });
    };

   
    $scope.doActionItem = function(actionType, item, tableName,url) {
       
        var field;
        if (actionType === 'edit') {
         $rootScope.resourceHref = item._link.self.href;
		 $rootScope.navigate(url);
        } else if (actionType === 'delete') {
            field = angular.element($('#' + tableName)).scope().field;
            $scope.deleteRow(item, field);
        }
    };
	
    $scope.loadTableMetadata();	
	
	
	$scope.editItem = function(item, url) {
		 $rootScope.resourceHref = item._link.self.href;
		 $rootScope.navigate(url);
       };
	   
	$scope.selectItem = function(item, url) {
		 $rootScope.resourceHref = item._link.self.href;
		 $rootScope.navigate(url);
       };   
	
   $rootScope.navigate = function(url) {
	        $location.path(url);
    };
   
});
