package com.csc.eip.processor;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

public class ProxyPostProcessor implements Processor {
	
	static Logger log = Logger.getLogger(ProxyPostProcessor.class.getName());

	private Map<String,String> customHeaders;
	
	public void process(Exchange exchange) throws Exception {
		preprocess();
		
		removeCustomHeaders(exchange);
		
		postprocess();
	}

	private void removeCustomHeaders(Exchange exchange) {
		if (customHeaders != null) {
			log.debug("remove custom headers");
    		for (Iterator<Entry<String,String>> it=customHeaders.entrySet().iterator(); it.hasNext(); ) {
    			Entry<String,String> entry = it.next();
	    		exchange.getIn().removeHeader(entry.getKey());
    		}
		}
	}
	
	private void preprocess() {
		log.debug("proxy postprocess");
	}
	
	private void postprocess() {
		log.debug("proxy postprocess ended");
	}
	
    public Map<String,String> getCustomHeaders() {
		return customHeaders;
	}

	public void setCustomHeaders(Map<String,String> customHeaders) {
		this.customHeaders = customHeaders;
	}

	
}
