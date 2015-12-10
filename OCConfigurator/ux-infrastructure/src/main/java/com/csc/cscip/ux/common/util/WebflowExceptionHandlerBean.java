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

import java.io.FileNotFoundException;
import java.net.ConnectException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.MissingResourceException;

import javax.faces.event.AbortProcessingException;
import javax.persistence.PersistenceException;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.lang3.StringUtils;
import org.apache.taglibs.standard.lang.jstl.ELException;
import org.hibernate.exception.JDBCConnectionException;
import org.postgresql.util.PSQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.binding.expression.Expression;
import org.springframework.binding.expression.support.LiteralExpression;
import org.springframework.binding.message.MessageBuilder;
import org.springframework.binding.message.MessageResolver;
import org.springframework.dao.DataAccessException;
import org.springframework.expression.ExpressionInvocationTargetException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.util.Assert;
import org.springframework.web.util.NestedServletException;
import org.springframework.webflow.definition.StateDefinition;
import org.springframework.webflow.engine.ActionList;
import org.springframework.webflow.engine.FlowExecutionExceptionHandler;
import org.springframework.webflow.engine.RequestControlContext;
import org.springframework.webflow.engine.TargetStateResolver;
import org.springframework.webflow.engine.Transition;
import org.springframework.webflow.engine.ViewState;
import org.springframework.webflow.engine.support.DefaultTargetStateResolver;
import org.springframework.webflow.engine.support.DefaultTransitionCriteria;
import org.springframework.webflow.execution.ActionExecutionException;
import org.springframework.webflow.execution.FlowExecutionException;
import org.xml.sax.SAXException;

import com.csc.cscip.ux.common.aop.exception.utils.ExceptionTools;
import com.csc.cscip.ux.common.exception.BusinessErrorException;
import com.csc.cscip.ux.common.exception.CustomSoapFaultException;
import com.csc.cscip.ux.common.exception.SystemErrorException;

@Component
public class WebflowExceptionHandlerBean implements FlowExecutionExceptionHandler{

	private static final Logger log = LoggerFactory.getLogger(WebflowExceptionHandlerBean.class);
	
	private Map exceptionTargetStateMap = new HashMap();
	
	private ActionList actionList = new ActionList();
	
	@Autowired
	ExceptionMessenger exceptionMessenger;
	
	public ActionList getActionList() {
		return actionList;
	}

	@Override
	public boolean canHandle(FlowExecutionException exception) {
		return getTargetStateResolver(exception) != null;		
	}

	@Override
	public void handle(FlowExecutionException exception, RequestControlContext context) {
		try{
			if (log.isDebugEnabled()) {
				log.debug("Handling flow execution exception " + exception, exception);
			}			
			actionList.execute(context);
			if(this.findBusinessException(exception) == null){
				exceptionMessenger.exposeExceptionQueueErrorPage(exception.getCause());
				context.execute(new Transition(getTargetStateResolver(exception)));
			} else {
				StateDefinition testState = null;
				String lastView = "";
				BusinessErrorException be = this.findBusinessException(exception);
				MessageBuilder messageBuilder = null;
				MessageResolver msgResolver = null;
				
				if (be != null && be.isKeepState()) {
					switch (be.getMessageType()) {
					case INFO:
						messageBuilder = new MessageBuilder().info();
						break;
					case WARNING:
						messageBuilder = new MessageBuilder().warning();
						break;
					case ERROR:
						messageBuilder = new MessageBuilder().error();
						break;
					}

					msgResolver = messageBuilder.source(CommonConstants.EXCEPTION_MESSAGE_SOURCE)
							.defaultText(ExceptionTools.getExceptionMessage(be))
							.build();

					testState = context.getCurrentState();
					if (testState == null || !(testState instanceof ViewState)) {
						lastView = (String) context.getConversationScope().get(CommonConstants.CURRENT_STATE);
						if (StringUtils.isNotBlank(lastView)) {
							testState = context.getActiveFlow().getState(lastView);
						}
					} else {
						lastView = testState.getId();
					}					
				} else {
					msgResolver = new MessageBuilder().error().source(CommonConstants.EXCEPTION_MESSAGE_SOURCE)
							.defaultText(ExceptionTools.getExceptionMessage(be))
							.build();
					testState = context.getActiveFlow().getState((String)context.getConversationScope().get(CommonConstants.ERROR_STATE));
					context.getConversationScope().put(CommonConstants.CURRENT_STATE, context.getConversationScope().get(CommonConstants.ERROR_STATE));
				}
				
				context.getMessageContext().addMessage(msgResolver);
				Expression event = new LiteralExpression("renderErrorMessage");
				context.execute(new Transition(new DefaultTransitionCriteria(event), new DefaultTargetStateResolver(lastView)));
			}
		} catch (Exception ex){
			try{
				context.getMessageContext().addMessage(new MessageBuilder().error().source(CommonConstants.EXCEPTION_MESSAGE_SOURCE).defaultText(ex.getMessage()).build());
				context.execute(new Transition(new DefaultTargetStateResolver(CommonConstants.TRANSITION_HOME_ID)));
			} catch (Exception e){
				context.getMessageContext().addMessage(new MessageBuilder().error().source(CommonConstants.EXCEPTION_MESSAGE_SOURCE).defaultText(e.getMessage()).build());
				context.execute(new Transition(new DefaultTargetStateResolver(CommonConstants.TRANSITION_MAIN_MENU_ID)));
			}
		}
	}
	
