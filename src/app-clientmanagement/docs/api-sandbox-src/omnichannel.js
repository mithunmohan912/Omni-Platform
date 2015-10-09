var utility = require("utility.js");
var entities = require("entities.js");
state.partiesList = state.partiesList || [];
var baseUrl = "https://oc-infraapis.getsandbox.com/omnichannel/v1/parties";
var nodeName = "";
var selectedItem = selectedItem || [];
var item = item || [];
var finalItem = finalItem || [];
var size = 20;
var startPoint = 0;
var endPoint = 0;
var selfArray = selfArray || [];
var upArray = upArray || [];
var nextArray = nextArray || [];
var url;
var nextPage = 2;
var prevPage = 0;
/*
 * POST /omnichannel/v1/parties
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 */
exports.postOmnichannelV1Parties = function(req, res) {
    var partyObj = req.body;
	if (req.validationErrors()) {
        return res.json(400, req.validationErrorsJson());
    }
    utility.handleCORS(req, res);
    partyObj.id = utility.randomString();
    state.partiesList.push(partyObj);
	res.status(201);
	res.json(partyObj);
};

/*
 * GET /omnichannel/v1/parties
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * firstName(type: string) - query parameter - first name of client.
 * lastName(type: string) - query parameter - last name of client.
 * dob(type: string) - query parameter - date of birth of client.
 * _limit(type: integer) - query parameter - tags to filter Clinets.
 * _page(type: integer) - query parameter - tags to filter Clinets.
 */
exports.getOmnichannelV1Parties = function(req, res) {
	if (req.query._limit !== undefined) {
	    size = req.query._limit;
	}
	if (req.query._page !== undefined) {
	    startPoint =  size * (req.query._page-1);
	    nextPage = 1 + Number(req.query._page);
	    prevPage = Number(req.query._page) - 1;
	}
	endPoint = Number(startPoint)+Number(size);
	utility.handleCORS(req, res);
	if(req.query.firstName === undefined && req.query.lastName === undefined) {
	   if (req.query.dob === undefined) {
	        res.status(400);
            return res.json({
                "message": "invalid parameters"});
	   }
	   else {
	        req.checkQuery('dob', 'Invalid parameter:dob').notEmpty(); 
	        selectedItem = (_.filter(state.partiesList, {
	        'dob': req.query.dob,
	        })).slice(startPoint,endPoint);
	 
	        url = baseUrl + "?dob=" + req.query.dob + "&_page="+ nextPage + "&_limit=" + size;
	        nextArray = {
	         "href" : url,
	         "name" : "Next URL"
	        };
	       if (prevPage > 0 ) {
	            upArray = {
	            "href" : baseUrl + "?dob=" + req.query.dob + "&_page="+ prevPage + "&_limit=" + size,
	            "name" : "Previous URL"
	           };  
	        }
	   }
	} else {
	    req.checkQuery('firstName', 'Invalid parameter:firstName').notEmpty();
	    req.checkQuery('lastName', 'Invalid parameter:lastName').notEmpty(); 
	    selectedItem = (_.filter(state.partiesList, {
	        'firstName': req.query.firstName,
	        'lastName': req.query.lastName
    	    })).slice(startPoint,endPoint);
    	    
    	    url = baseUrl + "?firstName=" + req.query.firstName + "&lastName=" + req.query.lastName + "&_page="+ nextPage + "&_limit=" + size;
	        nextArray = {
	         "href" : url,
	         "name" : "Next URL"
	        };
	        if (prevPage > 0 ) {
	            upArray = {
	            "href" : baseUrl + "?firstName=" + req.query.firstName + "&lastName=" + req.query.lastName + "&_page="+ prevPage + "&_limit=" + size,
	            "name" : "Previous URL"
	           };  
	        }
	}
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	if (selectedItem.length === 0) {
	    res.status(400);
            res.json({
                "message": "Parties details not found"
            });
	} else {
	    for (i=0; i< selectedItem.length; i++) {
	     url = baseUrl + "/" + selectedItem[i].id;
	     nodeName = selectedItem[i].id;
	     selfArray = {
	         "href" : url,
	         "name" : nodeName
	     };
	     item[i] = {
	       "_link" : {"self": selfArray},
	       "parties" : selectedItem[i] 
	     };
	   }
	   selfArray = {
	         "href" : baseUrl,
	         "name" : "Base URL"
	    };
	    
	    if (prevPage > 0 ) {
	        finalItem =  {
	            "_link" : { "self" : selfArray,
	                    "next" : nextArray,
	                    "prev" : upArray},
	            "item"  : item            
	        };
	    } else {
	        finalItem =  {
	            "_link" : { "self" : selfArray,
	                    "next" : nextArray },
	            "item"  : item            
	        };
	    }     
	    res.status(200);
 	    res.json(finalItem);
	}
};

