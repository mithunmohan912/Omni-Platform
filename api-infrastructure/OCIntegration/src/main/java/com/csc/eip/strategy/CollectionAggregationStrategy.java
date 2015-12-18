package com.csc.eip.strategy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.camel.Exchange;
import org.apache.camel.processor.aggregate.AggregationStrategy;
import org.apache.log4j.Logger;
import org.json.JSONException;

import com.csc.eip.bo.Message;
import com.csc.eip.util.Constants;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
public class CollectionAggregationStrategy implements AggregationStrategy {

	static Logger log = Logger.getLogger(CollectionAggregationStrategy.class.getName());

	String mergeItemsString = null;
	String addUpItemsString = null;
	String paramsListString = null;
	String removeFromParentString = null;
	String addTheseItemsFromOptionsString = null;

	public String getMergeItemsString() {
		return mergeItemsString;
	}

	public void setMergeItemsString(String mergeItemsString) {
		this.mergeItemsString = mergeItemsString;
	}

	public String getAddUpItemsString() {
		return addUpItemsString;
	}

	public void setAddUpItemsString(String addUpItemsString) {
		this.addUpItemsString = addUpItemsString;
	}

	public String getParamsListString() {
		return paramsListString;
	}

	public void setParamsListString(String paramsListString) {
		this.paramsListString = paramsListString;
	}

	public String getRemoveFromParentString() {
		return removeFromParentString;
	}

	public void setRemoveFromParentString(String removeFromParentString) {
		this.removeFromParentString = removeFromParentString;
	}

	public String getAddTheseItemsFromOptionsString() {
		return addTheseItemsFromOptionsString;
	}

	public void setAddTheseItemsFromOptionsString(String addTheseItemsFromOptionsString) {
		this.addTheseItemsFromOptionsString = addTheseItemsFromOptionsString;
	}

	ArrayList<String> mergeItemsIntoArray = null;
	ArrayList<String> addUpItems = null;
	ArrayList<String> paramsList = null;
	ArrayList<String> removeFromParentArray = null;
	ArrayList<String> addTheseItemsFromOptions = null;

