package com.csc.ux.canvas.service.processor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProcessorServiceFactory {

	@Autowired
	private SQLProcessorService sqlProcessorService;

	@Autowired
	private SQLXMLProcessorService sqlXMLProcessorService;

	public ProcessorService getProcessorService(String serviceName) {
		if (serviceName == null) {
			return null;
		}
		if (serviceName.equalsIgnoreCase(ProcessorService.PROCESSOR_TYPE_JDBC)) {
			return sqlProcessorService;
		} else if (serviceName.equalsIgnoreCase(ProcessorService.PROCESSOR_TYPE_ENDPOINT)) {
			return sqlXMLProcessorService;
		}
		throw new RuntimeException("Invalid Processor Service Name provided.");
	}
}

