'use strict';

/*
global app
*/

// OC-1027: enumeration type should be considered in the select component
app.directive('convertTo', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      var convertToType = attrs.convertTo;
      //Sometimes the convertToDirective is processed before the input directive and the value
      //bound to the convertTo directive is still not ready
      convertToType = convertToType==='' ? scope.property.metainfo.type : convertToType;

      if (convertToType === 'integer' || convertToType === 'number') {
        ngModel.$parsers.push(function(val) {
          return parseInt(val, 10);
        });
        ngModel.$formatters.push(function(val) {
             var str = '';
             if(angular.isDefined(val) && val !== null){
                 str = val.toString();
             }
          return str;
        });

      }
    }
  };
});