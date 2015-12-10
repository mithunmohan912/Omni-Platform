package com.csc.ux.canvas.converter.pojo.vpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Node;

import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;
import com.csc.ux.canvas.converter.util.XMLDocument;

public class ResultElement extends VplElement {

	private String mask;
	private String minVal;
	private String maxVal;
	private String decimal;
	private String disabled;
	private String support;
	private String regexp;

	public String getSupport() {
		return support;
	}

	public void setSupport(String support) {
		this.support = support;
	}

	public String getDisabled() {
		return disabled;
	}

	public void setDisabled(String disabled) {
		this.disabled = disabled;
	}

	public String getMinVal() {
		return minVal;
	}

	public void setMinVal(String minVal) {
		this.minVal = minVal;
	}

	public String getMaxVal() {
		return maxVal;
	}

	public void setMaxVal(String maxVal) {
		this.maxVal = maxVal;
	}

	public String getDecimal() {
		return decimal;
	}

	public void setDecimal(String decimal) {
		this.decimal = decimal;
	}

	public String getMask() {
		return mask;
	}

	public void setMask(String mask) {
		this.mask = mask;
	}

	public String getRegexp() {
		return regexp;
	}

	public void setRegexp(String regexp) {
		this.regexp = regexp;
	}

	private enum Type {multiline,text,money, mask, number,date, hidden};

	@Override
	public void processNode(Node chNode, List<SupportInfo> supportInfo, Map<String, List<Map<String, String>>> behaviorRegistry) throws Exception{
		List<Map<String, String>> behaviors  = new ArrayList<Map<String, String>>();
		
		init(chNode);
		setType(!"visible".equals(getVisibility()) || getId().contains("PROC_MESSAGE")?"hidden":XMLDocument.docGetDOMValueByXPath(chNode, "result_type"));
		if("default".equals(getType())){
			setType("text");
		}
		mask = XMLDocument.docGetDOMValueByXPath(chNode, "mask");
		minVal = XMLDocument.docGetDOMValueByXPath(chNode, "min");
		maxVal = XMLDocument.docGetDOMValueByXPath(chNode, "max");
		decimal = XMLDocument.docGetDOMValueByXPath(chNode, "decimal");
		disabled = "true";
		setTypeProp(chNode);
		if(getId().contains("COMMON_DESC")){
			String hasSupport = XMLDocument.docGetDOMValueByXPath(chNode, "hasSupport");
			if("true".equals(hasSupport)){
				support = "true";
				constructSqlObjectForTextFlds(chNode, supportInfo);
			}
		}
		
		addToRegistry(behaviorRegistry, behaviors);
	}

	private void setTypeProp(Node chNode) throws Exception{
		Type edttype = Type.valueOf(getType());
		switch(edttype){
		case date : 
			break;
		case mask : 
			break;
		case number : 
			regexp = "^[.]?[0-9]+[.]?[0-9]*$";
			break;
		case money:String currencySymbol = XMLDocument.docGetDOMValueByXPath(chNode, "currency_symbol");
		if(!"yes".equals(currencySymbol)){
			setType("number");
		}
		break;
		case multiline:setType("textarea");
		break;
		case text:
			break;
		case hidden:
			break;
		}
	}
}
