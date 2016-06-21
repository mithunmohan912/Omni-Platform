'use strict';

/*
global app
*/

app.controller('TableController', function($browser, $scope, $rootScope, TableMetaModel, MetaModel, resourceFactory, $location, CheckVisibleService) {

    $scope.showResult = true;
    $scope.riskDataSet = [];
    $rootScope.rowCollection = {};

    $scope.loadTableMetadata = function() {
        TableMetaModel.load($scope.field.name, function(tableMetaData) {
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

    $scope.doActionItem = function(action, item, tableName,url) {
       
        var screenId = $rootScope.screenId;
        var regionId = $rootScope.regionId;
        $rootScope.resourceHref = item.href;
        
        var optionFlag = true;
        
        if (url !== undefined) {
            $rootScope.navigate(url);
        } else{
        MetaModel.actionHandling(item, $scope, regionId, screenId, action, resourceFactory,undefined, optionFlag); 
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
