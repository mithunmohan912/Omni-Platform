package com.csc.cscip.ux.pointin.rest.processor;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;

import com.csc.cscip.ux.common.rest.processor.AbstractServiceProcessor;
import com.csc.cscip.ux.common.rest.processor.xml.XMLProcessorCallbackContext;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.UXUtils;
import com.csc.cscip.ux.pointin.util.NavigationConfig;
import com.csc.cscip.ux.pointin.util.SurroundProductConfig;

@SuppressWarnings("unchecked")
public class NavigationDataProcessor extends AbstractServiceProcessor<RequestPayLoad, ResponsePayLoad> {

	private static DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
	private static DocumentBuilder db;

	private ServiceProcessorCallback requestCallback = new ServiceProcessorCallback() {

		@Override
		public void processCallback(ServiceProcessorCallbackContext context) {
			XMLProcessorCallbackContext xmlContext = (XMLProcessorCallbackContext) context;
			xmlContext.overrideTagForClass("PayLoad", RequestPayLoad.class);
		}
	};

	@Override
	public ServiceProcessorCallback getRequestProcessorCallback(RequestPayLoad requestPayLoad) {
		return requestCallback;
	}

	@Override
	public Object produceRequest(RequestPayLoad requestPayLoad, com.csc.cscip.ux.common.rest.processor.ServiceProcessor.ServiceProcessorCallback callback) throws Throwable {
		return getDelegate().produceRequest(requestPayLoad, getRequestProcessorCallback(requestPayLoad));
	}

