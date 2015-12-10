package com.csc.ux.canvas.converter.pojo.vpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Node;

import com.csc.ux.canvas.converter.pojo.helper.Option;
import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;
import com.csc.ux.canvas.converter.util.UXConverterUtil;
import com.csc.ux.canvas.converter.util.XMLDocument;

public class SelectElement extends VplElement {

	private String support;
	private List<Option> options;
	
	public String getSupport() {
		return support;
	}

	public List<Option> getOptions() {
		if(options == null){
			options = new ArrayList<Option>();
		}
		return options;
	}

	public void setOptions(List<Option> options) {
		this.options = options;
	}

	public void setSupport(String support) {
		this.support = support;
	}

	@Override
	public void processNode(Node chNode, List<SupportInfo> supportInfo, Map<String, List<Map<String, String>>>  behaviorRegistry) throws Exception{
		List<Map<String, String>> behaviors  = new ArrayList<Map<String, String>>();
		Map<String, String> behavior = new HashMap<String, String>();
		
		init(chNode);
		setType("select");
		
		Node attribNode = XMLDocument.docGetNodeByXPath(chNode.getOwnerDocument(), "//attribute[name='"+getId()+"']");
		support = XMLDocument.docGetDOMValueByXPath(attribNode,"table") != null && XMLDocument.docGetDOMValueByXPath(attribNode,"table").trim().length()>0?"false":"true";
		
		if("false".equals(support)){
			UXConverterUtil.constructStaticOptions(chNode, getOptions(), getId());
		}else{
			UXConverterUtil.constructDynamicOptions(chNode, supportInfo, getId());
		}
		
		behaviors = getBehaviors(chNode);
		
		String behv = "";
		behv = XMLDocument.docGetDOMValueByXPath(chNode, "tooltip/text");
		if(behv != null && !"".equals(behv.trim()) && behv.contains("onChange:")){
			behavior.put("change", behv.substring(behv.indexOf(":")+1));
			behaviors.add(behavior);
		}
		
		addToRegistry(behaviorRegistry, behaviors);

	}
}
