package com.csc.eip.processor;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

public class ResponseHeadersProcessor implements Processor {
	
	public static final String HEADER_LINK					= "Link";
	public static final String HEADER_LOCATION				= "Location";
	public static final String HEADER_CONTENT_LOCATION		= "Content-Location";

	public static final String HEADER_CORS_ALLOW_ORIGIN		= "Access-Control-Allow-Origin";
	public static final String HEADER_CORS_ALLOW_HEADERS	= "Access-Control-Allow-Headers";

	public static final String HEADER_USERNAME				= "Username";

	static Logger log = Logger.getLogger(ResponseHeadersProcessor.class.getName());

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

		defaultHeader(exchange, HEADER_CORS_ALLOW_ORIGIN, "*");
		
		updateHeaderAddElement(exchange, HEADER_CORS_ALLOW_HEADERS, HEADER_USERNAME);
		
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
		
		translateHeader(exchange, pattern, HEADER_LINK);
		translateHeaderStr(exchange, pattern, HEADER_LOCATION);
		translateHeaderStr(exchange, pattern, HEADER_CONTENT_LOCATION);	
	}
	
	private void preprocess() {
		log.info("translate response headers");
	}
	
	private void postprocess() {
		log.debug("translate response headers ended");
	}
	
	private void translateHeader(Exchange exchange, Pattern pattern, String header) {
		Object oldHeader = exchange.getIn().getHeader(header);
		if (ArrayList.class.isInstance(oldHeader))
			translateHeaderArrayList(exchange, pattern, header);
		else if (String.class.isInstance(oldHeader))
			translateHeaderStr(exchange, pattern, header);
	}
	
	private void translateHeaderStr(Exchange exchange, Pattern pattern, String header) {
		String oldHeader = (String) exchange.getIn().getHeader(header);
		if (oldHeader != null) {
			log.info("translate " + header + " header (string)");
			log.debug("old" + header + ": " + oldHeader);
    		Matcher matcher = pattern.matcher(oldHeader);
	    	String newHeader = matcher.replaceFirst(replacement);
	    	log.debug("new" + header + ": " + newHeader);
			exchange.getIn().setHeader(header, newHeader);
			log.debug("translate " + header + " header (string) ended");
		}
	}

	private void translateHeaderArrayList(Exchange exchange, Pattern pattern, String header) {
		@SuppressWarnings("unchecked")
		ArrayList<String> oldHeader = (ArrayList<String>) exchange.getIn().getHeader(header);
		if (oldHeader != null) {
			log.info("translate " + header + " header (arrayList)");
			log.debug("old" + header + ": " + oldHeader.toString());
			ArrayList<String> newHeader = new ArrayList<String>();
			for (Iterator<String> it=oldHeader.iterator(); it.hasNext(); ) {
				String headerVal = (String) it.next();
				log.debug("old" + header + "Val: " + headerVal);
	    		Matcher matcher = pattern.matcher(headerVal);
	    		headerVal = matcher.replaceFirst(replacement);
	    		log.debug("new" + header + "Val: " + headerVal);
				newHeader.add(headerVal);
			}
			log.debug("new" + header + ": " + newHeader.toString());
			exchange.getIn().setHeader(header, newHeader);
			log.debug("translate " + header + " header (arrayList) ended");
		}
	}

	private void defaultHeader(Exchange exchange, String header, String value) {
		String oldHeader = (String) exchange.getIn().getHeader(header);
		if (oldHeader == null) {
			log.info("default " + header + " header: " + value);
			exchange.getIn().setHeader(header, value);
			log.debug("default " + header + " header ended");
		}
	}

	private void updateHeaderAddElement(Exchange exchange, String header, String element) {
		String oldHeader = (String) exchange.getIn().getHeader(header);
		if ((oldHeader != null) && (!oldHeader.toUpperCase().contains(element.toUpperCase()))) {
			log.info("update " + header + " header add element: " + element);
			log.debug("old" + header + ": " + oldHeader);
			String newHeader = oldHeader + "," + element;
			log.debug("new" + newHeader + ": " + newHeader);
			exchange.getIn().setHeader(header, newHeader);
			log.debug("update " + header + " header ended");
		}
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
