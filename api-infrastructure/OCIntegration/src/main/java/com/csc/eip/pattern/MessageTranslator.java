package com.csc.eip.pattern;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.camel.Header;
import org.apache.camel.util.URISupport;
import org.apache.log4j.Logger;
import org.glassfish.jersey.jettison.JettisonFeature;

import com.csc.eip.bo.Message;

/**
 * Message Translator
 */
public class MessageTranslator {

	static Logger log = Logger.getLogger(MessageTranslator.class.getName());

	public MessageTranslator() {
	}

	/**
	 * Replaces all pattern matches in a JSON message
	 *
	 * @param message
	 *            the Message
	 * @param camelHttpQuery
	 *            the URI Query string
	 * @throws URISyntaxException
	 */
	public Message replacePattern(Message message, @Header("pattern") String pattern, @Header("replacement") String replacement) throws URISyntaxException {
		// URL params are not automatically added to Header params for POSTs
		// use CamelHttpQuery header to get URL params

		Map<String, Object> any = message.getAny();
		log.info("messageTranslator::replacePattern::message=" + any.toString());
		log.info("messageTranslator::replacePattern::pattern=" + pattern);
		log.info("messageTranslator::replacePattern::replacement=" + replacement);

		crawlMessage(any, pattern, replacement);

		return message;
	}

	public String writeMessage(String camelHttpQuery) throws URISyntaxException {
		// URL params are not automatically added to Header params for POSTs
		// use CamelHttpQuery header to get URL params
		Map<String, Object> params = URISupport.parseQuery(camelHttpQuery);
		String pattern = (String) params.get("pattern");
		String replacement = (String) params.get("replacement");
		
		return "Replace this - "+pattern+" with this - "+replacement;
	}

	
	@SuppressWarnings("unchecked")
	private void crawlMessage(Map<String, Object> any, String pattern, String replacement) {
		log.info("messageTranslator::crawlMessage::map=" + any.toString());
		for (Iterator<String> it = any.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			Object object = any.get(key);
			if (object == null) {
				log.info("messageTranslator::crawlMessage::value=null->continue");
				continue;
			}
			log.info("Object class----" + object.getClass());
			if (object.getClass().equals(String.class)) {
				log.info("messageTranslator::crawlMessage::value.class=" + object.getClass());
				if (((String) object).contains(pattern)) {
					log.info("messageTranslator::crawlMessage::value=" + object.toString() + "->translate");
					object = ((String) object).replaceFirst(pattern, replacement);
					any.put(key, object);
					log.info("messageTranslator::crawlMessage::value=" + object.toString());
				} else {
					log.info("messageTranslator::crawlMessage::value=" + object.toString() + "->ignore");
					continue;
				}
			} else if (object.getClass().equals(LinkedHashMap.class)) {
				log.info("messageTranslator::crawlMessage::value=" + object.toString());
				log.info("messageTranslator::crawlMessage::value.class=" + object.getClass() + "->recurse");
				crawlMessage((Map<String, Object>) object, pattern, replacement);
			} else if (object.getClass().equals(ArrayList.class)) {
				log.info("messageTranslator::crawlMessage::value=" + object.toString());
				log.info("messageTranslator::crawlMessage::value.class=" + object.getClass() + "->recurse");
				crawlMessage((ArrayList<Object>) object, pattern, replacement);
			} else {
				log.info("messageTranslator::crawlMessage::value=" + object.toString());
				log.info("messageTranslator::crawlMessage::value.class=" + object.getClass() + "->continue");
				continue;
			}
		}
	}

	@SuppressWarnings("unchecked")
	private void crawlMessage(ArrayList<Object> any, String pattern, String replacement) {
		log.info("messageTranslator::crawlMessage::list=" + any.toString());
		for (Iterator<Object> it = any.iterator(); it.hasNext();) {
			Object object = it.next();
			if (object == null) {
				log.info("messageTranslator::crawlMessage::value=null->ignore");
				continue;
			}
			if (object.getClass().equals(LinkedHashMap.class)) {
				log.info("messageTranslator::crawlMessage::value=" + object.toString());
				log.info("messageTranslator::crawlMessage::value.class=" + object.getClass() + "->recurse");
				crawlMessage((Map<String, Object>) object, pattern, replacement);
			} else {
				log.info("messageTranslator::crawlMessage::value=" + object.toString());
				log.info("messageTranslator::crawlMessage::value.class=" + object.getClass() + "->continue");
				continue;
			}
		}
	}

}
