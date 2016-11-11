'use strict';

/*
global app
*/

app.factory('bindingFactory', function(){

	var resourceToBindDirectory = resourceToBindDirectory || {} ;

	function _setResourceToBindDirectory(metamodel,  resourceToBind){
		if (metamodel){
			resourceToBindDirectory[metamodel] = resourceToBind;
		}
	}

	function _getResourceToBindDirectory(metamodel){
		return resourceToBindDirectory[metamodel];
	}


	return {
		'setResourceToBindDirectory': _setResourceToBindDirectory,
		'getResourceToBindDirectory': _getResourceToBindDirectory

	};
});