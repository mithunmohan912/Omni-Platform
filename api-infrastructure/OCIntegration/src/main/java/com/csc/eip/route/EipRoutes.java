package com.csc.eip.route;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.rest.RestBindingMode;

import com.csc.eip.bo.Message;
import com.csc.eip.strategy.CollectionAggregationStrategy;

/**
 * REST services defined with Camel Java REST DSL Router
 */
public class EipRoutes extends RouteBuilder {

	@Override
	public void configure() throws Exception {

		restConfiguration().component("servlet").bindingMode(RestBindingMode.json).dataFormatProperty("prettyPrint",
				"true");
		
		  
		rest("/OCIntegration")
			.description("URI Transformation Service")
			.consumes("application/json")
			.produces("application/json")

		.post()
			.description("Replaces all pattern matches in a JSON message")
			.type(Message.class)
			.outType(Message.class)
			.to("bean:OCIntegration?method=replacePattern(${body})");

		rest("/OCIntegration")
			.description("Aggregation Service")
			.produces("application/json")
		.get()
			.outType(Message.class)
			.route()
				.removeHeaders("CamelHttp*")
				.enrich("direct:serviceAggregate");
	
		from("direct:serviceAggregate")
			.recipientList(header("URIS").tokenize(","))
			.aggregationStrategy(new CollectionAggregationStrategy()).parallelAggregate()
		.end();

    }

}
