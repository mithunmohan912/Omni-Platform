
'use strict';


/*
global app, showMessage
*/

/*
exported ScreenController
*/

app.factory('MetaData', function($resource, $rootScope, $location, $browser, $q, dataFactory) {

    this.load = function(scope, regionId, screenId, supportPayLoad, actionPayLoad, onSuccess, resolve) {
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
            if(screenId==='dashboard'){
                $rootScope.mainmenu=m.metadata;
            }
            $rootScope.title = m.metadata.title;

            if (m.include && m.include.length > 0) {
                loadReferencedMetaModels(scope, m, screenId, supportPayLoad, actionPayLoad, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve);
            } else {
                setScreenData($rootScope, scope, m, screenId, $browser, supportPayLoad, onSuccess);
            }
            
            loadOptions(m, scope, regionId, screenId,dataFactory, $rootScope);

            
        }, function() {
            $rootScope.showIcon = false;
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        });
    };


    this.actionHandling=function($scope, regionId, screenId, action, dataFactory, tab, resolve){
        //Retrieve the meta-model for the given screen Id from the scope
        var metaModel = $scope.metadata[screenId];
        
        //Add new values to $scope.data
        //incase the data is Date the code will select current data and reforamt 
        if(metaModel.defaultValue !== undefined && action ==='create'){
            angular.forEach(metaModel.defaultValue, function(resource) {
                if(resource.value === 'Date'){
                    resource.value = formatIntoDate(new Date());
                }
                $scope.data[resource.field] = resource.value;
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
                console.log('SCREEN ACTION-'+action);
                // make sure alway update OptionsData when update by tab
                if(action === 'update' && tab !== undefined){
                    optionsMapForResource = undefined;
                }
                if(optionsMapForResource === undefined){
                    loadOptionsDataForMetadata(resourcelist, $scope, regionId, dataFactory, $rootScope, action, tab, resolve);
                }else{
                    var options = optionsMapForResource.get(action);
                    httpMethodToBackEnd($scope, dataFactory, $rootScope, options, resolve);   
                }
                 
            });
        }
    };

    this.setHeaders = function($rootScope){
        $rootScope.headers = { 
            'Accept': 'application/vnd.hal+json, application/json',
            'Content-Type': 'application/json',
            'x-IBM-Client-id' : 'f9220738-65e5-432d-9b8f-05e8357d1a61',
            'x-IBM-Client-Secret' : 'gT1lS3aV8yS1iS3lY3kB7bL8pH0cH6nJ6yT4jH1aQ6pL8aR6hI' 
        };

        if($rootScope.user && $rootScope.user.name){
            $rootScope.headers.username = $rootScope.user.name;
        }
    };
    return this;
});

function loadOptions(m, scope, regionId, screenId,dataFactory, $rootScope){
        //Read metadata from the root scope
        var action;
        var metaModel = scope.metadata[screenId];

        //Retrieve resource list from the meta model
        var resourcelist;
        if(metaModel !== undefined){
            resourcelist = metaModel.resourcelist;
        }

        if(resourcelist !== undefined && resourcelist.length > 0){
            loadOptionsDataForMetadata(resourcelist, scope, regionId, dataFactory, $rootScope, action);
        }
}

