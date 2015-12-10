package com.csc.cscip.ux.common.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.csc.cscip.ux.common.integration.IntegrationService;
import com.csc.cscip.ux.common.rest.exception.RestException;
import com.csc.cscip.ux.common.rest.processor.ServiceProcessor;
import com.csc.cscip.ux.common.rest.processor.ServiceProcessorFactory;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;
import com.csc.cscip.ux.common.util.CommonConstants;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXJacksonUtils;

@SuppressWarnings(value = { "unchecked", "rawtypes" })
public abstract class AbstractRestController {

	public static IntegrationService getIntegrationService() {
		return ApplicationContextProvider.getApplicationContext().getBean(IntegrationService.class);
	}

	protected static ServiceProcessorFactory getServiceProcessorFactory() {
		return ApplicationContextProvider.getApplicationContext().getBean(ServiceProcessorFactory.class);
	}

	@ExceptionHandler(Throwable.class)
	public static void handleException(Throwable exception, HttpServletResponse httpServletResponse) throws Throwable {
		handleException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, exception, httpServletResponse);
	}

	protected static void handleException(int sc, Throwable exception, HttpServletResponse httpServletResponse) throws IOException, Throwable {
		httpServletResponse.setStatus(sc);
		setExceptionTrace(exception, httpServletResponse);
		httpServletResponse.getOutputStream().flush();
	}

	protected static void setExceptionTrace(Throwable exception, HttpServletResponse httpServletResponse) throws IOException, Throwable {
		Map<String, String> exceptionMap = new HashMap<String, String>();

		String defaultMessage = "An Exception has occurred. Please contact your System Administrator.";
		if (exception instanceof RestException) {
			defaultMessage = defaultMessage + exception.getMessage();
		} else {
			defaultMessage = exception.getMessage();
		}
		exceptionMap.put("message", defaultMessage);
		exceptionMap.put("stackTrace", ExceptionUtils.getFullStackTrace(exception));

		httpServletResponse.setContentType(CommonConstants.JSON_CONTENT_TYPE);
		httpServletResponse.getOutputStream().write(("{\"exception\" : " + UXJacksonUtils.convertToJSON(exceptionMap) + "}").getBytes());
	}

	protected static Object sendServiceRequest(String requestType, String resource, Object requestPayLoad, Object responsePayLoad) throws Throwable {

		ServiceProcessor serviceProcessor = getServiceProcessorFactory().lookupServiceProcessor(requestType);
		Object requestData = serviceProcessor.produceRequest(requestPayLoad, null);

		String responseData = getIntegrationService().send("direct:" + resource, null, requestData, String.class).replace((char) 0, ' ');

		Object responsePayLoadObj = serviceProcessor.consumeResponse(responseData, requestPayLoad, responsePayLoad, null);
		return responsePayLoadObj;
	}

	protected static Object recieveServiceResponse(String requestType, String resource, Object requestPayLoad, Object responsePayLoad) throws Throwable {

		String responseData = getIntegrationService().receive("direct:" + resource, String.class);

		ServiceProcessor serviceProcessor = getServiceProcessorFactory().lookupServiceProcessor(requestType);
		Object responsePayLoadObj = serviceProcessor.consumeResponse(responseData, requestPayLoad, responsePayLoad, null);
		return responsePayLoadObj;
	}

	protected static RequestPayLoad parseRequest(HttpServletRequest request) throws IOException, Throwable {
		return (RequestPayLoad) parseRequest(request, RequestPayLoad.class);
	}

	protected static <T extends Map> T parseRequest(HttpServletRequest request, Class<T> payLoadClass) throws IOException, Throwable {
		String requestJSON = IOUtils.readContent(request.getInputStream());
		T payLoad = (T) UXJacksonUtils.convertFromJSON(requestJSON, payLoadClass);
		payLoad.put("sessionKey", request.getHeader("Authentication"));
		return payLoad;
	}

	protected static Object processRequest(Object RestRequest, String requestType, String resource, HttpServletResponse response, Object responsePayload)
			throws IOException, Throwable {

		Object responsePayLoadObj = sendServiceRequest(requestType, resource, RestRequest, responsePayload);

		if (responsePayLoadObj instanceof String) {
			String responseJSON = (String) responsePayLoadObj;
			if (responseJSON.contains("{\"exception\":")) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
			return responseJSON;
		} else {
			return (ResponsePayLoad) responsePayLoadObj;
		}

	}

	protected List<Map<String, String>> executeStmt(Type type, String query) throws Throwable {
		return executeStmt(type, query, new RequestPayLoad());
	}

	protected List<Map<String, String>> executeStmt(Type type, String query, RequestPayLoad payLoad) throws Throwable {

		JDBCInfo jdbcInfo = new JDBCInfo();
		jdbcInfo.setType(type);
		jdbcInfo.setStmt(query);
		jdbcInfo.setPayLoad(payLoad);
		JDBCResponsePayLoad result = (JDBCResponsePayLoad) sendServiceRequest(UXAppConfig.JDBC, "service", jdbcInfo, new JDBCResponsePayLoad());

		List<Map<String, String>> rows = result.getRows();
		return rows;
	}

}
