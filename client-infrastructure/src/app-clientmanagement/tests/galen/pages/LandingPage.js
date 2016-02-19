this.LandingPage = $page("Landing page", {
  RecMgmnt: "id: _RESOURCE_MANAGEMENT", // Resource Management
  Parties: "a.ng-binding",
  
  load: function () {
    this.open("http://localhost:8080/app-clientmanagement/#/dashboard");
    return this.waitForIt();
  },
  clickRecMgmnt: function () {
    this.RecMgmnt.click();
      
  },
    clickParties: function () {
    this.Parties.click();
  }
});
// now you can use it like this

var LandingPage = new LandingPage(driver).load();
GalenPages.sleep(2000);
LandingPage.clickRecMgmnt();
LandingPage.clickParties();