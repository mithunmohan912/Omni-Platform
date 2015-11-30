package com.csc.cscip.ux.common.util;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;

import org.springframework.binding.message.MessageBuilder;
import org.springframework.binding.message.MessageResolver;
import org.springframework.stereotype.Component;
import org.springframework.webflow.execution.RequestContext;
import org.springframework.webflow.execution.RequestContextHolder;

import com.csc.cscip.ux.common.aop.exception.utils.ExceptionTools;
import com.csc.cscip.ux.common.exception.CustomSoapFaultException;

@Component
public class ExceptionMessenger implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private List<String> errorQueue = new LinkedList<String>();
	
	private String userDetail;
	private String stackTrace;
	
	private List<Throwable> exceptionQueue = new LinkedList<Throwable>();
	
	public ExceptionMessenger(){}

	public boolean showQueue(){
		RequestContext context = RequestContextHolder.getRequestContext();
		FacesContext ctx = FacesContext.getCurrentInstance();
		boolean success = true;
		for(FacesMessage it : ctx.getMessageList()){
			MessageResolver msgResolver = null;
			msgResolver = new MessageBuilder().error().source(CommonConstants.EXCEPTION_MESSAGE_SOURCE)
					.defaultText(it.getDetail())
					.build();
			context.getMessageContext().addMessage(msgResolver);
			if(!it.getDetail().isEmpty()){
				success = false;
			}
		}
		return success;
	}
	
	public void exposeExceptionQueue(){
		if(exceptionQueue.size() > 0){
			MessageResolver msgResolver = null;
			RequestContext requestContext = RequestContextHolder.getRequestContext();		
			StringBuilder message = new StringBuilder();
			StringBuilder exMessages = new StringBuilder();
			// Appending the details of the exception into the error modal 
			String[] msgsArray = extractMessageFromExceptionQueue(exceptionQueue); 
			message.append(msgsArray[1]);
			exMessages.append(msgsArray[0]);
			
			setUserInformation(exMessages);
			requestContext.getConversationScope().put(CommonConstants.DETAIL_ERROR_MESSAGE_ID, message.toString());
			String messageToUser = Utility.getResourceBundleMessage("error.message.error.occured")
					+ CommonConstants.ERROR_LINK_HTML
							.replaceAll("ERRORMSG", Utility.getResourceBundleMessage("error.message.link.message"));
			msgResolver = new MessageBuilder().error().source(CommonConstants.EXCEPTION_MESSAGE_SOURCE)
					.defaultText(messageToUser)
					.build();
			requestContext.getMessageContext().addMessage(msgResolver);
			exceptionQueue.clear();
		}
	}
	
	public void exposeExceptionQueueErrorPage(Throwable exception){
		RequestContext requestContext = RequestContextHolder.getRequestContext();		
		StringBuilder message = new StringBuilder();
		StringBuilder exMessages = new StringBuilder();
		
		String exMsg = (exception == null)?Utility.getResourceBundleMessage("error.message.exception.nomessage"):exception.getMessage();
		
		message.append(Utility.getResourceBundleMessage("error.page.stacktrace.message.label")+ CommonConstants.SPACE_FIELD + exMsg);
		message.append(Utility.getResourceBundleMessage("error.page.stacktrace.label") + CommonConstants.SPACE_FIELD + Utility.stackTraceToString(exception));
		
		exMessages.append(Utility.getResourceBundleMessage("error.page.stacktrace.message.label") + CommonConstants.SPACE_FIELD + exMsg);
		
		if(exceptionQueue.size() > 0){			
			String[] msgsArray = extractMessageFromExceptionQueue(exceptionQueue); 
			message.append(msgsArray[1]);
			exMessages.append(msgsArray[0]);
		}		
		exceptionQueue.clear();					
		
		requestContext.getConversationScope().put(CommonConstants.DETAIL_ERROR_MESSAGE_ID, message.toString());
		
		setUserInformation(exMessages);
		setStackTrace(message.toString());
	}
	
	public void exposeExceptionMessagesDirectLink(RequestContext requestContext){
		List<String> auxQueue = new LinkedList<String>();
		auxQueue.addAll(errorQueue);
		if(exceptionQueue.size() > 0){
			for(Throwable ex : this.exceptionQueue){
				auxQueue.add(getExceptionMessage(ex));
			}
			exceptionQueue.clear();
		}
		requestContext.getFlashScope().put("errorsQueue", auxQueue);
		errorQueue.clear();
	}
	
	private String[] extractMessageFromExceptionQueue(List<Throwable> exceptionQueue){
		String[] msgArray = new String[2];
		StringBuilder message = new StringBuilder();
		StringBuilder stackTrace = new StringBuilder();
		for(Throwable ex : this.exceptionQueue){
			String exMsg = (ex.getMessage() == null)?Utility.getResourceBundleMessage("error.message.exception.nomessage"):ex.getMessage();
			message.append(Utility.getResourceBundleMessage("error.page.stacktrace.message.label")+ CommonConstants.SPACE_FIELD + exMsg);			
			stackTrace.append(Utility.getResourceBundleMessage("error.page.stacktrace.label") + CommonConstants.SPACE_FIELD + Utility.stackTraceToString(ex));
		}
		msgArray[0] = message.toString();
		msgArray[1] = stackTrace.toString();
		return msgArray;		
	}
	
	private String getExceptionMessage(Throwable ex){
		if(isRootCause(ex)){
			if(ex instanceof CustomSoapFaultException){
				return ExceptionTools.getSoapFaultMessage(ex.getMessage());
			}
			return (ex.getMessage()!=null)?ex.getMessage():Utility.getResourceBundleMessage("error.message.exception.nomessage");
		} else {
			return getExceptionMessage(ex.getCause());
		}
	}
	
	private boolean isRootCause(Throwable t) {
		return t.getCause() == null;
	}

	private void setUserInformation(StringBuilder exMessages) {
		RequestContext context = RequestContextHolder.getRequestContext();

		StringBuilder message = new StringBuilder();
		String userMessage = (context.getConversationScope().get(CommonConstants.USER_ERROR_MESSAGE_ID) == null) ? "" : context.getConversationScope().getString(CommonConstants.USER_ERROR_MESSAGE_ID);

		message.append(Utility.getResourceBundleMessage("error.page.serverdate.label") + CommonConstants.SPACE_FIELD + Utility.getCurrentServerDateTime());
		message.append(exMessages.toString());
		message.append("\n" + userMessage);

		context.getConversationScope().put(CommonConstants.USER_INFO_ERROR_MESSAGE, message.toString());
		setUserDetail(message.toString());
	}
	
	public boolean thereIsExceptions(){
		return (this.exceptionQueue.size() > 0)?true:false;
	}
	
	public boolean isErrorOnQueue(){
		return (FacesContext.getCurrentInstance().getMessageList().isEmpty()) ? false : true;
	}

	public List<Throwable> getExceptionQueue() {
		return exceptionQueue;
	}

	public void setExceptionQueue(List<Throwable> exceptionQueue) {
		this.exceptionQueue = exceptionQueue;
	}
	
	public List<String> getErrorQueue() {
		return errorQueue;
	}

	public void setErrorQueue(List<String> errorQueue) {
		this.errorQueue = errorQueue;
	}
	
	public void cleanErrorQueue(){
		this.errorQueue = new LinkedList<String>();
	}

	public String getUserDetail() {
		return userDetail;
	}

	public void setUserDetail(String userDetail) {
		this.userDetail = userDetail;
	}

	public String getStackTrace() {
		return stackTrace;
	}

	public void setStackTrace(String stackTrace) {
		this.stackTrace = stackTrace;
	}
}
