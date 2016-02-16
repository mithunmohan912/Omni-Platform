this.LoginPage = $page("Login page", {
  userid: "id: inputUsername", // css locator
  password: "id: inputPassword",
  signinButton: "id: submit",

  load: function () {
    this.open("http://localhost:8080/app-clientmanagement/#/");
    return this.waitForIt();
  },
  loginAs: function (userName, password) {
    this.userid.typeText(userName);
    this.password.typeText(password);
    this.signinButton.click();
  }
});
// now you can use it like this

var loginPage = new LoginPage(driver).load();
GalenPages.sleep(2000);
loginPage.loginAs("kkdrensk", "kkdrensk");
//loginPage.waitForIt(1000000);
