//SearchHomeQuoteUS


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

describe('SearchHomeQuoteUS', function() {

  var application = new Application();
  var wait= application.wait;
  var perfWritter = new CSV_Processor();

  beforeAll(function(){
    application.initTestData('DataRepo/HomeOwnerUS.csv','SearchHomeQuoteUS');
    perfWritter.initialize('Perf/US/SearchHomeQuoteUS.csv','');
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

  it('Click on Inquire button', function() {
    currentSpec = "Clicking on Inquire Button";
    application.ClickInquireButton();
  });

  it('Verify Policy Tab Details', function() {
    currentSpec = "Verifying Policy Tab details";
    application.verifyPolicyTabDetails_US();
  });

  it('Clicking on Location Tab', function(){
    currentSpec = "Clicking on Location tab";
    application.clickLocationTab_US();
  });

  it('Verifying Location Tab Details', function() {
    currentSpec = "Verifying Location Tab details";
    application.verifyLocationTabDetails_US();
  });

  it('Clicking on Coverage Tab', function(){
    currentSpec = "Clicking on Coverage tab";
    application.clickCoverageTab_US();
  });

  it('Verifying Coverage Tab Details', function() {
    currentSpec = "Verifying Coverage Tab details";
    application.verifyCoverageTabDetails_US();
  });

  it('Clicking Logout', function() {
    currentSpec = "Clicking on Logout Link";
    application.clickLogout();
  });

});
