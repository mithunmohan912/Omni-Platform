'use strict';


/*
exported  showMessage,validateLogin
*/

function showMessage(message) {
    $('#messageID').html(message);
    $('#popupdiv').modal('show');
}



function validateLogin(FormID) {

    $('#' + FormID).validate({
        focusInvalid: false,
        onkeyup: false,
        onclick: false,
        focusCleanup: false,
        onfocusout: false,
        onfocus: false,
        onsubmit: false,

        rules: {
            inputUsername: {
                required: true
            },
            inputPassword: {
                required: true
            }
        },
        messages: {
            inputUsername: 'Username and Password are required.',
            inputPassword: 'Username and Password are required.'
        },

        errorPlacement: function(error, element) {
            $('#' + element.attr('id')).addClass('highlight');
            //showMessage(error.text());
        }
    });

}

