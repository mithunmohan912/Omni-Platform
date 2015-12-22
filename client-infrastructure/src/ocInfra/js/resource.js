'use strict';
/*
global app
*/

    app.factory('dataFactory', ['$http', function($http) {

    var dataFactory = {};

    dataFactory.getData = function (urlBase) {
        return $http.get(urlBase);
    };

    dataFactory.search = function (urlBase,id) {
        return $http.get(urlBase + '/' + id);
    };

    dataFactory.insert = function (urlBase,obj) {

        return $http.post(urlBase, obj);
    };

    dataFactory.update = function (urlBase,obj) {
        return $http.put(urlBase + '/' + obj.id, obj);
    };

    dataFactory.delete = function (urlBase,id) {
        return $http.delete(urlBase + '/' + id);


    };

     dataFactory.options=function(urlBase){

   return $http(
            {
                method : 'OPTIONS',
                url : urlBase,
            }
        );    
   
};

dataFactory.patch = function (urlBase,obj) {
        return $http.patch(urlBase + '/' + obj.id, obj);
    };

 return dataFactory;

}]);


    //quote factory

    app.factory('quotefactory', ['$http','dataFactory','$rootScope','$log',function($http,dataFactory,$rootScope,log) {

    var quotefactory = {};
   
     quotefactory.getquote = function (url) {
        if(url=== undefined){

         var uri=$rootScope.screenId;
          url = $rootScope.HostURL + uri;
          console.log('current screen id' + uri);
          log.info('derived URL!!!' + url);
 }

 
        dataFactory.options(url).success(function(){
                log.info('global options called');        
        
     });
        
    };

 return quotefactory;

}]);