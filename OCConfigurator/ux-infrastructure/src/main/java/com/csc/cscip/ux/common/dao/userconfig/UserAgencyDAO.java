package com.csc.cscip.ux.common.dao.userconfig;

import com.csc.cscip.ux.common.dao.AbstractDAO;



public class UserAgencyDAO extends AbstractDAO{
	
	@Override
	public String getTableName() {
		return "USERAGENCY";
	}

		
	public Object selectAllUserAgencies(String aclUserId, ResultSetProcessor rsp) throws Throwable{
		return select(new String[] { "UserID", "AgencyID","AgencyOrderNbr" },   new Filter("UserID", aclUserId), rsp, null);				
	}
	
	public Object selectAllAgencies(String aclAgencyId, ResultSetProcessor rsp) throws Throwable{
		return select(new String[] { "UserID", "AgencyID","AgencyOrderNbr" },   new Filter("AgencyID", aclAgencyId), rsp, null);				
	}

	public int insertUser(String UserID, String AgencyID) throws Throwable {
		Object agencyNbrRs = getAgencyNbrOrder(UserID);
		int agencyNbrOrder = 0;
		if (agencyNbrRs != null){
			agencyNbrOrder = (Integer) agencyNbrRs + 1; 
		}			
		return update("insert into USERAGENCY(UserID,AgencyID,AgencyOrderNbr) values ('" + UserID + "','" + AgencyID + "','" + agencyNbrOrder + "')");
	}

	public Object getAgencyNbrOrder(String userId) throws Throwable {
		return select("max(AgencyOrderNbr)", new Filter("UserID",userId));	    
	}
	
	public int deleteuserAgency(String userId, String agencyId) throws Throwable{
		return update("delete from USERAGENCY where UserID='" + userId + "' and AgencyID='" + agencyId + "'");
	}
}
