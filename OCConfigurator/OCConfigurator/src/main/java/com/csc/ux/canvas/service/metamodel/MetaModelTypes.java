package com.csc.ux.canvas.service.metamodel;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;

public class MetaModelTypes {
    private Properties properties;
	private static Map<String, String> propertiesMap = new LinkedHashMap<String, String>();
	
	public static String fetchScreenDetails(String key) {
		return propertiesMap.get(key);
    }

	public static Map<String, String> fetchAllScreenDetails() {
		return propertiesMap;
    }

	public Properties getProperties() {
		return properties;
	}

	public void setProperties(Properties properties) {
		this.properties = properties;
		for(String key : properties.stringPropertyNames()) {
			String value = properties.getProperty(key);
			propertiesMap.put(key, value);
		}
	}
}
