package com.csc.cscip.ux.common.dao.personalization;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.csc.cscip.ux.common.dao.AbstractDAO;

public class ApplicationTabsDAO extends AbstractDAO {

	@Override
	public String getTableName() {
		return "APPLICATION_TABS";
	}

	public Object getApplicationTabs(String appId, final String favExpOpt) {
		
		return select(null, new Filter("ASSOCIATED_APPLICATION", appId), new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {
				
				List<Map<String, Object>> tabList = new ArrayList<Map<String, Object>>();
				
				while (rs.next()) {
					
					String tabId = rs.getString("TAB_ID");
					
					Map<String, Object> tabsMap = new HashMap<String, Object>();
					tabsMap.put("tabid", tabId);
					tabsMap.put("text", rs.getString("TAB_TEXT"));
					tabsMap.put("title", rs.getString("TAB_TITLE"));
					tabsMap.put("class", rs.getString("TAB_CLASS"));
					
					ApplicationsTabsLinkDAO applicationsTabsLinkDAO = new ApplicationsTabsLinkDAO();
					tabsMap.put("links", applicationsTabsLinkDAO.getApplicationTabLinks(tabId, favExpOpt));
					
					tabList.add(tabsMap);
				}

				return tabList;
			}
		}, new String[] { "TAB_ID" });
	}

}
