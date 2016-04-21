'use strict';
/*
global app
*/


    app.factory('dataFactory', ['$http', function($http) {

    var dataFactory = {};

    dataFactory.getData = function (urlBase) {
        return $http.get(urlBase);
    };

    dataFactory.get = function (urlBase,params,headers) {
        var obj =   $http(
            {
                method : 'GET',
                url : urlBase,
                params : params,
                headers : headers
            }
        );   
        return obj;
    };

    dataFactory.post = function (urlBase,params,headers) {
       var obj = $http({
                method: 'POST',
                url: urlBase,
                headers: headers,
                data: params
            });
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

    dataFactory.deleteRecord = function (url, headers) {
        
        var obj = $http({
            method : 'DELETE',
            url : url,
            headers : headers
        });

        return obj;
    };

    dataFactory.options=function(urlBase, headers){
        var obj =   $http(
            {
                method : 'GET',
                url : urlBase,
                headers : headers
            }
        );   
        return obj;
    };

    dataFactory.patch = function (urlBase,params,headers) {
        var obj = $http({
                method: 'PATCH',
                url: urlBase,
                headers: headers,
                data: params
            });
        return obj;
    };
 return dataFactory;

}]);