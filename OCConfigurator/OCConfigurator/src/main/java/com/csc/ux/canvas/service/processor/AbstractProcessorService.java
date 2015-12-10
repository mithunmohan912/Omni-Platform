package com.csc.ux.canvas.service.processor;

import java.util.Map;

public abstract class AbstractProcessorService implements ProcessorService {
	@Override
	public String produceRequest(String sqlQuery, Map<?, ?> params) {
		StringBuilder sqlStmtBuilder = new StringBuilder();
		int startIndex = 0;
		int endIndex = sqlQuery.indexOf('@');
		if (endIndex != -1) {
			while (endIndex != -1) {
				// Extract SQL statement
				sqlStmtBuilder.append(sqlQuery.substring(startIndex, endIndex)).append("'");

				// Extract parameters from SQL statement
				int paramEndIndex = sqlQuery.indexOf('@', endIndex + 1);
				String prpName = sqlQuery.substring(endIndex + 1, paramEndIndex);

				// Fetch value from Map of parameters
				String prpValue = (String) params.get(prpName);

				// Replace parameter with actual data value
				sqlStmtBuilder.append(prpValue).append("'");

				startIndex = paramEndIndex + 1;
				endIndex = sqlQuery.indexOf('@', startIndex);
			}
		} else {
			sqlStmtBuilder.append(sqlQuery);
		}
		return sqlStmtBuilder.toString();
	}
}
