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

                $rootScope.cleanAPIURL = $rootScope.config.cleanAPIURL;
				if(!data.config.base)	{
                    showMessage('This application \'s configuration is not available', '30');
                }
               
            }
        });
    };
});