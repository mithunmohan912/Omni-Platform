'use strict';
/*
global app
*/

app.factory('resourceFactory', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var resourceDirectory = {};
    var PENDING_REQUEST = '0';

    //used to distinct between GET method with and without params
    var urlParams = {};

    var defaultHeaders = {
            'Accept': 'application/vnd.hal+json, application/json',
            'Content-Type': 'application/json'
    };

    function _addApiGatewayApiKeys(params) {
        if (params === null || params === undefined) {
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

    // Temporal solution (LOL), to refresh a resource and all of its items in case the resource is a collection
    function _deepRefresh(resource) { 
        if(resource !== '0' && resource.data && resource.data._links && resource.data._links.self && resource.data._links.self.href){
            /* 
                If the resource is a collection we delete its items from the resource directory because maybe an item has been deleted in the API
                but we won't be able to know it because the item won't be coming in the collection response, so it would stay in the resource
                directory forever.
            */
            if(resource.data._links.item){
                _cleanUrlsFrom(resource.data._links.self.href);
            }
            var promise = _refresh(resource.data._links.self.href);

            // Again, if we had items in the collection, we get them fresh from the API
            if(resource.data._links.item && promise && promise.then){
                promise.then(function(response){
                    if(response && response.data && response.data._links && response.data._links.item) {
                        var urlsToRefresh;
                        if(Array.isArray(response.data._links.item)){
                            urlsToRefresh = response.data._links.item.map(function(item){ return item.href; });
                        } else {
                            urlsToRefresh = [ response.data._links.item.href ];
                        }

                        return $q.all(urlsToRefresh.map(function(url){ return _refresh(url); }));
                    }

                    return response;
                });
            }
            
            return promise;
        }
    }
    // Method to clean any resource in the resourceDirectory starting from the passed URL
    function _cleanUrlsFrom(startingURL) {
        Object.keys(resourceDirectory).forEach(function(key){
            if(key.indexOf(startingURL) !== -1 && key !== startingURL) {
                delete resourceDirectory[key];
            }
        });
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

    function _get(url, params, headers, responseType) {
        // Since the url params are not considered when updating the resource directory, we just reset it for the concrete URL if we have params
        if(params && Object.keys(params).length > 0){
            resourceDirectory[url] = null;
            urlParams[url] = true;
        }else if(angular.isObject(params) && urlParams[url]){
            resourceDirectory[url] = null;
            urlParams[url] = false;
        }

        params = _addApiGatewayApiKeys(params);
        var promise;
        //We add the responseType condition because otherwise, if we want to get a PDF, 
        //since we already fetched the quote, we would be looking into the resourceDirectory
        if (!resourceDirectory[url] || responseType) {
            resourceDirectory[url] = PENDING_REQUEST;
            promise = $http({
                    method : 'GET',
                    url : url,
                    params : params,
                    headers : _prepareHeaders(headers),
                    responseType: responseType
            });
            if (promise.then) {
                promise.then(function(response) {
                    if (!responseType){
                        var previous = resourceDirectory[url];
                        resourceDirectory[url] = response;
                        $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': previous });
                    }
                    return response;
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

    function _refresh(url, params, headers, deepRefresh) {
        if(deepRefresh) {
            return _deepRefresh(_getFromResourceDirectory(url));
        } else {
            resourceDirectory[url] = null;
            return _get(url, params, _prepareHeaders(headers)).then();
        }
    }

    function _post(url, data, headers, refresh) {
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
                if(response.data !== undefined && response.data._links !== undefined && response.data._links.self !== undefined && response.data._links.self.href !== undefined){
                    resourceDirectory[response.data._links.self.href] = response;
                    $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response, 'previous': undefined });
                
                    if(refresh && response && response.data && response.data._links && response.data._links.up && response.data._links.up.href && _getFromResourceDirectory(response.data._links.up.href) !== '0'){
                        var refreshPromise = _deepRefresh(_getFromResourceDirectory(response.data._links.up.href));

                        if(refreshPromise) {
                            return refreshPromise;
                        }
                    }
                }

                return response;
            }, function(error) {
                //console.error(error);
                throw error;
            });   
        }
        return promise;
    }

    function _delete(url, headers, refresh) {
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
                
                if(refresh && previous  && previous !== '0' && previous.data && previous.data._links && previous.data._links.up && previous.data._links.up.href){
                    var refreshPromise = _deepRefresh(_getFromResourceDirectory(previous.data._links.up.href));

                    if(refreshPromise) {
                        return refreshPromise;
                    }
                }

                return response;
            }, function(error) {
                console.error(error);
                throw error;
            });   
        }
        return promise;
    }

    function _patch(url,data,headers, refresh) {
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
                if(refresh && response.data && response.data._links && response.data._links.up && response.data._links.up.href && _getFromResourceDirectory(previous.data._links.up.href) !== '0'){
                    var refreshPromise = _deepRefresh(_getFromResourceDirectory(response.data._links.up.href));

                    if(refreshPromise) {
                        return refreshPromise;
                    }
                }

                return response;
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
                if (response.data && response.data._links && response.data._links.self){
                    resourceDirectory[response.data._links.self.href] = response;
                    $rootScope.$broadcast('resource_directory', { 'url': url, 'response': response });    
                }

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