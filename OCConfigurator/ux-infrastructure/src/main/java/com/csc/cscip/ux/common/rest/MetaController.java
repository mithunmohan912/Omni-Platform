package com.csc.cscip.ux.common.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.rest.exception.RestException;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.security.securityengine.ACLJSONManipulator;
import com.csc.cscip.ux.common.util.CommonConstants;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXJacksonUtils;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;
import com.csc.cscip.ux.common.util.UXSupportMetaDataUtil;
import com.csc.cscip.ux.common.util.UXUtils;

@Controller
@SuppressWarnings("unchecked")
public class MetaController extends AbstractRestController {

	/**
	 * GetMetaModelListURI - This method provide exhaustive lists of all Screen Meta Models.
	 * 
	 * @return - List of Meta Model
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel", method = RequestMethod.GET)
	public @ResponseBody
	Object getAllMetaModels() throws Exception {
		return ConversionUtil.convertListToJson(UXRepositoryUtil.getFileList(UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI), "", true));
	}

	/**
	 * AddMetaModelURI - This is the Add/Update Meta Model Service. This takes the metamodel received in the HTTPServletRequest and saves it
	 * on repository.
	 * 
	 * @param request
	 *            - Input HttpServletRequest
	 * @return - created/updated metamodel
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/{name}", method = RequestMethod.PUT)
	public @ResponseBody
	Object newMetaModel(@PathVariable String name, HttpServletRequest request) throws Exception {
		String requestMetaModel = IOUtils.readContent(request.getInputStream());
		String remarks = (request.getParameter("Remarks") != null) ? request.getParameter("Remarks") : "";
		UXRepositoryUtil.sendFile(UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI), name.concat(".json"), ConversionUtil.prettifyJSON(requestMetaModel),
				CommonConstants.JSON_CONTENT_TYPE, "", remarks);
		return requestMetaModel;
	}

	/**
	 * GetMetaModelURI - This method gets a HEAD version of the Meta Model from the repository.
	 * 
	 * @param name
	 *            - Name of the Meta Model
	 * @return - fetched metamodel
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/{name}", method = RequestMethod.GET)
	public @ResponseBody
	Object getMetaModel(@PathVariable String name) throws Exception {
		String requestedFile = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI), name.concat(".json"), "");
		if (requestedFile == null) {
			throw new RuntimeException("Requested Meta Model does not exist.");
		}
		return requestedFile;
	}

	/**
	 * GetMetaModelVersionURI - This method gets a specific version number for a Meta Model from the repository.
	 * 
	 * @param name
	 *            - Name of the Meta Model
	 * @param versionNo
	 *            - Version number to be fetched
	 * @return - fetched metamodel
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/{name}/{versionNo:.+}", method = RequestMethod.GET)
	public @ResponseBody
	Object getMetaModelVersion(@PathVariable String name, @PathVariable String versionNo) throws Exception {
		String requestedFile = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI), name.concat(".json"), "", versionNo);
		if (requestedFile == null) {
			throw new RuntimeException("Requested Meta Model does not exist.");
		}
		return requestedFile;
	}

	/**
	 * GetSupportMetaDataUsingIdURI - This method gets Support Meta Data for a particular Meta Model form and group id.
	 * 
	 * @param groupid
	 *            - Group id of the Meta Model
	 * @param formid
	 *            - Form id of the Meta Model
	 * @return - JSON string of Support information for the given page
	 * @throws Exception
	 * 
	 */
	@RequestMapping(value = "/metamodel/support/{groupid}/{formid}", method = RequestMethod.GET)
	public @ResponseBody
	Object getSupportMetaData(@PathVariable String groupid, @PathVariable String formid) throws Exception {
		String supportFileContents = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_END_POINT_URI), formid.concat(".properties"), groupid);
		return ConversionUtil.convertPropertiesToJSONObject(UXUtils.loadPropertiesFromContent(supportFileContents)).toString();
	}

	/**
	 * UpdateSupportMetaDataURI - This method updates Support Meta Data for a given Meta Model content.
	 * 
	 * @param request
	 *            - Input HttpServletRequest
	 * @return - Meta Model JSON
	 * @throws Exception
	 * 
	 */
	@RequestMapping(value = "/metamodel/support", method = RequestMethod.PUT)
	public @ResponseBody
	Object updateSupportMetaData(HttpServletRequest request) throws Exception {
		String metaModelContent = IOUtils.readContent(request.getInputStream());
		String remarks = (request.getParameter("Remarks") != null) ? request.getParameter("Remarks") : "";
		return UXSupportMetaDataUtil.updateSupportMetaData(metaModelContent, remarks);
	}

	/**
	 * GetGridMetaModelListURI - This method provide lists of all Grid Meta Models.
	 * 
	 * @return - List of Grid Meta Models
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/grid", method = RequestMethod.GET)
	public @ResponseBody
	Object getAllGridMetaModels() throws Exception {
		return ConversionUtil.convertListToJson(UXRepositoryUtil.getFileList(UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI), "", true));
	}

	/**
	 * AddGridMetaModelURI - This is the Add/Update Grid Meta Model Service. This uses the grid meta model received in the
	 * HTTPServletRequest and saves it on the repository.
	 * 
	 * @param request
	 *            - Input HttpServletRequest
	 * @return - New grid metamodel
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/grid/{name}", method = RequestMethod.PUT)
	public @ResponseBody
	Object newGridMetaModel(@PathVariable String name, HttpServletRequest request) throws Exception {
		String requestModel = IOUtils.readContent(request.getInputStream());
		String remarks = (request.getParameter("Remarks") != null) ? request.getParameter("Remarks") : "";
		UXRepositoryUtil.sendFile(UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI), name.concat(".json"), ConversionUtil.prettifyJSON(requestModel),
				CommonConstants.JSON_CONTENT_TYPE, "", remarks);
		return requestModel;
	}

	/**
	 * GetGridMetaModelURI - This method gets a HEAD version of a Grid Meta Model from the repository.
	 * 
	 * @param name
	 *            - Name of the Grid Meta Model
	 * @return - Requested Meta Model
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/grid/{name}", method = RequestMethod.GET)
	public @ResponseBody
	Object getGridMetaModel(@PathVariable String name) throws Exception {
		String requestedFile = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI), name.concat(".json"), "");
		if (requestedFile == null) {
			throw new RuntimeException("Requested Grid Meta Model does not exist.");
		}
		return requestedFile;
	}

	/**
	 * GetGridMetaModelVersionURI - This method gets a specific version of a Grid Meta Model from the repository.
	 * 
	 * @param name
	 *            - Name of the Grid Meta Model
	 * @param versionNo
	 *            - Version number to be fetched
	 * @return - Requested Meta Model
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/grid/{name}/{versionNo:.+}", method = RequestMethod.GET)
	public @ResponseBody
	Object getGridMetaModelVersion(@PathVariable String name, @PathVariable String versionNo) throws Exception {
		String requestedFile = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI), name.concat(".json"), "", versionNo);
		if (requestedFile == null) {
			throw new RuntimeException("Requested Grid Meta Model does not exist.");
		}
		return requestedFile;
	}

	/**
	 * GetMetaModelHistoryURI - This method gets the version history of a Screen Meta Model from the repository.
	 * 
	 * @param name
	 *            - Name of the Screen Meta Model
	 * @return - Requested version history of the Screen Meta Model
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/history/{name}", method = RequestMethod.GET)
	public @ResponseBody
	Object getMetaModelHistory(@PathVariable String name) throws Exception {
		List<HashMap<?, ?>> versionList = UXRepositoryUtil.getHistory(UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI), name.concat(".json"), "");
		if (versionList == null) {
			throw new RuntimeException("No version history found for the given metamodel.");
		}
		return ConversionUtil.convertListOfMaptoJSONArray(versionList, "VersionHistory");
	}

	/**
	 * GetGridMetaModelHistoryURI - This method gets the version history of a Grid Meta Model from the repository.
	 * 
	 * @param name
	 *            - Name of the Grid Meta Model
	 * @return - Requested version history of the Grid Meta Model
	 * @throws Exception
	 */
	@RequestMapping(value = "/metamodel/grid/history/{name}", method = RequestMethod.GET)
	public @ResponseBody
	Object getGridMetaModelHistory(@PathVariable String name) throws Exception {
		List<HashMap<?, ?>> versionList = UXRepositoryUtil.getHistory(UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI), name.concat(".json"), "");
		if (versionList == null) {
			throw new RuntimeException("No version history found for the given grid metamodel.");
		}
		return ConversionUtil.convertListOfMaptoJSONArray(versionList, "VersionHistory");
	}

	@RequestMapping(value = "/metadata", method = RequestMethod.POST)
	public @ResponseBody
	String getMetadata(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		RequestPayLoad requestPayLoad = parseRequest(request, RequestPayLoad.class);

		String screenId = "";
		Map<String, String> screenInfo = new HashMap<String, String>(); 
		
		String actionKey = (String) requestPayLoad.get("key");
		if (actionKey != null) {
			screenInfo = (Map<String, String>) sendServiceRequest(UXAppConfig.ACTION, "service", actionKey, new JDBCResponsePayLoad());
			screenId = screenInfo.get("ScreenId");
			if (screenId != null && screenId.contains("exception")) {
				return screenId;
			}
		} else {
			screenId = (String) requestPayLoad.get("screenId");
		}

		String metaModel = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI), screenId + ".json", "");

		if (metaModel == null) {
			throw new RestException("This screen is not implemented");
		}

		Map<String, Object> metaModelMap = UXJacksonUtils.convertFromJSON(metaModel, Map.class);

		if (UXAppConfig.getProperty(UXAppConfig.ALLOW_EXPRESS_ENTRY).equals("Y")) {
			metaModelMap = UXUtils.applyExpressEntryRules(metaModelMap);
		}

		// Apply ACL
		ACLJSONManipulator.secureData(metaModelMap, screenId, false);

		// In the next statements, behavior of elements for this screen is loaded from Registry List and sent to the client as a single response
		Map<String, Object> behvrMap = UXUtils.loadBehavior(screenId);
		metaModelMap.put("behavior", behvrMap);

		// screenId
		metaModelMap.put("screenId", screenId);
		
		//request code for screeen
		metaModelMap.put("ReqstCode", screenInfo.get("ReqstCode"));
		
		metaModel = UXJacksonUtils.convertToJSON(metaModelMap);
		
		return metaModel;
	}

	@RequestMapping(value = "/metadata/grid/{name}", method = RequestMethod.GET)
	public @ResponseBody
	Map<String, Object> getGridMetadata(@PathVariable("name") String fileName, HttpServletResponse response) throws Throwable {

		String gridMetaModel = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI), fileName + ".json", "");

		Map<String, Object> gridMetaModelMap = UXJacksonUtils.convertFromJSON(gridMetaModel, Map.class);

		// Apply ACL
		ACLJSONManipulator.secureData(gridMetaModelMap, fileName, false);

		return gridMetaModelMap;
	}

}
