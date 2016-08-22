package com.csc.cscip.ux.common.dao.acl;


import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import com.csc.cscip.ux.common.dao.AbstractDAO;
import com.csc.cscip.ux.common.dao.DataAccessObject.ResultSetProcessor;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;

public class AclScreenDAO extends AbstractDAO {

	@Override
	public String getTableName() {
		return "acl_class";
	}

	public Long getScreenId(String screenId) throws Throwable {
		return (Long) select("id", new Filter("class", screenId));
	}
	
	public String getScreenName(Long screenId) throws Throwable {
		return (String) select("class", new Filter("id", screenId));
	}
	
	private static Connection getDatabaseConnection() throws SQLException {
		DataSource dataSource = (DataSource) ApplicationContextProvider.getApplicationContext().getBean("dataSourceUX");
		return dataSource.getConnection();
	}
	
	public Object getScreenIds(String screenType,ResultSetProcessor rsp) throws Throwable {
		
		String sql = "select id from acl_class where class like '%"+ screenType + "%'";
		return execute(sql,rsp);
				
	}

	public Long insertScreenId(String screenId) throws Throwable {

		String insertSql = "insert into acl_class (class) values('" + screenId + "')";
		int result = update(insertSql);

		Long aclClassId = null;
		if (result > 0) {
			aclClassId = getScreenId(screenId);
		}
		return aclClassId;
	}
	
	public Object processAllFunctions(ResultSetProcessor rsp) {
		return select((String[]) null, null, rsp, null);
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
