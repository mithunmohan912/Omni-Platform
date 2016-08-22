package com.csc.cscip.ux.common.util;

import java.util.List;
import java.util.Locale;

import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.util.Assert;

public class CustomResourceBundle extends ReloadableResourceBundleMessageSource {

	private String[] basenames = new String[0];
	private long cacheMillis = -1;

	@Override
	public void setCacheSeconds(int cacheSeconds) {
		this.cacheMillis = (cacheSeconds * 1000);
	}

	@Override
	public void setBasenames(String... basenames) {
		if (basenames != null) {
			this.basenames = new String[basenames.length];
			for (int i = 0; i < basenames.length; i++) {
				String basename = basenames[i];
				Assert.hasText(basename, "Basename must not be empty");
				this.basenames[i] = basename.trim();
			}
		} else {
			this.basenames = new String[0];
		}
	}

	@Override
	protected String resolveCodeWithoutArguments(String code, Locale locale) {
		if (this.cacheMillis < 0) {
			PropertiesHolder propHolder = getMergedProperties(locale);
			String result = propHolder.getProperty(code);
			if (result != null) {
				return result;
			}
		} else {
			for (String basename : this.basenames) {
				List<String> filenames = calculateAllFilenames(basename, locale);
				for (String filename : filenames) {
					PropertiesHolder propHolder = getProperties(filename);
					String result = propHolder.getProperty(code);
					if (result != null) {
						return result;
					}
				}
			}
		}
		return "[ "+code+" ]";
	}

}
