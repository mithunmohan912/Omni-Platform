package com.csc.cscip.ux.common.rest;

import java.util.HashMap;
import java.util.Map;

import org.apache.camel.CamelContext;
import org.apache.camel.ConsumerTemplate;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.impl.DefaultCamelContext;
import org.junit.Test;

import com.csc.cscip.ux.common.integration.CamelIntegrationService;
import com.csc.cscip.ux.common.integration.IntegrationService;
import com.csc.cscip.ux.common.util.IOUtils;

public class TestIntegrationService {

	private String serviceXMLURL = "xslt:xsl/PointXML.xsl";
	private String errorXMLURL = "xslt:xsl/ResponseErrorXML.xsl";

	private String serviceEndPointURL = "http://pntdevsod04:9080/commfwux/servlet/CommFwServlet?noTransformCache=false";

	// @Test
	public void testRequest() throws Exception {

		IntegrationService integrationService = getIntegrationService();

		String pointXML = IOUtils.readContent("Point.xml");
		// System.err.println(pointXML);

		String serviceXML = integrationService.send(serviceXMLURL, null, pointXML, String.class);
		// System.err.println(serviceXML);

		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "text/xml");

		String responseXML = integrationService.send(serviceEndPointURL, headers, serviceXML, String.class);
		// System.err.println(responseXML);

	}

	@Test
	public void testResponse() throws Exception {

		IntegrationService integrationService = getIntegrationService();

		String responsePointErrorXML = IOUtils.readContent("responsePointError.xml");
		// System.err.println(responsePointErrorXML);

		String responseJSON = integrationService.send(errorXMLURL, null, responsePointErrorXML, String.class);
		System.err.println(responseJSON);

	}

	private IntegrationService getIntegrationService() throws Exception {
		CamelContext camelContext = new DefaultCamelContext();
		camelContext.start();

		ConsumerTemplate consumerTemplate = camelContext.createConsumerTemplate();
		ProducerTemplate template = camelContext.createProducerTemplate();

		CamelIntegrationService integrationService = new CamelIntegrationService(camelContext, template, consumerTemplate);
		return integrationService;
	}

}
