'use strict';
/*global app*/

app.controller('pdfController', function($scope) {
   


    $scope.$on('pdf_update', function(event, params){

        $scope.pdfUrl = params.url;
        
    });
});
