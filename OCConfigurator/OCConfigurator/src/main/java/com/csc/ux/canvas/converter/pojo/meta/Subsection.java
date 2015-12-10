package com.csc.ux.canvas.converter.pojo.meta;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class Subsection {
	private String subsectiontitle;
	private List<IMetaElement> element;
	
	public Subsection(String title) {
		this.subsectiontitle = title;
	}
		
	public String getSubsectiontitle() {
		return subsectiontitle;
	}

	public void setSubsectiontitle(String subsectiontitle) {
		this.subsectiontitle = subsectiontitle;
	}
	public List<IMetaElement> getElement() {
		if(this.element == null){
			this.element = new ArrayList<IMetaElement>();
		}
		return element;
	}

	public void setElement(List<IMetaElement> element) {
		this.element = element;
	}
	
	public void add(IMetaElement element){
		getElement().add(element);
	}

	
	
	
}
