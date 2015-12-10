package com.csc.ux.canvas.converter.pojo.vpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Node;

import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;
import com.csc.ux.canvas.converter.util.XMLDocument;

public class CheckboxElement extends VplElement {

	private String caption;

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	@Override
	public void processNode(Node chNode, List<SupportInfo> supportInfo,  Map<String, List<Map<String, String>>>  behaviorRegistry) throws Exception{
		List<Map<String, String>> behaviors  = new ArrayList<Map<String, String>>();
		Map<String, String> behavior = new HashMap<String, String>();
		init(chNode);
		setType("checkbox");
		caption = XMLDocument.docGetDOMValueByXPath(chNode, "caption");
		
		behaviors = getBehaviors(chNode);
		
		behavior.put("click", "CheckVisibility(); setCheckBox(this);");
		behaviors.add(behavior);
		
		addToRegistry(behaviorRegistry, behaviors);
	}

	
}
