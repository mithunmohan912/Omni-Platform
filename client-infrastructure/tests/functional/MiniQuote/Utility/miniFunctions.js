'use strict';
var CSV_Processor = require("./CSV_Processor");

var Application = function() {
  var app = this;
  var isPHFNAvail= false;
  var wait= 50000;
  var fileData;
  var csvProcessor = new CSV_Processor();
  var quoteNumberSaved = '';
  var quoteNumberSaved_HomeUS = '';
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
      element(by.xpath('//*[@id="mainMenu"]/li[2]/ul/li[1]/a')).click();
    }
    else if(clickLink === "HomeOwner Quote US") {
      element(by.xpath('//*[@id="mainMenu"]/li[2]/ul/li[3]/a')).click();
    }
    else if(clickLink === "Auto Quote EU") {
      element(by.xpath('//*[@id="mainMenu"]/li[2]/ul/li[2]/a')).click();
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
      // console.log(item+'----------'+value);
    });
    return param;
  }; 

  app.searchByQuoteId= function(){

    var quoteId = element.all(by.id('quote-identifier')).get(0);
    var quoteNumber;
    if(quoteNumberSaved) {
      quoteNumber = quoteNumberSaved;
    }
    else {
      quoteNumber = csvProcessor.filterData('quoteNumber');
    }
    app.inputText(quoteId,quoteNumber);
    //quoteId.sendKeys(quoteNumber);

    element.all(by.id('search')).get(0).click();
  };

  app.commonSearchByParams = function(param) {

    browser.waitForAngular();
    var quoteIdEl = element.all(by.id('quote-identifier')).get(0);

    for (var key in param) {
      switch(key){  
        case('quoteNumber') :
          app.inputText(quoteIdEl,param[key]); 
        break;
      }
    }
    element.all(by.id('search')).get(0).click();
  };

  app.commonSearch_US = function(param) {

    browser.waitForAngular();
    var symbolElement = element.all(by.id('symbol')).get(0);
    var quoteIdElement = element.all(by.id('quoteNumber')).get(0);

    for (var key in param) {
      switch(key){  
        case('quoteNumber') :
          app.inputText(quoteIdElement,param[key]); 
        break;

        case('symbol') :
          app.inputText(symbolElement,param[key]); 
        break;
      }
    }
    element.all(by.id('search')).get(0).click();
  };

  app.verifySearchCriteria_US = function(param) {
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
                  
                  spans[1].getText().then(function(text){
                    console.log("QUOTE ID:"+text);
                    if(!text) {  //for an empty row existing for every visible row
                      return;
                    }
                  });
                  for(var key in param){
                    switch(key){
                      case('quoteNumber'):
                      spans[1].getText().then(function(text){
                        console.log("Quote Number in quoteID :: "+text);
                        if(text) {
                          expect(param['quoteNumber']).toEqual(text);
                        }
                      });
                      break;
                    }
                  }
                });
              });
            });
          }
      });
  };

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
    //*[@id="no-more-tables"]/table/tbody/tr[2]/td[8]/ng-switch/span/span/a/span     //asia
    var editBtn = element(by.xpath('//*[@id="no-more-tables"]/table/tbody/tr[2]/td[8]/ng-switch/span/span/a/span'));
    editBtn.click();
    browser.waitForAngular();
  };

  app.clickEditButton_US = function() { //check
    var editButton = element(by.xpath('//*[@id="no-more-tables"]/table/tbody/tr[2]/td[7]/ng-switch/span/span[2]/a/span'));
    editButton.click();
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
    var vehicleUse = csvProcessor.filterData('vehicleUse');
    var makeOfVehicle = csvProcessor.filterData('makeOfVehicle');
    var driverGender = csvProcessor.filterData('driverGender');
    var permittedDriver = csvProcessor.filterData('permittedDriver');
    var location = csvProcessor.filterData('location');
    var quoteCover = csvProcessor.filterData('quoteCover');
    var regYear = csvProcessor.filterData('regYear');
    var sumInsured = csvProcessor.filterData('sumInsured');
    var engineCapacity = csvProcessor.filterData('engineCapacity');
    var ncdPercentage = csvProcessor.filterData('ncdPercentage');
    var driverName = csvProcessor.filterData('driverName');

    element(by.id('quote-vehicle-use')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(vehicleUse);
    });

    element(by.id('quote-make-of-vehicle')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(makeOfVehicle);
    });

    element(by.id('quote-driver-gender')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(driverGender);
    });

    element(by.id('quote-permitted-driver')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(permittedDriver);
    });

    element(by.id('quote-geographic-location')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(location);
    });
    
    element(by.id('quote-cover')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(quoteCover);
    });
    
    element(by.id('quote-year-of-registration')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(regYear);
    });

    element(by.id('quote-engine-capacity')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(engineCapacity);
    });

    element(by.id('quote-sum-insured')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(sumInsured);
    });

    element(by.id('quote-NCD-percentage')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(ncdPercentage);
    });

    element(by.id('quote-driver-name')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(driverName);
    });
  };

  app.verifySavedQuoteDetails_AdditionalInfo = function() {

    browser.waitForAngular();

    var premium = csvProcessor.filterData('additionalPremium');
    var limit = csvProcessor.filterData('additionalLimit');
    var cover = csvProcessor.filterData('additionalCover');

    element(by.id('quote-additional-premium')).getAttribute('value').then(function(text){
     //expect(text).not.toBe(null);
      expect(text).toEqual(premium);
    });

    element(by.id('quote-additional-limit')).getAttribute('value').then(function(text){
     //expect(text).not.toBe(null);
      expect(text).toEqual(limit);
    });

    element(by.id('quote-additional-cover')).getAttribute('value').then(function(text){
      //expect(text).not.toBe(null);
      expect(text).toEqual(cover);
    });
  }

  app.clickCalculatePremiumButton = function() {
    browser.executeScript('window.scrollTo(0,10000);');
    element.all(by.xpath('//*[@id="submit1"]')).get(0).click();
    browser.waitForAngular();
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

  app.EditVerifyDetails_HomeQuote_GeneralInfo_US = function(condition) {
    browser.waitForAngular();
    var  protection_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-bldgProtect-fireProtClass')).get(0);
    var  dist_fireHydrant_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-bldgProtect-distHyd-numUnt')).get(0);
    var  construction_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-const-constCd')).get(0);
    var  residence_type_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-dwellOcc-occType')).get(0);
    var  territory_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-dwellRating-terrCd')).get(0);
    var  dist_fireStn_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-bldgProtect-distHyd-unitmeas')).get(0);
    var  construction_year_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-const-yrBuilt')).get(0);
    var  dwellingType_element = element.all(by.id('dwellingType')).get(0);
    var  num_families_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-dwellInspectVal-numFam')).get(0);
    
    var protection = csvProcessor.filterData('protection');
    var fireHydrant = csvProcessor.filterData('fireHydrant');
    var construction = csvProcessor.filterData('construction');
    var residence= csvProcessor.filterData('residence');
    var territory = csvProcessor.filterData('territory');
    var fireStn = csvProcessor.filterData('fireStn');
    var construction_year= csvProcessor.filterData('construction_year');
    var dwelling = csvProcessor.filterData('dwelling');
    var num_families = csvProcessor.filterData('num_families');

    var territory1 = csvProcessor.filterData('territory1');
    var construction_year1= csvProcessor.filterData('construction_year1');
    var num_families1 = csvProcessor.filterData('num_families1');

    if(condition == "edit") {
      territory_element.getAttribute('value').then(function(text) {
        console.log("in the edit condition- IF --------"+text+'------'+territory);
        if(text == territory) {
          territory_element.clear();
          territory_element.sendKeys(territory1);

          construction_year_element.clear();
          construction_year_element.sendKeys(construction_year1);

          num_families_element.clear();
          num_families_element.sendKeys(num_families1);
        }
        else if(text == territory1) {
        console.log("in the edit condition ELSE---------"+text+'------'+territory1);
          territory_element.clear();
          territory_element.sendKeys(territory);

          construction_year_element.clear();
          construction_year_element.sendKeys(construction_year);

          num_families_element.clear();
          num_families_element.sendKeys(num_families);
        }
      });
    }
    else if(condition == "verify") {
      territory_element.getAttribute('value').then(function(text) {
        if(text == territory) {
          console.log("in the VERIFY  IF condition---------"+text+'------'+territory);
          construction_year_element.getAttribute('value').then(function(text){
            expect(text).toEqual(construction_year);
          });
          num_families_element.getAttribute('value').then(function(text){
            expect(text).toEqual(num_families);
          });
          
        }
        else if(text == territory1) {
          console.log("in the VERIFY condition- ELSE--------"+text+'------'+territory1);
          construction_year_element.getAttribute('value').then(function(text){
            expect(text).toEqual(construction_year1);
          });
          num_families_element.getAttribute('value').then(function(text){
            expect(text).toEqual(num_families1);
          });
        }
      });
    }
    browser.executeScript('window.scrollTo(0,10000);');
    //clicking on next button
    element.all(by.id('next1')).get(0).click();
  };

  app.EditVerifyDetails_HomeQuote_CoverageInfo_US = function(condition) {
    browser.waitForAngular();

    var HO_form_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-policyType')).get(0);
    var deductible_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-cov|1-ded-formatCurrencyamt-amt')).get(0);
    var other_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-cov|2-lim-formatCurrencyamt-amt')).get(0);
    var personal_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-cov|3-lim-formatCurrencyamt-amt')).get(0);
    var lossOfUse_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-cov|4-lim-formatCurrencyamt-amt')).get(0);
    var liability_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-cov|5-lim-formatCurrencyamt-amt')).get(0);
    var medical_element = element.all(by.id('QuoteSyncRs-homeLineBus-dwell-cov|6-lim-formatCurrencyamt-amt')).get(0);

    var HO_form = csvProcessor.filterData('HO_form');
    var deductible = csvProcessor.filterData('deductible');
    var other = csvProcessor.filterData('other');
    var personal = csvProcessor.filterData('personal');
    var lossOfUse = csvProcessor.filterData('lossOfUse');
    var liability = csvProcessor.filterData('liability');
    var medical = csvProcessor.filterData('medical');

    var lossOfUse1 = csvProcessor.filterData('lossOfUse1');
    var liability1 = csvProcessor.filterData('liability1');
    var medical1 = csvProcessor.filterData('medical1');

    if(condition == "edit") {
      lossOfUse_element.getAttribute('value').then(function(text){
        if(text == lossOfUse){
          lossOfUse_element.clear();
          lossOfUse_element.sendKeys(lossOfUse1);

          liability_element.clear();
          liability_element.sendKeys(liability1);

          medical_element.clear();
          medical_element.sendKeys(medical1);
        }
        else if(text == lossOfUse1) {
          lossOfUse_element.clear();
          lossOfUse_element.sendKeys(lossOfUse);

          liability_element.clear();
          liability_element.sendKeys(liability);

          medical_element.clear();
          medical_element.sendKeys(medical);
        }
      });
    }
    else if(condition == "verify") {
      lossOfUse_element.getAttribute('value').then(function(text){
        if(text == lossOfUse){
          liability_element.getAttribute('value').then(function(text){
            expect(text).toEqual(liability);
          });
         
          medical_element.getAttribute('value').then(function(text){
            expect(text).toEqual(medical);
          });

          HO_form_element.getAttribute('label').then(function(text) {
            expect(text).toEqual(HO_form);
          });

          deductible_element.getAttribute('label').then(function(text) {
            expect(text).toEqual(deductible);
          });
          
          other_element.getAttribute('value').then(function(text) {
            expect(text).toEqual(other);
          });

          personal_element.getAttribute('value').then(function(text) {
            expect(text).toEqual(personal);
          });
        }
        else if(text == lossOfUse1) {
         liability_element.getAttribute('value').then(function(text){
            expect(text).toEqual(liability1);
          });
         
          medical_element.getAttribute('value').then(function(text){
            expect(text).toEqual(medical1);
          });

          HO_form_element.getAttribute('value').then(function(text) {
            expect(text).toEqual(HO_form);
          });

          deductible_element.getAttribute('value').then(function(text) {
            expect(text).toEqual(deductible);
          });
          
          other_element.getAttribute('value').then(function(text) {
            expect(text).toEqual(other);
          });

          personal_element.getAttribute('value').then(function(text) {
            expect(text).toEqual(personal);
          });
        }
      });
    }
    browser.executeScript('window.scrollTo(0,10000);');
    //clicking on submit button
    element.all(by.id('submit')).get(0).click();
  };


  app.EditVerifyDetails_AsiaQuoteOwnerInfo = function(condition) {
    
    browser.waitForAngular();
    var quoteGenderElement = element.all(by.id('quote-gender')).get(0);
    var fullNameElement = element.all(by.id('quote-full-name')).get(0);
    var dobElement = element.all(by.id('quote-birth-date')).get(0);

    var gender1 = csvProcessor.filterData('gender1');
    var fullName1 = csvProcessor.filterData('fullName1');
    var dob1 = csvProcessor.filterData('dob1');
    var gender = csvProcessor.filterData('gender');
    var fullName = csvProcessor.filterData('fullName');
    var dob = csvProcessor.filterData('dob');
    
    console.log("the condition if it is for edit or verification "+condition);

    if(condition == 'edit') {
      quoteGenderElement.getAttribute('value').then(function(text){
        if(text == gender) {
          quoteGenderElement.element(by.cssContainingText('option', gender1)).click();
          fullNameElement.clear();
          fullNameElement.sendKeys(fullName1);
          dobElement.clear();
          dobElement.click();
          app.inputText(dobElement, dob1);
        }
        else {
          quoteGenderElement.element(by.cssContainingText('option', gender)).click();
          fullNameElement.clear();
          fullNameElement.sendKeys(fullName);
          dobElement.clear();
          dobElement.click();
          app.inputText(dobElement, dob);
        }
      });
    }
    else if(condition == 'verify') {
      quoteGenderElement.getAttribute('value').then(function(text){
        if(text == gender) {
          fullNameElement.getAttribute('value').then(function(text) {
            expect(text).toEqual(fullName);
          });

          dobElement.getAttribute('value').then(function(text){
            expect(text).toEqual(dob);
          });
        }
        else if(text == gender1) {
          fullNameElement.getAttribute('value').then(function(text) {
            expect(text).toEqual(fullName1);
          });

          dobElement.getAttribute('value').then(function(text){
            expect(text).toEqual(dob1);
          });
        }
      });
    }
  };

  app.EditVerifyDetails_AsiaQuoteRiskInfo = function(condition) {
    
    browser.waitForAngular();
    var yearOfRegistrationElement = element.all(by.id('quote-year-of-registration')).get(0);
    var sumInsuredElement = element.all(by.id('quote-sum-insured')).get(0);
    var ncdPercentageElement = element.all(by.id('quote-NCD-percentage')).get(0);


      var regYear1 = csvProcessor.filterData('regYear1');
      var sumInsured1 = csvProcessor.filterData('sumInsured1');
      var ncdPercentage1 = csvProcessor.filterData('ncdPercentage1');
      var regYear = csvProcessor.filterData('regYear');
      var sumInsured = csvProcessor.filterData('sumInsured');
      var ncdPercentage = csvProcessor.filterData('ncdPercentage');

    if(condition == 'edit') {
      sumInsuredElement.getAttribute('value').then(function(text){
        if(text == sumInsured) {
          yearOfRegistrationElement.clear();
          yearOfRegistrationElement.sendKeys(regYear1);
          sumInsuredElement.clear();
          sumInsuredElement.sendKeys(sumInsured1);
          ncdPercentageElement.clear();
          ncdPercentageElement.sendKeys(ncdPercentage1);
        }
        else {
          yearOfRegistrationElement.clear();
          yearOfRegistrationElement.sendKeys(regYear);
          sumInsuredElement.clear();
          sumInsuredElement.sendKeys(sumInsured);
          ncdPercentageElement.clear();
          ncdPercentageElement.sendKeys(ncdPercentage);
        }
      });
    }
    else if(condition == 'verify') {
       sumInsuredElement.getAttribute('value').then(function(text){
        if(text == sumInsured) {
          yearOfRegistrationElement.getAttribute('value').then(function(text) {
            expect(text).toEqual(regYear);
          });
          ncdPercentageElement.getAttribute('value').then(function(text) {
            expect(text).toEqual(ncdPercentage);
          });
        }
        else if(text == sumInsured1) {
          yearOfRegistrationElement.getAttribute('value').then(function(text) {
            expect(text).toEqual(regYear1);
          });
          ncdPercentageElement.getAttribute('value').then(function(text) {
            expect(text).toEqual(ncdPercentage1);
          });
        }
      });
    }
  };

  app.EditVerifyDetails_AsiaQuoteAdditionalInfo = function (condition) {

    browser.waitForAngular();
    var additionalPremiumElement = element.all(by.id('quote-additional-premium')).get(0);
    var additionalLimitElement = element.all(by.id('quote-additional-limit')).get(0);
    var additionalCoverElement = element.all(by.id('quote-additional-cover')).get(0);
    var premium;

    additionalPremiumElement.getAttribute('value').then(function(text){
      premium = text;
    });
    console.log("the condition if it is for edit or verification "+condition);

      var additionalPremium1 = csvProcessor.filterData('additionalPremium1');
      var additionalLimit1 = csvProcessor.filterData('additionalLimit1');
      var additionalCover1 = csvProcessor.filterData('additionalCover1');
      var additionalPremium = csvProcessor.filterData('additionalPremium');
      var additionalLimit = csvProcessor.filterData('additionalLimit');
      var additionalCover = csvProcessor.filterData('additionalCover');
    
    if(condition == 'edit') {
      additionalPremiumElement.getAttribute('value').then(function(text){
        if(text == additionalPremium) {
          additionalPremiumElement.clear();
          additionalPremiumElement.sendKeys(additionalPremium1);
          additionalLimitElement.clear();
          additionalLimitElement.sendKeys(additionalLimit1);
          additionalCoverElement.element(by.cssContainingText('option', additionalCover1)).click();
        }
        else {
          additionalPremiumElement.clear();
          additionalPremiumElement.sendKeys(additionalPremium);
          additionalLimitElement.clear();
          additionalLimitElement.sendKeys(additionalLimit);
          additionalCoverElement.element(by.cssContainingText('option', additionalCover)).click();
        }
      });
    } else if(condition == 'verify') {
      additionalPremiumElement.getAttribute('value').then(function(text){
        if(text == additionalPremium) {
          additionalLimitElement.getAttribute('value').then(function(text){
            expect(text).toEqual(additionalLimit);
          });
          additionalCoverElement.getAttribute('value').then(function(text){
            expect(text).toEqual(additionalCover);
          });
        } else if(text == additionalPremium1) {
          additionalLimitElement.getAttribute('value').then(function(text){
            expect(text).toEqual(additionalLimit1);
          });
          additionalCoverElement.getAttribute('value').then(function(text){
            expect(text).toEqual(additionalCover1);
          });
        }
      });
    }
  };

  app.verifyQuoteNumber = function() {

    browser.waitForAngular();
    var quoteNumber = csvProcessor.filterData('quoteNumber');

    var identifier = element(by.xpath('//*[@id="AddHomeQuote"]/div/div[7]/div/div[1]/div[3]/div/ng-switch/div/div/div[1]/div[2]/div/ng-switch[2]/div/span'));
    identifier.getText().then(function(text){
      expect(text).toEqual(quoteNumber);
    });
  };

  app.verifyQuoteNumber_HomeQuote_US = function() {  //check

    browser.waitForAngular();
    var quoteNumber = csvProcessor.filterData('quoteNumber');

    var identifier = element(by.xpath('//*[@id="AddHomeQuote"]/div/div[7]/div/div[1]/div[3]/div/ng-switch/div/div/div[1]/div[2]/div/ng-switch[2]/div/span'));
    identifier.getText().then(function(text){
      expect(text).toEqual(quoteNumber);
    });
  }

  app.clickCreateQuoteButton = function() {
    browser.waitForAngular();
    element(by.xpath('//*[@id="create"]')).click();
  }

  app.fillNewQuoteDetails_OwnerInfo = function () {
    browser.waitForAngular();

    var partyType = csvProcessor.filterData('partyType');
    var gender = csvProcessor.filterData('gender');
    var fullName = csvProcessor.filterData('fullName');
    var dob = csvProcessor.filterData('dob');

    var partyTypeElement =  element.all(by.id('quote-party-type')).get(0);
    partyTypeElement.element(by.cssContainingText('option', partyType)).click();
    var genderElement = element.all(by.id('quote-gender')).get(0);
    genderElement.element(by.cssContainingText('option', gender)).click();
    element.all(by.id('quote-full-name')).get(0).click().sendKeys(fullName);
    var dobElement = element.all(by.id('quote-birth-date')).get(0);
    dobElement.click();
    app.inputText(dobElement, dob);
    element(by.xpath('//*[@id="ui-datepicker-div"]/table/tbody/tr[1]/td[1]/a')).click();
    //element(by.xpath('//*[@id="label_AddHomeQuote"]')).click();

    element.all(by.id('next1')).get(0).click();  //click on next button
  }

  app.fillNewQuoteDetails_RiskInfo = function() {
    browser.waitForAngular();

    var vehicleUse = csvProcessor.filterData('vehicleUse');
    var makeOfVehicle = csvProcessor.filterData('makeOfVehicle');
    var driverGender = csvProcessor.filterData('driverGender');
    var permittedDriver = csvProcessor.filterData('permittedDriver');
    var location = csvProcessor.filterData('location');
    var quoteCover = csvProcessor.filterData('quoteCover');

    var regYear = csvProcessor.filterData('regYear');
    var sumInsured = csvProcessor.filterData('sumInsured');
    var engineCapacity = csvProcessor.filterData('engineCapacity');
    var ncdPercentage = csvProcessor.filterData('ncdPercentage');
    var driverName = csvProcessor.filterData('driverName');

    var vehicleUseElement =  element.all(by.id('quote-vehicle-use')).get(0);
    vehicleUseElement.element(by.cssContainingText('option', vehicleUse)).click();

    var makeOfVehicleEl = element.all(by.id('quote-make-of-vehicle')).get(0);
    makeOfVehicleEl.element(by.cssContainingText('option', makeOfVehicle)).click();

    var driverGenderEl = element.all(by.id('quote-driver-gender')).get(0);
    driverGenderEl.element(by.cssContainingText('option', driverGender)).click();

    var permittedDriverEl = element.all(by.id('quote-permitted-driver')).get(0);
    permittedDriverEl.element(by.cssContainingText('option', permittedDriver)).click();

    var locationEl = element.all(by.id('quote-geographic-location')).get(0);
    locationEl.element(by.cssContainingText('option', location)).click();

    var quoteCoverEl = element.all(by.id('quote-cover')).get(0);
    quoteCoverEl.element(by.cssContainingText('option', quoteCover)).click();

    element.all(by.id('quote-year-of-registration')).get(0).click().sendKeys(regYear);
    element.all(by.id('quote-sum-insured')).get(0).click().sendKeys(sumInsured);
    element.all(by.id('quote-engine-capacity')).get(0).click().sendKeys(engineCapacity);
    element.all(by.id('quote-NCD-percentage')).get(0).click().sendKeys(ncdPercentage);
    element.all(by.id('quote-driver-name')).get(0).click().sendKeys(driverName);

    element.all(by.id('next1')).get(2).click();
  };

  app.fillNewQuoteDetails_AdditionalInfo = function() {
    browser.waitForAngular();

    var premium = csvProcessor.filterData('additionalPremium');
    var limit = csvProcessor.filterData('additionalLimit');
    var cover = csvProcessor.filterData('additionalCover');

    element.all(by.id('quote-additional-premium')).get(0).click().sendKeys(premium);
    element.all(by.id('quote-additional-limit')).get(0).sendKeys(limit);
    element.all(by.id('quote-additional-cover')).get(0).sendKeys(cover);
    
    element.all(by.xpath('//*[@id="submit1"]')).get(0).click(); //calculate premium button

    //if(element(by.cssContainingText('growl-item alert ng-scope alert-error alert-danger icon alert-dismissable')) //premium calc error growl msg
    element(by.xpath('/html/body/div[5]/div/div/ng-include/div/div/ul/li[6]/a')).click(); //click on Premium Info tab in case of an error
    browser.waitForAngular();
  };

  app.getNewQuoteNumber = function() {

    browser.waitForAngular();
    var identifier = element(by.xpath('//*[@id="AddHomeQuote"]/div/div[7]/div/div[1]/div[3]/div/ng-switch/div/div/div[1]/div[2]/div/ng-switch[2]/div/span'));
    browser.wait(protractor.ExpectedConditions.visibilityOf(identifier), wait)
    .then ( function () {
      console.log("Quote Id is generated");
    });
    identifier.getText().then(function(text){
      identifier.click();
      quoteNumberSaved = text;
      return quoteNumberSaved;
    });
  };

  app.fillNewQuoteDetails_HomeInfo_US = function() {
    browser.waitForAngular();
    var quote_el = element.all(by.id('quote-persPolicy-policyNumber')).get(0);
    var company_el = element.all(by.id('quote-persPolicy-locmcopco')).get(0);
    var primaryState_el = element.all(by.id('quote-persPolicy-contState')).get(0);
    var firstName_el = element.all(by.id('quote-insured|1-party-nameInfo-personName-givenName')).get(0);
    var lastName_el = element.all(by.id('quote-insured|1-party-nameInfo-personName-surName')).get(0);
    
    var quoteNumber = csvProcessor.filterData('quoteNumber');
    var company = csvProcessor.filterData('company');
    var primaryState = csvProcessor.filterData('primaryState');
    var firstName = csvProcessor.filterData('firstName');
    var lastName = csvProcessor.filterData('lastName');

    quote_el.sendKeys(quoteNumber);
    
    company_el.click();
    element(by.xpath('//*[@id="quote-persPolicy-locmcopco"]/option[2]')).click(); //need to change this; no other options available now
    
    primaryState_el.click();
    element(by.xpath('//*[@id="quote-persPolicy-contState"]/option[2]')).click(); // change this acc to csv later
    firstName_el.sendKeys(firstName);
    lastName_el.sendKeys(lastName);

    element.all(by.id('next1')).get(0).click();  //click on next button
    browser.waitForAngular();
  }

  app.fillNewQuoteDetails_PolicyInfo_US = function() {
    browser.waitForAngular();
    var state_el = element.all(by.id('quote-insured|1-party-addr-state')).get(0);
    var effectiveDate_el = element.all(by.id('quote-persPolicy-contractTerm-effDt')).get(0);
    var policyPeriod_el = element.all(by.id('quote-persPolicy-polTermMon')).get(0);
    var paymentPlan_el = element.all(by.id('quote-persPolicy-paymentOpt-paymentPlan')).get(0);
    
    var state = csvProcessor.filterData('state');
    var date = csvProcessor.filterData('date');
    var policyPeriod = csvProcessor.filterData('policyPeriod');
    var paymentPlan = csvProcessor.filterData('paymentPlan');

    state_el.click();
    //state_el.element(by.cssContainingText('option',state)).click();
    element(by.xpath('//*[@id="quote-insured|1-party-addr-state"]/option[2]')).click();

    policyPeriod_el.click();
    //policyPeriod_el.element(by.cssContainingText('option',policyPeriod)).click();
    element(by.xpath('//*[@id="quote-persPolicy-polTermMon"]/option[2]')).click();

    paymentPlan_el.click();
    //paymentPlan_el.element(by.cssContainingText('option',paymentPlan)).click();
    element(by.xpath('//*[@id="quote-persPolicy-paymentOpt-paymentPlan"]/option[2]')).click();

    app.inputText(effectiveDate_el, date);
    element(by.xpath('//*[@id="ui-datepicker-div"]/table/tbody/tr[1]/td[1]/a')).click();

    element.all(by.id('next1')).get(2).click();  //click on next button
    browser.waitForAngular();
  }

  app.fillNewQuoteDetails_GeneralInfo_US = function() {
    
    browser.waitForAngular();
    var  protection_element = element.all(by.id('quote-homeLineBus-dwell-bldgProtect-fireProtClass')).get(0);
    var  dist_fireHydrant_element = element.all(by.id('quote-homeLineBus-dwell-bldgProtect-distHyd-numUnt')).get(0);
    var  construction_element = element.all(by.id('quote-homeLineBus-dwell-const-constCd')).get(0);
    var  residence_type_element = element.all(by.id('quote-homeLineBus-dwell-dwellOcc-occType')).get(0);
    var  territory_element = element.all(by.id('quote-homeLineBus-dwell-dwellRating-terrCd')).get(0);
    var  dist_fireStn_element = element.all(by.id('quote-homeLineBus-dwell-bldgProtect-distHyd-unitmeas')).get(0);
    var  construction_year_element = element.all(by.id('quote-homeLineBus-dwell-const-yrBuilt')).get(0);
    var  dwellingType_element = element.all(by.id('dwellingType')).get(0);
    var  num_families_element = element.all(by.id('quote-homeLineBus-dwell-dwellInspectVal-numFam')).get(0);
    
    var protection = csvProcessor.filterData('protection');
    var fireHydrant = csvProcessor.filterData('fireHydrant');
    var construction = csvProcessor.filterData('construction');
    var residence= csvProcessor.filterData('residence');
    var territory = csvProcessor.filterData('territory');
    var fireStn = csvProcessor.filterData('fireStn');
    var construction_year= csvProcessor.filterData('construction_year');
    var dwelling = csvProcessor.filterData('dwelling');
    var num_families = csvProcessor.filterData('num_families');

    territory_element.sendKeys(territory);
    construction_year_element.sendKeys(construction_year);
    num_families_element.sendKeys(num_families);

    dist_fireStn_element.element(by.cssContainingText('option',fireStn)).click();
    protection_element.element(by.cssContainingText('option',protection)).click();
    dist_fireHydrant_element.element(by.cssContainingText('option',fireHydrant)).click();
    construction_element.element(by.cssContainingText('option',construction)).click();
    residence_type_element.element(by.cssContainingText('option',residence)).click();
    dwellingType_element.element(by.cssContainingText('option',dwelling)).click();

    element.all(by.id('next1')).get(4).click();  //click on next button
    browser.waitForAngular();
  }

  app.fillNewQuoteDetails_CoverageInfo_US = function() {
    browser.waitForAngular();

    var HO_form_element = element.all(by.id('quote-homeLineBus-dwell-policyType')).get(0);
    var deductible_element = element.all(by.id('quote-homeLineBus-dwell-cov|2-ded-formCurrAmt-amt')).get(0);
    var other_element = element.all(by.id('quote-homeLineBus-dwell-cov|3-lim-formCurrAmt-amt')).get(0);
    var personal_element = element.all(by.id('quote-homeLineBus-dwell-cov|4-lim-formCurrAmt-amt')).get(0);
    var lossOfUse_element = element.all(by.id('quote-homeLineBus-dwell-cov|5-lim-formCurrAmt-amt')).get(0);
    var liability_element = element.all(by.id('quote-homeLineBus-dwell-cov|6-lim-formCurrAmt-amt')).get(0);
    var medical_element = element.all(by.id('quote-homeLineBus-dwell-cov|7-lim-formCurrAmt-amt')).get(0);

    var HO_form = csvProcessor.filterData('HO_form');
    var deductible = csvProcessor.filterData('deductible');
    var other = csvProcessor.filterData('other');
    var personal = csvProcessor.filterData('personal');
    var lossOfUse = csvProcessor.filterData('lossOfUse');
    var liability = csvProcessor.filterData('liability');
    var medical = csvProcessor.filterData('medical');
    var fireAlarm = csvProcessor.filterData('fireAlarm');

    HO_form_element.element(by.cssContainingText('option',HO_form)).click();
    deductible_element.element(by.cssContainingText('option',deductible)).click();
    other_element.click().sendKeys(other);
    personal_element.click().sendKeys(personal);
    lossOfUse_element.click().sendKeys(lossOfUse);
    liability_element.element(by.cssContainingText('option',liability)).click();
    medical_element.element(by.cssContainingText('option',medical)).click();
    var alarm_element =element.all(by.id('quote-homeLineBus-dwell-bldgProtect-protDeviceFire')).get(0);
    alarm_element.element(by.cssContainingText('option',fireAlarm)).click();
  }

  app.clickCalculatePremiumButton_HomeUS = function() {

    browser.executeScript('window.scrollTo(0,10000);');
    element.all(by.id('submit')).get(0).click();  //click on submit button
    //element(by.xpath('//*[@id="AddHomeQuote"]/div/div[6]/div/div/div[3]/div/ng-switch/div/div/div[2]/div[2]/div/ng-switch[2]/div/div/button')).click();
    browser.waitForAngular();
  }

  app.clickOnPremiumTab_HomeUS = function() {

    browser.executeScript('window.scrollTo(0,0);');
    element(by.xpath('/html/body/div[5]/div/div/ng-include/div/div/ul/li[6]/a')).click();
    browser.waitForAngular();
  }

  app.getNewQuoteNumber_HomeOwnerUS = function() {

    browser.waitForAngular();
    var symbol = csvProcessor.filterData('symbol');
    var quoteNumber = csvProcessor.filterData('quoteNumber');

    var identifier = element.all(by.xpath('//*[@id="AddHomeQuote"]/div/div[7]/div/div[1]/div[3]/div/ng-switch/div/div/div[1]/div[2]/div/ng-switch[2]/div/span')).get(0);
    browser.wait(protractor.ExpectedConditions.visibilityOf(identifier), wait)
    .then ( function () {
      console.log("Quote Id is generated");
    });
    identifier.getText().then(function(text){
      identifier.click();
      text.split(" ");
      //expect(text[0]).toEqual(symbol);
      //expect(text[1]).toEqual(quoteNumber);

      //quoteNumberSaved_HomeUS = text[1];
      return quoteNumberSaved_HomeUS;
    });
  };

  app.searchByQuoteId_HomeOwnerUS =function() {

    var quoteId = element.all(by.id('quoteNumber')).get(0);
    var quoteNumber;
    if(quoteNumberSaved_HomeUS) {
      //quoteNumber = quoteNumberSaved_HomeUS;
    }
    else {
      quoteNumber = csvProcessor.filterData('quoteNumber');
    }
    app.inputText(quoteId,quoteNumber);
    //quoteId.sendKeys(quoteNumber);

    element.all(by.id('search')).get(0).click();
  };


  app.ClickInquireButton = function() {
    browser.waitForAngular();
    element(by.xpath('//*[@id="no-more-tables"]/table/tbody/tr[2]/td[7]/ng-switch/span/span[1]/a/span')).click();
  };

  app.clickLocationTab_US = function() {
    browser.waitForAngular();
    element(by.xpath('/html/body/div[5]/div/div/ng-include/div/div/ul/li[2]/a')).click();
  };

  app.clickCoverageTab_US = function() {
    browser.waitForAngular();
    element(by.xpath('/html/body/div[5]/div/div/ng-include/div/div/ul/li[3]/a')).click();
  };

  app.verifyPolicyTabDetails_US = function() {  //need to put verification details
    browser.waitForAngular();

  };

  app.verifyLocationTabDetails_US = function() { //need to put verification details
    browser.waitForAngular();

  };

  app.verifyCoverageTabDetails_US = function() { //need to put verification details
    browser.waitForAngular();
    element.all(by.xpath('//*[@id="QuoteSyncRs-homeLineBus-dwell-bldgProtect-protDeviceFire"]')).get(0).getAttribute('value').then(function(text) {
      expect(text).toEqual("N");
    });
  };


  app.clickBackButton = function() {
    element.all(by.xpath('//*[@id="previous1"]')).get(0).click();
    // browser.waitForAngular();
  };

  app.clickLogout = function() {
    element(by.linkText('Logout')).click();
  };

};

module.exports = function() {
    return new Application();
 };
