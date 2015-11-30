package com.csc.cscip.ux.common.rest;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletInputStream;

public class UXServletInputStream extends ServletInputStream {

	private InputStream is;

	public UXServletInputStream(String fileName) {
		is = getClass().getResourceAsStream(fileName);
	}

	@Override
	public int read() throws IOException {
		return is.read();
	}

}