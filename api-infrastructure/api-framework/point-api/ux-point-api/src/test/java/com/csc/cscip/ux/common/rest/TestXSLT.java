package com.csc.cscip.ux.common.rest;

import org.junit.Test;

import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.IOUtils;

public class TestXSLT {

	// @Test
	public void testRequest() throws Exception {

		String pointXML = IOUtils.readContent("Point2.xml");
		System.err.println(pointXML);

		String serviceXML = ConversionUtil.transformXMLusingXSLT(pointXML, "PointXML.xsl", "/xsl");
		System.err.println(serviceXML);

	}

	@Test
	public void testExceptionResponse() throws Throwable {

		String pointXML = IOUtils.readContent("exceptionResponse.xml");
		System.err.println(pointXML);

		String serviceXML = ConversionUtil.transformXMLusingXSLT(pointXML, "ExceptionResponseXML.xsl", "/xsl");
		System.err.println(serviceXML);

	}

}
