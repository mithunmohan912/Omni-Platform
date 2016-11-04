'use strict';

/*global app*/

app.factory('gopaperlessFactory', function($rootScope, quotessearchFactory,resourceFactory){
    return {
        actionHandling: function(params){
            var scope = params.scope;
            var resourceUrl = scope.resourceUrlToRender;
            params.optionUrl = resourceUrl;
            for(var key in params.defaultValues){
                if(!params.properties[key]){
                    params.defaultValues[key].metainfo = {};
                    params.properties[key]= params.defaultValues[key];
                }
            } 
            params.inputComponent.msgForPatch='success';
            this.paperlessActionhandling(params, function(){
            resourceFactory.refresh(resourceUrl,params,$rootScope.headers); 
            });
            
        },
        paperlessActionhandling: function(params, callback){
            quotessearchFactory.actionHandling(params);
            callback();
        }
    };
});