
/*
 * APIs for basic operations of parties
 *
 * 
 */


var omnichannel = require("./routes/omnichannel.js")

/* Route definition styles:
 *
 *	define(path, method, function)
 *	soap(path, soapAction, function)
 *
 */
Sandbox.define("/omnichannel/v1/parties", "POST", omnichannel.postOmnichannelV1Parties);
Sandbox.define("/omnichannel/v1/parties", "GET", omnichannel.getOmnichannelV1Parties);
Sandbox.define("/omnichannel/v1/parties", "OPTIONS", omnichannel.optionsOmnichannelV1Parties);
Sandbox.define("/omnichannel/v1/parties/{id}", "OPTIONS", omnichannel.optionsOmnichannelV1Parties2);
Sandbox.define("/omnichannel/v1/parties/{id}", "GET", omnichannel.getOmnichannelV1Parties2);
Sandbox.define("/omnichannel/v1/parties/{id}", "PUT", omnichannel.putOmnichannelV1Parties);
Sandbox.define("/omnichannel/v1/parties/{id}", "PATCH", omnichannel.patchOmnichannelV1Parties);
Sandbox.define("/omnichannel/v1/parties/{id}", "DELETE", omnichannel.deleteOmnichannelV1Parties);
Sandbox.define("/omnichannel/v1/parties/{id}/addresses", "POST", omnichannel.postOmnichannelV1PartiesAddresses);
Sandbox.define("/omnichannel/v1/parties/{id}/addresses", "GET", omnichannel.getOmnichannelV1PartiesAddresses);
Sandbox.define("/omnichannel/v1/parties/{id}/addresses", "OPTIONS", omnichannel.optionsOmnichannelV1PartiesAddresses);
Sandbox.define("/omnichannel/v1/parties/{id}/addresses/{id1}", "OPTIONS", omnichannel.optionsOmnichannelV1PartiesAddresses2);
Sandbox.define("/omnichannel/v1/parties/{id}/addresses/{id1}", "GET", omnichannel.getOmnichannelV1Parties3);
Sandbox.define("/omnichannel/v1/parties/{id}/addresses/{id1}", "PUT", omnichannel.putOmnichannelV1Parties2);
Sandbox.define("/omnichannel/v1/parties/{id}/addresses/{id1}", "PATCH", omnichannel.patchOmnichannelV1Parties2);
Sandbox.define("/omnichannel/v1/parties/{id}/addresses/{id1}", "DELETE", omnichannel.deleteOmnichannelV1Parties2);
Sandbox.define("/omnichannel/v1/parties/{id}/emails", "POST", omnichannel.postOmnichannelV1PartiesEmails);
Sandbox.define("/omnichannel/v1/parties/{id}/emails", "GET", omnichannel.getOmnichannelV1PartiesEmails);
Sandbox.define("/omnichannel/v1/parties/{id}/emails", "OPTIONS", omnichannel.optionsOmnichannelV1PartiesEmails);
Sandbox.define("/omnichannel/v1/parties/{id}/emails/{id1}", "OPTIONS", omnichannel.optionsOmnichannelV1PartiesEmails2);
Sandbox.define("/omnichannel/v1/parties/{id}/emails/{id1}", "GET", omnichannel.getOmnichannelV1Parties4);
Sandbox.define("/omnichannel/v1/parties/{id}/emails/{id1}", "PUT", omnichannel.putOmnichannelV1Parties3);
Sandbox.define("/omnichannel/v1/parties/{id}/emails/{id1}", "PATCH", omnichannel.patchOmnichannelV1Parties3);
Sandbox.define("/omnichannel/v1/parties/{id}/emails/{id1}", "DELETE", omnichannel.deleteOmnichannelV1Parties3);
Sandbox.define("/omnichannel/v1/parties/{id}/contacts", "POST", omnichannel.postOmnichannelV1PartiesContacts);
Sandbox.define("/omnichannel/v1/parties/{id}/contacts", "GET", omnichannel.getOmnichannelV1PartiesContacts);
Sandbox.define("/omnichannel/v1/parties/{id}/contacts", "OPTIONS", omnichannel.optionsOmnichannelV1PartiesContacts);
Sandbox.define("/omnichannel/v1/parties/{id}/contacts/{id1}", "OPTIONS", omnichannel.optionsOmnichannelV1PartiesContacts2);
Sandbox.define("/omnichannel/v1/parties/{id}/contacts/{id1}", "GET", omnichannel.getOmnichannelV1Parties5);
Sandbox.define("/omnichannel/v1/parties/{id}/contacts/{id1}", "PUT", omnichannel.putOmnichannelV1Parties4);
Sandbox.define("/omnichannel/v1/parties/{id}/contacts/{id1}", "PATCH", omnichannel.patchOmnichannelV1Parties4);
Sandbox.define("/omnichannel/v1/parties/{id}/contacts/{id1}", "DELETE", omnichannel.deleteOmnichannelV1Parties4);