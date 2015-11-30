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
package com.csc.cscip.ux.common.exception;

public class BusinessErrorException extends Exception {
    public enum TYPE {
	INFO, WARNING, ERROR
    };

    private static final long serialVersionUID = 1L;
    private boolean keepState = false;
    private TYPE messageType = TYPE.ERROR;

    public BusinessErrorException() {
	super();
    }

    public BusinessErrorException(String message) {
	super(message);
    }

    public BusinessErrorException(boolean keepState) {
	this();
	this.keepState = keepState;
    }

    public BusinessErrorException(String message, boolean keepState) {
	this(message);
	this.keepState = keepState;
    }

    public BusinessErrorException(boolean keepState, TYPE messageType) {
	this(keepState);
	this.messageType = messageType;
    }

    public BusinessErrorException(String message, boolean keepState, TYPE messageType) {
	this(message, keepState);
	this.messageType = messageType;
    }

    public boolean isKeepState() {
	return keepState;
    }

    public void setKeepState(boolean keepState) {
	this.keepState = keepState;
    }

    public TYPE getMessageType() {
	return messageType;
    }

    public void setMessageType(TYPE messageType) {
	this.messageType = messageType;
    }

}