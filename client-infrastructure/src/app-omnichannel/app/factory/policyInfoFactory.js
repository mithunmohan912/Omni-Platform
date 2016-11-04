'use strict';

/*global app*/

app.factory('policyInfoFactory', function($rootScope, quotescreateFactory){
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
        initDropdown: function(){
             return { 'SC':'South Carolina'
            
                                                           };
                        }
      ,
        initDropdown2: function(){
            return { '12':'12 months',
                '3':'3 months',
                '6':'6 months',
                '0':'Odd Term'
                                                           };

                        } ,
        initDropdown3: function(){
            return { 'A0':'Agent Annually',
                'A2':'Semi-Annual',
                'C0':'Customer Annually'                         };

                        },
        navigateToWizard: function(params){
            quotescreateFactory.navigateToWizard(params);
        }

    };
});