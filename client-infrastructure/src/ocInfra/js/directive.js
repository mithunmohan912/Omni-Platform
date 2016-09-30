'use strict';

/*
global app
*/


app.directive('ocLogodir', function() {
  return {
  	  restrict: 'E',
      template: '<div class="oc-logo" style="margin-left: auto;margin-right: auto;"></div>'
  };
});
app.directive('formatDate', function($filter) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {
            // formatters sets the value from the model to the view

            modelCtrl.$formatters.unshift(function(modelValue) {
               
               if (modelValue){
                    return new Date(modelValue);
               } 
            });

            modelCtrl.$parsers.unshift(function(viewValue){

                if (viewValue && viewValue !== '') {
                    if(viewValue instanceof Date){
                        return $filter('date')(viewValue, 'yyyy-MM-dd');
                    }else{
                    
                        var inputDate = viewValue.split('/');                        
                        if(Number(inputDate[0])> 0 && Number(inputDate[0])< 32 && Number(inputDate[1]) > 0 && 
                          Number(inputDate[1]) < 13 && Number(inputDate[2]) > 1900 && Number(inputDate[1]) < 2031){
                            return $filter('date')(new Date(inputDate[2], inputDate[1] - 1, inputDate[0]), 'yyyy-MM-dd');
                        }
                    }
                }
            });
        }
    };
});


app.directive('getblock', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {

            elem.bind('click', function() {
              scope.$emit('getBlock',attr.getblock);
              });
        }
    };
  });
