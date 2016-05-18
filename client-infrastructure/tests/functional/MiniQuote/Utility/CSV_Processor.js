const fs = require('fs');
var csv = require("fast-csv");

var CSV_Processor = function() {
	this.data;
	this.fileName;
	this.testCaseName;
	this.newStepIndex = 0; // Global variable For Writing performance into CSV 
	this.tempPerf = [];    // Global variable For Writing performance into CSV 
}

/*CSV_Processor.prototype.initialize = function (data) {
  this.data = data;
  this.fileName;
}
CSV_Processor.prototype.initialize = function (fileName) {
 		this.fileName = fileName;
}
*/

CSV_Processor.prototype.initialize = function (fileName,testCaseName) {
	this.fileName = fileName ;
	this.testCaseName = testCaseName;
}
CSV_Processor.prototype.initData = function (data) {
	this.data = data ;		
}

CSV_Processor.prototype.showData = function () {
	console.log("fileName : "+this.fileName+" :: testCaseName"+ this.testCaseName);
}

CSV_Processor.prototype.readDatafromFile = function (callback) {
	var stream = fs.createReadStream(this.fileName);	
	var streamObject = csv.fromStream(stream, {headers : true});
	var completeData = [];
	streamObject.on("data", function(data){
		completeData.push(data);
	})
	.on("end", function(){
		this.data = completeData ;
		callback(completeData);
				 	//initData(completeData)
				 });
}

CSV_Processor.prototype.filterData = function (columnName) {

	var testCaseName = this.testCaseName;

	var result;
	if(this.data){
		result = this.data.filter(function(row){
			return row.TestName === testCaseName ;
		})[0][columnName];
	}
	return result;
}

CSV_Processor.prototype.buildPerfMetrics = function(param){
	var currentSpec = param.currentSpec;
	var captureTime = param.captureTime;
	var headers = param.headers;
	var perfMetric = param.perfMetric;

	var iteration="";
	var row = {};


	if(headers.length === 0){    
		iteration = "Test - 1";
		row["TestStep"] = currentSpec;
		row[iteration]  = captureTime;
		perfMetric.push(row);
	}else{
		this.newStepIndex++;
		var isAvail = false;
		iteration = "Test - "+ (headers.length);
		for(var i=0;i<perfMetric.length;i++){
			if(perfMetric[i].TestStep === currentSpec){           
				perfMetric[i][iteration] = captureTime ; 
				isAvail = true;
			}
		}
		if(!isAvail){
			this.tempPerf = [];
			row["TestStep"] = currentSpec;
			row[iteration] = captureTime;          
			if(this.newStepIndex > perfMetric.length){
				for(var i=0;i<perfMetric.length;i++){
					this.tempPerf.push(perfMetric[i]);
				}
				this.tempPerf.push(row);
			}else{
				for(var i=0;i<(this.newStepIndex-1);i++){
					this.tempPerf.push(perfMetric[i]);
				}
				this.tempPerf.push(row);
				for(var i=(this.newStepIndex-1);i<perfMetric.length;i++){
					this.tempPerf.push(perfMetric[i]);
				}
			}
			perfMetric = this.tempPerf;
		}
	}

	return perfMetric;
}

CSV_Processor.prototype.getHeaderArray = function(callback){
	var perfFileName  = this.fileName;
	var stream = fs.createReadStream(perfFileName);	
	var streamObject = csv.fromStream(stream, {headers : true});
	var completeData = [];
	streamObject.on("data", function(data){
		completeData.push(data);
	})
	.on("end", function(){
		var headerArray = [];
		for(var i=0;i<completeData.length;i++){
			var tempJson = completeData[i];
			for(var key in tempJson){
				var attrName = key;
				var isAvail=false;
				for(var j =0;j<headerArray.length;j++){
					if(headerArray[j]==attrName){
						isAvail = true;
					}
				}
				if(!isAvail){
					headerArray.push(attrName);
				}
			}
		}
		callback(headerArray)
	})
}

CSV_Processor.prototype.addHeader = function(){
	var perfFileName  = this.fileName;
	var stream = fs.createReadStream(perfFileName);	
	var streamObject = csv.fromStream(stream, {headers : true});
	var completeData = [];
	streamObject.on("data", function(data){
		completeData.push(data);
	})
	.on("end", function(){
		var writtableJson = [];
		var headerArray = [];
		for(var i=0;i<completeData.length;i++){
			var tempJson = completeData[i];
			for(var key in tempJson){
				var attrName = key;
				var isAvail=false;
				for(var j =0;j<headerArray.length;j++){
					if(headerArray[j]==attrName){
						isAvail = true;
					}
				}
				if(!isAvail){
					headerArray.push(attrName);
				}
			}
		}
		headerArray.push( (headerArray.length) + " Test")
		writtableJson.push(headerArray);


		for(var i=0;i<completeData.length;i++){
			var csvRow = completeData[i];  
			var tempArray = [];
			for(var j =0 ;j<headerArray.length;j++){

				tempArray.push(csvRow[headerArray[j]]);
			}
			writtableJson.push(tempArray);
		}
		console.log(perfFileName)
		var ws = fs.createWriteStream(perfFileName);
		csv
		.write(writtableJson, {headers: true})
		.pipe(ws);

	});	

}

CSV_Processor.prototype.writeData = function(data){
	
	var perfFileName = this.fileName ; 
	var ws = fs.createWriteStream(perfFileName);
	csv
	.write(data, {headers: true})
	.pipe(ws);
}




var previousDate = function(backDays){
	var d = new Date();
	d.setDate(d.getDate()-backDays);
	return {
		"dd" : d.getDate(),
		"mm" : (d.getMonth()+1),
		"yyyy": d.getFullYear()
	}
}

module.exports = CSV_Processor;