/*
 * OPTIONS /omnichannel/v1/parties
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 */
exports.optionsOmnichannelV1Parties = function(req, res) {
	    finalItem = {
        	        "title" : "APIs for basic operations of parties",
                    "link": [ {
                        "rel"   : "create",
                        "title" : "Create a party",
                        "href"  : baseUrl,
                        "method": "POST",
                        "schema":  entities.partySchema()
                     },
                     {
                        "rel"   : "search",
                        "title" : "Search parties by firstname and last name",
                        "href"  : baseUrl,
                        "method": "GET",
                        "schema":  {
                                "parties": {
                                  "required": [
                                    "firstName",
                                    "lastName",
                                  ],
                                  "type": "object",
                                  "properties": {
                                    "firstName": {
                                      "type": "string"
                                    },
                                    "lastName": {
                                      "type": "string"
                                    },
                                    "_page": {
                                        "type": "interger"
                                    },
                                    "_limit": {
                                        "type": "interger"
                                    }
                                 }
                            } 
                        }    
                     },     
                     {
                        "rel"   : "search",
                        "title" : "Search parties by dob",
                        "href"  : baseUrl, 
                        "method": "GET",
                        "schema":  {
                                "parties": {
                                  "required": [
                                    "dob"
                                  ],
                                  "type": "object",
                                  "properties": {
                                    "dob": {
                                      "type": "string"
                                    },
                                    "_page": {
                                        "type": "interger"
                                    },
                                    "_limit": {
                                        "type": "interger"
                                    }
                                 }
                            } 
                        }
                     }
                ]   
	    };
	    utility.handleCORS(req, res);
	    res.status(200);
        res.json(finalItem);
};

/*
 * OPTIONS /omnichannel/v1/parties/{id}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 */
exports.optionsOmnichannelV1Parties2 = function(req, res) {
        req.check('id', 'Invalid parameter').notEmpty();
        url = baseUrl + "/" + req.params.id;
        finalItem =  {
                "title" : "APIs for basic operations of parties",
                "links" : [ {
                            "rel"   : "fetch",
                            "title" : "Fetch the Party details",
                            "href"  : url,
                            "method": "GET"
                            },
                            {
                            "rel"   : "delete",
                            "title" : "Delete the Party details",
                            "href"  : url,
                            "method": "DELETE"
                            },
                            {
                            "rel"   : "update",
                            "title" : "Override the Party details",
                            "href"  : url,
                            "method": "PUT",
                            "schema" : entities.partySchema()
                            },
                            {
                            "rel"   : "update",
                            "title" : "Update the Party details",
                            "href"  : url,
                            "method": "PATCH",
                            "schema" : entities.partySchema()
                            }
            ]
        };
        utility.handleCORS(req, res);
	    res.status(200);
        res.json(finalItem);
};
/*
 * GET /omnichannel/v1/parties/{id}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - id of client.
 */
exports.getOmnichannelV1Parties2 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	utility.handleCORS(req, res);
	var selectedItem = _.find(state.partiesList, { 'id': req.params.id});
	if (selectedItem === undefined) {
            res.status(400);
            res.json({
                "message": "Party data not found"
            });
        } else {
            url = baseUrl + "/" + selectedItem.id;
	        nodeName = selectedItem.id;
	        selfArray = {
	             "href" : url,
	             "name" : nodeName
	        };
	        url = baseUrl;
	        nodeName = "url to move up";
	        
	        upArray = {
	             "href" : url,
	             "name" : nodeName
	        };
	        
	        item = {
	            "_link" : {
	                "self": selfArray, 
	                "up": upArray
	            },
	            "parties" : selectedItem
	        };
	        res.status(200);
 	        res.json(item);
    }
};

/*
 * PUT /omnichannel/v1/parties/{id}
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 * id(type: string) - path parameter - id of client.
 */
exports.putOmnichannelV1Parties = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	var partyObj = req.body;
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	utility.handleCORS(req, res);
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
	if (interceptPoint === undefined) {
        res.status(400);
        res.json({
            "message": "Party data not found"
        });
    } else {
        partyObj.id = req.params.id;
	    state.partiesList[interceptPoint] = partyObj;
	    res.status(201);
	    res.json(partyObj);
    }
};

/*
 * PATCH /omnichannel/v1/parties/{id}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - ID of client.
 */
