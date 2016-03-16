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
import org.junit.Test;

public class MessageTranslatorTest {

	/** CONSTANTS */

	/** Integrator Service URIs */
	private static final String URI_INTEGRATOR_MESSAGE_TRANSLATOR 		= "http://localhost:8080/ocintegration/messageTranslator";
//	private static final String URI_INTEGRATOR_AGGREGATOR		 		= "http://localhost:8080/ocintegration/aggregator";
	
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
	public void testMessageTranslatorAia() {
		testMessageTranslator(URI_MOCK_AIA_PERSONS, URI_AIA_PRIVATE_PREFIX, URI_AIA_PUBLIC_PREFIX);
	}

	@Test
	public void testMessageTranslatorIntegral() {
		testMessageTranslator(URI_MOCK_INTEGRAL_PERSONS, URI_INTEGRAL_PRIVATE_PREFIX, URI_INTEGRAL_PUBLIC_PREFIX);
	}

	@Test
	public void testMessageTranslatorPointIn() {
		testMessageTranslator(URI_MOCK_POINTIN_PERSONS, URI_POINTIN_PRIVATE_PREFIX, URI_POINTIN_PUBLIC_PREFIX);
	}

	@Test
	public void testMessageTranslatorOmniChannelAia() {
		testMessageTranslator(URI_MOCK_OMNICHANNEL_AIA_PERSONS, URI_AIA_PUBLIC_PREFIX, URI_AIA_PRIVATE_PREFIX);
	}

	@Test
	public void testMessageTranslatorOmniChannelIntegral() {
		testMessageTranslator(URI_MOCK_OMNICHANNEL_INTEGRAL_PERSONS, URI_INTEGRAL_PUBLIC_PREFIX, URI_INTEGRAL_PRIVATE_PREFIX);
	}

