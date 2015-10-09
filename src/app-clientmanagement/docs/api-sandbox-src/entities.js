var partySchema = {
                    "parties": {
                        "required": [
                            "firstName",
                            "lastName",
                            "type",
                            "dob",
                            "gender",
                        "maritalStatus"
                        ],
                        "type" : "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "middleName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            },
                            "title": {
                                "type": "string"
                            },
                            "dob": {
                                "type": "string"
                            },
                            "gender": {
                                "type": "string"
                            },
                            "maritalStatus": {
                                "type": "string"
                            },
                            "addresses": [ {
                                    "required": [
                                        "address",
                                        "postalCode",
                                        "city",
                                        "state",
                                        "country"
                                    ],
                                    "type" : "array",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "address": {
                                            "type": "string"
                                        },
                                        "postalCode": {
                                            "type": "string"
                                        },
                                        "city": {
                                            "type": "string"
                                        },
                                        "state": {
                                            "type": "string"
                                        },
                                        "country": {
                                            "type": "string"
                                        }
                                    }   
                                }
                            ],
                            "emails": [ {
                                    "required": [
                                        "email"
                                    ],
                                    "type" : "array",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "email": {
                                            "type": "string"
                                        },
                                        "email_type": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ],
                            "contacts": [ {
                                    "required": [
                                        "contact_number"
                                    ],
                                    "type" : "array",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "contact_number": {
                                            "type": "number"
                                        },
                                        "contact_type": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
};
var addressSchema =  { "addresses":  {
                                    "required": [
                                        "address",
                                        "postalCode",
                                        "city",
                                        "state",
                                        "country"
                                    ],
                                    "type" : "object",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "address": {
                                            "type": "string"
                                        },
                                        "postalCode": {
                                            "type": "string"
                                        },
                                        "city": {
                                            "type": "string"
                                        },
                                        "state": {
                                            "type": "string"
                                        },
                                        "country": {
                                            "type": "string"
                                        }
                                    }   
                                    }    
                            };

var emailSchema = {  "emails": {
                                    "required": [
                                        "email"
                                    ],
                                    "type" : "object",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "email": {
                                            "type": "string"
                                        },
                                        "email_type": {
                                            "type": "string"
                                        }
                                    }
                                }
               
};
var contactSchema = { "contacts":  {
                                    "required": [
                                        "contact_number"
                                    ],
                                    "type" : "object",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "contact_number": {
                                            "type": "number"
                                        },
                                        "contact_type": {
                                            "type": "string"
                                        }
                                    }
                                }
                            
};

exports.partySchema = function () {
                return partySchema;
};
exports.addressSchema = function () {
                return addressSchema;
};
exports.emailSchema = function () {
                return emailSchema;
};
exports.contactSchema = function () {
                return contactSchema;
};