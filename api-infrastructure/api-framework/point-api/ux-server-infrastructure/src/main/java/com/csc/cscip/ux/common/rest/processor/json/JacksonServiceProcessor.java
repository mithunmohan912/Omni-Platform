package com.csc.cscip.ux.common.rest.processor.json;

import org.codehaus.jackson.map.ObjectMapper;

import com.csc.cscip.ux.common.rest.processor.AbstractServiceProcessor;
import com.csc.cscip.ux.common.rest.processor.ServiceProcessor;

public class JacksonServiceProcessor<Rq, Rs> extends AbstractServiceProcessor<Rq, Rs> implements ServiceProcessor<Rq, Rs> {

	public static class JacksonProcessorCallbackContext implements JSONProcessorCallbackContext {

		@SuppressWarnings("unused")
		private ObjectMapper objectMapper;

		public JacksonProcessorCallbackContext(ObjectMapper objectMapper) {
			this.objectMapper = objectMapper;
		}

	}

	@Override
	public Object produceRequest(Rq requestPayLoad, ServiceProcessorCallback callback) throws Throwable {
		throw new UnsupportedOperationException();
	}

	@Override
	public Object consumeResponse(String responseXML, Rq requestPayLoad, Rs responsePayLoad, ServiceProcessorCallback callback) throws Throwable {
		throw new UnsupportedOperationException();
	}

}
