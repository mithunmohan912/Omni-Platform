package com.csc.cscip.ux.common.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface DataAccessObject {

	interface ResultSetProcessor {

		Object processResultSet(ResultSet rs) throws SQLException;

	}

	@SuppressWarnings("serial")
	class Filter extends HashMap<String, Object> {

		public Filter(String column, Object value) {
			put(column, value);
		}

		public Filter and(String column, Object value) {
			put(column, value);
			return this;
		}

	}

	class Join {

		private String tableName;

		private String srcColumn;

		private String trgColumn;

		public Join(String tableName, String srcColumn, String trgColumn) {

			this.tableName = tableName;

			this.srcColumn = srcColumn;

			this.trgColumn = trgColumn;
		}

		public String getTableName() {
			return tableName;
		}

		public String getSourceColumn() {
			return srcColumn;
		}

		public String getTargetColumn() {
			return trgColumn;
		}
	}

	String getTableName();

	Object select(String column, Filter filter);

	Object[] select(String[] columns, Filter filter);

	List<Object> selectAll(String column, Filter filter);

	List<Object[]> selectAll(String[] columns, Filter filter);

	List<Object[]> selectAll(String[] columns, Join[] joins, Filter filter);

	Map<Object, Object> select(String keyColumn, String valueColumn, Filter filters);

	Map<String, Object> selectRow(Filter filters);

	List<Map<Object, Object>> selectAllRows(Filter filters);

	Object select(String[] columns, Filter filter, ResultSetProcessor rs, String[] orderByGroup);

	Object select(String[] columns, Join[] joins, Filter filter, ResultSetProcessor rs, String[] orderByGroup);

}
