'use strict';

/*global app*/

app.factory('quotescreateFactory', function($rootScope, $location, MetaModel, quotessearchFactory, resourceFactory, $q, validationFactory){
    return {
        navigateToTab: function(params){
            if(params.inputComponent.action){
                new Promise(function(resolve) {
                    MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, undefined, $location, resolve);
                }).then(function(){
                    if(params.inputComponent.actionURL){
                        quotessearchFactory.navigateToScreen(params);
                    }
                });
            } else if(params.inputComponent.actionURL){
               quotessearchFactory.navigateToScreen(params);
            }
        },
        navigateToWizard: function(params){
            if(params.inputComponent.action){
                // We shouldn't have .then that does nothing because we break the promise chain. new Promise doesn't work in IE, we use $q instead
                return $q(function(resolve) {
                 params.scope.isWizardValid = validationFactory.isNextStepValid(params.scope, params.inputComponent);
                    MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, params.defaultValues, $location, resolve);
                });
            } 
        },
        navigateToScreen: function(params){
            quotessearchFactory.navigateToScreen(params);
        },
        navigateToWizardUS: function navigateUS(params){
            params.properties = this.saveProperty.propertiesForCreate;

            // Check to be 100% sure we actually got the promise back
            var promise = this.navigateToWizard(params);
            if(promise && promise.then){
                var self = this;
                promise.then(function(httpResponse){
                   // console.log(httpResponse, params);
                    self.getAnnualCostUS.annualCost = httpResponse._links.self.premium;
                    self.getIdentifierUS.identifier = httpResponse._links.self.quoteNumber;
                    $rootScope.$broadcast('custom');
                });
            }
        },
        getAnnualCostUS:function getAnnualCostUS(){
            return getAnnualCostUS.annualCost;
                },
        getIdentifierUS:function getIdentifierUS(){
            return getIdentifierUS.identifier;
                }, 
        saveProperty:function saveProperty(params){
            saveProperty.propertiesForCreate = saveProperty.propertiesForCreate || {};
            saveProperty.propertiesForCreate[params.id[0]] = params.property;
                }
    };
});
