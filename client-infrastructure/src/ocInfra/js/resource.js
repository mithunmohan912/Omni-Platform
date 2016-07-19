'use strict';
/*
global app
*/

app.factory('resourceFactory', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var resourceDirectory = {};
    var PENDING_REQUEST = '0';
    var defaultHeaders = {
            'Accept': 'application/vnd.hal+json, application/json',
            'Content-Type': 'application/json'
    };

    function _addApiGatewayApiKeys(params) {
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

    function _getFromResourceDirectory(url) {
      return angular.copy(resourceDirectory[url]);
    }

    function _prepareHeaders(headers){
        if(!headers){
            headers = defaultHeaders;
            var appHeaders;

            if(sessionStorage.getItem('_headers')){
                appHeaders = JSON.parse(sessionStorage.getItem('_headers'));
                for(var key in appHeaders){
                    headers[key] = appHeaders[key];
                }
            }
        }
        return headers;
    }

    function _get(url, params, headers) {
        // Since the url params are not considered when updating the resource directory, we just reset it for the concrete URL if we have params
        if(params && Object.keys(params).length > 0){
            resourceDirectory[url] = null;
        }

        params = _addApiGatewayApiKeys(params);
        var promise;
        if (!resourceDirectory[url]) {
            resourceDirectory[url] = PENDING_REQUEST;
            promise = $http({
                    method : 'GET',
                    url : url,
                    params : params,
                    headers : _prepareHeaders(headers)
            });
            if (promise.then) {
                promise.then(function(response) {
                    var previous = resourceDirectory[url];
                    resourceDirectory[url] = response;
                    $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': previous });

                }, function(error) {
                    console.error(error);
                    throw error;
                });   
            }
        } else {
            promise = $q(function(resolve) {
                if (resourceDirectory[url] === PENDING_REQUEST) {
                    $rootScope.$on('resource_directory', function(event, data) {
                        if (data.url === url) {
                            resolve(resourceDirectory[url]);
                        }
                    });
                } else {
                    resolve(resourceDirectory[url]);
                }
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
        return _get(url, params, _prepareHeaders(headers));
    }

    function _post(url, data, headers) {
        var params = _addApiGatewayApiKeys({});
        var promise = $http({
                method: 'POST',
                url: url,
                headers: _prepareHeaders(headers),
                params: params,
                data: data
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[response.data._links.self.href] = response;
                $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': undefined });

            }, function(error) {
                //console.error(error);
                return error;
            });   
        }
        return promise;
    }

    function _delete(url, headers) {
        var params = _addApiGatewayApiKeys({});
        var promise = $http({
            method : 'DELETE',
            url : url,
            headers : _prepareHeaders(headers),
            params: params
        });
        if (promise.then) {
            promise.then(function(response) {
                var previous = resourceDirectory[url];
                resourceDirectory[url] = null;
                $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': previous });
                

            }, function(error) {
                console.error(error);
                throw error;
            });   
        }
        return promise;
    }

    function _patch(url,data,headers) {
        var params = _addApiGatewayApiKeys({});
        var promise = $http({
                method: 'PATCH',
                url: url,
                headers: _prepareHeaders(headers),
                params: params,
                data: data
        });
        if (promise.then) {
            promise.then(function(response) {
                var previous = resourceDirectory[url];

                resourceDirectory[url] = response;
                //Is this really needed?? After the patch call, the entity data is already up to date. 
                // data = {};
                // _refresh(url, data, headers);

                $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': previous });

                
            }, function(error) {
                console.error(error);
                throw error;
            }); 
        } 
        return promise;
    }

    function _execute(url, data, params, headers, method) {
        var promise = $http({
                method: method,
                url: url,
                headers: _prepareHeaders(headers),
                data: data,
                params: params
        });
        if (promise.then) {
            promise.then(function(response) {
                resourceDirectory[response.data._links.self.href] = response;
                $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response });

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
        'getFromResourceDirectory': _getFromResourceDirectory,

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
            var params = _addApiGatewayApiKeys({});
            var obj =   $http(
                {
                    method : 'GET',
                    url : urlBase,
                    headers : _prepareHeaders(headers),
                    params: params
                }
            );   
            return obj;
        }
    };

}]);