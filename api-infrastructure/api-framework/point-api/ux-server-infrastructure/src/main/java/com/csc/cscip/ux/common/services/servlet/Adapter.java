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
package com.csc.cscip.ux.common.services.servlet;

import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.webflow.execution.RequestContext;

import com.csc.cscip.ux.common.services.rest.AccountInquireAdapter;
import com.csc.cscip.ux.common.services.util.ApplicationMapper;

public class Adapter {

	private static final long serialVersionUID = -7439093716499175324L;
	private static final Logger logger = LoggerFactory.getLogger(Adapter.class);

	private User user;
	private WebAuthenticationDetails webDetails;

//	private Account account;
	private InputStream inStream = null;
	private List<String> paymentTypeValues = new ArrayList<String>();
	private Map<String, String> statesCodes = new LinkedHashMap<String, String>();

	private ApplicationMapper applicationMapper;
	private AccountInquireAdapter adapter;
	private RequestContext requestContext;
	private String policyNumber;
	private String billingAccountNumber;

	public Adapter() {
	}

	public void test() {
	}

//	public void createSpecificAdapter(FacesContext facesContext)
//			throws Exception {
//
//		logger.info("Getting the responses from the AccountInquire service.");
//		ApplicationContext context = FacesContextUtils
//				.getWebApplicationContext(facesContext);
//
//		ApplicationMapper applicationMapper = (ApplicationMapper) context
//				.getBean("applicationMapper");
//
//		this.adapter = new AccountInquireAdapter();
//
//		FacesContext.getCurrentInstance().renderResponse();
//		RequestContext requestContext = RequestContextHolder
//				.getRequestContext();
//
//		BillingInfo billingInfo = (BillingInfo) requestContext.getFlowScope()
//				.get(Constants.BILLINGINFO_FLOW);
//		String billAccountFirst = billingInfo.getAccount().getAccountNumber();
//
//		Policy policy = (Policy) requestContext.getFlowScope().get("policy");
//		String policyFirst = policy.getPolicyNumber();
//
//		String policyNumber = policyFirst;
//		String billingAccountNumber = billAccountFirst;
//
//		this.applicationMapper = applicationMapper;
//		this.requestContext = requestContext;
//
//		this.policyNumber = policyFirst;
//		this.billingAccountNumber = billingAccountNumber;
//
//		logger.info("Using billingAccountNumber: " + billingAccountNumber
//				+ " and Policy number: " + policyNumber);
//		// Getting the response from AccountInquire -> Account Information
//		/*
//		 * // Creating the request object with the bill account number Object
//		 * requestObject = (Object)
//		 * this.getBillingAccountRetrieveRq(billingAccountNumber, policyNumber);
//		 * 
//		 * // Creating the request XML marshalling the requestObject String
//		 * requestXML = applicationMapper.convertObjectToXML(requestObject);
//		 * 
//		 * // Getting the response XML as String responseAaccountInformation =
//		 * adapter.accountService(requestXML);
//		 * 
//		 * // UnMarshalling the response XML this.billingResponse =
//		 * (ComCscBillingAccountRetrieveRs) applicationMapper
//		 * .convertXMLToObjects(responseAaccountInformation);
//		 */
//		/*
//		 * responseAccountSummaryInquire =
//		 * adapter.accountSummaryInquireService(applicationMapper
//		 * .convertObjectToXML((Object)
//		 * this.getAccountSummaryInquireRq(billingAccountNumber,
//		 * policyNumber)));
//		 * 
//		 * setAccountSummaryInquireResponse((ComCscAccountSummaryInquireRs)
//		 * applicationMapper
//		 * .convertXMLToObjects(responseAccountSummaryInquire));
//		 * 
//		 * responsePolicyAgreementInquire =
//		 * adapter.billingPolicyAgreementInquireService(applicationMapper
//		 * .convertObjectToXML((Object) this
//		 * .getBillingPolicyAgreementInquireRq(billingAccountNumber,
//		 * policyNumber))); setBillingPolicyAgreementInquireResponse((
//		 * ComCscBillingPolicyAgreementInquireRs) applicationMapper
//		 * .convertXMLToObjects(responsePolicyAgreementInquire));
//		 * 
//		 * responseAccountReceiptInquire = adapter
//		 * .billingAccountReceiptsInquireService
//		 * (applicationMapper.convertObjectToXML((Object) this
//		 * .getBillingAccountReceiptInquireRq(billingAccountNumber,
//		 * policyNumber))); setBillingAccountReceiptsInquireResponse((
//		 * ComCscBillingAccountReceiptsInquireRs) applicationMapper
//		 * .convertXMLToObjects(responseAccountReceiptInquire));
//		 * 
//		 * responseScheduleInquire =
//		 * adapter.billingScheduleInquireService(applicationMapper
//		 * .convertObjectToXML((Object)
//		 * this.getBillingScheduleInquireRq(billingAccountNumber,
//		 * policyNumber)));
//		 * setBillingScheduleInquireResponse((ComCscBillingScheduleInquireRs)
//		 * applicationMapper .convertXMLToObjects(responseScheduleInquire));
//		 */
//
//		// setupCommentIconInfo(requestContext); // build the url for Comment
//		// icon on all pages.
//		/*
//		 * DozerBeanMapper dozerMapper = (DozerBeanMapper)
//		 * context.getBean("dozerMapper");
//		 * 
//		 * Account account =
//		 * dozerMapper.map(billingResponse.getComCscBillingAccountInfo(),
//		 * Account.class);
//		 * 
//		 * logger.info("Account number value :::::::: " +
//		 * account.getAccountNumber());
//		 * 
//		 * logger.info("Account Billing Status Cd :::::::: " +
//		 * account.getBillingInfo().getBillingAccountStatusCd());
//		 */
//
//	}

