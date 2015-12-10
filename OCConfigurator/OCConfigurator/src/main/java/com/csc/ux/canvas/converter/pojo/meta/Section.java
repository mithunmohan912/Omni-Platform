package com.csc.ux.canvas.converter.pojo.meta;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class Section {
	
	private String sectionsize;
	private List<Subsection> subsection;
	
	public String getSectionsize() {
		return sectionsize;
	}
	public void setSectionsize(String sectionsize) {
		this.sectionsize = sectionsize;
	}
	public List<Subsection> getSubsection() {
		if(subsection == null){
			subsection = new ArrayList<Subsection>();
		}
		return subsection;
	}
	public void setSubsection(List<Subsection> subsection) {
		this.subsection = subsection;
	}
	public void setDefaultSectionSize(){
		sectionsize = "12";
	}
	public void add(Subsection subsection){
		getSubsection().add(subsection);
	}
}
