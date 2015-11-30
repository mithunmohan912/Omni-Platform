package com.csc.cscip.ux.common.security.exception;

import org.springframework.security.core.AuthenticationException;

public class RuntimeAuthenticationException extends AuthenticationException {

	private static final long serialVersionUID = 1L;

	public RuntimeAuthenticationException(String msg, Throwable t) {
		super(msg, t);
	}

	public RuntimeAuthenticationException(String msg) {
		super(msg);
	}

}
