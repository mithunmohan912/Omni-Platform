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
package com.csc.cscip.ux.common.aop.exception.utils;

import java.io.FileNotFoundException;
import java.net.ConnectException;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.StringTokenizer;

import javax.faces.event.AbortProcessingException;
import javax.xml.parsers.ParserConfigurationException;

import org.springframework.dao.DataAccessException;
import org.springframework.webflow.execution.RequestContext;
import org.springframework.webflow.execution.RequestContextHolder;
import org.xml.sax.SAXException;

import com.csc.cscip.ux.common.exception.BusinessErrorException;
import com.csc.cscip.ux.common.exception.CustomSoapFaultException;
import com.csc.cscip.ux.common.exception.SystemErrorException;
import com.csc.cscip.ux.common.util.CommonConstants;
import com.csc.cscip.ux.common.util.Utility;

public class ExceptionTools {
    public static String getExceptionMessage(Throwable ex) {
    RequestContext requestContext = RequestContextHolder.getRequestContext();
	String message = "";
	while (ex != null) {
			if (ex instanceof BusinessErrorException) {
				message = ex.getMessage();
			} else if (ex instanceof CustomSoapFaultException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ getSoapFaultMessage(ex.getMessage())
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof SystemErrorException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof IllegalStateException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof SQLException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof ConnectException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof DataAccessException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof AbortProcessingException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof FileNotFoundException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof SAXException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof ParseException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof ParserConfigurationException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof java.util.MissingResourceException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof NullPointerException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof RuntimeException) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			} else if (ex instanceof Exception) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ ex.getMessage()
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			}

			if (message == null || message.equalsIgnoreCase("null")) {
				message = Utility.getResourceBundleMessage("error.message.error.occured")
						+ CommonConstants.SPACE_FIELD
						+ CommonConstants.ERROR_LINK_HTML
								.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			}

			ex = ex.getCause();
		}
		return message;

    }
    
    // Method to get the title and the description of the soap fault.
    /*
     * Example of message receive from the soap fault MsgStatusDesc[Loggable System errors occurred during the
     * transaction.] ExtendedStatusDesc [Failed module is BACPHDR. Failed paragraph is 2100-GET-DATA. Failed module
     * SqlCode is 100. Failed module EIBRESP Code is 0. Failed module EIBRESP2 Code is 0. ] ExtendedStatusDesc [Contact
     * your technical support with business services reference id : Z5J2/8PSYP. ]
     * 
     * 
     * MsgStatusDesc[Loggable System errors occurred during the transaction.] ExtendedStatusDesc [Failed module is
     * HALOMCM. Failed paragraph is 1000-ADD-ERROR-PROCESS. Failed module SqlCode is 0. Failed module EIBRESP Code is 0.
     * Failed module EIBRESP2 Code is 0.] ExtendedStatusDesc [Contact your technical support with business services
     * reference id : 18BP/FD0KT. Additional Information: A BUSINESS PROCESS failure has occurred during UOW proces. ]
     */
    public static String getSoapFaultMessage(String messageToFormat) {
	StringBuffer str = new StringBuffer();
	RequestContext requestContext = RequestContextHolder.getRequestContext();
	try {
	    StringTokenizer elements = new StringTokenizer(messageToFormat, "[]");
	    String[] array = new String[elements.countTokens()];

	    int index = 0;
	    boolean flag = true;
	    while (elements.hasMoreTokens()) {
		String item = elements.nextToken();
		if (!item.replaceAll(" ", "").isEmpty()) {
		    array[index] = item;
		    if (flag) {
			flag = false;
		    } else {
			flag = true;
		    }
		    index++;
		}
	    }

	    int lastIndex = index - 1;
	    str.append(array[lastIndex]);

	} catch (Exception ex) {
	    return Utility.getResourceBundleMessage("error.message.error.occured") + CommonConstants.SPACE_FIELD + CommonConstants.ERROR_LINK_HTML.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
	}
	return str.toString();
    }
}
