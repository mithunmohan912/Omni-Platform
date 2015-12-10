package com.csc.ux.canvas.controller;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import com.csc.cscip.ux.common.rest.AbstractRestController;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXUtils;
import com.csc.ux.canvas.entity.Attribute;
import com.csc.ux.canvas.entity.AttributeDesc;
import com.csc.ux.canvas.entity.id.AttributeId;
import com.csc.ux.canvas.service.attribute.AttributeService;

@Controller
public class CanvasAttributeController extends AbstractRestController {
	@Autowired
	private AttributeService attrService;

	/**
	 * GetAttributesFullServiceXMLURI - This is the Data Dictionary Service that reads all the Attributes table and generates the Data
	 * Dictionary XML.
	 * 
	 * @return - Data Dictionary XML
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/xml", method = RequestMethod.GET)
	public @ResponseBody
	Object listAllAttributesAsXML() throws Exception {
		List<BigDecimal> listSetTypes = attrService.listSetTypes();
		DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
		Document doc = docBuilder.newDocument();
		Element rootElement = doc.createElement("ShortNameDefinition");
		doc.appendChild(rootElement);

		for (BigDecimal setType : listSetTypes) {
			List<Object> listAttributes = attrService.listAttrForSetType(setType.intValue());
			String setTypeDesc = StringEscapeUtils.escapeXml(((AttributeDesc) listAttributes.get(0)).getSetTypeDescription());
			Element shortNameDefs = doc.createElement("ShortNameDefs");
			shortNameDefs.setAttribute("setTypeDesc", setTypeDesc.replaceAll("(\\w)(\\s)+(\\w)", "$1_$3"));
			shortNameDefs.setAttribute("setTypeNumber", setType.toPlainString());
			rootElement.appendChild(shortNameDefs);

			for (Object attr : listAttributes) {
				Element shortNameDef = doc.createElement("ShortNameDef");
				shortNameDefs.appendChild(shortNameDef);

				Element shortName = doc.createElement("ShortName");
				shortName.appendChild(doc.createTextNode(StringEscapeUtils.escapeXml(((AttributeDesc) attr).getId().getAttributeName()
						.replaceAll("(\\w)(\\s)+(\\w)", "$1_$3"))));
				shortNameDef.appendChild(shortName);

				Element dataType = doc.createElement("dataType");
				dataType.appendChild(doc.createTextNode(Character.toString(((AttributeDesc) attr).getDataType())));
				shortNameDef.appendChild(dataType);

				Element offset = doc.createElement("offset");
				offset.appendChild(doc.createTextNode(Integer.toString(((AttributeDesc) attr).getStartPosition())));
				shortNameDef.appendChild(offset);

				Element length = doc.createElement("length");
				length.appendChild(doc.createTextNode(Integer.toString(((AttributeDesc) attr).getLength())));
				shortNameDef.appendChild(length);

				Element decimalPositions = doc.createElement("decimalPositions");
				decimalPositions.appendChild(doc.createTextNode(Integer.toString(((AttributeDesc) attr).getDecimalPositions())));
				shortNameDef.appendChild(decimalPositions);
			}
		}
		return ConversionUtil.convertXMLDocumentToString(doc);
	}

	/**
	 * GetAttributesFullServiceJSONURI - This is the Data Dictionary Service that reads all the Attributes table and generates the Data
	 * Dictionary JSON.
	 * 
	 * @return - Data Dictionary JSON
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/json", method = RequestMethod.GET)
	public @ResponseBody
	Object listAllAttributesAsJSON() throws Exception {
		return ConversionUtil.convertXMLtoJSON((String) listAllAttributesAsXML());
	}

	/**
	 * GetAttributesFullServiceURI - This is the Data Dictionary Service that reads all the Attributes table and generates the Data
	 * Dictionary using default JSON format.
	 * 
	 * @return - Data Dictionary as default JSON
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs", method = RequestMethod.GET)
	public @ResponseBody
	Object listAllAttributes() throws Exception {
		return listAllAttributesAsJSON();
	}

	/**
	 * GetAttributesScreenServiceXMLURI - This is the Data Dictionary Service that reads Attributes table for a particular screen type and
	 * generates the Data Dictionary XML.
	 * 
	 * @param screenTypeNumber - Input screen type for fetching attributes
	 * @return - Data Dictionary XML
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/{screenTypeNumber}/xml", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForScreenAsXML(@PathVariable("screenTypeNumber") BigDecimal setType) throws Exception {
		DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
		Document doc = docBuilder.newDocument();
		Element rootElement = doc.createElement("ShortNameDefinition");
		doc.appendChild(rootElement);

		List<Object> listAttributes = attrService.listAttrForSetType(setType.intValue());
		String setTypeDesc = StringEscapeUtils.escapeXml(((AttributeDesc) listAttributes.get(0)).getSetTypeDescription());
		Element shortNameDefs = doc.createElement("ShortNameDefs");
		shortNameDefs.setAttribute("setTypeDesc", setTypeDesc.replaceAll("(\\w)(\\s)+(\\w)", "$1_$3"));
		shortNameDefs.setAttribute("setTypeNumber", setType.toPlainString());
		rootElement.appendChild(shortNameDefs);

		for (Object attr : listAttributes) {
			Element shortNameDef = doc.createElement("ShortNameDef");
			shortNameDefs.appendChild(shortNameDef);

			Element shortName = doc.createElement("ShortName");
			shortName.appendChild(doc.createTextNode(StringEscapeUtils.escapeXml(((AttributeDesc) attr).getId().getAttributeName()
					.replaceAll("(\\w)(\\s)+(\\w)", "$1_$3"))));
			shortNameDef.appendChild(shortName);

			Element dataType = doc.createElement("dataType");
			dataType.appendChild(doc.createTextNode(Character.toString(((AttributeDesc) attr).getDataType())));
			shortNameDef.appendChild(dataType);

			Element offset = doc.createElement("offset");
			offset.appendChild(doc.createTextNode(Integer.toString(((AttributeDesc) attr).getStartPosition())));
			shortNameDef.appendChild(offset);

			Element length = doc.createElement("length");
			length.appendChild(doc.createTextNode(Integer.toString(((AttributeDesc) attr).getLength())));
			shortNameDef.appendChild(length);

			Element decimalPositions = doc.createElement("decimalPositions");
			decimalPositions.appendChild(doc.createTextNode(Integer.toString(((AttributeDesc) attr).getDecimalPositions())));
			shortNameDef.appendChild(decimalPositions);
		}
		return ConversionUtil.convertXMLDocumentToString(doc);
	}

	/**
	 * GetAttributesScreenServiceJSONURI - This is the Data Dictionary Service that reads Attributes table for a particular screen type and
	 * generates the Data Dictionary JSON.
	 * 
	 * @param screenTypeNumber - Input screen type for fetching attributes
	 * @return - Data Dictionary JSON
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/{screenTypeNumber}/json", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForScreenAsJSON(@PathVariable("screenTypeNumber") BigDecimal setType) throws Exception {
		return ConversionUtil.convertXMLtoJSON((String) listAttributeForScreenAsXML(setType));
	}
	
	/**
	 * GetAttributesScreenServiceScreenIDURI - This is the Data Dictionary Service that reads static data dictionary for a particular screen id and
	 * generates the Data Dictionary as a default JSON format.
	 * 
	 * @param screenId - Input screen type for fetching attributes
	 * @return - Data Dictionary as default JSON
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/{screenId}/screen", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForScreenId(@PathVariable("screenId") String screenId) throws Throwable {
		return UXUtils.loadStaticDataDictionary(screenId);
	}
	
	/**
	 * GetAttributesScreenServiceURI - This is the Data Dictionary Service that reads Attributes table for a particular screen type and
	 * generates the Data Dictionary as a default JSON format.
	 * 
	 * @param screenTypeNumber - Input screen type for fetching attributes
	 * @return - Data Dictionary as default JSON
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/{screenTypeNumber}", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForScreen(@PathVariable("screenTypeNumber") BigDecimal setType) throws Exception {
		return listAttributeForScreenAsJSON(setType);
	}

	/**
	 * GetStateAttributesServiceXMLURI - This is the Data Dictionary Service that reads Attributes table for a particular state
	 * (screenTypeNumber = 907) and generates the Data Dictionary XML.
	 * 
	 * @return - Data Dictionary XML for State
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/state/xml", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForStateAsXML() throws Exception {
		return listAttributeForScreenAsXML(new BigDecimal(907));
	}

	/**
	 * GetStateAttributesServiceJSONURI - This is the Data Dictionary Service that reads Attributes table for a particular state
	 * (screenTypeNumber = 907) and generates the Data Dictionary JSON.
	 * 
	 * @return - Data Dictionary JSON for State
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/state/json", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForStateAsJSON() throws Exception {
		return listAttributeForScreenAsJSON(new BigDecimal(907));
	}

	/**
	 * GetStateAttributesServiceURI - This is the Data Dictionary Service that reads Attributes table for a particular particular state
	 * (screenTypeNumber = 907) and generates the Data Dictionary as a default JSON format.
	 * 
	 * @return - Data Dictionary as default JSON for State
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/state", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForState() throws Exception {
		return listAttributeForScreen(new BigDecimal(907));
	}

	/**
	 * GetClassAttributesServiceXMLURI - This is the Data Dictionary Service that reads Attributes table for a particular class
	 * (screenTypeNumber = 906) and generates the Data Dictionary XML.
	 * 
	 * @return - Data Dictionary XML for Class
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/class/xml", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForClassAsXML() throws Exception {
		return listAttributeForScreenAsXML(new BigDecimal(906));
	}

	/**
	 * GetClassAttributesServiceJSONURI - This is the Data Dictionary Service that reads Attributes table for a particular class
	 * (screenTypeNumber = 906) and generates the Data Dictionary JSON.
	 * 
	 * @return - Data Dictionary JSON for Class
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/class/json", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForClassAsJSON() throws Exception {
		return listAttributeForScreenAsJSON(new BigDecimal(906));
	}

	/**
	 * GetClassAttributesServiceURI - This is the Data Dictionary Service that reads Attributes table for a particular particular class
	 * (screenTypeNumber = 906) and generates the Data Dictionary as a default JSON format.
	 * 
	 * @return - Data Dictionary as default JSON for State
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/class", method = RequestMethod.GET)
	public @ResponseBody
	Object listAttributeForClass() throws Exception {
		return listAttributeForScreen(new BigDecimal(906));
	}

	/**
	 * GetListScreensServiceJSONURI - This is the List Screens Service that reads all the Attributes table and generates the a list of all
	 * screens available.
	 * 
	 * @return - List of Screens in JSON format.
	 * @throws Exception
	 */
	@RequestMapping(value = "/screens/json", method = RequestMethod.GET)
	public @ResponseBody
	Object listAllSetTypesAsJSON() throws Exception {
		return ConversionUtil.convertXMLtoJSON((String) listAllSetTypesAsXML());
	}

