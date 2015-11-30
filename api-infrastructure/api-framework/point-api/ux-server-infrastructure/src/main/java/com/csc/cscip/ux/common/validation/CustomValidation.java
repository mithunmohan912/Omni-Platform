//*******************************************************************************
// * Copyright (c) 2012 CSC.
// *
// * The information contained in this document is the exclusive property of
// * CSC.  This work is protected under USA copyright law
// * and the copyright laws of given countries of origin and international
// * laws, treaties and/or conventions. No part of this document may be
// * reproduced or transmitted in any form or by any means, electronic or
// * mechanical including photocopying or by any informational storage or
// * retrieval system, unless as expressly permitted by CSC.
// ******************************************************************************
package com.csc.cscip.ux.common.validation;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CustomValidation implements Validator {
	private static final Logger logger = LoggerFactory.getLogger(CustomValidation.class);

    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {

	String inputValue = (String) value;
	int length = inputValue.length();
	String[] validationType = null;

	Properties properties = new Properties();
	String PropertiesFile = "/resources/validation/FieldValidation.properties";

	try {
	    InputStream inStream = null;
	    inStream = getClass().getResourceAsStream(PropertiesFile);
	    properties.load(inStream);
	    validationType = properties.getProperty(component.getId()).split(",");
	} catch (IOException e) {
	    logger.error("", e);
	}

	for (int i = 0; validationType.length > i; i++) {
	    if (validationType[i].equals("Required")) {
		checkRequired(inputValue);

	    } else if (validationType[i].equals("Number")) {
		checkNumber(inputValue, length);

	    } else if (validationType[i].startsWith("Size")) {
		checkSize(inputValue, (Integer.parseInt(validationType[i].replace("Size", ""))));
	    }
	}
    }

    // Checking if the value is number only
    public void checkNumber(String inputValue, int length) {
	for (int i = 0; i < length; i++) {
	    Character character = inputValue.charAt(i);
	    boolean isValid = Character.isDigit(character);
	    if (!isValid) {
		FacesMessage msg = new FacesMessage("Error", "message");
		msg.setSeverity(FacesMessage.SEVERITY_ERROR);
		throw new ValidatorException(msg);
	    }
	}
    }

    // Checking if the input size is correct
    public void checkSize(String inputValue, int size) {
	if (inputValue.length() > size) {
	    FacesMessage msg = new FacesMessage("Error", "message");
	    msg.setSeverity(FacesMessage.SEVERITY_ERROR);
	    throw new ValidatorException(msg);
	}
    }

    // Checking if the input is required
    public void checkRequired(String inputValue) {
	if (inputValue.length() == 0) {
	    FacesMessage msg = new FacesMessage("Error", "message");
	    msg.setSeverity(FacesMessage.SEVERITY_ERROR);
	    throw new ValidatorException(msg);
	}
    }
}
