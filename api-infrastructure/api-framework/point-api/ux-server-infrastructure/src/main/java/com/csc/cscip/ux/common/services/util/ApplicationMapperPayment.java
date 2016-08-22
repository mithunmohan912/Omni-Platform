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
package com.csc.cscip.ux.common.services.util;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.oxm.Marshaller;
import org.springframework.oxm.Unmarshaller;
import org.springframework.oxm.XmlMappingException;

public class ApplicationMapperPayment {
	private static final Logger logger = LoggerFactory.getLogger(ApplicationMapperPayment.class);

	private Unmarshaller unMarshaller;
	private Marshaller marshaller;

	public Object convertXMLToObjects(String requestXML) throws Exception {
		StringReader reader = null;

		Object response = null;

		try {

			reader = new StringReader(requestXML);
			response = this.unMarshaller.unmarshal(new StreamSource(reader));

		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("", e);
			throw e;
		} finally {
			if (reader != null)
				reader.close();
		}

		return response;
	}

	public String convertObjectToXML(Object graph) throws Exception {
		StringWriter writer = new StringWriter();
		StringBuffer buffer = null;
		String resultXML = null;

		try {
			this.marshaller.marshal(graph, new StreamResult(writer));

			buffer = writer.getBuffer();

			if (buffer != null && buffer.length() > 0) {
				resultXML = buffer.toString();
			}

			logger.info(resultXML);
		} catch (XmlMappingException e) {
			// TODO Auto-generated catch block
			logger.error("", e);
			throw e;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("", e);
			throw e;
		}

		return resultXML;
	}

	public Unmarshaller getUnMarshaller() {
		return unMarshaller;
	}

	public void setUnMarshaller(Unmarshaller unMarshaller) {
		this.unMarshaller = unMarshaller;
	}

	public Marshaller getMarshaller() {
		return marshaller;
	}

	public void setMarshaller(Marshaller marshaller) {
		this.marshaller = marshaller;
	}

}
