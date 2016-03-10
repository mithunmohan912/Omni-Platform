package com.csc.eip.processor;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.restlet.data.Header;
import org.restlet.engine.header.HeaderConstants;
import org.restlet.util.Series;

import com.csc.eip.pattern.MessageTranslator;

public class MessageTranslatorProcessor implements Processor {
	
	public void process(Exchange exchange) throws Exception {
		String pattern = exchange.getIn().getHeader(MessageTranslator.HEADER_PATTERN, String.class);
		String replacement = exchange.getIn().getHeader(MessageTranslator.HEADER_REPLACEMENT, String.class);
		Series<Header> headers = new Series<Header>(Header.class);
		headers.add(new Header(MessageTranslator.HEADER_PATTERN, pattern));
		headers.add(new Header(MessageTranslator.HEADER_REPLACEMENT, replacement));
		exchange.getIn().setHeader(HeaderConstants.ATTRIBUTE_HEADERS, headers);
	}
	
}
