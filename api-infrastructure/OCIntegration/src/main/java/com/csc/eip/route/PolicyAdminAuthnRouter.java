package com.csc.eip.route;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;

import com.csc.eip.processor.PolicyAdminAuthnPostProcessor;
import com.csc.eip.processor.PolicyAdminAuthnPreProcessor;

/**
 * PolicyAdmin AuthN Service
 */
public class PolicyAdminAuthnRouter extends RouteBuilder {

	private String authnToken = "token";
	 
	@Override
    public void configure() throws Exception {
		
		PolicyAdminAuthnPreProcessor policyAdminAuthnPreProcessor = new PolicyAdminAuthnPreProcessor();
		policyAdminAuthnPreProcessor.setPolicyAdminAuthRouter(this);
		
		PolicyAdminAuthnPostProcessor policyAdminAuthnPostProcessor = new PolicyAdminAuthnPostProcessor();
		policyAdminAuthnPostProcessor.setPolicyAdminAuthRouter(this);
		
        from("direct:policyAdminAuthnRouter")
        
		    .log(LoggingLevel.DEBUG, "${exchangeId}:policyadminauthn process")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:policyadminauthn process headers:${headers}")
        	.process(policyAdminAuthnPreProcessor)
        	.log(LoggingLevel.DEBUG, "${exchangeId}:policyadminauthn process headers:${headers}")

		    // policyAdmin token-based authN
        	.to("direct:authnTokenRouter")
        	.choice()
		    	.when(simple("${in.header.CamelHttpResponseCode} != 200"))
		    		.log(LoggingLevel.INFO, "${exchangeId}:policyadminauthn authnToken process failed:${header.CamelHttpResponseCode}")
		    	.end()
        	.log(LoggingLevel.DEBUG, "${exchangeId}:policyadminauthn authnToken process:${header.CamelHttpResponseCode}")

		    // policyAdmin directory-based authN
        	.choice()
		    	.when(simple("${in.header.CamelHttpResponseCode} != 200"))
				    .setProperty(ApiProxyAuthRouter.HEADER_FORGEROCK_USERNAME).constant(ApiProxyAuthRouter.PROPERTY_POLICYADMIN_USERNAME)
				    .setProperty(ApiProxyAuthRouter.HEADER_FORGEROCK_PASSWORD).constant(ApiProxyAuthRouter.PROPERTY_POLICYADMIN_PASSWORD)
		    		.to("direct:authnDirectoryRouter")
		    	.end()
		    	
        	.choice()
		    	.when(simple("${in.header.CamelHttpResponseCode} != 200"))
		    		.setHeader(ApiProxyAuthRouter.HEADER_SERVER).constant(ApiProxyAuthRouter.PROPERTY_SERVER_OCINTEGRATOR)
		    		.log(LoggingLevel.INFO, "${exchangeId}:policyadminauthn authnDirectory process failed:${header.CamelHttpResponseCode}")
		    		.log(LoggingLevel.INFO, "${exchangeId}:route:${exchangeProperty.proxyHeaders[CamelServletContextPath]} ended")
		    		.stop()
		    	.end()

        	.process(policyAdminAuthnPostProcessor)

        	.log(LoggingLevel.DEBUG, "${exchangeId}:policyadminauthn process headers:${headers}")
		    .log(LoggingLevel.DEBUG, "${exchangeId}:policyadminauthn process ended");
    }

	public String getAuthnToken() {
		return authnToken;
	}

	public void setAuthnToken(String authnToken) {
		this.authnToken = authnToken;
	}
	
}
