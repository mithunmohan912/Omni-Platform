'use strict';


/*
global app, showMessage
*/

/*
exported ScreenController
*/

app.factory('MetaData', function($resource, $rootScope, $location, $browser, $q, dataFactory) {

    this.load = function(scope, screenId, supportPayLoad, actionPayLoad, onSuccess) {
        $resource('assets/resources/metadata/' + screenId + '.json').get(function(m) {
            scope.screenId = screenId;
            $rootScope.title = m.metadata.title;

            if (m.include && m.include.length > 0) {
                loadReferencedMetaModels(scope, m, screenId, supportPayLoad, actionPayLoad, onSuccess, $resource, $q, $rootScope, $browser);
            } else {
                setScreenData($rootScope, scope, m, screenId, $browser, supportPayLoad, onSuccess);
            }
            loadOptionsDataForMetadata(m, scope, screenId,dataFactory);
        }, function() {
            $rootScope.showIcon = false;
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        });
    };


    this.actionHandling=function($scope, screenId, action, dataFactory){
    //Retrieve the meta-model for the given screen Id from the scope
    var metaModel = $scope.metadata[screenId];
    
    //Retrieve the resource list from the meta-model
    var resourcelist = metaModel.resourcelist;

    //Create the headers for the request
    var headers= {
        'Accept' : 'application/json, text/plain, */*',
        'Content-Type' : 'application/json, text/plain, */*'
    };


    if(resourcelist !== undefined && resourcelist.length > 0){
    //Iterate through the resource list for the meta model
        angular.forEach(resourcelist, function(resource) {
            //Retrieve the optionsMap for the resource
            var optionsMapForResource = $scope.optionsMap[resource];
            //Retrieve the options object for the given action from the resource optionsMap
            var options = optionsMapForResource.get(action);

            //Retrieve the URL, Http Method and Schema from the options object
            var url = options.url;
            var httpmethod = options.httpmethod;
            var schema = options.schema;
            console.log('SCREEN ACTION-'+action);
            console.log('Perform '+httpmethod +' operation on URL - '+url +' with following params - ');
            var params={};
            //Set the params data from the screen per the schema object for the given action (from the options object)
            params = setData($scope, schema, params);
            
            if(httpmethod==='GET'){    
                //Call the get method on the Data Factory with the URL, Http Method, and parameters
                dataFactory.get(url,params,headers).success(function(data){

                    //Load the results into the search results table
                    var listDispScope = angular.element($('.table-striped')).scope(); 
                    if(data._links.item){
                        listDispScope.stTableList=data._links.item;
                        listDispScope.showResult = true;
                    }else{
                        listDispScope.stTableList = [];
                        listDispScope.showResult = false;
                    }

                });

            } else if(httpmethod==='POST'){
                //Call the post method on the Data Factory with the URL, Http Method, and parameters
                dataFactory.post(url,params,headers).success(function(data){
                if (data) {
                    console.log(data.message);
                }
            });
            }
    });
    }
};
return this;
});

function loadOptionsDataForMetadata(m, scope, screenId,dataFactory){

        //Read metadata from the root scope
        var metaModel = scope.metadata[screenId];
        //console.log('Meta Model---'+metaModel);

        //Retrieve resource list from the meta model
        var resourcelist = metaModel.resourcelist;

        if(resourcelist !== undefined && resourcelist.length > 0){
            //Iterate through the resource list of meta model
            angular.forEach(resourcelist, function(resource) {
                //Formulate the URL for the options call
                console.log('RESOURCE : '+resource);
                var url = scope.HostURL + resource;
                //var optiondataobj = {};
                //Fetch the options map for the given resource
                if(scope.optionsMap === undefined){
                    scope.optionsMap = [];
                }
                var optionsMapForResource = scope.optionsMap[resource];
                if(optionsMapForResource === undefined){
                    optionsMapForResource = new Map();
                    //Options call for the resources in the meta model.
                    dataFactory.options(url).success(function(data){

                        //Fetch the options response
                        var optiondataobj = data._options.links;
                        //var optionsArray= [];
                        //If the map has not been populated
                
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
                            optionsMapForResource.set(object.action, object);
                        }); 
                        scope.optionsMap[resource] = optionsMapForResource;
                    });
                }
        });
    }
    }

function loadReferencedMetaModels(scope, metaModel, screenId, supportPayLoad, actionPayLoad, onSuccess, $resource, $q, $rootScope, $browser) {
    var promises = [];
    angular.forEach(metaModel.include, function(value) {
        promises.push($resource('assets/resources/metadata/' + value + '.json').get(function(m) {
            $rootScope.metadata[value] = m.metadata;
        }, function() {
            $rootScope.showIcon = false;
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        }).$promise);
    });
    $q.all(promises).then(function() {
        setScreenData($rootScope, scope, metaModel, screenId, $browser, supportPayLoad, onSuccess);
    });
}

function setScreenData($rootScope, scope, m, screenId, $browser, supportPayLoad, onSuccess) {
    //console.log('set screen data---'+m.metadata);
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
}

function setData($scope, schema, object){
    angular.forEach(schema.properties, function(val, key){  
            var value = $scope.data[key];
            if(value === null || value === undefined || value === '' || value === 'undefined'){

            }else{
                var format = val.format;
                if(format !== undefined && format==='date'){
                    //Format the date in to yyyy/mm/dd format
                    value = formatIntoDate(value);
                }
                console.log(key +' : '+value);
                object[key] = value;
            }
    });
    return object;
}

function formatIntoDate(value){
   return value.getFullYear() + '/' + (value.getMonth()+1) + '/' + value.getDate();
}

app.factory('TableMetaData', function($resource) {
    this.load = function(tableId, onSuccess) {
        $resource('assets/resources/metadata/table/' + tableId + '.json').get(function(m) {
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