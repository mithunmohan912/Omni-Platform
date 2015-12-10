package com.csc.ux.canvas.service.metamodel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;
import com.csc.ux.canvas.CanvasConfig;
import com.csc.ux.canvas.entity.Attribute;
import com.csc.ux.canvas.entity.UserLabelDetailRecord;
import com.csc.ux.canvas.entity.UserLabelRecords;
import com.csc.ux.canvas.service.attribute.AttributeService;
import com.csc.ux.canvas.service.attribute.UserLabelRecordsService;

@Service
public class MetaModelProperties {
	@Autowired
	private MetaModelService metaModelService;
	@Autowired
	private AttributeService attrService;
	@Autowired
	private UserLabelRecordsService userLabelRecordsService;
	@Autowired
	private CanvasConfig canvasConfig;

	private UserLabelRecords mappedUserLabelRecords = new UserLabelRecords();
	private Map<String, UserLabelDetailRecord> mappedUserLabelDetailRecords = new HashMap<String, UserLabelDetailRecord>();

	public String updateMetaModelProperties(String mmName, String mmJSON) throws Exception {
		String mmXML = ConversionUtil.convertJSONtoXML(mmJSON);
		Document mmDoc = ConversionUtil.convertStringToXMLDocument(mmXML);
		XPath xPath = XPathFactory.newInstance().newXPath();
		XPathExpression expr = xPath.compile("//metadata/properties/name");
		Object result = expr.evaluate(mmDoc, XPathConstants.NODESET);
		NodeList nodes = (NodeList) result;

		if (nodes.getLength() > 0) {
			throw new RuntimeException("Metamodel already contains custom properties.");
		} else {
			if (!fetchScreenAttributes(mmName)) {
				throw new RuntimeException("Screen Attributes not found for the given meta model hierarchy.");
			}
			addScreenProperties(mmDoc);
			addElementProperties(mmDoc, createTemplateElementList());
			return ConversionUtil.convertXMLtoJSON(ConversionUtil.convertXMLDocumentToString(mmDoc));
		}
	}

	private boolean fetchScreenAttributes(String mmName) {
		Map<String, String> allMetaTypes = MetaModelTypes.fetchAllScreenDetails();

		List<List<Object>> hierarchyKeys = metaModelService.fetchHierarchyUsingMetaModelName(mmName);
		boolean screenAttrFound = false;

		for (int i = 0; i < hierarchyKeys.size() && !screenAttrFound; i++) {
			List<Object> hierarchy = hierarchyKeys.get(i);
			String fileName = ((String) hierarchy.get(9)).trim();
			String setType = "";

			for (Object key : allMetaTypes.keySet()) {
				String value = allMetaTypes.get(key);
				if (value.contains(fileName)) {
					setType = (String) key;
					break;
				}
			}

			if ("".equals(setType)) {
				continue;
			}

			String location = ((String) hierarchy.get(0)).trim();
			String masterCo = ((String) hierarchy.get(1)).trim();
			String policyCo = ((String) hierarchy.get(2)).trim();
			String state = ((String) hierarchy.get(3)).trim();
			String lineBus = ((String) hierarchy.get(4)).trim();
			String insLine = ((String) hierarchy.get(5)).trim();
			String product = ((String) hierarchy.get(6)).trim();
			String coverage = ((String) hierarchy.get(7)).trim();
			String item = ((String) hierarchy.get(8)).trim();

			List<UserLabelRecords> userLabelRecordsList = new ArrayList<UserLabelRecords>();
			userLabelRecordsList = userLabelRecordsService.getAllViews(location, masterCo, policyCo, lineBus, insLine, state, product,
					coverage, item, setType);

			if (userLabelRecordsList != null && userLabelRecordsList.size() > 0) {
				for (UserLabelRecords userLabelRecs : userLabelRecordsList) {
					if (!screenAttrFound) {
						screenAttrFound = true;
						mappedUserLabelRecords = userLabelRecs;
					}
					Map<String, UserLabelDetailRecord> rowsTemp = new HashMap<String, UserLabelDetailRecord>();
					rowsTemp = UserLabelDetailRecord.mapRowsFromDatabase(userLabelRecs);
					mappedUserLabelDetailRecords.putAll(rowsTemp);
				}
			}
		}
		return screenAttrFound;
	}

	private void addScreenProperties(Document mmDoc) {
		Node metadata = mmDoc.getElementsByTagName("metadata").item(0);
		addScreenProperty(mmDoc, metadata, "DISPLAYSEQ", Integer.toString(mappedUserLabelRecords.getId().getCketnb()));
		addScreenProperty(mmDoc, metadata, "SCREENIND1", Character.toString(mappedUserLabelRecords.getId().getCkmqst()));
		addScreenProperty(mmDoc, metadata, "SCREENIND2", Character.toString(mappedUserLabelRecords.getId().getCkmrst()));
		addScreenProperty(mmDoc, metadata, "SCREENIND3", Character.toString(mappedUserLabelRecords.getId().getCkmsst()));
		addScreenProperty(mmDoc, metadata, "SCREENIND4", Character.toString(mappedUserLabelRecords.getId().getCkmtst()));
		addScreenProperty(mmDoc, metadata, "SCREENIND5", Character.toString(mappedUserLabelRecords.getId().getCkmust()));
	}

