package com.csc.cscip.ux.common.validation;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ValidationJSON {

	private final static Logger logger = LoggerFactory.getLogger(ValidationJSON.class);

	private String PROPERTIES_FILE_PATH = "/resources/validation/FieldValidation.properties";

	@RequestMapping(value = "/validation/hiddenField", method = RequestMethod.GET)
	public @ResponseBody
	String hiddenFieldList(@RequestParam("idForm") String page) {
		Properties properties = new Properties();
		String PropertiesFile = PROPERTIES_FILE_PATH;
		String fieldList = "";
		try {
			InputStream inStream = null;
			inStream = getClass().getResourceAsStream(PropertiesFile);
			properties.load(inStream);

			if (properties.containsKey(page)) {
				fieldList = properties.getProperty(page);
			}

		} catch (IOException e) {
			logger.error("", e);
		}

		return fieldList;
	}

	@RequestMapping(value = "/validation/formRule", method = RequestMethod.GET)
	public @ResponseBody
	String formRule(@RequestParam("idHidden") String idForm) {
		Properties properties = new Properties();
		String PropertiesFile = PROPERTIES_FILE_PATH;
		String JSON = "";
		try {
			InputStream inStream = null;
			inStream = getClass().getResourceAsStream(PropertiesFile);
			properties.load(inStream);

			if (properties.containsKey(idForm)) {
				JSON = properties.getProperty(idForm);
			}

		} catch (IOException e) {
			logger.error("", e);
		}

		return JSON;
	}
}
