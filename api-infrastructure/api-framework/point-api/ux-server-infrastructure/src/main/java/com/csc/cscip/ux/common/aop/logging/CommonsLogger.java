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
package com.csc.cscip.ux.common.aop.logging;

import java.text.MessageFormat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CommonsLogger implements Log {

    // Check whether a log level
    public boolean isLogLevel(LogLevel logLevel, Class<?> clazz) {
	boolean result = false;

	switch (logLevel) {
	case DEBUG:
	    result = getLogger(clazz).isDebugEnabled();
	case ERROR:
	    result = getLogger(clazz).isErrorEnabled();
	case INFO:
	    result = getLogger(clazz).isInfoEnabled();
	case TRACE:
	    result = getLogger(clazz).isTraceEnabled();
	case WARN:
	    result = getLogger(clazz).isWarnEnabled();
	default:
	    result = false;
	}
	return result;
    }

    // Invoking logging level based on input
    public void log(LogLevel logLevel, Class<?> joinpointClass, Throwable throwable, String pattern,
	    Object... arguments) {

	switch (logLevel) {
	case INFO:
	    getLogger(joinpointClass).info(format(pattern, arguments), throwable);
	    break;
	case DEBUG:
	    getLogger(joinpointClass).debug(format(pattern, arguments), throwable);
	    break;
	case ERROR:
	    getLogger(joinpointClass).error(format(pattern, arguments), throwable);
	    break;
	case TRACE:
	    getLogger(joinpointClass).trace(format(pattern, arguments), throwable);
	    break;
	case WARN:
	    getLogger(joinpointClass).warn(format(pattern, arguments), throwable);
	    break;
	}
    }

    // Formatting the string format
    private String format(String pattern, Object... arguments) {
	return MessageFormat.format(pattern, arguments);
    }

    // Retrieving the Log Class
    private Logger getLogger(Class<?> clazz) {

	return LoggerFactory.getLogger(clazz);

    }
}
