'use strict';
/*
global app 
*/

app.service('DataMappingService', function() {
    this.map = function($scope) {
		// Simply this and make it generic
      $scope.data['parties.firstName']=$scope.data.parties.firstName;
	  $scope.data['parties.lastName']=$scope.data.parties.lastName;
	  $scope.data['parties.gender']=$scope.data.parties.gender;
	  $scope.data['parties.maritalStatus']=$scope.data.parties.maritalStatus;
	  $scope.data['parties.middleName']=$scope.data.parties.middleName;
	  $scope.data['parties.title']=$scope.data.parties.title;
	  $scope.data['parties.type']=$scope.data.parties.type;
	  $scope.data['parties.dob']=$scope.data.parties.dob;
					  
	 $scope.data['addresses.address']=$scope.data.parties.addresses.address;
	  $scope.data['addresses.city']=$scope.data.parties.addresses.city;
	  $scope.data['addresses.country']=$scope.data.parties.addresses.country;
	  $scope.data['addresses.state']=$scope.data.parties.addresses.state;

	  $scope.data['contacts.contact_number']=$scope.data.parties.contacts.contact_number;
	  $scope.data['contacts.contact_type']=$scope.data.parties.contacts.contact_type;

	  $scope.data['emails.email_type']=$scope.data.parties.emails.email_type;
	  $scope.data['emails.email']=$scope.data.parties.emails.email; 
    };
	
    return this;
});

