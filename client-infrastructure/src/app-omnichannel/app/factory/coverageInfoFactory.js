'use strict';

/*global app*/

app.factory('coverageInfoFactory', function($rootScope, quotescreateFactory,quotessearchFactory){
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
        initDropdown1: function(){
                                            return {    '2':'Homeowners 2 ',
                '3':'Homeowners 3 ',
                '4':'Homeowners 4 ',
                '6':'Homeowners 6 '
                                                           };

                        },
                        initDropdown2: function(){
                                            return {    '100.00':'100 ',
                '250.00':'250 ',
                '500.00':'500 ',
                '1000.00':'1000 ',
                '2500.00':'2500 '
                                                           };

                        },
                         initDropdown3: function(){
                                            return {  '0':'NOT APPLICABLE',
                '1':'1%',
                '2':'2%',
                '3':'5%'  };

                        },

                        initDropdown4: function(){
                                            return {    '100000':'100000',
                '300000':'300000',
                '500000':'500000'           };

                        } ,
                         initDropdown5: function(){
                                            return {   '1000':'1000',
                '5000':'5000'
                                                           };

                        } ,
                           initDropdown6: function(){
                                            return {    '0':'NOT APPLICABLE',
                '1':'1% Annually',
                '2':'2% Annually',
                '3':'3% Annually',
                '4':'4% Annually',
                '6':'6% Annually',
                '8':'8% Annually'    };

                        },
                         initDropdown7: function(){
                                            return {  'N':'NO BURGLAR ALARM',
                'Y':'BURGLAR ALARM'
                };

                        },
                         initDropdown8: function(){
                                            return {  'N':'NO FIRE ALARM',
                'Y':'FIRE ALARM'
                  };

                        },
                         initDropdown9: function(){
                                            return {  'N':'NO SPRINKLER',
                'A':'CLASS A SPRINKLER',
                'B':'CLASS B SPRINKLER'
                };

                        },
         navigateToWizard: function(params){
            quotescreateFactory.navigateToWizard(params);
        },

        actionHandling: function(params){
            quotessearchFactory.actionHandling(params);
        }//,
      //  calculatePremium: function(params){
       //     additionalInfoFactory.calculatePremium(params);
       // }
    };
});