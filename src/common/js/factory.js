'use strict';


/*
global app, showMessage 
*/


app.factory('MetaData', function($resource, $rootScope, $location, $browser, $q) {

    this.load = function(scope, screenId, supportPayLoad, actionPayLoad, onSuccess) {
        $resource('assets/resources/metadata/' + screenId + '.json').get(function(m) {
            scope.screenId = screenId;
            $rootScope.title = m.metadata.title;

            if (m.include && m.include.length > 0) {
                loadReferencedMetaModels(scope, m, screenId, supportPayLoad, actionPayLoad, onSuccess, $resource, $q, $rootScope, $browser);
            } else {
                setScreenData($rootScope, m, screenId, $browser, supportPayLoad, onSuccess);
            }

        }, function() {
            $rootScope.showIcon = false;
            showMessage($rootScope.appConfig.timeoutMsg);
            return;
        });
    };
    return this;
});

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
        setScreenData($rootScope, metaModel, screenId, $browser, supportPayLoad, onSuccess);
    });
}

function setScreenData($rootScope, m, screenId, $browser, supportPayLoad, onSuccess) {

    $rootScope.metadata[screenId] = m.metadata;

    $browser.notifyWhenNoOutstandingRequests(function() {
        changeMandatoryColor($rootScope);
        $rootScope.$apply();

    });

    if (onSuccess) {
        onSuccess(m.metadata);
    }

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