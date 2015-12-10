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
package com.csc.cscip.ux.common.aop.exception;

import java.util.LinkedList;

import javax.faces.context.FacesContext;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.jsf.FacesContextUtils;

import com.csc.cscip.ux.common.aop.exception.utils.ExceptionTools;
import com.csc.cscip.ux.common.aop.logging.LoggingAspect;
import com.csc.cscip.ux.common.util.ExceptionMessenger;

//@Aspect
public class ExceptionHandler {
	
    private ExceptionMessenger exceptionMessenger = new ExceptionMessenger();
	
	private LinkedList<Throwable> exceptionList = new LinkedList<Throwable>();
	
	//@Pointcut("execution(public * *.*(..)) ")
	public void methodExecution() {
	}

	//@Pointcut("within(com.csc.cscip.ux.common..*)")
	public void infrastructure() {
	}

	//@Pointcut("infrastructure() && methodExecution()")
	public void ExceptionHandlingAspectServletLevel() {
	}

	//@AfterThrowing(pointcut = "ExceptionHandlingAspectServletLevel()", throwing = "ex")
	public void handleExceptions(final JoinPoint currentJp, Throwable ex) throws Exception {
		try{
			String message = ExceptionTools.getExceptionMessage(ex);
			if (ex != null) {
				if (message == null || message.isEmpty() || message.equals("null")) {
					message = ExceptionTools.getExceptionMessage(ex);
				}
				if (message == null || message.isEmpty()) {
					message = "Please contact helpdesk.";
				}
				ApplicationContext webContext = FacesContextUtils.getWebApplicationContext(FacesContext.getCurrentInstance());				
				if(webContext != null){
					this.exceptionMessenger = (ExceptionMessenger) webContext.getBean("exceptionMessenger");
					exceptionMessenger.setExceptionQueue(exceptionList);
					this.exceptionList.clear();
				}
				this.exceptionList.add(ex);
				new LoggingAspect().logExceptions(currentJp, ex);
			}
		}catch (Exception e){
			e.printStackTrace();
		}
	}

	//@Around("ExceptionHandlingAspectServletLevel()")
	public Object catchExceptions(ProceedingJoinPoint pjp) throws Throwable {
		Object val = null;
		try {
			val = pjp.proceed();
		} catch (Throwable exception) {
			if (exception instanceof AuthenticationException) {
				throw exception;
			}
		}
		return val;

	}

	public String stackTraceToString(Throwable e) {

		StringBuilder sb = new StringBuilder();
		for (StackTraceElement element : e.getStackTrace()) {
			sb.append(element.toString());
			sb.append("\n");

		}
		return sb.toString();
	}

}