exports.patchOmnichannelV1Parties = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	var partyObj = req.body;
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	utility.handleCORS(req, res);
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    if (interceptPoint === undefined) {
        res.status(400);
        res.json({
            "message": "Party data not found"
        });
    } else {
        var x;
        for(x in state.partiesList[interceptPoint]) {
            if (partyObj[x] === undefined) {
                partyObj[x] = state.partiesList[interceptPoint][x];
            }
        }
        partyObj.id = req.params.id;
	    state.partiesList[interceptPoint] = partyObj;
	    res.status(201);
	    res.json(partyObj);
    }
};

/*
 * DELETE /omnichannel/v1/parties/{id}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - id of client.
 */
exports.deleteOmnichannelV1Parties = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	utility.handleCORS(req, res);
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    if (interceptPoint === undefined) {
        res.status(400);
        res.json({
              "message": "Party data not found"
        });
    } else {
        state.partiesList.splice(interceptPoint, 1);
	    res.status(200);
	    res.json({"message": "Party data deleted .."});
    }
};

/*
 * POST /omnichannel/v1/parties/{id}/addresses
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 * id(type: string) - path parameter - client id of client.
 */
exports.postOmnichannelV1PartiesAddresses = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	var addressObj = req.body;
	if (req.validationErrors()) {
        return res.json(400, req.validationErrorsJson());
    }
    var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    if (interceptPoint === undefined) {
        res.status(400);
        res.json({
              "message": "Party data not found"
        });
    } else {
        utility.handleCORS(req, res);
        addressObj.id = utility.randomString();
        state.partiesList[interceptPoint].addresses.push(addressObj);
	    res.status(201);
	    res.json(addressObj);
    }
};

/*
 * GET /omnichannel/v1/parties/{id}/addresses
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * _limit(type: integer) - query parameter - tags to filter addresses.
 * _page(type: integer) - query parameter - tags to filter addresses.
 */
exports.getOmnichannelV1PartiesAddresses = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	if (req.query._limit !== undefined) {
	    size = req.query._limit;
	}
	if (req.query._page !== undefined) {
	    startPoint =  (req.query._page-1) * size;
	    nextPage = Number(req.query._page) + 1;
	    prevPage = Number(req.query._page) - 1;
	}
	endPoint = Number(startPoint)+Number(size);
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } 
        var len = (state.partiesList[interceptPoint].addresses).slice(startPoint,endPoint).length;
        if (len > 0) {
            for (j=0; j < len; j++,startPoint++) {    
            url = baseUrl + "/" + req.params.id + "/addresses/" + state.partiesList[interceptPoint].addresses[startPoint].id;
            nodeName = state.partiesList[interceptPoint].addresses[startPoint].id;
            selfArray = {
	            "href" : url,
	            "name" : nodeName
	            };
            item [j] = {
                "_link": {"self" : selfArray},
                "addresses": state.partiesList[interceptPoint].addresses[startPoint] 
                };
            }
            selfArray = {
	         "href" : baseUrl + "/" + req.params.id + "/addresses",
	         "name" : "Address URL"
	        };
	        nextArray = {
	         "href" : baseUrl + "/" + req.params.id + "/addresses?_page=" + nextPage + "&_limit=" + size,
	         "name" : "Next Address URL"
	        };
	        if (prevPage > 0 ) {
	            upArray = {
	                "href" : baseUrl + "/" + req.params.id + "/addresses?_page=" + prevPage + "&_limit=" + size,
	                "name" : "Previous Address URL"
	            };  
	            finalItem =  {
	                "_link" : { "self" : selfArray,
	                            "next" : nextArray, 
	                            "prev" : upArray
	                            },
	                "item"  : item            
	            };
	        } else  {
	            finalItem =  {
	                "_link" : { "self" : selfArray,
	                            "next" : nextArray},
	                "item"  : item            
	            };
	        }
            res.status(200);
            res.json(finalItem);
            } else {
                    res.status(400);
                    res.json({
                    "message": "Address not present"
                }); 
        }
};

/*
 * OPTIONS /omnichannel/v1/parties/{id}/addresses
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 */
exports.optionsOmnichannelV1PartiesAddresses = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	url = baseUrl + "/" + req.params.id + "/addresses";
	    finalItem = {
        	        "title" : "APIs for basic operations of address",
                    "link": [ {
                        "rel"   : "create",
                        "title" : "Create a Address",
                        "href"  : url,
                        "method": "POST",
                        "schema": entities.addressSchema()
                     },
                     {
                        "rel"   : "search",
                        "title" : "Search a list of addresses associated to a party",
                        "href"  : url,
                        "method": "GET",
                        "schema":  {
                                "addresses": {
                                  "type": "object",
                                  "properties": {
                                    "_page": {
                                        "type": "interger"
                                    },
                                    "_limit": {
                                        "type": "interger"
                                    }
                                 }
                            } 
                        }
                     }
                ]   
	    };
	    utility.handleCORS(req, res);
	    res.status(200);
        res.json(finalItem);
};
/*
 * OPTIONS /omnichannel/v1/parties/{id}/addresses/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 */
