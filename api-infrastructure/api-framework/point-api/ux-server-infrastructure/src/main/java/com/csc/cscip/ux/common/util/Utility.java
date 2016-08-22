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
package com.csc.cscip.ux.common.util;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.Serializable;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.MessageFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.Properties;
import java.util.TimeZone;

import javax.faces.context.FacesContext;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.jsf.FacesContextUtils;
import org.springframework.webflow.execution.RequestContext;

/**
 * @author lnguyen66
 * 
 */
public class Utility implements Serializable {

    private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(Utility.class);

    public static <T> boolean isNotEmpty(Collection<T> collection) {
	if (collection != null && !collection.isEmpty()) {
	    return true;
	} else {
	    return false;
	}
    }

    public static String maskAccountNumber(String accountNumber) {
	String maskedNumber = "";
	int index = 0;
	if (StringUtils.isBlank(accountNumber)) {
	    return accountNumber;
	} else {
	    if (accountNumber.contains("*")) {
		return accountNumber;
	    } else {
		int length = accountNumber.length();
		if (length > 4) {
		    maskedNumber = accountNumber.substring(length - 4, length);
		    for (index = 0; index < length - 4; index++) {
			maskedNumber = "*" + maskedNumber;
		    }
		    return maskedNumber;
		} else {
		    return accountNumber;
		}
	    }
	}
    }

    public static Date getDateFromString(String date) throws ParseException {
	Date result = null;
	final SimpleDateFormat dateFormatA = new SimpleDateFormat(CommonConstants.DATE_FORMAT_US);
	final SimpleDateFormat dateFormatB = new SimpleDateFormat("MM/dd/yyyy");
	final String specialDate = "12/31/9999";
	String dateAux = null;
	if (null != date && !String.valueOf("").equals(date.trim())) {
	    dateAux = dateFormatB.format(dateFormatA.parse(date));
	}
	if (null != dateAux && !dateAux.equals(specialDate)) {
	    result = dateFormatB.parse(dateFormatB.format(dateFormatA.parse(date.trim())));
	}
	return result;
    }

	public static Date getDateFromStringWithPattern(String date, String pattern) throws ParseException {
		Date result = null;
		final SimpleDateFormat dateFormatA = new SimpleDateFormat(pattern);
		final SimpleDateFormat dateFormatB = new SimpleDateFormat("MM/dd/yyyy");
		final String specialDate = "12/31/9999";
		String dateAux = null;
		if (null != date && !String.valueOf("").equals(date.trim())) {
			dateAux = dateFormatB.format(dateFormatA.parse(date));
		}
		if (null != dateAux && !dateAux.equals(specialDate)) {
			result = dateFormatB.parse(dateFormatB.format(dateFormatA.parse(date.trim())));
		}
		return result;
	}
	
	public static String getStringFromDate(Date date){
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		return df.format(date);
	}
//138491 STARTS
    public static Date getDateFromStr(String date) throws ParseException {
	Date result = null;
	final SimpleDateFormat dateFormat = new SimpleDateFormat(CommonConstants.DATE_FORMAT_US);
	if (date != null) {
	    result = dateFormat.parse(date);
	}
	return result;
    }
// 138491 ENDS
    public static Date getExpDateFromString(String date) throws ParseException {
	DateFormat dateFormat = new SimpleDateFormat(CommonConstants.EXPIRYDATE_FORMAT_US);
	Date formattedDate = null;
	if (!isBlank(date)) {
	    formattedDate = dateFormat.parse(date);
	}

	return formattedDate;
    }

	public static String getCurrentServerDateTime() {
		return getCurrentServerDate("MM/dd/yyyy HH:mm:ss");
	}

	public static String getCurrentServerDate() {
		return getCurrentServerDate("MM/dd/yyyy");
	}

	private static String getCurrentServerDate(String format) {
		DateFormat dateFormat = new SimpleDateFormat(format);
		Date date = new Date();
		return dateFormat.format(date);
	}    
    
    public static boolean isBlank(String value) {
	if (value != null && value.length() > 0) {
	    return false;
	}
	return true;
    }

