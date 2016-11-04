'use strict';

/*global app*/

app.factory('autocreateFactory', function($rootScope, quotescreateFactory, resourceFactory){
    return {
        navigateToTab: function(params){
            quotescreateFactory.navigateToTab(params);
        },
        navigateToWizard: function(params){
            quotescreateFactory.navigateToWizard(params);
        },
        navigateToScreen: function(params){
            quotescreateFactory.navigateToScreen(params);
        },
        //typeAhead function OC-672
        search: function(element){
            var url = '';
            var newUrl = '';
            return element.field.getParentResource().then(function(response){
                var data = response.data || response;
                if(data){
                    url = $rootScope.hostURL;
                    var regionToSORMap = $rootScope.regionToSoR;
                    var applName = regionToSORMap[$rootScope.regionId];
                    newUrl = url.replace(':regionId',applName);
                    url = newUrl + element.field.options.apiTypeAhead;
                    for(var i=0; i<element.field.options.fieldTypeAhead.length; i=i+2){
                        url = url + element.field.options.fieldTypeAhead[i] + element.resources[element.field.options.fieldTypeAhead[i+1]].value;
                    }
                }
                return resourceFactory.get(url).then(function(response){
                    var data = response.data || response;
                    return data._links.item;
                
                });
            });
        },
        
        selectOption: function(element){
            var payload = {};
            var link = '';
            return element.field.getParentResource().then(function(response){
                var data = response.data || response;
                if (data){                   
                        link = element.id;       
                        payload[link] = element.$item.name;                   
                }
            }); 
        }
    };
});