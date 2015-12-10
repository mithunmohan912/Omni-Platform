package com.csc.ux.canvas.converter.pojo.helper;

public class SupportInfo {
	private String fieldSet;
	private String tableSet;
	private String whereClause;
	private String element;
	private String orderBy;
	private String procName;
	private String type;
	private String lookup;

	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getElement() {
		return element;
	}
	public void setElement(String element) {
		this.element = element;
	}
	public String getOrderBy() {
		return orderBy;
	}
	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}
	public String getProcName() {
		return procName;
	}
	public void setProcName(String procName) {
		this.procName = procName;
	}
	public String getFieldSet() {
		return fieldSet;
	}
	public void setFieldSet(String fieldSet) {
		this.fieldSet = fieldSet;
	}
	public String getTableSet() {
		return tableSet;
	}
	public void setTableSet(String tableSet) {
		this.tableSet = tableSet;
	}
	public String getWhereClause() {
		return whereClause;
	}
	public void setWhereClause(String whereClause) {
		this.whereClause = whereClause;
	}
	public String getLookup() {
		return lookup;
	}
	public void setLookup(String lookup) {
		this.lookup = lookup;
	}
	
	public String getQueryString(){
		String str = null;
		handleStateAndAdjTables(this);
		String fieldSet = this.getFieldSet();
		String tableSet = this.getTableSet();
		String whereClause = this.getWhereClause();
		if(fieldSet.split(",").length == 1 && !"*".equals(fieldSet)){
			fieldSet += ","+fieldSet;
		}
		String[] flds = fieldSet.split(",");
		if(flds.length == 2){
			str = "SELECT "+flds[0].trim()+" as value, "+flds[1].trim() + " as description FROM "+tableSet;
		}else {
			str = "SELECT "+fieldSet + " FROM "+tableSet;
		}
		
		if(whereClause != null){
			str += " WHERE "+whereClause.replaceAll("'@#", "@").replaceAll("#@'", "@");
		}
		return str;
	}
	private void handleStateAndAdjTables(SupportInfo supportInfo) {
		if(supportInfo.getTableSet().equals("TBTS02L2")){
			supportInfo.setFieldSet("STCDNA, STATEN");
		}else if(supportInfo.getTableSet().equals("TBADJTY")){
			supportInfo.setFieldSet("ADJTYP, TYPEDESC");
		}
	}
}
