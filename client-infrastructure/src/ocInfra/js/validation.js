'use strict';

angular.module('omnichannel').factory('validationFactory',['bindingFactory','MetaModel','$rootScope', 'growl', function(bindingFactory, MetaModel, $rootScope, growl){

	function _isNextStepValid(scope,currentStep){
        var mandatoryFields = _loadRequiredField(scope, currentStep);
        var emptyField = [];
        var message = '';
        var valid = true;
        if(mandatoryFields){
            for(var i=0, j=0;i<mandatoryFields.length;i++){
                var query = '#elementName';
                query = query.replace('elementName',mandatoryFields[i]);
                query = query.replace(':','\\:');
                var val = angular.element($(query)).val();
                if(!val || val === '?'){
                    emptyField[j] = mandatoryFields[i];
                    j++;
                    valid = false;
                }
            }
	        if(emptyField.length > 0){
	        	console.log(emptyField.length);
	            emptyField.forEach(function(key) {
	                message += key + ' is required </br>';
	            });
	            var msg = growl.error(message);
	            msg.setText(message);
	        }
        }
        return valid;               
    }
           
    function _loadRequiredField(scope, currentStep){
        var mandatoryField = [];
        var arrparent;
        try{
            if(currentStep.id){
        		arrparent = $rootScope.metamodel[currentStep.id].sections;
            }else{
            	arrparent = $rootScope.metamodel[$rootScope.screenId].sections;
            }
            for(var i = 0; i < arrparent.length; i++){
              	var arr = arrparent[i].properties;
              	for(var j = 0; j < arr.length; j++){
                  	var object = arr[j];
                  	if(object.required !== undefined && object.required === 'required'){
                      	mandatoryField.push(object.id[0]);
                  	} else {
                    	var results = scope.resultSet;
                     	for(var key in results){
                     		var properties = results[key].properties;
                     		for(var prop in properties){
                     			if(properties[prop].required === true && prop === object.id[0]){
                     				mandatoryField.push(prop);
                     			}
                     		}
                     	}
                  	}	
              	}
            }
        }
        catch(e){
            console.log(e);
        }
		return mandatoryField;
    }

	function _validatePropertiesByMetamodelName(metamodelName){

		var status = false;
		if (typeof metamodelName !== 'undefined' && !_.isEmpty(metamodelName)){
			return _isValid(metamodelName);
		}

		return status;
	}

	function _isValid(metamodelName){
	    //var deferred = $q.defer();

		var metamodelProperties =  MetaModel.loadProperties(metamodelName);



		if (metamodelProperties.then){

				metamodelProperties.then(function(response){
				var sections = typeof response.metamodel !== 'undefined'?response.metamodel.sections: response.sections;
				var propertiesBound = bindingFactory.getResourceToBindDirectory(metamodelName);
				if (!propertiesBound){
					return false;
				}else{
					return _validateProperties(sections, propertiesBound.properties);
				}
				
				
			//deferred.resolve(status); 
			});	
		}else{
				var sections = metamodelProperties.sections;
				var propertiesBound = bindingFactory.getResourceToBindDirectory(metamodelName);
				if (!propertiesBound){
					return false;
				}else{
					return _validateProperties(sections, propertiesBound.properties);
				}
		}

		

		//status = deferred.promise;

		//return $q.when(status);

	}

	function _validateProperties(sections,propertiesBound){

		var status = true;

			if (typeof propertiesBound !== 'undefined' && typeof sections !== 'undefined' && !_.isEmpty(propertiesBound)  && !_.isEmpty(sections)){

				sections.forEach(function(section) {

						if (section.type!=='reference'){
							if (section.properties) {
			                    section.properties.forEach(function(property){
			                    	
			 						var ids = property.id;
			 						if(!Array.isArray(ids)){
			 							ids = [ids];
			 						}
			 						ids.forEach(function(id){
			 							if (propertiesBound[id]){
			 								status = status || false;
				 							status = status && typeof propertiesBound[id].consistent !== 'undefined'? propertiesBound[id].consistent : 
				 							(!propertiesBound[id].consistent && propertiesBound[id].metainfo.uiInput?true:false);

				 							if (!status){
				 								return false;
				 							}
				 						}
			 						});
				 				});
							}
						}else{
							_isValid(section.$ref);							
						}
				});
		}else{
			return false;
		}		

		return status;

	}
	return {
		'validateProperties': _validateProperties,
		'validatePropertiesByMetamodelName': _validatePropertiesByMetamodelName,
		'isNextStepValid': _isNextStepValid,
		'loadRequiredField':_loadRequiredField
	};
}]);