package com.csc.cscip.ux.common.dao.userconfig;

import com.csc.cscip.ux.common.dao.AbstractDAO;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;

public class UserRoleDAO extends AbstractDAO{

	@Override
	public String getTableName() {
		return "USERROLES";
	}

		
	public Object selectAllUserRoles(String aclUserId, ResultSetProcessor rsp) throws Throwable{
		return select(new String[] { "UserID", "Role" },   new Filter("UserID", aclUserId), rsp, null);				
	}
	
	public Object selectAllRoles(String aclRoleId, ResultSetProcessor rsp) throws Throwable{
		return select(new String[] { "UserID", "Role" },   new Filter("Role", aclRoleId), rsp, null);				
	}

	public int insertUser(String UserID, String Role) throws Throwable {		
		return update("insert into USERROLES(UserID,Role) values ('" + UserID + "','" + Role + "')");
	}

	public int deleteEntry(String userId, String Role) {
		return update("delete from USERROLES where UserID='" + userId + "' and Role='" + Role + "'");
	}
	public Object getUserRoleCount(String userId,ResultSetProcessor rsp) {
		String strSql = "select count(UserID) as UserIdCount from USERROLES where UserID='" + userId + "'";
		return execute(strSql, rsp);
	}
	private static Connection getDatabaseConnection() throws SQLException {
		DataSource dataSource = (DataSource) ApplicationContextProvider.getApplicationContext().getBean("dataSourceUX");
		return dataSource.getConnection();
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

