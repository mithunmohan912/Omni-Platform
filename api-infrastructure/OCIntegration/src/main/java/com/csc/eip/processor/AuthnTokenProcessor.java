package com.csc.eip.processor;

import java.util.HashMap;
import java.util.Map;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

import com.csc.eip.route.ApiProxyAuthRouter;

public class AuthnTokenProcessor implements Processor {
	
	static Logger log = Logger.getLogger(AuthnTokenProcessor.class.getName());

	public void process(Exchange exchange) throws Exception {
		String messagePrefix = exchange.getExchangeId()+":";
		
		log.debug(messagePrefix+"authnToken processor");
		
		exchange.getIn().removeHeaders("*");

		String tokenId = (String) exchange.getProperty(ApiProxyAuthRouter.PROPERTY_AUTHN_TOKEN);
		@SuppressWarnings("unchecked")
		Map<String,Object> authnBody = (HashMap<String,Object>)exchange.getIn().getBody(HashMap.class);
		if (tokenId == null) {
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 403);
			exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_SERVER, ApiProxyAuthRouter.PROPERTY_SERVER_OCINTEGRATOR);
			exchange.getIn().setBody(null);
			log.debug(messagePrefix+"authnToken processor headers:"+exchange.getIn().getHeaders());
			log.debug(messagePrefix+"authnToken processor ended");
		}
		else if (authnBody == null || authnBody.get("valid") == null) {
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 500);
			exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_SERVER, ApiProxyAuthRouter.PROPERTY_SERVER_OCINTEGRATOR);
			exchange.getIn().setBody(null);
			log.debug(messagePrefix+"authnToken processor headers:"+exchange.getIn().getHeaders());
			log.debug(messagePrefix+"authnToken processor ended");
		}
		else if (authnBody.get("valid").equals(true)) {
			log.info(messagePrefix+"authnToken processor validate:true");
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 200);
		}
		else if (authnBody.get("valid").equals(false)) {
			log.info(messagePrefix+"authnToken processor validate:false");
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 401);
			exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_SERVER, ApiProxyAuthRouter.PROPERTY_SERVER_OCINTEGRATOR);
			exchange.getIn().setBody(null);
			log.debug(messagePrefix+"authnToken processor headers:"+exchange.getIn().getHeaders());
			log.debug(messagePrefix+"authnToken processor ended");
		}
		else {
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 400);
			exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_SERVER, ApiProxyAuthRouter.PROPERTY_SERVER_OCINTEGRATOR);
			exchange.getIn().setBody(null);
			log.debug(messagePrefix+"authnToken processor headers:"+exchange.getIn().getHeaders());
			log.debug(messagePrefix+"authnToken processor ended");
		}
		
		log.debug(messagePrefix+"authnToken processor ended");
	}
	
}
