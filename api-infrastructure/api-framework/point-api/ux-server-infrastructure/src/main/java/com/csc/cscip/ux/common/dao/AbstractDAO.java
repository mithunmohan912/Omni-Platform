package com.csc.cscip.ux.common.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.sql.DataSource;

import com.csc.cscip.ux.common.util.ApplicationContextProvider;

/**
 * This class implements JDBC DAO
 * 
 * TODO Move code to JDBC delegate 
 * @author vpahuja
 *
 */

@SuppressWarnings("unchecked")
public abstract class AbstractDAO implements DataAccessObject {

	public abstract String getTableName();
	
	private static Connection getDatabaseConnection() throws SQLException {
		DataSource dataSource = (DataSource) ApplicationContextProvider.getApplicationContext().getBean("dataSourceUX");
		return dataSource.getConnection();
	}

	@Override
	public Object select(String column, Filter filter) {

		String[] columns = null;

		if (column != null) {
			columns = new String[] { column };
		}

		return select(columns, null, filter, new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				Object retValue = null;
				if (rs.next()) {
					retValue = rs.getObject(1);
				}
				return retValue;
			}
		}, null);
	}

	@Override
	public List<Object> selectAll(String column, Filter filter) {

		String[] columns = null;

		if (column != null) {
			columns = new String[] { column };
		}

		return (List<Object>) select(columns, null, filter, new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				List<Object> retValue = new ArrayList<Object>();
				while (rs.next()) {
					retValue.add(rs.getObject(1));
				}
				return retValue;
			}
		}, null);
	}

	@Override
	public Map<Object, Object> select(final String keyColumn, final String valueColumn, Filter filter) {

		return (Map<Object, Object>) select(new String[] { keyColumn, valueColumn }, null, filter, new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				Map<Object, Object> retValue = new HashMap<Object, Object>();
				while (rs.next()) {
					retValue.put(rs.getObject(1), rs.getObject(2));
				}
				return retValue;
			}
		}, null);
	}

	@Override
	public List<Map<Object, Object>> selectAllRows(Filter filter) {

		return (List<Map<Object, Object>>) select(null, null, filter, new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				List<Map<Object, Object>> retList = new ArrayList<Map<Object, Object>>();

				while (rs.next()) {
					int colCnt = rs.getMetaData().getColumnCount();
					Map<Object, Object> retValue = new HashMap<Object, Object>(colCnt);
					for (int i = 1; i <= colCnt; i++) {
						retValue.put(rs.getMetaData().getColumnName(i), rs.getObject(i));
					}
					retList.add(retValue);
				}

				return retList;
			}
		}, null);
	}

	@Override
	public Map<String, Object> selectRow(Filter filter) {

		return (Map<String, Object>) select(null, null, filter, new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				Map<Object, Object> retValue = null;

				if (rs.next()) {
					int colCnt = rs.getMetaData().getColumnCount();
					retValue = new HashMap<Object, Object>(colCnt);
					for (int i = 1; i <= colCnt; i++) {
						retValue.put(rs.getMetaData().getColumnName(i), rs.getObject(i));
					}
				}

				return retValue;
			}
		}, null);
	}

	@Override
	public Object[] select(final String[] columns, Filter filter) {

		return (Object[]) select(columns, null, filter, new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				Object[] retValue = null;

				if (rs.next()) {
					int colCnt = rs.getMetaData().getColumnCount();
					retValue = new Object[colCnt];
					for (int i = 1; i <= colCnt; i++) {
						retValue[i - 1] = rs.getObject(i);
					}
				}
				return retValue;
			}
		}, null);
	}

	@Override
	public List<Object[]> selectAll(final String[] columns, Filter filter) {
		return selectAll(columns, null, filter);
	}

	@Override
	public List<Object[]> selectAll(final String[] columns, Join[] joins, Filter filter) {

		return (List<Object[]>) select(columns, joins, filter, new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				List<Object> retValue = new ArrayList<Object>();

				while (rs.next()) {
					int colCnt = rs.getMetaData().getColumnCount();
					Object[] row = new Object[colCnt];
					for (int i = 1; i <= colCnt; i++) {
						row[i - 1] = rs.getObject(i);
					}
					retValue.add(row);
				}
				return retValue;
			}
		}, null);
	}

	@Override
	public Object select(String[] columns, Filter filter, ResultSetProcessor rsp, String[] orderByGroup) {
		return select(columns, null, filter, rsp, orderByGroup);
	}

	@Override
	public Object select(String[] columns, Join[] joins, Filter filter, ResultSetProcessor rsp, String[] orderColumns) {

		// Select
		String readSql = " Select ";

		String selectClause = "";
		if (columns != null && columns.length > 0) {
			for (int i = 0; i < columns.length; i++) {
				selectClause += columns[i] + " , ";
			}
			selectClause = selectClause.substring(0, selectClause.length() - 2);
		} else {
			selectClause = " * ";
		}

		readSql += selectClause;

		// From
		readSql += " from " + getTableName();

		// Join
		if (joins != null) {
			for (Join join : joins) {
				readSql += " Inner Join " + join.getTableName() + //
						" on " + getTableName() + "." + join.getSourceColumn() + " = " + join.getTableName() + "." + join.getTargetColumn() + " ";
			}
		}

		// Where
		if (filter != null && filter.size() > 0) {

			String filterClause = " where ";

			Set<Entry<String, Object>> filterSet = filter.entrySet();
			for (Entry<String, Object> filterEntry : filterSet) {
				filterClause += " " + filterEntry.getKey() + " = '" + filterEntry.getValue() + "' and ";
			}

			readSql += filterClause.substring(0, filterClause.length() - 4);
		}

		// Order
		if (orderColumns != null && orderColumns.length > 0) {

			String orderByClause = "";
			for (int i = 0; i < orderColumns.length; i++) {
				orderByClause += orderColumns[i] + " , ";
			}

			readSql += " ORDER BY " + orderByClause.substring(0, orderByClause.length() - 2);
		}

		return execute(readSql, rsp);

	}

	public int update(String sql) {
		return (Integer) execute(sql, null);
	}

	private Object execute(String sql, ResultSetProcessor rsp) {

		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null;

		try {
			conn = getDatabaseConnection();
			stmt = conn.createStatement();

			if (rsp != null) {
				rs = stmt.executeQuery(sql);
				return rsp.processResultSet(rs);
			} else {
				return stmt.executeUpdate(sql);
			}

		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (stmt != null) {
					stmt.close();
					conn.close();
				}
			} catch (SQLException e) {
				throw new RuntimeException(e);
			}
		}

	}

}
