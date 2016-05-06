'use strict';
/*
global app
*/

app.factory('resourceFactory', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var resourceDirectory = {};

    function _get(url, params, headers) {
        var promise;
        if (!resourceDirectory[url]) {
            promise = $http({
                    method : 'GET',
                    url : url,
                    data : params,
                    headers : headers
            });
            if (promise.then) {
                promise.then(function(response) {
                    resourceDirectory[url] = response.data;
                    $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

                }, function(error) {
                    console.error(error);
                    throw error;
                });   
            }
        } else {
            promise = $q(function(resolve) {
                resolve(resourceDirectory[url]);
            });
            promise.success = function(callback) {
                var _success = callback;
                promise.then(_success, null);
                return promise;
            };
            promise.error = function(callback) {
                var _error = callback;
                promise.then(null, _error);
                return promise;
            };
        }
        return promise;
    }

    function _refresh(url, params, headers) {
        resourceDirectory[url] = null;
        return _get(url, params, headers);
    }

    function _post(url, params, headers) {
        var promise = $http({
                method: 'POST',
                url: url,
                headers: headers,
                data: params
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[url] = response.data;
                $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

            }, function(error) {
                console.error(error);
                throw error;
            });   
        }
        return promise;
    }

    function _delete(url, headers) {
        var promise = $http({
            method : 'DELETE',
            ul : url,
            headers : headers
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[url] = null;
                $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

            }, function(error) {
                console.error(error);
                throw error;
            });   
        }
        return promise;
    }

    function _patch(url,params,headers) {
        var promise = $http({
                method: 'PATCH',
                url: url,
                headers: headers,
                data: params
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[url] = response.data;
                $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

            }, function(error) {
                console.error(error);
                throw error;
            }); 
        } 
        return promise;
    }

    function _execute(url, params, headers, method) {
        var promise = $http({
                method: method,
                url: url,
                headers: headers,
                data: params
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[url] = response;
                $rootScope.$broadcast('resourceDirectory', { 'url': url, 'response': response });

            }, function(error) {
                console.error(error);
                throw error;
            }); 
        } 
        return promise;

    }

    return {
        'get': _get,
        'refresh': _refresh,
        'post': _post,
        'delete' : _delete,
        'patch': _patch,
        'execute': _execute,

        'getData' : function (urlBase) {
            return $http.get(urlBase);
        },
        'insert' : function (urlBase,obj) {
            return $http.post(urlBase, obj);
        },

        'update' : function (urlBase,obj) {
            return $http.put(urlBase + '/' + obj.id, obj);
        },
        'options' : function(urlBase, headers){
            var obj =   $http(
                {
                    method : 'GET',
                    url : urlBase,
                    headers : headers
                }
            );   
            return obj;
        }
    };

}]);