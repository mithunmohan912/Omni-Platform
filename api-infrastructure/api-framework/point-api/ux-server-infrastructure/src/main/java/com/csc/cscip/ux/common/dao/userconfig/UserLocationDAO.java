package com.csc.cscip.ux.common.dao.userconfig;

import com.csc.cscip.ux.common.dao.AbstractDAO;

public class UserLocationDAO extends AbstractDAO{

	@Override
	public String getTableName() {
		return "TBUNDCDE";
	}

		
	public Object selectAllLocations(ResultSetProcessor rsp) throws Throwable{
		return select(new String[] { "AGNUMCO", "AGNUPCO","AGNUNBR","UNDCODE","UNDDESC","UNDDFT","EFFDATE","EXPDATE","UNDTYPCDE" }, null, rsp, null);				
	}
}
