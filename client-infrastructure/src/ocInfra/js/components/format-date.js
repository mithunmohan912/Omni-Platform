'use strict';

/*
global app
*/

app.directive('formatDate', function($filter) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelController) {
            modelController.$parsers.push(function(viewValue){
                return $filter('date')(viewValue, 'yyyy-MM-dd');
            });
        }
    };
});