package com.csc.eip.route;

import java.util.Map;

import org.apache.camel.builder.RouteBuilder;

import com.csc.eip.processor.ProxyPostProcessor;
import com.csc.eip.processor.ProxyPreProcessor;
import com.csc.eip.processor.RequestMessageProcessor;
import com.csc.eip.processor.ResponseHeadersProcessor;
import com.csc.eip.processor.ResponseMessageProcessor;

/**
 * Proxy HTTP Service for SoR REST API
 */
public class ApiProxyRouter extends RouteBuilder {

	private String apiProxyEndpoint;
	private String apiProxyRoute;
	private Map<String,String> customHeaders;
	private Map<String,String> apiEndpointRefs;

	@Override
    public void configure() throws Exception {
		
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

        from("jetty:http://0.0.0.0:8888/ocintegration/proxy" + apiProxyRoute + "?matchOnUriPrefix=true")
        
        	.log("${header.CamelServletContextPath} route")
        	//.log("headers:${headers}")
        	
//        	.choice()
//	        	.when(simple("${in.header.CamelHttpMethod} =~ 'POST' || ${in.header.CamelHttpMethod} =~ 'PATCH' || ${in.header.CamelHttpMethod} =~ 'PUT'"))
//		        	// content based router: HTTP Method POST/PATCH/PUT"
//		        	// translate request message
//	        		.process(requestMessageProcessor)
//		        .end()
		        
		    // proxy
		    .log("${header.CamelHttpMethod} " + apiProxyEndpoint + "${header.CamelHttpPath} proxy")
		    .process(proxyPreProcessor)
		    .log("proxy process")
		    .log("privateUriPrefixHttp4: " + apiProxyEndpoint)
        	.to(apiProxyEndpoint + "?bridgeEndpoint=true&throwExceptionOnFailure=false")
        	.process(proxyPostProcessor)
		    .log("${header.CamelHttpMethod} " + apiProxyEndpoint + "${header.CamelHttpPath} proxy ended")
		    
		    // translate response headers
		    .process(responseHeadersProcessor)
		    
		    .choice()
		    	.when(simple("${in.body} != null && ${in.headers.Content-Type} contains 'json'"))
			    	// translate response message
				    .convertBodyTo(String.class)
				    .process(responseMessageProcessor)
				.end()
		    	    
        	//.log("headers:${headers}")
        	.log("${header.CamelServletContextPath} route ended");
        
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
