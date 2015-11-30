package com.csc.cscip.ux.common.dao.acl;

import java.util.List;
import java.util.Map;

import com.csc.cscip.ux.common.dao.AbstractDAO;

public class AclElementDAO extends AbstractDAO {

	@Override
	public String getTableName() {
		return "acl_object_identity";
	}

	public Map<Object, Object> selectAllElements(Object aclClassId) throws Throwable {
		return select("object_id_identity", "id", new Filter("object_id_class", aclClassId));
	}
	
	public List<Object> getAllFunctions(Object screenId) throws Throwable {
		return selectAll("object_id_identity", new Filter("object_id_class", screenId));
	}
	
	public Object selectAllRoleFunctions(String aclRoleId, ResultSetProcessor rsp) throws Throwable{
		return select(new String[] { "owner_sid", "object_id_identity" },   new Filter("owner_sid", aclRoleId), rsp, null);				
	}

	public Long selectElementId(Object aclClassId, String elementName) throws Throwable {
		return (Long) select("id", new Filter("object_id_class", aclClassId).and("object_id_identity", elementName));
	}
	public Long selectElementObjectId(String elementName) throws Throwable {
		return (Long) select("object_id_class", new Filter("object_id_identity", elementName));
	}
	public Long selectElementIdByName(String elementName) throws Throwable {
		return (Long) select("id", new Filter("object_id_identity", elementName));
	}
	public List<Object> selectFunctionId(Object aclObjectClassId) throws Throwable {
		return  selectAll("id", new Filter("object_id_class", aclObjectClassId));
	}
	public Long insertElement(Long aclClassId, String elementName, Long groupId) throws Throwable {

		String insertSql = "insert into acl_object_identity (object_id_class,object_id_identity,owner_sid,entries_inheriting) values (" + aclClassId + ",'"
				+ elementName + "'," + groupId + ",0)";
		int result = update(insertSql);

		long elementId = 0;
		if (result > 0) {
			elementId = selectElementId(aclClassId, elementName);
		}
		return elementId;
	}
	
	public void deleteFunctionId(Long aclObjectClassId)
	{
		update("delete from acl_class  where id="+aclObjectClassId);
		update("DBCC CHECKIDENT ('acl_class', RESEED, 0)");
		update("DBCC CHECKIDENT ('acl_object_identity', RESEED, 0)");
		update("DBCC CHECKIDENT ('acl_entry', RESEED, 0)");
	}

}
