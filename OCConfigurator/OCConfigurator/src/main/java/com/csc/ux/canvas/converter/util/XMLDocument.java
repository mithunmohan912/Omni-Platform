package com.csc.ux.canvas.converter.util;


import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.xpath.XPathAPI;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;


public class XMLDocument {

	public static final String docGetDOMValueByXPath(Node dom, String xpathStmt) throws Exception {
		Node node = XPathAPI.selectSingleNode(dom, xpathStmt);
		StringBuffer buff = null;

		if (node != null) {
			node = nodeFirstChildText(node);
		}
		while ((node != null) && (node.getNodeType() == 3))
		{
			if (buff == null) {
				buff = new StringBuffer();
			}
			buff.append(node.getNodeValue());
			node = node.getNextSibling();
		}

		if (buff != null) {
			return buff.toString();
		}
		return null;

	}

	public static final Node nodeFirstChildText(Node node){
		Node n = null;

		if (node != null)
		{
			n = node.getFirstChild();
			while ((n != null) && (n.getNodeType() != 3)) {
				n = n.getNextSibling();
			}
		}
		return n;
	}

	public static final Document parseDoc(String xmlText) throws Exception {
		return parseDoc(xmlText, false);
	}

	public static final Document parseDoc(String xmlText, boolean namespaceAware) throws Exception {
		Document sourceTree = null;
		InputSource xmlSource = new InputSource(new StringReader(xmlText));
		DocumentBuilderFactory dfactory = DocumentBuilderFactory.newInstance();
		dfactory.setNamespaceAware(namespaceAware);
		DocumentBuilder docBuilder = dfactory.newDocumentBuilder();
		sourceTree = docBuilder.parse(xmlSource);
		return sourceTree;
	}

	public static final Node docGetNodeByXPath(Node dom, String xpathStmt) throws Exception {
		Node node = XPathAPI.selectSingleNode(dom, xpathStmt);
		return node;
	}

	public static final String nodeAttributeValue(Node node, String attribName)
	{
		String value = null;

		Node attribNode = node.getAttributes().getNamedItem(attribName);
		if (attribNode != null) {
			value = nodeElementValue(attribNode);
		}
		return value;
	}

	public static final String nodeElementValue(Node node)
	{
		StringBuffer buff = null;
		Node n = nodeFirstChildText(node);

		while ((n != null) && (n.getNodeType() == 3))
		{
			if (buff == null) {
				buff = new StringBuffer();
			}
			buff.append(n.getNodeValue());
			n = n.getNextSibling();
		}

		if (buff != null) {
			return buff.toString();
		}
		return null;
	}


}
