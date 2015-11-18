package com.csc.eip.strategy;

import org.apache.camel.Exchange;
import org.apache.camel.processor.aggregate.AggregationStrategy;
import org.apache.log4j.Logger;

public class CollectionAggregationStrategy implements AggregationStrategy {

	static Logger log = Logger.getLogger(CollectionAggregationStrategy.class.getName());

	public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {

		if (oldExchange == null) {
			return newExchange;
		}

		String oldBody = oldExchange.getIn().getBody(String.class);
		log.info("OLD EXCHANGE--- " + oldBody);
		String newBody = newExchange.getIn().getBody(String.class);
		log.info("NEW EXCHANGE--- " + newBody);

		oldExchange.getOut().setBody(oldBody + newBody);
		log.info("RESULT BODY--- " + oldExchange.getOut().getBody());

		return oldExchange;

	}

}
