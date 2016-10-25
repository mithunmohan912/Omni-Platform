'use strict';
/*global app*/

app.controller('HeaderController', function($scope, $rootScope, $http, $location, $resource, MetaModel,tmhDynamicLocale, $translate ,$injector) {
    $rootScope.logout = function() {
        // logout user
        if ($rootScope.config !== undefined && $rootScope.config.authnURL !== undefined) {
            $http({
                method : 'POST',
                headers : {
                    'X-IBM-Client-ID' : $rootScope.config.apiGatewayApiKeys.client_id,
                    'X-IBM-Client-Secret' : $rootScope.config.apiGatewayApiKeys.client_secret,
                    'iPlanetDirectoryPro' : sessionStorage.tokenId,
                    'Content-Type' : 'application/json'
                },
                data : {},
                url : $rootScope.config.authnURL + '/sessions?_action=logout'
            }).success(function(data) {
                console.log('Logout successful');
                console.log('DATA='+data.result);
            });
        }

        delete $rootScope.user;
        delete localStorage.username;
        delete $http.defaults.headers.common.Authentication;
        $rootScope.isAuthSuccess = false;
        localStorage.clear();
        sessionStorage.clear();
        $rootScope.staticInfo = {};
        $location.url('/');
    };

    $scope.userCheck = function() {
        if($rootScope.user && $rootScope.user.roles && $rootScope.user.roles[0] === 'ROLE_DEV'){
                     $scope.showIcon = true;
                 }else{
                    $scope.showIcon = false;    
                 }
             };
    $scope.setLocate = function(newlocale) {

        $rootScope.newlocale = newlocale;
        angular.forEach($rootScope.localeOpts.options, function(val) {
            if (val.value === $rootScope.newlocale) {
                $rootScope.selectedLanguage = val.description;
            }
        });
        $resource('ocInfra/assets/resources/i18n/' + newlocale + '.json').get(function(data) {
            $rootScope.locale = data;
            tmhDynamicLocale.set(newlocale);
            $translate.use(newlocale);  

        }, function() {});


    };

    MetaModel.load( $scope, null,'header',function(data) {
       // console.log('header json got called' + data);

        $rootScope.headermetamodel = data;
    }, function() {});


     $scope.execute = function(inputComponent) {
        if(inputComponent.factoryName){
            try {
                    $scope.actionFactory = $injector.get(inputComponent.factoryName);
                    var params = {};
                    params.defaultValues={};
                    params.scope = $scope;
                    params.inputComponent = inputComponent;
                    params.properties = {};
                    $scope.actionFactory[inputComponent.method](params);

                    } catch(e) {
                        console.log($scope.factoryName + ' not found');
                   }
            }
            else{
                $scope.navigate(inputComponent.actionurl,inputComponent.name);
            }
        };

    
   

});
