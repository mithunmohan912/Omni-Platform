package com.csc.cscip.ux.pointin.rest;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.URIResolver;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.csc.cscip.ux.common.rest.AbstractRestController;
import com.csc.cscip.ux.common.rest.processor.ServiceProcessor;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.security.securityengine.ACLJSONManipulator;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXJacksonUtils;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;
import java.text.SimpleDateFormat;
import java.util.Date;
import com.csc.cscip.ux.common.util.Utility;
import com.csc.cscip.ux.pointin.util.SurroundProductConfig;

@Controller
@SuppressWarnings("unchecked")
public class ReportController extends AbstractRestController {

	@RequestMapping(value = "/metadata/report", method = RequestMethod.POST)
	public @ResponseBody
	String getMetaData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		RequestPayLoad RestRequest = parseRequest(request);
		String subsystem = (String) RestRequest.get("subsystem");
		String report = (String) RestRequest.get("report");

		String metaModel = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_TYPE), UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_URI), "report.prt.json", "");

		Map<String, Object> map = (Map<String, Object>) UXJacksonUtils.convertFromJSON(metaModel, Map.class).get(subsystem);

		ResponsePayLoad responsePayLoad = new ResponsePayLoad();
		responsePayLoad.put("elements", map.get(report));
		return UXJacksonUtils.convertToJSON(responsePayLoad);

	}

	@RequestMapping(value = "/data/support/report/{name}", method = RequestMethod.POST)
	public @ResponseBody
	Object getSupportData(@PathVariable String name, HttpServletRequest request) throws Throwable {

		ResponsePayLoad responsePayLoad = new ResponsePayLoad();

		String metaModel = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_TYPE), UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_URI), "report.prt.json", "");

		if (name.equals("all")) {
			Set<String> set = (Set<String>) UXJacksonUtils.convertFromJSON(metaModel, Map.class).keySet();
			responsePayLoad.put("elements", set);
		} else {
			Map<String, String> map = (Map<String, String>) UXJacksonUtils.convertFromJSON(metaModel, Map.class).get(name);
			Set<String> set = map.keySet();
			responsePayLoad.put("elements", set);
		}

		return UXJacksonUtils.convertToJSON(responsePayLoad);

	}

	@RequestMapping(value = "/data/report", method = RequestMethod.POST)
	public @ResponseBody
	String getSupportData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		RequestPayLoad requestPayLoad = parseRequest(request);
		String subsystem = (String) requestPayLoad.get("subsystem");
		String report = (String) requestPayLoad.get("report");

		String metaModel = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_TYPE), UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_URI), "report.prt_data.json", "");

		Map<String, Object> map = (Map<String, Object>) UXJacksonUtils.convertFromJSON(metaModel, Map.class).get(subsystem);

		ResponsePayLoad responsePayLoad = new ResponsePayLoad();
		responsePayLoad.put("elements", map.get(report));
		return UXJacksonUtils.convertToJSON(responsePayLoad);
	}

	@RequestMapping(value = "/data/report/save", method = RequestMethod.POST)
	public @ResponseBody
	String getData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		RequestPayLoad RestRequest = parseRequest(request);

		String screenId = (String) RestRequest.get("screenId");
		if (RestRequest.get("method") == null) {
			ACLJSONManipulator.secureData(RestRequest, screenId, true);
		}

		ServiceProcessor reqProcessor = getServiceProcessorFactory().lookupServiceProcessor(UXAppConfig.getProperty(UXAppConfig.APPLICATION));
		Object requestData = reqProcessor.produceRequest(RestRequest, null);

		String responseData = getIntegrationService().send("direct:" + "report", null, requestData, String.class).replace((char) 0, ' ');

		ServiceProcessor resProcessor = getServiceProcessorFactory().lookupServiceProcessor(UXAppConfig.GRID);
		JDBCInfo jdbcInfo = new JDBCInfo();
		jdbcInfo.setType(Type.SP);
		Object responsePayLoadObj = (JDBCResponsePayLoad) resProcessor.consumeResponse(responseData, jdbcInfo, new JDBCResponsePayLoad(), null);

		if (responsePayLoadObj instanceof String) {
			return (String) responsePayLoadObj;
		} else {
			List<Map<String, String>> rows = ((JDBCResponsePayLoad) responsePayLoadObj).getRows();

			return UXJacksonUtils.convertToJSON(responsePayLoadObj);
		}
	}

	@RequestMapping(value = "/data/report/download/{fileName}/{user}/{date}", method = RequestMethod.GET)
	public void downloadReport(@PathVariable("fileName") String fileName, @PathVariable("user") String user, @PathVariable("date") String date, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		RequestPayLoad restRequest = new RequestPayLoad();
		restRequest.put("filename", fileName);
		restRequest.put("spoolFileSearchUser", user);
		restRequest.put("spoolFileCreateDate", date);
		restRequest.put("spoolFileCreateTime", date);
		restRequest.put("REQUESTCODE", "P4JPRNTFINQRq");
		restRequest.put("User", user);

		ServiceProcessor serviceProcessor = getServiceProcessorFactory().lookupServiceProcessor(UXAppConfig.getProperty(UXAppConfig.APPLICATION));
		Object requestData = serviceProcessor.produceRequest(restRequest, null);

		String responseData = getIntegrationService().send("direct:" + "reportdownload", null, requestData, String.class).replace((char) 0, ' ');
		Source xmlSource = new StreamSource(new StringReader(responseData));

		String extractedxslName = fileName.substring(0, fileName.indexOf('_')) + ".dds.xml.xsl";

		String xsltFile = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_TYPE), UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_URI), extractedxslName, "pt4jxsl");
		if (xsltFile == null) {
			xsltFile = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_TYPE), UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_URI), "GENERIC.dds.xml.xsl", "pt4jxsl");
		}
		
		Source xsltSource = new StreamSource(new StringReader(xsltFile));

		TransformerFactory factory = TransformerFactory.newInstance();

		factory.setURIResolver(new URIResolver() {

			@Override
			public Source resolve(String href, String base) throws TransformerException {
				try {
					//return new StreamSource(IOUtils.getResourceAsStream(href));
					return new StreamSource(new StringReader(UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_TYPE), UXAppConfig.getProperty(UXAppConfig.REPORT_METADATA_REPOSITORY_URI), href, "pt4jxsl")));
				} catch (Exception e) {
					throw new TransformerException(e);
				}
			}

		});

		Transformer transformer = factory.newTransformer(xsltSource);
		String tmpDir = (String) ApplicationContextProvider.getApplicationContext().getBean(ServletContext.class).getAttribute("javax.servlet.context.tempdir").toString();

		int fNo = 0;
		File f  = new File(tmpDir + File.separator+fileName+"_TEMP"+fNo);
		while(f.exists()){
			f  = new File(tmpDir + File.separator+fileName+"_TEMP"+ ++fNo);
		}
		FileOutputStream tempFile = new FileOutputStream(f);
		Result res = new StreamResult(tempFile);
		transformer.transform(xmlSource, res);
		tempFile.flush();
		tempFile.close();
		
		FileReader fr = new FileReader(f);
		BufferedReader br = new BufferedReader(fr);
		FileWriter fw = new FileWriter(tmpDir + File.separator+fileName+"_TEMP2"+ fNo);
		BufferedWriter bw = new BufferedWriter(fw);
		
		String s;
		outer:
		while((s = br.readLine()) != null){
			bw.append(s);
			bw.newLine();
			for(int i = 1; i<=10000;i++){
				if((s = br.readLine()) != null){
					bw.append(s);
					bw.newLine();
				}else{
					break outer;
				}
			}
			while((s = br.readLine()) != null){
				bw.append(s);
				bw.newLine();
				if(s.contains("</fo:block>")){
					bw.append("</fo:flow></fo:page-sequence>");
					bw.newLine();
					bw.append("<fo:page-sequence master-reference=\"LandscapeReport\"><fo:flow flow-name=\"xsl-region-body\">");
					bw.newLine();
					break;
				}
			}
		}
		br.close();
		bw.flush();
		bw.close();
		f.delete();
		
		File f2  = new File(tmpDir + File.separator+fileName+"_TEMP2"+ fNo);
		FileReader fr2 = new FileReader(f2);
		Object finalresponseData = getIntegrationService().send("direct:" + "reportTopdf", null, new FileInputStream(f2));
		
		//ByteArrayOutputStream finalresponseData = (ByteArrayOutputStream) getIntegrationService().send("direct:" + "reportTopdf", null, new ByteArrayInputStream(bout1.toByteArray()));
		((ByteArrayOutputStream)finalresponseData).writeTo(response.getOutputStream());

		response.setContentType("application/pdf");
		response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".pdf");
		response.getOutputStream().flush();

		response.getOutputStream().close();
		fr2.close();
		f2.delete();

	}

	private static Object processRequest(RequestPayLoad RestRequest, String requestType, String resource, HttpServletResponse response) throws IOException, Throwable {
		return processRequest(RestRequest, requestType, resource, response, new ResponsePayLoad());
	}
	
	@RequestMapping(value = "/data/genWorksheet/{userId}", method = RequestMethod.GET)
	public @ResponseBody
	void downloadWorksheet(HttpServletRequest request, HttpServletResponse response,@PathVariable String userId) throws Throwable {
		String folderLoc=SurroundProductConfig.getProperty("MainPrintFolder")+ "\\" + userId;
		String sourceFile = Utility.myListFiles(folderLoc);
		File file  = new File(folderLoc+"\\"+sourceFile);
		SimpleDateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm:ss");
		Date fileCreated = new Date(file.lastModified());
		//String dateFormat = df.format(fileCreated);
		String fileCreationDate = df.format(fileCreated).substring(0,8);
		ReportController reportController = new ReportController();
		reportController.downloadReport(sourceFile, userId, fileCreationDate, request, response);
	}
	
}
