package com.csc.cscip.ux.common.services.rest;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.csc.cscip.ux.common.services.util.ServiceUtility;
import com.csc.cscip.ux.common.services.util.WebServiceClient;

public class ReconciliationInquireAdapter {
	public ReconciliationInquireAdapter() {

	}

	public String reconciliationInquireService(String requestXML,
			String serviceOperationName) throws Exception {

		String str = null;

		String clientConfigURL = ServiceUtility
				.getClientConfigURL(serviceOperationName);

		WebServiceClient client = new WebServiceClient();
		ClassPathXmlApplicationContext context = client.getContextPath(
				clientConfigURL, serviceOperationName);

		if (context == null) {
			return null;
		}

		client.sendRequesttoService(context, requestXML,
				ServiceUtility.getInputChannel());

		str = client.getResponse(context, ServiceUtility.getOutputChannel());

		return str;
	}
}
