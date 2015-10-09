'use strict';
/*
global importClass,GalenPages,org
*/
/* exported LoginPage */

importClass(org.openqa.selenium.interactions.Actions);

var LoginPage = function (driver) {
    GalenPages.extendPage(this, driver, {
        container: 'div.container-fluid' ,
        inputUserName: 'id: inputUsername',
        passwordinput: 'id: passwordinput',
        signInButton: 'button.oc-btn'
    },{
    	errorMessage : 'id: messageID',

    	loginAs: function (user) {

            var thisPage = this;
            
            logged('Login as '  + user.username + 'with password ' + user.password, function () {
                thisPage.inputUserName.typeText(user.username);
                thisPage.passwordinput.typeText(user.password);
                thisPage.signInButton.click();
            });
        }
    });
};