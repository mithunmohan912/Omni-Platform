package com.csc.eip.route;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jackson.JacksonDataFormat;
import org.apache.camel.component.jackson.ListJacksonDataFormat;

import com.csc.eip.processor.AuthzPostProcessor;
import com.csc.eip.processor.AuthzPreProcessor;

/**
 * REST-based AuthZ Service
 */
public class AuthzRouter extends RouteBuilder {

	@Override
    public void configure() throws Exception {
		
		JacksonDataFormat dataFormat = new JacksonDataFormat();
		JacksonDataFormat dataFormatList = new ListJacksonDataFormat();
		
		AuthzPreProcessor authzPreProcessor = new AuthzPreProcessor();		
		AuthzPostProcessor authzPostProcessor = new AuthzPostProcessor();
		
        from("direct:authzRouter")
        
		    // authZ
		    // REST-based authZ
		    .log(LoggingLevel.DEBUG, "${exchangeId}:authz process")
        	.process(authzPreProcessor)
        	.marshal(dataFormat)
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authz request headers:${headers}")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authz request body:${body}")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authz request")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authz request url:"+ApiProxyAuthRouter.URL_AUTHZ)
        	.to(ApiProxyAuthRouter.URL_AUTHZ)
		    .log(LoggingLevel.DEBUG, "${exchangeId}:authz request ended")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authz response:${header.CamelHttpResponseCode} ${header.CamelHttpResponseText}")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authz response headers:${headers}")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authz response body:${body}")
        	.unmarshal(dataFormatList)
        	.process(authzPostProcessor)
        	.log(LoggingLevel.DEBUG, "${exchangeId}:authz process headers:${headers}")
		    .log(LoggingLevel.DEBUG, "${exchangeId}:authz process ended");
    }

}
