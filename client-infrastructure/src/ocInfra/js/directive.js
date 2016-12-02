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
app.directive('formatDate', function($filter, $rootScope) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {

            var formatDate = $rootScope.dateOptions.dateFormatFilter || 'yyyy-MM-dd';

            // formatters sets the value from the model to the view

            modelCtrl.$formatters.unshift(function(modelValue) {
               
               if (modelValue){
                    return new Date(modelValue);
               } 
            });

            modelCtrl.$parsers.unshift(function(viewValue){

                if (viewValue && viewValue !== '') {
                    if(viewValue instanceof Date){
                        return $filter('date')(viewValue, formatDate);
                    }else{
                    
                        var inputDate = viewValue.split('/');  
                        // if(Number(inputDate[0])> 0 && Number(inputDate[0])< 32 && Number(inputDate[1]) > 0 && 
                        //   Number(inputDate[1]) < 13 && Number(inputDate[2]) > 1900 && Number(inputDate[1]) < 2031){
                        //     return $filter('date')(new Date(inputDate[2], inputDate[1] - 1, inputDate[0]), formatDate);
                        // }
                        if (inputDate[2].lenght > 2){
                          //european format
                          return $filter('date')(new Date(inputDate[2], inputDate[1] - 1, inputDate[0]), formatDate);
                        }else{
                          //American format
                          return $filter('date')(new Date(inputDate[0], inputDate[1] - 1, inputDate[2]), formatDate);
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

app.directive('aDisabled', function() {
    return {

      restrict: 'EAC',

      scope:{
        aconf: '='
      },

      controller: function($scope){
          $scope.atype = $scope.aconf.type;
      },
       
      link: function($scope, tElement) {
          //Disable ngClick
     

          $scope.$parent.$watch('currentPage', function(newValue) {
              switch($scope.atype) {
                case 'firstpage':
                    $scope.linkDisabled = (newValue===1);
                    break;
                case 'prevpage':
                    $scope.linkDisabled = (newValue===1);
                    break;
                case 'nextpage':
                    $scope.linkDisabled = ($scope.$parent.stItemsByPage-1 === newValue);
                    break;
                case 'lastpage':
                    $scope.linkDisabled = ($scope.$parent.stItemsByPage-1 === newValue);
                    break;            
                default:
                    void(0);
              }
          });
        

        /*
        var in $scope.$parent (sttable scope)
        currentPage
        stItemsByPage
        numPages
        */

        //Toggle "disabled" to class when aDisabled becomes true
        $scope.$watch('linkDisabled', function(newValue) {
            if (newValue !== undefined) {
                tElement.toggleClass('disabled', newValue);

                //Disable href on click
                tElement.on('click', function(e) {
                    if (newValue) {
                        e.preventDefault();
                    }
                });
            }
        });

        $scope.$on('disableGetBlock', function(event, params) {
            if (params.link==='prev' && $scope.atype === 'prevblock'){
              $scope.linkDisabled = params.value;
            }else if (params.link==='next' && $scope.atype === 'nextblock'){
              $scope.linkDisabled = params.value;
            }
        });

        //We need to let know the table that the pagination is listening to changes. 
        $scope.$emit('initPagination');
    
      }
    };
});