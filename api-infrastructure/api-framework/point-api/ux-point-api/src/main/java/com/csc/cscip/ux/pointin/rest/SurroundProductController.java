package com.csc.cscip.ux.pointin.rest;

import java.io.LineNumberReader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.activation.DataHandler;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.wsdl.Definition;
import javax.wsdl.factory.WSDLFactory;
import javax.wsdl.xml.WSDLReader;
import javax.xml.namespace.QName;

import org.apache.axis.encoding.ser.SimpleDeserializerFactory;
import org.apache.axis.encoding.ser.SimpleSerializerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.rest.AbstractRestController;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.util.StringUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.pointin.util.SurroundProductConfig;

@Controller
public class SurroundProductController extends AbstractRestController {
	String requestCode;
	String reqParm;
	String userName;
	/*
	 * Important - The axis service uses client-config.wsdd to configure transports. Refer to this file when configuring
	 * the transports
	 */

	@RequestMapping(value = "/surroundproducts/dap/generate/{polkey}/{dapkey}", method = RequestMethod.GET)
	public @ResponseBody
	String generateDocument(@PathVariable("polkey") String polkey, @PathVariable("dapkey") String dapKey, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String reqUserOpt = "IMP";
		return processDocument(polkey, dapKey, reqUserOpt, request, response);
	}

	@RequestMapping(value = "/surroundproducts/dap/archive", method = RequestMethod.POST)
	public @ResponseBody
	String archiveDocument(HttpServletRequest request, HttpServletResponse response) throws Throwable {
		RequestPayLoad requestPayLoad = parseRequest(request);
		String polkey = (String)requestPayLoad.get("KEY");
		String dapkey = (String)requestPayLoad.get("dapkey");
		String reqUserOpt = "ARCHIVE";
		return processDocument(polkey, dapkey, reqUserOpt, request, response);

	}

