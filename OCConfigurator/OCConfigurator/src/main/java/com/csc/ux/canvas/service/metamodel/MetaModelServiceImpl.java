package com.csc.ux.canvas.service.metamodel;

import java.util.HashMap;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import com.csc.cscip.ux.common.integration.IntegrationService;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.StringUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;
import com.csc.ux.canvas.CanvasConfig;
import com.csc.ux.canvas.dao.MetaModelDAO;
import com.csc.ux.canvas.entity.id.MetaModelId;
import com.csc.ux.canvas.service.processor.ProcessorService;
import com.csc.ux.canvas.service.processor.ProcessorServiceFactory;

@Service
public class MetaModelServiceImpl implements MetaModelService {
	private static final Logger logger = LoggerFactory.getLogger(MetaModelServiceImpl.class);
	@Autowired
	private MetaModelDAO metaModelDAO;
	@Autowired
	private IntegrationService integrationService;
	@Autowired
	private ProcessorServiceFactory metaModelPSF;
	@Autowired
	private CanvasConfig canvasConfig;

	@Value("${ALRImplementerUserID}")
	private String userid;

	/**
	 * initMetaModel - Initializes all the key parameters.
	 */
	private void initMetaModel() {
		setType = "";
		fileName = "";
		levelDesc = "Default";
		location = "";
		masterCo = "";
		policyCo = "";
		lineOfBus = "";
		insLine = "";
		state = "";
		product = "";
		coverage = "";
		item = "";
	}

	/**
	 * setParams - This method sets the parameters from the HttpServletRequest.
	 * 
	 * @param request
	 */
	private void setParams(HttpServletRequest request) {
		setType = request.getParameter("setType");
		if (setType != null) {
			location = request.getParameter("location");
			masterCo = request.getParameter("masterCo");
			policyCo = request.getParameter("policyCo");
			lineOfBus = request.getParameter("lineOfBus");
			insLine = request.getParameter("insLine");
			state = request.getParameter("state");
			product = request.getParameter("product");
			coverage = request.getParameter("coverage");
			item = request.getParameter("item");
		} else {
			throw new RuntimeException("Set type not valid.");
		}
	}

	/**
	 * fetchMetaModelName - This method fetches the meta model name from BASSYS07L1 table.
	 */
	@Override
	@Transactional
	public String fetchMetaModelName(HttpServletRequest request) {
		String mmName = null;
		String screenDetails = null;
		String[] screenDetailsArr = null;
		initMetaModel();
		setParams(request);
		screenDetails = MetaModelTypes.fetchScreenDetails(setType);
		if (screenDetails != null) {
			screenDetailsArr = screenDetails.split(",");
			if (screenDetailsArr != null && screenDetailsArr.length >= 2) {
				fileName = screenDetailsArr[0].trim();
				levelDesc = screenDetailsArr[1].trim().replaceAll("(\\w)(\\s)+(\\w)", "$1_$3");

				MetaModelId metaModelId = new MetaModelId();
				metaModelId.setFilename(fileName);
				metaModelId.setIssuecode('N');
				metaModelId.setFunccode("Inquire");
				metaModelId.setActtype("IN");
				metaModelId.setLocation(location);
				metaModelId.setMasterco(masterCo);
				metaModelId.setPolicyco(policyCo);
				metaModelId.setState(state);
				metaModelId.setKeyfld1(lineOfBus);
				metaModelId.setKeyfld2(insLine);
				metaModelId.setKeyfld3(product);
				metaModelId.setKeyfld4(coverage);
				metaModelId.setKeyfld5(item);
				metaModelId.setUsername("");
				mmName = metaModelDAO.getMetaModel(metaModelId);
			} else {
				logger.error("Set type details not valid in screens.properties.");
			}
		} else {
			logger.error("Set type details not loaded in screens.properties.");
		}
		return mmName;
	}

	/**
	 * genMetaModelName - This method generates the default meta model name using ALR conventions. 
	 * Default Meta Model Name format =
	 * 		levelDesc_location_masterCo_policyCo_lineOfBus_Insurance_Line_insLine_state_Product_product_Coverage_coverage_Item_item 
	 * Example: Product_00_05_00_CPP_Insurance_Line_CA_IN_Product_CA_Coverage_ABC_Item_XYZ
	 */
	@Override
	public String genMetaModelName() {
		String mmDefaultName = null;
		if (setType != null && !setType.trim().equals("")) {
			mmDefaultName = "";
			mmDefaultName = StringUtils.concat(mmDefaultName, 200, levelDesc,
					new String[] { "_", location, "_", masterCo, "_", policyCo, "_", lineOfBus, "_Insurance_Line_", insLine, "_", state })
					.trim();

			if (!product.equals("*ALL")) {
				mmDefaultName = StringUtils.concat(mmDefaultName, 200, mmDefaultName, new String[] { "_Product_", product }).trim();
			}
			if (!coverage.equals("*ALL")) {
				mmDefaultName = StringUtils.concat(mmDefaultName, 200, mmDefaultName, new String[] { "_Coverage_", coverage }).trim();
			}
			if (!item.equals("*ALL") && !item.equals("?")) {
				mmDefaultName = StringUtils.concat(mmDefaultName, 200, mmDefaultName, new String[] { "_Item_", item }).trim();
			}
		}
		return mmDefaultName;
	}

