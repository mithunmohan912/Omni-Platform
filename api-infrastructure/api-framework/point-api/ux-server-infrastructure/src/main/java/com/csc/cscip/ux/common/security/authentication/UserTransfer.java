package com.csc.cscip.ux.common.security.authentication;

import java.util.Map;

public class UserTransfer {

	private final String name;

	private final Map<String, Boolean> roles;

	private final String token;

	private String personalizationData;

	private String LOC;
	
	private String MCO;
	
	private Map<Object, Object> LOCList;

	private Map<Object, Object> MCOList;
	
	private Object fullSystemOverrideDate;

	private String SecurityIndic;

	private Object pco;

	private Object agency;

	public UserTransfer(String userName, Map<String, Boolean> roles, String token, String personalizationData, String LOC, String MCO, Map<Object, Object> LOCList, Map<Object, Object> MCOList, Object fullSystemOverrideDate, String SecurityIndic, Object pco, Object agency) {

		this.name = userName;
		this.roles = roles;
		this.token = token;
		this.personalizationData = personalizationData;
		this.fullSystemOverrideDate = fullSystemOverrideDate;
		this.LOC = LOC;
		this.MCO = MCO;
		this.LOCList = LOCList;
		this.MCOList = MCOList;
		this.SecurityIndic=SecurityIndic;
		this.pco=pco;
		this.agency=agency;
	}

	public String getName() {
		return this.name;
	}

	public Map<String, Boolean> getRoles() {
		return this.roles;
	}

	public String getToken() {
		return this.token;
	}

	public String getPersonalizationData() {
		return personalizationData;
	}
	
	public String getLOC() {
		return this.LOC;
	}
	
	public String getMCO() {
		return this.MCO;
	}

	public Map<Object, Object> getLOCList() {
		return this.LOCList;
	}
	
	public Map<Object, Object> getMCOList() {
		return this.MCOList;
	}
	
	public Object getfullSystemOverrideDate() {
		return this.fullSystemOverrideDate;
	}
	
	public String getSecurityIndic() {
		return this.SecurityIndic;
	}
	
	public Object getpco() {
		return this.pco;
	}
	
	public Object getagency() {
		return this.agency;
	}

}
