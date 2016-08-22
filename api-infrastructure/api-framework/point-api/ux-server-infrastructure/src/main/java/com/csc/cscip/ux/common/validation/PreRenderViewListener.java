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
import java.util.Enumeration;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Properties;

import javax.faces.component.UIComponent;
import javax.faces.component.UIViewRoot;
import javax.faces.context.FacesContext;
import javax.faces.event.AbortProcessingException;
import javax.faces.event.SystemEvent;
import javax.faces.event.SystemEventListener;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.primefaces.component.button.Button;
import org.primefaces.component.commandbutton.CommandButton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.jsf.FacesContextUtils;
import org.springframework.webflow.execution.RequestContext;
import org.springframework.webflow.execution.RequestContextHolder;

import com.csc.cscip.ux.common.util.GlobalConfigData;

public class PreRenderViewListener implements SystemEventListener {

	private static final Logger logger = LoggerFactory.getLogger(PreRenderViewListener.class);

	public void processEvent(SystemEvent event) throws AbortProcessingException {
		UIViewRoot root = (UIViewRoot) event.getSource();

		// logger.info("getViewId :" +
		// FacesContext.getCurrentInstance().getViewRoot().getViewId());

		Properties properties = new Properties();
		String PropertiesFile = "/resources/validation/FieldValidation.properties";

		try {
			InputStream inStream = null;
			inStream = getClass().getResourceAsStream(PropertiesFile);
			properties.load(inStream);

			Enumeration em = properties.keys();
			while (em.hasMoreElements()) {
				String str = (String) em.nextElement();
				logger.debug("str : " + str);
				addJQueryValtoElement(root, str);
				// addValidationToUIElement(root, str);
			}

		} catch (IOException e) {
			logger.error("", e);
		}
		// addValidationToUIElement(root, "acc_num");
		// logger.info("testing work fine");
	}

	// ####################################################################################
	public boolean isListenerForSource(Object source) {
		return true;
	}

	public UIComponent getUIcomponent(UIComponent comp, String id) {

		if (id.equals(comp.getId())) {
			return comp;
		}

		Iterator<UIComponent> components = comp.getFacetsAndChildren();
		while (components.hasNext()) {
			UIComponent found = getUIcomponent(components.next(), id);
			if (found != null) {
				return found;
			}
		}
		return null;
	}

	// ######################################################################################
	public void addValidationToUIElement(UIViewRoot root, String ScreenElementID) {
		logger.info("$$$$$$$$$$ in addValidationToUIElement");
		String[] validationType = null;
		FacesContext context = FacesContext.getCurrentInstance();
		UIComponent component = getUIcomponent(root, ScreenElementID);
		RequestContext requestContext = RequestContextHolder
				.getRequestContext();

		/********************************************************
		 * 
		 * Do Not Delete this , it's for JSF Validation
		 * 
		 ********************************************************/

		// if (component != null) {
		// component.setRendered(true);
		//
		// if (component instanceof HtmlInputText) {
		//
		// HtmlInputText inputTxt = (HtmlInputText) component;
		//
		// Object obj = new
		// com.csc.cscip.ux.common.validation.CustomValidation();
		// ((HtmlInputText) component).removeValidator((Validator) obj);
		// ((HtmlInputText) component).addValidator((Validator) obj);
		//
		// // if (!((HtmlInputText) component).isValid()) {
		// // requestContext.getMessageContext().addMessage(
		// // new
		// MessageBuilder().error().source("message").defaultText("Invalide field value").build());
		// // logger.info("This field have error" + ((HtmlInputText)
		// component).getRequiredMessage()
		// // + "%%%%%%%%%%%%%%%%%%%" + ((HtmlInputText)
		// component).getValidatorMessage());
		// //
		// logger.info(context.getCurrentInstance().getMessageList().toString());
		// // }
		// }
		// }
	}

	// ############################################################################
	public void addJQueryValtoElement(UIViewRoot root, String ScreenElementID) {
		UIComponent component = getUIcomponent(root, ScreenElementID);

		Properties properties = new Properties();
		String PropertiesFile = "/resources/validation/FieldValidation.properties";
		InputStream inStream = null;
		String validationClass = "";
		String[] validationType = null;

		if (component != null) {
			component.setRendered(true);

			if (component instanceof Button) {

				Button buttonItem = (Button) component;

				try {
					inStream = getClass().getResourceAsStream(PropertiesFile);
					properties.load(inStream);
					String idForm = properties.getProperty(component.getId());
					buttonItem.setOnclick("return formValidator('" + idForm
							+ "');" + buttonItem.getOnclick());

				} catch (IOException e) {
					logger.error("", e);
				}
			} else if (component instanceof CommandButton) {
				CommandButton buttonItem = (CommandButton) component;
				RequestContext requestContext = RequestContextHolder
						.getRequestContext();

				try {
					inStream = getClass().getResourceAsStream(PropertiesFile);
					properties.load(inStream);
					String idForm = properties.getProperty(component.getId());
					buttonItem.setOnstart("return formValidator('" + idForm
							+ "')");
//					MakePaymentManagedBean makePayManageBean = (MakePaymentManagedBean) requestContext
//							.getFlowScope().get("makePayManageBean");
//					if (makePayManageBean != null) {
//						if (component.getId().equals("makePayment_submit"))
//							buttonItem.setRendered(!makePayManageBean
//									.getIsRecurPayment());
//						if (component.getId()
//								.equals("makePayment_submit_recur"))
//							buttonItem.setRendered(makePayManageBean
//									.getIsRecurPayment());
//					}
				} catch (IOException e) {
					logger.error("", e);
				}
			}
		}
	}

