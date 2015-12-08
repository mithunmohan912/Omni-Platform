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