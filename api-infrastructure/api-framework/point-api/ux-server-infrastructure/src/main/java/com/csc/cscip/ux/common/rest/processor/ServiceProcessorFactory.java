package com.csc.cscip.ux.common.rest.processor;

import java.util.HashMap;
import java.util.Map;

public class ServiceProcessorFactory {

	private Map<String, ServiceProcessor<?, ?>> serviceProcessorRegistry = new HashMap<String, ServiceProcessor<?, ?>>();

	public void setServiceProcessorRegistry(Map<String, ServiceProcessor<?, ?>> serviceProcessorRegistry) {
		this.serviceProcessorRegistry = serviceProcessorRegistry;
	}

	public ServiceProcessor<?, ?> lookupServiceProcessor(String serviceType) {
		return serviceProcessorRegistry.get(serviceType);
	}

}
