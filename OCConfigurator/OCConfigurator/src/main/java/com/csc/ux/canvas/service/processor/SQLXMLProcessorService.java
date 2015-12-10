package com.csc.ux.canvas.service.processor;

import java.util.Map;
import org.springframework.stereotype.Service;
import com.csc.cscip.ux.common.integration.IntegrationService;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.JSONCustomParser;

@Service
public class SQLXMLProcessorService extends AbstractProcessorService {
	@Override
	public String produceRequest(String sqlQuery, Map<?, ?> params) {
		return "<PT4JPROC><SQLStmt>" + super.produceRequest(sqlQuery, params) + "</SQLStmt></PT4JPROC>";
	}

	@Override
	public String processRequest(IntegrationService integrationService, String requestStr) throws Exception {
		return consumeResponse(integrationService.send("direct:data", null, requestStr, String.class));
	}

	@Override
	public String consumeResponse(Object responseStr) throws Exception {
		String responseJSON = ConversionUtil.convertXMLtoJSON((String) responseStr);
		JSONCustomParser jsonParser = new JSONCustomParser(responseJSON);
		Object resultSet = jsonParser.parseForData("Rows", true).get(0);
		return resultSet.toString();
	}
}
