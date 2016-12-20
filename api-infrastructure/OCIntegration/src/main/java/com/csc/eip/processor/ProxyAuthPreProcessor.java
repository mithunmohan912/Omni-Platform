package com.csc.eip.processor;

import java.util.HashMap;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

import com.csc.eip.route.ApiProxyAuthRouter;

public class ProxyAuthPreProcessor implements Processor {
	
	static Logger log = Logger.getLogger(ProxyAuthPreProcessor.class.getName());

	public void process(Exchange exchange) throws Exception {
		String messagePrefix = exchange.getExchangeId()+":";
		
		log.debug(messagePrefix+"auth preprocessor");
		
		exchange.setProperty(ApiProxyAuthRouter.HEADER_IBM_CLIENT_ID, ApiProxyAuthRouter.PROPERTY_IBM_CLIENT_ID);
		exchange.setProperty(ApiProxyAuthRouter.HEADER_IBM_CLIENT_SECRET, ApiProxyAuthRouter.PROPERTY_IBM_CLIENT_SECRET);		
		exchange.setProperty(ApiProxyAuthRouter.PROPERTY_AUTHN_TOKEN, exchange.getIn().getHeader(ApiProxyAuthRouter.HEADER_FORGEROCK_TOKEN_ID));
		exchange.setProperty(ApiProxyAuthRouter.PROPERTY_PROXY_HEADERS, new HashMap<String,Object>(exchange.getIn().getHeaders()));
		exchange.setProperty(ApiProxyAuthRouter.PROPERTY_PROXY_BODY, exchange.getIn().getBody());
		exchange.getIn().removeHeaders("*");
		exchange.getIn().setBody("");
		
		log.debug(messagePrefix+"auth preprocessor ended");
	}
	
}
