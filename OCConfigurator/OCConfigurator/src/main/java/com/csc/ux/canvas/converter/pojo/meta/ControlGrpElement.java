package com.csc.ux.canvas.converter.pojo.meta;

import java.util.ArrayList;
import java.util.List;

import com.csc.ux.canvas.converter.util.ConverterConstants;

public class ControlGrpElement implements IMetaElement {
	private String name;
	private String type;
	private String label;
	private String required;
	private String fieldspan;
	private List<IMetaElement> controlgroup;
	
	public List<IMetaElement> getControlgroup() {
		if(controlgroup == null){
			controlgroup = new ArrayList<IMetaElement>();
		}
		return controlgroup;
	}

	public void setControlgroup(List<IMetaElement> controlgroup) {
		this.controlgroup = controlgroup;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getRequired() {
		return required;
	}

	public void setRequired(String required) {
		this.required = required;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name ;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {

	}
	
	public String getFieldspan() {
		return fieldspan;
	}

	public void setFieldspan(String fieldspan) {
		this.fieldspan = fieldspan;
	}
	
	public void setDefaults() {
		fieldspan =  ConverterConstants.DEFAULT_FIELD_SPAN;
		type="grouptext";
	}
	
}
