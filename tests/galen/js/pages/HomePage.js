'use strict';
/*
global importClass,GalenPages,org
*/
/* exported HomePage */

importClass(org.openqa.selenium.interactions.Actions);

var HomePage = function (driver) {
    GalenPages.extendPage(this, driver, {
        header: 'div.container' ,
        //logo: 'div.oc-logo',
		footer: 'div.container',
    });
};