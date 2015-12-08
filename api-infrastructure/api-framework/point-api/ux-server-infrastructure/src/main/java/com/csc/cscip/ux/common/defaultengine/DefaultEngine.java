package com.csc.cscip.ux.common.defaultengine;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.csc.cscip.ux.common.util.CommonConstants;

public class DefaultEngine {

	private static final Logger logger = LoggerFactory.getLogger(DefaultEngine.class);
	
    private String PropertiesFile = "/resources/defaultengine/defaultValues.properties";
    private InputStream inStream = null;
    private Properties properties = null;
    private Authentication auth = null;

    public DefaultEngine() {
	inStream = DefaultEngine.class.getResourceAsStream(PropertiesFile);
	properties = new Properties();
    }

    public String getDefaultValue(String field, String screen, String section) {
	try {
	    auth = SecurityContextHolder.getContext().getAuthentication();
	    ArrayList roles = new ArrayList(auth.getAuthorities());
	    for (Object role : roles) {
		properties.load(inStream);
		String key = role.toString() + "." + screen + "." + section + "." + field;
		if (properties.containsKey(key)) {
		    return properties.getProperty(key);
		}
	    }
	} catch (IOException e) {
	    logger.error("", e);
	}
	return CommonConstants.EMPTY_FIELD;
    }

    public boolean hasDefaultValue(String field, String screen, String section) {
	try {
	    auth = SecurityContextHolder.getContext().getAuthentication();
	    ArrayList roles = new ArrayList(auth.getAuthorities());
	    for (Object role : roles) {
		properties.load(inStream);
		String key = role.toString() + "." + screen + "." + section + "." + field;
		return (properties.getProperty(key) != null) ? true : false;
	    }
	} catch (IOException e) {
	    logger.error("", e);
	}
	return false;
    }
}
