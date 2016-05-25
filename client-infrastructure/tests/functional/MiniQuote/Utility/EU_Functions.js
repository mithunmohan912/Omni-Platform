'use strict';
var CSV_Processor = require("./CSV_Processor");

var Application = function() {
  var app = this;
  var isPHFNAvail= false;
  var wait= 50000;
  var fileData;
  var csvProcessor = new CSV_Processor();
  var quoteNumberSaved = '';
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
    browser.ignoreSynchronization = false;
    //browser.driver.get('http://ec2-52-19-140-230.eu-west-1.compute.amazonaws.com/omnichannel/release/app-miniquote/#/');
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
      console.log(item+'----------'+value);
    });
    return param;
  }; 

  app.commonSearch_EU = function(param) {
    browser.waitForAngular();
    var productElement = element.all(by.id('quote:product_id')).get(0);
    var quoteIdElement = element.all(by.id('quote:identifier')).get(0);

    for (var key in param) {
      switch(key){  
        case('quoteNumber') :
          app.inputText(quoteIdElement,param[key]); 
        break;

        case('product') :
          //productElement.element(by.cssContainingText('option', param[key])).click();
          if(param[key]=="Car") {
            productElement.$('[value="0"]').click();
          }
          if(param[key]=="Van") {
            productElement.$('[value="1"]').click();
          }
        break;
      }
    }
    element.all(by.id('search')).get(0).click();
  };

  app.verifySearchCriteria_AutoQuote_EU = function(param) {

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
                  
                  spans[2].getText().then(function(text){
                    console.log("QUOTE ID:"+text);
                    if(text == '') {  //for an empty row existing for every visible row
                      console.log("EMPTY ROW FIELDS HERE---------");
                      //return;
                    }
                  });
                  for(var key in param){
                    switch(key){
                      case('quoteNumber'):
                      spans[2].getText().then(function(text){
                        console.log("Quote Number in quoteID :: "+text);
                        if(text) {
                          expect(param['quoteNumber']).toEqual(text);
                        }
                      });
                      break;

                      case('lastName'):
                      spans[3].getText().then(function(text){
                        console.log("lastName :: "+text);
                        if(text) {
                        expect(param['lastName']).toEqual(text);
                        }
                      })
                      break;

                      case('productID'):
                      spans[8].getText().then(function(text){
                        console.log("Product ID :: "+text);
                        if(text) {
                          expect(param['productID']).toEqual(text);
                        }
                      });
                      break;

                      case('description'):
                      spans[6].getText().then(function(text){
                        console.log("description :: "+text);
                        if(text) {
                          expect(param['description']).toEqual(text);
                        }
                      });
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

  app.clickEditButton_EU = function () {
    
    var editBtn = element(by.xpath('//*[@id="no-more-tables"]/table/tbody/tr[2]/td[9]/ng-switch/span/span[1]/a/span'));
    editBtn.click();
    browser.waitForAngular();
  };

  app.clickDeleteButton_EU = function() {

    var deleteBtn = element.all(by.xpath('//*[@id="no-more-tables"]/table/tbody/tr[2]/td[9]/ng-switch/span/span[3]/a/span')).get(0);
    deleteBtn.click();
    browser.waitForAngular();
  }

  app.clickNextButton = function() {
    //element(by.xpath('//*[@id="AddHomeQuote"]/div/div[2]/div/div[2]/div[3]/div/ng-switch/div/div/div/div[2]/div/ng-switch[2]/div/div/button')).click();
    //element.all(by.id('next1')).get(0).click();
    var nextBtn = element(by.id('next1'));
    nextBtn.click();
    browser.waitForAngular();
  };

  app.editVerifySavedQuoteDetails_QuoteInfo_EU_Auto = function(condition) {
    
    browser.waitForAngular();
    var description = csvProcessor.filterData('description');
    var startDate = csvProcessor.filterData('effectiveDate');
    var language = csvProcessor.filterData('language');

    var description1 = csvProcessor.filterData('description1');
    var startDate1 = csvProcessor.filterData('effectiveDate1');
    var language1 = csvProcessor.filterData('language1');

    var desc_Element = element.all(by.id('quote:description')).get(0);
    var date_Element = element.all(by.id('quote:contract_start_date')).get(0);
    var lang_Element = element.all(by.id('quote:language')).get(0);

    if(condition == 'edit') {
      desc_Element.getAttribute('value').then(function(text){
        if(text == description) {
          desc_Element.clear();
          desc_Element.sendKeys(description1);
          lang_Element.element(by.cssContainingText('option', language1)).click();
          date_Element.clear();
          date_Element.click();
          app.inputText(date_Element, startDate1);          
        }
        else {
          desc_Element.clear();
          desc_Element.sendKeys(description);
          lang_Element.element(by.cssContainingText('option', language)).click();
          date_Element.clear();
          date_Element.click();
          app.inputText(date_Element, startDate);
        }
      });
    }
    else if(condition == 'verify') {
      desc_Element.getAttribute('value').then(function(text){
        if(text == description) {

          element.all(by.id('quote:contract_start_date')).get(0).getAttribute('value').then(function(text){
            expect(text).toEqual(startDate);
          });

          element.all(by.id('quote:language')).get(0).getAttribute('value').then(function(text){
            expect(text).toEqual(language);
          });
        } else if(text == description1) {
            element.all(by.id('quote:contract_start_date')).get(0).getAttribute('value').then(function(text){
              expect(text).toEqual(startDate1);
            });

            element.all(by.id('quote:language')).get(0).getAttribute('value').then(function(text){
              expect(text).toEqual(language1);
            });
        }
      });
    }
    element(by.xpath('//*[@id="AddAutoQuote"]/div/div[2]/div/div[2]/div[3]/div/ng-switch/div/div/div/div[2]/div/ng-switch[2]/div/div/button')).click();
  };

  app.editVerifySavedQuoteDetails_OwnerInfo_EU_Auto = function(condition) {
    
    browser.waitForAngular();

    var ownerType = csvProcessor.filterData('ownerType');
    var dob = csvProcessor.filterData('dob');
    var lastName = csvProcessor.filterData('lastName');
    var firstName = csvProcessor.filterData('firstName');
    var postalCode = csvProcessor.filterData('postalCode');
    var city = csvProcessor.filterData('city');

    var ownerType1 = csvProcessor.filterData('ownerType1');
    var dob1 = csvProcessor.filterData('dob1');
    var lastName1 = csvProcessor.filterData('lastName1');
    var firstName1 = csvProcessor.filterData('firstName1');
    var postalCode1 = csvProcessor.filterData('postalCode1');
    var city1 = csvProcessor.filterData('city1');

    var ownerType_Element = element.all(by.id('quote_owner:type')).get(0);
    var dob_Element = element.all(by.id('quote_owner:birth_date')).get(0);
    var lastName_Element = element.all(by.id('quote_owner:name')).get(0);
    var firstName_Element = element.all(by.id('quote_owner:first_name')).get(0);
    var postal_Element = element.all(by.id('quote_owner:postal_code')).get(0);
    var city_Element = element.all(by.id('quote_owner:city')).get(0);

    if(condition == 'edit') {
      lastName_Element.getAttribute('value').then(function(text){
        if(text == lastName) {
          lastName_Element.clear();
          lastName_Element.sendKeys(lastName1);
          firstName_Element.clear();
          firstName_Element.sendKeys(firstName1);
          postal_Element.clear();
          postal_Element.sendKeys(postalCode1);
          city_Element.clear();
          city_Element.sendKeys(city1);

          dob_Element.clear();
          dob_Element.click();
          app.inputText(dob_Element, dob1);
        }
        else if(text== lastName1) {
          lastName_Element.clear();
          lastName_Element.sendKeys(lastName);
          firstName_Element.clear();
          firstName_Element.sendKeys(firstName);
          postal_Element.clear();
          postal_Element.sendKeys(postalCode);
          city_Element.clear();
          city_Element.sendKeys(city);
          
          dob_Element.clear();
          dob_Element.click();
          app.inputText(dob_Element, dob);
        }
      });
    }
    else if(condition == 'verify') {
      lastName_Element.getAttribute('value').then(function(text){
        if(text == lastName) {
          element.all(by.id('quote_owner:type')).get(0).getAttribute('value').then(function(text){
            expect(text).toEqual(ownerType);
          });
          element.all(by.id('quote_owner:birth_date')).get(0).getAttribute('value').then(function(text){
            expect(text).toEqual(dob);
          });
          element.all(by.id('quote_owner:name')).get(0).getAttribute('value').then(function(text){
            expect(text).toEqual(lastName);
          });
          element.all(by.id('quote_owner:first_name')).get(0).getAttribute('value').then(function(text){
            expect(text).toEqual(firstName);
          });
          element.all(by.id('quote_owner:postal_code')).get(0).getAttribute('value').then(function(text){
            expect(text).toEqual(postalCode);
          });
          element.all(by.id('quote_owner:city')).get(0).getAttribute('value').then(function(text){
            expect(text).toEqual(city);
          });
        } else if(text == lastName1) {
            element.all(by.id('quote_owner:type')).get(0).getAttribute('value').then(function(text){
              expect(text).toEqual(ownerType);
            });
            element.all(by.id('quote_owner:birth_date')).get(0).getAttribute('value').then(function(text){
              expect(text).toEqual(dob);
            });
            element.all(by.id('quote_owner:name')).get(0).getAttribute('value').then(function(text){
              expect(text).toEqual(lastName);
            });
            element.all(by.id('quote_owner:first_name')).get(0).getAttribute('value').then(function(text){
              expect(text).toEqual(firstName);
            });
            element.all(by.id('quote_owner:postal_code')).get(0).getAttribute('value').then(function(text){
              expect(text).toEqual(postalCode);
            });
            element.all(by.id('quote_owner:city')).get(0).getAttribute('value').then(function(text){
              expect(text).toEqual(city);
            });
        }
      });
    }
    element(by.xpath('//*[@id="AddAutoQuote"]/div/div[3]/div/div[2]/div[3]/div/ng-switch/div/div/div[2]/div[2]/div/ng-switch[2]/div/div/button')).click();
  };

  app.editVerifySavedQuoteDetails_RiskInfo_EU_Auto = function(condition) {

    browser.waitForAngular();

    var make = csvProcessor.filterData('make');
    var power = csvProcessor.filterData('power');
    var usage = csvProcessor.filterData('usage');
    var model = csvProcessor.filterData('model');
    var fuel = csvProcessor.filterData('fuel');
    var ext_sport = csvProcessor.filterData('ext_sport');
    var ext_cabrio = csvProcessor.filterData('ext_cabrio');
    var ext_type = csvProcessor.filterData('ext_type');
    var ext_trailer = csvProcessor.filterData('ext_trailer');
    var ext_old_timer = csvProcessor.filterData('ext_old_timer');
    var ext_avg_mileage = csvProcessor.filterData('ext_avg_mileage');
    var ext_omnium_type = csvProcessor.filterData('ext_omnium_type');
    var ext_degree_rc = csvProcessor.filterData('ext_degree_rc');
    var ext_risk = csvProcessor.filterData('ext_risk');
    var ext_responsible = csvProcessor.filterData('ext_responsible');
    var shared_claims = csvProcessor.filterData('shared_claims');
    var ext_determine = csvProcessor.filterData('ext_determine');
    var victim_no = csvProcessor.filterData('victim_no');
    var ext_omnium_type = csvProcessor.filterData('ext_omnium_type');
    var ext_degree_rc = csvProcessor.filterData('ext_degree_rc');
    var ext_risk = csvProcessor.filterData('ext_risk');
    var ext_responsible = csvProcessor.filterData('ext_responsible');
    var shared_claims = csvProcessor.filterData('shared_claims');
    var ext_determine = csvProcessor.filterData('ext_determine');
    var victim_no = csvProcessor.filterData('victim_no');
    var ext_official_claims = csvProcessor.filterData('ext_official_claims');
    var jeep = csvProcessor.filterData('jeep');
    var insured_value = csvProcessor.filterData('insured_value');
    var leasing = csvProcessor.filterData('leasing');
    var vat = csvProcessor.filterData('vat');

    var make1 = csvProcessor.filterData('make1');
    var power1 = csvProcessor.filterData('power1');
    var usage1 = csvProcessor.filterData('usage1');
    var model1 = csvProcessor.filterData('model1');

    var make_el = element.all(by.id('quote_automobile:make')).get(0);
    var power_el = element.all(by.id('quote_automobile:power')).get(0);
    var usage_el = element.all(by.id('quote_automobile:usage')).get(0);
    var ext_model_el = element.all(by.id('quote_automobile:ext_model')).get(0);
    var fuel_el = element.all(by.id('quote_automobile:fuel')).get(0);
    var ext_sport_el = element.all(by.id('quote_automobile:ext_sport')).get(0);
    var ext_cabrio_el = element.all(by.id('quote_automobile:ext_cabrio')).get(0);
    var ext_type_el = element.all(by.id('quote_automobile:ext_type')).get(0);
    var ext_trailer_el = element.all(by.id('quote_automobile:ext_trailer')).get(0);
    var ext_old_timer_el = element.all(by.id('quote_automobile:ext_old_timer')).get(0);
    var ext_mileage_el = element.all(by.id('quote_automobile:ext_average_mileage')).get(0);
    var ext_omnium_el = element.all(by.id('quote_automobile:ext_omnium_type')).get(0);
    var ext_degree_el = element.all(by.id('quote_automobile:ext_degree_r_c')).get(0);
    var ext_risk_el = element.all(by.id('quote_automobile:ext_aggravated_risk')).get(0);
    var ext_resp_el = element.all(by.id('quote_automobile:ext_responsible_claims_number')).get(0);
    var ext_shared_el = element.all(by.id('quote_automobile:ext_shared_claims_number')).get(0);
    var ext_det_el = element.all(by.id('quote_automobile:ext_to_determine_claims_number')).get(0);
    var ext_victim_el = element.all(by.id('quote_automobile:ext_victim_claims_number')).get(0);
    var ext_official_claims_el = element.all(by.id('quote_automobile:ext_official_claims')).get(0);
    var ext_jeep_el = element.all(by.id('quote_automobile:ext_jeep')).get(0);
    var insured_value_el = element.all(by.id('quote_automobile:insured_value')).get(0);
    var ext_leasing_el = element.all(by.id('quote_automobile:ext_leasing')).get(0);
    var ext_vat_el = element.all(by.id('quote_risk:ext_vat')).get(0);


    if(condition == "edit") {
      make_el.getAttribute('value').then(function(text){
        if(text == make) {
          make_el.clear();
          make_el.sendKeys(make1);

          power_el.clear();
          power_el.sendKeys(power1);

          usage_el.clear();
          usage_el.sendKeys(usage1);

          ext_model_el.clear();
          ext_model_el.sendKeys(model1);
        }
        else if(text == make1) {
          make_el.clear();
          make_el.sendKeys(make);

          power_el.clear();
          power_el.sendKeys(power);

          usage_el.clear();
          usage_el.sendKeys(usage);

          ext_model_el.clear();
          ext_model_el.sendKeys(model);
        }
      });
    }
    else if(condition == "verify") {
      make_el.getAttribute('value').then(function(text){
        if(text == make) {   
          power_el.getAttribute('value').then(function(text){
            expect(text).toEqual(power);
          });
          usage_el.getAttribute('value').then(function(text){
            expect(text).toEqual(usage);
          });
          ext_model_el.getAttribute('value').then(function(text){
            expect(text).toEqual(model);
          });
          fuel_el.getAttribute('value').then(function(text){
            expect(text).toEqual(fuel);
          });

          var btn = ext_sport_el.element(by.css('.active'));
          btn.getText().then(function(text){
            console.log(text+"------------------");
            expect(text).toContain(ext_sport);   
          });

          var cabrio_btn = ext_cabrio_el.element(by.css('.active'));
          cabrio_btn.getText().then(function(text){
            expect(text).toEqual(ext_cabrio);
          });

          ext_type_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_type);
          });
       
          var trailer_btn = ext_trailer_el.element(by.css('.active'));
          trailer_btn.getText().then(function(text){
            expect(text).toEqual(ext_trailer);
          });

          var timer_btn = ext_old_timer_el.element(by.css('.active'));
          timer_btn.getText().then(function(text){
            expect(text).toEqual(ext_old_timer);
          });

          var mileage_btn = ext_mileage_el.element(by.css('.active'));
          mileage_btn.getText().then(function(text){
            expect(text).toEqual(ext_avg_mileage);
          });
          
          ext_omnium_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_omnium_type);
          });
          ext_degree_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_degree_rc);
          });

          var risk_btn = ext_risk_el.element(by.css('.active'));
          risk_btn.getText().then(function(text){
            expect(text).toEqual(ext_risk);
          });

          ext_resp_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_responsible);
          });
          ext_shared_el.getAttribute('value').then(function(text){
            expect(text).toEqual(shared_claims);
          });
          ext_det_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_determine);
          });
          ext_victim_el.getAttribute('value').then(function(text){
            expect(text).toEqual(victim_no);
          });
          
          var claims_btn = ext_official_claims_el.element(by.css('.active'));
          claims_btn.getText().then(function(text){
            expect(text).toEqual(ext_official_claims);
          });

          var jeep_btn = ext_jeep_el.element(by.css('.active'));
          jeep_btn.getText().then(function(text){
            expect(text).toEqual(jeep);
          });
          
          insured_value_el.getAttribute('value').then(function(text){
            expect(text).toEqual(insured_value);
          });
          ext_leasing_el.getAttribute('value').then(function(text){
            expect(text).toEqual(leasing);
          });
          ext_vat_el.getAttribute('value').then(function(text){
            expect(text).toEqual(vat);
          });
        } else if(text == make1) {   
            power_el.getAttribute('value').then(function(text){
            expect(text).toEqual(power1);
          });
          usage_el.getAttribute('value').then(function(text){
            expect(text).toEqual(usage1);
          });
          ext_model_el.getAttribute('value').then(function(text){
            expect(text).toEqual(model1);
          });
          fuel_el.getAttribute('value').then(function(text){
            expect(text).toEqual(fuel);
          });

          var btn = ext_sport_el.element(by.css('.active'));
          btn.getText().then(function(text){
            console.log(text+"------------------");
            expect(text).toContain(ext_sport);   
          });

          var cabrio_btn = ext_cabrio_el.element(by.css('.active'));
          cabrio_btn.getText().then(function(text){
            expect(text).toEqual(ext_cabrio);
          });

          ext_type_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_type);
          });
       
          var trailer_btn = ext_trailer_el.element(by.css('.active'));
          trailer_btn.getText().then(function(text){
            expect(text).toEqual(ext_trailer);
          });

          var timer_btn = ext_old_timer_el.element(by.css('.active'));
          timer_btn.getText().then(function(text){
            expect(text).toEqual(ext_old_timer);
          });

          var mileage_btn = ext_mileage_el.element(by.css('.active'));
          mileage_btn.getText().then(function(text){
            expect(text).toEqual(ext_avg_mileage);
          });
          
          ext_omnium_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_omnium_type);
          });
          ext_degree_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_degree_rc);
          });

          var risk_btn = ext_risk_el.element(by.css('.active'));
          risk_btn.getText().then(function(text){
            expect(text).toEqual(ext_risk);
          });

          ext_resp_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_responsible);
          });
          ext_shared_el.getAttribute('value').then(function(text){
            expect(text).toEqual(shared_claims);
          });
          ext_det_el.getAttribute('value').then(function(text){
            expect(text).toEqual(ext_determine);
          });
          ext_victim_el.getAttribute('value').then(function(text){
            expect(text).toEqual(victim_no);
          });
          
          var claims_btn = ext_official_claims_el.element(by.css('.active'));
          claims_btn.getText().then(function(text){
            expect(text).toEqual(ext_official_claims);
          });

          var jeep_btn = ext_jeep_el.element(by.css('.active'));
          jeep_btn.getText().then(function(text){
            expect(text).toEqual(jeep);
          });
          
          insured_value_el.getAttribute('value').then(function(text){
            expect(text).toEqual(insured_value);
          });
          ext_leasing_el.getAttribute('value').then(function(text){
            expect(text).toEqual(leasing);
          });
          ext_vat_el.getAttribute('value').then(function(text){
            expect(text).toEqual(vat);
          });
        }
      });
    }
  };

  app.verifyQuoteNumber_AutoQuote_EU = function() {

    browser.waitForAngular();
    var quoteNumber = csvProcessor.filterData('quoteNumber');
    var identifier = element(by.xpath('//*[@id="AddAutoQuote"]/div/div[5]/div/div[1]/div[3]/div/ng-switch/div/div/div[1]/div[2]/div/ng-switch[2]/div/span'));
    identifier.getText().then(function(text){
      expect(text).toEqual(quoteNumber);
    });
  };

  app.verifySavedQuoteDetails_PremiumInfo_EU_Auto = function() {

    browser.waitForAngular();

    var quoteNumber = csvProcessor.filterData('quoteNumber');
    var annual_cost = csvProcessor.filterData('annual_cost');

    var identifier = element(by.xpath('//*[@id="AddAutoQuote"]/div/div[5]/div/div[1]/div[3]/div/ng-switch/div/div/div[1]/div[2]/div/ng-switch[2]/div/span'));
    identifier.getText().then(function(text){
      expect(text).toEqual(quoteNumber);
    });

    var annualCostValue = element(by.xpath('//*[@id="AddAutoQuote"]/div/div[5]/div/div[1]/div[3]/div/ng-switch/div/div/div[2]/div[2]/div/ng-switch[2]/div/span'));
    annualCostValue.getText().then(function(text){
      var re = /(\d+.\d+)/; 
      var str = '?70.51';
      var m;
       
      if ((m = re.exec(str)) !== null) {
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
        // View your result using the m-variable.
        // eg m[0] etc.
      }
      expect(m[0]).toEqual(annual_cost);
    });
  };

  app.clickCreateQuoteButton = function() {
    browser.waitForAngular();
    element(by.xpath('//*[@id="create"]')).click();
  }

  app.fillNewQuoteDetails_QuoteInfo_EU = function() {
    browser.waitForAngular();
    var description = csvProcessor.filterData('description');
    var startDate = csvProcessor.filterData('effectiveDate');
    var language = csvProcessor.filterData('language');

    var desc_Element = element.all(by.id('quote:description')).get(0);
    var date_Element = element.all(by.id('quote:contract_start_date')).get(0);
    var lang_Element = element.all(by.id('quote:language')).get(0);

    desc_Element.sendKeys(description);
    lang_Element.element(by.cssContainingText('option', language)).click();
    date_Element.click();
    app.inputText(date_Element,startDate);
    element(by.xpath('//*[@id="ui-datepicker-div"]/table/tbody/tr[1]/td[1]/a')).click();

    element.all(by.xpath('//*[@id="next1"]')).get(0).click();
  }

  app.fillNewQuoteDetails_OwnerInfo_EU = function () {
    browser.waitForAngular();

    var ownerType = csvProcessor.filterData('ownerType');
    var dob = csvProcessor.filterData('dob');
    var lastName = csvProcessor.filterData('lastName');
    var firstName = csvProcessor.filterData('firstName');
    var postalCode = csvProcessor.filterData('postalCode');
    var city = csvProcessor.filterData('city');

    var ownerType_Element = element.all(by.id('quote_owner:type')).get(0);
    var dob_Element = element.all(by.id('quote_owner:birth_date')).get(0);
    var lastName_Element = element.all(by.id('quote_owner:name')).get(0);
    var firstName_Element = element.all(by.id('quote_owner:first_name')).get(0);
    var postal_Element = element.all(by.id('quote_owner:postal_code')).get(0);
    var city_Element = element.all(by.id('quote_owner:city')).get(0);

    ownerType_Element.element(by.cssContainingText('option', ownerType)).click();
    lastName_Element.sendKeys(lastName);
    firstName_Element.sendKeys(firstName);
    city_Element.sendKeys(city);
    postal_Element.sendKeys(postalCode);

    app.inputText(dob_Element,dob);
    //element(by.xpath('//*[@id="ui-datepicker-div"]/table/tbody/tr[1]/td[1]/a')).click();
    element(by.xpath('//*[@id="ui-datepicker-div"]/table/tbody/tr[1]/td[5]/a')).click();
    

    element.all(by.id('next1')).get(2).click();  //click on next button
  }

  app.fillNewQuoteDetails_RiskInfo_EU = function() {
    browser.waitForAngular();

    var make = csvProcessor.filterData('make');
    var power = csvProcessor.filterData('power');
    var usage = csvProcessor.filterData('usage');
    var model = csvProcessor.filterData('model');
    var fuel = csvProcessor.filterData('fuel');
    var ext_sport = csvProcessor.filterData('ext_sport');
    var ext_cabrio = csvProcessor.filterData('ext_cabrio');
    var ext_type = csvProcessor.filterData('ext_type');
    var ext_trailer = csvProcessor.filterData('ext_trailer');
    var ext_old_timer = csvProcessor.filterData('ext_old_timer');
    var ext_avg_mileage = csvProcessor.filterData('ext_avg_mileage');
    var ext_omnium_type = csvProcessor.filterData('ext_omnium_type');
    var ext_degree_rc = csvProcessor.filterData('ext_degree_rc');
    var ext_risk = csvProcessor.filterData('ext_risk');
    var ext_responsible = csvProcessor.filterData('ext_responsible');
    var shared_claims = csvProcessor.filterData('shared_claims');
    var ext_determine = csvProcessor.filterData('ext_determine');
    var ext_omnium_type = csvProcessor.filterData('ext_omnium_type');
    var ext_degree_rc = csvProcessor.filterData('ext_degree_rc');
    var ext_risk = csvProcessor.filterData('ext_risk');
    var ext_responsible = csvProcessor.filterData('ext_responsible');
    var shared_claims = csvProcessor.filterData('shared_claims');
    var ext_determine = csvProcessor.filterData('ext_determine');
    var victim_no = csvProcessor.filterData('victim_no');
    var ext_official_claims = csvProcessor.filterData('ext_official_claims');
    var jeep = csvProcessor.filterData('jeep');
    var insured_value = csvProcessor.filterData('insured_value');
    var leasing = csvProcessor.filterData('leasing');
    var vat = csvProcessor.filterData('vat');

    element.all(by.id('quote_automobile:make')).get(0).click();
    element.all(by.id('quote_automobile:make')).get(0).sendKeys(make);
    element.all(by.id('quote_automobile:ext_model')).get(0).sendKeys(model);
    element.all(by.id('quote_automobile:power')).get(0).sendKeys(power);

    var usage_el = element.all(by.id('quote_automobile:usage')).get(0);
    usage_el.click();
    usage_el.$('[value="'+usage+'"]').click();
    // usage_el.element(by.cssContainingText('option',usage)).click();
    
    var fuel_el = element.all(by.id('quote_automobile:fuel')).get(0);
    fuel_el.element(by.cssContainingText('option',fuel)).click();

    var type_el = element.all(by.id('quote_automobile:ext_type')).get(0);
    type_el.element(by.cssContainingText('option',ext_type)).click();

    var ext_omnium_type_el = element.all(by.id('quote_automobile:ext_omnium_type')).get(0);
    ext_omnium_type_el.element(by.cssContainingText('option',ext_omnium_type)).click();

    element.all(by.id('quote_automobile:ext_degree_r_c')).get(0).sendKeys(ext_degree_rc);
    element.all(by.id('quote_automobile:ext_responsible_claims_number')).get(0).clear().sendKeys(ext_responsible);
    element.all(by.id('quote_automobile:ext_shared_claims_number')).get(0).clear().sendKeys(shared_claims);
    element.all(by.id('quote_automobile:ext_to_determine_claims_number')).get(0).clear().sendKeys(ext_determine);
    element.all(by.id('quote_automobile:ext_victim_claims_number')).get(0).clear().sendKeys(victim_no);
    element.all(by.id('quote_automobile:insured_value')).get(0).sendKeys(insured_value);
    element.all(by.id('quote_risk:ext_vat')).get(0).sendKeys(vat);

    var leasing_el = element.all(by.id('quote_automobile:ext_leasing')).get(0);
    leasing_el.element(by.cssContainingText('option',leasing)).click();

    element(by.css('label[name="quote_automobile:ext_cabrio"][btn-radio="'+ext_cabrio+'"]')).click();
    element(by.css('label[name="quote_automobile:ext_sport"][btn-radio="'+ext_sport+'"]')).click();
    element(by.css('label[name="quote_automobile:ext_trailer"][btn-radio="'+ext_trailer+'"]')).click();
    element(by.css('label[name="quote_automobile:ext_old_timer"][btn-radio="'+ext_old_timer+'"]')).click();
    element(by.css('label[name="quote_automobile:ext_average_mileage"][btn-radio="'+ext_avg_mileage+'"]')).click();
    element(by.css('label[name="quote_automobile:ext_aggravated_risk"][btn-radio="'+ext_risk+'"]')).click();
    element(by.css('label[name="quote_automobile:quote_automobile:ext_official_claims"][btn-radio="'+ext_official_claims+'"]')).click();
    element(by.css('label[name="quote_automobile:ext_jeep"][btn-radio="'+jeep+'"]')).click();
  };

  app.clickCalculatePremiumButton = function() {
    browser.waitForAngular();
    var premium = element.all(by.xpath('//*[@id="submit1"]')).get(0);

    browser.executeScript('window.scrollTo(0,10000);');
    browser.wait(protractor.ExpectedConditions.visibilityOf(premium), wait)
    .then(function () {
      console.log("Visible of premium Button");
      premium.click();
    });
    browser.waitForAngular();
  };

  app.getNewQuoteNumber_Auto_EU = function() {

    browser.waitForAngular();
    var identifier = element(by.xpath('//*[@id="AddAutoQuote"]/div/div[5]/div/div[1]/div[3]/div/ng-switch/div/div/div[1]/div[2]/div/ng-switch[2]/div/span'));                                
    
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

  app.searchByQuoteId= function(){

    var quoteId = element.all(by.id('quote:identifier')).get(0);
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

  app.clickLogout = function() {
    element(by.linkText('Logout')).click();
  };

};

module.exports = function() {
    return new Application();
};