	public String addDroolRules(String jSONProperty) {
		JSONParser parser = new JSONParser();

		Object obj = null;
		try {
			obj = parser.parse(jSONProperty);
		} catch (ParseException e) {
			logger.error("", e);
		}

		JSONObject jsonObject = (JSONObject) obj;

		LinkedHashMap<String, Object> creditCardRules = getCreditCardRules();

		jsonObject.put("credit_card", creditCardRules);

		return jsonObject.toJSONString().replaceAll(" ", "");
	}

	public static LinkedHashMap<String, Object> getCreditCardRules() {

		ApplicationContext context = FacesContextUtils
				.getWebApplicationContext(FacesContext.getCurrentInstance());
		GlobalConfigData globalConfigBean = (GlobalConfigData) context
				.getBean("globalConfigBean");

		LinkedHashMap<String, Object> fieldList = new LinkedHashMap<String, Object>();
		LinkedHashMap<String, Object> creditCardRules = new LinkedHashMap<String, Object>();

		fieldList.put("BIL_CRCRD_TYPE_CD", "card_type");
		fieldList.put("BIL_CRCRD_NUM", "credit_card_number");
		fieldList.put("BIL_CRCRD_EXP_DATE", "credit_card_exp_date");

		creditCardRules.put("field_list", fieldList);
		creditCardRules.put("rules",
				globalConfigBean.getControlTableValues("makePayment"));

		return creditCardRules;

	}
}

// package com.csc.cscip.ux.common.validation;
//
// import java.io.IOException;
// import java.io.InputStream;
// import java.util.Enumeration;
// import java.util.Iterator;
// import java.util.Properties;
//
// import javax.faces.component.UIComponent;
// import javax.faces.component.UIViewRoot;
// import javax.faces.component.html.HtmlInputText;
// import javax.faces.event.AbortProcessingException;
// import javax.faces.event.SystemEvent;
// import javax.faces.event.SystemEventListener;
// import javax.faces.validator.Validator;
//
// import org.springframework.binding.message.MessageBuilder;
// import org.springframework.webflow.execution.RequestContext;
// import org.springframework.webflow.execution.RequestContextHolder;
//
// public class PreRenderViewListener implements SystemEventListener {
//
// public void processEvent(SystemEvent event) throws AbortProcessingException {
// UIViewRoot root = (UIViewRoot) event.getSource();
//
// Properties properties = new Properties();
// String PropertiesFile = "/resources/validation/FieldValidation.properties";
//
// try {
// InputStream inStream = null;
// inStream = getClass().getResourceAsStream(PropertiesFile);
// properties.load(inStream);
//
// Enumeration em = properties.keys();
// while (em.hasMoreElements()) {
// String str = (String) em.nextElement();
// addValidationToUIElement(root, str);
// }
//
// } catch (IOException e) {
// logger.error("", e);
// }
// }
//
// //
// #################################################################################
// public boolean isListenerForSource(Object source) {
// return true;
// }
//
// public UIComponent getUIcomponent(UIComponent comp, String id) {
//
// if (id.equals(comp.getId())) {
// return comp;
// }
// Iterator<UIComponent> components = comp.getFacetsAndChildren();
// while (components.hasNext()) {
// UIComponent found = getUIcomponent(components.next(), id);
// if (found != null) {
// return found;
// }
// }
// return null;
//
// }
//
// //
// #################################################################################
// public void addValidationToUIElement(UIViewRoot root, String ScreenElementID)
// {
//
// UIComponent component = getUIcomponent(root, ScreenElementID);
// RequestContext requestContext = RequestContextHolder.getRequestContext();
//
// if (component != null) {
// component.setRendered(true);
//
// if (component instanceof HtmlInputText) {
//
// Object obj = new com.csc.cscip.ux.common.validation.CustomValidation();
// ((HtmlInputText) component).removeValidator((Validator) obj);
// ((HtmlInputText) component).addValidator((Validator) obj);
//
// if (!((HtmlInputText) component).isValid()) {
// requestContext.getMessageContext().addMessage(
// new
// MessageBuilder().error().source("message").defaultText("Invalid field value").build());
// }
// }
// }
// }
// }