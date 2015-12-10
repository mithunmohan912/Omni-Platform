package com.csc.cscip.ux.common.rest.processor.jdbc;

import java.util.List;
import java.util.Map;

import com.csc.cscip.ux.common.rest.processor.AbstractServiceProcessor;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.util.StringUtils;

@SuppressWarnings("unchecked")
public class JDBCProcessor extends AbstractServiceProcessor<JDBCInfo, JDBCResponsePayLoad> {

	@Override
	public String produceRequest(JDBCInfo jdbcInfo, ServiceProcessorCallback callback) throws Throwable {

		if (callback != null) {
			callback.processCallback(new JDBCProcessorCallbackContext(jdbcInfo));
		}

		String sqlStmt = jdbcInfo.getStmt();
		RequestPayLoad payLoad = jdbcInfo.getPayLoad();
		Map<String, List<Map<String, String>>> paramsInfo = jdbcInfo.getParamsInfo();

		sqlStmt = prepareStatement(sqlStmt, paramsInfo, payLoad);

		if (jdbcInfo.getType() == Type.SP) {
			sqlStmt = "call " + sqlStmt;
		}

		return sqlStmt;
	}

	private String prepareStatement(String sqlStmt, Map<String, List<Map<String, String>>> paramsInfo, RequestPayLoad payLoad) {

		int startIndex = 0;
		int endIndex = sqlStmt.indexOf('@');

		if (endIndex == -1) {
			return sqlStmt;
		}

		StringBuilder sqlStmtBuilder = new StringBuilder();

		while (endIndex != -1) {

			// Extract SQL statement
			sqlStmtBuilder.append(sqlStmt.substring(startIndex, endIndex));

			// Extract param from SQL statement
			int paramEndIndex = sqlStmt.indexOf('@', endIndex + 1);
			String prpName = sqlStmt.substring(endIndex + 1, paramEndIndex);

			// Fetch value from data model
			String prpValue = null;

			if (paramsInfo != null) {
				List<Map<String, String>> valueInfoList = paramsInfo.get(prpName);
				if (valueInfoList != null) {
					prpValue = getValue(valueInfoList, payLoad);
				}
			}

			if (prpValue == null) {
				prpValue = (String) payLoad.get(prpName);
			}

			// Replace param with actual data value
			sqlStmtBuilder.append("'" + prpValue + "'");

			startIndex = paramEndIndex + 1;
			endIndex = sqlStmt.indexOf('@', startIndex);
		}

		sqlStmtBuilder.append(sqlStmt.substring(startIndex));

		return sqlStmtBuilder.toString();
	}

	private String getValue(List<Map<String, String>> valueInfoList, RequestPayLoad payLoad) {

		String prpValue = "";

		for (int i = 0; i < valueInfoList.size(); i++) {

			Map<String, String> valueInfo = valueInfoList.get(i);

			prpValue += decorateValue(getValue(valueInfo.get("type"), valueInfo, payLoad), valueInfo);
		}

		return prpValue;
	}

	private String decorateValue(String tempPrpValue, Map<String, String> valueInfo) {

		if (tempPrpValue == null) {
			tempPrpValue = "";
		}

		String filler = valueInfo.get("fill");
		if (filler != null) {
			tempPrpValue = StringUtils.fill(tempPrpValue, filler, Integer.parseInt(valueInfo.get("length")));
		}

		return tempPrpValue;
	}

	protected String getValue(String type, Map<String, String> valueInfo, RequestPayLoad payLoad) {

		String prpValue = null;
		if (type == null) {
			prpValue = (String) payLoad.get(valueInfo.get("name"));
		} else if (type.equals("VALUE")) {
			prpValue = valueInfo.get("value");
		} 
		
		return prpValue;
	}

	@Override
	public Object consumeResponse(String responseXML, JDBCInfo jdbcInfo, JDBCResponsePayLoad jdbcResponsePayLoad, ServiceProcessorCallback callback)
			throws Throwable {

		if (callback != null) {
			callback.processCallback(new JDBCProcessorCallbackContext(jdbcInfo, jdbcResponsePayLoad));
		}

		return getDelegate().consumeResponse(responseXML, jdbcInfo, jdbcResponsePayLoad, getResponseProcessorCallback(jdbcInfo, jdbcResponsePayLoad));

	}
}
