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
package com.csc.cscip.ux.common.services.rest;

import java.io.InputStream;
import java.util.Properties;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.csc.cscip.ux.common.services.util.ServiceUtility;
import com.csc.cscip.ux.common.services.util.WebServiceClient;

public class AccessAccountSearchSoapServiceAdapter {

    public AccessAccountSearchSoapServiceAdapter() {
	// TODO Auto-generated constructor stub
    }

    public String accessAccountSearchService(String requestXML, String eeProperties) throws Exception {

	InputStream inStream = null;
	String str = null;

	// try {

	Properties properties = new Properties();
	inStream = getClass().getResourceAsStream(eeProperties);
	properties.load(inStream);

	WebServiceClient client = new WebServiceClient();
	ClassPathXmlApplicationContext context = client.getContextPath(properties.getProperty("ConfigurationXML"));

	client.sendRequesttoService(context, requestXML, properties.getProperty("InputChannel"));
	str = client.getResponse(context, properties.getProperty("OutputChannel"));
	/*
	 * } catch (IOException io) {
	 * 
	 * } finally { try { inStream.close(); } catch (Exception ex) {
	 * 
	 * } }
	 */
	inStream.close();
	return str;
    }

    public String accessAccountSearch(String requestXML, String serviceOperationName) throws Exception {

	String str = null;

	String clientConfigURL = ServiceUtility.getClientConfigURL(serviceOperationName);

	WebServiceClient client = new WebServiceClient();
	ClassPathXmlApplicationContext context = client.getContextPath(clientConfigURL, serviceOperationName);

	if (context == null) {
	    return null;
	}

	client.sendRequesttoService(context, requestXML, ServiceUtility.getInputChannel());

	str = client.getResponse(context, ServiceUtility.getOutputChannel());

	return str;
    }

}