    public static boolean isEmpty(String str) {
	return str == null || str.length() == 0;
    }

    public static TimeZone getTimeZone() {
	Locale locale = LocaleContextHolder.getLocale();
	TimeZone timeZone;

	if (locale.getLanguage().equals("fr")) { // France
	    timeZone = TimeZone.getTimeZone("Europe/Berlin"); // UTC + 1
	} else {
	    timeZone = TimeZone.getTimeZone("America/New_York"); // UTC-5, Eastern Time
	}
	return timeZone;
    }
    
    public static String getResourceBundleMessage(String key, Object[] params) {
    	String finalMsg = "";
    	try{
	    	ApplicationContext context = FacesContextUtils.getWebApplicationContext(FacesContext.getCurrentInstance());	    	
	    	MessageFormat messageFormat = null;
	    	
	    	MessageSource  messageSource = (MessageSource) context.getBean("messageSource");
			
			String  msgValue = messageSource.getMessage(key, null, "[ "+key+" ]", LocaleContextHolder.getLocale());
			messageFormat = new MessageFormat(msgValue);
			
			if(!msgValue.equalsIgnoreCase("[ "+key+" ]")){
				finalMsg = messageFormat.format(params);
			}			
    	} catch (Exception ex) {
    		logger.error(ex.getMessage());
    		finalMsg = "[ "+key+" ]";
    	}
		return finalMsg;
    }
    
    public static String getResourceBundleMessage(String key) {
    	String  msgValue = "";
    	try{
	    	ApplicationContext context = FacesContextUtils.getWebApplicationContext(FacesContext.getCurrentInstance());	    	
	    	
	    	MessageSource  messageSource = (MessageSource) context.getBean("messageSource");
			
			msgValue = messageSource.getMessage(key, null, "[ "+key+" ]", LocaleContextHolder.getLocale());
			
    	} catch (Exception ex) {
    		logger.error(ex.getMessage());
    		msgValue = "[ "+key+" ]";
    	}
		return msgValue;
    }  

    /**
     * return localized message with specified key in properties file, base on selected locale
     * 
     * @param key stored in properties file. Example: account.search.warning.msg
     * 
     */
    public static String getResourceBundleMessage(RequestContext context, String key) {
		ApplicationContext appContext = context.getActiveFlow().getApplicationContext();
		MessageSource messageSource = (MessageSource) appContext.getBean("messageSource");
		String resultMessage = key;
		
		try {
			resultMessage = messageSource.getMessage(key, null, "[ "+key+" ]",LocaleContextHolder.getLocale());
		} catch (NoSuchMessageException e) {
			logger.error("", e);
		}

		return resultMessage;

    }

    /**
     * return localized message with specified key in properties file, base on selected locale reconciliation.multi_process.infoMessage
     * 
     * @param key stored in properties file. Example: account.search.warning.msg
     * @param params an array of parameters to pass to the message. Example: {0} and {1} are required.
     * 
     */
    public static String getResourceBundleMessage(RequestContext context, String key, Object[] params) {

    	String finalMsg = "";
    	MessageFormat messageFormat = null;
    	
		ApplicationContext appContext = context.getActiveFlow().getApplicationContext();		
		MessageSource messageSource = (MessageSource) appContext.getBean("messageSource");
		
		String  msgValue = messageSource.getMessage(key, null, "[ "+key+" ]", LocaleContextHolder.getLocale());
		messageFormat = new MessageFormat(msgValue);
		
		if(!msgValue.equalsIgnoreCase("[ "+key+" ]")){
			finalMsg = messageFormat.format(params);
		}			
		
		return finalMsg;

    }

    /**
     * to get config values application.properties
     * 
     * @param key stored in .properties file. Example: mm.fileget.pageUrl
     * 
     */
    public static String getApplicationProperty(RequestContext context, String key) {
    	ApplicationContext appContext = context.getActiveFlow().getApplicationContext();
    	Properties properties = (Properties) appContext.getBean("appProp");

    	return (String)properties.getProperty(key);
    }
    
