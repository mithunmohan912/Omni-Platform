package com.csc.eip.processor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

import com.csc.eip.route.ApiProxyAuthRouter;

public class AuthzPreProcessor implements Processor {
	
	static Logger log = Logger.getLogger(AuthzPreProcessor.class.getName());

	public void process(Exchange exchange) throws Exception {
		String messagePrefix = exchange.getExchangeId()+":";

		log.debug(messagePrefix+"authn preprocessor");
		
		exchange.getIn().setHeader(Exchange.HTTP_METHOD, "POST");
		exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_IBM_CLIENT_ID, exchange.getProperty(ApiProxyAuthRouter.HEADER_IBM_CLIENT_ID));
		exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_IBM_CLIENT_SECRET, exchange.getProperty(ApiProxyAuthRouter.HEADER_IBM_CLIENT_SECRET));
		exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_FORGEROCK_TOKEN_ID, exchange.getProperty(ApiProxyAuthRouter.PROPERTY_POLICYADMIN_TOKEN));
		exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_CONTENT_TYPE, "application/json");

		@SuppressWarnings("unchecked")
		Map<String,Object> proxyHeaders = new HashMap<String,Object>(exchange.getProperty(ApiProxyAuthRouter.PROPERTY_PROXY_HEADERS, HashMap.class));
		//* TODO TEMP localhost
		String authzResource = "http://169.46.145.101:8888"+(String) proxyHeaders.get(Exchange.HTTP_URI);
//		String authzResource = (String) proxyHeaders.get(Exchange.HTTP_URL);
		log.debug(messagePrefix+"authnResource:"+authzResource);
		String tokenId = (String) proxyHeaders.get(ApiProxyAuthRouter.HEADER_FORGEROCK_TOKEN_ID);
		Map<String,Object> tokenData = new HashMap<String,Object>();
		tokenData.put("ssoToken", tokenId);
		Map<String,Object> authzData = new HashMap<String,Object>();
		List<String> authzResources = new ArrayList<String>();
		authzResources.add(authzResource);
		authzData.put("resources", authzResources);
		authzData.put("application", ApiProxyAuthRouter.PROPERTY_AUTHZ_APPLICATION);
		authzData.put("subject", tokenData);
		exchange.getIn().setBody(authzData);
		
		log.debug(messagePrefix+"authn preprocessor ended");
	}
		
}
