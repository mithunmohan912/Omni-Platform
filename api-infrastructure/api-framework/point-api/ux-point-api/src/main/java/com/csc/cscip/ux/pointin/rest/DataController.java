package com.csc.cscip.ux.pointin.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.QueryParam;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.poi.hssf.usermodel.HSSFFormulaEvaluator;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.csc.cscip.ux.common.dao.AbstractDAO;
import com.csc.cscip.ux.common.dao.DataAccessObject.Filter;
import com.csc.cscip.ux.common.dao.DataAccessObject.Join;
import com.csc.cscip.ux.common.rest.AbstractRestController;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.security.securityengine.ACLJSONManipulator;
import com.csc.cscip.ux.common.security.securityengine.ACLNavigationManipulator;
import com.csc.cscip.ux.common.security.securityengine.ACLSupportDataManipulator;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXJacksonUtils;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;
import com.csc.cscip.ux.common.util.UXUtils;
import com.csc.cscip.ux.pointin.util.SurroundProductConfig;
/* ACL POC */
/* ACL POC */
/*ACL POC */
/*ACL POC */

@Controller
@SuppressWarnings("unchecked")
public class DataController extends AbstractRestController {
	
		/*ACL POC */
	public static final String DATA = ":data"; 	
	public static final String NAV = ":navigation"; 
	public static final String SUPPORT = ":support"; 
	public static final String GRID = ":grid"; 
	private static Map<String, String> policyKeyCacheMap=new HashMap<String, String>();
		/*ACL POC */
	/*ACL POC */
	@Autowired
	@Qualifier("authenticationManager")
	public AuthenticationManager authManager;
	/*ACL POC */
	@RequestMapping(value = "/data", method = RequestMethod.POST)
	public @ResponseBody
	String getData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		RequestPayLoad requestPayLoad = parseRequest(request);

		String screenId = (String) requestPayLoad.get("screenId");
		if (requestPayLoad.get("method") == null) {
			ACLJSONManipulator.secureData(requestPayLoad, screenId, true);
		}

		Object uxRestResponseObj = processRequest(requestPayLoad, UXAppConfig.getProperty(UXAppConfig.APPLICATION), "data", response);

		if (uxRestResponseObj instanceof String) {
			return (String) uxRestResponseObj;
		}

		ResponsePayLoad responsePayLoad = (ResponsePayLoad) uxRestResponseObj;
		if("Stopper_Questions".equals(screenId) &&  "Decline".equals(responsePayLoad.get("UND_UNDERWRITING_STATUS")))
		{
			ResponsePayLoad tempResponsePayLoad=responsePayLoad;
			RequestPayLoad tempRequestPayLoad=new RequestPayLoad();
			tempRequestPayLoad.put("KEY_LOCATION_COMPANY", requestPayLoad.get("BC_KEY_LOCATION_COMPANY"));
			tempRequestPayLoad.put("KEY_MASTER_COMPANY",  requestPayLoad.get("BC_KEY_MASTER_COMPANY"));
			tempRequestPayLoad.put("BC_LINE_OF_BUSINESS",  requestPayLoad.get("lob"));
			tempRequestPayLoad.put("KEY_SYMBOL", requestPayLoad.get("BC_KEY_SYMBOL") );
			tempRequestPayLoad.put("KEY_POLICY_NUMBER",  requestPayLoad.get("BC_KEY_POLICY_NUMBER"));
			tempRequestPayLoad.put("KEY_MODULE", requestPayLoad.get("BC_KEY_MODULE") );
			tempRequestPayLoad.put("UND_UNDERWRITING_STATUS","UD");
			tempRequestPayLoad.put("KEY_UNDERWRITER_NAME",responsePayLoad.get("KEY_UNDERWRITER_NAME") );
			tempRequestPayLoad.put("UND_AUTO_UNDERWRITING_IND", "Y");
			tempRequestPayLoad.put("REQUESTCODE", "UNDDECISCHGRq");
			processRequest(tempRequestPayLoad, UXAppConfig.getProperty(UXAppConfig.APPLICATION), "data", response);
		}
		if (requestPayLoad.get("method") != null && requestPayLoad.get("method").equals("GET")) {
			ACLJSONManipulator.secureData(responsePayLoad, screenId, false);
		}
		
