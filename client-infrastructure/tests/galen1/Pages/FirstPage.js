this.LandingPage = $page("Landing page", {
  loginButton: "xpath: /html/body/div[5]/div/div/ng-include/form/div/div[2]/div[2]/div/div[4]/div/ng-switch/div/div/div/div/div[2]/div/div[2]/div/ng-switch[2]/div/div[5]/ng-switch[2]/div/button",
 
  clickLoginButton: function () {
    this.loginButton.click();
  }
});
// now you can use it like this

var LandingPage = new LandingPage(driver);
LandingPage.clickLoginButton();




