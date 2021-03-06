'use strict';


/*
global app
*/ 

/*
exported ScreenController
*/

app.factory('MetaModel', function($resource, $rootScope, $location, $browser, $q, resourceFactory, growl) {
    var self = this;

    this.setAction = function(action){
        $rootScope.actionAfterNavigation = action;
    };

    

    this.loadProperties = function(screenId){

        var properties = typeof $rootScope.metamodel[screenId] !== 'undefined'?$rootScope.metamodel[screenId]:undefined;
       
          // if posts object is not defined then start the new process for fetch it
        if (!properties) {
            // create deferred object using $q
            var deferred = $q.defer();

            // get posts form backend
             $resource('assets/resources/metamodel/'+ screenId + '.json').get().$promise.then(function(result) {
                // save fetched posts to the local variable
                properties = result;
                // resolve the deferred
                deferred.resolve(properties);
              }, function(error) {
                properties = error;
                deferred.reject(error);
              });

            // set the posts object to be a promise until result comeback
            properties = deferred.promise;
            return $q.when(properties);

        }
            return properties;


          // in any way wrap the posts object with $q.when which means:
          // local posts object could be:
          // a promise
          // a real posts data
          // both cases will be handled as promise because $q.when on real data will resolve it immediately
          
        };
    
    


    this.load = function(scope, regionId, screenId, onSuccess, resolve) {
        var path;
        scope.regionId = regionId;
        if(screenId !== undefined && screenId !== 'undefined'){
        if(regionId){
             path='assets/resources/metamodel/regions/'+regionId+'/'+ screenId + '.json';
        }
        else{
            path='assets/resources/metamodel/'+ screenId + '.json';
        }
        $resource(path).get(function(m) {
            scope.screenId = screenId;
            $rootScope.title = m.metamodel.title;
            if($rootScope.metamodel !== undefined){
                $rootScope.metamodel[screenId] = m.metamodel;    
            }

            // Initialize colspan and offset if they do not exist
            m.metamodel.colspan = m.metamodel.colspan || 12;
            m.metamodel.offset = m.metamodel.offset || 0;

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
      }
    };


this.handleAction=function($rootScope, $scope, inputComponent, rootURL, properties, resourceFactory, defaultValues, $location, resolve){        
    var options = {};
    if(rootURL === undefined){
        var url = $rootScope.hostURL + inputComponent.resource;
        //Retrieve regionToSORMap from the rootScope
        var regionToSORMap = $rootScope.regionToSoR;
        //Retrieve the application name for the given region Id
        var applName = regionToSORMap[$rootScope.regionId];
        //Replace the regionId with application name in the URL
        rootURL = url.replace(':regionId',applName);
    }
    //Pick the URL for the business dependency on which your metamodel depends. 
    if(properties !== undefined){
        angular.forEach(properties, function(val, key) {
            if(properties[key] !== undefined){
                var url = properties[key].self;
                if(url !== undefined && url !== rootURL){
                    rootURL = url;
                }    
            }
        });
    }

    if(!$rootScope.optionsMapForURL){
        $rootScope.optionsMapForURL = new Map();
    }

    if(rootURL !== undefined && !$rootScope.optionsMapForURL.get(rootURL)){
            callOptions($rootScope, rootURL, function(optionsObj){
                options = optionsObj.get(inputComponent.action);
                if(!properties){
                    properties = options.properties;
                }
                if(options !== undefined){
                    invokeHttpMethod(growl, undefined, $scope, resourceFactory, properties, $rootScope, options, defaultValues, inputComponent.actionURL, $location, inputComponent.tab,inputComponent.apiMsg, resolve);       
                }
            });
    }else{
        options = $rootScope.optionsMapForURL.get(rootURL).get(inputComponent.action);
        if(!properties){
            properties = options.properties;
        }
        if(options !== undefined){
            invokeHttpMethod(growl, undefined, $scope, resourceFactory, properties, $rootScope, options, defaultValues, inputComponent.actionURL, $location, inputComponent.tab,inputComponent.apiMsg, resolve);       
        } 
    } 
};

    this.prepareOptions = function($rootScope, rootURL, optionsMap){
        if(!$rootScope.optionsMapForURL){
            $rootScope.optionsMapForURL = new Map();
        }
        if($rootScope.optionsMapForURL.get(rootURL)){
            optionsMap[rootURL] = $rootScope.optionsMapForURL.get(rootURL);
            return;
        }
        var headers = setHeaders($rootScope);
        var methodResourceFactory = resourceFactory.optionsData;
        var params = {};

         var responseOPTIONS = methodResourceFactory(rootURL, params, headers);
          if(responseOPTIONS.then){
            
            responseOPTIONS.then(function success(httpResponse){
                console.log('prepareOptions - OPTIONS CALL - ' + rootURL);
                var responseData = httpResponse.data || httpResponse;
                if(responseData && responseData._options){
                    var optiondataobj = responseData._options.links;
                    if(optiondataobj !== undefined){
                        $rootScope.optionsMapForURL.set(rootURL, _processOptions(responseData));
                        // Add the resource to the result set
                        optionsMap[rootURL] = $rootScope.optionsMapForURL.get(rootURL);
                    }
                }else{
                    methodResourceFactory = resourceFactory.refresh;
                    var responseGET = methodResourceFactory(rootURL, params, headers);
                    if(responseGET.then){
                        responseGET.then(function success(httpResponseGet){
                            console.log('prepareOptions - GET CALL - ' + rootURL);
                            var responseDataGet = httpResponseGet.data || httpResponseGet;
                             if(responseDataGet && responseDataGet._options){
                                var optiondataobj = responseDataGet._options.links;
                                if(optiondataobj !== undefined){
                                    $rootScope.optionsMapForURL.set(rootURL, _processOptions(responseDataGet));
                                    // Add the resource to the result set
                                    optionsMap[rootURL] = $rootScope.optionsMapForURL.get(rootURL);
                                }
                            }
                        }, function error(errorResponse){
                                console.error(errorResponse);
                                throw errorResponse;
                        });
                    }
                }
                
            }, function error(errorResponse){
                // FIXME TODO: Do something useful if required, for now just logging
                console.error(errorResponse);
                throw errorResponse;
            });
        }
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
                        $rootScope.actionAfterNavigation = undefined;
                    } else{
                        loadOptionsDataForMetamodel(growl, item, resourcelist, $scope, regionId, $rootScope, resourceFactory, action, tab, optionFlag, resolve);
                    }
                }
            });
        }
    };
    this.setHeaders = setHeaders;
    function setHeaders($rootScope){
        var headersForSoRMap = $rootScope.headersForSoR;
        if(headersForSoRMap !== undefined && $rootScope.regionId !== undefined){
            $rootScope.headers = headersForSoRMap[$rootScope.regionId];
        }

        if(!$rootScope.headers){
            $rootScope.headers = {
                'Accept': 'application/hal+json, application/json',
                'Content-Type': 'application/json'
            };
            if($rootScope.user && $rootScope.user.name){
                $rootScope.headers.username = $rootScope.user.name;
            }
        }
        
        
        return $rootScope.headers;
    }
    function callOptions($rootScope, rootURL, callback){
        if(!$rootScope.optionsMapForURL){
            $rootScope.optionsMapForURL = new Map();
        }
        
        var methodResourceFactory = resourceFactory.optionsData;
        var params = {};
         
         var responseOPTIONS = methodResourceFactory(rootURL, params, $rootScope.headers);
          if(responseOPTIONS.then){
            
            responseOPTIONS.then(function success(httpResponse){
                console.log('callOptions - OPTIONS CALL - ' + rootURL);
                var responseData = httpResponse.data || httpResponse;
                if(responseData && responseData._options){
                    var optiondataobj = responseData._options.links;
                    if(optiondataobj !== undefined){
                        $rootScope.optionsMapForURL.set(rootURL, _processOptions(responseData));
                        if(typeof callback === 'function'){
                            callback($rootScope.optionsMapForURL.get(rootURL));  
                        } 
                    }
                }else{
                    methodResourceFactory = resourceFactory.refresh;
                    var responseGET = methodResourceFactory(rootURL, params, $rootScope.headers);
                    if(responseGET.then){
                        responseGET.then(function success(httpResponseGet){
                            console.log('callOptions - GET CALL - ' + rootURL);
                            var responseDataGet = httpResponseGet.data || httpResponseGet;
                             if(responseDataGet && responseDataGet._options){
                                var optiondataobj = responseDataGet._options.links;
                                if(optiondataobj !== undefined){
                                    $rootScope.optionsMapForURL.set(rootURL, _processOptions(responseDataGet));
                                    if(typeof callback === 'function'){
                                        callback($rootScope.optionsMapForURL.get(rootURL));  
                                    } 
                                }
                            }
                        }, function error(errorResponse){
                                console.error(errorResponse);
                                throw errorResponse;
                        });
                    }
                }
                
            }, function error(errorResponse){
                // FIXME TODO: Do something useful if required, for now just logging
                console.error(errorResponse);
                throw errorResponse;
            });
        }
    }    
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
        
        // If our business object specifies a dependency for any of the keys obtained before, we extract those links to query them
        var objectKey = {};
        for( var key in metamodel.businessObject){
            objectKey = key;
        } 
        if(responseData._links){
            metamodel.businessObject[objectKey].forEach(function(businessDependency){
                if(businessDependency in responseData._links){
                    dependencies.push({ href: responseData._links[businessDependency].href, resource: businessDependency });
                }
            });
        }
        
        
        if(responseData._embedded){
            var embeddedItems = [];
            for (var listKey in responseData._embedded){
                embeddedItems = responseData._embedded[listKey];
                if(!Array.isArray(embeddedItems)){
                    embeddedItems = [embeddedItems];
                }
            }

            metamodel.businessObject[objectKey].forEach(function(businessDependency){
                for(var embeddedItem in embeddedItems){
                    if(businessDependency in embeddedItems[embeddedItem]._links){
                        dependencies.push({ href: embeddedItems[embeddedItem]._links[businessDependency].href, resource: businessDependency });
                    }
                }
            });    
        }

        return dependencies;
    }

    function _processOptions(responseData){
        var optionsMapForResource = new Map();
        
        if(responseData && responseData._options){
            var optiondataobj = responseData._options.links;
            if(optiondataobj !== undefined){
                angular.forEach(optiondataobj, function(optionsObj){
                    var object = {};
                    if(optionsObj !== undefined){
                        object.action = optionsObj.rel;
                        object.href = optionsObj.href;
                        object.httpmethod = optionsObj.method;
                        var schema = optionsObj.schema;
                        var propertiesObject = {};
                        if(schema !== undefined){
                            var optionProp = schema.properties;
                            if(optionProp !== undefined){
                                angular.forEach(optionProp, function(val, key){
                                    propertiesObject[key] = {};
                                    propertiesObject[key].metainfo = schema.properties[key];
                                    propertiesObject[key].value = '';
                                    propertiesObject[key].url = optionsObj.href;
                                    propertiesObject[key].required = (schema.required && schema.required.indexOf(key) >= 0);
                                    propertiesObject[key].editable = true;
                                    propertiesObject[key].statusMessages = {information: [], warning: [], error: [], errorCount: 0};
                                    propertiesObject[key].consistent = true;
                                });
                            }
                            object.properties = propertiesObject; 
                        }
                    }
                    if(!optionsMapForResource.get(object.action)){
                        console.log('Action - '+ object.action);
                        console.log('Httpmethod - '+ object.httpmethod);
                        console.log('URL - '+ object.href);

                        optionsMapForResource.set(object.action, object);
                    }
                });    
            }
        }

        if(responseData && responseData.supportData){
            var supportDataObj = responseData.supportData;
            if(supportDataObj !== undefined){
                angular.forEach(supportDataObj, function(supportObj){
                    var object = {};
                    if(supportObj !== undefined && supportObj.href !== undefined){
                        object.action = supportObj.propertyName;
                        object.href = supportObj.href.href;
                        object.httpmethod = 'GET';
                        if(!optionsMapForResource.get(object.action)){
                            console.log('Action - '+ object.action);
                            console.log('Httpmethod - '+ object.httpmethod);
                            console.log('URL - '+ object.href);

                            optionsMapForResource.set(object.action, object);
                        }
                    }
                    
                });    
            }
        }
        return optionsMapForResource;
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
    this.processProperties = _processProperties;
    function _processProperties(responseData, metamodel){
        var propertiesObject = {};
        var resourceURL1 = {};
        if(responseData && responseData._options){
            // First get the PATCH and self links to use them later
            var updateCRUD;
            var resourceURL;
            if(responseData._options.links){
                responseData._options.links.forEach(function(crud){
                    if(crud.rel === 'update'){
                        updateCRUD = crud;
                    }
                });
            }
            

            for(var link in responseData._links){
                 if(link === 'self'){
                    resourceURL = responseData._links[link].href;
                }
            }

            if(responseData._options.properties){
                // Process the entity properties
                for(var property in responseData._options.properties){
                    if(responseData._options.properties[property].format !== 'uri'){
                        propertiesObject[property] = {};
                        propertiesObject[property].metainfo = responseData._options.properties[property];
                        propertiesObject[property].value = responseData[property];
                        propertiesObject[property].self = resourceURL;
                        propertiesObject[property].required = (responseData._options.required && responseData._options.required.indexOf(property) >= 0);
                        propertiesObject[property].editable = (updateCRUD && updateCRUD.schema && (property in updateCRUD.schema.properties));
                        propertiesObject[property].statusMessages = {information: [], warning: [], error: [], errorCount: 0};
                        propertiesObject[property].consistent = true;
                    }
                }
            }else if(responseData) {            
                for(var prop in responseData){
                    if(prop !== '_links' && prop !== '_options' && prop !== '_embedded'){
                        propertiesObject[prop] = {};
                        if(angular.isObject(responseData[prop])){
                            propertiesObject[prop].properties= {};
                            for(var propertyKey in responseData[prop]){
                                var complexObject = responseData[prop];
                                propertiesObject[prop].properties[propertyKey] = {};
                                propertiesObject[prop].editable = false;
                                propertiesObject[prop].properties[propertyKey].self = resourceURL;
                                propertiesObject[prop].properties[propertyKey].value = complexObject[propertyKey]; 
                                propertiesObject[prop].value = responseData[prop];  
                            }
                        } else{
                            propertiesObject[prop].value = responseData[prop];    
                        }
                        propertiesObject[prop].editable = false;
                        propertiesObject[prop].self = resourceURL;
                        propertiesObject[prop].statusMessages = {information: [], warning: [], error: [], errorCount: 0};
                        propertiesObject[prop].consistent = true;
                    }else{
                        continue;
                    }
                }
            }
            
            // Process status of the properties (based on status_report coming from backend)
            if(responseData._embedded){
                for(var rel in responseData._embedded) {
                    if(rel.indexOf('status_report') >= 0 && responseData._embedded[rel].messages){
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
                        break;
                    }
                }    
            }
            
        } else if(responseData) {
           
            if(responseData._links){
                 for(var link1 in responseData._links){
                    if(link1 === 'self'){
                        resourceURL1 = responseData._links[link1].href;
                    }
                }    
            }
            

            for(var props in responseData){
                if(props !== '_links' && props !== '_options' && props !== '_embedded'){
                    propertiesObject[props] = {};
                    if(angular.isObject(responseData[props])){
                        propertiesObject[props].properties= {};
                        for(var propertyKeys in responseData[props]){
                            var complexObjects = responseData[props];
                            propertiesObject[props].properties[propertyKeys] = {};
                            propertiesObject[props].properties[propertyKeys].self = resourceURL1;
                            propertiesObject[props].properties[propertyKeys].value = complexObjects[propertyKeys]; 
                            propertiesObject[props].value = responseData[props];  
                        }
                    } else{
                        propertiesObject[props].value = responseData[props];    
                    }
                    
                    propertiesObject[props].self = resourceURL1;
                    propertiesObject[props].statusMessages = {information: [], warning: [], error: [], errorCount: 0};
                    propertiesObject[props].consistent = true;
                }else{
                    continue;
                }
            }
        }

        // If our business object specifies a dependency for any of the keys obtained before, we extract those links to query them
        
        if(metamodel.supportData){
            var objectKey = {};
            for( var key in metamodel.supportData){
                objectKey = key;
            } 
            var optionsMapForSupportData = $rootScope.optionsMapForURL.get(resourceURL1);
            if(resourceURL1 !== undefined && $rootScope.optionsMapForURL === undefined){
                callOptions($rootScope, resourceURL1, function(optionsObj){
                    metamodel.supportData[objectKey].forEach(function(supportDependency){
                        if(optionsObj.get(supportDependency)){
                            resourceFactory.get(optionsMapForSupportData.get(supportDependency).href,$rootScope.setHeaders).success(function(httpResponse){
                                var data = httpResponse.data || httpResponse;
                                if (data) {
                                    propertiesObject[supportDependency] = {};
                                    var obj = {};
                                    obj.enum = data;
                                    propertiesObject[supportDependency].metainfo = obj;
                                    propertiesObject[supportDependency].self = resourceURL;
                                    propertiesObject[supportDependency].value = responseData[supportDependency];  

                                }
                            }).error(function(){
                                $rootScope.loader.loading=false;
                            });
                        }
                    });
                });
            } else{
                metamodel.supportData[objectKey].forEach(function(supportDependency){
                    if($rootScope.optionsMapForURL.get(resourceURL1) && $rootScope.optionsMapForURL.get(resourceURL1).get(supportDependency)){
                        resourceFactory.get(optionsMapForSupportData.get(supportDependency).href,$rootScope.setHeaders).success(function(httpResponse){
                            var data = httpResponse.data || httpResponse;
                            if (data) {
                                propertiesObject[supportDependency] = {};
                                var obj = {};
                                obj.enum = data;
                                propertiesObject[supportDependency].metainfo = obj;
                                propertiesObject[supportDependency].self = resourceURL1;
                                propertiesObject[supportDependency].value = responseData[supportDependency];  
                            }
                        }).error(function(){
                            $rootScope.loader.loading=false;
                        });         
                    }
                });
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
            for(var itemKey in responseData._links){
                if(itemKey === 'item'){
                    var items = responseData._links[itemKey];
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
                        } else if(responseData._embedded){
                             for (var listKey in responseData._embedded){
                                var embeddedItems = responseData._embedded[listKey];
                                if(!Array.isArray(embeddedItems)){
                                    embeddedItems = [embeddedItems];
                                }
                                for(var k=0; k <embeddedItems.length; k++){
                                    var embeddedItem = embeddedItems[k];
                                    
                                    for(var linkKey in embeddedItem._links){
                                        var link = embeddedItem._links[linkKey];
                                        if(item.href === link.href){
                                            if(summaryData){
                                                summaryData[item.href] = _processResponse();
                                                for(var property1 in embeddedItem){
                                                    summaryData[item.href].properties[property1] = {value: embeddedItem[property1]};
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    
                                }
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
        
        if(responseData){
            if(responseData._links){
                if(responseData._links.self){
                    resource.href = responseData._links.self.href;    
                }

                if(responseData._links.up){
                    resource.up = responseData._links.up.href;    
                }
    
            }

            resource.properties = _processProperties(responseData, metamodel);
            resource.dependencies = _extractBusinessDependencies(responseData, metamodel);
            resource.items = _extractItemDependencies(responseData, summaryData);

	
            // Process CRUD operations to check whether or not we can PATCH, DELETE...
            if(responseData._options && responseData._options.links){
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
           
        }

        return resource;
    }


    this.getDefaultValues = function getDefaultValues(action, metaModel, properties){
        properties = properties || {};

        if(metaModel.defaultValue !== undefined){
            angular.forEach(metaModel.defaultValue, function(resource) {
                if(action ===resource.action){
                    if(resource.value === 'Date'){
                        resource.value = formatIntoDate(new Date());    
                    }

                    properties[resource.field] = {
                        value: resource.value,
                        metainfo:{}
                    };
                }
            });
        }

        // In some cases the default values are not defined in the same metamodel that starts an action, like with wizards for example
        // so we iterate over all the metamodels being used to get their default values
        if(metaModel.linkedMetamodels){
            metaModel.linkedMetamodels.forEach(function(elem){
                if($rootScope.metamodel){
                getDefaultValues(action, $rootScope.metamodel[elem], properties);
                }
            });
        }

        return properties;
    };

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
    this.prepareToRender = function(rootURL, metamodel, resultSet, dependencyName, refresh, validationCallback){
        console.log('prepareToRender-----'+rootURL);
        // Entry validation
        if(!resultSet){
            return $q(function(resolve, reject){
                reject('No result set to store the results');
            });
        } else if(!resultSet.deferred){
            resultSet.deferred = $q.defer();
            resultSet.pending = 1;
        }

        var methodResourceFactory = resourceFactory.get;
        if (refresh) {
            methodResourceFactory = resourceFactory.refresh;
        }

        var payload;
        if(metamodel.resource){
         payload = JSON.parse(sessionStorage.getItem(metamodel.resource+'_'+metamodel.actionOnScreen+'_params'));
       }
        sessionStorage.removeItem(metamodel.resource+'_'+metamodel.actionOnScreen+'_params');
        var responseGET = methodResourceFactory(rootURL, payload);
        // Cached response (resource directory) or not, we always get a promise
        if(responseGET.then){
            responseGET.then(function success(httpResponse){
                
                var responseData = httpResponse.data || httpResponse;
                var summaryData = {};
                resultSet.pending--;

                // Add the resource to the result set
                resultSet[rootURL] = _processResponse(responseData, metamodel, summaryData);
                resultSet[rootURL].identifier = rootURL.substring(rootURL.lastIndexOf('/')+1);
                // Build the right href. When there are url parameters, they are not included in the href so we need to include them
                resultSet[rootURL].href = rootURL.substring(0, rootURL.lastIndexOf('/')+1)+resultSet[rootURL].identifier;
                resultSet[rootURL].identifier = dependencyName || resultSet[rootURL].identifier;
               // $rootScope.resourceUrl = rootURL;

                // Analyze business dependencies in order to extract them
                resultSet[rootURL].dependencies.forEach(function(url){
                    console.log('Invoked for dependencies - '+url.href);
                    resultSet.pending++;
                    self.prepareToRender(url.href, metamodel, resultSet, url.resource, refresh, validationCallback);
                });                

                // Shall we stick with the summaries or shall we retrieve the whole item ??
                if(!metamodel.summary){
                    resultSet[rootURL].items.forEach(function(url){
                        console.log('Invoked for item details - '+url.href);
                        resultSet.pending++;
                        self.prepareToRender(url.href, metamodel, resultSet, null, refresh, validationCallback);
                    });
                } else {
                    for(var resourceURL in summaryData){
                        resultSet[resourceURL] = summaryData[resourceURL];
                        resultSet[resourceURL].identifier = resourceURL.substring(resourceURL.lastIndexOf('/')+1);
                        resultSet[resourceURL].href = resourceURL;
                    }
                }

                if(resultSet.pending === 0){
                    var deferred = resultSet.deferred;
                    delete resultSet.deferred;
                    delete resultSet.pending;
                    if(typeof validationCallback === 'function'){
                        validationCallback(metamodel, resultSet);  
                    } 

                    deferred.resolve(resultSet);
                }
            }, function error(errorResponse){
                // FIXME TODO: Do something useful if required, for now just logging
                console.error(errorResponse);
                throw errorResponse;
            });
        }

        return resultSet.deferred.promise;
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
                if($rootScope.action !== 'create') {
                    //Options call for the resources in the meta model.
                    resourceFactory.options(newURL, $rootScope.headers).success(function(responseData){
                    var data = responseData.data || responseData;
                    //Fetch the options response
                    var optiondataobj = data._options.links;
                    var options;
                    if(tab !== undefined) {
                        //Fetch the links response
                        var tabObj = data._links[tab];

                        if(tabObj !== undefined){

                            var tabUrl = tabObj.href;

                            resourceFactory.options(tabUrl, $rootScope.headers).success(function(responseData1){
                                var data1 = responseData1.data || responseData1;
                                var detailTabUrl = data1._links.item.href;
                                resourceFactory.options(detailTabUrl, $rootScope.headers).success(function(responseData2){
                                    var data2 = responseData2.data || responseData2;
                                    optiondataobj = data2._options.links;
                                    setOptionsMapForResource(optiondataobj, optionsMapForResource);
                                    scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                                    if(action !== undefined || $rootScope.actionAfterNavigation !== undefined){
                                        options = optionsMapForResource.get(action) || optionsMapForResource.get($rootScope.actionAfterNavigation);
                                        if(options !== undefined && patchFieldName !== undefined){
                                            options = sanitizeSchema(patchFieldName, options);
                                            httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                            $rootScope.actionAfterNavigation = undefined;
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
                            if(action !== undefined  || $rootScope.actionAfterNavigation !== undefined){
                                 options = optionsMapForResource.get(action) || optionsMapForResource.get($rootScope.actionAfterNavigation);
                                
                                if(options !== undefined){
                                    httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                    $rootScope.actionAfterNavigation = undefined;
                                }
                            }
                        }
                        } else {
                            setOptionsMapForResource(optiondataobj, optionsMapForResource);
                            scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                            if(action !== undefined  || $rootScope.actionAfterNavigation !== undefined){
                                options = optionsMapForResource.get(action) || optionsMapForResource.get($rootScope.actionAfterNavigation);
                                if(options !== undefined){
                                    httpMethodToBackEnd(growl, item, scope, resourceFactory, $rootScope, options, resolve);
                                    $rootScope.actionAfterNavigation = undefined;
                                }
                            }
                        }
                    });
                }
                delete $rootScope.action;
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

function invokeHttpMethod(growl, item, $scope, resourceFactory, properties, $rootScope, options, defaultValues, actionURL, $location, tab, apiMsg ,resolve){
    //Retrieve the URL, Http Method and Schema from the options object
    var url = options.href;
    var httpmethod = options.httpmethod;
    console.log(options.action + ' Action : Perform '+httpmethod +' operation on URL - '+url +' with following params - ');
    //$scope.resourceUrl = url;
    var params={};
    if(httpmethod==='GET'){
        //Set the params data from the screen per the schema object for the given action (from the options object)
        params = setDataToParams(properties, params);
        $rootScope.loader.loading=true;    
        
        //Call the get method on the Data Factory with the URL, Http Method, and parameters
        resourceFactory.get(url,params,$rootScope.headers).success(function(response){
            var data = response || response.data;
            if(data.outcome === 'success'){

            }
            $scope.resourceUrl= url;
            $rootScope.resourceUrl = url;
            
            $rootScope.loader.loading=false;
            if(actionURL){
                $rootScope.navigate(actionURL);
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            growl.error($rootScope.locale.GET_OPERATION_FAILED);
        });
    } else if(httpmethod==='POST'){
        // First we get the default values into the options properties because thise properties
        // are well constructed (with self, metainfo, etc)
        defaultValues = loadFromDefaultSet(options.properties, defaultValues);
        // Then we repeat the same process, but in this case with the property collection and the
        // values returned from the previous operation
        properties = loadFromDefaultSet(properties, defaultValues);
        params = setDataToParams(properties, params);
        $rootScope.loader.loading=true;
        //Call the post method on the Data Factory
        resourceFactory.post(url,params,$rootScope.headers).success(function(httpResponse){
            var data = httpResponse.data || httpResponse;
        if (data) {
            if(data.outcome === 'failure'){
                    angular.forEach(data.messages, function(value){
                        growl.error(value);
                    });
                }
                if(apiMsg !== undefined && data.outcome === apiMsg){
                    angular.forEach(data.messages, function(value){
                        growl.success(value);
                    });
                }
                 if(data._links && data._links.self===undefined){
                 $scope.resourceUrl= data._links[0].self.href;
                 $rootScope.resourceUrl= $scope.resourceUrl;  
            }else{
                $scope.resourceUrl= data._links.self.href;
                $rootScope.resourceUrl= data._links.self.href;
            }  
            if(actionURL){
                $rootScope.navigate(actionURL);
            }
           // $scope.optionUrl = data._links.self.href;
            $rootScope.resourceHref = data._links.self.href;
            $rootScope.loader.loading=false;
            if(resolve) {
                resolve(httpResponse);
            }                    
        }
        }).error(function(){
            $rootScope.loader.loading=false;
        });
    } else if(httpmethod==='PATCH'){

        $rootScope.loader.loading=true;
        //Call the patch method on the Data Factory
        //Set the params data from the screen per the schema object for the given action (from the options object)
        params = setDataToParams(properties, params);

        resourceFactory.patch(url,params,$rootScope.headers).success(function(responseData){
            var data = responseData.data || responseData;
            if (data) { 
                if(data.outcome === 'failure'){
                    angular.forEach(data.messages, function(value){
                        growl.error(value.message);
                    });
                }
                if(apiMsg !== undefined && data.outcome === apiMsg){
                    angular.forEach(data.messages, function(value){
                        growl.success(value.message);
                    });
                } else if(actionURL !== undefined){ 
                    $rootScope.loader.loading=false;           
                    if(resolve) {
                        resolve(responseData);
                    }
                } else{
                    $rootScope.loader.loading=false;
                    if(resolve) {
                        resolve(responseData);
                    }    
                }
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            //showMessage($rootScope.locale.PATCH_OPERATION_FAILED);
            growl.error($rootScope.locale.PATCH_OPERATION_FAILED);
        });
    } else if(httpmethod==='DELETE'){
        resourceFactory.delete(url,$rootScope.headers).success(function(responseData){
	       var data=responseData.data || responseData ;
            if(data.outcome === 'success'){
               
            }else{
                angular.forEach(data.messages, function(value){
                    growl.error(value.message);
                });
            }
        });
    }
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
        resourceFactory.get(url,params,$rootScope.headers).success(function(responseData){
            var data = responseData.data || responseData;
            $rootScope.loader.loading=false;
            //Load the results into the search results table
            if(options.action==='search'){
                if(data._links.item && Object.keys(data._links.item).length > 0){
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
                            //angular.forEach(data.messages, function(value){
                            //growl.success(value.message);
                            //});
                            params=undefined;
                            if(data && data._links && data._links.self && data._links.self.href){
                                resourceFactory.refresh(data._links.self.href, params, $rootScope.headers).success(function(responseData){
                                    var data = responseData.data || responseData;
                                    $rootScope.loader.loading=false;
                                    if(data.outcome==='success'){

                                    }else if(data.outcome === 'failure'){
                                        angular.forEach(data.messages, function(value){
                                            growl.error(value.message);
                                        });
                                    }
                                });
                            }
                    } else{
                        //showMessage($rootScope.locale.CREATE_OPERATION_FAILED);
                        growl.error($rootScope.locale.CREATE_OPERATION_FAILED);
                     } 
                    if(resolve) {
                        resolve();
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
    }else if(httpmethod==='PATCH'){
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
           resourceFactory.refresh(url,params,$rootScope.headers); 
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
    
    if(m.metamodel.showHeader === undefined){
        m.metamodel.showHeader = true;
    }
    $rootScope.metamodel.showHeader = m.metamodel.showHeader;
    
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

function loadFromDefaultSet(properties, defaultValues){
    if(properties !== undefined && defaultValues !== undefined){
        for (var key in defaultValues) {
            if (!properties[key] || !properties[key].value || properties[key].value === '') {
                if(defaultValues[key] !== undefined){
                    properties[key] = properties[key] || defaultValues[key] || {};
                    properties[key].value = defaultValues[key].value;    
                }
            }
        }
    }
    return properties;
}

function setDataToParams(properties, params){
    if(properties !== undefined){
        angular.forEach(properties, function(val, key){
            if(properties[key] !== undefined){
                var value = properties[key].value;
                if(properties[key].metainfo){
                    if(properties[key].metainfo.type){
                        var type = properties[key].metainfo.type;
                        if(type !== undefined && type==='static'){
                            value = properties[key].metainfo.value;
                        }
                    }
                } 

                var format = {};
                if(value === null || value === undefined || value === '' || value === 'undefined'){
                    //continue
                }else{
                    if(properties[key].metainfo && properties[key].metainfo.format){
                        format = properties[key].metainfo.format;
                    }
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
                    params[key] = value;
                }
            }
        });    
    }
    return params;
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
