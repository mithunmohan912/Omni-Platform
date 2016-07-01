package com.csc.eip.pattern;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.glassfish.jersey.jettison.JettisonFeature;
import org.junit.Ignore;
import org.junit.Test;

public class MessageTranslatorTest {

	/** CONSTANTS */

	/** Integrator Service URIs */
	private static final String URI_INTEGRATOR_MESSAGE_TRANSLATOR 		= "http://localhost:8888/ocintegration/messageTranslator";
//	private static final String URI_INTEGRATOR_AGGREGATOR		 		= "http://localhost:8888/ocintegration/aggregator";
	
	/** SOR URIs */
	private static final String URI_AIA_PRIVATE_PREFIX 					= "http://20.33.40.152:10114/csc/insurance";
	private static final String URI_INTEGRAL_PRIVATE_PREFIX 			= "http://20.123.456.789:9999/csc/insurance";
	private static final String URI_POINTIN_PRIVATE_PREFIX 				= "http://20.987.654.321:9999/csc/insurance";
	
	/** API Gateway URIs */
	private static final String URI_AIA_PUBLIC_PREFIX 					= "https://devgateway.api.csc.com/insurance/omnichannel/aia";
	private static final String URI_INTEGRAL_PUBLIC_PREFIX 				= "https://devgateway.api.csc.com/insurance/omnichannel/integral";
	private static final String URI_POINTIN_PUBLIC_PREFIX 				= "https://devgateway.api.csc.com/insurance/omnichannel/pointin";

	/** Mock URIs */
	private static final String URI_MOCK_AIA_PERSONS 					= "http://demo3865823.mockable.io/aia/persons";
	private static final String URI_MOCK_INTEGRAL_PERSONS 				= "http://demo3865823.mockable.io/integral/persons";
	private static final String URI_MOCK_POINTIN_PERSONS 				= "http://demo3865823.mockable.io/pointin/persons";
	
	private static final String URI_MOCK_OMNICHANNEL_AIA_PERSONS 		= "http://demo3865823.mockable.io/omnichannel/aia/persons";
	private static final String URI_MOCK_OMNICHANNEL_INTEGRAL_PERSONS 	= "http://demo3865823.mockable.io/omnichannel/integral/persons";
	private static final String URI_MOCK_OMNICHANNEL_POINTIN_PERSONS 	= "http://demo3865823.mockable.io/omnichannel/pointin/persons";
	
	/** Media Types */
	private static final String MEDIA_APPLICATION_JSON 					= "application/json";
//	private static final String MEDIA_APPLICATION_HAL_JSON 				= "application/vnd.hal+json";

	/** Headers */
	private static final String HEADER_PATTERN 							= "Pattern";
	private static final String HEADER_REPLACEMENT 						= "Replacement";
	
	
	static Logger log = Logger.getLogger(MessageTranslatorTest.class.getName());

	
	/** TESTS */

	@Test
	@Ignore
	public void testMessageTranslatorAia() {
		testMessageTranslator(URI_MOCK_AIA_PERSONS, URI_AIA_PRIVATE_PREFIX, URI_AIA_PUBLIC_PREFIX);
	}

	@Test
	@Ignore
	public void testMessageTranslatorIntegral() {
		testMessageTranslator(URI_MOCK_INTEGRAL_PERSONS, URI_INTEGRAL_PRIVATE_PREFIX, URI_INTEGRAL_PUBLIC_PREFIX);
	}

	@Test
	@Ignore
	public void testMessageTranslatorPointIn() {
		testMessageTranslator(URI_MOCK_POINTIN_PERSONS, URI_POINTIN_PRIVATE_PREFIX, URI_POINTIN_PUBLIC_PREFIX);
	}

	@Test
	@Ignore
	public void testMessageTranslatorOmniChannelAia() {
		testMessageTranslator(URI_MOCK_OMNICHANNEL_AIA_PERSONS, URI_AIA_PUBLIC_PREFIX, URI_AIA_PRIVATE_PREFIX);
	}

	@Test
	@Ignore
	public void testMessageTranslatorOmniChannelIntegral() {
		testMessageTranslator(URI_MOCK_OMNICHANNEL_INTEGRAL_PERSONS, URI_INTEGRAL_PUBLIC_PREFIX, URI_INTEGRAL_PRIVATE_PREFIX);
	}

	@Test
	@Ignore
	public void testMessageTranslatorOmniChannelPointIn() {
		testMessageTranslator(URI_MOCK_OMNICHANNEL_POINTIN_PERSONS, URI_POINTIN_PUBLIC_PREFIX, URI_POINTIN_PRIVATE_PREFIX);
	}


	/** TEST MESSAGE TRANSLATOR */

	private void testMessageTranslator(String href, String pattern, String replacement) {
		Client client = ClientBuilder.newBuilder().register(JettisonFeature.class).build();
		WebTarget target = client.target(href);
		Response response = target.request().accept(MEDIA_APPLICATION_JSON).get(Response.class);
		String entity = response.readEntity(String.class);
		
		String method = "GET";
		if (!testMessageTranslator(client, href, method, entity, pattern, replacement)) {
			log.info("testMessageTranslator->pruned(transformation failure),href=" + href + ",method=" + method);
			log.info(entity);
		}
		
	}
	
	private boolean testMessageTranslator(Client client, String resource, String method, String entityIn, String pattern,
			String replacement) {
		String href = URI_INTEGRATOR_MESSAGE_TRANSLATOR;
		WebTarget target = client.target(href);

		String entityOut = "";
		int statusCode = 500;

		statusCode = testMessageTranslator(target, resource, method, entityIn, pattern, replacement, entityOut);
		if (statusCode != 200)
			return false;
		return true;
	}

	private int testMessageTranslator(WebTarget target, String resource, String method, String entityIn, String pattern,
			String replacement, String entityOut) {
		Response response = target.request()
				.accept(MediaType.APPLICATION_JSON)
				.header(HEADER_PATTERN, pattern)
				.header(HEADER_REPLACEMENT, replacement)
				.post(Entity.entity(entityIn, MediaType.APPLICATION_JSON), Response.class);

		int statusCode = response.getStatusInfo().getStatusCode();
		entityOut = response.readEntity(String.class);

		if (entityOut == null)
			log.info("entity="+entityOut);
		assertNotNull(entityOut);

		if (entityOut.contains(pattern))
			log.info("entity="+entityOut);
		assertFalse(entityOut.contains(pattern));

		if (!entityOut.contains(replacement))
			log.info("entity="+entityOut);
		assertTrue(entityOut.contains(replacement));

		log.info("testTransformUrl::statusCode=" + statusCode + ",resource=" + resource + ",pattern=" + pattern + ",replacement=" + replacement);

		return statusCode;
	}

}
