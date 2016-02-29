package com.csc.eip.pattern;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.camel.Header;
import org.apache.log4j.Logger;

import com.csc.eip.bo.Message;

/**
 * Message Translator
 */
public class MessageTranslator {

	static Logger log = Logger.getLogger(MessageTranslator.class.getName());

	public static final String PATTERN = "Pattern";
	public static final String REPLACEMENT = "Replacement";
	Pattern patternRegex;
	String replacement;

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
		patternRegex = Pattern.compile(pattern);
		this.replacement = replacement;
		crawlMessage(any);

		log.debug("replacePattern::message=" + message.getAny().toString());

		return message;
	}

	@SuppressWarnings("unchecked")
	private void crawlMessage(Map<String, Object> any) {
		for (Iterator<String> it = any.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			Object object = any.get(key);
			if (object == null) {
				log.debug("crawlMessage::value=null->continue");
				continue;
			}
			if (object.getClass().equals(String.class)) {
				log.debug("crawlMessage::value.class=" + object.getClass());
				Matcher matcher = patternRegex.matcher((String) object);

				object = matcher.replaceAll(replacement);
				any.put(key, object);
				log.debug("crawlMessage::value=" + object.toString() + "->translate");
			} else if (object.getClass().equals(LinkedHashMap.class)) {
				log.debug("crawlMessage::value=" + object.toString());
				log.debug("crawlMessage::value.class=" + object.getClass() + "->recurse");
				crawlMessage((Map<String, Object>) object);
			} else if (object.getClass().equals(ArrayList.class)) {
				log.debug("crawlMessage::value=" + object.toString());
				log.debug("crawlMessage::value.class=" + object.getClass() + "->recurse");
				crawlMessage((ArrayList<Object>) object);
			} else {
				log.debug("crawlMessage::value=" + object.toString());
				log.debug("crawlMessage::value.class=" + object.getClass() + "->continue");
				continue;
			}
		}
	}

	@SuppressWarnings("unchecked")
	private void crawlMessage(ArrayList<Object> any) {
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
				crawlMessage((Map<String, Object>) object);
			} else {
				log.debug("crawlMessage::value=" + object.toString());
				log.debug("crawlMessage::value.class=" + object.getClass() + "->continue");
				continue;
			}
		}
	}

}
