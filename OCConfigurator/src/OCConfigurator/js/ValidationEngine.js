
var ValidationRules = {};

function validateRules(form) {

	// Fetch validation rules
	if (!ValidationRules[form.id]) {
		jQuery.ajax({
			async : false,
			url : "../../rules/validation/" + form.id,
			type : "GET",
			success : function(rules) {
				if(rules){
					ValidationRules[form.id] = angular.fromJson(rules);
				}
			}
		});
	}
	
	var validationRule = ValidationRules[form.id];
	var errMsg = [];
	if (validationRule) {
			
		var formFieldArray = [];
		
		
		// validate
		var data = form;
		for(var valInd = 0 ; valInd < validationRule.validations.length; valInd ++){
			
			var validation = validationRule.validations[valInd];
			var validationOperation = validation.operation;
		
			var errorMessage = validation.error;
			var swtch = false;
		
			if (validationOperation == 'and') { 
				// all the list of fields in validation JSON should be non empty.
		
				for ( var i = 0; i < validation.fields.length; i++) {
		
					formFieldArray[i] = data[validation.fields[i]].value;
		
				}
		
				for ( var k = 0; k < formFieldArray.length; k++) {
					if (formFieldArray[k] == "") {
						swtch = true;
					}
				}
		
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			} else if (validationOperation == 'or') { 
				// Atleast one of the field from the list in validation JSON should be non empty.
				
				for ( var i = 0; i < validation.fields.length; i++) {
		
					formFieldArray[i] = data[validation.fields[i]].value;
		
				}
		
				var totalFields = formFieldArray.length;
				var count = 0;
		
				for ( var k = 0; k < formFieldArray.length; k++) {
					if (formFieldArray[k] == "") {
						count++;
		
					}
		
				}
				if (totalFields == count) {
					swtch = true;
				}
		
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			} else if (validationOperation == 'xor') {
				// If atleast one of the field in first set is non empty, then all the fields of second set must be empty
		
				count = 0;
				var firstGroupFieldArray = [];
				var secondGroupFieldArray = [];
		
				for ( var i = 0; i < validation.fields[0].length; i++) {
					firstGroupFieldArray[i] = data[validation.fields[0][i]].value;
		
				}
		
				for ( var j = 0; j < validation.fields[1].length; j++) {
					secondGroupFieldArray[j] = data[validation.fields[1][j]].value;
		
				}
		
				for ( var x = 0; x < firstGroupFieldArray.length; x++) {
		
					if (firstGroupFieldArray[x] == "") {
						count++;
					}
		
				}
				if (count == (firstGroupFieldArray.length)) {
					
				} else {
		
					for ( var y = 0; y < secondGroupFieldArray.length; y++) {
		
						if (!secondGroupFieldArray[y] == "") {
							swtch = true;
						}
		
					}
				}
		
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			} else if (validationOperation == 'xor-e') {
				// if all the fields of first set are non empty, then all the fields of second set must be empty
		
				count = 0;
				var firstGroupFieldArray = [];
				var secondGroupFieldArray = [];
		
				for ( var i = 0; i < validation.fields[0].length; i++) {
					firstGroupFieldArray[i] = data[validation.fields[0][i]].value;
		
				}
		
				for ( var j = 0; j < validation.fields[1].length; j++) {
					secondGroupFieldArray[j] = data[validation.fields[1][j]].value;
		
				}
		
				for ( var x = 0; x < firstGroupFieldArray.length; x++) {
		
					if (firstGroupFieldArray[x] == "") {
						
					} else {
						count++;
					}
		
				}
				if (count == (firstGroupFieldArray.length)) {
		
					for ( var y = 0; y < secondGroupFieldArray.length; y++) {
		
						if (!secondGroupFieldArray[y] == "") {
							swtch = true;
						}
		
					}
				}else{
					break;
				}
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			} else if (validationOperation == 'mc') {
				// if field of first set is non empty, field of second set must be non empty.
				
				for ( var i = 0; i < validation.fields.length; i++) {
		
					formFieldArray[i] = data[validation.fields[i]].value;
		
				}
				count = 0;
				var firstGroupFieldArray = [];
				var secondGroupFieldArray = [];
				firstGroupFieldArray = validation.fields[0];
				secondGroupFieldArray = validation.fields[1];
				for ( var x = 0; x < firstGroupFieldArray.length; x++) {
					var firstGroupFieldValue = data[firstGroupFieldArray[x]].value;
					if (firstGroupFieldValue == "") {
						
					} else {
						count++;
					}
		
				}
				if (count == (firstGroupFieldArray.length)) {
					for ( var y = 0; y < secondGroupFieldArray.length; y++) {
						var secondGroupFieldValue = data[secondGroupFieldArray[y]].value;
						if (secondGroupFieldValue == "") {
							swtch = true;
						}
		
					}
				}else{
					break;
				}
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			}// end mc
		}//end of for loop
	}
	
	if (errMsg[0]) {
		showMessage(errMsg[0], "20");
		return false;
	}
	
	return true;
}

