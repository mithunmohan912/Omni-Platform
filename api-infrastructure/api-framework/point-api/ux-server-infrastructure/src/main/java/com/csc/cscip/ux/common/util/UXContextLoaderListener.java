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

import java.io.Serializable;

import javax.servlet.ServletContextEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.ContextLoaderListener;

public class UXContextLoaderListener extends ContextLoaderListener implements Serializable {

	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(UXContextLoaderListener.class);

	@Override
	public void contextInitialized(ServletContextEvent event) {
		try {
			super.contextInitialized(event);
		} catch (Exception ex) {
			logger.info("exception handled");
		}
	}
}