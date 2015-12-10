package com.csc.ux.canvas;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CanvasConfig {
	@Value("${transformerURL}")
	private String transformerURL;
	
	@Value("${sqlprocessortype}")
	private String sqlprocessortype;
	
	@Value("${conversionrepotype}")
	private String conversionrepotype;
	
	@Value("${srcrepopath}")
	private String srcrepopath;
	
	@Value("${destrepopath}")
	private String destrepopath;
	
	public String getTransformerURL() {
		return transformerURL;
	}

	public String getSqlprocessortype() {
		return sqlprocessortype;
	}

	public String getConversionrepotype() {
		return conversionrepotype;
	}

	public String getSrcrepopath() {
		return srcrepopath;
	}

	public String getDestrepopath() {
		return destrepopath;
	}
}
