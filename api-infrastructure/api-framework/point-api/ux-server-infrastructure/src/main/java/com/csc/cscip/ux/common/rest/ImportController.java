package com.csc.cscip.ux.common.rest;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.csc.cscip.ux.common.rest.AbstractRestController;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;

@Controller
public class ImportController extends AbstractRestController {

	/**
	 * ImportMetaModelURI - Import all Screen Meta Models from a given import source to the repository
	 * 
	 * @param request
	 * @return - List of Screen Meta Models in JSON format
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/import", method = RequestMethod.POST)
	public @ResponseBody
	Object importMetaModels(HttpServletRequest request) throws Exception {
		return ConversionUtil.convertListToJson(UXRepositoryUtil.importFile(
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_IMPORT_SOURCE_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_IMPORT_SOURCE_URI), null));
	}

	/**
	 * ImportGridMetaModelURI - Import all Grid Meta Models from a given import source to the repository
	 * 
	 * @param request
	 * @return - List of Grid Meta Models in JSON format
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/grid/import", method = RequestMethod.POST)
	public @ResponseBody
	Object importGridMetaModels(HttpServletRequest request) throws Exception {
		return ConversionUtil.convertListToJson(UXRepositoryUtil.importFile(
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI),
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_IMPORT_SOURCE_TYPE),
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_IMPORT_SOURCE_URI), null));
	}

	/**
	 * ImportSupportMetaDataURI - Import all Support Meta Model Data from a given import source to the repository
	 * 
	 * @param request
	 * @return - List of Screen Meta Models in JSON format
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/support/import", method = RequestMethod.POST)
	public @ResponseBody
	Object importSupportProperties(HttpServletRequest request) throws Exception {
		String supportLocalPath = UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_IMPORT_SOURCE_URI);
		return ConversionUtil.convertListToJson(UXRepositoryUtil.importFile(
				UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_END_POINT_URI),
				UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_IMPORT_SOURCE_TYPE), supportLocalPath,
				IOUtils.getSubDirectoryList(supportLocalPath)));
	}
}
