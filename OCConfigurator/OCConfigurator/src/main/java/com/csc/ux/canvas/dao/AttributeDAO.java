package com.csc.ux.canvas.dao;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface AttributeDAO {
	public void addAttribute(Object attr);

	public void removeAttribute(Object attr);

	public void changeAttribute(Object attr);

	public Object getAttribute(Object attrId);

	public List<Object> listAttribute();

	public List<BigDecimal> listSetTypes();

	public Map<BigDecimal, String> listScreens();

	public List<Object> listAttrForSetType(int setType);
	
	public Object checkAttribute(String attrName);
}