		PTDataController ptDataController = new PTDataController();
		ptDataController.activityAfterResponse(requestPayLoad, responsePayLoad);
		
		
		return UXJacksonUtils.convertToJSON(responsePayLoad);
	}

	@RequestMapping(value = "/data/support/{credential}", method = RequestMethod.POST)
	public @ResponseBody
	String getSupportData(@PathVariable String credential,HttpServletRequest request) throws Throwable {

		String requestJSON = IOUtils.readContent(request.getInputStream());

		// Transform Request JSON to Request Object
		RequestPayLoad requestPayLoad = UXJacksonUtils.convertFromJSON(requestJSON, RequestPayLoad.class);

		List<String> elements = (List<String>) requestPayLoad.get("elements");
		List<JDBCResponsePayLoad> elementSupportData = new ArrayList<JDBCResponsePayLoad>(elements.size());

		String supportConfiguration = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_TYPE), //
				UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_END_POINT_URI), requestPayLoad.get("formId") + ".properties", //
				(String) requestPayLoad.get("formGroupId"));

		Properties supportConfigPrps = UXUtils.loadPropertiesFromContent(supportConfiguration);

		RequestPayLoad elementSupportInfo = new RequestPayLoad();

		JDBCInfo jdbcInfo = new JDBCInfo();
		jdbcInfo.setPayLoad(requestPayLoad);

		elementSupportInfo.put("jdbcInfo", jdbcInfo);

		for (String elementName : elements) {

			String supportType = (String) supportConfigPrps.get(elementName + ".type");
			jdbcInfo.setType(Type.valueOf(supportType));

			String supportInfo = (String) supportConfigPrps.get(elementName + ".supportinfo");
			jdbcInfo.setStmt(supportInfo);

			String selectInfo = (String) supportConfigPrps.get(elementName + ".selectinfo");
			jdbcInfo.setSelectInfo(selectInfo);

			String paramsInfo = (String) supportConfigPrps.get(elementName + ".paramsinfo");
			if (paramsInfo != null) {
				jdbcInfo.setParamsInfo(UXJacksonUtils.convertFromJSON(paramsInfo, Map.class));
			} else {
				jdbcInfo.setParamsInfo(null);
			}
			elementSupportInfo.put("name", elementName);

			String lookup = (String) supportConfigPrps.get(elementName + ".lookup");
			elementSupportInfo.put("lookup", lookup);

			// TODO - check and throw service layer exception
			JDBCResponsePayLoad jdbcResponsePayLoad = (JDBCResponsePayLoad) sendServiceRequest(UXAppConfig.SUPPORT, "service", elementSupportInfo, new JDBCResponsePayLoad());

			List<Map<String, String>> rows = jdbcResponsePayLoad.getRows();
			if (rows.size() == 1) {
				String valueNode = (String) jdbcResponsePayLoad.getPayLoad().get("valueNode");
				String value = rows.get(0).get(valueNode);
				String name = (String) jdbcResponsePayLoad.getPayLoad().get("name");
				requestPayLoad.put(name, value);
			}

			elementSupportData.add(jdbcResponsePayLoad);
		}

		ResponsePayLoad responsePayLoad = new ResponsePayLoad();
		responsePayLoad.put("elements", elementSupportData);

		// Convert Response PayLoad to JSON format
		String responseJSON = UXJacksonUtils.convertToJSON(responsePayLoad);
		
		//temp code for ACL POC to get authentication
		String username = request.getHeader("Authentication").split("-")[0];
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, credential);
		Authentication authentication = this.authManager.authenticate(authenticationToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		//

		//support ACL POC
		String formId = (String) requestPayLoad.get("formId");		
		Map<String, Object> supportDataMap = UXJacksonUtils.convertFromJSON(responseJSON, Map.class);
		ACLSupportDataManipulator.secureData(supportDataMap, formId+SUPPORT, false);		
		responseJSON = UXJacksonUtils.convertToJSON(supportDataMap);
		//support ACL POC
		
		return responseJSON;

	}
	
	

	@RequestMapping(value = "/data/grid/{name}", method = RequestMethod.POST)
	public @ResponseBody
	Object getGridData(@PathVariable String name, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String gridMetaModel = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE), //
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI), name + ".json", "");

		if (name.equals("PrintFileListGrid")){
			ReportController reportController = new ReportController();
		    return	reportController.getData(request, response);
		}
		else{
		Map<String, Object> gridDataRefMap = (Map<String, Object>) UXJacksonUtils.convertFromJSON(gridMetaModel, Map.class).get("dataSource");

		JDBCInfo jdbcInfo = new JDBCInfo();

		jdbcInfo.setType(Type.valueOf((String) gridDataRefMap.get("type")));
		jdbcInfo.setStmt((String) gridDataRefMap.get(gridDataRefMap.get("type"))); 
		jdbcInfo.setParamsInfo((Map<String, List<Map<String, String>>>) gridDataRefMap.get("params"));
		jdbcInfo.setPayLoad(parseRequest(request));
		if (gridDataRefMap.get("maxKeySize") != null) {
			jdbcInfo.getPayLoad().put("maxKeySize", (String) gridDataRefMap.get("maxKeySize"));
		}

		Object uxRestResponseObj = (JDBCResponsePayLoad) sendServiceRequest(UXAppConfig.GRID, "service", jdbcInfo, new JDBCResponsePayLoad());
		if (name.equals("LRAROWorksheetGrid")) {
			uxRestResponseObj = PTDataController.modifyLRAROGridData(uxRestResponseObj);
			return UXJacksonUtils.convertToJSON(uxRestResponseObj);
		}
		if (name.equals("RcvDBWaiveInstGrid")) {
			uxRestResponseObj = PTDataController.modifyWaiveInstGridData(uxRestResponseObj,name);
			return UXJacksonUtils.convertToJSON(uxRestResponseObj);
		}
		if (name.equals("RcvDBRevWaiveAmtGrid")) {
			uxRestResponseObj = PTDataController.modifyWaiveInstGridData(uxRestResponseObj,name);
			return UXJacksonUtils.convertToJSON(uxRestResponseObj);
		}
		if (name.equals("SubjectivitiesList_WcvGrid")) {
			uxRestResponseObj = PTDataController.modifySubjectivitiesGridData(uxRestResponseObj);
			return UXJacksonUtils.convertToJSON(uxRestResponseObj);
		}
		if (uxRestResponseObj instanceof String) {
			return (String) uxRestResponseObj;
		} else {
			List<Map<String, String>> rows = ((JDBCResponsePayLoad) uxRestResponseObj).getRows();

			for (Iterator<Map<String, String>> rowIter = rows.iterator(); rowIter.hasNext();) {

				Map<String, String> row = rowIter.next();
				Map<String, String> newRow = new HashMap<String, String>();

				// int counter = 0;
				for (Iterator<Entry<String, String>> columnIter = row.entrySet().iterator(); columnIter.hasNext();) {

					Entry<String, String> column = columnIter.next();

					/*
					 * if (!(column.getValue().equals(""))) { counter++; }
					 */
					if (column.getKey().contains("-")) {
						String newColumnName = column.getKey().replaceAll("-", "");
						columnIter.remove();
						newRow.put(newColumnName, column.getValue());
					}
				}

				row.putAll(newRow);

				/*
				 * if (counter < 3) { rowIter.remove(); }
				 */
			}
			return UXJacksonUtils.convertToJSON(uxRestResponseObj);
		}
		}
	}
