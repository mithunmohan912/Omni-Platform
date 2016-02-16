this.PartiesPage = $page("Parties page", {
    username: "id: parties.firstName",
  
  load: function () {
    this.open("http://localhost:8080/app-clientmanagement/#/screen/partiessearch");
    return this.waitForIt();
  //},
  //clickRecMgmnt: function () {
//    this.RecMgmnt.click();
      
//  },
//    clickParties: function () {
//    this.Parties.click();
  }
});
// now you can use it like this

var PartiesPage = new PartiesPage(driver).load();
GalenPages.sleep(2000);
//LandingPage.clickRecMgmnt();
//LandingPage.clickParties();