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
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpSession;
import javax.xml.namespace.QName;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ws.soap.addressing.core.EndpointReference;

import com.csc.cscip.ux.common.util.CommonConstants;

public class EndPointFactory {
	private static final Logger logger = LoggerFactory.getLogger(EndPointFactory.class);

	public EndPointFactory() {
		// TODO Auto-generated constructor stub
	}

	public static EndpointReference createRefrence() throws IOException, URISyntaxException, SOAPException {

		URI address = null;
		EndpointReference refrenceFrom = null;
		InputStream inStream = null;
		HttpSession session = null;
		String eeProperties = "/resources/services/config/properties/URL.properties";
		
		try {

			// Load properties file for EE
			Properties properties = new Properties();
			inStream = EndPointFactory.class.getResourceAsStream(eeProperties);
			properties.load(inStream);

			String uriFrom = properties.getProperty("FROM_URL");
			String uriNamespace = properties.getProperty("NAMESPACE_URL");

			address = new URI(uriFrom);

			SOAPFactory factory;
			// try {
			factory = SOAPFactory.newInstance();

			SOAPElement elementSignonRole = factory.createElement(new QName(uriNamespace, "SignonRoleCd", "ac"));

			SOAPElement elementPin = factory.createElement(new QName(uriNamespace, "PIN", "ac"));

			SOAPElement elementClient = factory.createElement(new QName(uriNamespace, "ClientApp", "ac"));
			SOAPElement childElementOrg = elementClient.addChildElement(new QName(uriNamespace, "Org", "ac"));
			SOAPElement childElementName = elementClient.addChildElement(new QName(uriNamespace, "Name", "ac"));
			SOAPElement childElementVersion = elementClient.addChildElement(new QName(uriNamespace, "Version", "ac"));

			// 139283 starts
			// childElementOrg.addTextNode("CSC");
			// childElementName.addTextNode("UX");
			childElementOrg.addTextNode(CommonConstants.CSC_Name);

			childElementName.addTextNode(CommonConstants.UX_Name);
			// 139283 ends
			SOAPElement elementVersion = factory.createElement(new QName(uriNamespace, "com.csc_SessKey", "ac"));

			// 139283 starts
			FacesContext fc = FacesContext.getCurrentInstance();
			if (fc != null) {
				ExternalContext econtext = fc.getExternalContext();
				if (econtext != null) {
					session = (HttpSession) econtext.getSession(true);
					elementVersion.addTextNode(session.getId());
				}
			}
			// 139283 ends

			// elementVersion.addTextNode("f9731eb3932e4d25b5307b1f1a4974f0");
			// 139283
			// elementVersion.addTextNode("613E8001881C4FFC90CB8E6D46C22362");

			List nodeList = new ArrayList();
			nodeList.add(elementSignonRole);
			nodeList.add(elementPin);
			nodeList.add(elementClient);
			nodeList.add(elementVersion);

			refrenceFrom = new EndpointReference(address, new ArrayList(), nodeList);
		} catch (SOAPException e) {
			logger.error("", e);
			throw new SOAPException(e.getMessage());
		} catch (URISyntaxException e) {
			logger.error("", e);
			throw new URISyntaxException(eeProperties, e.getMessage());
		} catch (IOException e) {
			logger.error("", e);
			throw new IOException(e.getMessage());
		}

		return refrenceFrom;
	}

}
