'use strict';

angular.module('omnichannel').factory('validationFactory',['bindingFactory','MetaModel', function(bindingFactory, MetaModel){

	

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
		'validatePropertiesByMetamodelName': _validatePropertiesByMetamodelName
	};
}]);