package com.csc.cscip.ux.common.rest.response;

public class UXRestResponse {

	private ResponsePayLoad PayLoad;

	public UXRestResponse(ResponsePayLoad newPayLoad) {
		this.PayLoad = newPayLoad;
	}

	public ResponsePayLoad getPayLoad() {
		return PayLoad;
	}

}