exports.optionsOmnichannelV1PartiesAddresses2 = function(req, res) {
        req.check('id', 'Invalid parameter').notEmpty();
	    req.check('id1', 'Invalid parameter').notEmpty();
        url = baseUrl + "/" + req.params.id + "/addresses/" + req.params.id1;
        finalItem =  {
                "title" : "APIs for basic operations of address",
                "links" : [ {
                            "rel"   : "fetch",
                            "title" : "Fetch the Address details",
                            "href"  : url,
                            "method": "GET"
                            },
                            {
                            "rel"   : "delete",
                            "title" : "Delete the Address details",
                            "href"  : url,
                            "method": "DELETE"
                            },
                            {
                            "rel"   : "update",
                            "title" : "Override the Address details",
                            "href"  : url,
                            "method": "PUT",
                            "schema" : entities.addressSchema()
                            },
                            {
                            "rel"   : "update",
                            "title" : "Update the Address details",
                            "href"  : url,
                            "method": "PATCH",
                            "schema" : entities.addressSchema()
                            }
            ]
        };
        utility.handleCORS(req, res);
	    res.status(200);
        res.json(finalItem);
};

/*
 * GET /omnichannel/v1/parties/{id}/addresses/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - address id of address.
 */
exports.getOmnichannelV1Parties3 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } else {
                selectedItem = _.find(state.partiesList[interceptPoint].addresses, {
                'id' : req.params.id1
            });
            if (selectedItem === undefined) {
                res.status(400);
                res.json({
                "message": "Address not present"
                });
            } else  {
                url = baseUrl + "/" + state.partiesList[interceptPoint].id + "/addresses/" + selectedItem.id;
	            nodeName = selectedItem.id;
	            selfArray = {
	                "href" : url,
	                "name" : nodeName
	            };
	            url = baseUrl + "/" + state.partiesList[interceptPoint].id + "/addresses";
	            nodeName = "url to move up";
	            upArray = {
	               "href" : url,
	               "name" : nodeName
	            };
                
                item = {
	            "_link" : {
	                "self": selfArray, 
	                "up": upArray
	                },
	            "addresses" : selectedItem
	        };
                res.status(200);
                res.json(item);    
            }
        }
};

/*
 * PUT /omnichannel/v1/parties/{id}/addresses/{id1}
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of address.
 */
exports.putOmnichannelV1Parties2 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	var addressObj = req.body;
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
              "message": "Party data not found"
            });
        } else {
            for (var j=0; j<state.partiesList[interceptPoint].addresses.length; j++) {
                if (state.partiesList[interceptPoint].addresses[j].id === req.params.id1) {
                    addressObj.id = req.params.id1;
                    state.partiesList[interceptPoint].addresses[j] = addressObj;
                    res.status(201);
                    res.json(addressObj);    
                    break;
                } else {
                    res.status(400);
                    res.json({
                      "message": "Address data not found"    
                    });
                }
                
            }
        }
};

/*
 * PATCH /omnichannel/v1/parties/{id}/addresses/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of address.
 */
exports.patchOmnichannelV1Parties2 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	var addressObj = req.body;
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } else {
            for (var j=0; j<state.partiesList[interceptPoint].addresses.length; j++) {
                if (state.partiesList[interceptPoint].addresses[j].id === req.params.id1) {
                    addressObj.id = req.params.id1;
                    var x;
                     for(x in state.partiesList[interceptPoint].addresses[j]) {
                         if (addressObj[x] === undefined) {
                             addressObj[x] = state.partiesList[interceptPoint].addresses[j][x];
                         }
                         
                     }
                    state.partiesList[interceptPoint].addresses[j] = addressObj;
                    res.status(201);
                    res.json(addressObj);    
                    break;
                } else {
                    res.status(400);
                    res.json({
                    "message": "Address data not found"    
                    });
                }
            }
        }
};

/*
 * DELETE /omnichannel/v1/parties/{id}/addresses/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - ID of address.
 */
