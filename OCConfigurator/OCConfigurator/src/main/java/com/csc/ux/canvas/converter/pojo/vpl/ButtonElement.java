package com.csc.ux.canvas.converter.pojo.vpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Node;

import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;
import com.csc.ux.canvas.converter.util.ConverterConstants;
import com.csc.ux.canvas.converter.util.XMLDocument;

public class ButtonElement extends VplElement {
	
	private String caption;
	private String action;

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}
	
	
	@Override
	public void processNode(Node chNode, List<SupportInfo> supportInfo,  Map<String, List<Map<String, String>>>  behaviorRegistry) throws Exception {
		List<Map<String, String>> behaviors  = new ArrayList<Map<String, String>>();
		Map<String, String> behavior = new HashMap<String, String>();
		init(chNode);
		caption = XMLDocument.docGetDOMValueByXPath(chNode, "caption");
		if("Reset".equals(caption) || "Reset.".equals(caption) || "Submit".equals(caption)){
			setType(ConverterConstants.NA_ON_PAGE);
		}else{
			if(getId() == null){
				setId(XMLDocument.docGetDOMValueByXPath(chNode, "id"));
			}
			action = XMLDocument.docGetDOMValueByXPath(chNode, "tooltip/text");
			if(action.indexOf("javascript") != -1){
				action = action.substring(action.indexOf(":")+1);
			}
			behavior.put("click", action);
			behaviors.add(behavior);
			setType("button");	
		}
		addToRegistry(behaviorRegistry, behaviors);
	}

}
