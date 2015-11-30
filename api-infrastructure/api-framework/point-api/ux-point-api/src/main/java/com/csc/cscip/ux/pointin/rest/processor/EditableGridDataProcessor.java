package com.csc.cscip.ux.pointin.rest.processor;

import java.util.LinkedHashMap;
import java.util.Map;

import com.csc.cscip.ux.common.rest.processor.xml.XMLProcessorCallbackContext;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.util.ConversionUtil;

@SuppressWarnings("unchecked")
public class EditableGridDataProcessor extends DataProcessor {
	
	private ServiceProcessorCallback requestCallback = new ServiceProcessorCallback() {

		@Override
		public void processCallback(ServiceProcessorCallbackContext context) {
			XMLProcessorCallbackContext xmlContext = (XMLProcessorCallbackContext) context;
			xmlContext.overrideTagForClass("PayLoad", Map.class);
			xmlContext.overrideClassImpl("PayLoad", Map.class, LinkedHashMap.class);
		}
	};

	@Override
	public ServiceProcessorCallback getRequestProcessorCallback(Map requestPayLoad) {
		return requestCallback;
	}

	@Override
	public Object produceRequest(Map requestPayLoad, ServiceProcessorCallback callback) throws Throwable {
		return getDelegate().produceRequest(requestPayLoad, getRequestProcessorCallback(requestPayLoad));
	}

	private ServiceProcessorCallback responseCallback = new ServiceProcessorCallback() {

		@Override
		public void processCallback(ServiceProcessorCallbackContext context) {
			XMLProcessorCallbackContext xmlContext = (XMLProcessorCallbackContext) context;
			xmlContext.overrideTagForClass("POINTXML", ResponsePayLoad.class);
		}
	};

	@Override
	public ServiceProcessorCallback getResponseProcessorCallback(Map requestPayLoad, Map responsePayLoad) {
		return responseCallback;
	}

	@Override
	public Object consumeResponse(String responseXML, Map requestPayLoad, Map responsePayLoad, ServiceProcessorCallback callback) throws Throwable {

		if (responseXML.contains("<exception>")) {
			String responseJSON = ConversionUtil.convertXMLtoJSON(responseXML);
			return responseJSON;
		}

		launderPayLoad(requestPayLoad, responsePayLoad);

		return getDelegate().consumeResponse(responseXML, requestPayLoad, responsePayLoad, getResponseProcessorCallback(requestPayLoad, responsePayLoad));
	}

	private void launderPayLoad(Map requestPayLoad, Map responsePayLoad) {
		
		if (requestPayLoad.get("target") != null) {
			responsePayLoad.put("target", requestPayLoad.get("target"));
		}
		if (requestPayLoad.get("REQUESTCODE") != null) {
			responsePayLoad.put("REQUESTCODE", requestPayLoad.get("REQUESTCODE"));
		}
		if (requestPayLoad.get("TMPREQUESTCODE") != null) {
			responsePayLoad.put("REQUESTCODE", requestPayLoad.get("TMPREQUESTCODE"));
		}
		if (requestPayLoad.get("KEY") != null) {
			String fullKey = (String) requestPayLoad.get("KEY");
			if (fullKey.substring(0, 1).equals("\"")) {
				fullKey = fullKey.substring(1, fullKey.length() - 1);
			}
			responsePayLoad.put("fullkey", fullKey);
		}
	}
}
