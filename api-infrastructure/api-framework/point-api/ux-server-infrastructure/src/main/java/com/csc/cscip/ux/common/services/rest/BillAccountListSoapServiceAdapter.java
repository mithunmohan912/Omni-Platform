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


import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.csc.cscip.ux.common.services.util.ServiceUtility;
import com.csc.cscip.ux.common.services.util.WebServiceClient;

public class BillAccountListSoapServiceAdapter {

    public String billAccountList(String requestXML, String serviceOperationName) throws Exception {

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
