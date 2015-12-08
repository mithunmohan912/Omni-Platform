package com.csc.cscip.ux.common.util;

import java.lang.reflect.Method;

public class BeanUtils {

	public static Object getValue(Object bean, String propertyName) {
		try {
			Method m = null;
			propertyName = capitialize(propertyName);
			try {
				m = bean.getClass().getMethod("get" + propertyName, (Class[]) null);
			} catch (NoSuchMethodException e) {
				m = bean.getClass().getMethod("is" + propertyName, (Class[]) null);
			}
			return m.invoke(bean, (Object[]) null);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public static Object setValue(Object bean, String propertyName, Object value) {
		try {
			String methodName = "set" + capitialize(propertyName);
			Method m = bean.getClass().getMethod(methodName, bean.getClass().getField(propertyName).getType());
			return m.invoke(bean, value);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public static String capitialize(String propertyName) {
		char chars[] = propertyName.toCharArray();
		chars[0] = Character.toUpperCase(chars[0]);
		return new String(chars);
	}

}
