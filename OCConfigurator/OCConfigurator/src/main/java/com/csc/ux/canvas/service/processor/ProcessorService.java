package com.csc.ux.canvas.service.processor;

import java.util.Map;
import com.csc.cscip.ux.common.integration.IntegrationService;

public interface ProcessorService {
	public static final String PROCESSOR_TYPE_JDBC = "jdbc";
	public static final String PROCESSOR_TYPE_ENDPOINT = "endpoint";

	public String produceRequest(String requestStr, Map<?, ?> params);

	public String processRequest(IntegrationService integrationService, String requestStr) throws Exception;

	public String consumeResponse(Object responseStr) throws Exception;
}
