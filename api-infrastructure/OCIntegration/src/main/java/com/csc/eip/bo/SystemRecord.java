package com.csc.eip.bo;

public class SystemRecord {
	
	public SystemRecord(String name, boolean enable, int width) {
		super();
		this.name = name;
		this.enable = enable;
		this.width = width;
	}

	String name;
	boolean enable;
	int width;
	int length;
	int pageNumber = 1;

	public int getPageNumber() {
		return pageNumber;
	}

	public void setPageNumber(int pageNumber) {
		this.pageNumber = pageNumber;
	}

	public int getLength() {
		return length;
	}

	public void setLength(int length) {
		this.length = length;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isEnable() {
		return enable;
	}

	public void setEnable(boolean enable) {
		this.enable = enable;
	}
}
