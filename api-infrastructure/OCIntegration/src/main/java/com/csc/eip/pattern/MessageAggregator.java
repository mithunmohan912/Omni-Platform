package com.csc.eip.pattern;

import java.net.URISyntaxException;
import java.util.Map;

import org.apache.camel.util.URISupport;
import org.apache.log4j.Logger;

public class MessageAggregator {
	static Logger log = Logger.getLogger(MessageAggregator.class.getName());

	public String aggregatePattern(String camelHttpQuery) throws URISyntaxException {

		Map<String, Object> params = URISupport.parseQuery(camelHttpQuery);
		String sor1 = (String) params.get("uri1");
		String sor2 = (String) params.get("uri2");

		log.info("aggregatePattern::uri1=" + sor1);
		log.info("aggregatePattern::uri2=" + sor2);

		return "\"" + sor1 + "\",\"" + sor2 + "\"";
	}

}
