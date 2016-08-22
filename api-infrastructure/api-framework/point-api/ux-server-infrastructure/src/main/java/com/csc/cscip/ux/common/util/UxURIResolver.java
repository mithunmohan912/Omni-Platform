package com.csc.cscip.ux.common.util;

import java.io.File;
import java.io.InputStream;
import javax.xml.transform.Source;
import javax.xml.transform.TransformerException;
import javax.xml.transform.URIResolver;
import javax.xml.transform.stream.StreamSource;

/**
 * UXURIResolver - This URI Resolver is created for resolving the URI for the location of XSLTs.
 */
public class UxURIResolver implements URIResolver {
	private String transformerURL = "";

	public UxURIResolver(String transformerURL) {
		this.transformerURL = transformerURL;
	}
	
	@Override
	public Source resolve(String href, String base) throws TransformerException {
		try {
			InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(transformerURL + File.separator + href);
			return new StreamSource(inputStream);
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}
}
