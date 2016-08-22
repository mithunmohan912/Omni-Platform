package com.csc.cscip.ux.common.aop.exception;

import javax.servlet.http.HttpServletResponse;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;

import com.csc.cscip.ux.common.rest.AbstractRestController;

//@Aspect
public class RestExceptionHandler {

	private static ThreadLocal<HttpServletResponse> responseTL = new ThreadLocal<HttpServletResponse>();

	// @Pointcut("execution(public * com.csc.cscip.ux.common.rest.*Controller.*(..))")
	public void ControllerLevel() {
	}

	public void holdArguments(JoinPoint currentJp) {

		if (currentJp.getSignature().getModifiers() == 1) {
			for (Object arg : currentJp.getArgs()) {
				if (arg instanceof HttpServletResponse) {
					responseTL.set((HttpServletResponse) arg);
					break;
				}
			}
		}
	}

	// @Around("ControllerLevel()")
	public Object catchExceptions(ProceedingJoinPoint pjp) throws Throwable {
		try {
			holdArguments(pjp);
			return pjp.proceed();
		} catch (Throwable ex) {
			handleExceptions(ex);
			return null;
		}
	}

	public void handleExceptions(Throwable exception) throws Throwable {
		HttpServletResponse httpServletResponse = responseTL.get();
		if (httpServletResponse != null) {
			AbstractRestController.handleException(exception, httpServletResponse);
		}
	}

}
