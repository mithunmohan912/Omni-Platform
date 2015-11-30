package com.csc.cscip.ux.common.exception;

public class SystemErrorException extends Exception {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public SystemErrorException() {
	super();
    }

    public SystemErrorException(String message) {
	super(message);
    }

    public SystemErrorException(String message, Throwable ex) {
	super(message, ex);
    }

}
