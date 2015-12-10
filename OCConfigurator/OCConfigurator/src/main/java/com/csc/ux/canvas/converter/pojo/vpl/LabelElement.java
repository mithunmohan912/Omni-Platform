package com.csc.ux.canvas.converter.pojo.vpl;

public class LabelElement implements Comparable<LabelElement>{
	int top;
	int left;
	String value;

	public LabelElement(String value) {
		this.value = value;
	}
	public LabelElement() {}
	
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
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		if(value != null && value.startsWith("*")){
			value = value.substring(1);
		}
		this.value = value;
	}
	@Override
	public int compareTo(LabelElement o) {
		if(top-o.getTop() == 0 || Math.abs(top-o.getTop())<=5){
			return left-o.getLeft();
		}
		return top-o.getTop();
	}
	
	class HiddenLabelElement {
		
	}
	
}