exports.deleteOmnichannelV1Parties2 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
             "message": "Party data not found"
            });
        } else {
            for (var j=0; j<state.partiesList[interceptPoint].addresses.length; j++) {
                if (state.partiesList[interceptPoint].addresses[j].id === req.params.id1) {
                    state.partiesList[interceptPoint].addresses.splice(j, 1);
                    res.status(200);
                    res.json({
                    "message": "Address deleted"    
                    });
                    break;
                } else {
                    res.status(400);
                    res.json({
                    "message": "Address data not found"    
                    });
                }
                
            }
        }
};

/*
 * POST /omnichannel/v1/parties/{id}/emails
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 * id(type: string) - path parameter - client id of client.
 */
exports.postOmnichannelV1PartiesEmails = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	var emailObj = req.body;
	if (req.validationErrors()) {
        return res.json(400, req.validationErrorsJson());
    }
    var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    if (interceptPoint === undefined) {
        res.status(400);
        res.json({
              "message": "Party data not found"
        });
    } else {
        utility.handleCORS(req, res);
        emailObj.id = utility.randomString();
        state.partiesList[interceptPoint].emails.push(emailObj);
	    res.status(201);
	    res.json(emailObj);
    }   
};

/*
 * GET /omnichannel/v1/parties/{id}/emails
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * _limit(type: integer) - query parameter - tags to filter emails.
 * _page(type: integer) - query parameter - tags to filter emails.
 */
exports.getOmnichannelV1PartiesEmails = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	if (req.query._limit !== undefined) {
	    size = req.query._limit;
	}
	if (req.query._page !== undefined) {
	    startPoint =  (req.query._page-1) * size;
	    nextPage = Number(req.query._page) + 1;
	    prevPage = Number(req.query._page) - 1;
	}
	endPoint = Number(startPoint)+Number(size);
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } 
        var len = (state.partiesList[interceptPoint].emails).slice(startPoint,endPoint).length;
        if (len > 0) {
            for (j=0; j < len; j++,startPoint++) {    
            url = baseUrl + "/" + req.params.id + "/emails/" + state.partiesList[interceptPoint].emails[startPoint].id;
            nodeName = state.partiesList[interceptPoint].emails[startPoint].id;
            selfArray = {
	            "href" : url,
	            "name" : nodeName
	            };
            item [j] = {
                "_link": {"self" : selfArray},
                "emails": state.partiesList[interceptPoint].emails[startPoint] 
                };
            }
            selfArray = {
	         "href" : baseUrl + "/" + req.params.id + "/emails",
	         "name" : "Email URL"
	        };
	        nextArray = {
	         "href" : baseUrl + "/" + req.params.id + "/emails?_page=" + nextPage + "&_limit=" + size,
	         "name" : "Next Email URL"
	        };
	        if (prevPage > 0 ) {
	            upArray = {
	                "href" : baseUrl + "/" + req.params.id + "/emails?_page=" + prevPage + "&_limit=" + size,
	                "name" : "Previous Email URL"
	            } 
	            finalItem =  {
	                "_link" : { "self" : selfArray,
	                            "next" : nextArray,
	                            "prev" : upArray},
	                "item"  : item            
	            };
	        } else  {
	            finalItem =  {
	                "_link" : { "self" : selfArray,
	                        "next" : nextArray},
	                "item"  : item            
	            };
	        }
            res.status(200);
            res.json(finalItem);
            } else {
                    res.status(400);
                    res.json({
                    "message": "Email not present"
                }); 
        }
};

/*
 * OPTIONS /omnichannel/v1/parties/{id}/emails
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 */
exports.optionsOmnichannelV1PartiesEmails = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	url = baseUrl + "/" + req.params.id + "/emails";
	    finalItem = {
        	        "title" : "APIs for basic operations of email",
                    "link": [ {
                        "rel"   : "create",
                        "title" : "Create a Email",
                        "href"  : url,
                        "method": "POST",
                        "schema": entities.emailSchema()
                     },
                     {
                        "rel"   : "search",
                        "title" : "Search a list of emails associated to a party",
                        "href"  : url,
                        "method": "GET",
                        "schema":  {
                                "emails": {
                                  "type": "object",
                                  "properties": {
                                    "_page": {
                                        "type": "interger"
                                    },
                                    "_limit": {
                                        "type": "interger"
                                    }
                                 }
                            } 
                        }
                     }
                ]   
	    };
	    utility.handleCORS(req, res);
	    res.status(200);
        res.json(finalItem);
};
/*
 * OPTIONS /omnichannel/v1/parties/{id}/emails/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 */
