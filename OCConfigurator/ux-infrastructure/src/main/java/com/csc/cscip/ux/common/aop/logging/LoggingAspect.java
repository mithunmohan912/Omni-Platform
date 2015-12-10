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

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

	CommonsLogger logger = new CommonsLogger();

	// invoked when method throws exception
	public void logExceptions(JoinPoint currentJp, Throwable ex) {
		try {
			String name = currentJp.getSignature().getName();
			Class<? extends Object> joinpointClass = currentJp.getTarget() != null ? currentJp
					.getTarget().getClass() : Log.class;

			logger.log(
					LogLevel.ERROR,
					joinpointClass,
					ex,
					"[ exception thrown < {0} > exception message {1} with params {2} ]",
					name, ex.getMessage(),
					constructArgumentsString(currentJp.getArgs()));						

		} catch (Exception e) {
			logger.log(LogLevel.ERROR, LoggingAspect.class, e, null,
					(Object[]) null);
		}
	}

	// return string value of class and arguments
	private String constructArgumentsString(Object... arguments) {

		StringBuffer buffer = new StringBuffer();
		for (Object object : arguments) {
			buffer.append(object);
			buffer.append(',');
		}

		return buffer.toString();
	}
}
