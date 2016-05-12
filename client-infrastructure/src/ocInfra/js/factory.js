'use strict';


/*
global app
*/

/*
exported ScreenController
*/

app.factory('MetaData', function($resource, $rootScope, $location, $browser, $q, resourceFactory, growl) {

    this.load = function(scope, regionId, screenId, onSuccess, resolve) {
        var path;
        scope.regionId = regionId;
        if(regionId){
             path='assets/resources/metadata/regions/'+regionId+'/'+ screenId + '.json';
        }
        else{
            path='assets/resources/metadata/'+ screenId + '.json';
        }
        $resource(path).get(function(m) {
            scope.screenId = screenId;
            $rootScope.title = m.metadata.title;

            if (m.include && m.include.length > 0) {
                loadReferencedMetaModels(growl, scope, m, screenId, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve);
            } else {
                setScreenData($rootScope, scope, m, screenId, $browser, onSuccess);
            }
            loadOptions(growl, scope, screenId, regionId, $rootScope, resourceFactory);
        }, function() {
            $rootScope.showIcon = false;
            //showMessage($rootScope.appConfig.timeoutMsg);
            growl.error($rootScope.appConfig.timeoutMsg);
            return;
        });
    };


    this.actionHandling=function(item, $scope, regionId, screenId, action, resourceFactory, tab, optionFlag, resolve){
        //Retrieve the meta-model for the given screen Id from the scope
        var metaModel = $scope.metadata[screenId];
        
        //Add new values to $scope.data
        //incase the data is Date the code will select current data and reforamt 
        if(metaModel.defaultValue !== undefined){
            angular.forEach(metaModel.defaultValue, function(resource) {
                if(action ===resource.action){
                    if(resource.value === 'Date'){
                        resource.value = formatIntoDate(new Date());    
                    }
                    $scope.data[resource.field] = resource.value;
                }
            });
        }

        //Retrieve the resource list from the meta-model
        var resourcelist = metaModel.resourcelist;

        if(resourcelist !== undefined && resourcelist.length > 0){
            //Iterate through the resource list for the meta model
            angular.forEach(resourcelist, function(resource) {
                var keyForOptionsMap = regionId +':'+resource;
                //Retrieve the optionsMap for the resource
                if($scope.optionsMap === undefined){
                    $scope.optionsMap = [];
                }
                
                var optionsMapForResource = $scope.optionsMap[keyForOptionsMap];
                // make sure alway update OptionsData when update by tab
                if(optionFlag || tab !== undefined){
                    optionsMapForResource = undefined;
                }

                if(optionsMapForResource === undefined){
                    loadOptionsDataForMetadata(growl, item, resourcelist, $scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve);
                }else{
                    var options = optionsMapForResource.get(action);
                    if(options !== undefined){
                        httpMethodToBackEnd(growl, item, $scope, resourceFactory, $rootScope, options, resolve);       
                    } else{
                        loadOptionsDataForMetadata(growl, item, resourcelist, $scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve);
                    }
                }
            });
        }
    };

    this.setHeaders = function($rootScope){
        $rootScope.headers = {
            'Accept': 'application/vnd.hal+json, application/json',
            'Content-Type': 'application/json'
        };

        if($rootScope.user && $rootScope.user.name){
            $rootScope.headers.username = $rootScope.user.name;
        }
    };
    return this;
});

function loadOptions(growl, scope, screenId, regionId, $rootScope, resourceFactory){
    if(screenId !== undefined){
        //Read metadata from the root scope
        var metaModel = scope.metadata[screenId];

        if(metaModel !== undefined){
            //Retrieve resource list from the meta model
            var resourcelist = metaModel.resourcelist;
            if(resourcelist !== undefined && resourcelist.length > 0){
                loadOptionsDataForMetadata(growl, undefined, resourcelist, scope, regionId, $rootScope, resourceFactory);
            }
        }    
    }
}

function sanitizeSchema(fieldName, options){
    angular.forEach(options.schema.properties, function(val, key) {
        if (key !== fieldName) {
            delete options.schema.properties[key];
        }
    });
    return options;
}

