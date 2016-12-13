package com.csc.eip.processor;

import java.util.HashMap;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

import com.csc.eip.route.ApiProxyAuthRouter;

public class ProxyAuthPostProcessor implements Processor {
	
	static Logger log = Logger.getLogger(ProxyAuthPostProcessor.class.getName());

	@SuppressWarnings("unchecked")
	public void process(Exchange exchange) throws Exception {
		String messagePrefix = exchange.getExchangeId()+":";
		
		log.debug(messagePrefix+"auth postprocessor");
		
		exchange.getIn().removeHeaders("*");
		exchange.getIn().setHeaders(exchange.getProperty(ApiProxyAuthRouter.PROPERTY_PROXY_HEADERS, HashMap.class));
		exchange.getIn().setBody(exchange.getProperty(ApiProxyAuthRouter.PROPERTY_PROXY_BODY));
		
		log.debug(messagePrefix+"auth postprocessor ended");
	}
	
}
