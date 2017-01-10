package com.csc.eip.route;

import org.apache.camel.Exchange;
import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jackson.JacksonDataFormat;

import com.csc.eip.processor.AuthnTokenProcessor;

/**
 * Token-based AuthN Service
 */
public class AuthnTokenRouter extends RouteBuilder {

	@Override
    public void configure() throws Exception {
		
		JacksonDataFormat dataFormat = new JacksonDataFormat();
		
		AuthnTokenProcessor authnTokenProcessor = new AuthnTokenProcessor();
		
        from("direct:authnTokenRouter")
        
		    // authN
        	// token-based authN
		    .log(LoggingLevel.DEBUG, "${exchangeId}:authnToken process")
		    .setHeader(Exchange.HTTP_METHOD).constant("POST")
		    //* TODO FIXME properties
		    .setHeader(ApiProxyAuthRouter.HEADER_IBM_CLIENT_ID).simple("${exchangeProperty.X-IBM-Client-Id}")
		    .setHeader(ApiProxyAuthRouter.HEADER_IBM_CLIENT_SECRET).simple("${exchangeProperty.X-IBM-Client-Secret}")
		    .setHeader(ApiProxyAuthRouter.HEADER_FORGEROCK_TOKEN_ID).simple("${exchangeProperty.authnToken}")
		    .setHeader(ApiProxyAuthRouter.HEADER_CONTENT_TYPE).constant("application/json")
		    .setBody().constant(null)
        	.choice()
        		.when(simple("${in.header.iPlanetDirectoryPro} != null"))
		        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnToken request headers:${headers}")
		        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnToken request")
		        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnToken request url:"+ApiProxyAuthRouter.URL_AUTHN_TOKEN)
		        	.to(ApiProxyAuthRouter.URL_AUTHN_TOKEN)
				    .log(LoggingLevel.DEBUG, "${exchangeId}:authnToken request ended")
		        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnToken response:${header.CamelHttpResponseCode} ${header.CamelHttpResponseText}")
		        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnToken response headers:${headers}")
		   			.log(LoggingLevel.DEBUG, "${exchangeId}:authnToken response body:${body}")
		   			.unmarshal(dataFormat)
		   		.end()
		    .process(authnTokenProcessor)
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnToken process headers:${headers}")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnToken process ended");
    }

}
