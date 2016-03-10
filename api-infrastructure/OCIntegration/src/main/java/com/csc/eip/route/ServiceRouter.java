package com.csc.eip.route;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.rest.RestBindingMode;

import com.csc.eip.bo.Message;
import com.csc.eip.strategy.CollectionAggregationStrategy;

/**
 * REST services defined with Camel Java REST DSL Router
 */
public class ServiceRouter extends RouteBuilder {

	@Override
	public void configure() throws Exception {

		restConfiguration()
			.component("servlet")
			.bindingMode(RestBindingMode.off)
			.dataFormatProperty("prettyPrint", "true");
		
        rest("/messageTranslator")
			.description("Message Translator Pattern")
            .consumes("application/json")
			.produces("application/json")
		
			.post()
				.description("Replaces all pattern matches in a JSON message")
				.route()
					.log("/messageTranslator route started")
					.log("Pattern: ${header.Pattern}")
					.log("Replacement: ${header.Replacement}")
					.convertBodyTo(String.class)
					.to("bean:messageTranslator?method=replacePattern(${body}, ${header.Pattern}, ${header.Replacement}")
					.log("/messageTranslator route started");
        
    }

		
//	<rest>
//		<description>Message Translator Pattern</description>
//		<post uri="/messageTranslator" 
//			consumes="application/json"  
//			produces="application/json" >
//			<description>Replace all pattern matches in a JSON message</description>
//			<route>
//				<log message="/messageTranslator route started"/>
//				<log message="Pattern: ${header.Pattern}"/>
//				<log message="Replacement: ${header.Replacement}"/>
//				<convertBodyTo type="java.lang.String"/>
//				<to uri="bean:messageTranslator?method=replacePattern(${body}, ${header.Pattern}, ${header.Replacement})" />
//				<log message="/messageTranslator route ended"/>
//			</route>
//		</post>
//	</rest>
		  
//		rest("/OCIntegration")
//			.description("URI Transformation Service")
//			.consumes("application/json")
//			.produces("application/json")
//
//		.post()
//			.description("Replaces all pattern matches in a JSON message")
//			.type(Message.class)
//			.outType(Message.class)
//			.to("bean:OCIntegration?method=replacePattern(${body})");
//
//		rest("/OCIntegration")
//			.description("Aggregation Service")
//			.produces("application/json")
//		.get()
//			.outType(Message.class)
//			.route()
//				.removeHeaders("CamelHttp*")
//				.enrich("direct:serviceAggregate");
//	
//		from("direct:serviceAggregate")
//			.recipientList(header("URIS").tokenize(","))
//			.aggregationStrategy(new CollectionAggregationStrategy()).parallelAggregate()
//		.end();
//
//    }

}
