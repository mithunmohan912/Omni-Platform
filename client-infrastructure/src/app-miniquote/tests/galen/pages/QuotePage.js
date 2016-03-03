var url = arg.url;

this.QuotePage = $page("Quote page", {
    logo: "div.oc-logo",//logo
  
  load: function () {
    this.open(url+"screen/quote");
    return this.waitForIt();
  //clickRecMgmnt: function () {
//    this.RecMgmnt.click();
      
//  },
//    clickParties: function () {
//    this.Parties.click();
  }
});
// now you can use it like this

var QuotePage = new QuotePage(driver).load();
GalenPages.sleep(2000);
//LandingPage.clickRecMgmnt();
//LandingPage.clickParties();