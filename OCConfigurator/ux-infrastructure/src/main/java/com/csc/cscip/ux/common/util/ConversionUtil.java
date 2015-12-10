package com.csc.cscip.ux.common.util;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class ConversionUtil {

	/**
	 * Method to convert a given XML String into a JSON String.
	 * @param xmlString - XML String
	 * @return JSON String
	 * @throws JSONException
	 */
	public static String convertXMLtoJSON(String xmlString) throws JSONException {
		return XML.toJSONObject(xmlString).toString();
	}
	
	/**
	 * Method to convert a given JSON String into a XML String with a given root tag.
	 * @param jsonString - JSON String
	 * @param rootTag - Root tag for the XML
	 * @return XML String
	 * @throws JSONException
	 */
	public static String convertJSONtoXML(String jsonString, String rootTag) throws JSONException {
		return XML.toString(convertJSONtoJSONObject(jsonString), rootTag);
	}

	/**
	 * Method to convert a given JSON String into a XML String.
	 * @param jsonString - JSON String
	 * @return XML String
	 * @throws JSONException
	 */
	public static String convertJSONtoXML(String jsonString) throws JSONException {
		return XML.toString(convertJSONtoJSONObject(jsonString));
	}

	/**
	 * Method to convert a given index of a JSON array into a JSON Object.
	 * 
	 * @param jsonString - JSON String
	 * @param index - index of the Array to be returned as a JSON Object
	 * @return JSON Object
	 * @throws JSONException
	 */
	public static JSONObject convertJSONtoJSONObject(String jsonString, int index) throws JSONException {
		if (jsonString.trim().startsWith("[")) {
			JSONArray jsonArray = new JSONArray(jsonString);
			return (JSONObject) jsonArray.get(index);
		}
		return new JSONObject(jsonString);
	}

	/**
	 * Method to convert a given JSON String into a JSON Object.
	 * @param jsonString - JSON String
	 * @return JSON Object
	 * @throws JSONException
	 */
	public static JSONObject convertJSONtoJSONObject(String jsonString) throws JSONException{
		return convertJSONtoJSONObject(jsonString, 0);
	}

	/**
	 * Method to convert a given JSON Object into a XML String.
	 * @param jsonObject - JSON Object
	 * @return XML String
	 * @throws JSONException
	 */
	public static String convertJSONObjecttoXML(JSONObject jsonObject, String rootTag) throws JSONException {
		return XML.toString(jsonObject, rootTag);
	}

	/**
	 * Method to convert a given Map<?,?> to a JSON String.
	 * @param map - Map<?,?>
	 * @return JSON String
	 * @throws IOException
	 */
	public static String convertMaptoJSON(Map<?, ?> map) throws IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		Writer jsonWriter = new StringWriter();
		JsonGenerator jsonGenerator = new JsonFactory().createJsonGenerator(jsonWriter);
		objectMapper.writeValue(jsonGenerator, map);
		jsonGenerator.close();
		return jsonWriter.toString();
	}
	
	/**
	 * Method to convert a given Map<?,?> to a JSON Array.
	 * @param map - Map<?,?>
	 * @param arrayName - Name of the array
	 * @param mapKey - Key for the map
	 * @param mapValue - Value in the map
	 * @return JSON String
	 * @throws Exception
	 */
	public static String convertMaptoJSONArray(Map<?, ?> map, String arrayName, String mapKey, String mapValue) throws Exception {
		List<HashMap<?, ?>> mapObjects = new ArrayList<HashMap<?, ?>>();
		for (Object key : map.keySet()) {
			HashMap<Object, Object> hashMap = new HashMap<Object, Object>();
			hashMap.put(mapKey, key);
			hashMap.put(mapValue, map.get(key));
			mapObjects.add(hashMap);
		}
		return convertListOfMaptoJSONArray(mapObjects, arrayName);
	}

	/**
	 * Method to convert a given List<HashMap<?, ?>> to a JSON Array.
	 * @param map - List<HashMap<?, ?>>
	 * @param arrayName - Name of the array
	 * @return JSON String
	 * @throws Exception
	 */
	public static String convertListOfMaptoJSONArray(List<HashMap<?, ?>> mapObjects, String arrayName) throws Exception {
		Writer jsonWriter = new StringWriter();
		JsonGenerator jsonGenerator = new JsonFactory().createJsonGenerator(jsonWriter);
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, Object> arrayMap = new HashMap<String, Object>();
		arrayMap.put(arrayName, mapObjects);
		objectMapper.writeValue(jsonGenerator, arrayMap);
		jsonGenerator.close();
		return jsonWriter.toString();
	}
	
	/**
	 * Method to convert a JSON File into a Map<?,?>.
	 * @param jsonName - Name of the JSON file.
	 * @return Map<?,?> created out of the JSON.
	 * @throws Exception
	 */
	public static Map<String, Object> convertJSONPathtoMap(String jsonName) throws Exception {
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.readValue(IOUtils.readContent(jsonName),
				new TypeReference<Map<String, Object>>() {
				});
	}
		
	/**
	 * Method to convert a JSON String into a Map<?,?>.
	 * @param jsonString - JSON string.
	 * @return Map<?,?> created out of the JSON.
	 * @throws Exception
	 */
	public static Map<String, Object> convertJSONStringtoMap(String jsonString) throws Exception {
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.readValue(jsonString, new TypeReference<Map<String, Object>>() {});
	}
		
	/**
	 * Method to convert a given XML Document into a XML String.
	 * @param doc - XML Document
	 * @return XML String
	 * @throws TransformerException
	 */
	public static String convertXMLDocumentToString(Document doc) throws TransformerException {
		DOMSource domSource = new DOMSource(doc);
		StringWriter writer = new StringWriter();
		StreamResult result = new StreamResult(writer);
		TransformerFactory tf = TransformerFactory.newInstance();
		Transformer transformer = tf.newTransformer();
		transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
		transformer.transform(domSource, result);
		writer.flush();
		return writer.getBuffer().toString().replaceAll("\n|\r", "");
	}

	/**
	 * Method to convert a given XML String into a XML document.
	 * @param xmlStr - XML String
	 * @return XML Document object
	 * @throws Exception
	 */
	public static Document convertStringToXMLDocument(String xmlStr) throws Exception {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		Document doc = builder.parse(new InputSource(new StringReader(xmlStr)));
		return doc;
	}
	
	/**
	 * Method to convert a given Object into a JSON String.
	 * @param object - Input Object
	 * @return JSON String
	 * @throws Exception
	 */
	public static String convertObjectToJSON(Object object) throws Exception {
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.writeValueAsString(object);
	}
	
	/**
	 * Method to convert a given JSON String to a POJO object.
	 * @param Class<?> - Type of the POJO object required 
	 * @param JSON String 
	 * @return POJO object
	 * @throws Exception
	 */
	public static Object convertJSONtoObject(String jsonString, Class<?> clazz) throws Exception {
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.readValue(jsonString, clazz);
	}
	
	/**
	 * Method to convert a JSON String to a List<Object>.
	 * @param json - JSON String
	 * @return List<Object>
	 * @throws Exception
	 */
	public static List<Object> convertJSONtoList(String json) throws Exception {
		ObjectMapper jacksonObjectMapper = new ObjectMapper();
		return jacksonObjectMapper.readValue(json, new TypeReference<List<Object>>() {});
	}
	
	/**
	 * Method to convert a given List<Object> to a JSON String.
	 * @param jsonList - List<Object>
	 * @return - JSON String
	 * @throws Exception
	 */
	public static String convertListToJson(List<?> jsonList) throws Exception {
		ObjectMapper jacksonObjectMapper = new ObjectMapper();
		return jacksonObjectMapper.writeValueAsString(jsonList);		
	}

	/**
	 * Method to transform a XML using a given XSLT.
	 * @param modelXML - Input XML String
	 * @param XSLname - XSLT name
	 * @param transformerURL - Location of XSLT
	 * @return - Transformation result
	 * @throws Exception 
	 */
	public static String transformXMLusingXSLT(String modelXML, String XSLname, String transformerURL) throws Exception {
		Source xmlDoc = new StreamSource(new StringReader(modelXML));
		String xslPath = transformerURL + File.separator + XSLname;
		Source xslDoc = new StreamSource(ConversionUtil.class.getResourceAsStream(xslPath));
		TransformerFactory tFactory = TransformerFactory.newInstance();
		tFactory.setURIResolver(new UxURIResolver(transformerURL));
		Transformer transformer = tFactory.newTransformer(xslDoc);
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
		StreamResult result = new StreamResult(new StringWriter());
		transformer.transform(xmlDoc, result);
		return result.getWriter().toString();
	}
	
	/**
	 * Method to transform a XML using a given XSLT.
	 * @param modelXML - Input XML String
	 * @param XSLname - XSLT name
	 * @param transformerURL - Location of XSLT
	 * @param params - List of parameters for XSLT.
	 * @return - Transformation result
	 * @throws Exception 
	 */
	public static String transformXMLusingXSLTWithParams(String modelXML, String XSLname, String transformerURL, String...params) throws Exception {
		Source xmlDoc = new StreamSource(new StringReader(modelXML));
		String xslPath = transformerURL + File.separator + XSLname;
		Source xslDoc = new StreamSource(ConversionUtil.class.getResourceAsStream(xslPath));
		TransformerFactory tFactory = TransformerFactory.newInstance();
		tFactory.setURIResolver(new UxURIResolver(transformerURL));
		Transformer transformer = tFactory.newTransformer(xslDoc);
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
		for(int i=0;(i+1)<params.length;i+=2) {
			transformer.setParameter(params[i], params[i+1]);
		}
		StreamResult result = new StreamResult(new StringWriter());
		transformer.transform(xmlDoc, result);
		return result.getWriter().toString();
	}
	
	/**
	 * Method to prettify and indent the unformatted JSON String.
	 * @param unformattedJSONString - JSON String with no formatting/indentation
	 * @return - Formatted/Prettified JSON String
	 */
	public static String prettifyJSON(String unformattedJSONString) {
		JsonParser parser = new JsonParser();
		JsonElement el = parser.parse(unformattedJSONString);
		
		Gson gson = new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create();
		String prettyJSON = gson.toJson(el);
		return prettyJSON;
	}

	/**
	 * Converts a property file object into a JSONObject.
	 * 
	 * @param properties - java.util.Properties. The property file object is a table of name value pairs.
	 * @return JSONObject for the Properties
	 * @throws JSONException
	 */
	public static JSONObject convertPropertiesToJSONObject(java.util.Properties properties) throws JSONException {
		JSONObject jo = new JSONObject();
		if (properties != null && !properties.isEmpty()) {
			Enumeration<?> enumProperties = properties.propertyNames();
			while (enumProperties.hasMoreElements()) {
				String name = (String) enumProperties.nextElement();
				jo.put(name, properties.getProperty(name));
			}
		}
		return jo;
	}
}
