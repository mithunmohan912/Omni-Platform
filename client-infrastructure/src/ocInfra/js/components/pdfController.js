'use strict';
/*global app*/

app.controller('pdfController', function($scope, $rootScope) {
   


    $scope.$on('pdf_update', function(event, params){

        $scope.pdfUrl = params.url;
        
    });
});