/* ACL POC */

	@RequestMapping(value = "/data/navigation/flow/{credential}", method = RequestMethod.POST)
	public @ResponseBody
	Object getNavigationData(@PathVariable String credential, HttpServletRequest request, HttpServletResponse response) throws Throwable {
		/*ACL POC */
		
		//key identification
		String requestJSON = IOUtils.readContent(request.getInputStream());
		RequestPayLoad requestPayLoad = UXJacksonUtils.convertFromJSON(requestJSON, RequestPayLoad.class);
		String policyKey = (String) requestPayLoad.get("PolicyKey");
		String key="";
		Object[] locstatepoc = null;
		if(policyKey.length()>=16 && !(policyKey.substring(4, 7).trim().equals(""))) 
		{
		 if(policyKeyCacheMap.get(policyKey.substring(0, 16))==null)
		 {
			AbstractDAO abstractDAO=new AbstractDAO() {
				
				@Override
				public String getTableName() {
					return "PMSP0200";
				}
			};
			Filter filter = new Filter("SYMBOL",policyKey.substring(4,7));
			Join join,joinArr[];
			join = new Join("TBTS01","RISK0STATE","STATECDKEY");
			joinArr = new Join[1];
			joinArr[0] = join;
			filter.and("POLICY0NUM", policyKey.substring(7,14));
			filter.and("MODULE", policyKey.substring(14,16));
			filter.and("LOCATION", policyKey.substring(0,2));
			filter.and("MASTER0CO", policyKey.substring(2, 4));
			List<Object[]> row = abstractDAO.selectAll(new String[]{"LINE0BUS" ,"STATEABBRV","COMPANY0NO"},joinArr,filter);
			if(row.size()!=0){
				
			   locstatepoc = row.get(0);
			   if(locstatepoc!=null)
			  {
				policyKeyCacheMap.put(policyKey.substring(0, 16),locstatepoc[0].toString()+':'+locstatepoc[1]+':'+locstatepoc[2]);
			  }
		    }
		 }
		}
		
		String responseJSON = UXJacksonUtils.convertToJSON(processRequest(requestPayLoad, UXAppConfig.NAVIGATION, "navigationdata", response));
											
		//applying the ACL rules
		/*Temporary Spring Context */
		Map<String, Object> navigationDataMap = UXJacksonUtils.convertFromJSON(responseJSON, Map.class);
		String username = request.getHeader("Authentication").split("-")[0];		
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, credential);
		Authentication authentication = this.authManager.authenticate(authenticationToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		/* ACL POC */
		if(policyKey.length()>=16 && !(policyKey.substring(4, 7).trim().equals(""))) {
		String lobstatepco=policyKeyCacheMap.get(policyKey.substring(0, 16));
		key = policyKey+":"+lobstatepco;	
		ACLNavigationManipulator.secureData(navigationDataMap, "search:functions", key, false);
		ACLNavigationManipulator.secureData(navigationDataMap, "policy:navigation", key, false);
		}
		responseJSON = UXJacksonUtils.convertToJSON(navigationDataMap);
		return responseJSON;
		/*ACL POC */
	}
	
	/**
     * Upload single file using Spring Controller
	 * @throws Throwable 
     */
    @RequestMapping(value = "/uploadFile/{userName}", method = RequestMethod.POST)
    public @ResponseBody
    String uploadFileHandler(HttpServletRequest request, HttpServletResponse response, @PathVariable String userName, @RequestParam("file") MultipartFile file) throws Throwable {
 
    	String supportConfiguration = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_TYPE), //
				UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_END_POINT_URI), "WCLOCIMPORTRq.properties","WCV");

		Properties supportConfigPrps = UXUtils.loadPropertiesFromContent(supportConfiguration);
		
		Map<String,Object> requestPayLoad = new HashMap<String, Object>();
		List<Map<String,Object>> list= new ArrayList<Map<String,Object>>();
		Map<String, String> propertyMap = new HashMap<String, String>();
		
		DataFormatter objDefaultFormat = new DataFormatter();
		FormulaEvaluator objFormulaEvaluator;
		
		for (final Entry<Object, Object> entry : supportConfigPrps.entrySet()) {
			propertyMap.put((String) entry.getKey(), (String) entry.getValue());
	    }
		
        if (!file.isEmpty()) {
            	POIFSFileSystem  fs = new POIFSFileSystem(file.getInputStream());
            	HSSFWorkbook	workbook = new HSSFWorkbook(fs);
            	objFormulaEvaluator = new HSSFFormulaEvaluator((HSSFWorkbook) workbook);
            	Map<String, Object> map;
            	String LOC = "";
            	String MCO = "";
            	String PCO  = "";
            	String SYMBOL = "";
            	String POLICY_NUMBER = "";
            	String MOD = "";
	            //Get first/desired sheet from the workbook
	            HSSFSheet sheet = workbook.getSheetAt(0);
	 
	            //Iterate through each rows one by one
	            Iterator<Row> rowIterator = sheet.iterator();
	            while (rowIterator.hasNext())
	            {
	                Row row = rowIterator.next();
	                map=new HashMap<String, Object>();
	                if(row.getRowNum()==0){
	                	   continue; //just skip the rows if row number is 0
	                	  }
	                if(row.getRowNum()==1){	                	
	                		LOC=row.getCell(0).toString();
	                		MCO=row.getCell(1).toString();
	                		PCO=row.getCell(2).toString();
	                		SYMBOL=row.getCell(3).toString();
	                		POLICY_NUMBER=row.getCell(4).toString();
	                		MOD=row.getCell(5).toString();	                	
	                }
	                

	                
	                //For each row, iterate through all the columns
	                for (Map.Entry<String, String> entry : propertyMap.entrySet())
	                {
	                	if(entry.getKey().length() > 5 && entry.getKey().substring(0, 5).equals("Dummy")){
	                		Object value = entry.getValue();
	                		if(value.equals("NA")){
	                			value = "";
	                		}
	                		map.put(entry.getKey().substring(6), value.toString());
	                	}else {
	                		Cell cellValue = row.getCell(Integer.valueOf(entry.getKey()));
	                		objFormulaEvaluator.evaluate(cellValue); // This will evaluate the cell, And any type of cell will return string value
	                		Object value = objDefaultFormat.formatCellValue(cellValue,objFormulaEvaluator);
	                		
	                		//Object value = row.getCell(Integer.valueOf(entry.getKey()));
	                		if(value == null){
	                			value="";
	                		}
	                		map.put(entry.getValue(), value.toString());
	                	}
	                }
	                map.put("KEY_LOCATION", LOC);
	                map.put("KEY_MCO", MCO);
	                map.put("KEY_PCO", PCO);
	                map.put("KEY_POLICY_SYMBOL", SYMBOL);
	                map.put("KEY_POLICY_NUMBER", POLICY_NUMBER);
	                map.put("KEY_POLICY_MODULE", MOD);
	                
	                list.add(map);
	            }
        	}
        requestPayLoad.put("selectedData", list);
        requestPayLoad.put("USER", userName.toUpperCase());
        Object uxRestResponseObj;
               
        uxRestResponseObj = processRequest(requestPayLoad, "RCV", "importFile", response, new ResponsePayLoad());
        ResponsePayLoad responsePayLoad = (ResponsePayLoad) uxRestResponseObj;
        return UXJacksonUtils.convertToJSON(responsePayLoad);
    }
	private static Object processRequest(RequestPayLoad requestPayLoad, String requestType, String resource, HttpServletResponse response) throws IOException, Throwable {
		return processRequest(requestPayLoad, requestType, resource, response, new ResponsePayLoad());
	}

	@RequestMapping(value = "/sendEmail", method = RequestMethod.POST)
	public @ResponseBody
	Object sendEmail(HttpServletRequest request, HttpServletResponse response, @RequestParam(value="file",required=false) MultipartFile file, @RequestParam(value="data") Object data) throws Throwable {
		
		RequestPayLoad requestPayLoad = UXJacksonUtils.convertFromJSON(data.toString(), RequestPayLoad.class);
		
		String host = SurroundProductConfig.getProperty("emailhost");
		 String from,to,cc,bcc,subject,content,replyto,polNumber;
		 from =  (String) requestPayLoad.get("mailFrom");
		 to =  (String) requestPayLoad.get("mailTo");
		 cc = (String) requestPayLoad.get("mailCc");
		 bcc = (String) requestPayLoad.get("mailBcc");
		 subject = (String) requestPayLoad.get("mailSubject");
		 content = (String) requestPayLoad.get("mailContent");
		 replyto = (String) requestPayLoad.get("mailReplyTo");
		 polNumber = (String) requestPayLoad.get("KEY_POLICY_NUMBER");
   	 	 PTDataController ptDataController = new PTDataController();
		 ptDataController.doSendMail(host, from,  to, cc,  bcc, subject, content, replyto, polNumber, file);
		 ResponsePayLoad responsePayLoad = new ResponsePayLoad();
		 responsePayLoad.put("mailResp", "Mail has been sent successfully");
		 return UXJacksonUtils.convertToJSON(responsePayLoad);
	}

	@RequestMapping(value = "/data/table/{name}", method = RequestMethod.POST)
	public @ResponseBody
	Object getTableData(@PathVariable String name , HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String tableMetaModel  = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI), name + ".json", "");
		
		Map<String, Object> tableDataRefMap = (Map<String, Object>) UXJacksonUtils.convertFromJSON(tableMetaModel, Map.class).get("dataSource");

		JDBCInfo jdbcInfo = new JDBCInfo();

		jdbcInfo.setType(Type.valueOf((String) tableDataRefMap.get("type")));
		jdbcInfo.setStmt((String) tableDataRefMap.get(tableDataRefMap.get("type"))); 
		jdbcInfo.setParamsInfo((Map<String, List<Map<String, String>>>) tableDataRefMap.get("params"));
		jdbcInfo.setPayLoad(parseRequest(request));
		if (tableDataRefMap.get("maxKeySize") != null) {
			jdbcInfo.getPayLoad().put("maxKeySize", (String) tableDataRefMap.get("maxKeySize"));
		}

		Object uxRestResponseObj = (JDBCResponsePayLoad) sendServiceRequest(UXAppConfig.GRID, "service", jdbcInfo, new JDBCResponsePayLoad());
		
		if (uxRestResponseObj instanceof String) {
			return (String) uxRestResponseObj;
		} else {
			List<Map<String, String>> rows = ((JDBCResponsePayLoad) uxRestResponseObj).getRows();

			for (Iterator<Map<String, String>> rowIter = rows.iterator(); rowIter.hasNext();) {

				Map<String, String> row = rowIter.next();
				Map<String, String> newRow = new HashMap<String, String>();

				// int counter = 0;
				for (Iterator<Entry<String, String>> columnIter = row.entrySet().iterator(); columnIter.hasNext();) {

					Entry<String, String> column = columnIter.next();
					if (column.getKey().contains("-")) {
						String newColumnName = column.getKey().replaceAll("-", "");
						columnIter.remove();
						newRow.put(newColumnName, column.getValue());
					}
				}

				row.putAll(newRow);

			}
			return UXJacksonUtils.convertToJSON(uxRestResponseObj);
		}
		
	}
	
	@RequestMapping(value = "/emailReport", method = RequestMethod.POST)
	public @ResponseBody
	Object emailReport(HttpServletRequest request, HttpServletResponse response, @RequestParam(value="data") Object data) throws Throwable {
		
		RequestPayLoad requestPayLoad = UXJacksonUtils.convertFromJSON(data.toString(), RequestPayLoad.class);
		String host =SurroundProductConfig.getProperty("emailhost");
		String from,to,subject,fullFileName,check="error";
		from =  SurroundProductConfig.getProperty("EmailFrom");
		subject =  SurroundProductConfig.getProperty("subject");
		fullFileName =  SurroundProductConfig.getProperty("rName")+"."+SurroundProductConfig.getProperty("fileType");
		to =  (String) requestPayLoad.get("emailId");
		List<Map<String, String>> gridRows =  UXJacksonUtils.convertFromJSON(requestPayLoad.get("gridData").toString(), List.class);
		List<Map<String, String>> gridMetaDataRows =  UXJacksonUtils.convertFromJSON(requestPayLoad.get("gridMetadata").toString(), List.class);
		PTDataController ptDataController = new PTDataController();
		File file = ptDataController.createTempFile(gridRows, gridMetaDataRows, fullFileName);
		check = ptDataController.doSendEmailReport(host, from, to, subject, file);
		ResponsePayLoad responsePayLoad = new ResponsePayLoad();
		responsePayLoad.put("mailRespStatus", check);
		return UXJacksonUtils.convertToJSON(responsePayLoad);
	}
	
	//Omni-Start
	
	@RequestMapping(value = "/clients", method = RequestMethod.GET)
	public @ResponseBody
	Object getSearchData(@RequestParam HashMap<String,String> allRequestParams, @QueryParam("sessionKey") String sessionKey,HttpServletRequest request) throws Throwable {

		String gridMetaModel = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE), //
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI), "NAClientSearch" + ".json", "");
		
		StringBuilder sqlStmtBuilder = new StringBuilder("{");
		Iterator  it = allRequestParams.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
			sqlStmtBuilder.append("\"" +pair.getKey()+"\":\""+pair.getValue()+"\",");
		}
		sqlStmtBuilder.setCharAt(sqlStmtBuilder.length()-1, '}');
				
		Map<String, Object> gridDataRefMap = (Map<String, Object>) UXJacksonUtils.convertFromJSON(gridMetaModel, Map.class).get("dataSource");

		JDBCInfo jdbcInfo = new JDBCInfo();

		jdbcInfo.setType(Type.valueOf((String) gridDataRefMap.get("type")));
		jdbcInfo.setStmt((String) gridDataRefMap.get(gridDataRefMap.get("type"))); 
		jdbcInfo.setParamsInfo((Map<String, List<Map<String, String>>>) gridDataRefMap.get("params"));
		jdbcInfo.setPayLoad((RequestPayLoad) parseRequest(sqlStmtBuilder.toString(),sessionKey,RequestPayLoad.class));
		if (gridDataRefMap.get("maxKeySize") != null) {
			jdbcInfo.getPayLoad().put("maxKeySize", (String) gridDataRefMap.get("maxKeySize"));
		}
		
		Object uxRestResponseObj = (JDBCResponsePayLoad) sendServiceRequest(UXAppConfig.GRID, "service", jdbcInfo, new JDBCResponsePayLoad());
		
		if (uxRestResponseObj instanceof String) {
			return (String) uxRestResponseObj;
		} else {
			List<Map<String, String>> rows = ((JDBCResponsePayLoad) uxRestResponseObj).getRows();

			for (Iterator<Map<String, String>> rowIter = rows.iterator(); rowIter.hasNext();) {

				Map<String, String> row = rowIter.next();
				Map<String, String> newRow = new HashMap<String, String>();
				String addSeqNo = row.get("C00024");
				String cltSeqNo = row.get("C00003");
				for (Iterator<Entry<String, String>> columnIter = row.entrySet().iterator(); columnIter.hasNext();) {
					Entry<String, String> column = columnIter.next();
					if (column.getKey().contains("-")) {
						String newColumnName = column.getKey().replaceAll("-", "");
						columnIter.remove();
						newRow.put(newColumnName, column.getValue());
					}
					if(column.getKey().contains("C00003")){
						String newColumnValue = request.getRequestURL()+"/"+cltSeqNo+"/"+addSeqNo;
						String newColumnName = "CLTSEQNO";
						columnIter.remove();
						newRow.put( newColumnName,newColumnValue);
					}
				}

				row.putAll(newRow);
			}
			JSONObject js= new JSONObject(uxRestResponseObj);
			return UXJacksonUtils.convertToJSON(uxRestResponseObj);
		}
	}
	
	@RequestMapping(value = "/clients/{cltSeqNo}/{AddSeqNo}", method = RequestMethod.GET)
	public @ResponseBody
	Object getInquireClient(@PathVariable String cltSeqNo,@PathVariable String AddSeqNo, HttpServletRequest request,HttpServletResponse response) throws Throwable {
		HashMap<String,String> allRequestParams = new HashMap<String, String>();
		allRequestParams.put("KEY_CLIENT_SEQUENCE_NUMBER", cltSeqNo);
		allRequestParams.put("KEY_ADDRESS_SEQUENCE_NUMBER", AddSeqNo);
		allRequestParams.put("REQUESTCODE", "BASNAMEAINQRq");
		StringBuilder sqlStmtBuilder = new StringBuilder("{");
		Iterator  it = allRequestParams.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
			sqlStmtBuilder.append("\"" +pair.getKey()+"\":\""+pair.getValue()+"\",");
		}
		sqlStmtBuilder.setCharAt(sqlStmtBuilder.length()-1, '}');
		RequestPayLoad requestPayLoad = (RequestPayLoad) parseRequest(sqlStmtBuilder.toString(),request.getHeader("Authentication"),RequestPayLoad.class);

		String screenId = (String) requestPayLoad.get("screenId");
		if (requestPayLoad.get("method") == null) {
			ACLJSONManipulator.secureData(requestPayLoad, screenId, true);
		}

		Object uxRestResponseObj = processRequest(requestPayLoad, UXAppConfig.getProperty(UXAppConfig.APPLICATION), "data", response);

		if (uxRestResponseObj instanceof String) {
			return (String) uxRestResponseObj;
		}

		ResponsePayLoad responsePayLoad = (ResponsePayLoad) uxRestResponseObj;
		return UXJacksonUtils.convertToJSON(responsePayLoad);
	}
	
	
	
	@RequestMapping(value="/clients", method=RequestMethod.OPTIONS)
	public @ResponseBody
	String getOptions() throws Throwable{
		String gridMetaModel = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_TYPE), //
				UXAppConfig.getProperty(UXAppConfig.GRID_META_MODEL_REPOSITORY_END_POINT_URI), "swagger.json", "");
		return gridMetaModel;
	}
	
	@RequestMapping(value = "/clients", method = RequestMethod.POST)
	public @ResponseBody
	String addClients(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		RequestPayLoad requestPayLoad = parseRequest(request);
		requestPayLoad=getRequestAddressConverted(requestPayLoad);
		requestPayLoad=getRequestConverted(requestPayLoad);

		String screenId = (String) requestPayLoad.get("screenId");
		if (requestPayLoad.get("method") == null) {
			ACLJSONManipulator.secureData(requestPayLoad, screenId, true);
		}

		Object uxRestResponseObj = processRequest(requestPayLoad, UXAppConfig.getProperty(UXAppConfig.APPLICATION), "data", response);

		if (uxRestResponseObj instanceof String) {
			return (String) uxRestResponseObj;
		}

		ResponsePayLoad responsePayLoad = (ResponsePayLoad) uxRestResponseObj;
		if (requestPayLoad.get("method") != null && requestPayLoad.get("method").equals("GET")) {
			ACLJSONManipulator.secureData(responsePayLoad, screenId, false);
		}
		
		PTDataController ptDataController = new PTDataController();
		ptDataController.activityAfterResponse(requestPayLoad, responsePayLoad);
		
        responsePayLoad=getResponseAddressConverted(responsePayLoad);
        responsePayLoad=getResponseConverted(responsePayLoad);
		return UXJacksonUtils.convertToJSON(responsePayLoad);
	}
	
	@RequestMapping(value = "/clients", method = RequestMethod.PUT)
	public @ResponseBody
	String updateClients(HttpServletRequest request, HttpServletResponse response) throws Throwable {
		RequestPayLoad requestPayLoad = parseRequest(request);

		String screenId = (String) requestPayLoad.get("screenId");
		if (requestPayLoad.get("method") == null) {
			ACLJSONManipulator.secureData(requestPayLoad, screenId, true);
		}

		Object uxRestResponseObj = processRequest(requestPayLoad, UXAppConfig.getProperty(UXAppConfig.APPLICATION), "data", response);

		if (uxRestResponseObj instanceof String) {
			return (String) uxRestResponseObj;
		}

		ResponsePayLoad responsePayLoad = (ResponsePayLoad) uxRestResponseObj;
		if (requestPayLoad.get("method") != null && requestPayLoad.get("method").equals("GET")) {
			ACLJSONManipulator.secureData(responsePayLoad, screenId, false);
		}
		
		PTDataController ptDataController = new PTDataController();
		ptDataController.activityAfterResponse(requestPayLoad, responsePayLoad);
		
		
		return UXJacksonUtils.convertToJSON(responsePayLoad);
	}
	public RequestPayLoad getRequestAddressConverted(RequestPayLoad request){
		try {
			Map<String, Object> tempRequest = new HashMap<String, Object>();
			for (Iterator<Entry<String, Object>> iter = request.entrySet()
					.iterator(); iter.hasNext();) {
				Entry<String, Object> entry = iter.next();
				Object tempObj = entry.getValue();
				if (tempObj instanceof Map) {
					HashMap<String, Object> innerMap = (HashMap) tempObj;
					for (Iterator<Entry<String, Object>> iterInner = innerMap
							.entrySet().iterator(); iterInner.hasNext();) {
						Entry<String, Object> entryInner = iterInner.next();
						tempRequest.put(entryInner.getKey(),
								entryInner.getValue());
					}
					iter.remove();		
				}
			}
			request.putAll(tempRequest);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return request;
	}
	public ResponsePayLoad getResponseAddressConverted(ResponsePayLoad responsePayLoad) throws ParserConfigurationException, SAXException, IOException{
		try 
		{
		File XmlFile = new File("D:/RestAPI/PointXMLTemplate.xml");
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		Document doc = dBuilder.parse(XmlFile);
		doc.getDocumentElement().normalize();
		NodeList nodeList=doc.getElementsByTagName("*");
		HashMap<String,Object> tempMap=new HashMap<String,Object>();
		String parentNode="";
		for(int i=0;i<nodeList.getLength();i++){
			Node templateNode=nodeList.item(i);
			if(templateNode.hasChildNodes() && !(templateNode.getNodeName().equals("POINTXML"))){
				parentNode=templateNode.getNodeName();
				NodeList addressNodes=templateNode.getChildNodes();
				for(int x=0;x<addressNodes.getLength();x++){
					Node addressNode=addressNodes.item(x);
					if(!addressNode.getNodeName().equals("#text")){
						tempMap.put(addressNode.getNodeName(),responsePayLoad.get(addressNode.getNodeName()));
					}
					responsePayLoad.remove(addressNode.getNodeName());
					System.out.println("AddressNodes : "+addressNode.getNodeName());
				}
				responsePayLoad.put(parentNode, tempMap);
			}
		}
		} catch(Exception e){
			e.printStackTrace();
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return responsePayLoad;
	}
	public ResponsePayLoad getResponseConverted(ResponsePayLoad response){
		Date dt=new Date();
		DateFormat df = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
		dt=Calendar.getInstance().getTime(); 
		String startDate=df.format(dt);
		System.out.println("Start Date : "+startDate);
		Properties Prop=new Properties();
		InputStream input=null;
		try {
			input = new FileInputStream(
					"D:/UX/MetaModels/metamodel/DataDIctionary.properties");
			Prop.load(input);
			Map<String, Object> tempResponse = new HashMap<String, Object>();
			for (Iterator<Entry<String, Object>> iter = response.entrySet()
					.iterator(); iter.hasNext();) {
				Entry<String, Object> entry = iter.next();
				Object tempObj = entry.getValue();
				Entry<String, Object> entryInner=null;
				HashMap<String,Object> tempInnerMap=new HashMap<String,Object>();
				if (tempObj instanceof Map) {
					HashMap<String, Object> innerMap = (HashMap) tempObj;
					for (Iterator<Entry<String, Object>> iterInner = innerMap.entrySet()
							.iterator(); iterInner.hasNext();){
					   entryInner = iterInner.next();
					   Enumeration<?> e = Prop.propertyNames();
						while (e.hasMoreElements()) {
							String key = (String) e.nextElement();
							String value = Prop.getProperty(key);
							if (entryInner.getKey().equals(key)) {
								String valueResponse = innerMap.get(entryInner.getKey())
										.toString();
								tempInnerMap.put(value, valueResponse);
							}
						}
					}
					iter.remove();
					tempResponse.put(entry.getKey(), tempInnerMap);
				} else {
					Enumeration<?> e = Prop.propertyNames();
					while (e.hasMoreElements()) {
						String key = (String) e.nextElement();
						String value = Prop.getProperty(key);
						if (entry.getKey().equals(key)) {
							String valueResponse = response.get(entry.getKey())
									.toString();
							iter.remove();
							tempResponse.put(value, valueResponse);
						}
					}
				}
			}
			response.putAll(tempResponse);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		Date dt1=Calendar.getInstance().getTime(); 
		String endDate=df.format(dt1);
		System.out.println("End Date : "+endDate);
		return response;
	}
	public RequestPayLoad getRequestConverted(RequestPayLoad request){
		Date dt=new Date();
		DateFormat df = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
		dt=Calendar.getInstance().getTime(); 
		String startDate=df.format(dt);
		System.out.println("Start Date : "+startDate);
		Properties Prop=new Properties();
		InputStream input=null;
		try{
			input=new FileInputStream("D:/UX/MetaModels/metamodel/DataDIctionary.properties");
			Prop.load(input);
			Map<String,Object> tempRequest=new HashMap<String,Object>();
			for(Iterator<Entry<String,Object>> iter = request.entrySet().iterator();iter.hasNext();)
			{
				Entry<String,Object> entry = iter.next();
					Enumeration<?> e = Prop.propertyNames();
					while (e.hasMoreElements()) {
						String key = (String) e.nextElement();
						String value = Prop.getProperty(key);
						if(entry.getKey().equals(value)){
							String valueResponse=request.get(entry.getKey()).toString();
							iter.remove();
							tempRequest.put(key,valueResponse);	
						}
				}
			}		
			request.putAll(tempRequest);
		}catch(Exception e){
		 e.printStackTrace();
		}
		Date dt1=Calendar.getInstance().getTime(); 
		String endDate=df.format(dt1);
		System.out.println("End Date : "+endDate);
		return request;
	}
}
