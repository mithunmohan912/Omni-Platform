package com.csc.cscip.ux.pointin.rest.processor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.csc.cscip.ux.common.rest.processor.AbstractServiceProcessor;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.util.UXAppConfig;

@SuppressWarnings("unchecked")
public class ActionProcessor extends AbstractServiceProcessor<String, JDBCResponsePayLoad> {

	@Override
	public Object produceRequest(String metadataPayload, ServiceProcessorCallback callback) throws Throwable {
		
		JDBCInfo jdbcInfo = new JDBCInfo();
		jdbcInfo.setType(Type.SP);
		jdbcInfo.setStmt("BASDBIO047('" + metadataPayload + "')");
		
		return getDelegate().produceRequest(jdbcInfo, getRequestProcessorCallback(metadataPayload));
	}

	public Object consumeResponse(String responseXML, String metadataPayload, JDBCResponsePayLoad jdbcResponsePayLoad, ServiceProcessorCallback callback) throws Throwable {

		JDBCInfo jdbcInfo = new JDBCInfo();
		jdbcInfo.setType(Type.SP);
		
		getDelegate().consumeResponse(responseXML, jdbcInfo, jdbcResponsePayLoad, getResponseProcessorCallback(metadataPayload, jdbcResponsePayLoad));

		List<Map<String, String>> rows = jdbcResponsePayLoad.getRows();

		for (Map<String, String> row : rows) {
			Map<String, String> screenInfo = new HashMap<String, String>();
			String screenId = row.get("URL-RCLKURL");
			String reqstCode = row.get("URL-RCLKREQST");
			
			if(screenId.contains("jsp/WcpClassInformationDatePrompt.jsp")){
				screenId="jsp/WC_Class_Information.jsp";
			}
			screenId = screenId.substring(4, screenId.length() - 4);
			screenInfo.put("ScreenId", screenId);
			screenInfo.put("ReqstCode", reqstCode);
			return screenInfo;
		}

		return null;
	}
}
