package com.csc.eip.route;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.restlet.data.Header;
import org.restlet.engine.header.HeaderConstants;
import org.restlet.util.Series;

import com.csc.eip.pattern.MessageTranslator;

/**
 * Proxy HTTP Service for SoR REST API
 */
public class ApiProxyRouter extends RouteBuilder {

	public static final String HEADER_LINK					= "Link";
	public static final String HEADER_CONTENT_LOCATION		= "Content-Location";
	public static final String HEADER_BODY					= "EIP_Body";

	private String publicUriPrefix;
	private String privateUriPrefix;
	private String proxyUriPrefix;
	private Map<String,String> customHeaders;
	
	@Override
    public void configure() throws Exception {
		
        //MessageTranslatorProcessor messageTranslatorProcessor = new MessageTranslatorProcessor();
        
        from("servlet:proxy" + proxyUriPrefix + "?matchOnUriPrefix=true")
        
        	.log("${header.CamelServletContextPath} route started")
        	//.log("headers:${headers}")
        	
        	.choice()
	        	.when(simple("${in.header.CamelHttpMethod} =~ 'POST' || ${in.header.CamelHttpMethod} =~ 'PATCH' || ${in.header.CamelHttpMethod} =~ 'PUT'"))
		        	// content based router: HTTP Method POST/PATCH/PUT"
		        	// translate request message
		        	.log("translate request message")
				    .process(new Processor() {
				    	public void process(Exchange exchange) throws Exception {
				    		Series<Header> headers = new Series<Header>(Header.class);
				    		headers.add(new Header(MessageTranslator.HEADER_PATTERN, publicUriPrefix));
				    		headers.add(new Header(MessageTranslator.HEADER_REPLACEMENT, privateUriPrefix));
				    		exchange.getIn().setHeader(HeaderConstants.ATTRIBUTE_HEADERS, headers);
				    	}
				    })
		        	//.log("headers:${headers}")
		        	.to("restlet:http://localhost:8080/messageTranslator?restletMethod=post")
				    .removeHeader(HeaderConstants.ATTRIBUTE_HEADERS)
		        .end()
		        
		    // proxy
		    .log("${header.CamelHttpMethod} " + privateUriPrefix + "${header.CamelHttpPath} proxy started")
		    .setHeader("Accept").constant("application/json")
		    // set SoR custom headers
		    .process(new Processor() {
		    	public void process(Exchange exchange) throws Exception {
		    		if (customHeaders != null) {
			    		for (Iterator<Entry<String,String>> it=customHeaders.entrySet().iterator(); it.hasNext(); ) {
			    			Entry<String,String> entry = it.next();
				    		exchange.getIn().setHeader(entry.getKey(), entry.getValue());
			    		}
		    		}
		    	}
		    })
		    // call SoR proxy API
        	.to(privateUriPrefix + "?bridgeEndpoint=true&throwExceptionOnFailure=false")
        	// remove SoR custom headers
		    .process(new Processor() {
		    	public void process(Exchange exchange) throws Exception {
		    		if (customHeaders != null) {
			    		for (Iterator<Entry<String,String>> it=customHeaders.entrySet().iterator(); it.hasNext(); ) {
			    			Entry<String,String> entry = it.next();
				    		exchange.getIn().removeHeader(entry.getKey());
			    		}
		    		}
		    	}
		    })
		    .log("${header.CamelHttpMethod} " + privateUriPrefix + "${header.CamelHttpPath} proxy ended")
		    
		    .choice()
		    	.when(simple("${in.header.Link} != null"))
		        	// content based router: Link header exists
		    		.removeHeader(HEADER_LINK)
//		        	// translate Link header
//		        	.log("translate Link header")
//				    .process(new Processor() {
//				    	public void process(Exchange exchange) throws Exception {
//				    		Series<Header> headers = new Series<Header>(Header.class);
//				    		@SuppressWarnings("unchecked")
//							ArrayList<String> header = (ArrayList<String>) exchange.getIn().getHeader(HEADER_LINK);
//				    		headers.add(new Header(MessageTranslator.HEADER_PATTERN, privateUriPrefix));
//				    		headers.add(new Header(MessageTranslator.HEADER_REPLACEMENT, publicUriPrefix));
//				    		exchange.getIn().setHeader(HeaderConstants.ATTRIBUTE_HEADERS, headers);
//				    		exchange.getIn().setHeader(HEADER_BODY, exchange.getIn().getBody());
//				    		exchange.getIn().setBody(header);
//				    	}
//				    })
//		        	.to("restlet:http://localhost:8080/messageTranslatorHeader?restletMethod=post")
//				    .removeHeader(HeaderConstants.ATTRIBUTE_HEADERS)
//				    .process(new Processor() {
//				    	public void process(Exchange exchange) throws Exception {
//				    		exchange.getIn().setHeader(HEADER_LINK, exchange.getIn().getBody());
//				    		exchange.getIn().setBody(exchange.getIn().getHeader(HEADER_BODY));
//				    		exchange.getIn().removeHeader(HEADER_BODY);
//				    	}
//				    })
//				.end()
					
//		    .choice()
//		    	.when(simple("${in.header.Content-Location} != null"))
//		        	// content based router: Content-Location header exists
//		    		//.removeHeader(HEADER_CONTENT_LOCATION)
//		        	// translate Content-Location header
//		        	.log("translate Content-Location header")
//				    .process(new Processor() {
//				    	public void process(Exchange exchange) throws Exception {
//				    		Series<Header> headers = new Series<Header>(Header.class);
//				    		@SuppressWarnings("unchecked")
//							ArrayList<String> header = (ArrayList<String>) exchange.getIn().getHeader(HEADER_CONTENT_LOCATION);
//				    		headers.add(new Header(MessageTranslator.HEADER_PATTERN, privateUriPrefix));
//				    		headers.add(new Header(MessageTranslator.HEADER_REPLACEMENT, publicUriPrefix));
//				    		exchange.getIn().setHeader(HeaderConstants.ATTRIBUTE_HEADERS, headers);
//				    		exchange.getIn().setHeader(HEADER_BODY, exchange.getIn().getBody());
//				    		exchange.getIn().setBody(header);
//				    	}
//				    })
//		        	.to("restlet:http://localhost:8080/messageTranslatorHeader?restletMethod=post")
//				    .removeHeader(HeaderConstants.ATTRIBUTE_HEADERS)
//				    .process(new Processor() {
//				    	public void process(Exchange exchange) throws Exception {
//				    		exchange.getIn().setHeader(HEADER_CONTENT_LOCATION, exchange.getIn().getBody());
//				    		exchange.getIn().setBody(exchange.getIn().getHeader(HEADER_BODY));
//				    		exchange.getIn().removeHeader(HEADER_BODY);
//				    	}
//				    })
//				.end()
					
        	// translate response message
        	.log("translate response message")
		    .process(new Processor() {
		    	public void process(Exchange exchange) throws Exception {
		    		Series<Header> headers = new Series<Header>(Header.class);
		    		headers.add(new Header(MessageTranslator.HEADER_PATTERN, privateUriPrefix));
		    		headers.add(new Header(MessageTranslator.HEADER_REPLACEMENT, publicUriPrefix));
		    		exchange.getIn().setHeader(HeaderConstants.ATTRIBUTE_HEADERS, headers);
		    	}
		    })
        	//.log("headers:${headers}")
        	.to("restlet:http://localhost:8080/messageTranslator?restletMethod=post")
		    .removeHeader(HeaderConstants.ATTRIBUTE_HEADERS)
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
