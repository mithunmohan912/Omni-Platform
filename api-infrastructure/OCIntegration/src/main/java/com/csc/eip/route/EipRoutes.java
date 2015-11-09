package com.csc.eip.route;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.rest.RestBindingMode;

import com.csc.eip.bo.Message;

/**
 * REST services defined with Camel Java REST DSL Router
 */
public class EipRoutes extends RouteBuilder {	

    @Override
    public void configure() throws Exception {
		
        restConfiguration()
			.component("servlet")
			.bindingMode(RestBindingMode.json)
            .dataFormatProperty("prettyPrint", "true");
		
        rest("/OCIntegration")
			.description("Pattern replace service")
            .consumes("application/json")
			.produces("application/json")
		
			.post()
				.description("Replaces all pattern matches in a JSON message")
				.type(Message.class)
				.outType(Message.class)
		    	// URL params are not automatically added to Header params for POSTs
		    	// use CamelHttpQuery header to get URL params
				.to("bean:OCIntegration?method=replacePattern(${body})");
        rest("/OCIntegration")
        .description("Pattern replace service 2")
		.get()
			.description("Get the content")
			.outType(Message.class)
			.to("bean:OCIntegration?method=writeMessage(${in.headers[CamelHttpQuery]})");

    }

}
