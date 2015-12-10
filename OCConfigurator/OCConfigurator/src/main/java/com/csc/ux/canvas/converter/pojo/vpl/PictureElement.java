package com.csc.ux.canvas.converter.pojo.vpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Node;

import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;
import com.csc.ux.canvas.converter.util.XMLDocument;

public class PictureElement extends VplElement {

	private String fileName;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	@Override
	public void processNode(Node chNode, List<SupportInfo> supportInfo, Map<String, List<Map<String, String>>>  behaviorRegistry) throws Exception{
		List<Map<String, String>> behaviors  = new ArrayList<Map<String, String>>();
		
		init(chNode);
		fileName = XMLDocument.docGetDOMValueByXPath(chNode, "file/filename");
		if("line.bmp".equals(fileName) || fileName == null){
			setType("line");
		}else{
			setType("image");
		}
		
		Map<String, String> behavior = new HashMap<String, String>();
		if("1".equals(XMLDocument.docGetDOMValueByXPath(chNode, "level"))){
			behavior.put("click: ", XMLDocument.docGetDOMValueByXPath(chNode, "tooltip/text"));
			behaviors.add(behavior);
		}
		
		addToRegistry(behaviorRegistry, behaviors);
	}
}
