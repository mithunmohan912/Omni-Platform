package com.csc.cscip.ux.common.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.binding.message.Message;
import org.springframework.binding.message.MessageContext;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.webflow.execution.RequestContext;
import org.springframework.webflow.execution.RequestContextHolder;


public class ExternalCustomRequestHandler implements Serializable {

	private static final long serialVersionUID = 1L;
	private boolean hasParams = false;
	private boolean hasErrors = false;
	private boolean consumerFromDL = false;
	private List<String> msgList = new LinkedList<String>();
	private String redirectPage;
	private boolean encryptSwitch = false;
	private Map<String, String[]> savedMap;	
	private static final Logger logger = LoggerFactory.getLogger(ExternalCustomRequestHandler.class);

	@Autowired
    private ExceptionMessenger exceptionMessenger;

	public ExternalCustomRequestHandler() {}

	public void setRequestParameters() throws SecurityException, IOException {
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		HttpServletRequest request = (HttpServletRequest) context.getRequest();

		clearUrlValues();
		checkEncryptSwitch();

		savedMap = request.getParameterMap();

		if (savedMap != null) {
			populateRequestKeys(savedMap);			
		}
	}

	private void populateRequestKeys(Map<String, String[]> savedMap) throws SecurityException, IOException {
		RequestContext requestContext = RequestContextHolder.getRequestContext();
		EncryptTool encrypt = new EncryptTool();
		String query = "";
		String ba = "";
		String pol = "";
		String page = "";
		if (savedMap != null && savedMap.size() > 0) {
			boolean flagCasTicket = false;
			for (Map.Entry<String, String[]> entry : savedMap.entrySet()) {				
				String requestKey = entry.getKey();
				String reqValue[] = entry.getValue();
				if(encryptSwitch){
					if (requestKey.equals("q")) {					
						if(reqValue[0] != null && !reqValue[0].isEmpty()){
							query = reqValue[0];
							String queryDecrypted = encrypt.decrypt(query);
							if(queryDecrypted != null){
								Map<String, String> params = this.getParameters(queryDecrypted); 
								if(this.setParamsFlow(params, requestContext)){							
									requestContext.getConversationScope().put(CommonConstants.FLOW_STATE_HOME, CommonConstants.DIRECT_ACCESS);
									return;
								}
							}else{
								requestContext.getConversationScope().put(CommonConstants.FLOW_STATE_HOME, CommonConstants.DIRECT_ACCESS);
								redirectPage = CommonConstants.CHECK_ERRORS_DIRECTLINK;
								return;
							}						
						}
					}else{
						exceptionMessenger.getErrorQueue().add(Utility.getResourceBundleMessage("error.message.parameter.noexist"));
						requestContext.getConversationScope().put(CommonConstants.FLOW_STATE_HOME, CommonConstants.DIRECT_ACCESS);
						redirectPage = CommonConstants.CHECK_ERRORS_DIRECTLINK;
						return;
					}
				} else {					
					if(requestKey.equals("ba")){
						logger.debug("Bill Account Number: "+reqValue[0]);
						ba = reqValue[0];
						if(!ba.isEmpty())
							requestContext.getConversationScope().put("billNumberForm", ba);
					}
					if(requestKey.equals("pol")){
						logger.debug("Policy Number: "+reqValue[0]);
						pol = reqValue[0];
						if(!pol.isEmpty())
							requestContext.getConversationScope().put("policyNumberForm", pol);			
					}
					if(requestKey.equals("page")){
						logger.debug("Page: "+reqValue[0]);
						page = reqValue[0];
						hasParams = true;
						if(!page.isEmpty())
							redirectPage = getPageToRedirectFromParameter(reqValue[0]);
					}
					if(requestKey.equals("casticket")){
						flagCasTicket = true;
					}
				}
			}
			if(hasParams && !encryptSwitch){
				if( (pol.isEmpty() && ba.isEmpty()) || page.isEmpty() ){
					if(!flagCasTicket){
						exceptionMessenger.getErrorQueue().add(Utility.getResourceBundleMessage("error.message.parameter.noexist"));
						requestContext.getConversationScope().put(CommonConstants.FLOW_STATE_HOME, CommonConstants.DIRECT_ACCESS);
						redirectPage = CommonConstants.CHECK_ERRORS_DIRECTLINK;
						return;
					}
				} else {
					requestContext.getConversationScope().put(CommonConstants.FLOW_STATE_HOME, CommonConstants.DIRECT_ACCESS);
				}
			}
		}
	}
	
	private void checkEncryptSwitch() throws IOException{
		InputStream inStream = null;
		String keyValue = null;
		try {
			String eeProperties = "/resources/directlink/Configuration.properties";
			Properties properties = new Properties();
			inStream = ExternalCustomRequestHandler.class.getResourceAsStream(eeProperties);
			properties.load(inStream);
			keyValue = properties.getProperty("encrypt.parameters");
		} catch (IOException e) {
			throw new IOException("The file Configuration.properties is not presented.");
		} finally {
			inStream.close();
		}
		if(keyValue != null && keyValue.equalsIgnoreCase("YES"))
			this.encryptSwitch=true;
		else
			this.encryptSwitch=false;
	}
	
