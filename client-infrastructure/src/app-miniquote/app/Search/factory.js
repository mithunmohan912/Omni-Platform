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