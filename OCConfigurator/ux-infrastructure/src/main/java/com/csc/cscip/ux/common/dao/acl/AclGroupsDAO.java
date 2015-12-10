package com.csc.cscip.ux.common.dao.acl;

import com.csc.cscip.ux.common.dao.AbstractDAO;

public class AclGroupsDAO extends AbstractDAO {

	public String getTableName() {
		return "acl_sid";
	}

	public long getGroupId(Object groupId) throws Throwable {
		return (Long) select("id", new Filter("sid", groupId));
	}

	public Object processAllGroups(ResultSetProcessor rsp) {
		return select((String[]) null, null, rsp, null);
	}
	
	public Object insertGroup(String groupID, String description) throws Throwable {		
		Object roleId = select("id", new Filter("sid", groupID));
		if(roleId == null){
			return update("insert into acl_sid(principal, sid,description) values ('0','" + groupID + "','" + description + "')");
				
			}
		else
		{
				return true;
		}
		
	}
	
	public int deleteRole(String groupID) {
		Object roleId = select("id", new Filter("sid", groupID));
		update("delete from acl_entry where sid_id="+ roleId);
		update("delete from acl_object_identity where owner_sid ="+ roleId);
		return update("delete from acl_sid where id='" + roleId + "'");
	}
	
}
