package com.csc.eip.route;

import org.apache.camel.Exchange;
import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jackson.JacksonDataFormat;

import com.csc.eip.processor.AuthnDirectoryProcessor;

/**
 * Directory-based AuthN Service
 */
public class AuthnDirectoryRouter extends RouteBuilder {

	@Override
    public void configure() throws Exception {
		
		JacksonDataFormat dataFormat = new JacksonDataFormat();
		
		AuthnDirectoryProcessor authnDirectoryProcessor = new AuthnDirectoryProcessor();
		
        from("direct:authnDirectoryRouter")
        
		    // authN
        	// directory-based authN
		    .log(LoggingLevel.DEBUG, "${exchangeId}:authnDirectory process")
		    .setHeader(Exchange.HTTP_METHOD).constant("POST")
		    //* TODO FIXME properties
		    .setHeader(ApiProxyAuthRouter.HEADER_IBM_CLIENT_ID).simple("${exchangeProperty.X-IBM-Client-Id}")
		    .setHeader(ApiProxyAuthRouter.HEADER_IBM_CLIENT_SECRET).simple("${exchangeProperty.X-IBM-Client-Secret}")
		    .setHeader(ApiProxyAuthRouter.HEADER_FORGEROCK_USERNAME).simple("${exchangeProperty.X-OpenAM-Username}")
		    .setHeader(ApiProxyAuthRouter.HEADER_FORGEROCK_PASSWORD).simple("${exchangeProperty.X-OpenAM-Password}")
		    .setHeader(ApiProxyAuthRouter.HEADER_CONTENT_TYPE).constant("application/json")
		    .setBody().constant(null)
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnDirectory request headers:${headers}")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnDirectory request")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnDirectory request url:"+ApiProxyAuthRouter.URL_AUTHN_DIRECTORY)
        	.to(ApiProxyAuthRouter.URL_AUTHN_DIRECTORY)
		    .log(LoggingLevel.DEBUG, "${exchangeId}:authnDirectory request ended")
        	.log(LoggingLevel.INFO, "${exchangeId}:authnDirectory response:${header.CamelHttpResponseCode} ${header.CamelHttpResponseText}")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnDirectory response headers:${headers}")
   			.log(LoggingLevel.DEBUG, "${exchangeId}:authnDirectory response body:${body}")
   			.unmarshal(dataFormat)
		    .process(authnDirectoryProcessor)
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnDirectory process headers:${headers}")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authnDirectory process ended");
    }

}
