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

