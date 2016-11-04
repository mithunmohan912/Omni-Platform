'use strict';

/*global app*/

app.factory('makepaymentFactory', function($rootScope, quotessearchFactory){
     return {
        actionHandling: function(params){
            quotessearchFactory.actionHandling(params);
        },
        makepaymentRadio:function(){
            return[
                'Bank Account',
                'Credit Card'
            ];
        }
    };
});