function loadOptionsDataForMetadata(growl, item, resourcelist, scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve){
        if(resourcelist !== undefined && resourcelist.length > 0){
            //Iterate through the resource list of meta model
            angular.forEach(resourcelist, function(resource) {
                
                console.log('RESOURCE : '+resource);

                //Formulate the URL for the options call
                var url;
                var newURL;
                var patchFieldName;
                if(scope.patchFieldName){
                    patchFieldName = scope.patchFieldName;
                }

                if($rootScope.resourceHref) {
                    newURL = $rootScope.resourceHref;
                }
                else {
                    url = scope.HostURL + resource;
                    //Retrieve regionToSORMap from the rootScope
                    var regionToSORMap = scope.regionToSoR;
                    //Retrieve the application name for the given region Id
                    var applName = regionToSORMap[regionId];
                    //Replace the regionId with application name in the URL
                    newURL = url.replace(':regionId',applName);
                }

                console.log('OPTIONS CALL ON : '+newURL);
                //Formulate the key for storing the options map for the given resource on the region
                var keyForOptionsMap = regionId +':'+resource;
                //Fetch the options map for the given resource

                if(scope.optionsMap === undefined){
                    scope.optionsMap = [];
                }

                var optionsMapForResource = scope.optionsMap[keyForOptionsMap];
                // make sure alway update OptionsData when update by tab
                if(optionFlag || tab !== undefined){
                    optionsMapForResource = undefined;
                }

                if(optionsMapForResource === undefined){
                    optionsMapForResource = new Map();
                }
                    //Options call for the resources in the meta model.
                    resourceFactory.options(newURL, $rootScope.headers).success(function(data){
                    //Fetch the options response
                    var optiondataobj = data._options.links;
                    var options;
                    if(tab !== undefined) {
                        //Fetch the links response
                        var tabObj = data._links[tab];

                        if(tabObj !== undefined){

                            var tabUrl = tabObj.href;

                            resourceFactory.options(tabUrl, $rootScope.headers).success(function(data){
                                var detailTabUrl = data._links.item.href;
                                resourceFactory.options(detailTabUrl, $rootScope.headers).success(function(data){
                                    optiondataobj = data._options.links;
                                    setOptionsMapForResource(optiondataobj, optionsMapForResource);
                                    scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                                    if(action !== undefined){
                                        options = optionsMapForResource.get(action);
                                        if(options !== undefined && patchFieldName !== undefined){
                                            options = sanitizeSchema(patchFieldName, options);
                                            httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                        }
                                        else{
                                            if(resolve) {
                                                resolve();
                                            }  
                                        }
                                    }
                                });
                            });
                        } else {
                            setOptionsMapForResource(optiondataobj, optionsMapForResource);
                            scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                            if(action !== undefined){
                                options = optionsMapForResource.get(action);
                                if(options !== undefined){
                                    httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                }
                            }
                        }
                        } else {
                            setOptionsMapForResource(optiondataobj, optionsMapForResource);
                            scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                            if(action !== undefined){
                                options = optionsMapForResource.get(action);
                                if(options !== undefined){
                                    httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                }
                            }
                        }
                    });
            });
        }
    return 'success';
}

function setOptionsMapForResource(optiondataobj, optionsMapForResource){
    angular.forEach(optiondataobj, function(ref) {            
        var object = {};
        object.action = ref.rel;
        object.url = ref.href;
        object.httpmethod = ref.method;
        object.schema = ref.schema;
        console.log('ACTION : '+object.action);
        console.log('HTTP METHOD : ' +object.httpmethod);
        console.log('URL : '+object.url);
        console.log('SCHEMA : '+object.schema);
        if(optionsMapForResource.get(object.action) !== undefined){
            optionsMapForResource.set(object.action, object);    
        }else{
            optionsMapForResource.set(object.action, object);    
        }
    });
}

function convertToArray(data) {
    if(data !== undefined && data.length === undefined){
        var array = [];
        array.push(data);
        return array;
    }
    return data;
}

