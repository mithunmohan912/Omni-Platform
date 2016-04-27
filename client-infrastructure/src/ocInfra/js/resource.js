'use strict';
/*
global app
*/


    app.factory('resourceFactory', ['$http', function($http) {

    var resourceFactory = {};

    resourceFactory.getData = function (urlBase) {
        return $http.get(urlBase);
    };

    resourceFactory.get = function (urlBase,params,headers) {
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

    resourceFactory.post = function (urlBase,params,headers) {
        var obj = $http({
                method: 'POST',
                url: urlBase,
                headers: headers,
                data: params
            });
        return obj;
    };

    resourceFactory.insert = function (urlBase,obj) {
        return $http.post(urlBase, obj);
    };

    resourceFactory.update = function (urlBase,obj) {
        return $http.put(urlBase + '/' + obj.id, obj);
    };

    resourceFactory.delete = function (url, headers) {
        var obj = $http({
            method : 'DELETE',
            url : url,
            headers : headers
        });
        return obj;
    };

    resourceFactory.options=function(urlBase, headers){
        var obj =   $http(
            {
                method : 'GET',
                url : urlBase,
                headers : headers
            }
        );   
        return obj;
    };

    resourceFactory.patch = function (urlBase,params,headers) {
        var obj = $http({
                method: 'PATCH',
                url: urlBase,
                headers: headers,
                data: params
            });
        return obj;
    };
 return resourceFactory;

}]);