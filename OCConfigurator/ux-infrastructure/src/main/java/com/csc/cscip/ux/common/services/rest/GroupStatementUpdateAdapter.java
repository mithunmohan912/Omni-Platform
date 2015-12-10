package com.csc.cscip.ux.common.services.rest;


import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.csc.cscip.ux.common.services.util.ServiceUtility;
import com.csc.cscip.ux.common.services.util.WebServiceClient;

public class GroupStatementUpdateAdapter {

	public GroupStatementUpdateAdapter(){
		// TODO Auto-generated constructor stub
	}

	public String groupStatementUpdateService(String requestXML, String serviceOperationName) throws Exception {

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
