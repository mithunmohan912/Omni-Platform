package com.csc.eip.pattern;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.camel.Header;
import org.apache.log4j.Logger;

import com.csc.eip.bo.Message;

/**
 * Message Translator
 */
public class MessageTranslator {

	static Logger log = Logger.getLogger(MessageTranslator.class.getName());

	public static final String PATTERN		= "Pattern";
	public static final String REPLACEMENT	= "Replacement";
	
	public MessageTranslator() {
	}

	/**
	 * Replaces all pattern matches in a JSON message
	 *
	 * @param message
	 * 
	 * @throws URISyntaxException
	 */
	public Message replacePattern(Message message, @Header(PATTERN) String pattern,
			@Header(REPLACEMENT) String replacement) throws URISyntaxException {

		Map<String, Object> any = message.getAny();
		
		log.debug("replacePattern::message=" + any.toString());
		log.debug("replacePattern::pattern=" + pattern);
		log.debug("replacePattern::replacement=" + replacement);

		crawlMessage(any, pattern, replacement);

		log.debug("replacePattern::message=" + message.getAny().toString());

		return message;
	}

	@SuppressWarnings("unchecked")
	private void crawlMessage(Map<String, Object> any, String pattern, String replacement) {
		log.debug("crawlMessage::map=" + any.toString());
		for (Iterator<String> it = any.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			Object object = any.get(key);
			if (object == null) {
				log.debug("crawlMessage::value=null->continue");
				continue;
			}
			if (object.getClass().equals(String.class)) {
				log.debug("crawlMessage::value.class=" + object.getClass());
				if (((String) object).contains(pattern)) {
					log.debug("crawlMessage::value=" + object.toString() + "->translate");
					object = ((String) object).replaceFirst(pattern, replacement);
					any.put(key, object);
					log.debug("crawlMessage::value=" + object.toString());
				} else {
					log.debug("crawlMessage::value=" + object.toString() + "->ignore");
					continue;
				}
			} else if (object.getClass().equals(LinkedHashMap.class)) {
				log.debug("crawlMessage::value=" + object.toString());
				log.debug("crawlMessage::value.class=" + object.getClass() + "->recurse");
				crawlMessage((Map<String, Object>) object, pattern, replacement);
			} else if (object.getClass().equals(ArrayList.class)) {
				log.debug("crawlMessage::value=" + object.toString());
				log.debug("crawlMessage::value.class=" + object.getClass() + "->recurse");
				crawlMessage((ArrayList<Object>) object, pattern, replacement);
			} else {
				log.debug("crawlMessage::value=" + object.toString());
				log.debug("crawlMessage::value.class=" + object.getClass() + "->continue");
				continue;
			}
		}
	}

	@SuppressWarnings("unchecked")
	private void crawlMessage(ArrayList<Object> any, String pattern, String replacement) {
		log.debug("crawlMessage::list=" + any.toString());
		for (Iterator<Object> it = any.iterator(); it.hasNext();) {
			Object object = it.next();
			if (object == null) {
				log.debug("crawlMessage::value=null->ignore");
				continue;
			}
			if (object.getClass().equals(LinkedHashMap.class)) {
				log.debug("crawlMessage::value=" + object.toString());
				log.debug("crawlMessage::value.class=" + object.getClass() + "->recurse");
				crawlMessage((Map<String, Object>) object, pattern, replacement);
			} else {
				log.debug("crawlMessage::value=" + object.toString());
				log.debug("crawlMessage::value.class=" + object.getClass() + "->continue");
				continue;
			}
		}
	}

}
