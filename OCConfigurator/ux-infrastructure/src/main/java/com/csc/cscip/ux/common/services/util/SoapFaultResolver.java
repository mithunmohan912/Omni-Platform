//*******************************************************************************

// * Copyright (c) 2012 CSC.

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

import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ws.WebServiceMessage;
import org.springframework.ws.soap.axiom.AxiomSoapMessage;
import org.springframework.ws.soap.client.core.SoapFaultMessageResolver;

import com.csc.cscip.ux.common.exception.CustomSoapFaultException;
import com.csc.cscip.ux.common.util.CommonConstants;

public class SoapFaultResolver extends SoapFaultMessageResolver {
	private static final Logger logger = LoggerFactory.getLogger(SoapFaultResolver.class);
	
    /**
     * @param WebServiceMessage Contain the fault message
     * @exception (@throws CustomSoapFaultException)
     * @see spring ws config
     */
    @Override
    public void resolveFault(WebServiceMessage message) throws IOException {

	StringBuffer SoapfaultErrorMsg = new StringBuffer();
	// RequestContext requestContext = RequestContextHolder.getRequestContext();
	AxiomSoapMessage soapMessage = (AxiomSoapMessage) message;
	XMLStreamReader reader = soapMessage.getAxiomMessage().getXMLStreamReader();

	try {
	    while (reader.hasNext()) {
		int eventType = reader.next();
		if (XMLStreamReader.START_ELEMENT == eventType || XMLStreamReader.END_ELEMENT == eventType
			|| XMLStreamReader.ENTITY_REFERENCE == eventType) {

		    String qName = reader.getLocalName();
		    if (qName.equalsIgnoreCase(CommonConstants.SOAP_FAULT_TAG)
			    && (XMLStreamReader.START_ELEMENT == eventType)) {
			SoapfaultErrorMsg.append(reader.getElementText());
		    }
		}
	    }
	    throw new CustomSoapFaultException(SoapfaultErrorMsg.toString());
	} catch (XMLStreamException e) {
	    logger.error("", e);
	    throw new IOException(e.getMessage());
	}

    }
}