	/**
	 * fetchDefaultTemplateName - This method returns the default template name in case the desired meta model is not found. 
	 * 		Default Template Name format = Template_levelDesc.json 
	 * Example: Template_Insurance_Line.json for any template needed for Insurance Line screen.
	 */
	@Override
	public String fetchDefaultTemplateName() {
		return StringUtils.concat("", 50, "Template_", levelDesc);
	}

	/**
	 * publishMetaModel - This method publishes the meta model information to ALR tables and BASSYS07L1 table.
	 * 
	 * @param request - HttpServletRequest
	 * @param modelName - Name of the meta model
	 * @param modelContent - Contents of the meta model
	 * @return boolean value if the publish was successful or not
	 * @throws Exception
	 */
	public boolean publishMetaModel(HttpServletRequest request, String modelName, String modelContent) throws Exception {
		String screenDetails = null;
		String[] screenDetailsArr = null;
		initMetaModel();
		setParams(request);

		screenDetails = MetaModelTypes.fetchScreenDetails(setType);
		if (screenDetails != null) {
			screenDetailsArr = screenDetails.split(",");
			if (screenDetailsArr != null && screenDetailsArr.length >= 2) {
				fileName = screenDetailsArr[0].trim();
				levelDesc = screenDetailsArr[1].trim().replaceAll("(\\w)(\\s)+(\\w)", "$1_$3");
			}
		}
		FSIT = (request.getParameter("Remarks") != null) ? request.getParameter("Remarks") : "NOFSIT";

		String response = publishToALR(modelContent);
		if (response != null && !response.trim().equals("")) {
			ErrorResponse eResponse = processALRResponse(response);
			if (eResponse != null && eResponse.isErrorFound()) {
				throw new RuntimeException("Publish of meta model information to database tables failed. ".concat(eResponse
						.getErrorMessage()));
			} else {
				response = callImplementerforSYSupdates(modelName, modelContent);
				if (response.contains("ERROR"))
					logger.error(response);
				return (!response.contains("ERROR"));
			}
		} else {
			throw new RuntimeException("Publish of meta model information to database tables failed. Please check error logs.");
		}
	}

