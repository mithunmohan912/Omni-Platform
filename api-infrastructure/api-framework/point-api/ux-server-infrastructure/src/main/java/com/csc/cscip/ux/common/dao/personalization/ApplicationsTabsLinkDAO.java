package com.csc.cscip.ux.common.dao.personalization;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.csc.cscip.ux.common.dao.AbstractDAO;

public class ApplicationsTabsLinkDAO extends AbstractDAO {

	@Override
	public String getTableName() {
		return "APPLICATION_TAB_LINKS";
	}

	public Object getApplicationTabLinks(String tabId, final String favExpOpt) {

		return select(null, new Filter("ASSOCIATED_TABID", tabId), new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				List<Map<String, Object>> applicationLinkList = new ArrayList<Map<String, Object>>();
				String[] favourites = favExpOpt.split(",");

				while (rs.next()) {

					Map<String, Object> linksMap = new HashMap<String, Object>();

					linksMap.put("linkno", rs.getString("LINK_NO"));
					linksMap.put("id", rs.getString("LINK_ID"));
					linksMap.put("title", rs.getString("LINK_TITLE"));
					linksMap.put("icon", rs.getString("LINK_ICON"));
					linksMap.put("url", rs.getString("LINK_URL"));
					linksMap.put("text", rs.getString("LINK_TEXT"));
					linksMap.put("actionName", rs.getString("LINK_ACTION"));
					linksMap.put("isExpressProcsOption", rs.getString("EXPRESS_PROCS"));
					linksMap.put("isFavorite", checkFavourite(rs.getString("LINK_NO"), favourites));

					applicationLinkList.add(linksMap);
				}

				return applicationLinkList;
			}
		}, new String[] { "LINK_NO" });
	}

	public String checkFavourite(String linkno, String[] favourites) {

		String value = "no";
		for (int i = 0; i < favourites.length; i++) {
			if (linkno.equals(favourites[i])) {
				value = "yes";
				break;
			}
		}
		return value;
	}

}
