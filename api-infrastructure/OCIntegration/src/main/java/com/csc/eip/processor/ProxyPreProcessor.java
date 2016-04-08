package com.csc.eip.processor;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

public class ProxyPreProcessor implements Processor {
	
	static Logger log = Logger.getLogger(ProxyPreProcessor.class.getName());

	private Map<String,String> customHeaders;
	
	public void process(Exchange exchange) throws Exception {
		preprocess();
		
		addCustomHeaders(exchange);
		
		postprocess();
	}

	private void addCustomHeaders(Exchange exchange) {
		if (customHeaders != null) {
			log.debug("add custom headers");
    		for (Iterator<Entry<String,String>> it=customHeaders.entrySet().iterator(); it.hasNext(); ) {
    			Entry<String,String> entry = it.next();
	    		exchange.getIn().setHeader(entry.getKey(), entry.getValue());
    		}
		}
	}
	
	private void preprocess() {
		log.debug("proxy preprocess");
	}
	
	private void postprocess() {
		log.debug("proxy preprocess ended");
	}
	
    public Map<String,String> getCustomHeaders() {
		return customHeaders;
	}

	public void setCustomHeaders(Map<String,String> customHeaders) {
		this.customHeaders = customHeaders;
	}

	
}