	/**
	 * Check if a role is present in the authorities of current user
	 * 
	 * @param authorities all authorities assigned to current user
	 * @param role required authority
	 * @return true if role is present in list of authorities assigned to current user, false otherwise
	 */
	public boolean isRolePresent(Collection<GrantedAuthority> authorities, String role) {
		boolean isRolePresent = false;
		for (GrantedAuthority grantedAuthority : authorities) {
			isRolePresent = grantedAuthority.getAuthority().equals(role);
			if (isRolePresent)
				break;
		}
		return isRolePresent;
	}
	
	public boolean isConsumerDL(){
		Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>) SecurityContextHolder.getContext().getAuthentication().getAuthorities(); 
		boolean isConsumerDL = (isRolePresent(authorities, CommonConstants.ROLE_CONSUMER) && hasParams);
		setConsumerFromDL(isConsumerDL);
		clearUrlValues();
		return isConsumerDL;
	}

	private Map<String, String> getParameters(String url){
		Map<String, String> params = new HashMap<String, String>();
		try{
			String[] pairs = url.split("&");
			for(String elem : pairs){
				String[] keyVal = elem.split("=");
				params.put(keyVal[0], keyVal[1]);
			}
		} catch(NullPointerException ex){
			hasErrors = true;
		}
		return params;
	}
	//TODO: Improve the way how to get the parameters from a properties file.
	private boolean setParamsFlow(Map<String, String> params, RequestContext requestContext) throws IOException{
		String ba = "";
		String pol = "";
		String page = "";
		boolean validator = false;
		if(params.containsKey("ba")){
			logger.debug(params.get("ba"));
			ba = params.get("ba");
			if(!ba.isEmpty())
				requestContext.getConversationScope().put("billNumberForm", ba);
		}
		if(params.containsKey("pol")){
			logger.debug(params.get("pol"));
			pol = params.get("pol");
			if(!pol.isEmpty())
				requestContext.getConversationScope().put("policyNumberForm", pol);			
		}
		if(params.containsKey("page")){
			logger.debug(params.get("page"));
			page = params.get("page");
			if(!page.isEmpty())
				redirectPage = getPageToRedirectFromParameter(params.get("page"));
		}
		if( (!pol.isEmpty() || !ba.isEmpty()) && redirectPage != null ){
			validator = true;
		}
		return validator;
	}
	
	private String getPageToRedirectFromParameter(String parameter) throws IOException{
		InputStream inStream = null;
		String inputChannel = null;
		try {
			String eeProperties = "/resources/directlink/DirectLink.properties";
			Properties properties = new Properties();
			inStream = ExternalCustomRequestHandler.class.getResourceAsStream(eeProperties);
			properties.load(inStream);
			inputChannel = properties.getProperty(parameter);
		} catch (IOException e) {
			throw new IOException("The file DirectLink.properties is not presented.");
		} finally {
			inStream.close();
		}
		if(inputChannel == null){
			exceptionMessenger.getErrorQueue().add(Utility.getResourceBundleMessage("error.message.parameter.noexist"));
			inputChannel = CommonConstants.CHECK_ERRORS_DIRECTLINK;
		}
		return inputChannel;
	}
	
	public String checkExceptions(RequestContext requestContext){
		if(hasParams){
			MessageContext messageContext = requestContext.getMessageContext();
			for(Message msg : messageContext.getAllMessages()){
				exceptionMessenger.getErrorQueue().add(msg.getText());
			}
			hasErrors = true;
			requestContext.getConversationScope().put(CommonConstants.ERROR_STATE, CommonConstants.ERROR_PAGE_ID);
		}		
		return "success";
	}
	
	/**
	 * Clear the request values for another subsequent requests.
	 */
	public void clearUrlValues() {
		hasParams = false;
		hasErrors = false;
	}
	
	/**
	 * Getters and Setters
	 * 
	 * @return
	 */
	public boolean isHasParams() {
		return hasParams;
	}

	public void setHasParams(boolean hasParams) {
		this.hasParams = hasParams;
	}

	public Map<String, String[]> getSavedMap() {
		return savedMap;
	}

	public void setSavedMap(Map<String, String[]> savedMap) {
		this.savedMap = savedMap;
	}
	
	public String getRedirectPage() {
		return redirectPage;
	}

	public void setRedirectPage(String redirectPage) {
		this.redirectPage = redirectPage;
	}

	public boolean isHasErrors() {
		return hasErrors;
	}

	public void setHasErrors(boolean hasErrors) {
		this.hasErrors = hasErrors;
	}

	public List<String> getMsgList() {
		return msgList;
	}

	public void setMsgList(List<String> msgList) {
		this.msgList = msgList;
	}

	public boolean isConsumerFromDL() {
		return consumerFromDL;
	}

	public void setConsumerFromDL(boolean consumerFromDL) {
		this.consumerFromDL = consumerFromDL;
	}

}
