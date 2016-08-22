var hypermedia = require("hypermedia.js");
var partySchema =   {
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
                    };
var addressSchema =  {  "required": [
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
};

var emailSchema = {     "required": [
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
};
var contactSchema = {   "required": [
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
                            
};

var _parties = {
    "_page":  {
                "type": "number"
        },
    "_limit":  {
                "type": "number"
    },                                    
    "_parties": { 
    "_link": hypermedia.hypermediaSchema(),
    "parties": partySchema
    }
};

var _addresses = {
    "_page":  {
                "type": "number"
        },
    "_limit":  {
                "type": "number"
    },
    "_addresses": { 
    "_link": hypermedia.hypermediaSchema(),
    "addresses": addressSchema
    }
};

var _emails = {
    "_page":  {
                "type": "number"
        },
    "_limit":  {
                "type": "number"
    },
    "_emails": { 
    "_link": hypermedia.hypermediaSchema(),
    "addresses": emailSchema
    }
};

var _contacts = { 
    "_page":  {
                "type": "number"
        },
    "_limit":  {
                "type": "number"
    },
    "_contacts": { 
    "_link": hypermedia.hypermediaSchema(),
    "contacts": contactSchema
    }
};
exports.partySchema = function () {
                return {"parties": partySchema};
};
exports.addressSchema = function () {
                return {"addresses": addressSchema};
};
exports.emailSchema = function () {
                return {"emails": emailSchema};
};
exports.contactSchema = function () {
                return {"contacts": contactSchema};
};

exports.partyHypermediaSchema = function () {
                return _parties;
                
};
exports.addressHypermediaSchema = function () {
                return _addresses;
};
exports.emailHypermediaSchema = function () {
                return _emails;
};
exports.contactHypermediaSchema = function () {
                return _contacts;
};