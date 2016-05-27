//CreateHomeQuoteUS


var Application = require('./../Utility/miniFunctions.js');
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

describe('CreateHomeQuoteUS', function() {

  var application = new Application();
  var wait= application.wait;
  var perfWritter = new CSV_Processor();

  beforeAll(function(){
    application.initTestData('./../DataRepo/HomeOwnerUS.csv','CreateHomeQuoteUS');
    perfWritter.initialize('./../Perf/US/CreateHomeQuoteUS.csv','');
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



  it("should Launch URL",function(){
    currentSpec = "should Launch URL";   
    application.launchURL();
  });

  it('click login button', function() {
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

  it('Fill Applicant Info Details', function() {
    currentSpec = "Fill Home Owner Applicant info details";
    application.fillNewQuoteDetails_HomeInfo_US();
  });

  it('Fill Policy Info Details', function() {
    currentSpec = "Fill policy info details";
    application.fillNewQuoteDetails_PolicyInfo_US();
  });

  it('Fill General Info Details', function() {
    currentSpec = "Fill General info details";
    application.fillNewQuoteDetails_GeneralInfo_US();
  });

  it('Fill Coverage Info Details', function() {
    currentSpec = "Fill Coverage info details";
    application.fillNewQuoteDetails_CoverageInfo_US();
  });

  it('Click on CalculatePremium Button', function() {
    currentSpec = "Clicking on calcute premium button";
    application.clickCalculatePremiumButton_HomeUS();
  });

  it('Click on Premium Tab', function() {
    currentSpec = "Clicking on Premium Tab";
    application.clickOnPremiumTab_HomeUS();
  });

  it('Capture QuoteNumber', function() {
    currentSpec = "Capturing Quote Number";
    browser.waitForAngular();
    application.getNewQuoteNumber_HomeOwnerUS();
  });

  it('Click on Auto Quote Asia button', function() {
    currentSpec = "Click on Asia button from Quote link";
    application.navigateLink();
  });

  it('Enter Search Details', function() {
    currentSpec = "Entering search Details";
    application.searchByQuoteId_HomeOwnerUS();    
  });

  it('Verify Created Home Quote', function() {
    currentSpec = "Verifying search criteria";
    application.verifySearchCriteria_US();
  });

  it('Clicking Logout', function() {
    currentSpec = "Clicking on Logout Link";
    application.clickLogout();
  });

});

