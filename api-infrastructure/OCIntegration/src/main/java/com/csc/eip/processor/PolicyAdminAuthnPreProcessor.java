package com.csc.eip.processor;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

import com.csc.eip.route.ApiProxyAuthRouter;
import com.csc.eip.route.PolicyAdminAuthnRouter;

public class PolicyAdminAuthnPreProcessor implements Processor {
	
	static Logger log = Logger.getLogger(PolicyAdminAuthnPreProcessor.class.getName());

	private PolicyAdminAuthnRouter policyAdminAuthnRouter;
	
	public void process(Exchange exchange) throws Exception {
		String messagePrefix = exchange.getExchangeId()+":";
				
		log.debug(messagePrefix+"policyadminauthn preprocessor");
		
		exchange.getIn().removeHeaders("*");
		exchange.getIn().setBody("");
		exchange.setProperty(ApiProxyAuthRouter.PROPERTY_AUTHN_TOKEN, policyAdminAuthnRouter.getAuthnToken());
		
		log.debug(messagePrefix+"policyadminauthn preprocessor ended");
	}
	
	public PolicyAdminAuthnRouter getPolicyAdminAuthRouter() {
		return policyAdminAuthnRouter;
	}

	public void setPolicyAdminAuthRouter(PolicyAdminAuthnRouter policyAdminAuthnRouter) {
		this.policyAdminAuthnRouter = policyAdminAuthnRouter;
	}

}
