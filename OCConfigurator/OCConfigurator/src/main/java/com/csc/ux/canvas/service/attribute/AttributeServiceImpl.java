package com.csc.ux.canvas.service.attribute;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.csc.ux.canvas.dao.AttributeDAO;
import com.csc.ux.canvas.entity.Attribute;
import com.csc.ux.canvas.entity.AttributeDesc;
import com.csc.ux.canvas.entity.id.AttributeDescId;
import com.csc.ux.canvas.entity.id.AttributeId;

@Service
public class AttributeServiceImpl implements AttributeService {

	@Autowired
	private AttributeDAO attributeDAO;

	@Override
	@Transactional
	public void addAttribute(Object attr) {
		attributeDAO.addAttribute((Attribute) attr);
	}

	@Override
	@Transactional
	public void removeAttribute(Object attr) {
		attributeDAO.removeAttribute((Attribute) attr);
	}

	@Override
	@Transactional
	public void changeAttribute(Object attr) {
		attributeDAO.changeAttribute((Attribute) attr);
	}

	@Override
	@Transactional
	public List<Object> listAttribute() {
		return attributeDAO.listAttribute();
	}

	@Override
	@Transactional
	public List<BigDecimal> listSetTypes() {
		return attributeDAO.listSetTypes();
	}

	@Override
	@Transactional
	public Map<BigDecimal, String> listScreens() {
		return attributeDAO.listScreens();
	}

	@Override
	@Transactional
	public List<Object> listAttrForSetType(int setType) {
		return attributeDAO.listAttrForSetType(setType);
	}

	@Override
	@Transactional
	public Object getAttribute(Object attrId) {
		if(attrId instanceof AttributeDescId) {
			return (AttributeDesc) attributeDAO.getAttribute((AttributeDescId) attrId);
		} 
		if(attrId instanceof AttributeId) {
			return (Attribute) attributeDAO.getAttribute((AttributeId) attrId);
		} 
		return null;
	}

	@Override
	@Transactional
	public Object checkAttribute(String attrName) {
		return attributeDAO.checkAttribute(attrName);
	}
}
