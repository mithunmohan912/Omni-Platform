package com.csc.eip.processor;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

public class ProxyPostProcessor implements Processor {
	
	static Logger log = Logger.getLogger(ProxyPostProcessor.class.getName());

	private String messagePrefix;
	private Map<String,String> customHeaders;
	
	public void process(Exchange exchange) throws Exception {
		messagePrefix = exchange.getExchangeId()+":";
		
		log.debug(messagePrefix+"proxy postprocess");
		
		removeCustomHeaders(exchange);
		
		log.debug(messagePrefix+"proxy postprocess ended");
	}

	private void removeCustomHeaders(Exchange exchange) {
		if (customHeaders != null) {
			log.debug(messagePrefix+"remove custom headers");
    		for (Iterator<Entry<String,String>> it=customHeaders.entrySet().iterator(); it.hasNext(); ) {
    			Entry<String,String> entry = it.next();
	    		exchange.getIn().removeHeader(entry.getKey());
    		}
		}
	}
	
    public Map<String,String> getCustomHeaders() {
		return customHeaders;
	}

	public void setCustomHeaders(Map<String,String> customHeaders) {
		this.customHeaders = customHeaders;
	}

	
}
