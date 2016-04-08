package com.csc.eip.processor;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.log4j.Logger;

public class ResponseHeadersProcessor implements Processor {
	
	public static final String HEADER_LINK					= "Link";
	public static final String HEADER_LOCATION				= "Location";
	public static final String HEADER_CONTENT_LOCATION		= "Content-Location";

	static Logger log = Logger.getLogger(ResponseHeadersProcessor.class.getName());

	private String regex;
	private String replacement;
	
	public void process(Exchange exchange) throws Exception {
		preprocess();
		
		Pattern pattern = Pattern.compile(regex);
		
		translateHeader(exchange, pattern, HEADER_LINK);
		translateHeaderStr(exchange, pattern, HEADER_LOCATION);
		translateHeaderStr(exchange, pattern, HEADER_CONTENT_LOCATION);	

		postprocess();
	}

	private void preprocess() {
		log.info("translate response headers");
		
		if (regex == null || regex.trim().isEmpty())
			log.error("regex is invalid");
		log.debug("regex: " + regex);

		if (replacement == null || replacement.trim().isEmpty())
			log.error("replacement is invalid");
		log.debug("replacement: " + replacement);
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
