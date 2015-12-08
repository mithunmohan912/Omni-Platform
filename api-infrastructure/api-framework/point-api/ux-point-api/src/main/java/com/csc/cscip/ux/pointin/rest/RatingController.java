package com.csc.cscip.ux.pointin.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.rest.AbstractRestController;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.security.securityengine.ACLJSONManipulator;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXJacksonUtils;
import com.csc.cscip.ux.pointin.rest.processor.UnderwritingProcessor;

@Controller
public class RatingController extends AbstractRestController {
	
	@RequestMapping(value = "/data/rating", method = RequestMethod.POST)
	public @ResponseBody
	String getData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		RequestPayLoad requestPayLoad = parseRequest(request);
		ResponsePayLoad firstUwResp = null, uwResp = null;
		RequestPayLoad uwRqst = null;
		UnderwritingProcessor uwProc = new UnderwritingProcessor();
		
		String screenId = (String) requestPayLoad.get("screenId");
		if (requestPayLoad.get("method") == null) {
			ACLJSONManipulator.secureData(requestPayLoad, screenId, true);
		}
		
		if(uwProc.isUWReq(requestPayLoad)){
			//Produce first request on the basis of first event
			uwRqst = uwProc.produceFirstEvent(requestPayLoad);
			firstUwResp = (ResponsePayLoad) sendServiceRequest(UXAppConfig.getProperty(UXAppConfig.APPLICATION), "UnderWriterCall", uwRqst, new ResponsePayLoad());
			uwProc.publishUwComponent(uwRqst, firstUwResp, "Pre");
			if(uwProc.ratingCallReqd(firstUwResp, "Pre")){
				uwRqst = uwProc.produceUwEvent(firstUwResp, requestPayLoad, "Pre");
				uwResp = (ResponsePayLoad) sendServiceRequest(UXAppConfig.getProperty(UXAppConfig.APPLICATION), "UnderWriterCall", uwRqst, new ResponsePayLoad());
				uwProc.publishUwComponent(uwRqst, uwResp, "Pre");
				uwProc.mergeUWResponse(uwResp,requestPayLoad, "Pre");
			}else{
				uwProc.mergeUWResponse(firstUwResp,requestPayLoad, "Pre");
			}
		}
		String status =firstUwResp==null?"":(String)firstUwResp.get("MsgStatusCd"); 
		String ErrorType = null;
		int ErrorCount = 0;
		if("SuccessWithInfo".equals(status)){
			RequestPayLoad tempRequestPayLoad=new RequestPayLoad();
			ResponsePayLoad tempResponsePayLoad=new ResponsePayLoad();
			tempRequestPayLoad.putAll(firstUwResp);
			tempRequestPayLoad.put("REQUESTCODE", "SMARTERRORADDRq");
			DataController.processRequest(tempRequestPayLoad, UXAppConfig.getProperty(UXAppConfig.APPLICATION), "data", response,tempResponsePayLoad);
			ErrorCount =Integer.parseInt((String)firstUwResp.get("ErrorCount"));
			for(int i=1; i<=ErrorCount;i++){
				ErrorType = (String)firstUwResp.get("Type" + i);
				if("Error".equals(ErrorType)){
					return UXJacksonUtils.convertToJSON(firstUwResp);
				}
			}
			
		}

		Object uxRestResponseObj = processRequest(requestPayLoad, UXAppConfig.getProperty(UXAppConfig.APPLICATION), "data", response, new ResponsePayLoad());

		if(firstUwResp != null && uwProc.ratingCallReqd(firstUwResp, "Post")){
			uwRqst = uwProc.produceUwEvent(firstUwResp, requestPayLoad, "Post");
			uwResp = (ResponsePayLoad) sendServiceRequest(UXAppConfig.getProperty(UXAppConfig.APPLICATION), "UnderWriterCall", uwRqst, new ResponsePayLoad());
			
			uwProc.publishUwComponent(uwRqst, uwResp, "Post");
			if(uwProc.isNotWaived()){
				uwProc.mergeUWResponse(uwResp,requestPayLoad, "Post");
				uxRestResponseObj = processRequest(requestPayLoad, UXAppConfig.getProperty(UXAppConfig.APPLICATION), "data", response, new ResponsePayLoad());
			}
		}
		
		if (uxRestResponseObj instanceof String) {
			return (String) uxRestResponseObj;
		}

		ResponsePayLoad responsePayLoad = (ResponsePayLoad) uxRestResponseObj;
		if (requestPayLoad.get("method") != null && requestPayLoad.get("method").equals("GET")) {
			ACLJSONManipulator.secureData(responsePayLoad, screenId, false);
		}
		
		if("SuccessWithInfo".equals(status)){
			responsePayLoad.putAll(firstUwResp);
		}
		return UXJacksonUtils.convertToJSON(responsePayLoad);
	}
}
