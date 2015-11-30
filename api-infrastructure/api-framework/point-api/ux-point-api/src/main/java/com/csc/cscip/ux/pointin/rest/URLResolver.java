package com.csc.cscip.ux.pointin.rest;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.rest.AbstractRestController;
import com.csc.cscip.ux.common.rest.processor.ServiceProcessor;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXJacksonUtils;

@Controller
@SuppressWarnings(value = { "unchecked", "rawtypes" })
public class URLResolver extends AbstractRestController {

	@RequestMapping(value = "/resolveurl", method = RequestMethod.POST)
	public @ResponseBody
	String getSupportData(HttpServletRequest request) throws Throwable {

		String requestJSON = IOUtils.readContent(request.getInputStream());

		// Transform Request JSON to Request Object
		RequestPayLoad requestPayLoad = UXJacksonUtils.convertFromJSON(requestJSON, RequestPayLoad.class);

		String requestType = (String) requestPayLoad.get("request");

		ServiceProcessor serviceProcessor = getServiceProcessorFactory().lookupServiceProcessor(requestType);

		String url = (String) serviceProcessor.produceRequest(requestPayLoad, null);

		ResponsePayLoad responsePayLoad = new ResponsePayLoad();
		responsePayLoad.put("url", url);

		// Convert Response PayLoad to JSON format
		String responseJSON = UXJacksonUtils.convertToJSON(responsePayLoad);
		return responseJSON;
	}

}
