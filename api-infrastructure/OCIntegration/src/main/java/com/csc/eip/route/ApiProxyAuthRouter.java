package com.csc.eip.route;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;

import com.csc.eip.processor.ProxyAuthPostProcessor;
import com.csc.eip.processor.ProxyAuthPreProcessor;

/**
 * AuthN/AuthZ Service for API Proxy
 */
public class ApiProxyAuthRouter extends RouteBuilder {

	//* TODO FIXME constants
	public static final String HEADER_SERVER				= "Server";
	public static final String HEADER_CONTENT_TYPE			= "Content-Type";

	public static final String HEADER_IBM_CLIENT_ID			= "X-IBM-Client-Id";
	public static final String HEADER_IBM_CLIENT_SECRET		= "X-IBM-Client-Secret";
	public static final String HEADER_FORGEROCK_USERNAME	= "X-OpenAM-Username";
	public static final String HEADER_FORGEROCK_PASSWORD	= "X-OpenAM-Password";
	public static final String HEADER_FORGEROCK_TOKEN_ID	= "iPlanetDirectoryPro";

	public static final String PROPERTY_SERVER_OCINTEGRATOR = "OCIntegrator";
	public static final String PROPERTY_PROXY_HEADERS		= "proxyHeaders";
	public static final String PROPERTY_PROXY_BODY			= "proxyBody";
	public static final String PROPERTY_AUTHN_TOKEN			= "authnToken";
	public static final String PROPERTY_POLICYADMIN_TOKEN	= "policyAdminToken";
	public static final String PROPERTY_AUTHZ_APPLICATION	= "APIPolicyApplication";

	public static final String PROPERTY_IBM_CLIENT_ID		= "dc1809ba-d09f-4d9f-ae9c-304a7ff6fc88";
	public static final String PROPERTY_IBM_CLIENT_SECRET	= "pK8eC3cQ4rD1pV0cC1dQ6uX3mQ5cP2qI1lQ6xG0fS1yP7sA2nN";
	public static final String PROPERTY_POLICYADMIN_USERNAME = "********";
	public static final String PROPERTY_POLICYADMIN_PASSWORD = "********";
	
	public static final String URL_AUTHN = "https4://api.us.apiconnect.ibmcloud.com/csc-insurance-api-development/omnichannel-dev";
	public static final String URL_AUTHN_TOKEN = URL_AUTHN+"/sessions?_action=validate";
	public static final String URL_AUTHN_DIRECTORY = URL_AUTHN+"/authenticate";
	public static final String URL_AUTHZ = URL_AUTHN+"/policies?_action=evaluate";

	@Override
    public void configure() throws Exception {
		
		ProxyAuthPreProcessor proxyAuthPreProcessor = new ProxyAuthPreProcessor();		
		ProxyAuthPostProcessor proxyAuthPostProcessor = new ProxyAuthPostProcessor();
		
        from("direct:apiProxyAuthRouter")
        
		    .log(LoggingLevel.DEBUG, "${exchangeId}:auth process")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:auth process headers:${headers}")
        	.process(proxyAuthPreProcessor)

		    // authN
        	.to("direct:authnTokenRouter")
        	.choice()
		    	.when(simple("${in.header.CamelHttpResponseCode} != 200"))
		    		.log(LoggingLevel.INFO, "${exchangeId}:authnToken process failed:${header.CamelHttpResponseCode}")
		    		.log(LoggingLevel.INFO, "${exchangeId}:route:${exchangeProperty.proxyHeaders[CamelServletContextPath]} ended")
		    		.stop()
		    	.end()
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnToken process:${header.CamelHttpResponseCode}")

        	.process(proxyAuthPostProcessor)
        	.log(LoggingLevel.DEBUG, "${exchangeId}:auth process headers:${headers}")
		    .log(LoggingLevel.DEBUG, "${exchangeId}:auth process ended");
    }

}
