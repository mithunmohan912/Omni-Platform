package com.csc.ux.canvas.converter.pojo.vpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Node;

import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;
import com.csc.ux.canvas.converter.util.XMLDocument;

public class EditElement extends VplElement {

	private String mask;
	private String minlength;
	private String maxlength;
	private String minVal;
	private String maxVal;
	private String decimal;
	private String support;
	private String regexp;

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

	public String getMinlength() {
		return minlength;
	}

	public void setMinlength(String minlength) {
		this.minlength = minlength;
	}

	public String getMaxlength() {
		return maxlength;
	}

	public void setMaxlength(String maxlength) {
		this.maxlength = maxlength;
	}

	public String getMask() {
		return mask;
	}

	public void setMask(String mask) {
		this.mask = mask;
	}
	
	private enum Type {number,date,money,multiline,text, hidden, mask};

	@Override
	public void processNode(Node chNode, List<SupportInfo> supportInfo, Map<String, List<Map<String, String>>>  behaviorRegistry) throws Exception{
		List<Map<String, String>> behaviors  = new ArrayList<Map<String, String>>();
		
		init(chNode);
		setType("hidden".equals(getVisibility())?"hidden":XMLDocument.docGetDOMValueByXPath(chNode, "edit_type"));
		if("default".equals(getType())){
			setType("text");
		}
		mask = XMLDocument.docGetDOMValueByXPath(chNode, "mask");
		minlength = XMLDocument.docGetDOMValueByXPath(chNode, "input/minimum");
		maxlength = XMLDocument.docGetDOMValueByXPath(chNode, "input/maximum");
		minVal = XMLDocument.docGetDOMValueByXPath(chNode, "min");
		maxVal = XMLDocument.docGetDOMValueByXPath(chNode, "max");
		decimal = XMLDocument.docGetDOMValueByXPath(chNode, "decimal");
		setTypeProp(chNode);
		if(getId() == null){
			setId( XMLDocument.docGetDOMValueByXPath(chNode, "local_element"));
		}
		if(getId().contains("COMMON_DESC")){
			String hasSupport = XMLDocument.docGetDOMValueByXPath(chNode, "hasSupport");
			if("true".equals(hasSupport)){
				support = "true";
				constructSqlObjectForTextFlds(chNode, supportInfo);
			}
		}

		behaviors = getBehaviors(chNode);
		addToRegistry(behaviorRegistry, behaviors);
	}

	private void setTypeProp(Node chNode) throws Exception{
		Type edttype = Type.valueOf(getType());
		switch(edttype){
		case number : 
			break;
		case date:
			break;
		case money: 
			String currencySymbol = XMLDocument.docGetDOMValueByXPath(chNode, "currency_symbol");
			if(!"yes".equals(currencySymbol)){
				setType("number");
			}
			break;
		case multiline:
			setType("textarea");
			break;
		case text:
			break;
		case hidden:
			break;
		case mask:
			break;
		}
	}

	@Override
	public List<Map<String, String>> getBehaviors(Node chNode) throws Exception{
		List<Map<String, String>> behaviors  = new ArrayList<Map<String, String>>();
		Map<String, String> behavior = new HashMap<String, String>();
		
		if(XMLDocument.docGetDOMValueByXPath(chNode, "hasOnEnter") != null && XMLDocument.docGetDOMValueByXPath(chNode, "hasOnEnter").equals("true")){
			behavior.put("focus", "(this.select();"+ XMLDocument.docGetDOMValueByXPath(chNode, "OnEnter"));
			behaviors.add(behavior);		
		}

		//behavior = "onblur: FormatField(this); ";
		behavior = new HashMap<String, String>();
		String behv = "";
		if(XMLDocument.docGetDOMValueByXPath(chNode, "hasKeys") != null && XMLDocument.docGetDOMValueByXPath(chNode, "hasKeys").equals("true")){
			behv +=  XMLDocument.docGetDOMValueByXPath(chNode, "Keys")+";";
		}
		if(XMLDocument.docGetDOMValueByXPath(chNode, "hasOnExit") != null && XMLDocument.docGetDOMValueByXPath(chNode, "hasOnExit").equals("true")){
			if(XMLDocument.docGetDOMValueByXPath(chNode, "OnExit")!= null){
				String[] tmpBehvs = XMLDocument.docGetDOMValueByXPath(chNode, "OnExit").split(";");
				for(int i=0; i<tmpBehvs.length; i++){
					String tempbehv = tmpBehvs[i];
					if(!"".equals(tempbehv)){
						if(tempbehv.contains("fieldToUpperCase")){
							setUppercase("true");
						}else if(tempbehv.contains("ZeroFill")){
							setZerofill("true");
						}else if(tempbehv.contains("CheckVisibility")){
							//do nothing - this is converted to a directive
						}else{
							behv+= tempbehv+";";
						}
					}
				}
			}
			//behavior +=  XMLDocument.docGetDOMValueByXPath(chNode, "OnExit");
		}


		String tmpBehavior = XMLDocument.docGetDOMValueByXPath(chNode, "tooltip/text");
		if(tmpBehavior != null && !"".equals(tmpBehavior.trim()) && tmpBehavior.contains("onChange:")){
			behv += tmpBehavior.substring(tmpBehavior.indexOf(":")+1);
		}
		if(!behv.equals("")){
			behavior.put("blur", behv);
			behaviors.add(behavior);		
		}

		//behaviors.add("onKeyup: EditEntry(this);");		

		return behaviors;
	}
}
