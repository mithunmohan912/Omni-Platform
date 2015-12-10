package com.csc.cscip.ux.common.dao.userconfig;

import com.csc.cscip.ux.common.dao.AbstractDAO;


public class HomePageConfigDAO extends AbstractDAO {

	public String getTableName() {
		return "APPLICATIONS";
	}	
	
		
	public Object getAppList(ResultSetProcessor rsp) throws Throwable{
		return select(new String[] { "APP_ID", "APPNAME", "APP_TITLE" }, null, rsp, null);				
	}	
	

}