'use strict';

/*
global spyOn, searchVehicleMake
*/

describe('quoteFactoryTest', function(){
  var _quoteFactory, _resourceFactory;
/*
  beforeEach(function(){
    angular.mock.module('ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','omnichannel', 'pascalprecht.translate');

  });

  
  

  beforeEach(function(){


    inject(function(){

        var $injector = angular.injector(['ngMock', 'app']);
        _quoteFactory = $injector.get('quoteFactory');
        _resourceFactory = $injector.get('resourceFactory');

    });  

    spyOn(_resourceFactory, 'get').and.callFake(function(params){

      if (params && params.indexOf('vehicle_make')){          
        return {
          then: function(callback) {
              return callback(searchVehicleMake); 
          }
        };
      }else{
          return {
            then: function() {
                return false; 
          }
        };
      }

    });

  });


  it('test case to test next button exists', function(){

     expect(_quoteFactory.toCoverage).toBeDefined();
   
  });

  it('test case to test searchVehicleMake custom action', function(){

    var element = {};
    element.$viewValue = 'MER';

    var searchResults = _quoteFactory.searchVehicleMake(element);

    expect(searchResults.length).toEqual(3);

   
  });
*/

});
 
 

