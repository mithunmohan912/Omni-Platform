'use strict';
/*
global app
*/


    app.factory('resourceFactory', ['$http','$rootScope',function($http,$rootScope) {

    var resourceFactory = {};

    function addApiGatewayApiKeys(params) {
        if (params === undefined) {
            params = {};
        }
        if ($rootScope.config.apiGatewayApiKeys) {
            for(var key in $rootScope.config.apiGatewayApiKeys) {
                params[key] = $rootScope.config.apiGatewayApiKeys[key];
            }
        }
        return params;
    }

    resourceFactory.getData = function (urlBase) {
        return $http.get(urlBase);
    };

    resourceFactory.get = function (urlBase,params,headers) {
        params = addApiGatewayApiKeys(params);
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

    resourceFactory.post = function (urlBase,data,headers) {
        var params = addApiGatewayApiKeys({});
        var obj = $http({
                method: 'POST',
                url: urlBase,
                headers: headers,
                params: params,
                data: data
            });
        return obj;
    };

    // resourceFactory.insert = function (urlBase,obj) {
    //     return $http.post(urlBase, obj);
    // };

    // resourceFactory.update = function (urlBase,obj) {
    //     return $http.put(urlBase + '/' + obj.id, obj);
    // };

    resourceFactory.delete = function (url, headers) {
        var params = addApiGatewayApiKeys({});        
        var obj = $http({
            method : 'DELETE',
            url : url,
            headers : headers,
            params : params
        });
        return obj;
    };

    resourceFactory.options = function(urlBase, headers){
        var params = addApiGatewayApiKeys({});        
        var obj =   $http(
            {
                method : 'GET',
                url : urlBase,
                headers : headers,
                params : params
            }
        );   
        return obj;
    };

    resourceFactory.patch = function (urlBase,data,headers) {
        var params = addApiGatewayApiKeys({});        
        var obj = $http({
                method: 'PATCH',
                url: urlBase,
                headers: headers,
                params: params,
                data: data
            });
        return obj;
    };
 return resourceFactory;

}]);