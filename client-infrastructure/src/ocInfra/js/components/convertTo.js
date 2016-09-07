'use strict';

/*
global app
*/

// OC-1027: enumeration type should be considered in the select component
app.directive('convertTo', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      if (attrs.convertTo === 'integer') {
        ngModel.$parsers.push(function(val) {
          return parseInt(val, 10);
        });
      }
    }
  }
});