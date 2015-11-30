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
package com.csc.cscip.ux.common.security.securityengine;

import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.csc.cscip.ux.common.security.acl.CustomLookupStrategy;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;

public class PreAuthorizationHandle {

    private String screen;
    private String component;

    public PreAuthorizationHandle(String screen, String component) {

	this.screen = screen;
	this.component = component;

    }

    public List<CustomSelectItem> invokePreAuthorizationHandler() {
	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	ApplicationContext ctx = ApplicationContextProvider.getApplicationContext();
	CustomLookupStrategy lookupStrategy = (CustomLookupStrategy) ctx.getBean("lookupStrategy");
	return lookupStrategy.getSecuredElementChildList(screen, component, authentication);

    }

}
