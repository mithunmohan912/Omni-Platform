'use strict';
/*
global angular
*/

/*
exported ScreenController
*/

var screenname;
function ScreenController($http, $scope, $rootScope,$controller, $injector,$routeParams, $location, growl,MetaData, HttpService, dataFactory, TableMetaData) {
	   

	    $scope.showErr = function () {
       
        growl.addErrorMessage('<b>Error:</b> Uh oh!');
        growl.addInfoMessage('Im  a info message');
        growl.addWarnMessage('Im  a warn message');
        growl.addSuccessMessage('Im  a success message');
    };
    
	screenname  = 'Omnichannel';
	$rootScope.showHeader = true;
	$scope.disableNext = false;
	var seedPayLoad = {};
	$scope.rulesDataList = [];
	var reqParm = null;
	var exist = false;
	$scope.data = {};
	$scope.remove = 'ban-circle';
	$scope.removestyle = 'red';	
	$scope.dateOptions = {
     	changeYear: true,
        changeMonth: true,
        yearRange: '1900:2030',
    };
	$rootScope.typeahead =[];
	
	if ($routeParams.screenId.indexOf(':') !== -1) {
		reqParm = $routeParams.screenId.split(':');
		$rootScope.screenId = reqParm[1];
		exist = true;
	} else {
		reqParm = $routeParams.screenId;
		$rootScope.screenId = reqParm;
	}
      
	
	$rootScope.navigate = function(url, product_id) {
        $rootScope.product_id = product_id;
        $location.path(url);
    };

    

    $scope.loadTableMetadata = function(section) {
       
        $scope.field={};

    	//console.log('@@@@@@@@'+section);
        TableMetaData.load(section.name, function(tableMetaData) {
        	//console.log('tableMetaData' + tableMetaData);
            $scope.field.tableMetaData = tableMetaData;           
        });
    };
	
	
	
	$rootScope.navigate = function(url, product_id) {
        $rootScope.product_id = product_id;
        $location.path(url);
    };

    $scope.checkvisible = function(field)
	{
		if(field.visibleWhen)
		{
			var response = evaluateExpression(field.visibleWhen.expression);
			
			return response;
		}
		return true;
	};

	function evaluateExpression(expression)
	{    var response = true;
		response = $scope.data[expression.field] === expression.value;
		
		return response;
	}
	
	$scope.loadMetaData = function() {
		$rootScope.metadata = {};
		MetaData.load($scope, (exist ? reqParm[0] : reqParm), seedPayLoad);
		if(seedPayLoad){
			$scope.loadData();

		}
	};

	$scope.loadData = function () {

		 if($rootScope.isPrev){
				//console.log($rootScope.allData);
				$scope.data = angular.copy($rootScope.allData);
				$scope.disableNext = false;
				return true;
			}
         var url = $rootScope.resourceHref;
		
	     var headers = {
			'Content-Type' : 'application/json'
            };
			
		 if (url !== undefined) {
		  
		   HttpService.options(url,$scope);
           HttpService.get(url,headers,$scope);
		 }
		 else{
		 	
		 
		 }

			};
	
	$scope.loadMetaData();

	// Dynamic Injection of Factory

	$scope.Injectfactory=function(){
		//Any screen related processing can be added to the screen factory and 
		//the code below can be used for injecting the custom screen factory
		$scope.factoryname=$scope.screenId+'factory';
        try{
			$scope.factory = $injector.get($scope.factoryname);    
	        //console.log('Injector has '+$scope.factoryname+' service!');
        }catch(e){
        	console.log('Injector does not have '+$scope.factoryname+' service!');
        }
	};
	
	//Any screen related processing can be injected through the below method call
	//$scope.Injectfactory();

	$rootScope.isPrev = false;

	
	


	
	$scope.loadOptionData = function() {
		 var url = $rootScope.resourceHref;
		 if (url === undefined) {	
				url = $rootScope.HostURL+$scope.screenId;
		 }
		 
	};


	$scope.loadOptionData();

	$scope.stTableList =[];
   $scope.displayed =[];
   $scope.showResult = true;
	$scope.doaction = function(method, subsections, action, actionURL) {
		var url;
		var screenId = $rootScope.screenId;

		if(action === 'get'){
			 url = $rootScope.HostURL+screenId;
			 $scope.factory.get(url);
		}
		else if(action === 'delete'){
			 url = $rootScope.HostURL+'quotes';
			dataFactory.delete(url,subsections.id).success(function(data){
            	growl.addSuccessMessage(data.message);
			});
		}
		else if(action==='add'){
			 $rootScope.resourceHref=undefined;
			 $rootScope.navigate(actionURL);
		} 
		else if(action==='search'){

            //growl.addSuccessMessage(data.message);
}
			
			 
		};

    
	
	  $scope.deleteRow = function(row) {
        var listDispScope = angular.element($('.table-striped')).scope();
		var url = row._link.self.href;
		var id='';
         dataFactory.delete(url,id);
	     var index=0;
		 angular.forEach(listDispScope.stTableList, function(item){
           if(item.$$hashKey===row.$$hashKey){
             listDispScope.stTableList.splice(index);	
            }
           index=index+1;
		});	
      };
	  
	  
	$rootScope.next = function() {
        $scope.next();
    };
	
	 $scope.next = function() {
	 };
	 
	  $rootScope.step=1;

	   $scope.getenumdata=function(){ 
       
	   	var url = 'https://oc-sample-dropdown.getsandbox.com/omnichannel/sample/select';
        
         	dataFactory.getData(url).success(function(data){
			 $scope.enumdata=data;
					

     	
     });

 };


          
$scope.selecttab=function(step1){

            
        $rootScope.step = step1;
    };
 
}
