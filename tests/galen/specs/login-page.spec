@@ import logo.spec


==================================================
userid              id       inputUsername
userid-label         xpath   //*[@id="LoginForm"]/div/div/div/div[2]/div[1]/label
password            id       passwordinput
password-label       xpath   //*[@id="LoginForm"]/div/div/div/div[2]/div[2]/label
login-button        xpath    //*[@id="LoginForm"]/div/div/div/div[2]/div[3]/div/button/strong 
container           css      div.container-fluid
==================================================

@ all,desktop,mobile,tablet
------------------------------------

userid
    inside partly: container
    color scheme: 80 to 90% #FFFE9F

 
password
    inside partly: container
    color scheme: 80 to 90% #FFFE9F

login-button
    inside partly: container
    text uppercase is: SIGN IN