    /**
     * Set time to 00:00:00
     * @param date a date fitting in the GregorianCalendar
     * @return Another date object with the same day, but all time fields set to zero
     * @see GregorianCalendar
     */
    public static Date setTimeToMidnight(final Date date) {
	final GregorianCalendar calendar = new GregorianCalendar();
	calendar.setTime(date);
	calendar.set(GregorianCalendar.HOUR_OF_DAY, 0);
	calendar.set(GregorianCalendar.MINUTE, 0);
	calendar.set(GregorianCalendar.SECOND, 0);
	calendar.set(GregorianCalendar.MILLISECOND, 0);
	return calendar.getTime();
    }
    
    public static Date convertDateToYearMonthDateFormat(Date date) throws ParseException {
		if (date != null) {
			SimpleDateFormat dateformatYYYYMMDD = new SimpleDateFormat(
					CommonConstants.YEAR_MONTH_DATE_FORMAT);
			String dateString = new StringBuilder(
					dateformatYYYYMMDD.format(date)).toString();
			Date newDate = dateformatYYYYMMDD.parse(dateString);
			return newDate;
		}
		return null;

	}
	
	public String handleHelpUrl(String state) {

	Properties properties = new Properties();
	String redirectUrl = null;

	try {
	    properties.load(Utility.class.getResourceAsStream("/resources/help/Help.properties"));

	    String getCoreUrl = properties.getProperty("coreHelpUrl");
	    String getUrlHelp = properties.getProperty(state);

	    if (getUrlHelp != null && getCoreUrl != null) {
		redirectUrl = getCoreUrl + getUrlHelp;
		// requestContext.getConversationScope().put("HelpRedirectedUrl", redirectUrl);
	    }
	} catch (IOException e) {
		logger.error("", e);
	}
	return redirectUrl;

    }
	
	public static String decimalFormat(RequestContext context, String patternKey, String str){
		String result = CommonConstants.EMPTY_FIELD;
		try{
			Double amount = Double.parseDouble(str);		
			String pattern = getResourceBundleMessage(context, patternKey);
			NumberFormat nf = NumberFormat.getInstance();
			if(nf instanceof DecimalFormat) {
				DecimalFormat df = (DecimalFormat) nf;
			    df.applyPattern(pattern);
			    result = df.format(amount);
			}
		}catch(NumberFormatException e){
			logger.error(e.getMessage());
		}
		return result;
	}
	
	public static String decimalFormat(RequestContext context, String str){
		return decimalFormat(context, CommonConstants.CURRENCY_PATTERN_KEY, str);
	}
	
	public static String moneyFormat(RequestContext context, String str){
		return decimalFormat(context, CommonConstants.CURRENCY_WITH_SYMBOL_PATTERN_KEY, str);
	}
	
	public static String getServiceConfigProperty(RequestContext context, String key) {
    	ApplicationContext appContext = context.getActiveFlow().getApplicationContext();
		Properties properties = (Properties) appContext.getBean("serviceConfig");

		return (String) properties.getProperty(key);

	}
	
	public static String stackTraceToString(Throwable e) {

		StringBuilder sb = new StringBuilder();
		for (StackTraceElement element : e.getStackTrace()) {
			sb.append(element.toString());
			sb.append("\n");

		}
		return sb.toString();
	}

	static String  ftpFileFilter = "ASB7PF1_ASB7PF1";
	static FileFilter filefilter = new FileFilter() {
		public boolean accept(File file) {
			if (file.getName().startsWith(ftpFileFilter)) {
				return true;
			}
			return false;
		}
	};
	public static String myListFiles(String folderLoc){
		File directory = new File(folderLoc);

		if (!directory.isDirectory()) {
			System.out.println("No directory provided");
		}

		File[] files = directory.listFiles(filefilter);
		File lastModifiedFile = null;
		for (int i = 0; i < files.length; i++) {
			lastModifiedFile = files[0];
			if (lastModifiedFile.lastModified() < files[i].lastModified()) {
				lastModifiedFile = files[i];
			}
		}
		
		if(lastModifiedFile!=null)
			return lastModifiedFile.getName();
		else
			return "";
	}
	
}
