'use strict';
/*
global app
*/
  

  //quote factory

    app.factory('quotefactory', ['$http','dataFactory','$rootScope','$log',function($http,dataFactory,$rootScope,log) {
   

    var quotefactory = {};
   
     quotefactory.get = function (url) {
        if(url=== undefined){

         var uri=$rootScope.screenId;
          url = $rootScope.HostURL + uri;
          console.log('current screen id' + uri);
          log.info('derived URL!!!' + url);
 }

 
       dataFactory.getData(url).success(function(){
       log.info('global options called'); 

        
});
        
    };

 return quotefactory;

}]);