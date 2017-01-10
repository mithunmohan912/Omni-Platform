package com.csc.eip.processor;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

import com.csc.eip.route.ApiProxyAuthRouter;
import com.csc.eip.route.PolicyAdminAuthnRouter;

public class PolicyAdminAuthnPostProcessor implements Processor {
	
	static Logger log = Logger.getLogger(PolicyAdminAuthnPostProcessor.class.getName());

	private PolicyAdminAuthnRouter policyAdminAuthnRouter;
	
	public void process(Exchange exchange) throws Exception {
		String messagePrefix = exchange.getExchangeId()+":";
		
		log.debug(messagePrefix+"policyadminauthn postprocessor");
		
		String authnToken = exchange.getProperty(ApiProxyAuthRouter.PROPERTY_AUTHN_TOKEN, String.class);
		exchange.setProperty(ApiProxyAuthRouter.PROPERTY_POLICYADMIN_TOKEN, authnToken);
		if (!policyAdminAuthnRouter.getAuthnToken().equals(authnToken)) {
			log.info(messagePrefix+"policyadminauthn postprocessor cache authnToken");
			policyAdminAuthnRouter.setAuthnToken(authnToken);
		}
		
    	log.debug(messagePrefix+"policyadminauthn postprocessor ended");
	}
	
	public void setPolicyAdminAuthRouter(PolicyAdminAuthnRouter policyAdminAuthnRouter) {
		this.policyAdminAuthnRouter = policyAdminAuthnRouter;
	}

}
