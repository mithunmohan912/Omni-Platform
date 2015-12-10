package com.csc.cscip.ux.common.dao.personalization;

import java.util.HashMap;
import java.util.Map;

import com.csc.cscip.ux.common.dao.AbstractDAO;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.request.UXRestRequest;

public class PersonalizationDAO extends AbstractDAO {

	@Override
	public String getTableName() {
		return "USER_PERSONALIZATION";
	}

	public Map<String, Object> getUserPersonalization(String user) {
		return selectRow(new Filter("USERNAME", user));
	}

	public Map<String, String> updateUserPersonalization(RequestPayLoad requestObject, String userName, boolean isHomePersonalization) throws Throwable {

		String sql = null;

		if (isHomePersonalization) {

			if (requestObject.get("appsAdded") != null) {
				String tempValue = (String) requestObject.get("appsAdded");
				sql = "UPDATE USER_PERSONALIZATION SET APPS_ADDED='" + tempValue + "' WHERE USERNAME='" + userName + "'";
			} else if (requestObject.get("favoriteExpressProc") != null) {
				String tempValue = (String) requestObject.get("favoriteExpressProc");
				sql = "UPDATE USER_PERSONALIZATION SET FAVOURITE_EXPRSPROC='" + tempValue + "'WHERE USERNAME='" + userName + "'";
			}

		} else {

			sql = "UPDATE USER_PERSONALIZATION SET " + //
					"USER_GREETING='" + requestObject.get("userGreeting") + "', " + //
					"USER_BANNER='" + requestObject.get("userBackgroundbanner") + "', " + //
					"USER_THEME='" + requestObject.get("userTheme") + "', " + //
					"USER_FONT='" + requestObject.get("userFont") + "', " + //
					"USER_OPTIONBAR='" + requestObject.get("userOptionBar") + "' " + //
					"WHERE USERNAME='" + userName + "'";

		}

		int result = update(sql);

		Map<String, String> message = new HashMap<String, String>();

		if (result > 0) {
			message.put("Message", "Your personalized changes have been saved.");
			message.put("severity", "10");
		} else {
			message.put("Message", "Your personalized changes cannot be saved.");
			message.put("severity", "30");
		}

		return message;
	}
}