	public void initialize() {
		if (mergeItemsIntoArray != null && mergeItemsIntoArray.size() > 0) {
			mergeItemsIntoArray.clear();
		}
		if (mergeItemsString != null) {
			mergeItemsString = mergeItemsString.replaceAll(Constants.CURLY_BRACES_REG_EXP, Constants.EMPTY_STRING)
					.replaceAll(Constants.BLANK_SPACES_REG_EXP, Constants.EMPTY_STRING);
			mergeItemsIntoArray = new ArrayList<String>(
					Arrays.asList(mergeItemsString.split(Constants.COMMA_DELIMITER)));
		}

		if (paramsList != null && paramsList.size() > 0) {
			paramsList.clear();
		}
		if (paramsListString != null) {
			paramsListString = paramsListString.replaceAll(Constants.CURLY_BRACES_REG_EXP, Constants.EMPTY_STRING)
					.replaceAll(Constants.BLANK_SPACES_REG_EXP, Constants.EMPTY_STRING);
			paramsList = new ArrayList<String>(Arrays.asList(paramsListString.split(Constants.COMMA_DELIMITER)));
		}

		if (addUpItems != null && addUpItems.size() > 0) {
			addUpItems.clear();
		}
		if (addUpItemsString != null) {
			addUpItemsString = addUpItemsString.replaceAll(Constants.CURLY_BRACES_REG_EXP, Constants.EMPTY_STRING)
					.replaceAll(Constants.BLANK_SPACES_REG_EXP, Constants.EMPTY_STRING);
			addUpItems = new ArrayList<String>(Arrays.asList(addUpItemsString.split(Constants.COMMA_DELIMITER)));
		}

		if (removeFromParentArray != null && removeFromParentArray.size() > 0) {
			removeFromParentArray.clear();
		}
		if (removeFromParentString != null) {
			removeFromParentString = removeFromParentString
					.replaceAll(Constants.CURLY_BRACES_REG_EXP, Constants.EMPTY_STRING)
					.replaceAll(Constants.BLANK_SPACES_REG_EXP, Constants.EMPTY_STRING);
			removeFromParentArray = new ArrayList<String>(
					Arrays.asList(removeFromParentString.split(Constants.COMMA_DELIMITER)));
		}

		if (addTheseItemsFromOptions != null && addTheseItemsFromOptions.size() > 0) {
			addTheseItemsFromOptions.clear();
		}
		if (addTheseItemsFromOptionsString != null) {
			addTheseItemsFromOptionsString = addTheseItemsFromOptionsString
					.replaceAll(Constants.CURLY_BRACES_REG_EXP, Constants.EMPTY_STRING)
					.replaceAll(Constants.BLANK_SPACES_REG_EXP, Constants.EMPTY_STRING);
			addTheseItemsFromOptions = new ArrayList<String>(
					Arrays.asList(addTheseItemsFromOptionsString.split(Constants.COMMA_DELIMITER)));
		}
	}
	public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {
		log.info("Collection Aggregation Strategy-------------");
		initialize();
		if (oldExchange == null) {
			return newExchange;
		}

		String oldBody = oldExchange.getIn().getBody(String.class);
		log.info("OLD EXCHANGE--- " + oldBody);
		String newBody = newExchange.getIn().getBody(String.class);
		log.info("NEW EXCHANGE--- " + newBody);
		try {
			ObjectMapper oldMapper = new ObjectMapper();
			Message oldParent = oldMapper.readValue(oldBody, Message.class);

			ObjectMapper newMapper = new ObjectMapper();
			Message newParent = newMapper.readValue(newBody, Message.class);

			crawlMessage(oldParent.getAny(), newParent.getAny());
			oldBody = oldMapper.writeValueAsString(oldParent);
			//log.info("RESPONSE BODY-------------" + oldBody);
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		oldExchange.getOut().setBody(oldBody);

		return oldExchange;
	}

	public void crawlMessage(Map<String, Object> oldAny, Map<String, Object> newAny) throws JSONException {

		for (Iterator<String> it = oldAny.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			Object oldObject = oldAny.get(key);
			Object newObject = newAny.get(key);
			// log.info("old object----" + oldObject);
			// log.info("new object----" + newObject);
			// log.info("key----" + key);
			if (oldObject == null && newObject == null) {
				continue;
			}
			if (oldObject.getClass().equals(String.class) && newObject.getClass().equals(String.class)) {
				continue;
			} else if (oldObject.getClass().equals(LinkedHashMap.class)
					&& newObject.getClass().equals(LinkedHashMap.class)) {

				if (mergeItemsIntoArray.contains(key)) {
					ArrayList<Object> array = new ArrayList<Object>();
					array.add(oldObject);
					array.add(newObject);
					oldAny.put(key, array);
				} else if (addUpItems.contains(key)) {
					crawlMessage(key, (Map<String, Object>) oldObject, (Map<String, Object>) newObject);
				} else {
					crawlMessage((Map<String, Object>) oldObject, (Map<String, Object>) newObject);
				}

			} else if (oldObject.getClass().equals(ArrayList.class) && newObject.getClass().equals(ArrayList.class)) {
				crawlMessage(key, (ArrayList<Object>) oldObject, (ArrayList<Object>) newObject);
			} else {
				continue;
			}
		}

	}

	public void crawlMessage(String parentKey, Map<String, Object> oldMap, Map<String, Object> newMap)
			throws JSONException {
		// log.info("Key----" + parentKey);
		for (Iterator<String> it = oldMap.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			Object oldObject = oldMap.get(key);
			Object newObject = newMap.get(key);
			// log.info("object---" + oldObject);
			if (oldObject == null && newObject == null) {
				continue;
			}
			if (oldObject.getClass().equals(String.class) && newObject.getClass().equals(String.class)) {
				for (String prefix : paramsList) {
					// log.info("prefix---" + prefix);
					oldObject = addUpLengths(prefix + Constants.EQUAL_TO, (String) oldObject, (String) newObject);
				}
				oldMap.put(key, oldObject);
				continue;
			}
		}
	}

	private String addUpLengths(String prefix, String oldObject, String newObject) {
		// log.info("Called");
		int indexNum1 = oldObject.indexOf(prefix) + prefix.length();
		int length1 = oldObject.length();
		int indexNum2 = newObject.indexOf(prefix) + prefix.length();
		int length2 = newObject.length();
		if (indexNum1 > prefix.length() && indexNum2 > prefix.length()) {
			int indexAmpersand1 = oldObject.indexOf(Constants.AMPERSAND, indexNum1);
			int indexAmpersand2 = newObject.indexOf(Constants.AMPERSAND, indexNum2);
			if (indexAmpersand1 > indexNum1 && indexAmpersand2 > indexNum2) {
				length1 = indexAmpersand1;
				length2 = indexAmpersand2;
			}
			Integer int1 = Integer.parseInt(oldObject.substring(indexNum1, length1));
			Integer int2 = Integer.parseInt(newObject.substring(indexNum2, length2));
			int sumLength1 = int1 + int2;
			oldObject = ((String) oldObject).replace(prefix + int1, prefix + sumLength1);
		}
		return oldObject;
	}

	private void crawlMessage(String parentKey, ArrayList<Object> oldAny, ArrayList<Object> newAny) {
		// log.info("Arryay list processing--------------------------");
		if (removeFromParentArray.contains(parentKey)) {
			for (int i = newAny.size() - 1; i >= 0; i--) {
				Object newObj = newAny.get(i);
				// log.info(newObj);
				// log.info(newObj.getClass());
				if (newObj.getClass().equals(LinkedHashMap.class) && newObj.getClass().equals(LinkedHashMap.class)) {
					if (removeMessage((Map<String, Object>) newObj)) {
						newAny.remove(i);
					}
				}
			}
		}
		oldAny.addAll(newAny);
	}

	public boolean removeMessage(Map<String, Object> newObject) {

		for (Iterator<String> it = newObject.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			if (addTheseItemsFromOptions.contains(key)) {
				return false;
			}
		}
		return true;
	}
}
