//TS001- SearchVerifyAsiaQuote


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

describe('SearchVerifyAsiaQuote', function() {

  var application = new Application();
  var wait= application.wait;
  var perfWritter = new CSV_Processor();

  beforeAll(function(){
    application.initTestData('DataRepo/AutoQuoteAsia.csv','SearchVerifyAsiaQuote');
    perfWritter.initialize('Perf/Asia/SearchVerifyAsiaQuote.csv','');
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
    currentSpec = "Entering quote number";
    application.searchByQuoteId();
  });

  it('Verify the search result', function() {
    currentSpec = "Verifying search result";
    criteria = ['quoteNumber'];
    param = application.getParam(criteria);
    application.verifySearchCriteria(param);
  });

  it('Click on Edit button', function() {
    currentSpec = "Clicking on Edit Button";
    application.clickEditButton();
  });

  it('Verifying Edit Quote Details', function() {
    currentSpec = "Verifying Edit Quote";
    application.verifySavedQuoteDetails_OwnerInfo();
  });

  it('Next Button to Risk', function() {
    currentSpec = "Click on Next Button";
    element.all(by.id('next1')).get(0).click();
    //application.clickNextButton();
  });

  it('Verifying Risk tab details', function() {
    currentSpec = "Risk Info Details Verification";
    application.verifySavedQuoteDetails_RiskInfo();
  });

  it('Clicking on Next to Additional Info', function() {
    currentSpec = "Click Next Button";
    element.all(by.id('next1')).get(2).click();
    //application.clickNextButton();
  });

  it('Verifying Additional Info Details', function() {
    currentSpec = "Verify Additional Info";
    application.verifySavedQuoteDetails_AdditionalInfo();
  });

  it('Click Calculate Premium Button', function() {
    currentSpec = "Click Calculate Button";
    application.clickCalculatePremiumButton();
  });

  it('Verifying Premium Info Details', function() {
    currentSpec = "Verify Premium Info";
    application.verifySavedQuoteDetails_PremiumInfo();
  });

  it('Clicking Logout', function() {
    currentSpec = "Clicking on Logout Link";
    application.clickLogout();
  });

});
