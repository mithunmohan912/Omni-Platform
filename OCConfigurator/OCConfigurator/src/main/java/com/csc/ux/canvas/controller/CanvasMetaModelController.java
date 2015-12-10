package com.csc.ux.canvas.controller;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.rest.AbstractRestController;
import com.csc.cscip.ux.common.util.CommonConstants;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;
import com.csc.cscip.ux.common.util.UXSupportMetaDataUtil;
import com.csc.ux.canvas.CanvasConfig;
import com.csc.ux.canvas.converter.UXPTMetaConverter;
import com.csc.ux.canvas.service.metamodel.MetaModelBody;
import com.csc.ux.canvas.service.metamodel.MetaModelProperties;
import com.csc.ux.canvas.service.metamodel.MetaModelService;
import com.csc.ux.canvas.service.rules.RulesService;

@Controller
public class CanvasMetaModelController extends AbstractRestController {
	private static final Logger logger = LoggerFactory.getLogger(CanvasMetaModelController.class);
	private static String metaModelRepositoryType = UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE);
	private static String metaModelRepositoryEndPointURI = UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI);

	@Autowired
	private MetaModelService metaModelService;
	@Autowired
	private MetaModelProperties createMetaModelProp;
	@Autowired
	private CanvasConfig canvasConfig;
	@Autowired
	private RulesService rulesService;
	@Autowired
	private UXPTMetaConverter uxPtMetaConverter;

	/**
	 * RetrieveMetaModelDBServiceURI - This method fetches the Meta Model name from database. If it does not exist, then it returns the
	 * default Meta Model name. Also, returns the Meta Model in the response object.
	 * 
	 * @param request - Input HttpServletRequest.
	 * @return - Meta Model
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodeldb", method = RequestMethod.GET)
	public @ResponseBody
	Object retrieveMetaModelDB(HttpServletRequest request) throws Exception {
		MetaModelBody metaModel = new MetaModelBody();
		String mmName = metaModelService.fetchMetaModelName(request);
		if (mmName != null) {
			metaModel.setMmName(mmName);
			String requestedModel = UXRepositoryUtil.receiveFile(metaModelRepositoryType, metaModelRepositoryEndPointURI,
					mmName.concat(".json"), "");
			if (requestedModel != null) {
				metaModel.setMmContent(requestedModel);
			} else {
				setDefault(mmName, metaModel);
			}
		} else {
			mmName = metaModelService.genMetaModelName();
			setDefault(mmName, metaModel);
		}
		return metaModel;
	}

	private void setDefault(String mmName, MetaModelBody metaModel) throws Exception {
		String defaultTemplateName = metaModelService.fetchDefaultTemplateName();
		String errorMsg = "Meta model not found for key information provided. Please check error log.";
		if (mmName != null && defaultTemplateName != null) {
			metaModel.setMmName(mmName);
			String requestedModel = UXRepositoryUtil.receiveFile(metaModelRepositoryType, metaModelRepositoryEndPointURI,
					defaultTemplateName.concat(".json"), "");
			if (requestedModel != null) {
				metaModel.setMmContent(requestedModel);
			} else {
				requestedModel = UXRepositoryUtil.receiveFile(metaModelRepositoryType, metaModelRepositoryEndPointURI,
						"Template_Default.json", "");
				if (requestedModel != null) {
					metaModel.setMmContent(requestedModel);
				} else {
					throw new FileNotFoundException(errorMsg);
				}
			}
		} else {
			throw new FileNotFoundException(errorMsg);
		}
	}

	/**
	 * PublishMetaModelDBServiceURI - This method publishes a Meta Model to the database.
	 * 
	 * @param name - Name of the Meta Model
	 * @param request - Input HttpServletRequest
	 * @return - Meta Model
	 * @throws Exception
	 * 
	 */
	@RequestMapping(value = "/metamodeldb/{name}", method = RequestMethod.POST)
	public @ResponseBody
	Object publishMetaModelDB(@PathVariable("name") String requestMetaModelName, HttpServletRequest request) throws Exception {
		String requestModel = IOUtils.readContent(request.getInputStream());
		String publish = request.getParameter("Publish");
		String remarks = (request.getParameter("Remarks") != null) ? request.getParameter("Remarks") : "";

		List<Object> metaModels = ConversionUtil.convertJSONtoList(requestModel);
		String tempMetaModel = ConversionUtil.convertObjectToJSON(metaModels.get(0));
		String saveMetaModel = ConversionUtil.convertObjectToJSON(metaModels.get(1));

		boolean saveModel = false;
		if (publish == null || (publish != null && publish.equals("true"))) {
			saveModel = metaModelService.publishMetaModel(request, requestMetaModelName, tempMetaModel);
		} else {
			saveModel = true;
		}
		if (saveModel) {
			UXSupportMetaDataUtil.updateSupportMetaData(tempMetaModel, remarks);
			UXRepositoryUtil.sendFile(metaModelRepositoryType, metaModelRepositoryEndPointURI, requestMetaModelName.concat(".json"),
					ConversionUtil.prettifyJSON(saveMetaModel), CommonConstants.JSON_CONTENT_TYPE, "", remarks);
		} else {
			throw new RuntimeException("Publish of meta model information to database tables failed. Please check error logs.");
		}
		return saveModel;
	}

	/**
	 * MetaModelConversionURI - This method converts an existing meta model to include custom screen and element level properties.
	 * 
	 * @param requestMetaModelName - Name of the Meta Model
	 * @return - Updated Meta Model content
	 * @throws Exception
	 * 
	 */
	@RequestMapping(value = "/metamodel/conversion/{name}", method = RequestMethod.POST)
	public @ResponseBody
	Object updateMetaModelwithProperties(@PathVariable("name") String requestMetaModelName) throws Exception {
		String requestedModel = UXRepositoryUtil.receiveFile(metaModelRepositoryType, metaModelRepositoryEndPointURI,
				requestMetaModelName.concat(".json"), "");
		if (requestedModel == null) {
			throw new FileNotFoundException("Requested Meta Model does not exist.");
		}
		String updatedMetaModel = createMetaModelProp.updateMetaModelProperties(requestMetaModelName, requestedModel);
		UXRepositoryUtil.sendFile(metaModelRepositoryType, metaModelRepositoryEndPointURI, requestMetaModelName.concat(".json"),
				ConversionUtil.prettifyJSON(updatedMetaModel), CommonConstants.JSON_CONTENT_TYPE, "", "Converted Base Version");
		return updatedMetaModel;
	}

	@RequestMapping(value = "/metamodel/conversion/list", method = RequestMethod.GET)
	public @ResponseBody
	Object getViewsList(HttpServletRequest request) throws Exception {
		return ConversionUtil.convertListToJson(UXRepositoryUtil.getFileList(canvasConfig.getConversionrepotype(),
				canvasConfig.getSrcrepopath(), "", true));
	}

	/**
	 * AllMetaModelConversionURI - This method converts all the meta model in the repository to include custom screen and element level
	 * properties.
	 * 
	 * @return - List of updated Meta Models
	 * @throws Exception
	 * 
	 */
	@RequestMapping(value = "/metamodel/conversion", method = RequestMethod.POST)
	public @ResponseBody
	Object updateAllMetaModelwithProperties() throws Exception {
		List<String> allMetamodels = UXRepositoryUtil.getFileList(metaModelRepositoryType, metaModelRepositoryEndPointURI, "", true);
		List<Object> updatedMetamodels = new ArrayList<Object>();
		for (Object currentMetaName : allMetamodels) {
			try {
				updateMetaModelwithProperties((String) currentMetaName);
				updatedMetamodels.add(currentMetaName);
			} catch (Exception ex) {
				logger.warn("***Conversion of metamodel: " + currentMetaName + " failed***");
				String exMessage = ExceptionUtils.getMessage(ex);
				logger.warn(exMessage);
			}
		}
		return ConversionUtil.convertListToJson(updatedMetamodels);
	}

	/**
	 * GetSQLQueryResultsURI - This method gets the results of a given SQL query.
	 * 
	 * @param request - Input HttpServletRequest
	 * @return - JSON string of SQL query results
	 * @throws Exception
	 * 
	 */
	@RequestMapping(value = "/metamodel/query", method = RequestMethod.GET)
	public @ResponseBody
	Object getSQLQueryResults(HttpServletRequest request) throws Exception {
		String params = request.getHeader("params");
		if (params == null)
			params = "{}";
		return metaModelService.executeQuery(request.getHeader("query"), ConversionUtil.convertJSONStringtoMap(params));
	}

	/**
	 * InitRulesURI - This method invokes the Rules Web Service for a given Meta Model.
	 * 
	 * @param name - Name of the Meta Model
	 * @param request - Input HttpServletRequest
	 * @return - Meta Model
	 * @throws Throwable
	 * 
	 */
	@RequestMapping(value = "/metamodel/rules/{name}", method = RequestMethod.POST)
	public @ResponseBody
	Object initRules(@PathVariable("name") String requestMetaModelName, HttpServletRequest request) throws Throwable {
		String requestModel = "[" + IOUtils.readContent(request.getInputStream()) + "]";
		List<Object> metaModels = ConversionUtil.convertJSONtoList(requestModel);
		String publishMetaModel = ConversionUtil.convertObjectToJSON(metaModels.get(0));
		return rulesService.getRulesLaunchURL(request, requestMetaModelName, publishMetaModel);
	}

	// This is a dummy service to test conversion code. Will be removed after integration with Canvas
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/metamodel/conversion/convert", method = RequestMethod.POST)
	public @ResponseBody
	Object testProcess(HttpServletRequest request) throws Throwable {
		String requestModel = IOUtils.readContent(request.getInputStream());
		
		//Map<String, List<Object>> views = UXJacksonUtils.convertFromJSON(requestModel, HashMap.class);
		
		//List<Object> files = views.get("viewNames");
		String convertAll = "true";
		String folderName = "";
		//List<String>  = new ArrayList<String>();
		try {
			uxPtMetaConverter.createUXMetaInformation(convertAll, folderName, null);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return "aa";
	}
}
