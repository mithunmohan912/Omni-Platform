package com.csc.cscip.ux.common.dao.userconfig;

import com.csc.cscip.ux.common.dao.AbstractDAO;

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
	
}

