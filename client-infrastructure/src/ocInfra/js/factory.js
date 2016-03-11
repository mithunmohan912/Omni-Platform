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
            //console.log('Metadata----'+m.metadata);
            loadOptionsDataForMetadata(m, scope, screenId,dataFactory);
        }, function() {
            $rootScope.showIcon = false;
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        });
        //console.log('LOADED METADATA');

    };

    this.actionHandling=function($scope, screenId, action, dataFactory, payLoad){
    
    var metaModel = $scope.metadata[screenId];
    //console.log('Meta Model---'+metaModel);
    //Retrieve resource list from the meta model
    var resourcelist = metaModel.resourcelist;
    //console.log('Resource List---'+resourcelist);

    var headers= {
        'Accept' : 'application/json, text/plain, */*',
        'Content-Type' : 'application/json, text/plain, */*'
    };

    if(resourcelist !== undefined && resourcelist.length > 0){
    //Iterate through the resource list of meta model
        angular.forEach(resourcelist, function(resource) {
            //console.log('Resource---'+resource);
            var optionsMapForResource = $scope.optionsMap[resource];
            var options = optionsMapForResource.get(action);
            var url = options.url;
            var httpmethod = options.httpmethod;
            var schema = options.schema;

            //console.log('HTTP Method---'+httpmethod);
            //console.log('URL---'+url);

            if(httpmethod==='GET'){
                var params = {};
                params = setData($scope, schema, params);
                //console.log('Search Parameters---'+ params);
                dataFactory.search(url,httpmethod,params,headers).success(function(data){
                    var listDispScope = angular.element($('.table-striped')).scope(); 
                    if(data._links.item){
                        //console.log('displayed');
                        $scope.displayed = data._links.item;
                        listDispScope.stTableList=data._links.item;
                        $scope.showResult=true;
                        listDispScope.showResult = true;
                    }else{
                        listDispScope.stTableList = [];
                        listDispScope.showResult = false;
                    }        
                });
            } else if(httpmethod==='POST'){
                //Work to do...
                payLoad = setData($scope, schema, payLoad);
                //console.log('Payload Parameters---'+ payLoad);
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
        //console.log('Resource List---'+resourcelist);

        if(resourcelist !== undefined && resourcelist.length > 0){
            //Iterate through the resource list of meta model
            angular.forEach(resourcelist, function(resource) {
                //Formulate the URL for the options call
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
                            //console.log('Options---'+object.action +' '+ object.url +' '+object.httpmethod);
                            optionsMapForResource.set(object.action, object);
                        }); 
                        //console.log(optionsMapForResource);
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
                object[key] = value;
            }
    });
    return object;
}

app.factory('TableMetaData', function($resource) {

    this.load = function(tableId, onSuccess) {
        //$rootScope.tableMetaData = {};
        $resource('assets/resources/metadata/table/' + tableId + '.json').get(function(m) {

            //$rootScope.tableMetaData = m.tableMetaData;

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