	@SuppressWarnings({ "unchecked"})
	private String processDocument(String polkey, String reqPRTREQ, String reqUserOpt, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String reqPrint = "IM";
		String reqForm = StringUtils.fill("IMMPRINT", " ", 10);
		String polPrintIndic = "N";
		String reqDesc = "POLICYDEC";
		String largePolicy = "N";
		String policyKey = "";

		ArrayList<String> baspezcapRecordsArrayList = new ArrayList<String>();

		String strXmlFileStream = "";

		String reqRunType = null;
		if (reqUserOpt != null) {

			if (reqUserOpt.equals("PDF_DEC")) {
				reqRunType = "IMP";

			} else if (reqUserOpt.equals("PDF")) {
				reqRunType = "PRINT";

			} else if (reqUserOpt.equals("WIP")) {
				reqRunType = "PNT_WIP";

			} else if (reqUserOpt.equals("ARCHIVE") || reqUserOpt.equals("BATCH") || reqUserOpt.equals("ARCHIVE_DEC") || //
					reqUserOpt.equals("BATCH_DEC") || reqUserOpt.equals("IMP_PDF") || reqUserOpt.equals("IMP_WIP") || //
					reqUserOpt.equals("IMP")) {
				reqRunType = reqUserOpt;
			} else {
				reqRunType = "HTML";
			}
		}

		if (reqPRTREQ == null) {
			reqPRTREQ = generateKey();
		}

		String dapkey = "";
		if (reqPrint.equals("FC")) {
			dapkey = "    " + polkey.substring(4, 16);
		} else {
			String daploc = polkey.substring(0, 2);
			String dapmco = polkey.substring(2, 4);
			String dapsym = polkey.substring(4, 7);
			String dapnum = polkey.substring(7, 14);
			String dapmod = polkey.substring(14, 16);
			dapkey = daploc.concat(dapnum).concat(dapsym).concat(dapmod).concat(dapmco);
			String dapkeyWS = dapsym.concat(dapnum).concat(dapmod);
			dapkeyWS = dapkeyWS.replace(' ', '+');
		}
		if(request.getParameter("polPrintIndic") != null){
			polPrintIndic=request.getParameter("polPrintIndic");
		} 
		DataHandler dh = null;

		if (reqRunType.equals("ARCHIVE") || reqRunType.equals("PNT_WIP") || reqRunType.equals("IMP_WIP") || //
				reqRunType.equals("BATCH") || reqRunType.equals("EXIT")) {
			if(reqRunType.equals("ARCHIVE")){
				String query = "BASIMPRU01('" + dapkey + "A')";
				List<Map<String, String>> rows = executeStmt(Type.SP, query);
				if (rows.size() == 0) {
					return "Not Able to Update the Activity file";
				} else {
					for (Map<String, String> row : rows) {
						String data = (String)row.get("ERROR-OCCURS");
						if("Y".equals(data)){
							return "Not Able to Update the Activity file";
						}
					}
				}
			}
			dh = createStringDataHandler("");
		} else {
		     reqParm = "       " + reqPrint + dapkey + reqForm+ polPrintIndic;
			if(request.getParameter("REQUESTCODE")!=null &&request.getParameter("User")!=null){
				requestCode=request.getParameter("REQUESTCODE");
				userName=request.getParameter("User");
			    userName = userName +"          ".substring(userName.length());      
				if (requestCode.equals("POUTPRTINSCRq")) {
					reqParm = reqParm + userName + "Y";
				} else {
					reqParm = reqParm + userName;
				}
			}
			String query = "AFGPRTFRM1('" + reqParm + "')";
			List<Map<String, String>> rows = executeStmt(Type.SP, query);
			if (rows.size() == 0) {
				return "No Extract Data Returned from Host";
			} else {
				StringBuilder extractBuffer = new StringBuilder(40000);
				for (Map<String, String> row : rows) {
					String keyData = (String)row.get("KEY-DATA");
					String fileName = (String)row.get("FILENAME");
					String record = row.get("THERECORD").toString();
					if ("BASPEZCP  ".equals(fileName) || "BASPEZCPDT".equals(fileName)) {
						baspezcapRecordsArrayList.add(record.substring(0, 70));
						policyKey = keyData.toString();
					}
					extractBuffer.append(keyData);
					extractBuffer.append(fileName);
					extractBuffer.append(new String(org.apache.commons.codec.binary.Base64.decodeBase64(record)));
					extractBuffer.append("\r\n");
				}

				if (extractBuffer.toString().trim().length() == 0) {
					String errMessage;
					if ((reqDesc != null) && reqDesc.equals("POLICYDEC")) {
						errMessage = "Policy Dec cannot be generated online, there is no activity record on the policy.<br> A cycle may have been run since the policy was issued online.";
					} else {
						errMessage = "No Extract Data Returned from Host";
					}
					return errMessage;
				}

				int largePolicyExtractLen = SurroundProductConfig.getPropertyAsInt("LargePolicyExtract", "1000000");
				if (extractBuffer.length() > largePolicyExtractLen) {
					largePolicy = "Y";
				}

				String formDesc = StringUtils.fill(reqDesc, " ", 30);
				String effDate_old = extractBuffer.substring(123, 131);

				extractBuffer.replace(103, 133, formDesc);
				extractBuffer.replace(123, 131, effDate_old);
				if((request.getParameter("REQUESTCODE")!=null && !request.getParameter("REQUESTCODE").equals(""))  &&request.getParameter("User")!=null){
					if(requestCode.substring(0,7).equals("POUTPRT"))
	                {	
	                	String transCode=requestCode.substring(7, 9);
	                	extractBuffer.replace(42, 44,transCode);
	                }
			}
				dh = createStringDataHandler(extractBuffer.toString());
			}
		}

		DataHandler dhXML = createStringDataHandler(strXmlFileStream);

		String clobExtractData = "";
		DataHandler clobDh = null;

		if (policyKey.length() > 0) {
			clobExtractData = buildClobExtractFile(response, baspezcapRecordsArrayList, policyKey);
			if (clobExtractData.length() > 0) {
				clobDh = createStringDataHandler(clobExtractData);
			}
		}

		String BrowserPrintEndPoint = SurroundProductConfig.getProperty("BrowserPrintEndPoint");
		String BrowserPrintEnvironment = SurroundProductConfig.getProperty("BrowserPrintEnvironment");
		String BrowserPrintOperationName = SurroundProductConfig.getProperty("BrowserPrintOperationName");

		String LargeBrowserPrintEndPoint = SurroundProductConfig.getProperty("LargeBrowserPrintEndPoint");
		String LargeBrowserPrintOperationName = SurroundProductConfig.getProperty("LargeBrowserPrintOperationName");
		String SuccessMsg = SurroundProductConfig.getProperty("LargeBrowserSuccessMessage");
		String FailureMsg = SurroundProductConfig.getProperty("LargeBrowserFailureMessage");

		String BrowserPrintServiceName = SurroundProductConfig.getProperty("BrowserPrintServiceName");
		String BrowserPrintPortType = SurroundProductConfig.getProperty("BrowserPrintPortType");
		String BrowserPrintURL = SurroundProductConfig.getProperty("BrowserPrintURL");
		String BrowserPrintEnvironmentPath = SurroundProductConfig.getProperty("BrowserPrintEnvironmentPath");
		String BrowserPrintErrorFile = SurroundProductConfig.getProperty("BrowserPrintErrorFile");

		WSDLFactory wsdlFactory = WSDLFactory.newInstance();
		WSDLReader wsdlReader = wsdlFactory.newWSDLReader();
		wsdlReader.setFeature("javax.wsdl.verbose", false);
		wsdlReader.setFeature("javax.wsdl.importDocuments", true);
		Definition definition = wsdlReader.readWSDL(BrowserPrintEndPoint);

		String targetNS = definition.getTargetNamespace();
		String typeNS = definition.getNamespace("typens");
		QName serviceQName = new QName(targetNS, BrowserPrintServiceName);
		QName portQName = new QName(targetNS, BrowserPrintPortType);

		QName operationQName;
		org.apache.axis.client.Service wsservice;

		if ((largePolicy.equals("Y")) && (reqDesc != null) && (reqDesc.equals("POLICYDEC")) && (!polPrintIndic.equals("Y"))) {
			operationQName = new QName(targetNS, LargeBrowserPrintOperationName);
			wsservice = new org.apache.axis.client.Service(new java.net.URL(LargeBrowserPrintEndPoint), serviceQName);
		} else {
			operationQName = new QName(targetNS, BrowserPrintOperationName);
			wsservice = new org.apache.axis.client.Service(new java.net.URL(BrowserPrintEndPoint), serviceQName);
		}

		org.apache.axis.client.Call call = (org.apache.axis.client.Call) wsservice.createCall(portQName, operationQName);
		call.setProperty(org.apache.axis.client.Call.ATTACHMENT_ENCAPSULATION_FORMAT, org.apache.axis.client.Call.ATTACHMENT_ENCAPSULATION_FORMAT_DIME);

		org.apache.axis.attachments.AttachmentPart attachment = new org.apache.axis.attachments.AttachmentPart();
		attachment.setDataHandler(dh);
		attachment.setContentId("EXTRDATA");
		call.addAttachmentPart(attachment);

		org.apache.axis.attachments.AttachmentPart attachment1 = new org.apache.axis.attachments.AttachmentPart();
		attachment1.setDataHandler(dhXML);
		attachment1.setContentId("CHGDATA");
		call.addAttachmentPart(attachment1);

		if (clobDh != null) {
			org.apache.axis.attachments.AttachmentPart attachment2 = new org.apache.axis.attachments.AttachmentPart();
			attachment2.setDataHandler(clobDh);
			attachment2.setContentId("CLOBDATA");
			call.addAttachmentPart(attachment2);
		}

		call.setTimeout(new Integer(1000 * 900));

		QName qnameAttachment = new QName(typeNS, "UnknownBinaryContent");
		call.registerTypeMapping(UnknownBinaryContent.class, qnameAttachment, SimpleSerializerFactory.class, SimpleDeserializerFactory.class);

		if ((largePolicy.equals("Y")) && (reqDesc != null) && (reqDesc.equals("POLICYDEC")) && (!polPrintIndic.equals("Y"))) {

			String XMLSuccessMsg = "<SuccessMsg><POINTXML><SignonRq><ClientApp><Name>PT</Name></ClientApp><SignonPswd><CustId><CustLoginId>" + "LAB01" + "</CustLoginId></CustId></SignonPswd></SignonRq><InsuranceSvcRq><RqUID>BASPOLDCADDRq</RqUID><BASPOLDCRq><PayLoad><EXIPREDT>00000000</EXIPREDT>" + "<SENTDT>00000000</SENTDT><SENTTIME>000000000000</SENTTIME><REQUESTCODE>BASPOLDCADDRq</REQUESTCODE><ALERTED>N</ALERTED><UNIQUEKEY/><USERID>" + "LAB01" + "</USERID><AMESSAGE>" + SuccessMsg + " for policy " + polkey + "</AMESSAGE><SENTFRM>DocProd</SENTFRM><SUCCESSIND>Y</SUCCESSIND><POLKEY>" + polkey + "</POLKEY></PayLoad></BASPOLDCRq></InsuranceSvcRq></POINTXML></SuccessMsg>";
			String XMLFailureMsg = "<FailMsg><POINTXML><SignonRq><ClientApp><Name>PT</Name></ClientApp><SignonPswd><CustId><CustLoginId>" + "LAB01" + "</CustLoginId></CustId></SignonPswd></SignonRq><InsuranceSvcRq><RqUID>BASPOLDCADDRq</RqUID><BASPOLDCRq><PayLoad><EXIPREDT>00000000</EXIPREDT>" + "<SENTDT>00000000</SENTDT><SENTTIME>000000000000</SENTTIME><REQUESTCODE>BASPOLDCADDRq</REQUESTCODE><ALERTED>N</ALERTED><UNIQUEKEY/><USERID>" + "LAB01" + "</USERID><AMESSAGE>" + FailureMsg + " for policy " + polkey + "</AMESSAGE><SENTFRM>DocProd</SENTFRM><SUCCESSIND>N</SUCCESSIND><POLKEY>" + polkey + "</POLKEY></PayLoad></BASPOLDCRq></InsuranceSvcRq></POINTXML></FailMsg>";
			String XMLLargeDocParms = "<RequestMessage><Params><Request>IMP</Request><UniqueID>" + reqPRTREQ + "</UniqueID><Environment>" + BrowserPrintEnvironment + "</Environment><CFWUrl>" + UXAppConfig.getProperty("ServiceEndPointURI") + "</CFWUrl></Params><ReturnMsg>" + XMLSuccessMsg + XMLFailureMsg + "</ReturnMsg></RequestMessage>";

			call.invokeOneWay(new java.lang.Object[] { XMLLargeDocParms });

			String errMessage = "Large Policy Processing in the background started";
			return errMessage;
		}

		java.lang.Object _resp = call.invoke(new java.lang.Object[] { reqRunType, reqPRTREQ, BrowserPrintEnvironment, null });
		int sserviceReturn = ((java.lang.Integer) _resp).intValue();
		if (sserviceReturn != 0) {
			String strURL = "";
			String errorMessage = "";
			strURL = BrowserPrintURL + BrowserPrintEnvironmentPath + BrowserPrintEnvironment + "\\" + reqPRTREQ + BrowserPrintErrorFile;
			errorMessage = "An error has occured in Browser Print. Click on the following link to view the error file:  ";
			errorMessage += "<a href=" + strURL + ">Browser Print Errfile</a>";
			return errorMessage;
		}

		org.apache.axis.MessageContext msgContext = call.getMessageContext();
		org.apache.axis.Message reqMsg = msgContext.getResponseMessage();

		Map<?, ?> _output = call.getOutputParams();

		String strMIMEType;
		try {
			strMIMEType = (java.lang.String) _output.get(new javax.xml.namespace.QName("http://www.csc.com/DocPrintService", "strRetMIMEType"));
		} catch (java.lang.Exception _exception) {
			strMIMEType = (java.lang.String) org.apache.axis.utils.JavaUtils.convert(_output.get(new javax.xml.namespace.QName("http://www.csc.com/DocPrintService", "strRetMIMEType")), java.lang.String.class);
		}

		Iterator<org.apache.axis.attachments.AttachmentPart> ai = reqMsg.getAttachments();

		if (ai.hasNext()) {
			org.apache.axis.attachments.AttachmentPart p = ai.next();
			DataHandler dhOutPut = p.getDataHandler();

			// if (reqRunType.equals("PRINT") ||
			// reqRunType.equals("HTML") || reqRunType.equals("IMP") ||
			// reqRunType.equals("IMP_PDF")) {

			if (strMIMEType.equalsIgnoreCase("PDF"))
				response.setContentType("application/pdf");
			else if (strMIMEType.equals("PRINT"))
				response.setContentType("application/pdf");
			else if (strMIMEType.equals("RTF"))
				response.setContentType("application/msword");
			else if (strMIMEType.equalsIgnoreCase("HTM"))
				response.setContentType("text/html");
			else if (!strMIMEType.equals(""))
				response.setContentType("application/" + strMIMEType);
			else
				response.setContentType("text/html");

			ServletOutputStream outStream = response.getOutputStream();
			// response.setHeader("Content-Disposition",
			// "attachment;filename=" + policyKey + ".pdf");
			dhOutPut.writeTo(outStream);
			outStream.flush();
		}
		return "";
	}

