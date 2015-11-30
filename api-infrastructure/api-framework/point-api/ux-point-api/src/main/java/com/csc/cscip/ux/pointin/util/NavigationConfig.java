package com.csc.cscip.ux.pointin.util;

import java.util.Properties;

public class NavigationConfig {

	private static Properties properties;

	public void setProperties(Properties properties) {
		NavigationConfig.properties = properties;
	}

	public static String getProperty(String key) {
		return properties.getProperty(key);
	}

	public static Integer getPropertyAsInt(String key) {
		return new Integer(getProperty(key));
	}


}
