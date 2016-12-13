package com.csc.eip.route;

import java.util.Map;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;

import com.csc.eip.processor.ProxyPostProcessor;
import com.csc.eip.processor.ProxyPreProcessor;
import com.csc.eip.processor.ResponseHeadersProcessor;
import com.csc.eip.processor.ResponseMessageProcessor;

/**
 * API Proxy Service for SOR API
 */
public class ApiProxyRouter extends RouteBuilder {

	private String apiProxyEndpoint;
	private String apiProxyRoute;
	private Map<String,String> customHeaders;
	private Map<String,String> apiEndpointRefs;
	
	@Override
    public void configure() throws Exception {
		
		//* TODO translate request message 
//		RequestMessageProcessor requestMessageProcessor = new RequestMessageProcessor();
//		requestMessageProcessor.setApiEndpointRefs(apiEndpointRefs);

		ProxyPreProcessor proxyPreProcessor = new ProxyPreProcessor();
		proxyPreProcessor.setCustomHeaders(customHeaders);

		ProxyPostProcessor proxyPostProcessor = new ProxyPostProcessor();
		proxyPostProcessor.setCustomHeaders(customHeaders);

		ResponseHeadersProcessor responseHeadersProcessor = new ResponseHeadersProcessor();
		responseHeadersProcessor.setApiEndpointRefs(apiEndpointRefs);

		ResponseMessageProcessor responseMessageProcessor = new ResponseMessageProcessor();
		responseMessageProcessor.setApiEndpointRefs(apiEndpointRefs);

		
        from("jetty:http://0.0.0.0:8888/ocintegration/proxy"+apiProxyRoute+"?matchOnUriPrefix=true")
        
        	.log(LoggingLevel.INFO, "${exchangeId}:route:${header.CamelServletContextPath}")
		    .log(LoggingLevel.DEBUG, "${exchangeId}:apiProxyRoute:"+apiProxyRoute)
		    .log(LoggingLevel.DEBUG, "${exchangeId}:apiProxyEndpoint:"+apiProxyEndpoint)
    		.log(LoggingLevel.INFO, "${exchangeId}:proxy:${header.CamelHttpMethod} ${header.CamelHttpUri}")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:route request headers:${headers}")
        	
        	.choice()
        		.when(simple("${in.header.CamelHttpMethod} =~ 'OPTIONS'"))
        			.log(LoggingLevel.DEBUG, "${exchangeId}:auth process skipped - OPTIONS request")
        		.otherwise()
        			.to("direct:apiProxyAuthRouter")
        		.end()
        	
        	//* TODO translate request message?
//        	.choice()
//	        	.when(simple("${in.header.CamelHttpMethod} =~ 'POST' || ${in.header.CamelHttpMethod} =~ 'PATCH' || ${in.header.CamelHttpMethod} =~ 'PUT'"))
//		        	// content based router: HTTP Method POST/PATCH/PUT"
//		        	// translate request message
//	        		.process(requestMessageProcessor)
//		        .end()
		        
		    // proxy
		    .log(LoggingLevel.DEBUG, "${exchangeId}:api:${header.CamelHttpMethod} "+apiProxyEndpoint+"${header.CamelHttpPath}")
		    .process(proxyPreProcessor)
		    .log(LoggingLevel.INFO, "${exchangeId}:api request:${header.CamelHttpMethod} "+apiProxyEndpoint+"${header.CamelHttpPath}")
        	.to(apiProxyEndpoint+"?bridgeEndpoint=true&throwExceptionOnFailure=false")
        	.log(LoggingLevel.INFO, "${exchangeId}:api response:${header.CamelHttpResponseCode} ${header.CamelHttpResponseText}")
		    .log(LoggingLevel.DEBUG, "${exchangeId}:api request:${header.CamelHttpMethod} "+apiProxyEndpoint+"${header.CamelHttpPath} ended")
        	.process(proxyPostProcessor)
		    .log(LoggingLevel.DEBUG, "${exchangeId}:api:${header.CamelHttpMethod} "+apiProxyEndpoint+"${header.CamelHttpPath} ended")
        	.log(LoggingLevel.DEBUG, "${exchangeId}:headers:${headers}")
		    
		    // translate response headers
		    .process(responseHeadersProcessor)
		    
		    .choice()
		    	.when(simple("${in.body} != null && ${in.headers.Content-Type} contains 'json'"))
			    	// translate response message
				    .convertBodyTo(String.class)
				    .process(responseMessageProcessor)
				.end()
		    	    
    		.log(LoggingLevel.INFO, "${exchangeId}:proxy:${header.CamelHttpMethod} ${header.CamelHttpUri} ended")
        	.log(LoggingLevel.INFO, "${exchangeId}:route:${header.CamelServletContextPath} ended")
    		.log(LoggingLevel.DEBUG, "${exchangeId}:headers:${headers}");
        
    }

	public String getApiProxyEndpoint() {
		return apiProxyEndpoint;
	}

	public void setApiProxyEndpoint(String apiProxyEndpoint) {
		this.apiProxyEndpoint = apiProxyEndpoint;
	}

	public String getApiProxyRoute() {
		return apiProxyRoute;
	}

	public void setApiProxyRoute(String apiProxyRoute) {
		this.apiProxyRoute = apiProxyRoute;
	}

    public Map<String,String> getCustomHeaders() {
		return customHeaders;
	}

	public void setCustomHeaders(Map<String,String> customHeaders) {
		this.customHeaders = customHeaders;
	}

    public Map<String,String> getApiEndpointRefs() {
		return apiEndpointRefs;
	}

	public void setApiEndpointRefs(Map<String,String> apiEndpointRefs) {
		this.apiEndpointRefs = apiEndpointRefs;
	}

}