function showMessage(message, severity) {
	

	var zindex = parseInt($('.modal').css('z-index')) + 1;
	$("#errorPopup").removeClass("alert-error");
	$("#errorPopup").removeClass("alert-warning");
	$("#errorPopup").removeClass("alert-info");

	$("#errorIcon").removeClass("icon-remove-sign");
	$("#errorIcon").removeClass("icon-warning-sign");
	$("#errorIcon").removeClass("icon-info-sign");
	
	if(severity =="30") {
		$("#errorPopup").addClass( "alert-error" ); 
		$("#errorIcon").addClass( "icon-remove-sign" );

	} else if(severity =="20") {
		$("#errorPopup").addClass( "alert-warning" ); 
		$("#errorIcon").addClass( "icon-warning-sign" );
	
	} else {
		$("#errorPopup").addClass( "alert-info" ); 
		$("#errorIcon").addClass( "icon-info-sign" );
	}
	
	$("#errorMessage").html( message );
	$("#errorPopup").css('z-index',zindex);
	$("#errorPopup").show();
}

function hideMessage() {
	$("#errorPopup").hide();
}


function validateRequiredField(field) {
	
	var valid = true;
	
	field = $(field);
	if (field.attr('ux-required') == "required") {
		valid = field.val().trim().length > 0;
		if (valid) {
			field.removeClass("required");
		} else {
			field.addClass("required");
		}
	}
	return valid;
}

function validateRegularExp(field) {

	var valid = true;
	
	field = $(field);
	var regexp = field.attr('ux-regexp');
	if (regexp != "") {
		valid = new RegExp(regexp).test(field.val());
		if (valid) {
			field.removeClass("invalid-regexp");
		} else {
			field.addClass("invalid-regexp");
		}
	}

	return valid;
}

function validateField(field) {
	
	validateRequiredField(field);
	validateRegularExp(field);
}

function validateFields() {
	
	var fields = document.forms[0].elements;
	
	for ( var i = 0; i < fields.length; i++) {
		validateField(fields[i]);
	}
}

function validateForm(form) {
	
	var fields = form.elements;
	
	for ( var i = 0; i < fields.length; i++) {
		
		if (!validateRequiredField(fields[i])) {
			showMessage("Complete all the required fields", "30");
			return false;
		}

		if (!validateRegularExp(fields[i])) {
			showMessage("Fill up all the fields in proper format.", "30");
			return false;
		}
	}

	return true;
}

function disableField(field) {
	
	field = $(field);
	if (field.attr('ux-disabled') == "true") {
		field.prop('readonly',true);
	}
}

function disableFields() {
	
	var fields = document.forms[0].elements;
	
	for ( var i = 0; i < fields.length; i++) {
		disableField(fields[i]);
	}
}