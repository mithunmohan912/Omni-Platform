package com.csc.cscip.ux.common.rest.processor;

public interface ServiceProcessor<Rq, Rs> {

	public interface ServiceProcessorCallback {

		public interface ServiceProcessorCallbackContext {
		}

		void processCallback(ServiceProcessorCallbackContext context);
	}

	ServiceProcessorCallback getRequestProcessorCallback(Rq requestPayLoad);

	Object produceRequest(Rq requestPayLoad, ServiceProcessorCallback callback) throws Throwable;

	ServiceProcessorCallback getResponseProcessorCallback(Rq requestPayLoad, Rs responsePayLoad);

	Object consumeResponse(String responseData, Rq requestPayLoad, Rs responsePayLoad, ServiceProcessorCallback callback) throws Throwable;

}
