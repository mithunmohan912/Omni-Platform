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

import java.io.Serializable;

import javax.faces.component.UIViewRoot;
import javax.faces.context.FacesContext;
import javax.faces.event.AbortProcessingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.csc.cscip.ux.common.services.util.ApplicationMapperPayment;

public class PreRenderViewEventHandler implements Serializable {

    private static final long serialVersionUID = 1L;
    private static final Logger logger = LoggerFactory.getLogger(PreRenderViewEventHandler.class);

    private UIComponentManipulator uiComponentManipulator;

    public void processEvent() throws AbortProcessingException {

	UIViewRoot root = FacesContext.getCurrentInstance().getViewRoot();
	// 30/09/2012 friverosesco: disabled due error in MakaPayment (Error Invisible Permission)
	logger.info("Process event action ");
	uiComponentManipulator = new UIComponentManipulator(root);
	uiComponentManipulator.invokeManipulator();

    }

    public boolean isListenerForSource(Object source) {
	return true;
    }

}