package com.csc.cscip.ux.common.rest.processor.jdbc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;

public class JDBCResponsePayLoad {

	private ResponsePayLoad payLoad = new ResponsePayLoad();

	private List<Map<String, String>> rows = new ArrayList<Map<String, String>>(0);

	public ResponsePayLoad getPayLoad() {
		return payLoad;
	}

	public List<Map<String, String>> getRows() {
		return rows;
	}

	public void setRows(List<Map<String, String>> rows) {
		this.rows = rows;
	}

}
