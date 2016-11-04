'use strict';

/*global app*/

app.factory('generalInfoFactory', function($rootScope, quotescreateFactory){
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
                                            return {  '01':'01',
                '02':'02',
                '03':'03',
                '04':'04',
                '05':'05',
                '06':'06',
                '07':'07'
                                                           };

                        },






                         initDropdown2: function(){
                                            return {  '0':'Less Than 1 Mile',
                '1':'1 to 5 Miles',
                '2':'6 to 10 Miles',
                '3':'Over 10 Miles'
                                                           };

                        } ,
                         initDropdown3: function(){
                                            return {  '0':'Not Applicable',
                '1':'Less Than 500 feet',
                '2':'Less Than 1000 feet',
                '3':'Under 1000 feet and lessthan 5 miles'    };

                        },

                        initDropdown4: function(){
                                            return {   'F':'FRAME',
                'M':' MANSORY',
                'S':'SUPERIOR CONST'
                                                           };

                        } ,
                         initDropdown5: function(){
                                            return {    '7':'SINGLE FAMILY',
                '1':'APPARTMENT',
                '2':'CO-OP',
                '3':'CONDIMINIUM',
                '4':'DUPLEX',
                '5':'OTHERS',
                '6':'ROW HOUSE'
                                                           };

                        } ,
                           initDropdown6: function(){
                                            return {  'O':'OWN PRIMARY',
                'T':'OWNER SEASONAL',
                'X':'TENANT PRIMARY',
                'S':'SECONDARY SEASONAL',
                'N':'SECONDARY NONSEASONAL'    };

                        } ,
                        
                        initDropdown7: function(){
                                            return {  'USA':'CAMDEN',
                '001':'COLUMBIA_METRO',
                '002':'UNGRADED',
                '003':'ABBEVILLE'
                                                           };

                        },
                         initDropdown8: function(){
                                            return {  'CAMDEN FD':'CAMDEN FD',
                'Metro FD':' COLUMBIAMETRO'
                                                           };

                        } ,
                         initDropdown9: function(){
                                            return {   'NG':'UNGRADED',
                'NA':'NOT APPLICABLE',
                'NP':' NON PARTICIPANT'    };

                        } ,
                        navigateToWizard: function(params){
            quotescreateFactory.navigateToWizard(params);
        }
    };
});