	public static String generateKey() {

		Calendar calendar = Calendar.getInstance();

		int cYear = calendar.get(Calendar.YEAR);
		int cDay = calendar.get(Calendar.DAY_OF_YEAR);
		int cHour = calendar.get(Calendar.HOUR_OF_DAY);
		int cMinute = calendar.get(Calendar.MINUTE);
		int cSecond = calendar.get(Calendar.SECOND);
		int cMillisecond = calendar.get(Calendar.MILLISECOND);

		String newKey = new StringBuilder("f").append(cYear).append(cDay).append(cHour).append(cMinute).append(cSecond).append(cMillisecond).append(Math.round(Math.random() * 99)).toString();
		return newKey;
	}

	public static class StringDataSource extends org.apache.axis.attachments.ManagedMemoryDataSource {

		public StringDataSource(byte[] in, String contentType) throws java.io.IOException {
			super(new java.io.ByteArrayInputStream(in), Integer.MAX_VALUE - 2, contentType, true);
		}

		public StringDataSource(String in, String contentType) throws java.io.IOException {
			this(in.getBytes(), contentType);
		}
	}

	private DataHandler createStringDataHandler(String string) {
		return new DataHandler(string, "text/plain");
	}

	@SuppressWarnings("serial")
	public static class UnknownBinaryContent implements java.io.Serializable, org.apache.axis.encoding.SimpleType {

