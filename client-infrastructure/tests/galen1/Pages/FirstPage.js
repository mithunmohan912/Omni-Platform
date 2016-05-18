this.LandingPage = $page("Landing page", {
  loginButton: "id: login",
 
  clickLoginButton: function () {
    this.loginButton.click();
  }
});
// now you can use it like this

var LandingPage = new LandingPage(driver);
LandingPage.clickLoginButton();