	/**
	 * GetListScreensServiceURI - This is the List Screens Service that reads all the Attributes table and generates the a list of all
	 * screens available.
	 * 
	 * @return - List of Screens in default JSON format.
	 * @throws Exception
	 */
	@RequestMapping(value = "/screens", method = RequestMethod.GET)
	public @ResponseBody
	Object listAllSetTypes() throws Exception {
		return listAllSetTypesAsJSON();
	}

	/**
	 * GetListScreensServiceXMLURI - This is the List Screens Service that reads all the Attributes table and generates the a list of all
	 * screens available.
	 * 
	 * @return - List of Screens in XML format.
	 * @throws Exception
	 */
	@RequestMapping(value = "/screens/xml", method = RequestMethod.GET)
	public @ResponseBody
	Object listAllSetTypesAsXML() throws Exception {
		Map<BigDecimal, String> screenMap = new LinkedHashMap<BigDecimal, String>();
		DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
		Document doc = docBuilder.newDocument();
		Element rootElement = doc.createElement("ScreenTypes");
		doc.appendChild(rootElement);
		screenMap = attrService.listScreens();
		for (BigDecimal screenTypeNumber : screenMap.keySet()) {
			String screenDesc = screenMap.get(screenTypeNumber);
			Element screen = doc.createElement("Screen");
			screen.setAttribute("screenTypeNumber", screenTypeNumber.toPlainString());
			screen.setAttribute("screenDesc", screenDesc);
			rootElement.appendChild(screen);
		}
		return ConversionUtil.convertXMLDocumentToString(doc);
	}