	@Test
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

	
//	private static final String AIA_CSC_HOST = "http://20.33.40.152:10114";
//
//	private static final String COMPONENT_INSURANCE = "/csc/insurance";
//
//	private static final String INDEX_SCHEMA = "/schemas";
//	private static final String INDEX_QUOTE = "/quotes";
//
//	private static final String URI_INSURANCE = AIA_CSC_HOST + COMPONENT_INSURANCE;
//
//	private static final String URI_SCHEMA_INDEX = URI_INSURANCE + INDEX_SCHEMA;
//	private static final String URI_QUOTE_INDEX = URI_INSURANCE + INDEX_QUOTE;
//
//	private static final String TEXTURED_API = "20.33.40.152:10114";
//	private static final String CLEAN_API = "api.csc.com/insurance/v1/aia";
//
//	// update URI_ROOT to change the root resource
//	private static final String URI_ROOT = URI_QUOTE_INDEX; // {URI_INSURANCE,URI_SCHEMA_INDEX,URI_QUOTE_INDEX}

//	private void testTransformUrls(String pattern, String replacement) {
//	log.info("messageTranslatorTest::testTransformUrls::started");
//	log.info("messageTranslatorTest::testTransformUrls::pattern=" + pattern);
//	log.info("messageTranslatorTest::testTransformUrls::replacement=" + replacement);
//	log.info("messageTranslatorTest::testTransformUrls::href=" + URI_ROOT);
//
//	String href = URI_ROOT;
//	Client client = ClientBuilder.newBuilder().register(JettisonFeature.class).build();
//
//	if (href.equals(URI_INSURANCE))
//		crawlRoot(client, href, "OPTIONS", pattern, replacement);
//	else if (href.equals(URI_SCHEMA_INDEX))
//		crawlRootSchema(client, href, "OPTIONS", pattern, replacement);
//	else if (href.equals(URI_QUOTE_INDEX) || !href.equals(""))
//		crawlCollection(client, href, "OPTIONS", pattern, replacement);
//
//	log.info("messageTranslatorTest::testTransformUrls::completed");
//	log.info("");
//}
//
//@Test
//@Ignore
//public void testTransformUrls() {
//	testTransformUrls(TEXTURED_API, CLEAN_API);
//}
//
///** CRAWLERS */
//
//private boolean crawlRoot(Client client, String href, String method, String pattern, String replacement) {
//	WebTarget target = client.target(href);
//	log.info("messageTranslatorTest::crawlRoot::href=" + href + ",method=" + method);
//
//	if (method.equals("OPTIONS")) {
//		Response response = target.request().accept(MediaType.APPLICATION_JSON).options(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlRoot->skipped(service failure)");
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlRoot->pruned(transformation failure),href=" + href + ",method="
//					+ method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject options = new JSONObject(entity);
//			JSONArray links = (JSONArray) options.get("links");
//			for (int i = 0; i < links.length(); i++) {
//				JSONObject link = links.getJSONObject(i);
//				crawlRoot(client, link.getString("href"), link.getString("method"), pattern, replacement);
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	} else if (method.equals("GET")) {
//		Response response = target.request().accept(MEDIA_APPLICATION_HAL_JSON).get(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlRoot->skipped(service failure)");
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlRoot->pruned(transformation failure),href=" + href + ",method="
//					+ method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject get = new JSONObject(entity);
//			JSONObject links = (JSONObject) get.get("_links");
//			Object items = links.get("item");
//			if (items.getClass().equals(JSONArray.class)) {
//				for (int i = 0; i < ((JSONArray) items).length(); i++) {
//					JSONObject link = ((JSONArray) items).getJSONObject(i);
//					if (!link.getString("href").endsWith("/schemas"))
//						crawlCollection(client, link.getString("href"), "OPTIONS", pattern, replacement);
//					else
//						crawlRootSchema(client, link.getString("href"), "OPTIONS", pattern, replacement);
//				}
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	}
//	return true;
//}
//
//private boolean crawlRootSchema(Client client, String href, String method, String pattern, String replacement) {
//	WebTarget target = client.target(href);
//	log.info("messageTranslatorTest::crawlRootSchema::href=" + href + ",method=" + method);
//
//	if (method.equals("OPTIONS")) {
//		Response response = target.request().accept(MediaType.APPLICATION_JSON).options(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlRootSchema->skipped(service failure)");
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlRootSchema->pruned(transformation failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject options = new JSONObject(entity);
//			JSONArray links = (JSONArray) options.get("links");
//			for (int i = 0; i < links.length(); i++) {
//				JSONObject link = links.getJSONObject(i);
//				crawlRootSchema(client, link.getString("href"), link.getString("method"), pattern, replacement);
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	} else if (method.equals("GET")) {
//		Response response = target.request().accept(MEDIA_APPLICATION_HAL_JSON).get(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlRootSchema->skipped(service failure)");
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlRootSchema->pruned(transformation failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject get = new JSONObject(entity);
//			JSONObject links = (JSONObject) get.get("_links");
//			Object items = links.get("item");
//			if (items.getClass().equals(JSONArray.class)) {
//				for (int i = 0; i < ((JSONArray) items).length(); i++) {
//					JSONObject link = ((JSONArray) items).getJSONObject(i);
//					crawlCollectionSchema(client, link.getString("href"), "OPTIONS", pattern, replacement);
//				}
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	}
//	return true;
//}
//
//private boolean crawlCollection(Client client, String href, String method, String pattern, String replacement) {
//	WebTarget target = client.target(href);
//	log.info("messageTranslatorTest::crawlCollection::href=" + href + ",method=" + method);
//
//	if (method.equals("OPTIONS")) {
//		// skip collections for known failures (template variable)
//		if (href.contains("/{rel}")) {
//			log.info(
//					"messageTranslatorTest::crawlCollection->pruned(skip known failure for template variable),href="
//							+ href + ",method=" + method);
//			return true;
//		}
//
//		Response response = target.request().accept(MediaType.APPLICATION_JSON).options(Response.class);
//
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlCollection->skipped(service failure),href=" + href + ",method="
//					+ method);
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlCollection->pruned(transformation failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject options = new JSONObject(entity);
//			JSONArray links = (JSONArray) options.get("links");
//			for (int i = 0; i < links.length(); i++) {
//				JSONObject link = links.getJSONObject(i);
//				crawlCollection(client, link.getString("href"), link.getString("method"), pattern, replacement);
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	} else if (method.equals("GET")) {
//		// skip collections for known failures (missing query param)
//		if (href.contains("/referential_address_streets") || href.contains("/referential_address_street_segments")
//				|| href.contains("/graydon_organization") || href.contains("/referential_vehicle_models")
//				|| href.contains("/referential_vehicles")) {
//			log.info(
//					"messageTranslatorTest::crawlCollection->pruned(skip known failure for missing query param),href="
//							+ href + ",method=" + method);
//			return true;
//		}
//
//		// skip collections for known failures (GT fatal error)
//		if (href.contains("/productComponents?_inquiry")
//				|| href.contains("/contracts?_inquiry=ci_search_assistance_contract")) {
//			log.info("messageTranslatorTest::crawlCollection->pruned(skip known failure),href=" + href + ",method="
//					+ method);
//			return true;
//		}
//
//		Response response = target.request().accept(MEDIA_APPLICATION_HAL_JSON).get(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlCollection->skipped(service failure),href=" + href + ",method="
//					+ method);
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlCollection->pruned(transformation failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject get = new JSONObject(entity);
//			JSONObject links = (JSONObject) get.get("_links");
//			if (links.has("item")) {
//				Object items = links.get("item");
//				if (items.getClass().equals(JSONArray.class)) {
//					for (int i = 0; i < ((JSONArray) items).length(); i++) {
//						JSONObject link = ((JSONArray) items).getJSONObject(i);
//						if (crawlDocument(client, link.getString("href"), "OPTIONS", pattern, replacement)) {
//							log.info("messageTranslatorTest::crawlCollection->pruned(item success),href=" + href
//									+ ",method=" + method);
//							break;
//						}
//					}
//				} else if (items.getClass().equals(JSONObject.class)) {
//					crawlDocument(client, ((JSONObject) items).getString("href"), "OPTIONS", pattern, replacement);
//				}
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	}
//	return true;
//}
//
//private boolean crawlCollectionSchema(Client client, String href, String method, String pattern,
//		String replacement) {
//	WebTarget target = client.target(href);
//	log.info("messageTranslatorTest::crawlCollectionSchema::href=" + href + ",method=" + method);
//
//	if (method.equals("OPTIONS")) {
//		Response response = target.request().accept(MediaType.APPLICATION_JSON).options(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlCollectionSchema->skipped(service failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlCollectionSchema->pruned(transformation failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject options = new JSONObject(entity);
//			JSONArray links = (JSONArray) options.get("links");
//			for (int i = 0; i < links.length(); i++) {
//				JSONObject link = links.getJSONObject(i);
//				crawlCollectionSchema(client, link.getString("href"), link.getString("method"), pattern,
//						replacement);
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	} else if (method.equals("GET")) {
//		Response response = target.request().accept(MEDIA_APPLICATION_HAL_JSON).get(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlCollectionSchema->skipped(service failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlCollectionSchema->pruned(transformation failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject get = new JSONObject(entity);
//			JSONObject links = (JSONObject) get.get("_links");
//			if (links.has("item")) {
//				Object items = links.get("item");
//				if (items.getClass().equals(JSONArray.class)) {
//					for (int i = 0; i < ((JSONArray) items).length(); i++) {
//						JSONObject link = ((JSONArray) items).getJSONObject(i);
//						crawlDocumentSchema(client, link.getString("href"), "OPTIONS", pattern, replacement);
//					}
//				}
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	}
//	return true;
//}
//
//private boolean crawlDocument(Client client, String href, String method, String pattern, String replacement) {
//	WebTarget target = client.target(href);
//	log.info("messageTranslatorTest::crawlDocument::href=" + href + ",method=" + method);
//
//	if (method.equals("OPTIONS")) {
//		// skip documents for known failures (GT fatal error)
//		if (href.contains("/quotes/ID-mrMxYH1000HWT") || href.contains("/quotes/ID-mrMxYH1000HdF")
//				|| href.contains("/quotes/ID-mrMxYH1000HWn")) {
//			log.info("messageTranslatorTest::crawlCollection->skipped(skip known failure for GT fatal error),href="
//					+ href + ",method=" + method);
//			return false;
//		}
//		// skip documents for known failures (404)
//		if (href.contains("/referential_address_sectors/")) {
//			log.info("messageTranslatorTest::crawlDocument->pruned(skip known failures for 404s),href=" + href
//					+ ",method=" + method);
//			return true;
//		}
//
//		Response response = target.request().accept(MediaType.APPLICATION_JSON).options(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlDocument->skipped(service failure),href=" + href + ",method="
//					+ method);
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlDocument->pruned(transformation failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject options = new JSONObject(entity);
//			JSONArray links = (JSONArray) options.get("links");
//			for (int i = 0; i < links.length(); i++) {
//				JSONObject link = links.getJSONObject(i);
//				crawlDocument(client, link.getString("href"), link.getString("method"), pattern, replacement);
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	} else if (method.equals("GET")) {
//		// skip documents for known failures (GT fatal error)
//		if (href.contains("/contracts/")) {
//			log.info("messageTranslatorTest::crawlDocument->pruned(skip known failure for GT fatal error),href="
//					+ href + ",method=" + method);
//			return true;
//		}
//
//		Response response = target.request().accept(MEDIA_APPLICATION_HAL_JSON).get(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlDocument->skipped(service failure),href=" + href + ",method="
//					+ method);
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlDocument->pruned(transformation failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject get = new JSONObject(entity);
//			JSONObject links = (JSONObject) get.get("_links");
//			for (@SuppressWarnings("unchecked")
//			Iterator<String> it = links.keys(); it.hasNext();) {
//				String key = it.next();
//				// ignore circular links
//				if (key.equals("self") || key.equals("up") || key.equals("type"))
//					continue;
//				// ignore circular relations
//				if (key.equals("quote_coverage:child_prdct_cmpnnt_list"))
//					continue;
//				JSONObject link = links.getJSONObject(key);
//				crawlCollection(client, link.getString("href"), "OPTIONS", pattern, replacement);
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	}
//	return true;
//}
//
//private boolean crawlDocumentSchema(Client client, String href, String method, String pattern, String replacement) {
//	WebTarget target = client.target(href);
//	log.info("messageTranslatorTest::crawlDocumentSchema::href=" + href + ",method=" + method);
//
//	if (method.equals("OPTIONS")) {
//		Response response = target.request().accept(MediaType.APPLICATION_JSON).options(Response.class);
//		String entity = response.readEntity(String.class);
//		// log.info(entity);
//		if (response.getStatusInfo().getStatusCode() != 200) {
//			log.info("messageTranslatorTest::crawlDocumentSchema->skipped(service failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return false;
//		}
//
//		if (!testTransformUrl(client, href, method, entity, pattern, replacement)) {
//			log.info("messageTranslatorTest::crawlDocumentSchema->pruned(transformation failure),href=" + href
//					+ ",method=" + method);
//			log.info(entity);
//			return true;
//		}
//
//		try {
//			JSONObject options = new JSONObject(entity);
//			JSONArray links = (JSONArray) options.get("links");
//			for (int i = 0; i < links.length(); i++) {
//				JSONObject link = links.getJSONObject(i);
//				crawlDocumentSchema(client, link.getString("href"), link.getString("method"), pattern, replacement);
//			}
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//	}
//	return true;
//}

}
