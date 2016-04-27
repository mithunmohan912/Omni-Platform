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
app.directive('formatDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {
            // formatters sets the value from the model to the view
            
            modelCtrl.$formatters.push(function(modelValue) {
                if (modelValue) {
                    var date = new Date(modelValue);
                    modelCtrl.$modelValue = date;
                    return date;
                }
            });

        }
    };
});
