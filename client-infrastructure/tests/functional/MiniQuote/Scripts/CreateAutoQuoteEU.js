//TS001- CreateAutoQuoteEU


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

describe('CreateAutoQuoteEU', function() {

  var application = new Application();
  var wait= application.wait;
  var perfWritter = new CSV_Processor();

  beforeAll(function(){
    application.initTestData('DataRepo/AutoQuoteEU.csv','CreateVerifyAutoQuote_EU');
    perfWritter.initialize('Perf/EU/CreateVerifyAutoQuote_EU.csv','');
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
  it('Click on Create Button', function() {
    currentSpec = "Click on Create Button";
    application.clickCreateQuoteButton();
  });

  it('Fill Additional Info Details', function() {
    currentSpec = "Fill Additional info details";
    application.fillNewQuoteDetails_QuoteInfo_EU();
  });

  it('Fill Owner Info Details', function() {
    currentSpec = "Fill owner info details";
    application.fillNewQuoteDetails_OwnerInfo_EU();
  });

  it('Fill Risk Info Details', function() {
    currentSpec = "Fill Risk info details";
    application.fillNewQuoteDetails_RiskInfo_EU();
  });

  it('Click Calculate Premium Button', function() {
    currentSpec = "Click Calculate Button";
    application.clickCalculatePremiumButton();
    browser.waitForAngular();
  });

  it('Capture QuoteNumber', function() {
    currentSpec = "Capturing Quote Number";
    browser.waitForAngular();
    application.getNewQuoteNumber_Auto_EU();
  });

  it('Click on Auto Quote Asia button', function() {
    currentSpec = "Click on Asia button from Quote link";
    browser.waitForAngular();
    application.navigateLink();
  });

  it('Enter Search Details', function() {
    currentSpec = "Entering quote number";
    application.searchByQuoteId();
  });

  it('Verify the search result', function() {
    currentSpec = "Verifying search result";
    criteria = ['quoteNumber'];
    param = application.getParam(criteria);
    application.verifySearchCriteria_AutoQuote_EU(param);
  });

  it('Clicking Logout', function() {
    currentSpec = "Clicking on Logout Link";
    application.clickLogout();
  });

});
