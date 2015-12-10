package com.csc.ux.canvas.converter.pojo.vpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Node;

import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;
import com.csc.ux.canvas.converter.util.UXConverterUtil;
import com.csc.ux.canvas.converter.util.XMLDocument;

public abstract class VplElement implements Comparable<VplElement>{

	private String type;
	private int top;
	private int left;
	private double width;
	private String id;
	private String required;
	private String tabindex;
	private String visibility;
	private String uppercase;
	private String zerofill;
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getTop() {
		return top;
	}
	public void setTop(int top) {
		this.top = top;
	}
	public int getLeft() {
		return left;
	}
	public void setLeft(int left) {
		this.left = left;
	}
	public String getRequired() {
		return required;
	}
	public void setRequired(String required) {
		this.required = required;
	}
	public String getTabindex() {
		return tabindex;
	}
	public void setTabindex(String tabindex) {
		this.tabindex = tabindex;
	}
	public String getVisibility() {
		return visibility;
	}
	public void setVisibility(String visibility) {
		this.visibility = visibility;
	}
	public double getWidth() {
		return width;
	}
	public void setWidth(double width) {
		this.width = width;
	}

	
	public String getUppercase() {
		return uppercase;
	}

	public void setUppercase(String uppercase) {
		this.uppercase = uppercase;
	}

	public String getZerofill() {
		return zerofill;
	}

	public void setZerofill(String zerofill) {
		this.zerofill = zerofill;
	}

	protected void init(Node chNode) throws Exception{
		left = Integer.parseInt(XMLDocument.docGetDOMValueByXPath(chNode, "position/left"));
		top = Integer.parseInt(XMLDocument.docGetDOMValueByXPath(chNode, "position/top"));
		id = XMLDocument.docGetDOMValueByXPath(chNode, "model_element");
		visibility = XMLDocument.docGetDOMValueByXPath(chNode, "visibility");
		tabindex = XMLDocument.nodeAttributeValue(chNode, "tabindex");
		width = Integer.parseInt(XMLDocument.docGetDOMValueByXPath(chNode, "size/width"));
		String level = XMLDocument.docGetDOMValueByXPath(chNode, "level");
		if("32".equals(level)){
			required = "required";
		}
	}

	public abstract void processNode(Node chNode, List<SupportInfo> supportInfo, Map<String, List<Map<String, String>>> behaviorRegistry) throws Exception;

	protected void constructSqlObjectForTextFlds(Node chNode, List<SupportInfo> supportInfo) throws Exception {
		UXConverterUtil.constructDynamicSqlTextField(chNode, supportInfo, getId());

	}

	@Override
	public int compareTo(VplElement o) {
		if(top-o.getTop() == 0 || Math.abs(top-o.getTop())<=5){
			return left-o.getLeft();
		}
		return top-o.getTop();
	}

	public List<Map<String, String>> getBehaviors(Node chNode) throws Exception{
		List<Map<String, String>> behaviors  = new ArrayList<Map<String, String>>();
		Map<String, String> behavior = new HashMap<String, String>();
		if(XMLDocument.docGetDOMValueByXPath(chNode, "hasOnEnter") != null && XMLDocument.docGetDOMValueByXPath(chNode, "hasOnEnter").equals("true")){
			behavior.put("focus","this.select();"+ XMLDocument.docGetDOMValueByXPath(chNode, "OnEnter"));
			behaviors.add(behavior);		
		}
		behavior = new HashMap<String, String>();
		String behv = "";
		if(XMLDocument.docGetDOMValueByXPath(chNode, "hasOnExit") != null && XMLDocument.docGetDOMValueByXPath(chNode, "hasOnExit").equals("true")){
			if(XMLDocument.docGetDOMValueByXPath(chNode, "OnExit")!= null){
				String[] tmpBehvs = XMLDocument.docGetDOMValueByXPath(chNode, "OnExit").split(";");
				for(int i=0; i<tmpBehvs.length; i++){
					String tempbehv = tmpBehvs[i];
					if(!"".equals(tempbehv)){
						if(tempbehv.contains("fieldToUpperCase")){
							uppercase = "true";
						}else if(tempbehv.contains("ZeroFill")){
							zerofill = "true";
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
		if(!behv.equals("")){
			behavior.put("blur",behv);
			behaviors.add(behavior);		
		}
		return behaviors;
	}

	public void addToRegistry(Map<String, List<Map<String, String>>>  behaviorRegistry, List<Map<String, String>> behaviors) {
		if(behaviors != null && behaviors.size() >0){
			behaviorRegistry.put(getId(), behaviors);
		}
	}
}