	@Override
	public Object consumeResponse(String responseXML, RequestPayLoad requestPayLoad, ResponsePayLoad responsePayLoad, ServiceProcessorCallback callback) throws Throwable {

		if (responseXML.contains("<exception>")) {
			String responseJSON = ConversionUtil.convertXMLtoJSON(responseXML);
			return responseJSON;
		}

		StringReader sr = new StringReader(responseXML);

		try {

			db = dbf.newDocumentBuilder();
			Document doc = db.parse(new InputSource(sr));

			List<String> nodeStatus = Arrays.asList(NavigationConfig.getProperty("NodeStatus").split(","));

			Element root = doc.getDocumentElement();
			root.normalize();

			// Root
			Map<String, Object> rootMap = new HashMap<String, Object>();
			responsePayLoad.put("root", rootMap);

			// Document
			Map<String, Object> documentMap = new HashMap<String, Object>();
			rootMap.put("document", documentMap);
			String status ="";
			List<Map<String, Object>> rootActions = new ArrayList<Map<String, Object>>(); 
			for (Node rootChild = root.getFirstChild(); rootChild != null; rootChild = rootChild.getNextSibling()) {

				if (rootChild.getNodeType() == Node.ELEMENT_NODE) {

					String name = rootChild.getNodeName();					
					// Status
					if (name.equals("Header")) {

						NamedNodeMap rootStatusNodemap = rootChild.getAttributes();
						status = rootStatusNodemap.getNamedItem("Desc").getNodeValue();
						status = status.substring(status.indexOf("|") + 1);
						rootMap.put("status", status);

					}
					// Actions
					else if (name.equals("Hovers")) {
						rootActions = createRootActions(rootChild);
						rootMap.put("actions", rootActions);
						
					} else if (name.equals("PMSP0200_S") || name.equals("CBSUMMARY_S") || name.equals("AGSUMMARY_S") || name.equals("BRSUMMARY_S")) {

						List<Map<String, Object>> linksList = new ArrayList<Map<String, Object>>();

						linksList.add(createDocumentNodes());
						String prevNode = "";
						for (Node linkNode = rootChild.getFirstChild(); linkNode != null; linkNode = linkNode.getNextSibling()) {

							if (linkNode.getNodeType() == Node.ELEMENT_NODE) {

								String linkNodeName = linkNode.getNodeName();

								// Actions
								if (linkNodeName.equals("Hovers")) {
									createDocumentActions(linkNode, documentMap);
								} else {

									// Links
									Map<String, Object> linkMap = createLink(linkNode, nodeStatus);
									String currentNode = (String)linkMap.get("id");
									String currentStatus = (String)linkMap.get("status");
									if(!(prevNode.equals(currentNode) && "Verified".equals(currentStatus))){
										linksList.add(linkMap);
									}
									prevNode = currentNode;
									if (linkNodeName.equals("ASBBCPP_S") || // Insurance Line
											linkNodeName.equals("ASBQCPP_S") || // Unit
											linkNodeName.equals("PMSPWC07_S") || // State
											linkNodeName.equals("PMSPSA05_S") || // Stat Unit
											linkNodeName.equals("ASBJCPP_S") || // Vehicle
											linkNodeName.equals("RDB1_D")  ||
											linkNodeName.equals("RDB2_D") ||
											linkNodeName.equals("RDB3_D") || 
											linkNodeName.equals("RDB4_D") ||
											linkNodeName.equals("RDB5_D") || 
											linkNodeName.equals("RDB6_D") ||
											linkNodeName.equals("RDB7_D") ||
											linkNodeName.equals("RCB1_D") ||
											linkNodeName.equals("RCB2_D") ||
											linkNodeName.equals("RCB3_D") ||
											linkNodeName.equals("RCB4_D") ||
											linkNodeName.equals("RCB5_D") ||
											linkNodeName.equals("RCB6_D") ||
											linkNodeName.equals("RCB9_D") ||
											linkNodeName.equals("RAG1_D") ||
											linkNodeName.equals("RAG2_D") ||
											linkNodeName.equals("RAG3_D") ||
											linkNodeName.equals("RAG4_D") ||
											linkNodeName.equals("RAG5_D") ||
											linkNodeName.equals("RAG6_D") ||
											linkNodeName.equals("RAG7_D") ||
											linkNodeName.equals("RAG8_D") ||
											linkNodeName.equals("RAG9_D")) { 

										// Child Links
										List<Map<String, Object>> childLinksList = (List<Map<String, Object>>) linkMap.get("childLinks");
										linksList.addAll(childLinksList);
										linkMap.remove("childLinks");
									}
								}
							}
						}
						documentMap.put("links", linksList.toArray(new HashMap[0]));
					}
				}
				if(status.contains("Receivables"))
				{
					List<Map<String, Object>> localrootActions = new ArrayList<Map<String, Object>>(); 
					Map<String, Object> actionMap = new HashMap<String, Object>();
					String tempstatus = String.valueOf(rootMap.get("status"));
					actionMap.put("name", tempstatus);
					actionMap.put("key", "");
					localrootActions.add(actionMap);	
					localrootActions.addAll(rootActions);
					rootMap.put("actions", localrootActions);
				}
			}	
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		return responsePayLoad;
	}

	private Map<String, Object> createDocumentNodes() {
		Map<String, Object> documentMap = new HashMap<String, Object>();
		documentMap.put("id", "Documents");
		documentMap.put("title", "Documents");
		documentMap.put("status", "");

		List<String> mediaViewTabs = new ArrayList<String>(Arrays.asList("Policy Documents", "Attachments"));
		List<Map<String, Object>> childLinksList = new ArrayList<Map<String, Object>>();

		// childLinksList
		for (String child : mediaViewTabs) {
			Map<String, Object> mediaLink = createMediaLink(child);
			childLinksList.add(mediaLink);
		}
		documentMap.put("childLinks", childLinksList);
		documentMap.put("actions", null);
		return documentMap;
	}

	private Map<String, Object> createMediaLink(String tab) {
		Map<String, Object> documentMap = new HashMap<String, Object>();
		documentMap.put("id", tab);
		documentMap.put("title", tab);
		documentMap.put("status", "");
		List<Map<String, Object>> childLinksList = new ArrayList<Map<String, Object>>();

		Map<String, Object> actions = new HashMap<String, Object>();

		actions.put("type", "popup");
		actions.put("action", "launchURL('" + SurroundProductConfig.MEDIA + "','" + tab + "')");

		documentMap.put("actions", actions);

		documentMap.put("childLinks", childLinksList);
		return documentMap;
	}

	private Map<String, Object> createLink(Node linkNode, List<String> nodeStatus) {

		Map<String, Object> linkMap = new HashMap<String, Object>();

		NamedNodeMap linkNodeMap = linkNode.getAttributes();
		String desc = linkNodeMap.getNamedItem("Desc").getNodeValue().substring(3);
		String status = "";

		String title = desc;

		int dash = desc.lastIndexOf('-');

		if (dash != -1) {
			String currentstatus = desc.substring(dash + 1);
			if (nodeStatus.contains(currentstatus.trim())) {
				title = desc.substring(0, dash - 1);
				status = currentstatus;
			}
		}

		linkMap.put("title", title);
		linkMap.put("status", status.trim());
		linkMap.put("id", title.replaceAll(" ", "_").replace(".", "").replace("/", "").replace("&", ""));

		List<Map<String, Object>> linkActions = null;
		List<Map<String, Object>> childLinksList = new ArrayList<Map<String, Object>>();
		
		String prevNode = "";
		for (Node childNode = linkNode.getFirstChild(); childNode != null; childNode = childNode.getNextSibling()) {

			if (childNode.getNodeType() == Node.ELEMENT_NODE) {

				String hoverNodeName = childNode.getNodeName();

				if (hoverNodeName.equals("Hovers")) {
					linkActions = createActions(childNode);
				} else {
					Map<String, Object> childLinkMap = createLink(childNode, nodeStatus);
					String currentNode = (String)childLinkMap.get("id");
					String currentStatus = (String)childLinkMap.get("status");
					if(!(prevNode.equals(currentNode) && "Verified".equals(currentStatus))){
						childLinksList.add(childLinkMap);
					}else{
						List<Map<String, Object>> currentChildLinks = (List<Map<String, Object>>)childLinkMap.get("childLinks");
						Map<String, Object> prevChildLinkMap = childLinksList.get(childLinksList.size()-1);
						List<Map<String, Object>> prevChildLinks = (List<Map<String, Object>>)prevChildLinkMap.get("childLinks");
						if(prevChildLinks == null || prevChildLinks.size() == 0){
							prevChildLinkMap.put("childLinks", currentChildLinks);
						}
					}
					prevNode = currentNode;
				}

			}
		}

		linkMap.put("actions", linkActions);
		linkMap.put("childLinks", childLinksList);

		return linkMap;
	}

	private List<Map<String, Object>> createActions(Node node) {

		List<Map<String, Object>> actions = new ArrayList<Map<String, Object>>();

		if (node.hasChildNodes()) {

			for (Node childNode = node.getFirstChild(); childNode != null; childNode = childNode.getNextSibling()) {

				if (childNode.getNodeType() == Node.ELEMENT_NODE) {

					Map<String, Object> actionMap = new HashMap<String, Object>();
					Map<String, Object> actionPayLoadMap = new HashMap<String, Object>();

					createActionMap(childNode, actionMap, actionPayLoadMap);

					actions.add(actionMap);

				}
			}
		}

		return actions;
	}

	private List<Map<String, Object>> createRootActions(Node child) {

		List<Map<String, Object>> actionList = new ArrayList<Map<String, Object>>();

		if (child.hasChildNodes()) {

			for (Node childNode = child.getFirstChild(); childNode != null; childNode = childNode.getNextSibling()) {
				if (childNode.getNodeType() == Node.ELEMENT_NODE) {

					String childNodeName = childNode.getNodeName();
					if (childNodeName.equals("Hover")) {

						Map<String, Object> actionMap = new HashMap<String, Object>();
						NamedNodeMap nodemap = childNode.getAttributes();
						String key = "";

						String descValue = nodemap.getNamedItem("Desc").getNodeValue();
						String urlValue = nodemap.getNamedItem("URL").getNodeValue();
						int firstIndex = urlValue.indexOf("\"");
						int lastIndex = urlValue.lastIndexOf("\"");
						if ((firstIndex != -1) && (lastIndex != -1)) {
							key = urlValue.substring(firstIndex + 1, lastIndex);
						}

						actionMap.put("name", descValue);
						actionMap.put("key", key);

						actionList.add(actionMap);
					}

				}
			}
		}

		return actionList;
	}

	private void createDocumentActions(Node node, Map<String, Object> documentMap) {
		List<Map<String, Object>> actions = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> defaultactions = new ArrayList<Map<String, Object>>();

		List<String> defaultQuoteActivites = Arrays.asList(NavigationConfig.getProperty("DefaultQuoteOptions").split(","));
		List<String> defaultPolicyActivites = Arrays.asList(NavigationConfig.getProperty("DefaultPolicyOptions").split(","));
		List<String> defaultBinderActivites = Arrays.asList(NavigationConfig.getProperty("DefaultBinderOptions").split(","));
		List<String> defaultGenericActivites = Arrays.asList(NavigationConfig.getProperty("DefaultGenericOptions").split(","));

		List<String> defaultActions = new ArrayList<String>();
		defaultActions.addAll(defaultQuoteActivites);
		defaultActions.addAll(defaultPolicyActivites);
		defaultActions.addAll(defaultBinderActivites);
		defaultActions.addAll(defaultGenericActivites);

		if (node.hasChildNodes()) {

			for (Node childNode = node.getFirstChild(); childNode != null; childNode = childNode.getNextSibling()) {

				if (childNode.getNodeType() == Node.ELEMENT_NODE) {

					Map<String, Object> actionMap = new HashMap<String, Object>();
					Map<String, Object> actionPayLoadMap = new HashMap<String, Object>();

					NamedNodeMap nodemap = childNode.getAttributes();
					String desc = nodemap.getNamedItem("Desc").getNodeValue();

					createActionMap(childNode, actionMap, actionPayLoadMap);

					if (defaultActions.contains(desc)) {
						defaultactions.add(actionMap);
					} else {
						actions.add(actionMap);
					}

				}
			}
		}
		documentMap.put("defaultactions", defaultactions);
		documentMap.put("actions", actions);
	}

	private void createActionMap(Node childNode, Map<String, Object> actionMap, Map<String, Object> actionPayLoadMap) {
		NamedNodeMap nodemap = childNode.getAttributes();

		String descValue = nodemap.getNamedItem("Desc").getNodeValue();

		String urlValue = nodemap.getNamedItem("URL").getNodeValue();

		String[] urlContent = urlValue.split("&");

		String target = urlContent[0];
		String id = "";
		String functionName = "";
		String functionParam = "";
		String key = "";
		String requestCode = "";

		if (target.equals("servlet/POINTGridManager")) {
			id = urlContent[2].substring(urlContent[2].indexOf("=") + 1);
			requestCode = target = "";

		} else if (target.equals("jsp/BasSuperGridRedirector.jsp")) {
			id = urlContent[2].substring(urlContent[2].indexOf("=") + 1);

		} else if (target.contains("jsp/SendToReceivableRedirect.jsp")) {
			id = "POLICY_CANCELLATION_CONFIRMATION";
			requestCode = "CPPBCONTCNIRq";

		} else if (target.contains("jsp/WcpClassInformationDatePrompt.jsp")) {
			id = "WC_Class_Information";
			requestCode = urlContent[2].substring(urlContent[2].indexOf("=") + 1);

		} else if (target.contains("javascript")) {
			functionName = target.substring(target.indexOf(":") + 1, target.indexOf("("));
			functionParam = target.substring(target.indexOf("(") + 2, target.indexOf(")") - 2);
			id = "";

		} else if (target.contains("InfBrowserPrint")) {
			id = "InfBrowserPrint";
			
		} else if (target.contains(".jsp")) {
			id = target.substring(4, target.indexOf("."));
			if (urlContent.length > 2) {
				requestCode = urlContent[2].substring(urlContent[2].indexOf("=") + 1);
			}
		}
		
		if (target.contains("?")) {
			if(target.length()>target.indexOf("?")+1){
			UXUtils.parseQuery(target.substring(target.indexOf("?") + 1), actionPayLoadMap);
			}
		}

		if (urlContent.length > 1) {
			key = "\"" + urlContent[1].substring(urlContent[1].indexOf("=") + 2, urlContent[1].length() - 2) + "\"";
		}

		actionMap.put("name", descValue);
		actionMap.put("id", id);
		actionMap.put("functionName", functionName);
		actionMap.put("functionParam", functionParam);
		actionMap.put("payLoad", actionPayLoadMap);

		actionPayLoadMap.put("KEY", key);
		actionPayLoadMap.put("REQUESTCODE", requestCode);
		actionPayLoadMap.put("target", target);
	}

}
