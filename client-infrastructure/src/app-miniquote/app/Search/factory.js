'use strict';
/*
global app
*/
  

  //quote factory
 app.factory('quotesfactory', ['$http','resourceFactory','$rootScope','$log','growl',function($http,resourceFactory,$rootScope,log,growl) {
   

    var quotesfactory = {};

    quotesfactory.init=function(){
      var uri=$rootScope.screenId;
      var url = $rootScope.HostURL + uri;
      return resourceFactory.getData(url).success(function(data){
        log.info('global options called'+data); 
      });

    };
  
    quotesfactory.get = function (url) {
      if(url=== undefined){
        var uri=$rootScope.screenId;
        url = $rootScope.HostURL + uri;
        console.log('current screen id' + uri);
        log.info('derived URL!!!' + url);
      }
      return resourceFactory.getData(url).success(function(){
        log.info('global options called'); 
      });
    };

    quotesfactory.add=function(url,payLoad){
      
     return resourceFactory.insert(url,payLoad).success(function(data){
       
       growl.addSuccessMessage(data.message);
        });


    };
 return quotesfactory;
}]);


app.factory('dashboardfactory', ['$http','resourceFactory','$rootScope','$log','growl',function($http,resourceFactory,$rootScope,log,growl) {
   growl.addSuccessMessage('hi');  

    var dashboardfactory = {};

    dashboardfactory.init=function(){

      
        var url1 = $rootScope.HostURL + 'quotes';

     return resourceFactory.getData(url1).success(function(){
       //$scope.displayed= data;
       
       
          });

    };
  
     
   
 return dashboardfactory;
}]);


