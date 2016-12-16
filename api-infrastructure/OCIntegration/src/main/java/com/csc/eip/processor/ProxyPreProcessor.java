package com.csc.eip.processor;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.StringTokenizer;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

public class ProxyPreProcessor implements Processor {
	
	//* TODO FIXME constants
	private static final String HEADER_CAMEL_HTTP_QUERY		= "CamelHttpQuery";
	
	private static final String PARAM_CLIENT_ID				= "client_id";
	private static final String PARAM_CLIENT_SECRET			= "client_secret";

	static Logger log = Logger.getLogger(ProxyPreProcessor.class.getName());

	private String messagePrefix;
	private Map<String,String> customHeaders;
	
	public void process(Exchange exchange) throws Exception {
		messagePrefix = exchange.getExchangeId()+":";
				
		log.debug(messagePrefix+"proxy preprocess");
		
		setCustomHeaders(exchange);
		
		//* TODO FIXME remove params
		removeQueryParam(exchange, PARAM_CLIENT_ID);
		removeQueryParam(exchange, PARAM_CLIENT_SECRET);
		
		log.debug(messagePrefix+"proxy preprocess ended");
	}

	private void setCustomHeaders(Exchange exchange) {
		if (customHeaders != null) {
			log.debug(messagePrefix+"set custom headers");
    		for (Iterator<Entry<String,String>> it=customHeaders.entrySet().iterator(); it.hasNext(); ) {
    			Entry<String,String> entry = it.next();
    			log.debug(messagePrefix+"set header " + entry.getKey() + " : " + entry.getValue());
	    		exchange.getIn().setHeader(entry.getKey(), entry.getValue());
    		}
		}
	}
	
	private void removeQueryParam(Exchange exchange, String param) {
		String oldHeader = (String) exchange.getIn().getHeader(param);
		if (oldHeader != null) {
			log.debug(messagePrefix+"remove " + param + " query param");
			log.debug(messagePrefix+"remove " + param + " header");
			log.debug(messagePrefix+"old header " + param + " : " + oldHeader);
			exchange.getIn().removeHeader(param);
			log.debug(messagePrefix+"new header " + param + " : " + exchange.getIn().getHeader(param));
			log.debug(messagePrefix+"remove " + param + " header ended");
			
			log.debug(messagePrefix+"update header " + HEADER_CAMEL_HTTP_QUERY);
			String oldQuery = (String)exchange.getIn().getHeader(HEADER_CAMEL_HTTP_QUERY);
			log.debug(messagePrefix+"old header " + HEADER_CAMEL_HTTP_QUERY + " : " + oldQuery);
			String newQuery = "";
			StringTokenizer tokenizer = new StringTokenizer(oldQuery, "&");
			for (;tokenizer.hasMoreTokens();) {
				String query = tokenizer.nextToken();
				if (query.startsWith(param+"="))
					continue;
				if (newQuery != "")
					newQuery = newQuery + "&" + query;
				else
					newQuery = query;
			}
			exchange.getIn().setHeader(HEADER_CAMEL_HTTP_QUERY, newQuery);
			log.debug(messagePrefix+"new header " + HEADER_CAMEL_HTTP_QUERY + " : " + exchange.getIn().getHeader(HEADER_CAMEL_HTTP_QUERY));
			log.debug(messagePrefix+"update header " + HEADER_CAMEL_HTTP_QUERY + " ended");
			log.debug(messagePrefix+"remove " + param + " query param ended");
		}
	}
	
    public Map<String,String> getCustomHeaders() {
		return customHeaders;
	}

	public void setCustomHeaders(Map<String,String> customHeaders) {
		this.customHeaders = customHeaders;
	}

	
}
