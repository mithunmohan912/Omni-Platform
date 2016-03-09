'use strict';
/*
global app
*/
  

  //resource -quotes factory
 app.factory('quotesfactory', ['$http','dataFactory','$rootScope','$log','growl',function($http,dataFactory,$rootScope,log,growl) {

   

    var quotesfactory = {};

    quotesfactory.init=function(){   
     // var linksarray=[];
      var url = $rootScope.HostURL + $rootScope.resourceId;
      var optiondataobj;
      dataFactory.options(url).success(function(data){

     var optionsMap= new Map();
     optiondataobj = data._options;
     var optionsArray= [];

     angular.forEach(optiondataobj, function(ref) {
       
        var key=  ref.rel;
        var value = ref.href;
        //var schema = ref.schema;
        optionsArray[value]=ref;
        optionsMap.set(key, value);
      }); 
      $rootScope.optionData = optionsArray;
      $rootScope.optionsMap = optionsMap;
         
   });

       

      



return dataFactory.getData(url).success(function(data){
       
       
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
      return dataFactory.getData(url).success(function(){
       log.info('global options called'); 
            });
        
    };


    quotesfactory.add=function(url,payLoad){
      
     return dataFactory.insert(url,payLoad).success(function(data){
       
       growl.addSuccessMessage(data.message);
        });


    };
 return quotesfactory;
}]);
