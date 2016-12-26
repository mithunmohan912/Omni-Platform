package com.csc.eip.processor;

import java.util.HashMap;
import java.util.Map;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

import com.csc.eip.route.ApiProxyAuthRouter;

public class AuthnDirectoryProcessor implements Processor {
	
	static Logger log = Logger.getLogger(AuthnDirectoryProcessor.class.getName());
	
	public void process(Exchange exchange) throws Exception {
		String messagePrefix = exchange.getExchangeId()+":";
		
		log.debug(messagePrefix+"authnDirectory processor");

		exchange.getIn().removeHeaders("*");		
		@SuppressWarnings("unchecked")
		Map<String,Object> authnBody = (HashMap<String,Object>)exchange.getIn().getBody(HashMap.class);
		if (authnBody == null) {
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 500);
			log.debug(messagePrefix+"authnDirectory processor headers:"+exchange.getIn().getHeaders());
			log.debug(messagePrefix+"autauthnDirectoryhn processor ended");
		}
		else if (authnBody.get("tokenId") != null) {
			log.info(messagePrefix+"authnDirectory processor authenticate:true");
			String authnToken = (String)authnBody.get("tokenId");
			exchange.setProperty(ApiProxyAuthRouter.PROPERTY_AUTHN_TOKEN, authnToken);
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 200);
		}
		else if (authnBody.get("tokenId") == null) {
			log.info(messagePrefix+"authnDirectory processor authenticate:false");
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 401);
			log.debug(messagePrefix+"authnDirectory processor headers:"+exchange.getIn().getHeaders());
			log.debug(messagePrefix+"authnDirectory processor ended");
		}
		else {
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 400);
			log.debug(messagePrefix+"authnDirectory processor headers:"+exchange.getIn().getHeaders());
			log.debug(messagePrefix+"authnDirectory processor ended");
		}
		exchange.getIn().setBody(null);
		
		log.debug(messagePrefix+"authnDirectory processor ended");
	}
	
}
