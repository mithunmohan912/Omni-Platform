/**
 * This program is the main program that takes xml of generated screens as input and converts them to UX Metamodel JSON.
 * section : set of labels/elements which is grouped using a horizontal line 
 * The logic is :
 * Create a list of labels in a section. Sort on the basis of their position (x,y).
 * Create a list of elements in a section. Sort on the basis of their position (x,y).
 * Traverse through the element list and find the closest label using the coordinates. 
 * General rule for finding the closest label is - if the y axis match find the closest x-axis
 *                                               - if the y axis does not match find the closest y-axis and then the x-axis.
 *                                               - x-axis and y-axis must always be less than or equal to element
 *Create a map having Label as the key and list of elements as values
 *Process list of elements on the basis of list size - if 1 process as normal element
 *													 - if greater than 1 and search at last process as search text
 *													 - if greater than 1 and no search, process as group text                                               
 */
/*
 * TODO
 * autoformat - true/false
 */

package com.csc.ux.canvas.converter;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;
import java.util.TreeSet;

import org.apache.commons.beanutils.PropertyUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.csc.cscip.ux.common.util.CommonConstants;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.UXJacksonUtils;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;
import com.csc.ux.canvas.CanvasConfig;
import com.csc.ux.canvas.converter.pojo.helper.IMapper;
import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;
import com.csc.ux.canvas.converter.pojo.meta.ControlGrpElement;
import com.csc.ux.canvas.converter.pojo.meta.DefaultMetaElement;
import com.csc.ux.canvas.converter.pojo.meta.IMetaElement;
import com.csc.ux.canvas.converter.pojo.meta.Metadata;
import com.csc.ux.canvas.converter.pojo.meta.Section;
import com.csc.ux.canvas.converter.pojo.meta.Subsection;
import com.csc.ux.canvas.converter.pojo.vpl.CheckboxElement;
import com.csc.ux.canvas.converter.pojo.vpl.LabelElement;
import com.csc.ux.canvas.converter.pojo.vpl.PictureElement;
import com.csc.ux.canvas.converter.pojo.vpl.VplElement;
import com.csc.ux.canvas.converter.util.ConverterConstants;
import com.csc.ux.canvas.converter.util.ElementFactory;
import com.csc.ux.canvas.converter.util.MapperImplFactory;
import com.csc.ux.canvas.converter.util.UXConverterUtil;
import com.csc.ux.canvas.converter.util.XMLDocument;
import com.csc.ux.canvas.service.metamodel.MetaModelProperties;

@Service
public class UXPTMetaConverter {
	private static final Logger logger = LoggerFactory.getLogger(UXPTMetaConverter.class);

	@Autowired
	UXConverterUtil converterUtil;
	@Autowired
	private MetaModelProperties createMetaModelProp;
	@Autowired
	private CanvasConfig canvasConfig;

	private final String fs = System.getProperty("file.separator");
	private Map<String, Map<String, List<Map<String, String>>>> behaviorRegistryList = new HashMap<String, Map<String, List<Map<String, String>>>>();

