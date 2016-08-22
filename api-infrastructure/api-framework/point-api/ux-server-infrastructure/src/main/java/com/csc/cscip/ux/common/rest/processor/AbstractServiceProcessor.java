package com.csc.cscip.ux.common.rest.processor;

@SuppressWarnings("rawtypes")
public abstract class AbstractServiceProcessor<Rq, Rs> implements ServiceProcessor<Rq, Rs> {

	private ServiceProcessor delegate;

	public void setDelegate(ServiceProcessor delegate) {
		this.delegate = delegate;
	}

	public ServiceProcessor getDelegate() {
		return delegate;
	}

	public ServiceProcessorCallback getRequestProcessorCallback(Rq requestPayLoad) {
		return null;
	}

	public ServiceProcessorCallback getResponseProcessorCallback(Rq requestPayLoad, Rs responsePayLoad) {
		return null;
	}

}
