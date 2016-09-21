'use strict';

/*
global app
*/

// OC-1027: enumeration type should be considered in the select component
app.directive('convertTo', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      if (attrs.convertTo === 'integer' || attrs.convertTo === 'number') {
        ngModel.$parsers.push(function(val) {
          return parseInt(val, 10);
        });
        ngModel.$formatters.push(function(val) {
             var str = '';
             if(val){
                 str = val.toString();
             }
          return str;
        });

      }
    }
  }
});