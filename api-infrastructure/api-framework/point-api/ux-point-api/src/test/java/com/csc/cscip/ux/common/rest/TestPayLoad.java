package com.csc.cscip.ux.common.rest;

import org.junit.Assert;
import org.junit.Test;

import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.request.UXRestRequest;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXJacksonUtils;
import com.csc.cscip.ux.common.util.UXXStreamUtils;
import com.thoughtworks.xstream.XStream;

public class TestPayLoad {

	// @Test
	public void testRequestPayLoad() throws Throwable {

		String requestJSON = IOUtils.readContent("/reqpayload.json");
		UXRestRequest readUXRestRequest = UXJacksonUtils.convertFromJSON(requestJSON, UXRestRequest.class);

		XStream xStream = UXXStreamUtils.getXStream();
		xStream.alias("PayLoad", RequestPayLoad.class);

		String xml = xStream.toXML(readUXRestRequest.getPayLoad());
		Assert.assertNotNull(xml);
		System.out.println(xml);
	}

	// @Test
	public void testResponsePayLoad() throws Exception {

		String responseXML = IOUtils.readContent("/rs/CPPBCONTDFTRs.xml");

		XStream xStream = UXXStreamUtils.getXStream();
		xStream.alias("POINTXML", ResponsePayLoad.class);

		ResponsePayLoad responsePayLoad = (ResponsePayLoad) xStream.fromXML(responseXML, new ResponsePayLoad());
		Assert.assertNotNull(responsePayLoad);
		System.out.println(responsePayLoad);

	}

	@Test
	public void testExceptionResponsePayLoad() throws Throwable {

		String exceptionResponseXML = IOUtils.readContent("exceptionResponse.xml");
		System.err.println(exceptionResponseXML);

		String exceptionResponseXMLJSON = ConversionUtil.convertXMLtoJSON(exceptionResponseXML);
		System.err.println(exceptionResponseXMLJSON);

		Object exceptionResponsePayLoad = UXJacksonUtils.convertFromJSON(exceptionResponseXMLJSON, ResponsePayLoad.class);
		System.err.println(exceptionResponsePayLoad);

	}

}
