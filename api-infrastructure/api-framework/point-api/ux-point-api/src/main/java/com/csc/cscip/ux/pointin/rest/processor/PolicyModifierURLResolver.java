package com.csc.cscip.ux.pointin.rest.processor;

import com.csc.cscip.ux.common.rest.processor.AbstractServiceProcessor;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.pointin.util.PolicyModifierConfig;

public class PolicyModifierURLResolver extends AbstractServiceProcessor<RequestPayLoad, ResponsePayLoad> {

	@Override
	public Object produceRequest(RequestPayLoad requestPayLoad, com.csc.cscip.ux.common.rest.processor.ServiceProcessor.ServiceProcessorCallback callback) throws Throwable {
		String param = (String) requestPayLoad.get("param");
		String url = PolicyModifierConfig.getProperty(param);
		return url;
	}

	@Override
	public Object consumeResponse(String responseData, RequestPayLoad requestPayLoad, ResponsePayLoad responsePayLoad, com.csc.cscip.ux.common.rest.processor.ServiceProcessor.ServiceProcessorCallback callback) throws Throwable {
		// TODO Auto-generated method stub
		return null;
	}

}
