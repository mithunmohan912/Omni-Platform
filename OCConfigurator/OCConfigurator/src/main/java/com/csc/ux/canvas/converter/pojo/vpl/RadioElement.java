package com.csc.ux.canvas.converter.pojo.vpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Node;

import com.csc.ux.canvas.converter.pojo.helper.Option;
import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;
import com.csc.ux.canvas.converter.util.UXConverterUtil;
import com.csc.ux.canvas.converter.util.XMLDocument;

public class RadioElement extends VplElement {

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
		
		init(chNode);
		setType("radio");

		support = determineSupport(chNode);

		if("false".equals(support)){
			UXConverterUtil.constructStaticOptions(chNode, getOptions(), getId());
		}else{
			UXConverterUtil.constructDynamicOptions(chNode, supportInfo, getId());
		}
		behaviors = getBehaviors(chNode);
		
		addToRegistry(behaviorRegistry, behaviors);
	}

	private String determineSupport(Node chNode) throws Exception{
		String lookup = XMLDocument.docGetDOMValueByXPath(chNode,"choices/choice");
		String tableSet = XMLDocument.docGetDOMValueByXPath(chNode,"choices/choice/tableset");
		if(lookup != null && lookup.contains("Look up Attribute Values")){
			return "true";
		}else if(tableSet != null && tableSet.trim().length() > 0){
			return "true";
		}
		return "false";
	}

}
