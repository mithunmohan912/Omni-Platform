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
package com.csc.cscip.ux.common.security.util;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.preauth.RequestHeaderAuthenticationFilter;
import org.springframework.util.Assert;

public class CustomRequestHeaderAuthenticationFilter extends RequestHeaderAuthenticationFilter {

    private AuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
    private AuthenticationFailureHandler failureHandler = new SimpleUrlAuthenticationFailureHandler();

    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
	    Authentication authResult) {
	super.successfulAuthentication(request, response, authResult);
	HttpSession session = request.getSession(false);
    if (session == null) {
        return;
    }
    session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
//	try {
//	    //successHandler.onAuthenticationSuccess(request, response, authResult);
//	} catch (IOException e) {
//	    logger.error("", e);
//	} catch (ServletException e) {
//	    logger.error("", e);
//	}
    }

    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
	    AuthenticationException failed) {
	super.unsuccessfulAuthentication(request, response, failed);
	try {
	    failureHandler.onAuthenticationFailure(request, response, failed);
	} catch (IOException e) {
	    logger.error("", e);
	} catch (ServletException e) {
	    logger.error("", e);
	}
    }

    public void setAuthenticationSuccessHandler(AuthenticationSuccessHandler successHandler) {
	Assert.notNull(successHandler, "successHandler cannot be null");
	this.successHandler = successHandler;
    }

    public void setAuthenticationFailureHandler(AuthenticationFailureHandler failureHandler) {
	Assert.notNull(failureHandler, "failureHandler cannot be null");
	this.failureHandler = failureHandler;
    }

    protected AuthenticationSuccessHandler getSuccessHandler() {
	return successHandler;
    }

    protected AuthenticationFailureHandler getFailureHandler() {
	return failureHandler;
    }

}
