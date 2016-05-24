this.LoginPage = $page("Login page", {
  userid: "id: inputUsername", // css locator
  password: "xpath: /html/body/div[5]/div/div/ng-include/form/div/div[2]/div[2]/div/div[4]/div/ng-switch/div/div/div/div/div[2]/div/div[2]/div/ng-switch[2]/div/div[2]/ng-switch[2]/div/input",
  signinButton: "id: submit",
                        
  
  loginAs: function (userName, password) {
    this.userid.typeText(userName);
    this.password.typeText(password);
    this.signinButton.click();
  }
});


var loginPage = new LoginPage(driver);
loginPage.loginAs("kkdrensk", "kkdrensk");