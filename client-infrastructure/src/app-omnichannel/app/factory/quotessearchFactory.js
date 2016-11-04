'use strict';

/*global app*/

var msg;
app.factory('quotessearchFactory', function($rootScope, resourceFactory, MetaModel, anonymousFactory, $location, $filter, growl){
    return {
        actionHandling: function(params){      
            MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location); 
        },
        navigateToScreen: function(params){
            anonymousFactory.navigateToScreen(params);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            $rootScope.resourceHref = resource.href;
            MetaModel.handleAction($rootScope, $scope, inputComponent, resource.href, undefined, resourceFactory, undefined, $location);
        },
        actionHandlingWithValidation: function(params){
            var validation = false;
            //Iterate through the properties to determine if atleast one is valued
            angular.forEach(params.properties, function(val, key){
                var value = params.properties[key].value;

                if(value === null || value === undefined || value === '' || value === 'undefined'){
                    //continue
                }else{
                    validation = true;
                }
            });

            if(params.defaultValues !== undefined){
                for(var key in params.defaultValues){
                    if(!params.properties[key]){
                        params.defaultValues[key].metainfo = {};
                        params.properties[key]= params.defaultValues[key];
                    }
                } 
            }
            
            if(validation){
                 if(msg !== undefined){
                   msg.destroy();
                 }
                MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location); 
            }else{
                msg = growl.error($filter('translate')('VALIDATION_ATLEAST_ERR_MSG'));
            }
        },
        actionHandlingWithDefaults: function(params){
            if(params.defaultValues !== undefined){
                for(var key in params.defaultValues){
                    if(!params.properties[key]){
                        params.defaultValues[key].metainfo = {};
                        params.properties[key]= params.defaultValues[key];
                    }
                } 
            }
            MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location);
        },
        homeOwnerDropdown: function(){
            return [$filter('translate')('_IN005')];
        },
        resetscreen: function(params){
            angular.forEach(params.properties, function(val, key){
                 params.properties[key].value=null;
            });
        },
    };
});