exports.optionsOmnichannelV1PartiesEmails2 = function(req, res) {
        req.check('id', 'Invalid parameter').notEmpty();
	    req.check('id1', 'Invalid parameter').notEmpty();
        url = baseUrl + "/" + req.params.id + "/emails/" + req.params.id1;
        finalItem =  {
                "title" : "APIs for basic operations of email",
                "links" : [ {
                            "rel"   : "fetch",
                            "title" : "Fetch the Email details",
                            "href"  : url,
                            "method": "GET"
                            },
                            {
                            "rel"   : "delete",
                            "title" : "Delete the Email details",
                            "href"  : url,
                            "method": "DELETE"
                            },
                            {
                            "rel"   : "update",
                            "title" : "Override the Email details",
                            "href"  : url,
                            "method": "PUT",
                            "schema" : entities.emailSchema()
                            },
                            {
                            "rel"   : "update",
                            "title" : "Update the Email details",
                            "href"  : url,
                            "method": "PATCH",
                            "schema" : entities.emailSchema()
                            }
            ]
        };
        utility.handleCORS(req, res);
	    res.status(200);
        res.json(finalItem);
};

/*
 * GET /omnichannel/v1/parties/{id}/emails/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of email.
 */
exports.getOmnichannelV1Parties4 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } else {
                selectedItem = _.find(state.partiesList[interceptPoint].emails, {
                'id' : req.params.id1
            });
            if (selectedItem === undefined) {
                res.status(400);
                res.json({
                "message": "Email not present"
                });
            } else  {
                url = baseUrl + "/" + state.partiesList[interceptPoint].id + "/emails/" + selectedItem.id;
	            nodeName = selectedItem.id;
	            selfArray = {
	                "href" : url,
	                "name" : nodeName
	            };
	            url = baseUrl + "/" + state.partiesList[interceptPoint].id + "/emails";
	            nodeName = "url to move up";
	            upArray = {
	               "href" : url,
	               "name" : nodeName
	            };
                
                item = {
	            "_link" : {
	                "self": selfArray, 
	                "up": upArray
	                },
	            "emails" : selectedItem
	        };
                res.status(200);
                res.json(item);    
            }
        }
};

/*
 * PUT /omnichannel/v1/parties/{id}/emails/{id1}
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of email.
 */
exports.putOmnichannelV1Parties3 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	var emailObj = req.body;
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } else {
            for (var j=0; j<state.partiesList[interceptPoint].emails.length; j++) {
                if (state.partiesList[interceptPoint].emails[j].id === req.params.id1) {
                    emailObj.id = req.params.id1;
                    state.partiesList[interceptPoint].emails[j] = emailObj;
                    res.status(201);
                    res.json(emailObj);    
                    break;
                } else {
                    res.status(400);
                    res.json({
                    "message": "Email data not found"   
                    });
                }
                
            }
        }
	
};

/*
 * PATCH /omnichannel/v1/parties/{id}/emails/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of email.
 */
exports.patchOmnichannelV1Parties3 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	var emailObj = req.body;
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"   
            });
        } else {
            for (var j=0; j<state.partiesList[interceptPoint].emails.length; j++) {
                if (state.partiesList[interceptPoint].emails[j].id === req.params.id1) {
                    emailObj.id = req.params.id1;
                    var x;
                     for(x in state.partiesList[interceptPoint].emails[j]) {
                         if (emailObj[x] === undefined) {
                             emailObj[x] = state.partiesList[interceptPoint].emails[j][x];
                         }
                         
                     }
                    state.partiesList[interceptPoint].emails[j] = emailObj;
                    res.status(201);
                    res.json(emailObj);    
                    break;
                } else {
                    res.status(400);
                    res.json({
                    "message": "Email data not found"   
                    });
                }
            }
        }
};

/*
 * DELETE /omnichannel/v1/parties/{id}/emails/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of email.
 */
exports.deleteOmnichannelV1Parties3 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"   
            });
        } else {
            for (var j=0; j<state.partiesList[interceptPoint].emails.length; j++) {
                if (state.partiesList[interceptPoint].emails[j].id === req.params.id1) {
                    state.partiesList[interceptPoint].emails.splice(j, 1);
                    res.status(200);
                    res.json({
                    "message": "email deleted"    
                    });
                    break;
                } else {
                    res.status(400);
                    res.json({
                    "message": "Email data not found"   
                    });
                }
                
            }
        }
};

/*
 * POST /omnichannel/v1/parties/{id}/contacts
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 * id(type: string) - path parameter - client id of client.
 */
