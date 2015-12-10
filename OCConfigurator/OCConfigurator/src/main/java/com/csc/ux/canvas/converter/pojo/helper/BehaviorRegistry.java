package com.csc.ux.canvas.converter.pojo.helper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class BehaviorRegistry {
	String form;
	List<Map<String, List<String>>> elemRegs;
	
	public String getForm() {
		return form;
	}
	public void setForm(String form) {
		this.form = form;
	}
	public List<Map<String, List<String>>> getElemRegs() {
		if(elemRegs == null){
			elemRegs = new ArrayList<Map<String,List<String>>>();
		}
		return elemRegs;
	}
	public void setElemRegs(List<Map<String, List<String>>> elemRegs) {
		this.elemRegs = elemRegs;
	}
	
	
}
