package com.csc.cscip.ux.common.services.rest;

import java.io.InputStream;
import java.util.Properties;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.csc.cscip.ux.common.services.util.ServiceUtility;
import com.csc.cscip.ux.common.services.util.WebServiceClient;

public class SystemDateSoapServiceAdapter {

	public SystemDateSoapServiceAdapter() {
	}

	public String systemDateService(String requestXML,String eeProperties) throws Exception {

		InputStream inStream = null;
		String str = null;

		Properties properties = new Properties();
		inStream = getClass().getResourceAsStream(eeProperties);
		properties.load(inStream);

		WebServiceClient client = new WebServiceClient();
		ClassPathXmlApplicationContext context = client
				.getContextPath(properties.getProperty("ConfigurationXML"));

		client.sendRequesttoService(context, requestXML,properties.getProperty("InputChannel"));
		str = client.getResponse(context,properties.getProperty("OutputChannel"));

		inStream.close();
		return str;
	}

	public String systemDateServiceCall(String requestXML,String serviceOperationName) throws Exception {

		String str = null;

		String clientConfigURL = ServiceUtility.getClientConfigURL(serviceOperationName);

		WebServiceClient client = new WebServiceClient();
		ClassPathXmlApplicationContext context = client.getContextPath(clientConfigURL, serviceOperationName);

		if (context == null) {
			return null;
		}

		client.sendRequesttoService(context, requestXML,ServiceUtility.getInputChannel());

		str = client.getResponse(context, ServiceUtility.getOutputChannel());

		return str;
	}

}