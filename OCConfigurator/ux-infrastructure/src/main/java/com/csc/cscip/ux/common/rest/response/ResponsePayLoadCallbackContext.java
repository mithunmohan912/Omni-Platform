package com.csc.cscip.ux.common.rest.response;

import com.csc.cscip.ux.common.rest.processor.ServiceProcessor.ServiceProcessorCallback.ServiceProcessorCallbackContext;

public class ResponsePayLoadCallbackContext<Rs> implements ServiceProcessorCallbackContext {

	private Rs responsePayLoad;

	public ResponsePayLoadCallbackContext(Rs responsePayLoad) {
		this.responsePayLoad = responsePayLoad;
	}

	public Rs getResponsePayLoad() {
		return responsePayLoad;
	}

}