package com.csc.cscip.ux.common.services.util;

public class URLConfig {

    private final String toURL;
    private final String targetURL;
    private final String operationAction;

    public URLConfig(String toURL, String targetURL, String operationAction) {
	// TODO Auto-generated constructor stub
	this.toURL = toURL;
	this.targetURL = targetURL;
	this.operationAction = operationAction;
    }

    public String getToURL() {
	return toURL;
    }

    public String getTargetURL() {
	return targetURL;
    }

    public String getOperationAction() {
	return operationAction;
    }
}
