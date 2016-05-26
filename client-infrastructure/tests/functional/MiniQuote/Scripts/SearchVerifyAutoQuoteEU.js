//TS001- SearchVerifyAutoQuoteEU


var Application = require('./../Utility/EU_Functions.js');
var CSV_Processor = require('./../Utility/CSV_Processor.js');

// Global Variables Start
var time1;
var time2;
var timeTillRun = 0 ;
var currentSpec = "" ;
var param;
var criteria;

// For Writing File 

var perfMetric;
var headers;
// Global Variables End 

describe('SearchVerifyAutoQuoteEU', function() {

  var application = new Application();
  var wait= application.wait;
  var perfWritter = new CSV_Processor();

  beforeAll(function(){
    application.initTestData('./../DataRepo/AutoQuoteEU.csv','SearchVerifyAutoQuoteEU');
    perfWritter.initialize('./../Perf/EU/SearchVerifyAutoQuoteEU.csv','');
      perfWritter.readDatafromFile(function(data){      
      perfMetric = data ;    
     });
    perfWritter.getHeaderArray(function(data){      
      headers = data ;
    });
  });

  beforeEach(function() { 
    time1 = (new Date()).getTime() ;
  });

  beforeEach(function() {  
    time1 = (new Date()).getTime() ;
  });

  afterEach(function() {
    time2 = (new Date()).getTime() ;
    var captureTime =  (time2 - time1)/1000;   
    var param = {};
    param.currentSpec = currentSpec;
    param.captureTime = captureTime;
    console.log("Current Spec "+currentSpec+" Capture Time "+captureTime);
    param.headers = headers;
    param.perfMetric = perfMetric;
    perfMetric = perfWritter.buildPerfMetrics(param);
  });
  
  afterAll(function() {
    perfWritter.writeData(perfMetric);
  }); 



  it("EU Auto #should Launch URL",function(){
    currentSpec = "should Launch URL";   
    application.launchURL();
  });

  it('EU Auto #click login button', function() {
    currentSpec = "should click on the login button";
    application.clickLoginButton();
  });

  it('Enter the login details', function(){   
    currentSpec = "Enter the login details";
    application.loginPage();
  });

  it('Verify dashboard page', function() {
    currentSpec = "Verify dashboard page";
    application.verifyDashboard();
  });

  it('Click on Auto Quote Asia button', function() {
    currentSpec = "Click on Asia button from Quote link";
    application.navigateLink();
  });

  it('Enter Search Details', function() {
    currentSpec = "Entering search Details";
    //criteria = ['quoteNumber', 'product']; 
    criteria = ['quoteNumber'];
    param = application.getParam(criteria);
    application.commonSearch_EU(param);
  });

  it('Verify the search result', function() {
    currentSpec = "Verifying search result";
    criteria = ['quoteNumber', 'lastName', 'description', 'productID'];
    param = application.getParam(criteria);
    application.verifySearchCriteria_AutoQuote_EU(param);
  });

  it('Click on Edit button', function() {
    currentSpec = "Clicking on Edit Button";
    application.clickEditButton_EU();
  });

  it('Verifying Quote Info EU-Quote details', function() {
    currentSpec = "Verifying quote info";
    application.editVerifySavedQuoteDetails_QuoteInfo_EU_Auto('verify');
  });

  it('Verifying Owner Info EU-Quote Details', function() {
    currentSpec = "Verifying Edit Quote";
    application.editVerifySavedQuoteDetails_OwnerInfo_EU_Auto("verify");
  });

  it('Verifying Risk Info EU-Quote details', function() {
    currentSpec = "Risk Info Details Verification";
    application.editVerifySavedQuoteDetails_RiskInfo_EU_Auto("verify");
  });

  it('Click Calculate Premium Button', function() {
    currentSpec = "Click Calculate Button";
    application.clickCalculatePremiumButton();
  });

  it('Verifying Premium Info Details', function() {
    currentSpec = "Verify Premium Info";
    application.verifySavedQuoteDetails_PremiumInfo_EU_Auto();
    browser.waitForAngular();
  });

  it('Clicking Logout', function() {
    currentSpec = "Clicking on Logout Link";
    application.clickLogout();
  });

});