exports.postOmnichannelV1PartiesContacts = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	var contactObj = req.body;
	if (req.validationErrors()) {
        return res.json(400, req.validationErrorsJson());
    }
    var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    if (interceptPoint === undefined) {
        res.status(400);
        res.json({
              "message": "Party data not found"
        });
    } else {
        utility.handleCORS(req, res);
        contactObj.id = utility.randomString();
        state.partiesList[interceptPoint].contacts.push(contactObj);
	    res.status(201);
	    res.json(contactObj);
    }   
};

/*
 * GET /omnichannel/v1/parties/{id}/contacts
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * _limit(type: integer) - query parameter - tags to filter contacts.
 * _page(type: integer) - query parameter - tags to filter contacts.
 */
exports.getOmnichannelV1PartiesContacts = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	if (req.query._limit !== undefined) {
	    size = req.query._limit;
	}
	if (req.query._page !== undefined) {
	    startPoint =  (req.query._page-1) * size;
	    nextPage = Number(req.query._page) + 1;
	    prevPage = Number(req.query._page) - 1;
	}
	endPoint = Number(startPoint)+Number(size);
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } 
        var len = (state.partiesList[interceptPoint].contacts).slice(startPoint,endPoint).length;
        if (len > 0) {
            for (j=0; j < len; j++,startPoint++) {    
            url = baseUrl + "/" + req.params.id + "/contacts/" + state.partiesList[interceptPoint].contacts[startPoint].id;
            nodeName = state.partiesList[interceptPoint].contacts[startPoint].id;
            selfArray = {
	            "href" : url,
	            "name" : nodeName
	            };
            item [j] = {
                "_link": {"self" : selfArray},
                "contacts": state.partiesList[interceptPoint].contacts[startPoint] 
                };
            }
            selfArray = {
	         "href" : baseUrl + "/" + req.params.id + "/contacts",
	         "name" : "Contact URL"
	        };
	        nextArray = {
	         "href" : baseUrl + "/" + req.params.id + "/contacts?_page=" + nextPage + "&_limit=" + size,
	         "name" : "Next Contact URL"
	        };
	        if (prevPage > 0) {
	            upArray = {
	                "href" : baseUrl + "/" + req.params.id + "/contacts?_page=" + prevPage + "&_limit=" + size,
	                "name" : "Previous Contact URL"
	               };
	            finalItem =  {
	                "_link" : { "self" : selfArray,
	                            "next" : nextArray,
	                             "Prev" : upArray},
	                "item"  : item            
	            };
	            
	        } else {
	            finalItem =  {
	                "_link" : { "self" : selfArray,
	                            "next" : nextArray},
	                "item"  : item            
	            };
	        }     
            res.status(200);
            res.json(finalItem);
            } else {
                    res.status(400);
                    res.json({
                    "message": "Contact not present"
                }); 
        }
};

/*
 * OPTIONS /omnichannel/v1/parties/{id}/contacts
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 */
exports.optionsOmnichannelV1PartiesContacts = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	url = baseUrl + "/" + req.params.id + "/contacts";
	    finalItem = {
        	        "title" : "APIs for basic operations of contact",
                    "link": [ {
                        "rel"   : "create",
                        "title" : "Create a Contact",
                        "href"  : url,
                        "method": "POST",
                        "schema": entities.contactSchema()
                     },
                     {
                        "rel"   : "search",
                        "title" : "Search a list of contacts associated to a party",
                        "href"  : url,
                        "method": "GET",
                        "schema":  {
                                "addresses": {
                                  "type": "object",
                                  "properties": {
                                    "_page": {
                                        "type": "interger"
                                    },
                                    "_limit": {
                                        "type": "interger"
                                    }
                                 }
                            } 
                        }
                     }
                ]   
	    };
	    utility.handleCORS(req, res);
	    res.status(200);
        res.json(finalItem);
};
/*
 * OPTIONS /omnichannel/v1/parties/{id}/contacts/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 */
exports.optionsOmnichannelV1PartiesContacts2 = function(req, res) {
        req.check('id', 'Invalid parameter').notEmpty();
	    req.check('id1', 'Invalid parameter').notEmpty();
        url = baseUrl + "/" + req.params.id + "/contacts/" + req.params.id1;
        finalItem =  {
                "title" : "APIs for basic operations of contacts",
                "links" : [ {
                            "rel"   : "fetch",
                            "title" : "Fetch the Contact details",
                            "href"  : url,
                            "method": "GET"
                            },
                            {
                            "rel"   : "delete",
                            "title" : "Delete the Contact details",
                            "href"  : url,
                            "method": "DELETE"
                            },
                            {
                            "rel"   : "update",
                            "title" : "Override the Contact details",
                            "href"  : url,
                            "method": "PUT",
                            "schema" : entities.contactSchema()
                            },
                            {
                            "rel"   : "update",
                            "title" : "Update the Contact details",
                            "href"  : url,
                            "method": "PATCH",
                            "schema" : entities.contactSchema()
                            }
            ]
        };
        utility.handleCORS(req, res);
	    res.status(200);
        res.json(finalItem);
};
/*
 * GET /omnichannel/v1/parties/{id}/contacts/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of contact.
 */