	/**
	 * publishToALR - This method publishes the meta model information to ALR tables.
	 * 
	 * @param modelContent - Contents of the meta model
	 * @return - Response XML
	 * @throws Exception
	 */
	private String publishToALR(String modelContent) throws Exception {
		String templateContent = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI),
				fetchDefaultTemplateName().concat(".json"), "");
		String templateElements = "";
		if (templateContent != null) {
			templateElements = ConversionUtil.transformXMLusingXSLT(ConversionUtil.convertJSONtoXML(templateContent, "root"),
					"ExtractTemplateElements.xsl", canvasConfig.getTransformerURL());
		}

		JSONObject jsonObject = ConversionUtil.convertJSONtoJSONObject(modelContent);
		String key = genALRKey(jsonObject.getJSONObject("metadata").getString("title"));
		if (key != null) {
			jsonObject.put("KEY", key);
			jsonObject.put("ITEM", item);
			jsonObject.put("STATE", state);
			jsonObject.put("USER", userid);
			jsonObject.put("templateElements", templateElements);
			return callImplementerforALRupdates(ConversionUtil.transformXMLusingXSLT(
					ConversionUtil.convertJSONObjecttoXML(jsonObject, "root"), "MetaImplementerTransformer.xsl",
					canvasConfig.getTransformerURL()));
		} else {
			throw new RuntimeException("Input key not valid.");
		}
	}

	/**
	 * genALRKey - Generates the key for the ALR Implementer application. 
	 * Default KEY format =
	 * 		location|masterCo|policyCo|lineOfBus|insLine|state|product|coverage|setType|title 
	 * For example: 00|05|00|CPP|CA|IN|CA|DOCUMP|84|IN DOC UM Property Damage Coverage
	 * 
	 * @param title - Title of the screen
	 * @return Generated key as a String
	 */
	public String genALRKey(String title) {
		String key = null;
		if (setType != null && !setType.trim().equals("")) {
			key = "";
			key = StringUtils.concat(key, 500, key, new String[] { location, "|", masterCo, "|", policyCo, "|", lineOfBus.trim(), "|",
					insLine.trim(), "|", state, "|", product.trim(), "|", coverage.trim(), "|", setType, "|", title.trim() });
		}
		return key;
	}

	/**
	 * callImplementerforALRupdates - This method posts an HTTP request to ALR Implementer for ALR updates.
	 * 
	 * @param requestXML - Input data island XML for ALR Implementer
	 * @return - Response XML String
	 * @throws Exception
	 */
	public String callImplementerforALRupdates(String requestXML) throws Exception {
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("User", userid);
		headers.put("FSIT", FSIT);
		return integrationService.send("direct:SaveAttributes", headers, requestXML, String.class);
	}

	/**
	 * hasResponseErrors - This method checks if the ALR Implementer response contains errors.
	 * 
	 * @param response - Response XML string
	 * @return ErrorResponse
	 * @throws Exception
	 */
	private ErrorResponse processALRResponse(String response) throws Exception {
		ErrorResponse eResponse = new ErrorResponse();
		Document doc = ConversionUtil.convertStringToXMLDocument(response);
		if (doc.getElementsByTagName("RecordLockedError").getLength() > 0) {
			eResponse.setErrorMessage(doc.getElementsByTagName("RecordLockedError").item(0).getTextContent());
			eResponse.setErrorFound(true);
			return eResponse;
		}
		checkError(eResponse, "VIEWLEVEL_STATUS", doc);
		if (eResponse.isErrorFound()) {
			logger.error("Publish of meta model information to database tables failed. ".concat(eResponse.getErrorMessage()));
			return eResponse;
		}
		checkError(eResponse, "DATA", doc);
		if (eResponse.isErrorFound()) {
			logger.error("Publish of meta model information to database tables failed. ".concat(eResponse.getErrorMessage()));
		}
		return eResponse;
	}

	private void checkError(ErrorResponse eResponse, String nodeName, Document doc) {
		String errorMessage = "";
		NodeList nodeList = doc.getElementsByTagName(nodeName);
		for (int i = 0; i < nodeList.getLength(); i++) {
			NodeList childNodeList = nodeList.item(i).getChildNodes();
			for (int j = 0; j < childNodeList.getLength(); j++) {
				Node node = childNodeList.item(j);
				if (node.getNodeName().equalsIgnoreCase("ErrIndc") && node.getTextContent().equalsIgnoreCase("Y")) {
					eResponse.setErrorFound(true);
				}
				if (node.getNodeName().equalsIgnoreCase("ProcMsg")) {
					errorMessage = node.getTextContent();
				}
				if (eResponse.isErrorFound() && !errorMessage.trim().equals("")) {
					eResponse.setErrorMessage(errorMessage);
					return;
				}
			}
		}
	}

	/**
	 * callImplementerforSYSupdates - This method posts an HTTP request to ALR Implementer for SYS updates.
	 * 
	 * @return - Response String
	 * @throws Exception
	 */
	public String callImplementerforSYSupdates(String modelName, String modelContent) throws Exception {
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("KEY", genSYSKey());
		headers.put("setType", setType);
		headers.put("item", item);
		headers.put("pageName", modelName);
		headers.put("User", userid);
		headers.put("FSIT", FSIT);
		return integrationService.send("direct:SaveHovers", headers, modelContent, String.class);
	}

	/**
	 * genSYSKey - Generates the key for the BASSYS updates. Default KEY format =
	 * location+masterCo+policyCo+state+lineOfBus+insLine+product+coverage For example: 000505INCPPGL
	 * 
	 * @return Generated key as a String
	 */
	public String genSYSKey() {
		String key = "";
		key = StringUtils.concat(key, 500, key, new String[] { location, masterCo, policyCo, state, StringUtils.righPad(lineOfBus, 3),
				StringUtils.righPad(insLine, 3) });
		if (!product.equals("*ALL")) {
			key = StringUtils.concat(key, 500, key, StringUtils.righPad(product, 6));
			if (!coverage.equals("*ALL")) {
				key = StringUtils.concat(key, 500, key, StringUtils.righPad(coverage, 6));
			}
		}
		return key;
	}

	@Override
	@Transactional
	public List<List<Object>> fetchHierarchyUsingMetaModelName(String modelName) {
		return metaModelDAO.fetchHierarchyUsingMetaModelName(modelName);
	}

	@Override
	public String executeQuery(String sqlQuery, Map<?, ?> params) throws Exception {
		ProcessorService processorService = metaModelPSF.getProcessorService(canvasConfig.getSqlprocessortype());
		String requestStr = processorService.produceRequest(sqlQuery, params);
		return processorService.processRequest(integrationService, requestStr);
	}

	private class ErrorResponse {
		private boolean errorFound = false;
		private String errorMessage = "";

		public boolean isErrorFound() {
			return errorFound;
		}

		public void setErrorFound(boolean errorFound) {
			this.errorFound = errorFound;
		}

		public String getErrorMessage() {
			return errorMessage;
		}

		public void setErrorMessage(String errorMessage) {
			this.errorMessage = errorMessage;
		}
	}

	private String setType = "";
	private String fileName = "";
	private String levelDesc = "Default";
	private String location = "";
	private String masterCo = "";
	private String policyCo = "";
	private String lineOfBus = "";
	private String insLine = "";
	private String state = "";
	private String product = "";
	private String coverage = "";
	private String item = "";
	private String FSIT = "";

}
