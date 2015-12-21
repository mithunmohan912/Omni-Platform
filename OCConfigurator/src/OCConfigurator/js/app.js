'use strict';

/* App Module */

/**
 * Declare app and router
 */

var app = angular.module('ux', ['ui.slider','ui.bootstrap','ngGrid','ngResource']). 
    config(['$routeProvider', function($routeProvider) {
      	$routeProvider.       
        when('/home', {templateUrl: 'partials/home.html', controller: HomeCtrl}). 
        when('/newAttr/:screenId/:ElementType', {templateUrl: 'partials/newattr.html', controller: NewattCtrl}).
        when('/OCConfigurator-preview/:screenId', {templateUrl: 'partials/OCConfigurator-preview.html', controller: PreviewCtrl}).
        when('/OCConfigurator-nb-main', {templateUrl: 'partials/OCConfigurator-nb-main.html', controller: CanvasCtrl}).
        when('/OCConfigurator-nb-main/:screenId', {templateUrl: 'partials/OCConfigurator-nb-main.html', controller: CanvasCtrl}).
        when('/OCConfigurator-nb-main/:screenId/:ElementType', {templateUrl: 'partials/OCConfigurator-nb-main.html', controller: CanvasCtrl}).             
        otherwise({redirectTo: '/home'});
      	
      	
      	
}]);


/**
 * Declare global vars and functions which will be available in $scope of controllers
 * @param {Object} $rootScope
 */
app.run(function($rootScope, $http, $modal) {

	//supporting partials used as templates
	$rootScope.sidebarTemplate = "partials/OCConfigurator-control-palette.html";	
	//$rootScope.propertyofControl = "partials/properties_controls.html";
	$rootScope.previewMetadata = "partials/metadata_preview.html";
	
	$rootScope.gridTemplate = "partials/grid.html";
	
    //for control palette in the left side  
    $http.get('data/controls.json').success(function(data) {	
    	$rootScope.controls = angular.fromJson(data.controls);
    });
    //for the properties palette in the right side
    $http.get('data/properties_controls.json').success(function(data) {	
    	$rootScope.properties =  angular.fromJson(data.properties);
    });
    //
    $rootScope.metamodel= {};  
    $rootScope.modalInstance;
    $rootScope.listURI ={};
    $rootScope.changeList;
    $rootScope.undoList = [];
    $rootScope.redoList = [];
    $rootScope.accessControldata=[];
    $rootScope.canvashint = '';
    $rootScope.openModal = function() {
    	//$('#myModal').modal({ show:true});
    	$rootScope.modalInstance = $modal.open({backdrop: 'static',
			windowClass : 'inProgressClass',
	        templateUrl : 'InProgress.html'});
    	
	};
	
	$rootScope.closeModal = function() {
		//$('#myModal').modal('hide');
		//$(".modal-backdrop").css("display","none")
		$rootScope.modalInstance.close();
		
	};
    
});

app.value('ui.config', {
    "sortable": {
        "axis": "y",
        "placeholder": "sortable-placeholder"
    }
});
