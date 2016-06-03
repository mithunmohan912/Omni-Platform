'use strict';


/*
global app
*/

/*
exported ScreenController
*/

app.factory('MetaModel', function($resource, $rootScope, $location, $browser, $q, resourceFactory, growl) {
    var self = this;
    
    this.load = function(scope, regionId, screenId, onSuccess, resolve) {
        var path;
        scope.regionId = regionId;
        if(regionId){
             path='assets/resources/metamodel/regions/'+regionId+'/'+ screenId + '.json';
        }
        else{
            path='assets/resources/metamodel/'+ screenId + '.json';
        }
        $resource(path).get(function(m) {
            scope.screenId = screenId;
            $rootScope.title = m.metamodel.title;

            if (m.include && m.include.length > 0) {
                loadReferencedMetaModels(growl, scope, m, screenId, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve);
            } else {
                setScreenData($rootScope, scope, m, screenId, $browser, onSuccess, resolve);
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
        var metaModel = $scope.metamodel[screenId] || $scope.metamodelObject;
        
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
                    loadOptionsDataForMetamodel(growl, item, resourcelist, $scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve);
                }else{
                    var options = optionsMapForResource.get(action);
                    if(options !== undefined){
                        httpMethodToBackEnd(growl, item, $scope, resourceFactory, $rootScope, options, resolve);       
                    } else{
                        loadOptionsDataForMetamodel(growl, item, resourcelist, $scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve);
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
    
    /*============================================= Helper methods for components =============================================*/
    /*
        This function is in charge of analyzing the metamodel object and create an array with all the urls (resource 
        dependencies) that must be queried based on a $http response.
        Entry parameters:
            - responseData -> Success $http response data object.
            - metamodel -> Object representing the UI metamodel.
        Output:
            - An array containing all the resource urls that must be retrieved (empty array if no dependencies).
    */
    function _extractBusinessDependencies(responseData, metamodel){
        if(!metamodel){
            console.warn('No metamodel object to extract business dependencies');
            return [];
        } else if(!metamodel.businessObject){
            return [];
        }

        var dependencies = [];
        var keySet = [];

        // Process http response to know which keys are contained in this resource
        for(var property in responseData){
            if(property.indexOf('_') !== 0 && property.indexOf(':') > 0){
                var propertyKey = property.split(':')[0];
                if(keySet.indexOf(propertyKey) === -1){
                    keySet.push(propertyKey);
                }
            }
        }

        // If our business object specifies a dependency for any of the keys obtained before, we extract those links to query them
        keySet.forEach(function(objectKey){
            if(objectKey in metamodel.businessObject){
                metamodel.businessObject[objectKey].forEach(function(businessDependency){
                    if(businessDependency in responseData._links){
                        dependencies.push({ href: responseData._links[businessDependency].href, resource: businessDependency });
                    }
                });
            }
        });

        return dependencies;
    }

    /*
        Based on a valid (success) data http response (data object contained in $http response) this function 
        creates and returns an object (map) where the keys are the names of the properties and the values are 
        objects containing the following information:
            - metainfo: Object representing the meta-information specified by the backend, such as maximum lengths.
            - value: Value of the property.
            - required: Boolean that indicates whether or not this property is required.
            - editable: Boolean that indicates whether or not this property is editable.
            - self: String URL of the entity this property belongs to.
            - consistent: Boolean representing the status (valid or not) of this property in the backend.
            - statusMessages: Object containing 3 arrays, one for every type of severity message (information, 
              warning, error), and the counter that indicates how many errors and warnings we have to deal with.
        Entry parameters:
            - responseData -> Success $http response data object.
        Output:
            - Object containing the processed properties.
    */
    function _processProperties(responseData){
        var propertiesObject = {};

        if(responseData && responseData._options && responseData._embedded){
            // First get the PATCH and self links to use them later
            var updateCRUD;
            var resourceURL;

            responseData._options.links.forEach(function(crud){
                if(crud.rel === 'update'){
                    updateCRUD = crud;
                }
            });


            for(var link in responseData._links){
                 if(link === 'self'){
                    resourceURL = responseData._links[link].href;
                }
            }

            // Process the entity properties
            for(var property in responseData._options.properties){
                if(responseData._options.properties[property].format !== 'uri'){
                    propertiesObject[property] = {};
                    propertiesObject[property].metainfo = responseData._options.properties[property];
                    propertiesObject[property].value = responseData[property];
                    propertiesObject[property].self = resourceURL;
                    propertiesObject[property].required = (responseData._options.required && responseData._options.required.indexOf(property) >= 0);
                    propertiesObject[property].editable = (updateCRUD !== undefined && (property in updateCRUD.schema.properties));
                    propertiesObject[property].statusMessages = {information: [], warning: [], error: [], errorCount: 0};
                    propertiesObject[property].consistent = true;
                }
            }

            // Process status of the properties (based on status_report coming from backend)
            for(var rel in responseData._embedded) {
                if(rel.indexOf('status_report') >= 0){
                    if (responseData._embedded[rel].messages) {
                        for(var j = 0; j < responseData._embedded[rel].messages.length; j++){
                            var item = responseData._embedded[rel].messages[j];
                            if(item.context in propertiesObject){
                                propertiesObject[item.context].statusMessages[item.severity].push(item);
                                if(item.severity !== 'information'){
                                    propertiesObject[item.context].consistent = false;
                                    propertiesObject[item.context].statusMessages.errorCount++;
                                }
                            }
                        }
                    }
                }
            }
        }

        return propertiesObject;
    }

    /*
        Function that processes collection resources and extract its items urls to query them afterwards if required. In
        case that the response ($http success data object) contains a summary for the items, we add them to the object
        passed as second argument.
        Entry parameters:
            - responseData -> Data object contained in a success $http response.
            - summaryData -> Object where the summaries of the items will be injected.
        Output parameters:
            - An array with the urls of the collection's items (empty array if there are not items).
    */
    function _extractItemDependencies(responseData, summaryData){
        var itemDependencies = [];

        if(responseData && responseData._links){
            for(var linkKey in responseData._links){
                if(linkKey === 'item'){
                    var items = responseData._links[linkKey];
                    // If there is only one item, the response it's not an array but an object
                    if(!Array.isArray(items)){
                        items = [items];
                    }

                    for(var j = 0; j < items.length; j++){
                        var item = items[j];
                        itemDependencies.push({ href: item.href, title: item.title });
                        if(item.summary && summaryData){
                            // By calling _processResponse without arguments we get the 'skeleton' for a resource
                            summaryData[item.href] = _processResponse();
                            for(var property in item.summary){
                                summaryData[item.href].properties[property] = { value: item.summary[property] };
                            }
                        }
                    }
                }
            }
        }

        return itemDependencies;
    }

    /*
        Based on a $http response data and a metamodel, this function will create an uniform object (same structure for
        collection resources and entity resources) containing the following information:
            - dependencies -> Array of urls for the related resources.
            - properties -> Object (map) with key equal to the name of the property and value equal to the object specified
              for function '_processProperties'.
            - items -> Array of urls for the items of the collection if any.
            - deletable -> Boolean indicating whether or not this resource allows the DELETE operation.
            - patchable -> Boolean indicating whether or not this resource allows the PATCH operation.
            - creatable -> Boolean indicating whether or not this resource allows the POST operation.
        Entry parameters:
            - responseData -> Data object contained in the $http success response.
            - metamodel -> UI metamodel object.
            - summaryData -> Object where the summary of the collection's items (if any) will be stored.
    */
    function _processResponse(responseData, metamodel, summaryData){
        var resource = {
            'dependencies':[],
            'properties': {},
            'items': [],
            'deletable': false,
            'patchable': false,
            'creatable': false
        };
        
        if(responseData && responseData._links && responseData._options){
            resource.href = responseData._links.self.href;
            resource.up = responseData._links.up.href;

            resource.properties = _processProperties(responseData);
            resource.dependencies = _extractBusinessDependencies(responseData, metamodel);
            resource.items = _extractItemDependencies(responseData, summaryData);

            // Process CRUD operations to check whether or not we can PATCH, DELETE...
            responseData._options.links.forEach(function(apiOperation){
                if(apiOperation.rel === 'update'){
                    resource.patchable = true;
                } else if(apiOperation.rel === 'delete'){
                    resource.deletable = true;
                } else if(apiOperation.rel === 'create'){
                    resource.creatable = true;
                }
            });
        }

        return resource;
    }


    /*============================================= END Helper methods for components =============================================*/

    /*============================================= Component methods =============================================*/
    /*
        This function queries the backend with the given URL and all the URLs found in the business object
        configuration specified in the metamodel object.
        Entry parameters:
            - rootURL -> URL of the resource to get.
            - metamodel -> UI metamodel object.
            - resultSet -> Object where the retrieved resources will be inserted.
            - dependencyName -> String that will be used as identifier of the resource.
        Output:
            - None. It will insert the results in the third parameter.
    */
    this.prepareToRender = function(rootURL, metamodel, resultSet, dependencyName, refresh){
        // Entry validation
        if(!resultSet){
            return;
        }

        var methodResourceFactory = resourceFactory.get;
        if (refresh) {
            methodResourceFactory = resourceFactory.refresh;
        }
        var responseGET = methodResourceFactory(rootURL);
        // Cached response (resource directory) or not, we always get a promise
        if(responseGET.then){
            responseGET.then(function success(httpResponse){
                var responseData = httpResponse.data || httpResponse;
                var summaryData = {};

                // Add the resource to the result set
                resultSet[rootURL] = _processResponse(responseData, metamodel, summaryData);
                resultSet[rootURL].identifier = rootURL.substring(rootURL.lastIndexOf('/')+1);
                // Build the right href. When there are url parameters, they are not included in the href so we need to include them
                resultSet[rootURL].href = rootURL.substring(0, rootURL.lastIndexOf('/')+1)+resultSet[rootURL].identifier;
                resultSet[rootURL].identifier = dependencyName || resultSet[rootURL].identifier;

                // Analyze business dependencies in order to extract them
                resultSet[rootURL].dependencies.forEach(function(url){
                    self.prepareToRender(url.href, metamodel, resultSet, url.resource);
                });

                // Shall we stick with the summaries or shall we retrieve the whole item ??
                if(!metamodel.summary){
                    resultSet[rootURL].items.forEach(function(url){
                        self.prepareToRender(url.href, metamodel, resultSet, null, refresh);
                    });
                } else {
                    for(var resourceURL in summaryData){
                        resultSet[resourceURL] = summaryData[resourceURL];
                        resultSet[resourceURL].identifier = resourceURL.substring(resourceURL.lastIndexOf('/')+1);
                        resultSet[resourceURL].href = resourceURL;
                    }
                }
            }, function error(errorResponse){
                // FIXME TODO: Do something useful if required, for now just logging
                console.error(errorResponse);
                throw errorResponse;
            });
        }
    };
    /*============================================= END Component methods =============================================*/

    return this;
});

function loadOptions(growl, scope, screenId, regionId, $rootScope, resourceFactory){
    if(screenId !== undefined){
        //Read metamodel from the root scope
        var metaModel = scope.metamodel[screenId];

        if(metaModel !== undefined){
            //Retrieve resource list from the meta model
            var resourcelist = metaModel.resourcelist;
            if(resourcelist !== undefined && resourcelist.length > 0){
                loadOptionsDataForMetamodel(growl, undefined, resourcelist, scope, regionId, $rootScope, resourceFactory);
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

function loadOptionsDataForMetamodel(growl, item, resourcelist, scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve){
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
                    $rootScope.resourceHref = newURL;
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
    console.log(options.action + ' Action : Perform '+httpmethod +' operation on URL - '+url +' with following params - ');

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
                if($rootScope.regionId === 'us' ){
                     if(data._links.self.quoteNumber !== undefined){
                        $scope.data['quote:identifier']=data._links.self.quoteNumber;
                        $scope.data['quote:annual_cost'] =data._links.self.premium;                        
                     } 
                     if(data.outcome === 'success'){
                            angular.forEach(data.messages, function(value){
                            growl.success(value.message);
                        });
                     } else{
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
            if (data) { 
                if(data.outcome === 'success'){
                    angular.forEach(data.messages, function(value){
                        growl.success(value.message);
                    });
                }else{
                    angular.forEach(data.messages, function(value){
                        growl.error(value.message);
                    });
                }  
                $rootScope.loader.loading=false;
       
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
         path='assets/resources/metamodel/regions/'+regionId+'/';
    }
    else{
        path='assets/resources/metamodel/';
    }
    angular.forEach(metaModel.include, function(value) {
        promises.push($resource(path + value + '.json').get(function(m) {
            $rootScope.metamodel[value] = m.metamodel;
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
    var metamodel = m.metamodel;
    var resourcelist = metamodel.resourcelist;
    
    if(resourcelist !== undefined && resourcelist.length >0){
        angular.forEach(resourcelist, function(resource){
            scope.metamodel[resource] = m.metamodel;    
        });
    }
    $rootScope.metamodel = scope.metamodel = scope.metamodel || {};
    scope.metamodel[screenId] = m.metamodel;

    $browser.notifyWhenNoOutstandingRequests(function() {
        changeMandatoryColor($rootScope);
        $rootScope.$apply();

    });

    if(onSuccess){
        onSuccess(m.metamodel);
    }
    
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

app.factory('TableMetaModel', function($resource, $rootScope) {
    this.load = function(tableId, onSuccess) {
        $resource('assets/resources/metamodel/table/' + $rootScope.regionId +'/' + tableId + '.json').get(function(m) {
            onSuccess(m.tableMetaModel);
        }, function() {
            return;
        });
    };

    return this;
});

function changeMandatoryColor($rootScope) {
    if ($rootScope.screenId !== undefined) {
        $('#' + $rootScope.metamodel[$rootScope.screenId].formid + ' input[ng-required=\'true\']').css('background-color', $rootScope.requiredColor);
        $('#' + $rootScope.metamodel[$rootScope.screenId].formid + ' select[ng-required=\'true\']').css('background-color', $rootScope.requiredColor);
    }
}