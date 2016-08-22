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
package com.csc.cscip.ux.common.services.util;

import javax.faces.context.FacesContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.integration.Message;
import org.springframework.integration.MessageChannel;
import org.springframework.integration.core.PollableChannel;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.integration.support.channel.BeanFactoryChannelResolver;
import org.springframework.integration.support.channel.ChannelResolver;
import org.springframework.web.jsf.FacesContextUtils;

import com.csc.cscip.ux.common.util.Utility;

public class WebServiceClient {

	private static final Logger logger = LoggerFactory
			.getLogger(WebServiceClient.class);

	public WebServiceClient() {
		// TODO Auto-generated constructor stub
	}

	public ClassPathXmlApplicationContext getContextPath(String configurationXML) {

		ClassPathXmlApplicationContext context = null;

		// try {
		context = new ClassPathXmlApplicationContext(configurationXML);

		// } catch (Exception e) {
		// logger.error("", e);
		// }

		return context;
	}

	public ClassPathXmlApplicationContext getContextPath(String configurationXML, String serviceoperationName) throws Exception{

		ClassPathXmlApplicationContext context = null;

		try {
			ApplicationContext webContext = FacesContextUtils.getWebApplicationContext(FacesContext.getCurrentInstance());
			WsdlUtility wsdlUtility = (WsdlUtility) webContext.getBean("wsdlUtility");
			if (wsdlUtility == null) {
				return null;
			}
			URLConfig urlConfig = wsdlUtility.getUrlConfigMap().get(serviceoperationName);

			logger.info("****************** URLConfig ************" + urlConfig);
			logger.info("****************** URLConfig :Operation Action ************" + urlConfig.getOperationAction());
			logger.info("****************** URLConfig :Target URL ******************" + urlConfig.getTargetURL());
			logger.info("****************** URLConfig :TO URL ******************" + urlConfig.getToURL());

			if (urlConfig == null || urlConfig.getOperationAction() == null || urlConfig.getTargetURL() == null || urlConfig.getToURL() == null) {
				return null;
			}

			GenericApplicationContext copyContext = new GenericApplicationContext();
			copyContext.getBeanFactory().registerSingleton("urlConfig", urlConfig);
			copyContext.refresh();
			context = new ClassPathXmlApplicationContext(new String[] { configurationXML }, copyContext);

		} catch (NullPointerException e) {
			logger.error("", e);
			throw new NullPointerException(Utility.getResourceBundleMessage("error.message.infrastructure.service.unavailable", new Object[] {serviceoperationName}));
		}

		return context;
	}

	// Send the Message to the handler's input channel
	public void sendRequesttoService(ClassPathXmlApplicationContext context,String requestXML, String inputChannel) throws Exception {

		ChannelResolver channelResolver = new BeanFactoryChannelResolver(
				context);
		Message<?> message = MessageBuilder.withPayload(requestXML).build();
		// logger.info("\nRequest Message :\n" + message + "\n");

		// Send the Message to the handler's input channel
		MessageChannel channel = channelResolver.resolveChannelName(inputChannel);
		channel.send(message);

	}

	// get response from outputchannel of spring integration layer
	public static String getResponse(ClassPathXmlApplicationContext context,String outputChannel) throws Exception {

		// get response from outputchannel of spring integration layer
		PollableChannel output = (PollableChannel) context.getBean(outputChannel);

		Message<?> response = output.receive(5000);
		// logger.info("\nResponse :\n" + response.getPayload().toString()+
		// "\n");

		return (response != null) ? response.getPayload().toString() : null;
	}

}