exports.getOmnichannelV1Parties5 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } else {
                selectedItem = _.find(state.partiesList[interceptPoint].contacts, {
                'id' : req.params.id1
            });
            if (selectedItem === undefined) {
                res.status(400);
                res.json({
                "message": "Contact not present"
                });
            } else  {
                url = baseUrl + "/" + state.partiesList[interceptPoint].id + "/contacts/" + selectedItem.id;
	            nodeName = selectedItem.id;
	            selfArray = {
	                "href" : url,
	                "name" : nodeName
	            };
	            url = baseUrl + "/" + state.partiesList[interceptPoint].id + "/contacts";
	            nodeName = "url to move up";
	            upArray = {
	               "href" : url,
	               "name" : nodeName
	            };
                
                item = {
	            "_link" : {
	                "self": selfArray, 
	                "up": upArray
	                },
	            "contacts" : selectedItem
	        };
                res.status(200);
                res.json(item);    
            }
        }
};

/*
 * PUT /omnichannel/v1/parties/{id}/contacts/{id1}
 *
 * Parameters (body params accessible on req.body for JSON, req.xmlDoc for XML):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of contact.
 */
exports.putOmnichannelV1Parties4 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	var contactObj = req.body;
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } else {
            for (var j=0; j<state.partiesList[interceptPoint].contacts.length; j++) {
                if (state.partiesList[interceptPoint].contacts[j].id === req.params.id1) {
                    contactObj.id = req.params.id1;
                    state.partiesList[interceptPoint].contacts[j] = contactObj;
                    res.status(201);
                    res.json(contactObj);    
                    break;
                } else {
                    res.status(400);
                    res.json({
                    "message": "Contact data not found"
                    });
                }
                
            }
        }
};

/*
 * PATCH /omnichannel/v1/parties/{id}/contacts/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of contact.
 */
exports.patchOmnichannelV1Parties4 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	var contactObj = req.body;
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } else {
            for (var j=0; j<state.partiesList[interceptPoint].contacts.length; j++) {
                if (state.partiesList[interceptPoint].contacts[j].id === req.params.id1) {
                    contactObj.id = req.params.id1;
                    var x;
                     for(x in state.partiesList[interceptPoint].contacts[j]) {
                         if (contactObj[x] === undefined) {
                             contactObj[x] = state.partiesList[interceptPoint].contacts[j][x];
                         }
                         
                     }
                    state.partiesList[interceptPoint].contacts[j] = contactObj;
                    res.status(201);
                    res.json(contactObj);    
                    break;
                } else {
                    res.status(400);
                    res.json({
                    "message": "Contact data not found"
                    });
                }
            }
        }
};

/*
 * DELETE /omnichannel/v1/parties/{id}/contacts/{id1}
 *
 * Parameters (named path params accessible on req.params and query params on req.query):
 *
 * id(type: string) - path parameter - client id of client.
 * id1(type: string) - path parameter - id of contact.
 */
exports.deleteOmnichannelV1Parties4 = function(req, res) {
	req.check('id', 'Invalid parameter').notEmpty();
	req.check('id1', 'Invalid parameter').notEmpty();
	if (req.validationErrors()) {
		return res.json(400,req.validationErrorsJson());
	}
	var interceptPoint;
	for (var i = 0; i < state.partiesList.length; i++) {
        if (state.partiesList[i].id === req.params.id) {
            interceptPoint = i;
            break;
        }
    }
    utility.handleCORS(req, res);
    if (interceptPoint === undefined) {
            res.status(400);
            res.json({
            "message": "Party data not found"
            });
        } else {
            for (var j=0; j<state.partiesList[interceptPoint].contacts.length; j++) {
                if (state.partiesList[interceptPoint].contacts[j].id === req.params.id1) {
                    state.partiesList[interceptPoint].contacts.splice(j, 1);
                    res.status(200);
                    res.json({
                    "message": "contact deleted"    
                    });
                    break;
                } else {
                    res.status(400);
                    res.json({
                    "message": "Contact data not found"
                    });
                }
                
            }
        }
};