		@SuppressWarnings("unused")
		private byte[] value;

		public UnknownBinaryContent() {
		}

		public UnknownBinaryContent(byte[] value) {
			this.value = value;
		}

		public UnknownBinaryContent(java.lang.String value) {
			this.value = org.apache.axis.types.HexBinary.decode(value);
		}
	}

	private static class ExtractRecord {

		private String linePrefix;
		private String fieldName;
		private String data;

		public ExtractRecord(String linePrefix, String fieldName, String data) {
			this.linePrefix = linePrefix;
			this.fieldName = fieldName;
			this.data = data;
		}

		public String getLinePrefix() {
			return this.linePrefix;
		}

		public String getFieldName() {
			return this.fieldName;
		}

		public String getData() {
			return this.data;
		}
	}

	private static final Map<String, Integer> baspezcapIdFields;
	static {
		LinkedHashMap<String, Integer> aMap = new LinkedHashMap<String, Integer>();
		aMap.put("EZ_INS_LINE", 3);
		aMap.put("EZ_LOB", 3);
		aMap.put("EZ_UNIT", 5);
		aMap.put("EZ_RISK_LOC", 5);
		aMap.put("EZ_SUB_LOC", 5);
		aMap.put("EZ_CAP_DATA_ID", 10);
		aMap.put("EZ_EDITION_MMYY", 4);
		aMap.put("EZ_STATE", 2);
		aMap.put("EZ_DATA_TYPE", 4);
		aMap.put("EZ_SEQ_NUM", 5);
		aMap.put("EZ_FORM_LINE_NO", 5);
		baspezcapIdFields = Collections.unmodifiableMap(aMap);
	}
	private static final Map<String, Integer> policyIdFields;
	static {
		LinkedHashMap<String, Integer> aMap = new LinkedHashMap<String, Integer>();
		aMap.put("EZ_LOCATION", 2);
		aMap.put("EZ_MASTERCO", 2);
		aMap.put("EZ_POLICYCO", 2);
		aMap.put("EZ_SYM", 3);
		aMap.put("EZ_POLICY", 7);
		aMap.put("EZ_MOD", 2);
		policyIdFields = Collections.unmodifiableMap(aMap);
	}

