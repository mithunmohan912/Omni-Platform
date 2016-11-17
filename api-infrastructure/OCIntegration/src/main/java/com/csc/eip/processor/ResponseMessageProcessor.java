package com.csc.eip.processor;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

public class ResponseMessageProcessor implements Processor {
	
	static Logger log = Logger.getLogger(ResponseMessageProcessor.class.getName());

	private Map<String,String> apiEndpointRefs;
	private String regex;
	private String replacement;
	
	public void process(Exchange exchange) throws Exception {
		preprocess();
		
		for (Iterator<Entry<String,String>> it=apiEndpointRefs.entrySet().iterator(); it.hasNext(); ) {
			Entry<String,String> entry = it.next();
    		regex = entry.getKey();
    		replacement = entry.getValue();
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
		
//		log.debug("message: " + message);
		
		Matcher matcher = pattern.matcher(message);
		
		if (!matcher.find(0))
			log.debug("regex not found");
		
		log.debug("replace");
		message = matcher.replaceAll(replacement);
		log.debug("replace ended");

		matcher = pattern.matcher(message);
		if (matcher.find(0))
			log.error("regex found after replace");
		
		exchange.getIn().setBody(message);
	}
	
	private void preprocess() {
		log.info("translate response message");
	}
	
	private void postprocess() {
		log.debug("translate response message ended");
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
