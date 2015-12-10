package com.csc.ux.canvas.converter.pojo.meta;

import java.util.ArrayList;
import java.util.List;


public class Metadata {
	
	private String groupid;
	private String formid;
	//private String modelid;
	private String title;
	private List<Section> section;
	
	
	public String getGroupid() {
		return groupid;
	}
	public void setGroupid(String groupid) {
		this.groupid = groupid;
	}
	public String getFormid() {
		return formid;
	}
	public void setFormid(String formid) {
		this.formid = formid;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public List<Section> getSection() {
		if(section == null){
			section = new ArrayList<Section>();
		}
		return section;
	}
	public void setSection(List<Section> section) {
		this.section = section;
	}
	/*public String getModelid() {
		return modelid;
	}
	public void setModelid(String modelid) {
		this.modelid = modelid;
	}*/
	
}