	private LinkedHashMap<String, String> initQueryValues(String key, Map<String, Integer> fields, int offset) {

		LinkedHashMap<String, String> temporaryMap = new LinkedHashMap<String, String>();
		int current = (offset != 0) ? offset : 0;
		int endIndex = current;

		for (Map.Entry<String, Integer> entry : fields.entrySet()) {

			endIndex += entry.getValue();

			if (key.length() > endIndex) {

				temporaryMap.put(entry.getKey(), key.substring(current, endIndex).trim());
				current = endIndex;
			}
		}

		return temporaryMap;
	}

	private String queryValuesToString(LinkedHashMap<String, String> map) {

		StringBuilder temporaryStringBuilder = new StringBuilder();

		Iterator<Map.Entry<String, String>> entries = map.entrySet().iterator();
		while (entries.hasNext()) {
			Map.Entry<String, String> entry = entries.next();

			temporaryStringBuilder.append(" " + entry.getKey() + "=" + "'" + entry.getValue() + "'");
			if (entries.hasNext()) {
				temporaryStringBuilder.append(" AND");
			}
		}

		return temporaryStringBuilder.toString();

	}

	private String getLinePrefix(Map<String, String> row, Map<String, Integer> map) {

		StringBuilder sb = new StringBuilder();
		Iterator<Map.Entry<String, Integer>> entries = map.entrySet().iterator();

		while (entries.hasNext()) {
			Map.Entry<String, Integer> entry = entries.next();

			String result = row.get(entry.getKey());
			if (result.matches("[0-9]+") && !"EZ_EDITION_MMYY".equals(entry.getKey()) && !"EZ_STATE".equals(entry.getKey())) {
				sb.append(String.format("%05d", Integer.parseInt(result)));
			} else {
				sb.append(String.format("%1$-" + entry.getValue() + "s", result));
			}
		}

		return sb.toString();
	}

