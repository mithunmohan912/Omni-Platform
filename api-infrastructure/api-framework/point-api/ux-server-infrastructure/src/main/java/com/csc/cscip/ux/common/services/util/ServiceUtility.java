package com.csc.cscip.ux.common.services.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.csc.cscip.ux.common.util.CommonConstants;

public class ServiceUtility {

	private static final Logger logger = LoggerFactory.getLogger(ServiceUtility.class);
	
    public static String getClientConfigURL(String serviceOperationName) throws IOException {
	InputStream inStream = null;
	String configurationURL = null;

	try {
	    String eeProperties = "/resources/services/config/properties/URL.properties";

	    Properties properties = new Properties();
	    inStream = ServiceUtility.class.getResourceAsStream(eeProperties);

	    properties.load(inStream);
	    configurationURL = properties.getProperty(serviceOperationName.substring(0,
		    serviceOperationName.indexOf(CommonConstants.SEPARATOR_SERVICE_OPERATION))
		    + CommonConstants.SEPARATOR_URL + CommonConstants.SUFFIX_URL);
	} finally {
		inStream.close();
	}
	return configurationURL;
    }

    public static String getInputChannel() throws IOException {
		InputStream inStream = null;
		String inputChannel = null;

		try {
			String eeProperties = "/resources/services/config/properties/URL.properties";

			Properties properties = new Properties();
			inStream = ServiceUtility.class.getResourceAsStream(eeProperties);

			properties.load(inStream);
			inputChannel = properties
					.getProperty(CommonConstants.INPUT_CHANNEL);
		} finally {
			inStream.close();
		}
		return inputChannel;
    }

    public static String getOutputChannel() throws IOException {
		InputStream inStream = null;
		String outputChannel = null;

		try {
			String eeProperties = "/resources/services/config/properties/URL.properties";

			Properties properties = new Properties();
			inStream = ServiceUtility.class.getResourceAsStream(eeProperties);

			properties.load(inStream);
			outputChannel = properties
					.getProperty(CommonConstants.OUTPUT_CHANNEL);
		} finally {
			inStream.close();
		}
		return outputChannel;
    }

}
