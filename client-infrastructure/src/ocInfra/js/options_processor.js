'use strict';

/*
exported optionsProcessor
*/

function optionsProcessor($rootScope,$scope, reqParm,params,action,url,payLoad,objectName){	

	 if(action==='search'){
		var searchOption= [];	
		var optionsDat = $rootScope.optionData[url];
		console.log('datacall of url'+optionsDat);
		if($rootScope.optionData!==undefined && $rootScope.optionData[url]!== undefined) {
		angular.forEach($rootScope.optionData,function(value){

		if(value.rel==='search'){
				searchOption.push(value);
			}
		 });			
			
	    objectName=reqParm.replace('search','');
		angular.forEach(searchOption, function(value){
		var object=value.schema[objectName];	
		var requiredVariables= object.required;		
			angular.forEach(requiredVariables, function(value){
			var field = objectName.concat('.').concat(value);	
			params[value]	=$scope.data[field];
			});		
			
	     });		
		}
	 } else if(action==='submit'){
			var options= [];		
			angular.forEach($rootScope.optionData[url], function(value){
			if((value.rel==='create')||(value.rel==='update'&& value.method==='PATCH')){
				options.push(value);
			}});			
			
			objectName=reqParm.replace('Detail','');
			angular.forEach(options, function(value){
				var object=value.schema[objectName];	
				var requiredVariables= object.required;		
				angular.forEach(requiredVariables, function(value){
				var field = objectName.concat('.').concat(value);	
				payLoad[value]	=$scope.data[field];
				});	
				
				 angular.forEach(object.properties, function(value, key){
				 var objProperty = object.properties[key];
				 if(Array.isArray(objProperty)) {
					  var subRequiredObj= objProperty[0];
					  var subobj	=[];
					  var subRequiredObjVariables= subRequiredObj.required;		
					  angular.forEach(subRequiredObjVariables, function(value){
							var field = key.concat('.').concat(value);	
							subobj[value]=$scope.data[field];
						});	
					 payLoad[key]	=subobj;	
				 }
				 });	

			});		
	 }
	 
}


