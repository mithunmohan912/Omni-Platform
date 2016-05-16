this.LandingPage = $page("Landing page", {
  loginButton: "id: login",


  load: function () {
    this.open("http://localhost:8080/app-miniquote/#/");
    return this.waitForIt();
  },


 
  clickLoginButton: function () {
    this.loginButton.click();
  }
});
// now you can use it like this

var LandingPage = new LandingPage(driver).load();
LandingPage.clickLoginButton();




