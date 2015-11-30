package com.csc.cscip.ux.common.services.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.csc.cscip.ux.common.util.CommonConstants;

public class WsdlUtility {

	private static final Logger logger = LoggerFactory.getLogger(WsdlUtility.class);

    private Map<String, URLConfig> urlConfigMap = new HashMap<String, URLConfig>();

    private static final String SERVICE_NAME = "wsdl:service";
    private static final String SERVICE_NAME_ATTRIBUTE = "name";
    private static final String SERVICE_TARGET = "wssoap12:address";
    private static final String SERVICE_TARGET_ATTRIBUTE = "location";
    private static final String SERVICE_BINDING = "wsdl:binding";
    private static final String SERVICE_OPERATION = "wsdl:operation";
    private static final String SERVICE_OPERATION_NAME_ATTRIBUTE = "name";
    private static final String SERVICE_OPERATION_ACTION = "wssoap12:operation";
    private static final String SERVICE_OPERATION_ACTION_ATTRIBUTE = "soapAction";
    
    public void init() throws Exception {
		try {

			InputStream istream = getClass().getResourceAsStream("/resources/services/config/properties/Wsdl.properties");
			logger.info("InputStream:::: " + istream);
			Properties wsdlProperty = new Properties();
			wsdlProperty.load(istream);

			Set<Object> wsdlSet = wsdlProperty.keySet();
			DocumentBuilderFactory documentFactory = DocumentBuilderFactory
					.newInstance();
			DocumentBuilder documentBuilder = documentFactory
					.newDocumentBuilder();

			String name = null;
			String urlService = null;
			Node node = null;
			int childIndexTarget = 1;

			for (Object object : wsdlSet) {
				URL wsdlUrl = new URL(wsdlProperty.get(object).toString());
				Document document = documentBuilder.parse(wsdlUrl.openStream());
				Element rootElement = document.getDocumentElement();
				node = getService(rootElement);
				name = getAttribute((Element) node, SERVICE_NAME_ATTRIBUTE);
				node = getService((Element) node.getChildNodes().item(
						childIndexTarget));
				urlService = getAttribute((Element) node,
						SERVICE_TARGET_ATTRIBUTE);
				urlService = urlService.substring(0,
						urlService.lastIndexOf("/"));
				loadServiceURL((Element) rootElement, name, urlService);
			}

		} catch (SAXException e) {
			logger.error("", e);
			throw new SAXException(e.getMessage());
		} catch (ParserConfigurationException e) {
			logger.error("", e);
			throw new ParserConfigurationException(e.getMessage());
		} catch (FileNotFoundException e) {
			logger.error("", e);
			throw new FileNotFoundException("One of the Web Services is not available, please contact the helpdesk.");
		} catch (IOException e) {
			logger.error("", e);
			throw new IOException(e.getMessage());
		}
    }

    public void loadServiceURL(Element visitNode, String name, String urlService) {

	Node bindingNode = getBindingNode(visitNode);

	NodeList nodeList = bindingNode.getChildNodes();
	String nameServiceOperation = null;

	for (int i = 0; i < nodeList.getLength(); i++) {
	    Node node = nodeList.item(i);

	    if (node.getNodeName().equalsIgnoreCase(SERVICE_OPERATION)) {

		nameServiceOperation = name.toUpperCase() + CommonConstants.SEPARATOR_SERVICE_OPERATION
			+ getAttribute((Element) node, SERVICE_OPERATION_NAME_ATTRIBUTE).toUpperCase();
		getChildNode((Element) node);
		NodeList nodeListOp = node.getChildNodes();
		for (int j = 0; j < nodeListOp.getLength(); j++) {
		    Node nodeOp = nodeListOp.item(j);
		    if (nodeOp.getNodeName().equalsIgnoreCase(SERVICE_OPERATION_ACTION)) {
			String actionURL = getAttribute((Element) nodeOp, SERVICE_OPERATION_ACTION_ATTRIBUTE);
			if (actionURL != null && !actionURL.trim().equals("")) {
			    URLConfig urlConfig = new URLConfig(urlService, urlService + CommonConstants.SUFFIX_TARGET,
				    actionURL);
			    logger.info("-------");
			    logger.info("Service opeartion Name::: " + nameServiceOperation);
			    logger.info(":::::URLConfig:::::");
			    logger.info("URL config Target URL:::" + urlConfig.getTargetURL());
			    logger.info("URLConfig opeartion Action::: " + urlConfig.getOperationAction());
			    logger.info("URLConfig opeartion Action::: " + urlConfig.getToURL());
			    logger.info(":::::URLConfig:::::");
			    logger.info("-------");
			    urlConfigMap.put(nameServiceOperation, urlConfig);
			    break;
			}
		    }
		}
	    }
	}
    }

    public Node getBindingNode(Element visitNode) {
	NodeList nodeList = visitNode.getChildNodes();
	Node resultNode = null;
	for (int i = 0; i < nodeList.getLength(); i++) {
	    Node node = nodeList.item(i);
	    if (node.getNodeName().equalsIgnoreCase(SERVICE_BINDING)) {
		resultNode = node;
		break;
	    }
	}

	return resultNode;
    }

    public NodeList getChildNode(Element visitNode) {

	if (visitNode.hasAttributes()) {
	    NamedNodeMap attributes = visitNode.getAttributes();
	    for (int j = 0; j < attributes.getLength(); j++) {
		Attr attribute = (Attr) (attributes.item(j));
	    }
	}

	NodeList nodeList = visitNode.getChildNodes();

	for (int i = 0; i < nodeList.getLength(); i++) {
	    Node node = nodeList.item(i);
	}

	return visitNode.getChildNodes();
    }

    public Node getService(Element visitNode) {
	NodeList nodeList = visitNode.getChildNodes();
	Node resultNode = null;
	for (int i = 0; i < nodeList.getLength(); i++) {
	    Node node = nodeList.item(i);
	    if (node.getNodeName().equalsIgnoreCase(SERVICE_NAME)) {
		resultNode = node;
		break;
	    }
	    if (node.getNodeName().equalsIgnoreCase(SERVICE_TARGET)) {
		resultNode = node;
		break;
	    }
	}

	return resultNode;
    }

    public String getAttribute(Element visitNode, String attributeName) {
	NamedNodeMap attributes = visitNode.getAttributes();
	String result = null;
	for (int j = 0; j < attributes.getLength(); j++) {
	    Attr attribute = (Attr) (attributes.item(j));
	    if (attribute.getName().equalsIgnoreCase(attributeName)) {
		result = attribute.getValue();
		break;
	    }
	}
	return result;
    }

    // public static void main(String[] args) {
    // init();
    // }

    public Map<String, URLConfig> getUrlConfigMap() {
	return urlConfigMap;
    }

}