	/**
	 * Check if given exception is the root of the exception cause chain. For use with JDK 1.4 or later.
	 */
	private boolean isRootCause(Throwable t) {
		return t.getCause() == null;
	}
	
	/**
	 * Find the mapped target state resolver for given exception. Returns <code>null</code> if no mapping can be found
	 * for given exception. Will try all exceptions in the exception cause chain.
	 */
	protected TargetStateResolver getTargetStateResolver(Throwable e) {
		TargetStateResolver targetStateResolver;
		if (isRootCause(e)) {
			return findTargetStateResolver(e.getClass());
		} else {
			targetStateResolver = (TargetStateResolver) exceptionTargetStateMap.get(e.getClass());			
			if (targetStateResolver != null) {
				return targetStateResolver;
			} else {
				return getTargetStateResolver(e.getCause());
			}
		}
	}
	
	/**
	 * Try to find a mapped target state resolver for given exception type. Will also try to lookup using the class
	 * hierarchy of given exception type.
	 * @param exceptionType the exception type to lookup
	 * @return the target state id or null if not found
	 */
	private TargetStateResolver findTargetStateResolver(Class exceptionType) {
		while (exceptionType != null && exceptionType != Object.class) {
			if (exceptionTargetStateMap.containsKey(exceptionType)) {
				return (TargetStateResolver) exceptionTargetStateMap.get(exceptionType);
			} else {
				exceptionType = exceptionType.getSuperclass();
			}
		}
		return null;
	}
	
	/**
	 * Adds an exception-to-target state mapping to this handler.
	 * @param exceptionClass the type of exception to map
	 * @param targetStateId the id of the state to transition to if the specified type of exception is handled
	 * @return this handler, to allow for adding multiple mappings in a single statement
	 */
	public WebflowExceptionHandlerBean add(Class exceptionClass, String targetStateId) {	
		return add(exceptionClass, new DefaultTargetStateResolver(targetStateId));
	}

	/**
	 * Adds a exception-to-target state resolver mapping to this handler.
	 * @param exceptionClass the type of exception to map
	 * @param targetStateResolver the resolver to calculate the state to transition to if the specified type of
	 * exception is handled
	 * @return this handler, to allow for adding multiple mappings in a single statement
	 */
	public WebflowExceptionHandlerBean add(Class exceptionClass, TargetStateResolver targetStateResolver) {
		Assert.notNull(exceptionClass, "The exception class is required");
		Assert.notNull(targetStateResolver, "The target state resolver is required");
		exceptionTargetStateMap.put(exceptionClass, targetStateResolver);
		return this;
	}
	
	public void init() {
		this.add(ELException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(Exception.class, CommonConstants.ERROR_PAGE_ID);
		this.add(CustomSoapFaultException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(SystemErrorException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(IllegalStateException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(SQLException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(DataAccessException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(AbortProcessingException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(FileNotFoundException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(SAXException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(ParserConfigurationException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(MissingResourceException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(NullPointerException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(OutOfMemoryError.class, CommonConstants.ERROR_PAGE_ID); 
		this.add(CustomSoapFaultException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(NestedServletException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(ActionExecutionException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(JDBCConnectionException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(PSQLException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(ConnectException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(ExpressionInvocationTargetException.class, CommonConstants.ERROR_PAGE_ID);
		this.add(PersistenceException.class, CommonConstants.ERROR_PAGE_ID);	
		this.add(CannotCreateTransactionException.class, CommonConstants.ERROR_PAGE_ID);
	}
	
	/**
	 * Find if the exception caught is BusinessErrorException
	 * @param ex exception caught by the WebflowExceptionHandlerBean
	 * @return BusinessErrorException or null if the exception is 
	 */
	private BusinessErrorException findBusinessException(FlowExecutionException ex) {
		Throwable cause = ex.getCause();
		while (cause != null) {
			if (cause instanceof BusinessErrorException) {
				return (BusinessErrorException) cause;
			}
			cause = cause.getCause();
		}
		return null;
	}
	
	public WebflowExceptionHandlerBean(){}

}