function httpMethodToBackEnd(growl, item, $scope, resourceFactory, $rootScope, options, resolve){
    //Retrieve the URL, Http Method and Schema from the options object
    var url = options.url;
    var httpmethod = options.httpmethod;
    var schema = options.schema;
    // console.log(options.action + ' Action : Perform '+httpmethod +' operation on URL - '+url +' with following params - ');

    var params={};
    //Set the params data from the screen per the schema object for the given action (from the options object)
    params = setData($scope, schema, params);

    if(httpmethod==='GET'){
        $rootScope.loader.loading=true;    
        //Call the get method on the Data Factory with the URL, Http Method, and parameters
        resourceFactory.get(url,params,$rootScope.headers).success(function(data){
            $rootScope.loader.loading=false;
            //Load the results into the search results table
            if(options.action==='search'){
                if(data._links.item){
                    $scope.stTableList = convertToArray(data._links.item);
                    $scope.displayed = data._links.item;
                    $scope.stTableList.showResult = true;
                }else{
                    $scope.stTableList = [];
                    $scope.displayed = [];
                    $scope.stTableList.showResult = false;
                }    
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            //showMessage($rootScope.locale.GET_OPERATION_FAILED);
            growl.error($rootScope.locale.GET_OPERATION_FAILED);
        });
    } else if(httpmethod==='POST'){
        $rootScope.loader.loading=true;
        //Call the post method on the Data Factory
        resourceFactory.post(url,params,$rootScope.headers).success(function(data){
            if (data) {
                if($rootScope.regionId === 'us'){
                     if(data._links.self.quoteNumber !== undefined){
                        $scope.data['quote:identifier']=data._links.self.quoteNumber;
                        $scope.data['quote:annual_cost'] =data._links.self.premium;                        
                     }
                     else{
                        //showMessage($rootScope.locale.CREATE_OPERATION_FAILED);
                        growl.error($rootScope.locale.CREATE_OPERATION_FAILED);
                     }  
                } else {
                    $rootScope.resourceHref = data._links.self.href;
                    $rootScope.loader.loading=false;
                    if(resolve) {
                        resolve();
                    }                    
                }
            }
        }).error(function(){
            $rootScope.loader.loading=false;
        });
    } else if(httpmethod==='PATCH'){
        $rootScope.loader.loading=true;
        //Call the patch method on the Data Factory
        resourceFactory.patch(url,params,$rootScope.headers).success(function(data){
            $rootScope.loader.loading=false;
            if (data) {
                if(resolve) {
                    resolve();
                }
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            //showMessage($rootScope.locale.PATCH_OPERATION_FAILED);
            growl.error($rootScope.locale.PATCH_OPERATION_FAILED);
        });
    } else if(httpmethod==='DELETE'){
        resourceFactory.delete(url,$rootScope.headers).success(function(data){
            if(data.outcome === 'success'){  
                var index=0;
                angular.forEach($scope.stTableList, function(field){
                    if(item.$$hashKey===field.$$hashKey){
                        $scope.stTableList.splice(index, 1);    
                    } else{
                        index=index+1;     
                    }
                });
                angular.forEach(data.messages, function(value){
                    growl.success(value.message);
                });
            }else{
                angular.forEach(data.messages, function(value){
                    growl.error(value.message);
                });
            }
        });
    }
}

function loadReferencedMetaModels(growl, scope, metaModel, screenId, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve) {
    var promises = [];
    var path;
    if(regionId){
         path='assets/resources/metadata/regions/'+regionId+'/';
    }
    else{
        path='assets/resources/metadata/';
    }
    angular.forEach(metaModel.include, function(value) {
        promises.push($resource(path + value + '.json').get(function(m) {
            $rootScope.metadata[value] = m.metadata;
        }, function() {
            $rootScope.showIcon = false;
            //showMessage($rootScope.appConfig.timeoutMsg);
            growl.error($rootScope.appConfig.timeoutMsg);
            return;
        }).$promise);
    });
    $q.all(promises).then(function() {
        setScreenData($rootScope, scope, metaModel, screenId, $browser, onSuccess, resolve);
    });
}

function setScreenData($rootScope, scope, m, screenId, $browser, onSuccess, resolve) {
    var metadata = m.metadata;
    var resourcelist = metadata.resourcelist;
    
    if(resourcelist !== undefined && resourcelist.length >0){
        angular.forEach(resourcelist, function(resource){
            scope.metadata[resource] = m.metadata;    
        });
    }

    scope.metadata[screenId] = m.metadata;

    $browser.notifyWhenNoOutstandingRequests(function() {
        changeMandatoryColor($rootScope);
        $rootScope.$apply();

    });

    onSuccess(m.metadata);
    if(resolve){
        resolve();
    }
}

function setData($scope, schema, object){
    if(schema !== undefined){
        angular.forEach(schema.properties, function(val, key){  
            
            var value = $scope.data[key];
            var type = val.type;
            
            if(type !== undefined && type==='static'){
                value = val.value;
            }

            if(value === null || value === undefined || value === '' || value === 'undefined'){
                //continue
            }else{
    
                var format = val.format;
    
                if(format !== undefined && format==='date'){
                    //Format the date in to yyyy/mm/dd format
                    value = formatIntoDate(value);
                }
    
                if(typeof value === 'object') {
                    if(value.key !== undefined){
                        value = value.key;
                    }else{
                        value = value.value;
                    }
                } 
    
                console.log(key +' : '+value);
                object[key] = value;
            }
        });    
    }
    
    return object;
}

function formatIntoDate(value){
    if(typeof value === 'string') {
        return value;
    }
   return value.getFullYear() + '-' + (('0' + (value.getMonth() + 1)).slice(-2)) + '-' + ('0' + value.getDate()).slice(-2);
}

app.factory('TableMetaData', function($resource, $rootScope) {
    this.load = function(tableId, onSuccess) {
        $resource('assets/resources/metadata/table/' + $rootScope.regionId +'/' + tableId + '.json').get(function(m) {
            onSuccess(m.tableMetaData);
        }, function() {
            return;
        });
    };

    return this;
});

function changeMandatoryColor($rootScope) {
    if ($rootScope.screenId !== undefined) {
        $('#' + $rootScope.metadata[$rootScope.screenId].formid + ' input[ng-required=\'true\']').css('background-color', $rootScope.requiredColor);
        $('#' + $rootScope.metadata[$rootScope.screenId].formid + ' select[ng-required=\'true\']').css('background-color', $rootScope.requiredColor);
    }
}