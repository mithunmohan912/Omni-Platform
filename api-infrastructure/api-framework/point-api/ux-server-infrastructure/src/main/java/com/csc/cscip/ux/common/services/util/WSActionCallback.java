//*******************************************************************************
// * Copyright (c) 2012 CSC.
// *
// * The information contained in this document is the exclusive property of
// * CSC.  This work is protected under USA copyright law
// * and the copyright laws of given countries of origin and international
// * laws, treaties and/or conventions. No part of this document may be
// * reproduced or transmitted in any form or by any means, electronic or
// * mechanical including photocopying or by any informational storage or
// * retrieval system, unless as expressly permitted by CSC.
// ******************************************************************************
package com.csc.cscip.ux.common.services.util;

import java.io.IOException;
import java.net.URI;
import java.util.Iterator;

import javax.xml.transform.TransformerException;

import org.springframework.util.Assert;
import org.springframework.ws.WebServiceMessage;
import org.springframework.ws.soap.SoapHeader;
import org.springframework.ws.soap.SoapHeaderElement;
import org.springframework.ws.soap.SoapMessage;
import org.springframework.ws.soap.addressing.client.ActionCallback;
import org.springframework.ws.soap.addressing.core.EndpointReference;
import org.springframework.ws.soap.addressing.core.MessageAddressingProperties;
import org.springframework.ws.soap.addressing.version.AddressingVersion;
import org.springframework.ws.soap.axiom.AxiomSoapMessage;

public class WSActionCallback extends ActionCallback {

    public WSActionCallback(URI action, AddressingVersion version, URI to) {
	super(action, version, to);
	// TODO Auto-generated constructor stub
    }

    public void doWithMessage(WebServiceMessage message) throws IOException, TransformerException {
		// super.doWithMessage(message);

		Assert.isInstanceOf(SoapMessage.class, message);
		AxiomSoapMessage soapMessage = (AxiomSoapMessage) message;
		URI messageId = getMessageIdStrategy().newMessageId(soapMessage);
		EndpointReference epr = getFrom();

		MessageAddressingProperties map = new MessageAddressingProperties(
				getTo(), getFrom(), getReplyTo(), getFaultTo(), getAction(),
				messageId);
		getVersion().addAddressingHeaders(soapMessage, map);

		AxiomSoapMessage msg = (AxiomSoapMessage) message;
		SoapHeader sh = msg.getSoapHeader();
		Iterator i = sh.examineAllHeaderElements();
		while (i.hasNext()) {
			SoapHeaderElement elmt = (SoapHeaderElement) i.next();
			if (elmt.getName().getLocalPart().equals("To")
					&& elmt.getName().getNamespaceURI().endsWith("addressing")) {
				elmt.setMustUnderstand(false);
			}
		}
    }

}
