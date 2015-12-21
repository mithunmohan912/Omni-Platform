


//resource with Meta model retrieved from REST API
app.factory("CanvasMetaModel", function($resource, $rootScope){
	return {
		resource :function(screenId){
		var sliceURIParam = $rootScope.listURI.GetMetaModelURI;
		sliceURIParam = sliceURIParam.replace("/{name}","");
		var url = $rootScope.listURI.ApplicationURL + sliceURIParam + '/' +screenId; //REST API url
			return $resource(url);
		}
	};
});


app.factory("GridMetaData", function($resource, $rootScope, $http) {

	
	this.load = function(gridId, onSuccess) {
		
		
		
		
		/*$resource("../../gridmetadata/" + gridId).get(function(gridMetaData) {
			
			$rootScope.gridColumnDefs = gridMetaData.gridMetaData.element;
			$rootScope.gridTitle = gridMetaData.gridMetaData.title;
			$rootScope.gridFunction = gridMetaData.gridMetaData.operation.jsfunction;

			$rootScope.gridData = [];
			if(onSuccess) {
				onSuccess(gridMetaData);
			}
		})/;*/
	};

	return this;
});



app.factory("GridData", function($resource, $rootScope) {

	this.fetch = function(gridId, gridMetaData, onSuccess) {
		
		var params = gridMetaData.dataSource.params;
		var gridpayload = {};
		
		if(gridMetaData.dataSource.type == "GRIDSQL") {
			params = params.split(",");
			for (var i=0; i<params.length; i++) {
				var param = params[i];
				gridpayload[param] = $rootScope.data[param];
			}
		} else if(gridMetaData.dataSource.type == "GRIDSPSEARCH") {
			gridpayload = $rootScope.data;
			gridpayload.MAXRECORDS="030";
		} else if(gridMetaData.dataSource.type == "GRIDSPLIST") {
			gridpayload = $rootScope.actionPayLoad;
			gridpayload.maxKeySize = gridMetaData.dataSource.maxKeySize;
		}
		

		$resource("../../griddata/"+gridId).save(angular.toJson({"payLoad":gridpayload}), function(data) {

			$rootScope.gridData = data.rows;
			if(onSuccess) {
				onSuccess(data);
			}
		});
  	};

	return this;
});
