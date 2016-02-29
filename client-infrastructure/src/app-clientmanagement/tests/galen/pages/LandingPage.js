var device = arg.screenSize;

this.LandingPage = $page("Landing page", {
  logo: "div.oc-logo", // Resource Management
  
  load: function () {
    this.open("http://localhost:8080/app-clientmanagement/#/dashboard");
    return this.waitForIt();
  },
  clickButton: function () {
	 //this.menubutton.click();
	driver.findElement(By.cssSelector("button.navbar-toggle")).click();
  },
  clickRecMgmnt: function () {
    //this.RecMgmnt.click();
	driver.findElement(By.id("_RESOURCE_MANAGEMENT")).click();
      
  },
    clickParties: function () {
    //this.Parties.click();
	driver.findElement(By.cssSelector("a.ng-binding")).click();
  }
});

var LandingPage = new LandingPage(driver).load();
GalenPages.sleep(2000);
if(device =="mobile" || device =="tablet"){
	LandingPage.clickButton();
}
GalenPages.sleep(2000);
LandingPage.clickRecMgmnt();
LandingPage.clickParties();