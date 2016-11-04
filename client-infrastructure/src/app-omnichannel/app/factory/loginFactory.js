'use strict';

/*global app*/

app.factory('loginFactory', function($rootScope, $filter, $http, anonymousFactory, growl){
    var msg;
    var authnChain = {
        authn: function(params){
            if(msg !== undefined)
            {
                msg.destroy();
            }
            $rootScope.isAuthSuccess = false;
            var authnURL = $rootScope.config.authnURL + '/authenticate';

            var authnModule = anonymousFactory.getAuthnModule();
            var authnService = anonymousFactory.getAuthnService();
            if (authnService !== undefined) {
                authnURL = authnURL + '?authIndexType=service&authIndexValue=' + authnService;
            }

            if (params.scope !== undefined) {
                if (params.scope.resourcesToBind.properties.inputUsername !== undefined && params.scope.resourcesToBind.properties.inputUsername.value !== undefined) {
                    $rootScope.authnUsername = params.scope.resourcesToBind.properties.inputUsername.value;
                }
                if (params.scope.resourcesToBind.properties.inputPassword !== undefined && params.scope.resourcesToBind.properties.inputPassword.value !== undefined) {
                    $rootScope.authnPassword = params.scope.resourcesToBind.properties.inputPassword.value;
                }
            }

            var authnCallbackData = {};
            if ($rootScope.authnCallbackData !== undefined) {
                authnCallbackData = $rootScope.authnCallbackData;
                console.log('authnCallbackData.authId : '+authnCallbackData.authId);
                var i;
                if (authnCallbackData.stage === 'LDAP1' || authnCallbackData.stage === 'DataStore1') {
                    // AuthN
                    for (i=0; i<authnCallbackData.callbacks.length; i++) {
                        if (authnCallbackData.callbacks[i].type === 'NameCallback' && authnCallbackData.callbacks[i].input[0].name === 'IDToken1') {
                            authnCallbackData.callbacks[i].input[0].value = params.scope.resourcesToBind.properties.inputUsername.value;
                            continue;
                        }
                        if (authnCallbackData.callbacks[i].type === 'PasswordCallback' && authnCallbackData.callbacks[i].input[0].name === 'IDToken2') {
                            authnCallbackData.callbacks[i].input[0].value = params.scope.resourcesToBind.properties.inputPassword.value;
                            continue;
                        }
                    }
                } else if (authnCallbackData.stage === 'HOTP2') {
                    // MFA - HOTP
                    if (params.scope.resourcesToBind.properties.inputOtpCode === undefined) {
                        // request OTP
                        for (i=0; i<authnCallbackData.callbacks.length; i++) {
                            if (authnCallbackData.callbacks[i].type === 'ConfirmationCallback' &&
                                authnCallbackData.callbacks[i].input[0].name === 'IDToken2') {
                                authnCallbackData.callbacks[i].input[0].value = 1;
                                break;
                            }
                        }
                    }
                    else {
                        // submit OTP
                        for (i=0; i<authnCallbackData.callbacks.length; i++) {
                            if (authnCallbackData.callbacks[i].type === 'PasswordCallback' &&
                                authnCallbackData.callbacks[i].input[0].name === 'IDToken1') {
                                authnCallbackData.callbacks[i].input[0].value = params.scope.resourcesToBind.properties.inputOtpCode.value;
                                continue;
                            }
                            if (authnCallbackData.callbacks[i].type === 'ConfirmationCallback' &&
                                authnCallbackData.callbacks[i].input[0].name === 'IDToken2') {
                                authnCallbackData.callbacks[i].input[0].value = 0;
                                continue;
                            }
                        }
                    }
                } else if (authnCallbackData.stage === 'OATH1') {
                    // MFA - OATH
                    // submit OTP
                    for (i=0; i<authnCallbackData.callbacks.length; i++) {
                        if (authnCallbackData.callbacks[i].type === 'PasswordCallback' &&
                            authnCallbackData.callbacks[i].input[0].name === 'IDToken1') {
                            authnCallbackData.callbacks[i].input[0].value = params.scope.resourcesToBind.properties.inputOtpCode.value;
                            break;
                        }
                    }
                }
            }
            else if (authnModule !== undefined) {
                authnURL = authnURL + '?authIndexType=module&authIndexValue=' + authnModule;
            }


            // authenticate user
            $http({
                method : 'POST',
                headers : {
                    'X-IBM-Client-ID' : $rootScope.config.apiGatewayApiKeys.client_id,
                    'X-IBM-Client-Secret' : $rootScope.config.apiGatewayApiKeys.client_secret,
                    'Content-Type' : 'application/json'
                },
                data : authnCallbackData,
                url : authnURL,
            }).success(function(data) {
                if (data.authId !== undefined) {
                    console.log('Authenticate callback');
                    //console.log('authId : '+data.authId);
                    $rootScope.authnCallbackData = data;
                    var i;
                    if (data.stage === 'LDAP1' || data.stage === 'DataStore1') {
                        // AuthN
                        authnChain.authn(params);
                    }
                    else if (data.stage === 'HOTP2') {
                        // MFA - HOTP
                        for (i=0; i<data.callbacks.length; i++) {
                            if (data.callbacks[i].type === 'ConfirmationCallback' &&
                                data.callbacks[i].input[0].name === 'IDToken2') {
                                if (data.callbacks[i].input[0].value === 0) {
                                    // auto request OTP
                                    authnChain.authn(params);
                                }
                                else {
                                    // submit OTP
                                    params.inputComponent.actionURL = '/screen/otp';
                                    anonymousFactory.navigateToLogin(params);
                                }
                                break;
                            }
                        }
                    }
                    else if (data.stage === 'OATH1') {
                        // MFA - OATH
                        params.inputComponent.actionURL = '/screen/otp';
                        anonymousFactory.navigateToLogin(params);
                    }
                } else if (data.tokenId !== undefined) {
                    console.log('Authenticate successful');
                    //console.log('tokenId : '+data.tokenId);
                    sessionStorage.tokenId = data.tokenId;
                    sessionStorage.username = $rootScope.authnUsername;
                    $rootScope.isAuthSuccess = true;

                    // OAuth2 token service
                    // OAuth2 password flow
                    $http({
                        method : 'POST',
                        withCredentials : true,
                        headers : {
                            'X-IBM-Client-ID' : $rootScope.config.apiGatewayApiKeys.client_id,
                            'X-IBM-Client-Secret' : $rootScope.config.apiGatewayApiKeys.client_secret,
                            'Authorization' : 'Basic b2NkZXY6QzdENTZCODVFRjE1OTg3',
                            'Content-Type' : 'application/x-www-form-urlencoded'
                        },
                        data : 'grant_type=password&username='+$rootScope.authnUsername+'&password='+$rootScope.authnPassword,
                        url : $rootScope.config.oauth2URL + '/access_token'
                    }).success(function(data) {
                        console.log('OAuth2 token service successful');
                        //console.log('OAuth2 access_token : '+data.access_token);
                        //console.log('OIDC id_token : '+data.id_token);
                        sessionStorage.access_token = data.access_token;
                        sessionStorage.id_token = data.id_token;

                        // OAuth2 userinfo service
                        // default OIDC profile
                        $http({
                            method : 'POST',
                            withCredentials : true,
                            headers : {
                                'X-IBM-Client-ID' : $rootScope.config.apiGatewayApiKeys.client_id,
                                'X-IBM-Client-Secret' : $rootScope.config.apiGatewayApiKeys.client_secret,
                                'Authorization' : 'Bearer '+sessionStorage.access_token
                            },
                            url : $rootScope.config.oauth2URL + '/userinfo'
                        }).success(function(data) {
                            console.log('OAuth2 userinfo service successful');
                            console.log('OIDC profile name : '+data.name);
                        });
         
                        // OAuth2 tokeninfo service
                        // validate OAuth2 token
                        $http({
                            method : 'GET',
                            headers : {
                                'X-IBM-Client-ID' : $rootScope.config.apiGatewayApiKeys.client_id,
                                'X-IBM-Client-Secret' : $rootScope.config.apiGatewayApiKeys.client_secret
                            },
                            url : $rootScope.config.oauth2URL + '/tokeninfo?access_token='+sessionStorage.access_token
                        }).success(function(data) {
                            console.log('OAuth2 tokeninfo service successful');
                            console.log('OAuth2 tokeninfo expires_in : '+data.expires_in);
                        });         
                    });

                    // authorize
                    $http({
                    url: 'assets/resources/config/users.json',
                    method: 'GET'
                     }).success(function(data) {
                    //extract user
                        var user = [];
                        angular.forEach(data.users, function(key) {
                        if (key.name === params.scope.resourcesToBind.properties.inputUsername.value ) {
                            user = key;
                        }});
                        
                         $rootScope.user = user; 
                      }).error(function(data) {
                        $rootScope.showIcon = false;
                        if (data && data.exception) {
                            growl.error(data.exception.message, '30');
                        } else {
                            growl.error($filter('translate')('GENERAL_ERROR'));
                        }
                    });

                    $rootScope.authnUsername = undefined;
                    $rootScope.authnPassword = undefined;
                    $rootScope.authnCallbackData = undefined;
                    $rootScope.nextURL = params.inputComponent.actionURL;
                    $rootScope.navigate(params.inputComponent.actionURL);
                }
            }).error(function(data) {
                $rootScope.authnCallbackData = undefined;
                $rootScope.showIcon = false;
                if (data && data.exception) {
                    growl.error(data.exception.message, '30');
                } else {
                   msg= growl.error($filter('translate')('INVALID_CREDENTIALS'));
                }
            });
        }
    };
    this.navigateToScreen = function(params) {
        authnChain.authn(params);
    };
    return this;
});

app.factory('otpFactory', function($rootScope, loginFactory){
    return {
        navigateToScreen: function(params){
            loginFactory.navigateToScreen(params);
        }
    };
});