	private void addScreenProperty(Document mmDoc, Node node, String nameVal, String valueVal) {
		Element properties = mmDoc.createElement("properties");

		Element name = mmDoc.createElement("name");
		name.appendChild(mmDoc.createTextNode(nameVal));
		properties.appendChild(name);

		Element value = mmDoc.createElement("value");
		value.appendChild(mmDoc.createTextNode(valueVal));
		properties.appendChild(value);

		node.insertBefore(properties, mmDoc.getElementsByTagName("section").item(0));
	}

	private String createTemplateElementList() throws Exception {
		String metaModelRepositoryType = UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE);
		String metaModelRepositoryEndPointURI = UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI);
		List<String> rcvdFileNames = UXRepositoryUtil.getFileList(metaModelRepositoryType, metaModelRepositoryEndPointURI, "", false);
		String jSONName = "", elementList = "", templateContent = "";
		for (Object fileName : rcvdFileNames) {
			jSONName = ((String) fileName);
			if (jSONName.startsWith("Template_")) {
				templateContent = UXRepositoryUtil.receiveFile(metaModelRepositoryType, metaModelRepositoryEndPointURI, jSONName, "");
				if (templateContent != null) {
					elementList = elementList.concat(ConversionUtil.transformXMLusingXSLT(
							ConversionUtil.convertJSONtoXML(templateContent, "root"), "ExtractTemplateElements.xsl",
							canvasConfig.getTransformerURL()));
				}
			}
		}
		return elementList;
	}

	private void addElementProperties(Document mmDoc, String templateElements) {
		NodeList elementList = mmDoc.getElementsByTagName("element");
		for (int i = 0; i < elementList.getLength(); i++) {
			Node element = elementList.item(i);
			String elementName = "";
			NodeList elementValues = element.getChildNodes();
			for (int j = 0; j < elementValues.getLength(); j++) {
				Node node = elementValues.item(j);
				if ("name".equals(node.getNodeName())) {
					elementName = node.getTextContent();
				}
			}
			if ("".equals(elementName) || templateElements.indexOf(elementName) > -1) {
				continue;
			}
			elementName = elementName.replaceAll("(\\w)(_)+(\\w)", "$1 $3");

			UserLabelDetailRecord details = mappedUserLabelDetailRecords.get(elementName);
			if (details != null) {
				addElementProperty(mmDoc, element, "USRENTRYFIELD", details.getUsrEntryField().trim());
				addElementProperty(mmDoc, element, "position", Integer.toString(details.getUsrPosition()));
				addElementProperty(mmDoc, element, "datatype", Character.toString(details.getUsrDataType()));
				addElementProperty(mmDoc, element, "reclength", Integer.toString(details.getUsrRecLength()));
				addElementProperty(mmDoc, element, "ERRORCD", Character.toString(details.getUsrErrorCode()));
				addElementProperty(mmDoc, element, "PRINTIND", Character.toString(details.getUsrIndA()));
				addElementProperty(mmDoc, element, "SC_CODE", Character.toString(details.getUsrIndB()));
				addElementProperty(mmDoc, element, "REQUIRED_PT", Character.toString(details.getUsrIndC()));
				addElementProperty(mmDoc, element, "INDD", Character.toString(details.getUsrIndD()));
			} else {
				Attribute attr = (Attribute) attrService.checkAttribute(elementName);
				if (attr != null) {
					addElementProperty(mmDoc, element, "USRENTRYFIELD", "");
					addElementProperty(mmDoc, element, "position", Integer.toString(attr.getId().getStartPosition()));
					addElementProperty(mmDoc, element, "datatype", Character.toString(attr.getId().getDataType()));
					addElementProperty(mmDoc, element, "reclength", Integer.toString(attr.getId().getLength()));
					addElementProperty(mmDoc, element, "ERRORCD", Character.toString(' '));
					addElementProperty(mmDoc, element, "PRINTIND", Character.toString(' '));
					addElementProperty(mmDoc, element, "SC_CODE", Character.toString(' '));
					addElementProperty(mmDoc, element, "REQUIRED_PT", Character.toString(' '));
					addElementProperty(mmDoc, element, "INDD", Character.toString(' '));
				}
			}
		}
	}

	private void addElementProperty(Document mmDoc, Node node, String nameVal, String valueVal) {
		Element properties = mmDoc.createElement("properties");

		Element name = mmDoc.createElement("name");
		name.appendChild(mmDoc.createTextNode(nameVal));
		properties.appendChild(name);

		Element value = mmDoc.createElement("value");
		value.appendChild(mmDoc.createTextNode(valueVal));
		properties.appendChild(value);

		node.appendChild(properties);
	}
}