app.factory('quotescreatefactory', ['$http','resourceFactory','$rootScope','$log','growl', '$injector', function($http,resourceFactory,$rootScope,log,growl, $injector) {
   

    var quotescreatefactory = {};

    quotescreatefactory.init=function($scope, methodName, fieldName){
      console.log('Invoke -- '+methodName + ' with params -- '+fieldName);
      if(methodName!==undefined){
      (eval(methodName))($scope, fieldName);
       }
     }; 

    function EditCovA($scope, fieldName){
        console.log('changeFields routine invoked with param--'+fieldName); 
        //growl.success('changeFields routine invoked with param--'+fieldName);
        console.log('data entered by user--'+$scope.data[fieldName]);
        if (!NumericCheck($scope,fieldName)){
        $scope.data["quote-homeLineBus-dwell-cov|3-lim-formCurrAmt-amt"]=Math.round($scope.data[fieldName] * .1);
        $scope.data["quote-homeLineBus-dwell-cov|4-lim-formCurrAmt-amt"]=Math.round($scope.data[fieldName] * .5);
        $scope.data["quote-homeLineBus-dwell-cov|5-lim-formCurrAmt-amt"]=Math.round($scope.data[fieldName] * .2);
      }

        //var changeField1 = "quote-persPolicy-locmcopco";
        //$scope.data[changeField1] = '000505';
        //$scope.data["quote-insured|1-party-nameInfo-personName-givenName"]="Arpit";
        //invoke a service - add your custom code to value other fields on the screen
    };

  function isNumeric($scope,str) {
      return str.match(/^[ ]*[+-]?\d*\.?\d+[ ]*$/);
  }

  function NumericCheck($scope,fieldName) {
        
        if (!isNumeric($scope,$scope.data[fieldName])) 
        {
          $scope.data[fieldName]="0";
          growl.error("Coverage Amount must be numeric");
          return true;
        }
        if ($scope.data[fieldName] < 0) 
        {
          $scope.data[fieldName]="0";
          growl.error("Coverage Amount must be greater than 0");
          return true;
        }
        else return false;
      }

   function EditForm($scope,fieldName){

    if ($scope.data[fieldName] == '4') {
          $scope.data["quote-homeLineBus-dwell-cov|2-lim-formCurrAmt-amt"] = 0;
          $scope.data["quote-homeLineBus-dwell-cov|3-lim-formCurrAmt-amt"] = 0;
          $scope.data["quote-homeLineBus-dwell-cov|5-lim-formCurrAmt-amt"]="";
          $scope.data["quote-homeLineBus-dwell-cov|4-lim-formCurrAmt-amt"]="";
          return true;
          }

     if ($scope.data[fieldName] == '6') {
          
          if ($scope.data["quote-homeLineBus-dwell-cov|2-lim-formCurrAmt-amt"] == "0" || $scope.data["quote-homeLineBus-dwell-cov|2-lim-formCurrAmt-amt"] == "" || $scope.data["quote-homeLineBus-dwell-cov|2-lim-formCurrAmt-amt"] == undefined) {
          $scope.data["quote-homeLineBus-dwell-cov|2-lim-formCurrAmt-amt"] = 1000;
          }
          
          $scope.data["quote-homeLineBus-dwell-cov|3-lim-formCurrAmt-amt"] = 0;
          $scope.data["quote-homeLineBus-dwell-cov|4-lim-formCurrAmt-amt"]="";
          
          
          $scope.data["quote-homeLineBus-dwell-cov|5-lim-formCurrAmt-amt"] = Math.round(.4 * $scope.data["quote-homeLineBus-dwell-cov|3-lim-formCurrAmt-amt"]);
             
          
          return true;
          }     

          $scope.data["quote-homeLineBus-dwell-cov|2-lim-formCurrAmt-amt"] = "";
          $scope.data["quote-homeLineBus-dwell-cov|3-lim-formCurrAmt-amt"] = "";
          $scope.data["quote-homeLineBus-dwell-cov|5-lim-formCurrAmt-amt"]="";
          $scope.data["quote-homeLineBus-dwell-cov|4-lim-formCurrAmt-amt"]="";

          return true;
   }   

   function CalculateExpDt($scope,fieldName){
      var EffDate = new Date($scope.data["quote-persPolicy-contractTerm-effDt"]);
      var year = EffDate.getFullYear();
      if(isNaN(year))
      {
        return false;
      }
      var month;
      var date;
      var TermAmount = $scope.data["quote-persPolicy-polTermMon"];

      if (TermAmount == 12 ) {
        date = "" + EffDate.getDate();
        month = "" + (EffDate.getMonth() + 1);
        year += 1;
        EffDate.setYear(year);
        if (date == 29 && month == 2) {
            date = "28";
            month = "02";
        }
        if (month.length == 1) month = "0" + month;

        if (date.length == 1) date = "0" + date;
        var expdt=month + "/" + date + "/" + EffDate.getFullYear();
        $scope.data["quote-persPolicy-contractTerm-expDt"]=new Date(expdt);
      }

      if (TermAmount == 3) {
          month = "" + (EffDate.getMonth() + 4);
          if (month.length == 1) month = "0" + month;
          if (month > 12) {
            month = month - 12;
            month = "0" + month;
            year += 1;
          }
          EffDate.setYear(year);
          date = "" + EffDate.getDate();

          if (date.length == 1) date = "0" + date
          var expdt=month + "/" + date + "/" + EffDate.getFullYear();
          $scope.data["quote-persPolicy-contractTerm-expDt"]=new Date(expdt);
        }

        if (TermAmount == 6) {
          month = "" + (EffDate.getMonth() + 7);
          if (month.length == 1) month = "0" + month;
          if (month > 12) {
            month = month - 12;
            month = "0" + month;
            year += 1;
          }
          EffDate.setYear(year);
          date = "" + EffDate.getDate();

          if (date.length == 1) date = "0" + date
          var expdt=month + "/" + date + "/" + EffDate.getFullYear();
          $scope.data["quote-persPolicy-contractTerm-expDt"]=new Date(expdt);
        }
   }

   function CalculateQuoteLen($scope,fieldName){
     if(isNumeric($scope,$scope.data[fieldName])){
        if($scope.data[fieldName].length==7){
          return true;
        }else{
          growl.error("Quote number should be of 7 digits");
        }
       }else{
          growl.error("Quote number should be numeric");
      }
   }
 return quotescreatefactory;
}]);