package com.csc.cscip.ux.common.util;

import java.io.IOException;
import java.io.Serializable;
import java.net.ConnectException;
import java.sql.SQLException;

import javax.faces.context.FacesContext;
import javax.faces.event.AbortProcessingException;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.binding.message.MessageBuilder;
import org.springframework.binding.message.MessageResolver;
import org.springframework.dao.DataAccessException;
import org.springframework.webflow.definition.StateDefinition;
import org.springframework.webflow.engine.RequestControlContext;
import org.springframework.webflow.execution.FlowExecutionException;
import org.springframework.webflow.execution.RequestContext;
import org.springframework.webflow.execution.RequestContextHolder;
import org.springframework.ws.client.WebServiceTransportException;

import com.csc.cscip.ux.common.aop.exception.utils.ExceptionTools;
import com.csc.cscip.ux.common.aop.logging.CommonsLogger;
import com.csc.cscip.ux.common.aop.logging.LogLevel;
import com.csc.cscip.ux.common.aop.logging.LoggingAspect;
import com.csc.cscip.ux.common.exception.BusinessErrorException;
import com.csc.cscip.ux.common.exception.CustomSoapFaultException;
import com.csc.cscip.ux.common.exception.SystemErrorException;

public class ExceptionWebFlowHandler implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	CommonsLogger logger = new CommonsLogger();
	
	private static final Logger log = LoggerFactory.getLogger(ExceptionWebFlowHandler.class);

	public ExceptionWebFlowHandler(){
		
	}
	
	public String handleException(FlowExecutionException flowExecutionException, Throwable ex){
		FacesContext context = FacesContext.getCurrentInstance();
		RequestContext requestContext = RequestContextHolder.getRequestContext();
		RequestControlContext requestControlContext = (RequestControlContext) requestContext;
		
		final String CURRENT_VIEW = "currentState";
		String ERROR_VIEW = "errorState";
		StateDefinition testState = null;
		this.logExceptionErrorDetail(ex);
		String message = "";
		
		while (ex != null) {
		    if (ex instanceof BusinessErrorException) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    } else if (ex instanceof CustomSoapFaultException) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    } else if (ex instanceof SystemErrorException) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    } else if (ex instanceof IllegalStateException) {
		    	System.out.println("IllegalStateException");
		    } else if (ex instanceof SQLException) {
		    	System.out.println("SQLException");
		    } else if (ex instanceof WebServiceTransportException) {
		    	System.out.println("WebServiceTransportException");
		    } else if (ex instanceof ConnectException) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    	try {
		    		FacesContext.getCurrentInstance().getExternalContext().dispatch("/flows/error/error.xhtml");
				} catch (IOException e) {
					e.printStackTrace();
				}
		    	FacesContext.getCurrentInstance().responseComplete();
		    } else if (ex instanceof DataAccessException) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    } else if (ex instanceof AbortProcessingException) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    } else if (ex instanceof java.util.MissingResourceException) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    } else if (ex instanceof NullPointerException) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    } else if (ex instanceof RuntimeException) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    } else if (ex instanceof Exception) {
		    	message = ExceptionTools.getExceptionMessage(ex);
		    }

		    ex = ex.getCause();
		}
		
		MessageResolver msgResolver = null;
		
		msgResolver = new MessageBuilder().error().source(CommonConstants.EXCEPTION_MESSAGE_SOURCE)
				.defaultText(ExceptionTools.getExceptionMessage(ex))
				.build();
		
		testState = requestContext.getActiveFlow().getState((String)requestContext.getConversationScope().get(ERROR_VIEW));
		
		requestContext.getFlowScope().put(CURRENT_VIEW, requestContext.getConversationScope().get(ERROR_VIEW));

		requestContext.getMessageContext().addMessage(msgResolver);
		
		
		log.error("Exception catched: ",ex);
		
		return (String) requestContext.getConversationScope().get(ERROR_VIEW);
	}
	
	public void logExceptionErrorDetail(Throwable ex){
		RequestContext requestContext = RequestContextHolder.getRequestContext();
		try {
			StringBuilder message = new StringBuilder();
			message.append("\nException message: " + ex.getMessage());
			message.append("\nStackTrace: " + ExceptionUtils.getStackTrace(ex));
			requestContext.getConversationScope().put("detailErrorMsg",
					message.toString());
			this.getUserInformation();

		} catch (Exception e) {
			logger.log(LogLevel.ERROR, LoggingAspect.class, e, null,
					(Object[]) null);
			requestContext.getMessageContext().addMessage(new MessageBuilder().error().source("exception_message")
			.defaultText(ExceptionTools.getExceptionMessage(e))
			.build());
		}
	}
	
	private void getUserInformation() {
		RequestContext context = RequestContextHolder.getRequestContext();

		StringBuilder message = new StringBuilder();
		String userMessage = (context.getConversationScope()
				.get("userErrorMsg") == null) ? "" : context
				.getConversationScope().getString("userErrorMsg");
		String billAccount = "[Bill Account Number]";
		String policyNumber = "[Policy Number]";

		message.append("Bill Account number: " + billAccount);
		message.append("\nPolicy number: " + policyNumber);
		message.append("\nServer Date: " + Utility.getCurrentServerDateTime());
		message.append("\n" + userMessage);

		context.getConversationScope().put("userInformationMsg",
				message.toString());
	}
}
