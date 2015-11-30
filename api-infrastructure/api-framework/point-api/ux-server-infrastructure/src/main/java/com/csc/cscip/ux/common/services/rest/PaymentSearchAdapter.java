package com.csc.cscip.ux.common.services.rest;

import java.io.InputStream;
import java.util.Properties;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.csc.cscip.ux.common.services.util.ServiceUtility;
import com.csc.cscip.ux.common.services.util.WebServiceClient;

public class PaymentSearchAdapter {

	public PaymentSearchAdapter() {
		// TODO Auto-generated constructor stub
	}

	public String paymentSearchService(String requestXML, String eeProperties) throws Exception {

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

		inStream.close();
		/*
		 * } finally { try { inStream.close(); } catch (Exception ex) {
		 * 
		 * } }
		 */

		return str;
	}

	public String paymentSearch(String requestXML, String serviceOperationName) throws Exception {

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
