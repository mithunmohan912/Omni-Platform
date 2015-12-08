package com.csc.cscip.ux.common.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javassist.bytecode.Descriptor.Iterator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.csc.cscip.ux.common.integration.IntegrationService;
import com.csc.cscip.ux.common.rest.exception.RestException;
import com.csc.cscip.ux.common.rest.processor.ServiceProcessor;
import com.csc.cscip.ux.common.rest.processor.ServiceProcessorFactory;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;
import com.csc.cscip.ux.common.util.CommonConstants;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXJacksonUtils;

@SuppressWarnings(value = { "unchecked", "rawtypes" })
public abstract class AbstractRestController {

	public static IntegrationService getIntegrationService() {
		return ApplicationContextProvider.getApplicationContext().getBean(IntegrationService.class);
	}

	protected static ServiceProcessorFactory getServiceProcessorFactory() {
		return ApplicationContextProvider.getApplicationContext().getBean(ServiceProcessorFactory.class);
	}

	@ExceptionHandler(Throwable.class)
	public static void handleException(Throwable exception, HttpServletResponse httpServletResponse) throws Throwable {
		handleException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, exception, httpServletResponse);
	}

	protected static void handleException(int sc, Throwable exception, HttpServletResponse httpServletResponse) throws IOException, Throwable {
		httpServletResponse.setStatus(sc);
		setExceptionTrace(exception, httpServletResponse);
		httpServletResponse.getOutputStream().flush();
	}

	protected static void setExceptionTrace(Throwable exception, HttpServletResponse httpServletResponse) throws IOException, Throwable {
		Map<String, String> exceptionMap = new HashMap<String, String>();

		String defaultMessage = "An Exception has occurred. Please contact your System Administrator.";
		if (exception instanceof RestException) {
			defaultMessage = defaultMessage + exception.getMessage();
		} else {
			defaultMessage = exception.getMessage();
		}
		exceptionMap.put("message", defaultMessage);
		exceptionMap.put("stackTrace", ExceptionUtils.getFullStackTrace(exception));

		httpServletResponse.setContentType(CommonConstants.JSON_CONTENT_TYPE);
		httpServletResponse.getOutputStream().write(("{\"exception\" : " + UXJacksonUtils.convertToJSON(exceptionMap) + "}").getBytes());
	}

	protected static Object sendServiceRequest(String requestType, String resource, Object requestPayLoad, Object responsePayLoad) throws Throwable {

		ServiceProcessor serviceProcessor = getServiceProcessorFactory().lookupServiceProcessor(requestType);
		Object requestData = serviceProcessor.produceRequest(requestPayLoad, null);
		DataModelMerge dataModelMerge = new AbstractRestController.DataModelMerge();
		requestData = dataModelMerge.mergeRequestData(requestData);
		System.out.println("requestData---->"+requestData);
		String responseData = getIntegrationService().send("direct:" + resource, null, requestData, String.class).replace((char) 0, ' ');
		System.out.println("responseData---->"+responseData);
		responseData = dataModelMerge.mergeResponseData(responseData);
		
		Object responsePayLoadObj = serviceProcessor.consumeResponse(responseData, requestPayLoad, responsePayLoad, null);
		return responsePayLoadObj;
	}


	/**
	 * Encapsulates operations dealing with merging page and metamodel data.
	 * @author bcreel2
	 *
	 */
	static class DataModelMerge {
		private String screenID = null, requestCode = null;
		private Map<String, JsonNode> controlList = null;
		private Map<String, String> screenCodes = null;
		private static final String PAGEPREFIX = "MULTI_"; 
	
		/**
		 * Given a simple XML document of NVPs, extract the page name, retrieve the related metamodel, and
		 * merge additional contextual data from that metamodel into the XML.
		 * 
		 * @param requestData
		 * @return The merged XML
		 * @throws Throwable 
		 */
		public Object mergeRequestData(Object requestData) throws Throwable {
			Document requestDoc = DocumentHelper.parseText((String) requestData);
			//Retrieve the screenId, return if there isn't one
			Node screenNode = requestDoc.selectSingleNode("/PayLoad/screenId");
			if (screenNode == null) {
				return requestData;
			}
			screenID = screenNode.getText();
			//Retrieve the request code, return if there isn't one
			Node requestNode = requestDoc.selectSingleNode("/PayLoad/REQUESTCODE");
			if (requestNode == null) {
				return requestData;
			}
			requestCode = requestNode.getText();
			
			//Get the controls for this metamodel
			if(!screenID.equals(""))
				controlList = getMetamodelControls(screenID);
			//Cache screen IDs and their request codes
			screenCodes = new HashMap<String, String>();
			if(requestCode !=null && requestCode.length()>=8){
				screenCodes.put(screenID, requestCode.substring(0, 8)); //Add the code for this screen
			}
	
			if (requestDoc.selectSingleNode("/PayLoad/checkMulti") != null) {
				//This is a retrieve request that may need to be formatted to retrieve multiple screen
				//  records.
				for (JsonNode node : controlList.values()) {
					String foundScreenID = node.path("page").getTextValue();
					if (foundScreenID != null && !screenCodes.containsKey(foundScreenID)) {
						List<Map<String, String>> rows = executeSQL("SELECT TOP 1 RCLKREQST FROM BASSYS0702 WHERE RCLKURL like '%" + foundScreenID + ".%'");
						if (rows.size() > 0) {
							screenCodes.put(foundScreenID, rows.get(0).get("RCLKREQST").substring(0,8));
						}
					}
				}
				if (screenCodes.size() > 1) {
					//Add the node to make sure this is transformed into a multi-request
					Element pageElement = requestDoc.getRootElement().addElement(PAGEPREFIX);
					for (java.util.Iterator i = screenCodes.values().iterator(); i.hasNext();) {
						pageElement.addElement("page").setText((String)i.next());
					}
				}
			} else if (requestDoc.selectSingleNode("/PayLoad/" + PAGEPREFIX) != null) {
				//This a multi-page save. Check controls for defaultValue or reference that need action
				for (JsonNode node : controlList.values()) {
					String controlName = node.path("name").getTextValue();
					String reference = node.path("reference").getTextValue();
					String defaultValue = node.path("defaultValue").getTextValue();
					if (reference == null) {
						reference = "";
					}
					if (defaultValue == null) {
						defaultValue = "";
					}
					//Don't bother if neither property is actually set
					if (reference.equals("") && defaultValue.equals("")) {
						continue;
					}
					//Also don't bother if the control actually has a value
					Element controlElement = (Element)requestDoc.selectSingleNode("/PayLoad/" + controlName);
					if (controlElement == null || !controlElement.getText().equals("")) {
						continue;
					}
					if (!reference.equals("")) {
						//In the case of a reference, we need to use the value of the requested control
						Element referencedElement = (Element)requestDoc.selectSingleNode("/PayLoad/" + reference);
						if (referencedElement == null) {
							continue;
						}
						defaultValue = referencedElement.getText();
					}
					controlElement.setText(defaultValue);
				}
				//Expand the PAGEPREFIX node to help out the XSL since
				//  we don't have the tokenize() function from XSLT 2.0.
				Element pageListElement = (Element)requestDoc.selectSingleNode("/PayLoad/" + PAGEPREFIX);
				String[] pageList = pageListElement.getText().split(",");
				pageListElement.setText("");
				for (int i = 0; i < pageList.length; i++) {
					pageListElement.addElement("page").setText(pageList[i]);
				}
			}
			
			return requestDoc.asXML();
		}
		
		/**
		 * Examines response XML - if it is a multi-response, it is merged according the corresponding
		 * metamodel and converted to a flat document for JSON conversion.
		 * @param responseData
		 * @return
		 * @throws DocumentException 
		 * @throws Throwable 
		 */
		public String mergeResponseData(String responseData) throws DocumentException {
			List nodeList;
			
			//No need to process the response if the request wasn't examined
			if (screenID == null) {
				return responseData;
			}
			//Also we only care about multi-responses
			if (responseData.indexOf("<MULTIRECCALLRs>") == -1) {
				return responseData;
			}
			
			Document responseDoc = DocumentHelper.parseText(responseData);
			Document mergedDoc = DocumentHelper.createDocument();			
			Element mergedRoot = mergedDoc.addElement("POINTXML");
			
			//Add any errors that are in the response
			int errorIndex = 1;
			nodeList = responseDoc.selectNodes("/MULTIRECCALLRs/ERROR__LST__ROW/ERROR__LST");
			for (java.util.Iterator i = nodeList.iterator(); i.hasNext();) {
				Element xmlElement = (Element) i.next();
				//Only add this error if there is a message
				if (!xmlElement.selectSingleNode("ERROR__MSG").getText().equals("")) {
					String errorMessage = xmlElement.selectSingleNode("ERROR__MSG").getText();
					String errorSeverity = xmlElement.selectSingleNode("ERROR__SEVERITY").getText();
					String errorSwitch = xmlElement.selectSingleNode("ERROR__SWITCH").getText();
					String errorField = xmlElement.selectSingleNode("ERROR__FIELD").getText();
					mergedRoot.addElement("ERROR" + Integer.toString(errorIndex))
						.setText(errorMessage);
					mergedRoot.addElement("ERRORSEV" + Integer.toString(errorIndex))
						.setText(errorSeverity);
					mergedRoot.addElement("ERRORSWITCH" + Integer.toString(errorIndex))
						.setText(errorSwitch);
					mergedRoot.addElement("ERRORFIELD" + Integer.toString(errorIndex))
						.setText(errorField);
					errorIndex++;
				}
			}
			
			//First add the fields for the current page
			requestCode = requestCode.replace("CHGRq", "INQRq");
			nodeList = responseDoc.selectNodes("/MULTIRECCALLRs/" + requestCode + "/POINTXML/*");
			for (java.util.Iterator i = nodeList.iterator(); i.hasNext();) {
				Element xmlElement = (Element) i.next();
				mergedRoot.add(xmlElement.createCopy());
			}
			//Add fields from other pages, but only if they are in the metamodel. Also existing nodes
			//  have priority.
			nodeList = responseDoc.selectNodes("/MULTIRECCALLRs/*[name() != '" + requestCode + "']/POINTXML/*");
			for (java.util.Iterator i = nodeList.iterator(); i.hasNext();) {
				Element xmlElement = (Element) i.next();
				//if (mergedRoot.selectSingleNode(xmlElement.getName()) == null &&
				//		controlList.containsKey(xmlElement.getName())) {
				if (mergedRoot.selectSingleNode(xmlElement.getName()) == null) {
					mergedRoot.add(xmlElement.createCopy());
				}
			}
			
			//List the codes and controls for this response
			nodeList = responseDoc.selectNodes("/MULTIRECCALLRs/*");
			Map<String, String[]> multiPageList = new HashMap<String, String[]>();
			for (java.util.Iterator i = nodeList.iterator(); i.hasNext();) {
				Element xmlElement = (Element)i.next();
				//We have to ignore the error node for the purposes of this section.
				if (xmlElement.getName().equals("ERROR__LST__ROW")) { 
					continue;
				}
			 	String[] controlList = new String[xmlElement.element("POINTXML").elements().size()];
			 	for (int j = 0; j < xmlElement.element("POINTXML").elements().size(); j ++) {
			 		controlList[j] = ((Element)xmlElement.element("POINTXML").elements().get(j)).getName();
			 	}
				multiPageList.put(xmlElement.getName().substring(0, 8), controlList);
			}
			//Add the page and control arrays
			mergedRoot.addElement(PAGEPREFIX)
				.setText(Join(",", multiPageList.keySet().toArray(new String[0])));
			for (java.util.Iterator i = multiPageList.keySet().iterator(); i.hasNext();) {
				String currentCode = (String)i.next();
				mergedRoot.addElement(PAGEPREFIX + currentCode)
					.setText("[" + Join("][", (String[]) multiPageList.get(currentCode)) + "]");
			}

			return mergedDoc.asXML();
		}
		
		/**
		 * Retrieves the requested metamodel and extracts all of the controls into a HashMap of the JSON
		 * objects.
		 * @return
		 * @throws Exception 
		 */
		private Map<String, JsonNode> getMetamodelControls(String screenID) throws Exception {
			Map<String, JsonNode> controlList = new HashMap<String, JsonNode>();
			
			//Retrieve the metamodel JSON and load into Jackson object
			MetaController metaController = new MetaController();
			Object metaModel = metaController.getMetaModel(screenID);
			ObjectMapper mapper = new ObjectMapper();
			JsonNode rootNode = mapper.readValue((String)metaModel, JsonNode.class);
		
			//Traverse the metamodel maze
			for (JsonNode section : rootNode.path("metadata").path("section")) {
				for (JsonNode subsection : section.path("subsection")) {
					for (JsonNode element : subsection.path("element")) {
						if (element.path("name").getTextValue() == null) {
							break; //Ignore items with no 'name'
						}
						controlList.put(element.path("name").getTextValue(), element);
						
						if (element.path("controlgroup").isArray()) {
							for (JsonNode groupElement : element.path("controlgroup")) {
								if (groupElement.path("name").getTextValue() == null) {
									break; //Ignore items with no 'name'
								}
								controlList.put(groupElement.path("name").getTextValue(), groupElement);
							}
						}				
					}
				}
			}
			return controlList;
		}
	
		/**
		 * Just an internal version of executeStmt.
		 * @param type
		 * @param query
		 * @param payLoad
		 * @return
		 * @throws Throwable
		 */
		private List<Map<String, String>> executeSQL(String query) throws Throwable {
			JDBCInfo jdbcInfo = new JDBCInfo();
			jdbcInfo.setType(Type.SQL);
			jdbcInfo.setStmt(query);
			jdbcInfo.setPayLoad(new RequestPayLoad());
			JDBCResponsePayLoad result = (JDBCResponsePayLoad) sendServiceRequest(UXAppConfig.JDBC, "service", jdbcInfo, new JDBCResponsePayLoad());
			List<Map<String, String>> rows = result.getRows();
			return rows;
		}
		
		/**
		 * Java doesn't have String.join() so I borrowed one from the 90s.
		 * @param data
		 * @param separator
		 * @return
		 */
		private String Join(String separator, String[] data) {
			StringBuilder sb = new StringBuilder();
			String _separator = "";
			for(String item : data){
			    sb.append(_separator);
			    _separator = separator;
			    sb.append(item);
			}
			return sb.toString();
		}
	}

	
	protected static Object recieveServiceResponse(String requestType, String resource, Object requestPayLoad, Object responsePayLoad) throws Throwable {

		String responseData = getIntegrationService().receive("direct:" + resource, String.class);

		ServiceProcessor serviceProcessor = getServiceProcessorFactory().lookupServiceProcessor(requestType);
		Object responsePayLoadObj = serviceProcessor.consumeResponse(responseData, requestPayLoad, responsePayLoad, null);
		return responsePayLoadObj;
	}

	protected static RequestPayLoad parseRequest(HttpServletRequest request) throws IOException, Throwable {
		return (RequestPayLoad) parseRequest(request, RequestPayLoad.class);
	}

	protected static <T extends Map> T parseRequest(HttpServletRequest request, Class<T> payLoadClass) throws IOException, Throwable {
		String requestJSON = IOUtils.readContent(request.getInputStream());
		T payLoad = (T) UXJacksonUtils.convertFromJSON(requestJSON, payLoadClass);
		payLoad.put("sessionKey", request.getHeader("Authentication"));
		return payLoad;
	}
	
	protected static <T extends Map> T parseRequest(String requestJSON,String sessionKey, Class<T> payLoadClass) throws IOException, Throwable {
		T payLoad = (T) UXJacksonUtils.convertFromJSON(requestJSON, payLoadClass);
		payLoad.put("sessionKey", sessionKey);
		return payLoad;
	}

	protected static Object processRequest(Object RestRequest, String requestType, String resource, HttpServletResponse response, Object responsePayload)
			throws IOException, Throwable {

		Object responsePayLoadObj = sendServiceRequest(requestType, resource, RestRequest, responsePayload);

		if (responsePayLoadObj instanceof String) {
			String responseJSON = (String) responsePayLoadObj;
			if (responseJSON.contains("{\"exception\":")) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
			return responseJSON;
		} else {
			return (ResponsePayLoad) responsePayLoadObj;
		}

	}

	protected List<Map<String, String>> executeStmt(Type type, String query) throws Throwable {
		return executeStmt(type, query, new RequestPayLoad());
	}

	protected List<Map<String, String>> executeStmt(Type type, String query, RequestPayLoad payLoad) throws Throwable {

		JDBCInfo jdbcInfo = new JDBCInfo();
		jdbcInfo.setType(type);
		jdbcInfo.setStmt(query);
		jdbcInfo.setPayLoad(payLoad);
		JDBCResponsePayLoad result = (JDBCResponsePayLoad) sendServiceRequest(UXAppConfig.JDBC, "service", jdbcInfo, new JDBCResponsePayLoad());

		List<Map<String, String>> rows = result.getRows();
		return rows;
	}

}
