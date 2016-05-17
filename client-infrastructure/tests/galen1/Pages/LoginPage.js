this.LoginPage = $page("Login page", {
  userid: "id: inputUsername", // css locator
  password: "id: inputPassword",
  signinButton: "id: submit",
                        
  
  loginAs: function (userName, password) {
    this.userid.typeText(userName);
    this.password.typeText(password);
    this.signinButton.click();
  }
});


var loginPage = new LoginPage(driver);
loginPage.loginAs("kkdrensk", "kkdrensk");