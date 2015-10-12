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
		/*			  
	  $scope.data['address.address']=$scope.data.parties.addresses[0].address;
	  $scope.data['address.city']=$scope.data.parties.addresses[0].city;
	  $scope.data['address.country']=$scope.data.parties.addresses[0].country;
	  $scope.data['address.state']=$scope.data.parties.addresses[0].state;

	  $scope.data['contacts.contact_number']=$scope.data.parties.contacts[0].contact_number;
	  $scope.data['contacts.contact_type']=$scope.data.parties.contacts[0].contact_type;

	  $scope.data['email.email_type']=$scope.data.parties.emails[0].email_type;
	  $scope.data['email.email']=$scope.data.parties.emails[0].email; */
    };
	
    return this;
});

