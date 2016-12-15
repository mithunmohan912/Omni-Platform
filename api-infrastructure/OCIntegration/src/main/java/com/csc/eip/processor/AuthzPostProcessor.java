package com.csc.eip.processor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

import com.csc.eip.route.ApiProxyAuthRouter;

public class AuthzPostProcessor implements Processor {
	
	static Logger log = Logger.getLogger(AuthzPostProcessor.class.getName());

	@SuppressWarnings("unchecked")
	public void process(Exchange exchange) throws Exception {
		String messagePrefix = exchange.getExchangeId()+":";

		log.debug(messagePrefix+"authz postprocessor");
		
		exchange.getIn().removeHeaders("*");

		ArrayList<Object> authzBody = (ArrayList<Object>)exchange.getIn().getBody(ArrayList.class);
		if (authzBody == null || authzBody.get(0) == null || ((HashMap<String,Object>)authzBody.get(0)).get("actions") == null) {
			exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 500);
			exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_SERVER, ApiProxyAuthRouter.PROPERTY_SERVER_OCINTEGRATOR);
			exchange.getIn().setBody(null);
		}
		else {
			Map<String,Object> actions = (HashMap<String,Object>)((HashMap<String,Object>)authzBody.get(0)).get("actions");
			String method = (String)exchange.getProperty(ApiProxyAuthRouter.PROPERTY_PROXY_HEADERS, HashMap.class).get(Exchange.HTTP_METHOD);
			if (method == null || actions.get(method) == null) {
				exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 500);
				exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_SERVER, ApiProxyAuthRouter.PROPERTY_SERVER_OCINTEGRATOR);
				exchange.getIn().setBody(null);
			}
			else if (actions.get(method).equals(true)) {
				log.info(messagePrefix+"authz postprocessor evaluate:"+method+":true");
				exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 200);
			}
			else if (actions.get(method).equals(false)) {
				log.info(messagePrefix+"authz process evaluate:"+method+":false");
				exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 401);
				exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_SERVER, ApiProxyAuthRouter.PROPERTY_SERVER_OCINTEGRATOR);
				exchange.getIn().setBody(null);
			}
			else {
				exchange.getIn().setHeader(Exchange.HTTP_RESPONSE_CODE, 500);
				exchange.getIn().setHeader(ApiProxyAuthRouter.HEADER_SERVER, ApiProxyAuthRouter.PROPERTY_SERVER_OCINTEGRATOR);
				exchange.getIn().setBody(null);
			}
		}
		
		log.debug(messagePrefix+"authz postprocessor headers:"+exchange.getIn().getHeaders());
		log.debug(messagePrefix+"authz postprocessor ended");
	}
	
}