	public static void main(String[] args) {
		/**
		 * This is used just as the calling method for the main converter method and will provide file names as input
		 */
		String convertAll = "true";
		String folderName = "";
		List<Object> files = new ArrayList<Object>();
		UXPTMetaConverter conv = new UXPTMetaConverter();
		try {
			conv.createUXMetaInformation(convertAll, folderName, files);
		} catch (Exception ex) {
			ex.printStackTrace();
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	public void createUXMetaInformation(String convertAll, String folderName, List<Object> files) throws Throwable {
		/**
		 * convertAll - switch to decide if a mass conversion is required folderName - path of the folder containing meta xmls - This is not
		 * being used right now, as it is configurable property files - List of files that need conversion
		 */
		// read file list and pass it to the method that handles single meta xml file
		logger.info("***Conversion Process - Begin ***");
		if ("true".equals(convertAll)) {
			List<String> rcvdFileNames = UXRepositoryUtil.getFileList(canvasConfig.getConversionrepotype(), canvasConfig.getSrcrepopath(),
					"", false);
			for (Object fileName : rcvdFileNames) {
				processFile((String) fileName);
			}
		} else {
			for (Object file : converterUtil.isNotEmpty(files)) {
				processFile((String) file);
			}
		}
		// Final step of persisting behavior of all the pages in a json format.
		persistBehaviors();

		logger.info("***Conversion Process - Complete ***");
	}

	private void processFile(String fileName) throws Throwable {
		/**
		 * Read a file Convert it to Document object Process dom and create meta json Persist it to a file
		 */
		logger.info("***Processing " + fileName + " - Begin***");
		String xmlContent = UXRepositoryUtil.receiveFile(canvasConfig.getConversionrepotype(), canvasConfig.getSrcrepopath(), fileName, "");
		String fileTrimmedName = fileName.substring(0, fileName.lastIndexOf("."));
		Document xmlDoc = converterUtil.convertTextToDom(xmlContent);
		NodeList elements = xmlDoc.getElementsByTagName("elements").item(0).getChildNodes();

		List<LabelElement> labelList = new ArrayList<LabelElement>();
		List<VplElement> vplElemList = new ArrayList<VplElement>();
		List<SupportInfo> supportInfoList = new ArrayList<SupportInfo>();
		Map<String, List<Map<String, String>>> behaviorRegistry = new HashMap<String, List<Map<String, String>>>();

		StringBuilder title = new StringBuilder();
		for (int i = 0; i < elements.getLength(); i++) {
			Node chNode = elements.item(i);
			if ("#text".equals(chNode.getNodeName()) || "unknown_page_element".equals(chNode.getNodeName())) {
				continue;
			}
			populateList(chNode, labelList, vplElemList, supportInfoList, behaviorRegistry, title);
		}
		Collections.sort(labelList);
		Collections.sort(vplElemList);

		List<Map<LabelElement, List<VplElement>>> metaElemList = bindLabelWithElements(labelList, vplElemList);

		Map<String, Metadata> metaJsonObj = generateMetaJSON(xmlDoc, fileTrimmedName, metaElemList, title);
		String metaJson = UXJacksonUtils.convertToPrettyJSON(metaJsonObj);

		// Code to push element and page level properties
		String updatedMetaModel = "";
		try {
			updatedMetaModel = ConversionUtil.prettifyJSON(createMetaModelProp.updateMetaModelProperties(fileTrimmedName, metaJson.replaceAll("\"\"", "\" \"")));
		} catch (RuntimeException rEx) {
			if (rEx.getMessage().contains("Screen Attributes not found")) {
				logger.info("***" + fileName + " - Screen Attributes not found***");
				updatedMetaModel = metaJson;
			}else{
				throw new RuntimeException(rEx);
			}
		}
		
		//writing this step as a workaround for xml to json parsing problem - where the text is converted to boolean by the parser
		updatedMetaModel = updatedMetaModel.replaceAll("\"support\": true", "\"support\": \"true\"");
		
		// Following step creates map of element-behavior for a page
		behaviorRegistryList.put(fileTrimmedName, behaviorRegistry);

		// Following step creates metamodel json
		UXRepositoryUtil.sendFile(canvasConfig.getConversionrepotype(), canvasConfig.getDestrepopath(), fileTrimmedName.concat(".json"),
		updatedMetaModel, CommonConstants.JSON_CONTENT_TYPE, "metamodel", "Converted Base Version");

		// Following step creates support information for metamodel page.
		createSupportInfo(metaJsonObj, supportInfoList);

		// Following Step takes care of creating element-level rules on a page - Still in progress
		Object viewState = createElementDependencies(xmlDoc, fileTrimmedName);
		if(viewState != null){
			persistViewState(fileTrimmedName, viewState);
		}

		logger.info("***Processing " + fileName + " - Complete***");
	}

	private Map<String, Metadata> generateMetaJSON(Document xmlDoc, String fileName,
			List<Map<LabelElement, List<VplElement>>> metaElemList, StringBuilder title) throws Throwable {

		Map<String, Metadata> json = new HashMap<String, Metadata>();
		Metadata data = new Metadata();

		json.put("metadata", data);

		String modelName = XMLDocument.docGetDOMValueByXPath(xmlDoc, "/vpms_application/application/description/model_file");

		modelName = modelName.substring(0, modelName.lastIndexOf(".")).replaceAll(" ", "_");

		String[] suppArr = converterUtil.getGroupAndFormId(modelName.toUpperCase());

		data.setGroupid(suppArr[0].trim());
		if (suppArr[1] != null && !suppArr[1].equals("")) {
			data.setFormid(suppArr[1].trim());
		} else {
			data.setFormid(fileName);
		}

		data.setTitle(title.toString());

		Section section = new Section();
		Subsection subsection = null;
		Subsection hiddenSubsection = new Subsection("hiddenfields");
		data.getSection().add(section);
		for (Map<LabelElement, List<VplElement>> vplsubsection : metaElemList) {
			Iterator<LabelElement> itr = vplsubsection.keySet().iterator();
			subsection = new Subsection("");
			while (itr.hasNext()) {
				IMetaElement metaElement = null;
				LabelElement label = itr.next();
				List<VplElement> vplElements = vplsubsection.get(label);
				if (vplElements != null && vplElements.size() > 1) {
					// Create meta-information for group of hidden fields
					if ("HiddenFldsOnPage".equals(label.getValue())) {
						for (VplElement vplElement : vplElements) {
							hiddenSubsection.add(handleSingleElement(vplElement));
						}
					} else {
						metaElement = handleMultiElements(vplElements);
					}
				} else if (vplElements != null && vplElements.size() == 1) {
					metaElement = handleSingleElement(vplElements.get(0));
					PropertyUtils.setProperty(metaElement, "size",10);
				}
				if (metaElement != null) {
					// This check is preserve label if some other property of vpl element has set the label
					if (PropertyUtils.getProperty(metaElement, "label") == null) {
						PropertyUtils.setProperty(metaElement, "label", PropertyUtils.getProperty(label, "value"));
					}
					if("hidden".equals(PropertyUtils.getProperty(metaElement, "type"))){
						hiddenSubsection.add(metaElement);
					}else{
						subsection.add(metaElement);
					}
				}
			}
			section.setDefaultSectionSize();
			section.add(subsection);
		}
		section.add(createDefInputHiddenFlds(xmlDoc, hiddenSubsection));
		return json;
	}

	private IMetaElement handleMultiElements(List<VplElement> vplElements) throws IllegalAccessException, InvocationTargetException,
	NoSuchMethodException, IOException {
		ControlGrpElement ctrlGrpElem = new ControlGrpElement();
		ctrlGrpElem.setDefaults();
		List<Double> elemWidths = new ArrayList<Double>();
		List<Double> elemSizes = new ArrayList<Double>();
		for (VplElement vplElement : vplElements) {
			ctrlGrpElem.getControlgroup().add(handleSingleElement(vplElement));
			elemWidths.add(vplElement.getWidth());
		}
		elemSizes = UXConverterUtil.determineElementSizes(elemWidths);
		for (int i = 0; i < ctrlGrpElem.getControlgroup().size(); i++) {
			IMetaElement ctrl = ctrlGrpElem.getControlgroup().get(i);
			String type = (String) PropertyUtils.getProperty(ctrl, "type");
			String label = (String) PropertyUtils.getProperty(ctrl, "label");
			String required = (String) PropertyUtils.getProperty(ctrl, "required");
			if ("required".equals(required)) {
				PropertyUtils.setProperty(ctrlGrpElem, "required", "required");
			}
			if (i == 0) {
				String name = (String) PropertyUtils.getProperty(ctrl, "name");
				name = "GROUP_".concat(name.toUpperCase().replaceAll(" ", "_"));
				PropertyUtils.setProperty(ctrlGrpElem, "name", name);
			}
			PropertyUtils.setProperty(ctrl, "size", elemSizes.get(i).intValue());
			if ("button".equals(type) && label != null && label.toLowerCase().indexOf("search") != -1) {
				IMetaElement prevCtrl = ctrlGrpElem.getControlgroup().get(i - 1);
				PropertyUtils.setProperty(prevCtrl, "type", "searchtext");
				PropertyUtils.setProperty(prevCtrl, "title", PropertyUtils.getProperty(ctrl, "label"));
				PropertyUtils.setProperty(prevCtrl, "buttonid", PropertyUtils.getProperty(ctrl, "buttonid"));
				PropertyUtils.setProperty(prevCtrl, "size", 12);
				elemSizes.remove(i);
				ctrlGrpElem.getControlgroup().remove(i);
				i--;
			}
		}
		return ctrlGrpElem;
	}

	private IMetaElement handleSingleElement(VplElement vplElement) throws IOException, IllegalAccessException, InvocationTargetException,
	NoSuchMethodException {
		IMetaElement defElem = new DefaultMetaElement();
		if (!"hidden".equals(vplElement.getType())) {
			defElem.setDefaults();
			String vplElemClass = vplElement.getClass().getSimpleName();
			vplElemClass = vplElemClass.substring(0, vplElemClass.indexOf("Element"));
			IMapper propertyMapper = MapperImplFactory.getMapper("Default");
			propertyMapper.mapSrcDestProperties(vplElemClass, vplElement, defElem);
		} else {
			defElem.setName(vplElement.getId());
			defElem.setType(vplElement.getType());
		}
		return defElem;
	}

	private void populateList(Node chNode, List<LabelElement> labelList, List<VplElement> vplElemList, List<SupportInfo> supportInfoList,
			Map<String, List<Map<String, String>>> behaviorRegistry, StringBuilder title) throws Exception {
		String elemName = chNode.getNodeName();
		if ("label".equals(elemName)) {
			if (XMLDocument.docGetDOMValueByXPath(chNode, "id") != null
					&& XMLDocument.docGetDOMValueByXPath(chNode, "id").indexOf("CompanyBanner") != -1) {
				title.append(XMLDocument.docGetDOMValueByXPath(chNode, "caption"));
				return;
			} else if (XMLDocument.docGetDOMValueByXPath(chNode, "id") != null
					&& XMLDocument.docGetDOMValueByXPath(chNode, "id").indexOf("AnyAsterisk") != -1) {
				// Check for statement "Any field preceded by an asterisk (*) is required."
				return;
			} else if (!"hidden".equals(XMLDocument.docGetDOMValueByXPath(chNode, "visibility"))) {
				populateLabel(chNode, labelList);
			}
		} else {
			populateElement(chNode, vplElemList, supportInfoList, behaviorRegistry);
		}
	}

	private void populateLabel(Node chNode, List<LabelElement> labelList) throws Exception {
		LabelElement label = new LabelElement();
		int left = Integer.parseInt(XMLDocument.docGetDOMValueByXPath(chNode, "position/left"));
		int top = Integer.parseInt(XMLDocument.docGetDOMValueByXPath(chNode, "position/top"));
		String value = XMLDocument.docGetDOMValueByXPath(chNode, "caption") == null ? "" : XMLDocument.docGetDOMValueByXPath(chNode,
				"caption");
		label.setLeft(left);
		label.setTop(top);
		label.setValue(value);
		if (value.indexOf("Any field preceeded by an asterisk") == -1) {
			labelList.add(label);
		}
	}

	private void populateElement(Node chNode, List<VplElement> vplElemList, List<SupportInfo> supportInfoList,
			Map<String, List<Map<String, String>>> behaviorRegistry) throws Exception {
		VplElement vplelement = ElementFactory.getInstance(chNode);
		if (vplelement != null) {
			vplelement.processNode(chNode, supportInfoList, behaviorRegistry);
			vplElemList.add(vplelement);
		}
	}

	private List<Map<LabelElement, List<VplElement>>> bindLabelWithElements(List<LabelElement> labelList, List<VplElement> vplElemList) {

		List<Map<LabelElement, List<VplElement>>> sections = new ArrayList<Map<LabelElement, List<VplElement>>>();
		Map<LabelElement, List<VplElement>> elementsInSection = new HashMap<LabelElement, List<VplElement>>();
		Map<LabelElement, List<VplElement>> tempMap = null;
		LabelElement hiddenElemLabel = new LabelElement("HiddenFldsOnPage");
		int beginTop = 0;
		for (VplElement vplelement : vplElemList) {
			// skip iteration if control is not applicable on page. eg. Submit and Reset buttons
			if (ConverterConstants.NA_ON_PAGE.equals(vplelement.getType())) {
				continue;
			}
			if (vplelement instanceof PictureElement && "line".equals(vplelement.getType())) {
				tempMap = new TreeMap<LabelElement, List<VplElement>>(elementsInSection);
				sections.add(tempMap);
				elementsInSection = new HashMap<LabelElement, List<VplElement>>();
				beginTop = vplelement.getTop();
				continue;
			}
			LabelElement label = null;
			// Get captions for Checkbox
			if (vplelement instanceof CheckboxElement && ((CheckboxElement) vplelement).getCaption() != null) {
				label = new LabelElement();
				label.setValue(((CheckboxElement) vplelement).getCaption());
			} else if ("hidden".equals(vplelement.getType())) {
				if (elementsInSection.get(hiddenElemLabel) != null) {
					elementsInSection.get(hiddenElemLabel).add(vplelement);
				} else {
					List<VplElement> elemList = new ArrayList<VplElement>();
					elemList.add(vplelement);
					elementsInSection.put(hiddenElemLabel, elemList);
				}
			} else {
				label = findLabel(vplelement, labelList);
				if (label.getTop() < beginTop) {
					label = null;
				}
			}

			if (label != null) {
				if (elementsInSection.get(label) != null) {
					elementsInSection.get(label).add(vplelement);
				} else {
					List<VplElement> elemList = new ArrayList<VplElement>();
					elemList.add(vplelement);
					elementsInSection.put(label, elemList);
				}
			}
		}
		tempMap = new TreeMap<LabelElement, List<VplElement>>(elementsInSection);
		sections.add(tempMap);
		return sections;
	}

	private LabelElement findLabel(VplElement vplelement, List<LabelElement> labelList) {
		LabelElement result = null;
		int elemTop = vplelement.getTop();
		int elemLeft = vplelement.getLeft();
		for (LabelElement label : labelList) {
			int labelTop = label.getTop();
			int labelLeft = label.getLeft();
			if (labelTop <= elemTop || Math.abs(elemTop - labelTop) <= 5) {
				if (labelLeft <= elemLeft || Math.abs(labelLeft - elemLeft) <= 10) {
					result = label;
				}
				continue;
			}
			break;
		}
		return result;
	}

	private void createSupportInfo(Map<String, Metadata> metaJsonObj, List<SupportInfo> supportInfoList) throws Exception {
		Metadata data = metaJsonObj.get("metadata");

		String groupId = data.getGroupid();
		String formId = data.getFormid();

		// 1. Check if property file exists
		// 2. If exists, update
		// 3. If not, create
		@SuppressWarnings("serial")
		Properties supportProperties = new Properties() {
			@Override
			public synchronized Enumeration<Object> keys() {
				return Collections.enumeration(new TreeSet<Object>(super.keySet()));
			}
		};

		String content = UXRepositoryUtil.receiveFile(canvasConfig.getConversionrepotype(), canvasConfig.getDestrepopath(),
				formId.concat(".properties"), "support" + fs + groupId);
		if (content != null) {
			supportProperties.load(new StringReader(content));
			updatePropertyFile(supportProperties, supportInfoList);
		} else {
			createSupportProperties(supportProperties, supportInfoList);
		}
		if (!supportProperties.isEmpty()) {
			StringWriter sw = new StringWriter();
			supportProperties.store(sw, null);
			UXRepositoryUtil.sendFile(canvasConfig.getConversionrepotype(), canvasConfig.getDestrepopath(), formId.concat(".properties"),
					sw.toString(), CommonConstants.TEXT_CONTENT_TYPE, "support" + fs + groupId, "Converted Base Version");
		}
	}

	private void createSupportProperties(Properties supportProperties, List<SupportInfo> supportInfoList) {
		for (SupportInfo suppInfo : supportInfoList) {
			String elemName = suppInfo.getElement();
			String type = suppInfo.getType();
			setProperty(supportProperties, elemName, type, suppInfo);
		}
	}

	private void updatePropertyFile(Properties supportProperties, List<SupportInfo> supportInfoList) {
		for (SupportInfo suppInfo : supportInfoList) {
			String elemName = suppInfo.getElement();
			String type = suppInfo.getType();
			if (supportProperties.containsKey(elemName.concat(".type"))) {
				updateProperty(supportProperties, elemName, type, suppInfo);
			} else {
				setProperty(supportProperties, elemName, type, suppInfo);
			}
		}
	}

	private void updateProperty(Properties supportProperties, String elemName, String type, SupportInfo suppInfo) {
		String prevType = supportProperties.getProperty(elemName.concat(".type"));
		if (!type.equals(prevType)) {
			supportProperties.remove(elemName.concat(".type"));
			supportProperties.remove(elemName.concat(".supportinfo"));
			supportProperties.remove(elemName.concat(".lookup"));
			setProperty(supportProperties, elemName, type, suppInfo);
		} else {
			if ("SP".equals(prevType)) {
				supportProperties.remove(elemName.concat(".lookup"));
			}
			setProperty(supportProperties, elemName, type, suppInfo);
		}
	}

	private void setProperty(Properties supportProperties, String elemName, String type, SupportInfo suppInfo) {
		if ("SP".equals(type)) {
			supportProperties.put(elemName.concat(".type"), "SP");
			if (suppInfo.getLookup() != null) {
				supportProperties.put(elemName.concat(".lookup"), suppInfo.getLookup().replaceAll("(\\w)(_)+(\\w)", "$1 $3"));
			}
		} else if ("SQL".equals(type)) {
			supportProperties.put(elemName.concat(".type"), "SQL");
			supportProperties.put(elemName.concat(".supportinfo"), suppInfo.getQueryString());
		}
	}

	private Subsection createDefInputHiddenFlds(Document xmlDoc, Subsection subsection) throws Exception {
		if (subsection == null) {
			subsection = new Subsection("hiddenfields");
		}
		List<IMetaElement> defHiddenFldsLst;
		String appTitle = XMLDocument.docGetDOMValueByXPath(xmlDoc, "/vpms_application/application/description/caption");
		if ("AA".equals(appTitle)) {
			defHiddenFldsLst = createAAHiddenFields(xmlDoc);
		} else {
			defHiddenFldsLst = createHiddenFields(xmlDoc);
		}
		// subsection.setElement(defHiddenFldsLst);
		for(IMetaElement hiddenElement : defHiddenFldsLst){
			subsection.add(hiddenElement);
		}
		return subsection;
	}

	private List<IMetaElement> createHiddenFields(Document xmlDoc) throws Exception {
		List<IMetaElement> defHiddenElem = new ArrayList<IMetaElement>();
		String modelFile = XMLDocument.docGetDOMValueByXPath(xmlDoc, "/vpms_application/application/description/model_file");
		if (!"point basic policy model.vpm".equals(modelFile)) {
			NodeList attribList = XMLDocument.docGetNodeByXPath(xmlDoc, "/vpms_application/attributes").getChildNodes();
			for (int i = 0; i < attribList.getLength(); i++) {
				Node attrib = attribList.item(i);
				if ("#text".equals(attrib.getNodeName()) || "unknown_page_element".equals(attrib.getNodeName())) {
					continue;
				}
				String name = XMLDocument.docGetDOMValueByXPath(attrib, "name");
				if (name != null && (name.contains("_KEY_") || name.contains("BC_") || name.contains("KEY_"))) {
					IMetaElement elem = new DefaultMetaElement();
					elem.setName(name);
					elem.setType("hidden");
					defHiddenElem.add(elem);
				}
			}
		}
		addGenericHiddenFlds(defHiddenElem);
		return defHiddenElem;
	}

	private List<IMetaElement> createAAHiddenFields(Document xmlDoc) throws Exception {
		List<IMetaElement> defHiddenElem = new ArrayList<IMetaElement>();
		NodeList attribList = XMLDocument.docGetNodeByXPath(xmlDoc, "/vpms_application/attributes").getChildNodes();
		for (int i = 0; i < attribList.getLength(); i++) {
			Node attrib = attribList.item(i);
			if ("#text".equals(attrib.getNodeName()) || "unknown_page_element".equals(attrib.getNodeName())) {
				continue;
			}
			String referenceCount = XMLDocument.docGetDOMValueByXPath(attrib, "reference_count");
			if ("0".equals(referenceCount)) {
				IMetaElement elem = new DefaultMetaElement();
				elem.setName(XMLDocument.docGetDOMValueByXPath(attrib, "name"));
				elem.setType("hidden");
				defHiddenElem.add(elem);
			}
		}
		addGenericHiddenFlds(defHiddenElem);
		return defHiddenElem;
	}

	private void addGenericHiddenFlds(List<IMetaElement> defHiddenElem) {
		String[] genericHiddenFlds = { "REQUESTCODE", "TMPREQUESTCODE", "target", "tmptarget", "fullkey", "Refresh", "DisplayTable" };
		for (int i = 0; i < genericHiddenFlds.length; i++) {
			IMetaElement elem = new DefaultMetaElement();
			elem.setName(genericHiddenFlds[i]);
			elem.setType("hidden");
			defHiddenElem.add(elem);
		}
	}

	private void persistBehaviors() throws Throwable {
		String behvrJson = UXJacksonUtils.convertToPrettyJSON(behaviorRegistryList);
		UXRepositoryUtil.sendFile(canvasConfig.getConversionrepotype(), canvasConfig.getDestrepopath(), "BehaviorRegistryList.json",
				ConversionUtil.prettifyJSON(behvrJson), CommonConstants.JSON_CONTENT_TYPE, "behavior", "Converted Base Version");
	}

	private Object createElementDependencies(Document xmlDoc, String fileTrimmedName) throws Throwable {
		NodeList elements = xmlDoc.getElementsByTagName("check_visibles").item(0).getChildNodes();

		Map<String, List<Map<String, String>>> governDependency = new LinkedHashMap<String, List<Map<String, String>>>();

		for (int i = 0; i < elements.getLength(); i++) {
			Node chNode = elements.item(i);
			
			if ("#text".equals(chNode.getNodeName()) || "unknown_page_element".equals(chNode.getNodeName())) {
				continue;
			}
			
			
			List<Map<String, String>> geovernedDepedencies = new ArrayList<Map<String,String>>();
			
			String governingElement = XMLDocument.docGetDOMValueByXPath(chNode, "name");
			NodeList governdelements = XMLDocument.docGetNodeByXPath(chNode, "IDS").getChildNodes();
			
			String action = "";
			String value = "";

			if(governingElement.indexOf("#") != -1){
				action = governingElement.substring(governingElement.indexOf("#")+1, governingElement.length());
				governingElement = governingElement.substring(0,governingElement.indexOf("#"));
			}
			if(governingElement.indexOf("@") != -1){
				value = governingElement.substring(governingElement.indexOf("@")+1, governingElement.length());
				governingElement = governingElement.substring(0,governingElement.indexOf("@"));
			}
			
			for (int j = 0; j < governdelements.getLength(); j++) {
				Node gvrndChNode = governdelements.item(j);
				
				if ("#text".equals(gvrndChNode.getNodeName()) || "unknown_page_element".equals(gvrndChNode.getNodeName())) {
					continue;
				}
				
				String page = XMLDocument.docGetDOMValueByXPath(gvrndChNode, "ID_PAGE");
				String type = XMLDocument.docGetDOMValueByXPath(gvrndChNode, "ID_TYPE");
				
				if (fileTrimmedName.equals(page) || "page".equals(type)) {
					String governedElement = findGovernedElement(xmlDoc, XMLDocument.docGetDOMValueByXPath(gvrndChNode, "ID_NAME"));
					if("LabelElement".equals(governedElement)){
						continue;
					}
					Map<String, String> dependencies = new HashMap<String, String>();
					
					dependencies.put("element", governedElement);
					dependencies.put("type", action);
					dependencies.put("value", value);
					
					geovernedDepedencies.add(dependencies);
				}
			}
			if(governDependency.get(governingElement) == null){
				governDependency.put(governingElement, geovernedDepedencies);
			}else{
				List<Map<String, String>> dependencies = governDependency.get(governingElement);
				dependencies.addAll(geovernedDepedencies);
				governDependency.put(governingElement, dependencies);
			}
			//rules.add(governDependency);
		}

		Map <String, Map<String, List<Map<String, String>>>> viewstate = new HashMap<String, Map<String,List<Map<String,String>>>>();
		/*if(rules.size() > 0){
			viewstate = new HashMap<String, List<Map<String,List<Map<String,String>>>>>();
			viewstate.put("viewstate", rules);
		}*/
		viewstate.put("viewstate", governDependency);
		return viewstate;
	}

	private String findGovernedElement(Document xmlDoc, String id) throws Exception {
		// TODO Auto-generated method stub
		NodeList elements = xmlDoc.getElementsByTagName("elements").item(0).getChildNodes();
		
		for (int i = 0; i < elements.getLength(); i++) {
			Node chNode = elements.item(i);
			if ("#text".equals(chNode.getNodeName()) || "unknown_page_element".equals(chNode.getNodeName())) {
				continue;
			}
			String nodeId = XMLDocument.docGetDOMValueByXPath(chNode, "id");
			if(nodeId.equals(id)){
				String nodeName = chNode.getNodeName();
				if(nodeName.equals(ConverterConstants.LABEL_ELEMENT)){
					return "LabelElement";
				}else if(nodeName.equals(ConverterConstants.BUTTON_ELEMENT)){
					return nodeId;
				}
				String elementName = XMLDocument.docGetDOMValueByXPath(chNode, "model_element");
				return elementName;
			}
		}
		return id;
	}

	private void persistViewState(String fileName, Object viewstate) throws Throwable {
		String viewJson = UXJacksonUtils.convertToPrettyJSON(viewstate);
		UXRepositoryUtil.sendFile(canvasConfig.getConversionrepotype(), canvasConfig.getDestrepopath(), fileName+".json",
				viewJson, CommonConstants.JSON_CONTENT_TYPE, "rules/viewstate", "Converted Base Version");
	}

}

