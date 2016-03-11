'use strict';
/*
global app
*/

  

    app.factory('dataFactory', ['$http', function($http) {

    var dataFactory = {};

   

    dataFactory.getData = function (urlBase) {
        //console.log('datafactory');
        return $http.get(urlBase);
    };

    dataFactory.search = function (urlBase,method,params,headers) {
        var obj =   $http(
            {
                method : method,
                url : urlBase,
                params : params,
                headers : headers
            }
        );   

        //console.log('Inresource.js'+obj);
        return obj;
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
        //console.log('datafactory!!!');
        var obj =   $http(
            {
                method : 'GET',
                url : urlBase,
            }
        );   

        //console.log('Inresource.js'+obj);
        return obj;
    };

    dataFactory.patch = function (urlBase,obj) {


        return $http.patch(urlBase + '/' + obj.id, obj);
    };

 return dataFactory;

}]);


  