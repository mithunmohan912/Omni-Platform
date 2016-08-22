package com.csc.cscip.ux.common.integration;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.apache.camel.CamelContext;
import org.apache.camel.ConsumerTemplate;
import org.apache.camel.Exchange;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.impl.DefaultExchange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.csc.cscip.ux.common.util.UXAppConfig;

@Service
public class CamelIntegrationService implements IntegrationService {

	private CamelContext camelContext;

	private ProducerTemplate template;
	private ConsumerTemplate consumerTemplate;

	@Autowired
	public CamelIntegrationService(CamelContext camelContext, ProducerTemplate template, ConsumerTemplate consumerTemplate) {

		this.camelContext = camelContext;

		this.template = template;
		this.consumerTemplate = consumerTemplate;
	}

	@Override
	public Object send(String endPointURI, Map<String, String> headers, Object payLoad) {

		Exchange exchange = createExchange(headers, payLoad);

		Object responsePayLoad = template.send(endPointURI, exchange).getOut().getBody();

		if (responsePayLoad == null) {
			responsePayLoad = exchange.getIn().getBody();
		}

		return responsePayLoad;

	}

	@Override
	public <T> T send(String endPointURI, Map<String, String> headers, Object payLoad, Class<T> returnType) {

		Exchange exchange = createExchange(headers, payLoad);

		T responsePayLoad = (T) template.send(endPointURI, exchange).getOut().getBody(returnType);

		if (responsePayLoad == null) {
			responsePayLoad = exchange.getIn().getBody(returnType);
		}

		return responsePayLoad;

	}

	private Exchange createExchange(Map<String, String> headers, Object payLoad) {
		Exchange exchange = new DefaultExchange(camelContext);
		exchange.getIn().setBody(payLoad);

		if (headers != null) {
			for (Entry<String, String> header : headers.entrySet()) {
				exchange.getIn().setHeader(header.getKey(), header.getValue());
			}
		}
		return exchange;
	}

	@Override
	public <T> T receive(String endPointURI, Class<T> returnType) {

		int retryLimit = UXAppConfig.getPropertyAsInt("IntegrationRetryLimit");
		int timeout = UXAppConfig.getPropertyAsInt("IntegrationReceiveTimeout");

		for (int retryAttempt = 0; retryAttempt <= retryLimit; retryAttempt++) {
			Exchange exchange = consumerTemplate.receive(endPointURI, timeout);
			if (exchange != null) {
				T result = exchange.getIn().getBody(returnType);
				consumerTemplate.doneUoW(exchange);
				return result;
			}
		}

		return null;
	}

	@Override
	public List<String> receiveHeaders(String endPointURI, String header) {

		List<String> headers = new ArrayList<String>();

		int timeout = UXAppConfig.getPropertyAsInt("IntegrationReceiveTimeout");
		int retryLimit = UXAppConfig.getPropertyAsInt("IntegrationRetryLimit");
		Exchange exchange;
		for (int retryAttempt = 0; retryAttempt <= retryLimit; retryAttempt++) {
			do {
				exchange = consumerTemplate.receive(endPointURI, timeout);
				if (exchange != null) {
					String headerVal = (String) exchange.getIn().getHeader(header);
					headers.add(headerVal);
					consumerTemplate.doneUoW(exchange);
					if (Boolean.TRUE.equals(exchange.getProperty("CamelBatchComplete"))) {
						return headers;
					}
				}
			} while (exchange != null);
		}
		return headers;
	}
}
