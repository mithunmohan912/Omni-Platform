package com.csc.cscip.ux.pointin.util;

import java.util.Properties;

public class SurroundProductConfig {

	public static final String MEDIA = "MEDIA";

	private static Properties properties;

	public void setProperties(Properties properties) {
		SurroundProductConfig.properties = properties;
	}

	public static String getProperty(String key) {
		String property = properties.getProperty(key);
		return property != null ? property.trim() : "";
	}

	public static String getProperty(String key, String defaultValue) {
		return properties.getProperty(key, defaultValue);
	}

	public static Integer getPropertyAsInt(String key) {
		return new Integer(getProperty(key));
	}

	public static Integer getPropertyAsInt(String key, String defaultValue) {
		return new Integer(getProperty(key, defaultValue));
	}

}
