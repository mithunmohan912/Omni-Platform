package com.csc.cscip.ux.common.util;

import java.util.Date;
import java.util.Locale;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ConfigBean {
	public Locale getLocale() {
		return LocaleContextHolder.getLocale();
	}
	
	public Date getCurrentDate() {
		return new Date();
	}
}
