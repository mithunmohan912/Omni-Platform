'use strict';

/*
global app
*/

app.controller('TableController', function($browser, $scope, $rootScope, TableMetaData,$location, CheckVisibleService) {

    $scope.showResult = true;
    $scope.riskDataSet = [];
    $rootScope.rowCollection = {};

    $scope.loadTableMetadata = function() {
        TableMetaData.load($scope.field.name, function(tableMetaData) {
            $scope.field.tableMetaData = tableMetaData;           
        });
    };

   $scope.checkShow = function(opt) {
        if (opt.visibleWhen) {
            return CheckVisibleService.checkVisible(opt, $scope);
        }

        if (opt.visibleflag === undefined) {
            return true;
        }

        if ( $rootScope.config[opt.visibleflag] === undefined || $rootScope.config[opt.visibleflag] === true) {
            return true;
        } else {
            return false;
        }

    };

    $scope.doActionItem = function(actionType, item, tableName,url) {
       
        var field;
        if (actionType === 'edit') {
         $rootScope.resourceHref = item.href;
		 $rootScope.navigate(url);
        } else if (actionType === 'delete') {
            field = angular.element($('#' + tableName)).scope().field;
            $scope.deleteRow(item, field);
        } else if (actionType === 'inquire') {
            $rootScope.resourceHref = item.href;
            $rootScope.navigate(url);
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