function loadOptionsDataForMetadata(resourcelist, scope, regionId, dataFactory, $rootScope, action, tab, resolve){

        if(resourcelist !== undefined && resourcelist.length > 0){
            //Iterate through the resource list of meta model
            angular.forEach(resourcelist, function(resource) {
                
                console.log('RESOURCE : '+resource);

                //Formulate the URL for the options call
                var url;                
                if($rootScope.resourceHref) {
                    url = $rootScope.resourceHref;
                }
                else {
                    url = scope.HostURL + resource;
                }
                //Retrieve regionToSORMap from the rootScope
                var regionToSORMap = scope.regionToSoR;
                //Retrieve the application name for the given region Id
                var applName = regionToSORMap[regionId];
                //Replace the regionId with application name in the URL
                var newURL = url.replace(':regionId',applName);
                //Formulate the key for storing the options map for the given resource on the region
                var keyForOptionsMap = regionId +':'+resource;
                //Fetch the options map for the given resource

                if(scope.optionsMap === undefined){
                    scope.optionsMap = [];
                }

                var optionsMapForResource = scope.optionsMap[keyForOptionsMap];
                // make sure alway update OptionsData when update by tab
                if(action === 'update' && tab !== undefined){
                    optionsMapForResource = undefined;
                }

                if(optionsMapForResource === undefined){
                    optionsMapForResource = new Map();
                    
                    //Options call for the resources in the meta model.
                    dataFactory.options(newURL, $rootScope.headers).success(function(data){
                        //Fetch the options response
                        var optiondataobj = data._options.links;
                        var options;
                        if(tab !== undefined) {
                            //Fetch the links response
                            var tabObj = data._links[tab];

                            if(tabObj !== undefined){

                                var tabUrl = tabObj.href;

                                dataFactory.options(tabUrl, $rootScope.headers).success(function(data){

                                    var detailTabUrl = data._links.item.href;

                                    dataFactory.options(detailTabUrl, $rootScope.headers).success(function(data){

                                        optiondataobj = data._options.links;

                                        setOptionsMapForResource(optiondataobj, optionsMapForResource);

                                        scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                                        if(action !== undefined){
                                            options = optionsMapForResource.get(action);
                                            if(options !== undefined){
                                            httpMethodToBackEnd(scope, dataFactory, $rootScope, options, resolve);
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
                                    httpMethodToBackEnd(scope, dataFactory, $rootScope, options, resolve);
                                    }
                                }
                            }
                        }  else {

                            setOptionsMapForResource(optiondataobj, optionsMapForResource);

                            scope.optionsMap[keyForOptionsMap] = optionsMapForResource;
                            if(action !== undefined){
                                options = optionsMapForResource.get(action);
                                if(options !== undefined){
                                httpMethodToBackEnd(scope, dataFactory, $rootScope, options, resolve);
                                }
                            }
                        }
                    });
                }
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
        //optionsMapForResource.set(object.action, object);
        if(optionsMapForResource.get(object.action) !== undefined){
            optionsMapForResource.set(object.action, object);    
        }else{
            optionsMapForResource.set(object.action, object);    
        }
    });
}

function httpMethodToBackEnd($scope, dataFactory, $rootScope, options, resolve){


    //Retrieve the URL, Http Method and Schema from the options object
    var url = options.url;
    var httpmethod = options.httpmethod;
    var schema = options.schema;
    console.log('Perform '+httpmethod +' operation on URL - '+url +' with following params - ');

    var params={};
    //Set the params data from the screen per the schema object for the given action (from the options object)
    params = setData($scope, schema, params);

    if(httpmethod==='GET'){
    $rootScope.loader.loading=true;    
        //Call the get method on the Data Factory with the URL, Http Method, and parameters
        dataFactory.get(url,params,$rootScope.headers).success(function(data){
            $rootScope.loader.loading=false;
            //Load the results into the search results table
            var listDispScope = angular.element($('.table-striped')).scope(); 
            if(data._links.item){
                listDispScope.stTableList=data._links.item;
                listDispScope.showResult = true;
            }else{
                listDispScope.stTableList = [];
                listDispScope.showResult = false;
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            showMessage('Get Data Failed');
        });
    } else if(httpmethod==='POST'){
        $rootScope.loader.loading=true;
        //Call the post method on the Data Factory
        dataFactory.post(url,params,$rootScope.headers).success(function(data){
            if (data) {
                if($rootScope.regionId === 'us'){
                     if(data._links.self.premium !== '0.00'){
                     $scope.data['quote:identifier']=data._links.self.quoteNumber;
                     $scope.data['quote:annual_cost'] =data._links.self.premium;
                     showMessage('Created Successfully');
                     }
                     else{
                        showMessage('Create Operation Failed');
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
        dataFactory.patch(url,params,$rootScope.headers).success(function(data){
            $rootScope.loader.loading=false;
            if (data) {
                if(resolve) {
                    resolve();
                }
            }
        }).error(function(){
            $rootScope.loader.loading=false;
            showMessage('Patch Data Failed');
        });
    }
}

function loadReferencedMetaModels(scope, metaModel, screenId, supportPayLoad, actionPayLoad, onSuccess, $resource, $q, $rootScope, $browser, regionId, resolve) {
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
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        }).$promise);
    });
    $q.all(promises).then(function() {
        setScreenData($rootScope, scope, metaModel, screenId, $browser, supportPayLoad, onSuccess, resolve);
    });
}

function setScreenData($rootScope, scope, m, screenId, $browser, supportPayLoad, onSuccess, resolve) {
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

    if (onSuccess) {
        onSuccess(m.metadata);
    }
    if(resolve){
        resolve();
    }
}

function setData($scope, schema, object){

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
            if (onSuccess) {
                onSuccess(m.tableMetaData);
            }
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