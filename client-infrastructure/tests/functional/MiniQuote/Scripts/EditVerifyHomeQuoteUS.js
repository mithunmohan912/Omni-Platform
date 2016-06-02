//EditVerifyHomeQuoteUS


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

describe('EditVerifyHomeQuoteUS', function() {

  var application = new Application();
  var wait= application.wait;
  var perfWritter = new CSV_Processor();

  beforeAll(function(){
    application.initTestData('./../DataRepo/HomeOwnerUS.csv','EditVerifyHomeQuoteUS');
    perfWritter.initialize('./../Perf/US/EditVerifyHomeQuoteUS.csv','');
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

  it('Enter Search Details', function() {
    currentSpec = "Entering search Details";
    criteria = ['quoteNumber', 'symbol'];
    param = application.getParam(criteria);
    application.commonSearch_US(param);
  });

  it('Verify the search result', function() {
    currentSpec = "Verifying search result";
    criteria = ['quoteNumber'];
    param = application.getParam(criteria);
    application.verifySearchCriteria_US(param);
  });

  it('Click on Edit button', function() {
    currentSpec = "Clicking on Edit Button";
    application.clickEditButton_US();
  });

  it('Editing General Info Details', function() {
    currentSpec = "Editing general info";
    application.EditVerifyDetails_HomeQuote_GeneralInfo_US('edit');
  });

  it('Editing Coverage details', function() {
    currentSpec = "Coverage Info Details Editing";
    application.EditVerifyDetails_HomeQuote_CoverageInfo_US('edit');
  });

  it('Click on Auto Quote Asia button', function() {
    currentSpec = "Click on Asia button from Quote link";
    application.navigateLink();
  });

   it('Enter Search Details', function() {
    currentSpec = "Entering search Details";
    criteria = ['quoteNumber', 'symbol'];
    param = application.getParam(criteria);
    application.commonSearch_US(param);
  });

  it('Click on Edit button', function() {
    currentSpec = "Clicking on Edit Button";
    application.clickEditButton_US();
  });

  it('Verifying Edit Quote Details', function() {
    currentSpec = "Verifying Edit Quote";
    application.EditVerifyDetails_HomeQuote_GeneralInfo_US('verify');
  });

  it('Verifying Risk tab details', function() {
    currentSpec = "Risk Info Details Verification";
    application.EditVerifyDetails_HomeQuote_CoverageInfo_US('verify');
  });

  it('Clicking Logout', function() {
    currentSpec = "Clicking on Logout Link";
    application.clickLogout();
  });

});
