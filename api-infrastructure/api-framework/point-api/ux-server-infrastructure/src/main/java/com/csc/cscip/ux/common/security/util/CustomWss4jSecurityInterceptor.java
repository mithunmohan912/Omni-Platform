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

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.webflow.execution.RequestContext;
import org.springframework.webflow.execution.RequestContextHolder;
import org.springframework.ws.soap.security.wss4j.Wss4jSecurityInterceptor;

import com.csc.cscip.ux.common.util.Utility;

public class CustomWss4jSecurityInterceptor extends Wss4jSecurityInterceptor {

    public CustomWss4jSecurityInterceptor() {

	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	RequestContext context = RequestContextHolder.getRequestContext();
	String securementActions = "UsernameToken";
	String securementUsername = ((User) auth.getPrincipal()).getUsername();
	String key = "services.password.commfw";
	 String securementPassword = Utility.getServiceConfigProperty(context, key);
	
	super.setSecurementActions(securementActions);
	super.setSecurementUsername(securementUsername);
	super.setSecurementPassword(securementPassword);

    }

}