	public AccountInquireAdapter getAdapter() {
		return adapter;
	}

	public void setAdapter(AccountInquireAdapter adapter) {
		this.adapter = adapter;
	}

	public ApplicationMapper getApplicationMapper() {
		return applicationMapper;
	}

	public void setApplicationMapper(ApplicationMapper applicationMapper) {
		this.applicationMapper = applicationMapper;
	}

//	public void createSpecificAdapterAccountInformation(
//			FacesContext facesContext) throws Exception {
//		ApplicationContext context = FacesContextUtils
//				.getWebApplicationContext(facesContext);
//
//		ApplicationMapper applicationMapper = (ApplicationMapper) context
//				.getBean("applicationMapper");
//		// ApplicationMapperPayment applicationMapper =
//		// (ApplicationMapperPayment)
//		// context.getBean("applicationMapperPayment");
//		AccountInquireAdapter adapter = new AccountInquireAdapter();
//
//		FacesContext.getCurrentInstance().renderResponse();
//		RequestContext requestContext = RequestContextHolder
//				.getRequestContext();
//
//		BillingInfo billingInfo = (BillingInfo) requestContext.getFlowScope()
//				.get(Constants.BILLINGINFO_FLOW);
//		String billAccountFirst = billingInfo.getAccount().getAccountNumber();
//
//		Policy policy = (Policy) requestContext.getFlowScope().get("policy");
//		String policyFirst = policy.getPolicyNumber();
//
//		String policyNumber = policyFirst;
//		String billingAccountNumber = billAccountFirst;
//
//		logger.info(policyNumber + " - " + billingAccountNumber);
//
//		String requestAaccountInformation = applicationMapper
//				.convertObjectToXML(MessageAccountSummary
//						.getBillingAccountRetrieveRq(billingAccountNumber,
//								policyNumber));
//
//		logger.debug("Account Information Request ***** "
//				+ requestAaccountInformation);
//
//		responseAaccountInformation = adapter.accountInquireService(
//				requestAaccountInformation,
//				Constants.ACCOUNTINQUIRE_ACCOUNTINFORMATION);
//
//		logger.debug("Account Information Response ***** "
//				+ responseAaccountInformation);
//
//		if (responseAaccountInformation == null) {
//			return;
//		}
//
//		setBillingResponse((ComCscBillingAccountRetrieveRs) applicationMapper
//				.convertXMLToObjects(responseAaccountInformation));
//
//		// setupCommentIconInfo(requestContext); // set up the icon and url for
//		// Comment icon on all pages.
//
//	}

	public void callRetrievedata() throws Exception {
		// createSpecificAdapter(FacesContext.getCurrentInstance());
	}

	public void clearForm() {
		// billingResponse = new ComCscBillingAccountRetrieveRs();
		// accountSummaryInquireResponse = new ComCscAccountSummaryInquireRs();
		// billingPolicyAgreementInquireResponse = new
		// ComCscBillingPolicyAgreementInquireRs();
		// billingAccountReceiptsInquireResponse = new
		// ComCscBillingAccountReceiptsInquireRs();
		// billingScheduleInquireResponse = new ComCscBillingScheduleInquireRs();
	}

	public void setAuthenticatedUserDetails() {
		Authentication auth = SecurityContextHolder.getContext()
				.getAuthentication();
		user = (User) auth.getPrincipal();
		webDetails = (WebAuthenticationDetails) auth.getDetails();
	}

	public String getCurrentDate() {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date date = new Date();
		return dateFormat.format(date);
	}

	public Map<String, String> getStatesCodes() {
		return statesCodes;
	}

	public void setStatesCodes(Map<String, String> statesCodes) {
		this.statesCodes = statesCodes;
	}

	public List<String> getPaymentTypeValues() {
		return paymentTypeValues;
	}

	public void setPaymentTypeValues(List<String> paymentTypeValues) {
		this.paymentTypeValues = paymentTypeValues;
	}

}
