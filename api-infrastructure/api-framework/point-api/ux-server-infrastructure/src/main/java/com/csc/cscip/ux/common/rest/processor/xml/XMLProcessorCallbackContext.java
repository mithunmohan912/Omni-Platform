package com.csc.cscip.ux.common.rest.processor.xml;

import com.csc.cscip.ux.common.rest.processor.ServiceProcessor.ServiceProcessorCallback.ServiceProcessorCallbackContext;

public interface XMLProcessorCallbackContext extends ServiceProcessorCallbackContext {

	void overrideTagForClass(String tagName, Class<?> clazz);

	void overrideTagForField(String tagName, Class<?> clazz, String fieldName);

	void overrideClassImpl(String tagName, Class<?> interfaceClazz, Class<?> implClazz);

}