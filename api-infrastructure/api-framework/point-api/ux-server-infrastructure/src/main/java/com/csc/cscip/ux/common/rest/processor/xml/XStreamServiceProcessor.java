package com.csc.cscip.ux.common.rest.processor.xml;

import com.csc.cscip.ux.common.rest.processor.AbstractServiceProcessor;
import com.csc.cscip.ux.common.util.UXXStreamUtils;
import com.thoughtworks.xstream.XStream;

@SuppressWarnings("unchecked")
public class XStreamServiceProcessor<Rq, Rs> extends AbstractServiceProcessor<Rq, Rs> {

	public static class XStreamProcessorCallbackContext implements XMLProcessorCallbackContext {

		private XStream xStream;

		public XStreamProcessorCallbackContext(XStream xStream) {
			this.xStream = xStream;
		}

		public void overrideTagForClass(String tagName, Class<?> clazz) {
			xStream.alias(tagName, clazz);
		}

		public void overrideTagForField(String tagName, Class<?> clazz, String fieldName) {
			xStream.aliasField(tagName, clazz, fieldName);
		}

		public void overrideClassImpl(String tagName, Class<?> interfaceClazz, Class<?> implClazz) {
			xStream.alias(tagName, interfaceClazz, implClazz);
		}

	}

	public String produceRequest(Rq requestPayLoad, ServiceProcessorCallback callback) throws Throwable {

		XStream xStream = UXXStreamUtils.getXStream();

		if (callback != null) {
			callback.processCallback(new XStreamProcessorCallbackContext(xStream));
		}

		String requestXML = xStream.toXML(requestPayLoad);
		return requestXML;
	}

	public Object consumeResponse(String responseXML, Rq requestPayLoad, Rs responsePayLoad, ServiceProcessorCallback callback) throws Throwable {

		XStream xStream = UXXStreamUtils.getXStream();

		if (callback != null) {
			callback.processCallback(new XStreamProcessorCallbackContext(xStream));
		}

		responsePayLoad = (Rs) xStream.fromXML(responseXML, responsePayLoad);
		return responsePayLoad;
	}

}
