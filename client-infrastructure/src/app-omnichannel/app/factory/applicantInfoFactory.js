'use strict';

/*global app*/

app.factory('applicantInfoFactory', function($rootScope, quotescreateFactory){
     return {
        saveProperty:function(params){
            quotescreateFactory.saveProperty(params);
        },
       navigateToTab: function($scope, inputComponent){
            quotescreateFactory.navigateToTab($scope, inputComponent);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        },
        navigateToWizard: function(params){
            quotescreateFactory.navigateToWizard(params);
        },
         initDropdown: function(){
                                            return {    '000505':'PT HO (00,05,05)*'
                                                           };

                        },
                         initDropdown1: function(){
             return { 'SC':'South Carolina'
            
                                                           };
                        }

    };
});