	/**
	 * GetAttributeServiceURI - This is the Get Attribute Service based on the setTypeNumber and attributeName parameters.
	 * 
	 * @param setTypeNumber - Set Type Number
	 * @param attributeName - Attribute Name
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/{screenTypeNumber}/{attrName}", method = RequestMethod.GET)
	public @ResponseBody
	String getAttribute(@PathVariable("screenTypeNumber") int setTypeNumber, @PathVariable("attrName") String attributeName)
			throws Exception {
		AttributeId id = new AttributeId();
		id.setSetTypeNumber(setTypeNumber);
		id.setAttributeName(attributeName);
		Attribute attr = (Attribute) attrService.getAttribute(id);
		if (attr == null) {
			throw new RuntimeException("Attribute not found - ".concat(attributeName).concat(" for Screen Type ")
					.concat(Integer.toString(setTypeNumber)));
		}
		return ConversionUtil.convertObjectToJSON(attr);
	}

	/**
	 * AddAttributeServiceURI - This is the New Attribute Service that Adds the new Attribute object received in the @RequestBody
	 * 
	 * @param request - Input HttpServletRequest
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/attr", method = RequestMethod.POST)
	public @ResponseBody
	String addAttribute(HttpServletRequest request) throws Exception {
		String attributeJSON = IOUtils.readContent(request.getInputStream());
		Attribute attr = (Attribute) ConversionUtil.convertJSONtoObject(attributeJSON, Attribute.class);
		attrService.addAttribute(attr);
		return attributeJSON;
	}

	/**
	 * UpdateAttributeServiceURI - This is the Update Attribute Service that changes the Attribute object based on the Attribute object
	 * received in the @RequestBody along with the screenTypeNumber and attributeName.
	 * 
	 * @param request - Input HttpServletRequest
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/attr", method = RequestMethod.PUT)
	public @ResponseBody
	String changeAttribute(HttpServletRequest request) throws Exception {
		String attributeJSON = IOUtils.readContent(request.getInputStream());
		Attribute attr = (Attribute) ConversionUtil.convertJSONtoObject(attributeJSON, Attribute.class);
		attrService.changeAttribute(attr);
		return attributeJSON;
	}

	/**
	 * DeleteAttributeServiceURI - This is the Delete Attribute Service based on the screenTypeNumber and attributeName parameters.
	 * 
	 * @param request - Input HttpServletRequest
	 * @throws Exception
	 */
	@RequestMapping(value = "/attrs/attr", method = RequestMethod.DELETE)
	public @ResponseBody
	String removeAttribute(HttpServletRequest request) throws Exception {
		String attributeJSON = IOUtils.readContent(request.getInputStream());
		Attribute attr = (Attribute) ConversionUtil.convertJSONtoObject(attributeJSON, Attribute.class);
		attrService.removeAttribute(attr);
		return attributeJSON;
	}
}
