package com.csc.ux.canvas.converter.pojo.meta;

import java.util.List;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.csc.ux.canvas.converter.pojo.helper.Option;
import com.csc.ux.canvas.converter.util.ConverterConstants;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class DefaultMetaElement implements IMetaElement{
	
	private String name;
	private String type;
	private String label;
	private String required;
	private String disabled;
	private String order;
	private String mask;
	private String support;
	private String regexp;
	private String placeholder;
	private String maxlength;
	private String minlength;
	private List<Option> options;
	private String fieldspan;
	private String decimal;
	private String fileName;
	private String action;
	private String title;
	private int size;
	private String autoformat;
	private String buttonid;
	
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
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


	public String getDisabled() {
		return disabled;
	}


	public void setDisabled(String disabled) {
		this.disabled = disabled;
	}


	public String getOrder() {
		return order;
	}


	public void setOrder(String order) {
		this.order = order;
	}


	public String getMask() {
		return mask;
	}


	public void setMask(String mask) {
		this.mask = mask;
	}


	public String getSupport() {
		return support;
	}


	public void setSupport(String support) {
		this.support = support;
	}


	public String getRegexp() {
		return regexp;
	}


	public void setRegexp(String regexp) {
		this.regexp = regexp;
	}


	public String getPlaceholder() {
		return placeholder;
	}


	public void setPlaceholder(String placeholder) {
		this.placeholder = placeholder;
	}


	public String getMaxlength() {
		return maxlength;
	}


	public void setMaxlength(String maxlength) {
		this.maxlength = maxlength;
	}


	public String getMinlength() {
		return minlength;
	}


	public void setMinlength(String minlength) {
		this.minlength = minlength;
	}


	public List<Option> getOptions() {
		return options;
	}


	public void setOptions(List<Option> options) {
		this.options = options;
	}


	public String getFieldspan() {
		return fieldspan;
	}


	public void setFieldspan(String fieldspan) {
		this.fieldspan = fieldspan;
	}


	public String getDecimal() {
		return decimal;
	}


	public void setDecimal(String decimal) {
		this.decimal = decimal;
	}


	public String getFileName() {
		return fileName;
	}


	public void setFileName(String fileName) {
		this.fileName = fileName;
	}


	public String getAction() {
		return action;
	}


	public void setAction(String action) {
		this.action = action;
	}


	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public int getSize() {
		return size;
	}


	public void setSize(int size) {
		this.size = size;
	}
	
	
	public String getAutoformat() {
		return autoformat;
	}
	
	
	public void setAutoformat(String autoformat) {
		this.autoformat = autoformat;
	}

	
	public String getButtonid() {
		return buttonid;
	}


	public void setButtonid(String buttonid) {
		this.buttonid = buttonid;
	}


	public void setDefaults(){
		this.fieldspan = ConverterConstants.DEFAULT_FIELD_SPAN;
		this.placeholder = "";
	}
}
