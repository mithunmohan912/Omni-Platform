package com.csc.eip.processor;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

public class RequestMessageProcessor implements Processor {
	
	static Logger log = Logger.getLogger(RequestMessageProcessor.class.getName());

	private Map<String,String> apiEndpointRefs;
	private String regex;
	private String replacement;
	
	public void process(Exchange exchange) throws Exception {
		preprocess();
		
		for (Iterator<Entry<String,String>> it=apiEndpointRefs.entrySet().iterator(); it.hasNext(); ) {
			Entry<String,String> entry = it.next();
    		replacement = entry.getKey();
    		regex = entry.getValue();
    		subprocess(exchange);
		}
		
		postprocess();
	}
	
	private void subprocess(Exchange exchange) throws Exception {
		if (regex == null || regex.trim().isEmpty())
			log.error("regex is invalid");
		log.debug("regex: " + regex);

		if (replacement == null || replacement.trim().isEmpty())
			log.error("replacement is invalid");
		log.debug("replacement: " + replacement);

		Pattern pattern = Pattern.compile(regex);
		
		String message = exchange.getIn().getBody(String.class);
		
		Matcher matcher = pattern.matcher(message);
		message = matcher.replaceAll(replacement);

		exchange.getIn().setBody(message);
	}

	private void preprocess() {
		log.info("translate request message");
	}
	
	private void postprocess() {
		log.debug("translate request message ended");
	}
	
    public Map<String,String> getApiEndpointRefs() {
		return apiEndpointRefs;
	}

	public void setApiEndpointRefs(Map<String,String> apiEndpointRefs) {
		this.apiEndpointRefs = apiEndpointRefs;
	}

	public String getRegex() {
		return regex;
	}

	public void setRegex(String regex) {
		this.regex = regex;
	}

	public String getReplacement() {
		return replacement;
	}

	public void setReplacement(String replacement) {
		this.replacement = replacement;
	}
	
}
