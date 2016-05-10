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

	private String publicUriPrefix;
	private String privateUriPrefix;
	private String privateUriPrefixHttp4;
	private String proxyUriPrefix;
	private Map<String,String> customHeaders;
	
	@Override
    public void configure() throws Exception {
		
		RequestMessageProcessor requestMessageProcessor = new RequestMessageProcessor();
		requestMessageProcessor.setRegex(publicUriPrefix);
		requestMessageProcessor.setReplacement(privateUriPrefix);

		ProxyPreProcessor proxyPreProcessor = new ProxyPreProcessor();
		proxyPreProcessor.setCustomHeaders(customHeaders);

		ProxyPostProcessor proxyPostProcessor = new ProxyPostProcessor();
		proxyPostProcessor.setCustomHeaders(customHeaders);

		ResponseHeadersProcessor responseHeadersProcessor = new ResponseHeadersProcessor();
		responseHeadersProcessor.setRegex(privateUriPrefix);
		responseHeadersProcessor.setReplacement(publicUriPrefix);

		ResponseMessageProcessor responseMessageProcessor = new ResponseMessageProcessor();
		responseMessageProcessor.setRegex(privateUriPrefix);
		responseMessageProcessor.setReplacement(publicUriPrefix);

        from("jetty:http://0.0.0.0:8888/ocintegration/proxy" + proxyUriPrefix + "?matchOnUriPrefix=true")
        
        	.log("${header.CamelServletContextPath} route")
        	//.log("headers:${headers}")
        	
//        	.choice()
//	        	.when(simple("${in.header.CamelHttpMethod} =~ 'POST' || ${in.header.CamelHttpMethod} =~ 'PATCH' || ${in.header.CamelHttpMethod} =~ 'PUT'"))
//		        	// content based router: HTTP Method POST/PATCH/PUT"
//		        	// translate request message
//	        		.process(requestMessageProcessor)
//		        .end()
		        
		    // proxy
		    .log("${header.CamelHttpMethod} " + privateUriPrefix + "${header.CamelHttpPath} proxy")
		    .process(proxyPreProcessor)
		    .log("proxy process")
		    .log("privateUriPrefixHttp4: " + privateUriPrefixHttp4)
        	.to(privateUriPrefixHttp4 + "?bridgeEndpoint=true&throwExceptionOnFailure=false")
        	.process(proxyPostProcessor)
		    .log("${header.CamelHttpMethod} " + privateUriPrefix + "${header.CamelHttpPath} proxy ended")
		    
		    // translate response headers
		    .process(responseHeadersProcessor)
		    
		    .choice()
		    	.when(simple("${in.body} != null"))
			    	// translate response message
				    .convertBodyTo(String.class)
				    .process(responseMessageProcessor)
				.end()
		    	    
        	//.log("headers:${headers}")
        	.log("${header.CamelServletContextPath} route ended");
        
    }

	public String getPublicUriPrefix() {
		return publicUriPrefix;
	}

	public void setPublicUriPrefix(String publicUriPrefix) {
		this.publicUriPrefix = publicUriPrefix;
	}

	public String getPrivateUriPrefix() {
		return privateUriPrefix;
	}

	public void setPrivateUriPrefix(String privateUriPrefix) {
		this.privateUriPrefix = privateUriPrefix;
	}

	public String getPrivateUriPrefixHttp4() {
		return privateUriPrefixHttp4;
	}

	public void setPrivateUriPrefixHttp4(String privateUriPrefixHttp4) {
		this.privateUriPrefixHttp4 = privateUriPrefixHttp4;
	}

	public String getProxyUriPrefix() {
		return proxyUriPrefix;
	}

	public void setProxyUriPrefix(String proxyUriPrefix) {
		this.proxyUriPrefix = proxyUriPrefix;
	}

    public Map<String,String> getCustomHeaders() {
		return customHeaders;
	}

	public void setCustomHeaders(Map<String,String> customHeaders) {
		this.customHeaders = customHeaders;
	}

}
