'use strict';
/*
global app,showMessage 
*/
app.service('OCAppConfig', function($resource, $rootScope){	
    this.load = function() {
        $resource('assets/resources/config/appConf.json').get(function(data) {
            if (data.config !== undefined) {
			$rootScope.config = data.config.base;
                if (!$rootScope.hostURL) {
                    $rootScope.hostURL = $rootScope.config.hostURL;
                }
                if (!$rootScope.templatesURL) {
                    $rootScope.templatesURL = $rootScope.config.templatesURL;
                }
                if(!$rootScope.apiGatewayApiKeys){
                    $rootScope.apiGatewayApiKeys = $rootScope.config.apiGatewayApiKeys;
                }
                $rootScope.regionToSoR = $rootScope.config.regionToSoR;
                $rootScope.cleanAPIURL = $rootScope.config.cleanAPIURL;
				if(!data.config.base)	{
                    showMessage('This application \'s configuration is not available', '30');
                }
               
            }
        });
    };
});