package com.csc.eip.route;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.rest.RestBindingMode;

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

}
