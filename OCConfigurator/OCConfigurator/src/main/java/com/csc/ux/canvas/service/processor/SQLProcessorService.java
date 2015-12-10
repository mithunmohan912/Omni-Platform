package com.csc.ux.canvas.service.processor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.csc.cscip.ux.common.integration.IntegrationService;
import com.csc.cscip.ux.common.util.ConversionUtil;

@Service
public class SQLProcessorService extends AbstractProcessorService {
	@Override
	public String produceRequest(String sqlQuery, Map<?, ?> params) {
		return super.produceRequest(sqlQuery, params);
	}

	@Override
	public String processRequest(IntegrationService integrationService, String requestStr) throws Exception {
		return consumeResponse(integrationService.send("direct:jdbcdata", null, requestStr, List.class));
	}

	@SuppressWarnings("unchecked")
	@Override
	public String consumeResponse(Object responseStr) throws Exception {
		return ConversionUtil.convertListOfMaptoJSONArray((List<HashMap<?, ?>>) responseStr, "Row");
	}
}
