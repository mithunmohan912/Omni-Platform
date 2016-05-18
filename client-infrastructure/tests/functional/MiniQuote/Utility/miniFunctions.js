'use strict';
var CSV_Processor = require("./CSV_Processor");

var Application = function() {
  var app = this;
  var isPHFNAvail= false;
  var wait= 50000;
  var fileData;
  var csvProcessor = new CSV_Processor();
  var quoteNumber;
  var contractNumber;
  
  browser.ignoreSynchronization = true;

  app.initTestData = function(file,testCaseName){
    csvProcessor.initialize(file,testCaseName);
    csvProcessor.readDatafromFile(function(data){
      csvProcessor.initData(data);
    });
  }
  
  app.showData = function(){
    csvProcessor.showData();
  }

  app.launchURL = function() {
    //browser.driver.get('http://localhost:8080/app-miniquote/#/');
    browser.driver.get('http://ec2-52-19-140-230.eu-west-1.compute.amazonaws.com/omnichannel/dev/app-miniquote/#/');
  };
   
  app.clickLoginButton = function () {

    browser.ignoreSynchronization = false;
    browser.driver.manage().window().maximize(); 
    var loginbtn = element.all(by.buttonText("Login")).get(0);
   
    browser.wait(protractor.ExpectedConditions.elementToBeClickable(loginbtn), wait)
      .then(function () {
        loginbtn.click();
      });
    
  };

  app.loginPage = function() {
      
    browser.ignoreSynchronization = false;
    browser.waitForAngular();
    var userName = csvProcessor.filterData('UserName');
    var password = csvProcessor.filterData('Password');

    element.all(by.id('inputUsername')).get(0).sendKeys(userName);
    element.all(by.id('inputPassword')).get(0).sendKeys(password);

    element.all(by.id('submit')).get(0).click();
  };

  app.verifyDashboard = function() {

    var imgElement = element(by.xpath('//*[@id="dashboard"]/div/div[2]/div[2]/div/div[3]/div/a/div/span'));
    imgElement.getAttribute('class').then(function(className){
     expect(className).toContain('flaticon-auto');
    });

    var imageElement = element(by.xpath('//*[@id="dashboard"]/div/div[5]/div[2]/div/div[3]/div/a/div/span'));
    imageElement.getAttribute('class').then(function(className){
     expect(className).toContain('flaticon-home');
    });
  }

  app.navigateLink = function() {

    browser.waitForAngular();
    var clickLink = csvProcessor.filterData('navigateLink');

    element(by.xpath('//*[@id="mainMenu"]/li[2]/a')).click();
    if(clickLink === "AutoQuoteAsia") {
      element(by.xpath('//*[@id="mainMenu"]/li[2]/ul/li[1]')).click();
    }
  };

  app.inputText= function(elementID, elementText){
    elementID.click();
    var i = elementText.split("");
    for(var j = 0;j<i.length;j++){
      elementID.sendKeys(i[j]);
    };
  };

  app.getParam = function(criteria){
    var param = {};
    criteria.forEach(function(item){
      var value = csvProcessor.filterData(item);
      param[item]= value;
    });
    return param;
  }; 

  app.searchByQuoteId= function(){

    var quoteId = element.all(by.id('quote-identifier')).get(0);
    var quoteNumber = csvProcessor.filterData('quoteNumber')
    app.inputText(quoteId,quoteNumber);
    //quoteId.sendKeys(quoteNumber);

    element.all(by.id('search')).get(0).click();
  };

  app.commonSearchByParams = function(param) {
    var symbolElement = element.all(by.id('symbol')).get(0);
    var quoteId = element.all(by.id('quote-identifier')).get(0);

    for (var key in param) {
      switch(key){  
        case('quoteNumber') :
          app.inputText(quoteId,param[key]); 
        break;

        case('symbol') :
          app.inputText(symbolElement,param[key]); 
        break;
      }
    }
  }

  app.verifySearchCriteria = function(param) {

    browser.waitForAngular();
    element(by.xpath('//*[@id="no-more-tables"]/table/tfoot/tr/td/div/div/nav/ul/li[3]/a')).getText()
      .then(function(text){
    
          var pageCount = text.split(" ");
          console.log("Page Count  ::  "+pageCount[2]);
          console.log("");
          for(var i=1; i<=pageCount[0];i++){
            element.all(by.repeater('row in displayed | filter:searchText')).then(function(rows) {
              console.log("Number of Rows Found :: "+rows.length);
              console.log("");
              if(rows.length == 0) {
                console.log("No Results Found in the Search List");
              }
              rows.forEach(function(row,index){
                row.all(by.tagName('span')).then(function(spans){
                  // spans.forEach(function(span,index){
                  //   span.getText().then(function(text){
                  //     console.log("SPAN inside "+index+"is equal to text "+text); //rohini
                  //   });
                  // });
                  spans[6].getText().then(function(text){
                    console.log("QUOTE ID:"+text);
                    if(!text) {  //for an empty row existing for every visible row
                      return;
                    }
                  });
                  for(var key in param){
                    switch(key){
                      case('quoteNumber'):
                      spans[6].getText().then(function(text){
                        console.log("Quote Number in quoteID :: "+text);
                        if(text) {
                          expect(param['quoteNumber']).toEqual(text);
                        }
                      })
                      break;

                      case('distributorId'):
                      spans[6].getText().then(function(text){
                        console.log("Distributor ID :: "+text);
                        expect(param['distributorId']).toEqual(text);
                      })
                      break;

                      case('productId'):
                      spans[9].getText().then(function(text){
                        //console.log("Product ID :: "+text);
                        expect(param['productId']).toEqual(text);
                      })
                      break;

                      case('contractDate'):
                      spans[5].getText().then(function(text){
                        //console.log("Contract Date :: "+text);
                        expect(param['contractDate']).toEqual(text);
                      })
                      break;
                    }
                  }
                })
              });
            });
            // element(by.xpath('//*[@id="no-more-tables"]/table/tfoot/tr/td/div/div/nav/ul/li[3]/a/page-select/input')).getAttribute('value')
            // .then(function(value){
            //   if(value<pageCount[1]){
            //     element(by.xpath('//*[@id="no-more-tables"]/table/tfoot/tr/td/div/div/nav/ul/li[4]/a')).click();
            //   }
            // });
          }
      });
  };

  app.clickEditButton = function () {
    //*[@id="no-more-tables"]/table/tbody/tr[4]/td[8]/ng-switch/span/span/a/span
    //*[@id="no-more-tables"]/table/tbody/tr[2]/td[8]/ng-switch/span/span/a/span
    var editBtn = element(by.xpath('//*[@id="no-more-tables"]/table/tbody/tr[2]/td[8]/ng-switch/span/span/a/span'));
    editBtn.click();
    browser.waitForAngular();
  };

  app.verifySavedQuoteDetails_OwnerInfo = function() {
    browser.waitForAngular();

    var partyType = csvProcessor.filterData('partyType');
    element(by.id('quote-party-type')).getAttribute('value').then(function(text){
      expect(text).toEqual(partyType);
    });

    var gender = csvProcessor.filterData('gender');
    element(by.id('quote-gender')).getAttribute('value').then(function(text){
      expect(text).toEqual(gender);
    });

    var fullname = csvProcessor.filterData('fullName');
    element(by.id('quote-full-name')).getAttribute('value').then(function(text){
      expect(text.toLowerCase()).toEqual(fullname);
    });

    var dob = csvProcessor.filterData('dob');
    element(by.id('quote-birth-date')).getAttribute('value').then(function(text){
      expect(text).toEqual(dob);
    });
  };

  app.clickNextButton = function() {
    //element(by.xpath('//*[@id="AddHomeQuote"]/div/div[2]/div/div[2]/div[3]/div/ng-switch/div/div/div/div[2]/div/ng-switch[2]/div/div/button')).click();
    //element.all(by.id('next1')).get(0).click();
    var nextBtn = element(by.id('next1'));
    nextBtn.click();
    browser.waitForAngular();
  }

  app.verifySavedQuoteDetails_RiskInfo = function() {
    
    browser.waitForAngular();
    //var vehicleUse = csvProcessor.filterData('vehicleUse');
    //var makeOfVehicle = csvProcess.filterData('makeOfVehicle');
    // var driverGender = csvProcessor.filterData('driverGender');
    // var permittedDriver = csvProcessor.filterData('permittedDriver');
    // var location = csvProcessor.filterData('location');
    // var quoteCover = csvProcessor.filterData('quoteCover');
    // var regYear = csvProcessor.filterData('regYear');
    // var sumInsured = csvProcessor.filterData('sumInsured');
    // var engineCapacity = csvProcessor.filterData('engineCapacity');
    // var ncdPercentage = csvProcessor.filterData('ncdPercentage');
    // var driverName = csvProcessor.filterData('driverName');

    element(by.id('quote-vehicle-use')).getAttribute('value').then(function(text){
      expect(text).not.toBe(null);
    });

    element(by.id('quote-make-of-vehicle')).getAttribute('value').then(function(text){
      expect(text).not.toBe(null);
    });

    element(by.id('quote-driver-gender')).getAttribute('value').then(function(text){
      expect(text).not.toBe(null);
    });

    element(by.id('quote-permitted-driver')).getAttribute('value').then(function(text){
      expect(text).not.toBe(null);
    });

    element(by.id('quote-geographic-location')).getAttribute('value').then(function(text){
      expect(text).not.toBe(null);
    });
    
    element(by.id('quote-cover')).getAttribute('value').then(function(text){
      expect(text).not.toBe(null);
    });
    
    element(by.id('quote-year-of-registration')).getText().then(function(text){
      expect(text).not.toBe(null);
    });

    element(by.id('quote-engine-capacity')).getText().then(function(text){
      expect(text).not.toBe(null);
    });

    element(by.id('quote-sum-insured')).getText().then(function(text){
      expect(text).not.toBe(null);
    });

    element(by.id('quote-NCD-percentage')).getText().then(function(text){
      expect(text).not.toBe(null);
    });

    element(by.id('quote-driver-name')).getText().then(function(text){
      expect(text).not.toBe(null);
    });
  };

  app.verifySavedQuoteDetails_AdditionalInfo = function() {

    browser.waitForAngular();

    //var premium = csvProcessor.filterData('additionalPremium');
    //var limit = csvProcessor.filterData('additionalLimit');
    //var cover = csvProcessor.filterData('additionalCover');

    element(by.id('quote-additional-premium')).getText().then(function(text){
      expect(text).not.toEqual(null);
    });

    element(by.id('quote-additional-limit')).getText().then(function(text){
      expect(text).not.toBe(null);
    });

    element(by.id('quote-additional-cover')).getAttribute('value').then(function(text){
      expect(text).not.toBe(null);
    });
  }

  app.clickCalculatePremiumButton = function() {
    element.all(by.xpath('//*[@id="submit1"]')).get(0).click();
  }

  app.verifySavedQuoteDetails_PremiumInfo = function() {

    browser.waitForAngular();

    var quoteNumber = csvProcessor.filterData('quoteNumber');
    var quoteCost = csvProcessor.filterData('quoteCost');
    var currency = csvProcessor.filterData('currency');

    var identifier = element(by.xpath('//*[@id="AddHomeQuote"]/div/div[7]/div/div[1]/div[3]/div/ng-switch/div/div/div[1]/div[2]/div/ng-switch[2]/div/span'));
    identifier.getText().then(function(text){
      expect(text).toEqual(quoteNumber);
    });

    var annualCostValue = element(by.xpath('//*[@id="AddHomeQuote"]/div/div[7]/div/div[1]/div[3]/div/ng-switch/div/div/div[2]/div[2]/div/ng-switch[2]/div/span'));
    annualCostValue.getText().then(function(text){
      var cost_currency = text.split(" ");
      expect(cost_currency[0]).toEqual(quoteCost);
      expect(cost_currency[1]).toEqual(currency);
    });
  };

  app.EditDetails_AsiaQuoteOwnerInfo = function() {
    var quoteGenderElement = element.all(by.id('quote-gender')).get(0);
    var fullNameElement = element.all(by.id('quote-full-name')).get(0);
    var dobElement = element.all(by.id('quote-birth-date')).get(0);
    var editGenderValue;

    element(by.id('quote-gender')).getAttribute('value').then(function(text){
      editGenderValue = text;
    });

    if(editGenderValue == 'Male') {
      var gender1 = csvProcessor.filterData('gender1');
      quoteGenderElement.element(by.cssContainingText('option', gender1)).click();

      var fullName1 = csvProcessor.filterData('fullName1');
      fullNameElement.sendKeys(fullName1);

      var dob1 = csvProcessor.filterData('dob1');
      dobElement.click();
      inputText(dobElement, dob1);
    }
    else {
      var gender = csvProcessor.filterData('gender');
      quoteGenderElement.element(by.cssContainingText('option', gender)).click();

      var fullName = csvProcessor.filterData('fullName');
      fullNameElement.sendKeys(fullName);

      var dob = csvProcessor.filterData('dob');
      dobElement.click();
      inputText(dobElement, dob);
    }
  };

  app.EditDetails_AsiaQuoteRiskInfo = function() {

  }

  app.EditDetails_AsiaQuoteAdditionalInfo = function () {
    
  }

  app.clickBackButton = function() {
    element.all(by.xpath('//*[@id="previous1"]')).get(0).click();
    // browser.waitForAngular();
  }

  app.clickLogout = function() {
    element(by.linkText('Logout')).click();
  }

};

module.exports = function() {
    return new Application();
 };
