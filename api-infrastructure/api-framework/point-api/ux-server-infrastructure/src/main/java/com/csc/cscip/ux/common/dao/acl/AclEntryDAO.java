package com.csc.cscip.ux.common.dao.acl;

import com.csc.cscip.ux.common.dao.AbstractDAO;


public class AclEntryDAO extends AbstractDAO {

	@Override
	public String getTableName() {
		return "acl_entry";
	}

	public Integer selectMask(Long groupId, Long elementId) throws Throwable {
		return (Integer) select("mask", new Filter("sid_id", groupId).and("acl_object_id", elementId));
	}

	public int insertEntry(Long groupId, Long elementId, String mask) throws Throwable {
		return update("insert into acl_entry(acl_object_id,ace_order,sid_id,mask,granting,audit_success,audit_failure) values (" + elementId + ", 1, " + groupId + "," + mask + ",1,1,1)");
	}

	public int updateEntry(Long elementId, Long groupId, String mask) throws Throwable {
		return update("update acl_entry set mask=" + mask + " where acl_object_id='" + elementId + "' and sid_id ='" + groupId + "'");
	}
	
	public int deleteEntry(Long elementId,Long groupId) {
		return update("delete from acl_entry where acl_object_id='" + elementId + "' and sid_id ='" + groupId + "'");
	}

	public Object processAllEntries(Long classId, ResultSetProcessor rsp) {

		return select(new String[] { "acl_object_identity.object_id_identity", "acl_sid.sid", "acl_entry.mask" }, //
				new Join[] { new Join("acl_object_identity", "acl_object_id", "id"), new Join("acl_sid", "sid_id", "id") }, //
				new Filter("acl_object_identity.object_id_class", classId), rsp, null);
	}
	
	public Object listAllFunctions(ResultSetProcessor rsp){		
		
		return select(new String[] { "acl_entry.mask as Mask", "acl_object_identity.object_id_identity as RestrictionName", "acl_sid.sid as AssignedRole"  }, //
				new Join[] { new Join("acl_object_identity", "acl_object_id","id"), new Join("acl_sid", "sid_id", "id") }, //
				null, rsp, null);
	}


}
