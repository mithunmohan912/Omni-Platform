'use strict';
/*
global app,showMessage 
*/
app.service('OCAppConfig', function($resource, $rootScope){	
    this.load = function() {
        $resource('assets/resources/config/appConf.json').get(function(data) {
            if (data.config !== undefined) {
			$rootScope.config = data.config.base;
                if (!$rootScope.HostURL) {
                    $rootScope.HostURL = $rootScope.config.hostURL;
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