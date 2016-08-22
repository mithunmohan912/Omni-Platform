package com.csc.cscip.ux.common.dao.personalization;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.csc.cscip.ux.common.dao.AbstractDAO;

@SuppressWarnings("unchecked")
public class ApplicationDAO extends AbstractDAO {

	@Override
	public String getTableName() {
		return "APPLICATIONS";
	}

	public Object getPersonalizedApplications(final String[] addedAppIds, final String favExpOpt) {

		return select(null, null, new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				Map<String, Object>[] addedApps = new HashMap[addedAppIds.length];
				List<Map<String, Object>> unsortedApplicationList = new ArrayList<Map<String, Object>>();
				
				while (rs.next()) {
					
					Map<String, Object> applicationMap = new HashMap<String, Object>();
					applicationMap.put("appid", rs.getInt("APP_ID"));
					applicationMap.put("appname", rs.getString("APPNAME"));
					applicationMap.put("title", rs.getString("APP_TITLE"));
					applicationMap.put("icon", rs.getString("APP_ICON"));
					applicationMap.put("target", rs.getString("APP_TARGET"));
					applicationMap.put("expressprocessing", rs.getString("EXPRESSPROCESSING"));
					applicationMap.put("epheader", rs.getString("EPHEADER"));
					applicationMap.put("appurl", rs.getString("APP_URL"));
					
					ApplicationTabsDAO applicationTabsDAO = new ApplicationTabsDAO();
					applicationMap.put("tab_list", applicationTabsDAO.getApplicationTabs(rs.getString("APP_ID"), favExpOpt));

					boolean added = false;
					int i = 0;
					for (; i < addedAppIds.length; i++) {
						if (addedAppIds[i].equals(applicationMap.get("appid").toString())) {
							added = true;
							break;
						}
					}

					if (added) {
						applicationMap.put("appadded", "yes");
						addedApps[i] = applicationMap;
					} else {
						applicationMap.put("appadded", "no");
						unsortedApplicationList.add(applicationMap);
					}
				}
				List<Map<String, Object>> sortedApplicationList = new ArrayList<Map<String, Object>>(Arrays.asList(addedApps));
				sortedApplicationList.addAll(unsortedApplicationList);
				return sortedApplicationList;
			}
		}, null);
	}

}
