package com.csc.cscip.ux.common.rest.processor.jdbc;

import com.csc.cscip.ux.common.rest.response.ResponsePayLoadCallbackContext;

public class JDBCProcessorCallbackContext extends ResponsePayLoadCallbackContext<JDBCResponsePayLoad> {

	private JDBCInfo jdbcInfo;

	public JDBCProcessorCallbackContext(JDBCInfo jdbcInfo) {
		this(jdbcInfo, null);
	}

	public JDBCProcessorCallbackContext(JDBCInfo jdbcInfo, JDBCResponsePayLoad jdbcResponsePayLoad) {
		super(jdbcResponsePayLoad);
		this.jdbcInfo = jdbcInfo;
	}

	public JDBCInfo getJDBCInfo() {
		return jdbcInfo;
	}

}