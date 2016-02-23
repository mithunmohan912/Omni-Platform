package com.csc.eip.route;

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

	private String publicUriPrefix;
	private String privateUriPrefix;
	private String proxyUriPrefix;

    @Override
    public void configure() throws Exception {
		
        //MessageTranslatorProcessor messageTranslatorProcessor = new MessageTranslatorProcessor();
        
        from("servlet:proxy" + proxyUriPrefix + "?matchOnUriPrefix=true")
        	.log("${header.CamelServletContextPath} route started")
        	//.log("headers:${headers}")
        	.choice()
	        	.when(simple("${in.header.CamelHttpMethod} =~ 'POST' || ${in.header.CamelHttpMethod} =~ 'PATCH' || ${in.header.CamelHttpMethod} =~ 'PUT'"))
		        	.log("content based router: HTTP Method POST/PATCH/PUT")
		        	//.setHeader(MessageTranslator.PATTERN).constant(publicUriPrefix).setHeader(MessageTranslator.REPLACEMENT).constant(privateUriPrefix).process(messageTranslatorProcessor)
				    .process(new Processor() {
				    	public void process(Exchange exchange) throws Exception {
				    		Series<Header> headers = new Series<Header>(Header.class);
				    		headers.add(new Header(MessageTranslator.PATTERN, publicUriPrefix));
				    		headers.add(new Header(MessageTranslator.REPLACEMENT, privateUriPrefix));
				    		exchange.getIn().setHeader(HeaderConstants.ATTRIBUTE_HEADERS, headers);
				    	}
				    })
		        	//.log("headers:${headers}")
		        	.to("restlet:http://localhost:8080/ocintegration/messageTranslator?restletMethod=post")
		 		    //.removeHeader(MessageTranslator.PATTERN).removeHeader(MessageTranslator.REPLACEMENT)
				    .removeHeader(HeaderConstants.ATTRIBUTE_HEADERS)
		        .end()
		    .log("${header.CamelHttpMethod} " + privateUriPrefix + "${header.CamelHttpPath} proxy started")
        	//.setHeader("NSP_USERID").constant("cscusr1")
        	.to(privateUriPrefix + "?bridgeEndpoint=true&throwExceptionOnFailure=false")
		    .log("${header.CamelHttpMethod} " + privateUriPrefix + "${header.CamelHttpPath} proxy ended")
        	//.setHeader(MessageTranslator.PATTERN).constant(privateUriPrefix).setHeader(MessageTranslator.REPLACEMENT).constant(publicUriPrefix).process(messageTranslatorProcessor)
		    .process(new Processor() {
		    	public void process(Exchange exchange) throws Exception {
		    		Series<Header> headers = new Series<Header>(Header.class);
		    		headers.add(new Header(MessageTranslator.PATTERN, privateUriPrefix));
		    		headers.add(new Header(MessageTranslator.REPLACEMENT, publicUriPrefix));
		    		exchange.getIn().setHeader(HeaderConstants.ATTRIBUTE_HEADERS, headers);
		    	}
		    })
        	//.log("headers:${headers}")
        	.to("restlet:http://localhost:8080/ocintegration/messageTranslator?restletMethod=post")
		    //.removeHeader(MessageTranslator.PATTERN).removeHeader(MessageTranslator.REPLACEMENT)
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

}
