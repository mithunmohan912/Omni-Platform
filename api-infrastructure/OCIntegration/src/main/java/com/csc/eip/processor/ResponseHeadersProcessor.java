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
	
	//* TODO FIXME constants
	private static final String HEADER_LINK					= "Link";
	private static final String HEADER_LOCATION				= "Location";
	private static final String HEADER_CONTENT_LOCATION		= "Content-Location";

//	private static final String HEADER_CORS_ALLOW_ORIGIN	= "Access-Control-Allow-Origin";
	private static final String HEADER_CORS_ALLOW_HEADERS	= "Access-Control-Allow-Headers";

	private static final String HEADER_IBM_CLIENT_ID		= "X-IBM-Client-Id";
	private static final String HEADER_IBM_CLIENT_SECRET	= "X-IBM-Client-Secret";
	private static final String HEADER_FORGEROCK_TOKEN_ID	= "iPlanetDirectoryPro";
//	private static final String HEADER_CSC_USER_ID			= "X-CSC-User-Id";
//	private static final String HEADER_CSC_USER_ID			= "User-Id";
	private static final String HEADER_USERNAME				= "Username";

	static Logger log = Logger.getLogger(ResponseHeadersProcessor.class.getName());

	private String messagePrefix;
	private Map<String,String> apiEndpointRefs;
	private String regex;
	private String replacement;
	
	public void process(Exchange exchange) throws Exception {
		messagePrefix = exchange.getExchangeId()+":";
		
		log.debug(messagePrefix+"translate response headers");
		
		for (Iterator<Entry<String,String>> it=apiEndpointRefs.entrySet().iterator(); it.hasNext(); ) {
			Entry<String,String> entry = it.next();
    		regex = entry.getKey();
    		replacement = entry.getValue();
    		subprocess(exchange);
		}

//		defaultOverwriteHeader(exchange, HEADER_CORS_ALLOW_ORIGIN, "*", "http://localhost:8080");
//		defaultOverwriteHeader(exchange, HEADER_CORS_ALLOW_ORIGIN, "*", "http://insurance.csc.com:8080");
//		defaultHeader(exchange, HEADER_CORS_ALLOW_ORIGIN, "*");
		
		//* TODO FIXME only OPTIONS?
		updateHeaderAddElement(exchange, HEADER_CORS_ALLOW_HEADERS, HEADER_IBM_CLIENT_ID);
		updateHeaderAddElement(exchange, HEADER_CORS_ALLOW_HEADERS, HEADER_IBM_CLIENT_SECRET);
		updateHeaderAddElement(exchange, HEADER_CORS_ALLOW_HEADERS, HEADER_FORGEROCK_TOKEN_ID);
//		updateHeaderAddElement(exchange, HEADER_CORS_ALLOW_HEADERS, HEADER_CSC_USER_ID);
		updateHeaderAddElement(exchange, HEADER_CORS_ALLOW_HEADERS, HEADER_USERNAME);
		
		log.debug(messagePrefix+"translate response headers ended");
	}

	private void subprocess(Exchange exchange) throws Exception {
		if (regex == null || regex.trim().isEmpty())
			log.error(messagePrefix+"regex is invalid");
		log.debug(messagePrefix+"regex: " + regex);

		if (replacement == null || replacement.trim().isEmpty())
			log.error(messagePrefix+"replacement is invalid");
		log.debug(messagePrefix+"replacement: " + replacement);

		Pattern pattern = Pattern.compile(regex);
		
		//* TODO FIXME only http methods?
		translateHeader(exchange, pattern, HEADER_LINK);
		translateHeaderStr(exchange, pattern, HEADER_LOCATION);
		translateHeaderStr(exchange, pattern, HEADER_CONTENT_LOCATION);	
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
			log.debug(messagePrefix+"translate " + header + " header (string)");
			log.debug(messagePrefix+"old" + header + ": " + oldHeader);
    		Matcher matcher = pattern.matcher(oldHeader);
	    	String newHeader = matcher.replaceFirst(replacement);
	    	log.debug(messagePrefix+"new" + header + ": " + newHeader);
			exchange.getIn().setHeader(header, newHeader);
			log.info(messagePrefix+"translate " + header + " header (string) ended");
		}
	}

	private void translateHeaderArrayList(Exchange exchange, Pattern pattern, String header) {
		@SuppressWarnings("unchecked")
		ArrayList<String> oldHeader = (ArrayList<String>) exchange.getIn().getHeader(header);
		if (oldHeader != null) {
			log.debug(messagePrefix+"translate " + header + " header (arrayList)");
			log.debug(messagePrefix+"old" + header + ": " + oldHeader.toString());
			ArrayList<String> newHeader = new ArrayList<String>();
			for (Iterator<String> it=oldHeader.iterator(); it.hasNext(); ) {
				String headerVal = (String) it.next();
				log.debug(messagePrefix+"old" + header + "Val: " + headerVal);
	    		Matcher matcher = pattern.matcher(headerVal);
	    		headerVal = matcher.replaceFirst(replacement);
	    		log.debug(messagePrefix+"new" + header + "Val: " + headerVal);
				newHeader.add(headerVal);
			}
			log.debug(messagePrefix+"new" + header + ": " + newHeader.toString());
			exchange.getIn().setHeader(header, newHeader);
			log.info(messagePrefix+"translate " + header + " header (arrayList) ended");
		}
	}

//	private void defaultHeader(Exchange exchange, String header, String value) {
//		String oldHeader = (String) exchange.getIn().getHeader(header);
//		if (oldHeader == null) {
//			log.debug(messagePrefix+"default " + header + " header: " + value);
//			exchange.getIn().setHeader(header, value);
//			log.info(messagePrefix+"default " + header + " header ended");
//		}
//	}

//	private void defaultOverwriteHeader(Exchange exchange, String header, String oldValue, String newValue) {
//		String oldHeader = (String) exchange.getIn().getHeader(header);
//		if (oldHeader == null || oldHeader.equals(oldValue)) {
//			log.debug(messagePrefix+"default " + header + " header: " + newValue);
//			exchange.getIn().setHeader(header, newValue);
//			log.info(messagePrefix+"default " + header + " header ended");
//		}
//	}

	private void updateHeaderAddElement(Exchange exchange, String header, String element) {
		String oldHeader = (String) exchange.getIn().getHeader(header);
		if ((oldHeader != null) && (!oldHeader.toUpperCase().contains(element.toUpperCase()))) {
			log.debug(messagePrefix+"update " + header + " header add element: " + element);
			log.debug(messagePrefix+"old" + header + ": " + oldHeader);
			String newHeader = oldHeader + "," + element;
			log.debug(messagePrefix+"new" + newHeader + ": " + newHeader);
			exchange.getIn().setHeader(header, newHeader);
			log.info(messagePrefix+"update " + header + " header ended");
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