	private String buildClobExtractFile(HttpServletResponse response, ArrayList<String> baspezcapRecordsList, String policyKey) throws Throwable {

		ArrayList<String> baspezcapIdArrayList = new ArrayList<String>();
		ArrayList<ExtractRecord> extractFileRecordsArrayList = new ArrayList<ExtractRecord>();

		Iterator<String> baspezcapRecordsListIterator = baspezcapRecordsList.iterator();
		while (baspezcapRecordsListIterator.hasNext()) {

			String key = baspezcapRecordsListIterator.next();

			LinkedHashMap<String, String> tempLHM = new LinkedHashMap<String, String>();

			tempLHM.putAll(initQueryValues(key, policyIdFields, 0));
			tempLHM.putAll(initQueryValues(key, baspezcapIdFields, 18));

			baspezcapIdArrayList.add(queryValuesToString(tempLHM));
		}

		StringBuilder query = new StringBuilder("SELECT EZ_INS_LINE, EZ_LOB, EZ_UNIT, EZ_RISK_LOC, EZ_SUB_LOC, EZ_CAP_DATA_ID, EZ_EDITION_MMYY, " + //
				"EZ_STATE, EZ_DATA_TYPE, EZ_SEQ_NUM, EZ_FORM_LINE_NO, EZ_CHEC_BOX1, EZ_BOX1_VAL, EZ_CHEC_BOX2, EZ_BOX2_VAL, EZ_CHEC_BOX3, EZ_BOX3_VAL, " + //
				"EZ_CHEC_BOX4, EZ_BOX4_VAL, EZ_CHEC_BOX5, EZ_BOX5_VAL, EZ_CHEC_BOX6, EZ_BOX6_VAL, EZ_CHEC_BOX7, EZ_BOX7_VAL, EZ_CHEC_BOX8, EZ_BOX8_VAL, " + //
				"EZ_CHEC_BOX9, EZ_BOX9_VAL, EZ_CHEC_BOX10, EZ_BOX10_VAL, EZ_CHEC_BOX11, EZ_BOX11_VAL, EZ_CHEC_BOX12, EZ_BOX12_VAL, EZ_CHEC_BOX13, " + //
				"EZ_BOX13_VAL, EZ_CHEC_BOX14, EZ_BOX14_VAL, EZ_CHEC_BOX15, EZ_BOX15_VAL, EZ_CHEC_BOX16, EZ_BOX16_VAL, EZ_CHEC_BOX17, EZ_BOX17_VAL, " + //
				"EZ_CHEC_BOX18, EZ_BOX18_VAL, EZ_DATE1_NAME, EZ_DATE1_VALUE, EZ_DATE2_NAME, EZ_DATE2_VALUE, EZ_NUMBR1_NAME, EZ_NUMBR1_VALUE, EZ_NUMBR2_NAME, " + //
				"EZ_NUMBR2_VALUE, EZ_NUMBR3_NAME, EZ_NUMBR3_VALUE, EZ_NUMBR4_NAME, EZ_NUMBR4_VALUE, EZ_TEXT1_NAME, EZ_TEXT1_VALUE, EZ_TEXT2_NAME, " + //
				"EZ_TEXT2_VALUE, EZ_TEXT3_NAME, EZ_TEXT3_VALUE, EZ_TEXT4_NAME, EZ_TEXT4_VALUE, EZ_TEXT5_NAME, EZ_TEXT5_VALUE, EZ_TEXT6_NAME, EZ_TEXT6_VALUE, " + //
				"EZ_TEXT7_NAME, EZ_TEXT7_VALUE, EZ_TEXT8_NAME, EZ_TEXT8_VALUE, EZ_TEXT9_NAME, EZ_TEXT9_VALUE, EZ_TEXT10_NAME, EZ_TEXT10_VALUE " + //
				"FROM BASPEZCAP WHERE");

		Iterator<String> baspezcapIdArrayListIterator = baspezcapIdArrayList.iterator();
		while (baspezcapIdArrayListIterator.hasNext()) {

			String whereClause = baspezcapIdArrayListIterator.next();

			query.append(" (" + whereClause + " )");

			if (baspezcapIdArrayListIterator.hasNext()) {
				query.append(" OR");
			}
		}

		StringBuilder extractBuffer = new StringBuilder();

		List<Map<String, String>> rows = executeStmt(Type.SQL, query.toString());

		for (Map<String, String> row : rows) {
			if (row.get("EZ_BOX1_VAL").equals("Y") || row.get("EZ_BOX1_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX1"), row.get("EZ_BOX1_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX2_VAL").equals("Y") || row.get("EZ_BOX2_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX2"), row.get("EZ_BOX2_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX3_VAL").equals("Y") || row.get("EZ_BOX3_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX3"), row.get("EZ_BOX3_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX4_VAL").equals("Y") || row.get("EZ_BOX4_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX4"), row.get("EZ_BOX4_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX5_VAL").equals("Y") || row.get("EZ_BOX5_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX5"), row.get("EZ_BOX5_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX6_VAL").equals("Y") || row.get("EZ_BOX6_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX6"), row.get("EZ_BOX6_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX7_VAL").equals("Y") || row.get("EZ_BOX7_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX7"), row.get("EZ_BOX7_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX8_VAL").equals("Y") || row.get("EZ_BOX8_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX8"), row.get("EZ_BOX8_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX9_VAL").equals("Y") || row.get("EZ_BOX9_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX9"), row.get("EZ_BOX9_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX10_VAL").equals("Y") || row.get("EZ_BOX10_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX10"), row.get("EZ_BOX10_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX11_VAL").equals("Y") || row.get("EZ_BOX11_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX11"), row.get("EZ_BOX11_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX12_VAL").equals("Y") || row.get("EZ_BOX12_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX12"), row.get("EZ_BOX12_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX13_VAL").equals("Y") || row.get("EZ_BOX13_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX13"), row.get("EZ_BOX13_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX14_VAL").equals("Y") || row.get("EZ_BOX14_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX14"), row.get("EZ_BOX14_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX15_VAL").equals("Y") || row.get("EZ_BOX15_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX15"), row.get("EZ_BOX15_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX16_VAL").equals("Y") || row.get("EZ_BOX16_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX16"), row.get("EZ_BOX16_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX17_VAL").equals("Y") || row.get("EZ_BOX17_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX17"), row.get("EZ_BOX17_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (row.get("EZ_BOX18_VAL").equals("Y") || row.get("EZ_BOX18_VAL").equals("N")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_CHEC_BOX18"), row.get("EZ_BOX18_VAL"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_DATE1_VALUE").equals("0")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_DATE1_NAME"), row.get("EZ_DATE1_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_DATE2_VALUE").equals("0")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_DATE2_NAME"), row.get("EZ_DATE2_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT1_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT1_NAME"), row.get("EZ_TEXT1_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT2_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT2_NAME"), row.get("EZ_TEXT2_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT3_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT3_NAME"), row.get("EZ_TEXT3_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT4_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT4_NAME"), row.get("EZ_TEXT4_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT5_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT5_NAME"), row.get("EZ_TEXT5_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT6_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT6_NAME"), row.get("EZ_TEXT6_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT7_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT7_NAME"), row.get("EZ_TEXT7_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT8_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT8_NAME"), row.get("EZ_TEXT8_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT9_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT9_NAME"), row.get("EZ_TEXT9_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_TEXT10_VALUE").equals("")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_TEXT10_NAME"), row.get("EZ_TEXT10_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_NUMBR1_VALUE").equals("0.00")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_NUMBR1_NAME"), row.get("EZ_NUMBR1_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_NUMBR2_VALUE").equals("0.00")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_NUMBR2_NAME"), row.get("EZ_NUMBR2_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_NUMBR3_VALUE").equals("0.00000")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_NUMBR3_NAME"), row.get("EZ_NUMBR3_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
			if (!row.get("EZ_NUMBR4_VALUE").equals("0.00000")) {
				ExtractRecord extractRecord = new ExtractRecord(getLinePrefix(row, baspezcapIdFields), row.get("EZ_NUMBR4_NAME"), row.get("EZ_NUMBR4_VALUE"));
				extractFileRecordsArrayList.add(extractRecord);
			}
		}

		for (ExtractRecord record : extractFileRecordsArrayList) {

			LineNumberReader lnr = new LineNumberReader(new StringReader(record.getData()));
			String line;
			while ((line = lnr.readLine()) != null) {
				extractBuffer.append(policyKey).append(record.getLinePrefix()).append(String.format("%1$-10s", record.getFieldName())).append(String.format("%05d", lnr.getLineNumber())).append(line).append("\r\n");
			}

		}

		return extractBuffer.toString();
	}

}