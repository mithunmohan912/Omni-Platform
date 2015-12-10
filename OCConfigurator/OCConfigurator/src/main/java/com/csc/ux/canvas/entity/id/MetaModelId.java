package com.csc.ux.canvas.entity.id;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class MetaModelId implements Serializable {
	private static final long serialVersionUID = 1L;
	@Column(name = "FILENAME")
	private String filename = new String();
	@Column(name = "ISSUECODE")
	private char issuecode;
	@Column(name = "FUNCCODE")
	private String funccode = new String();
	@Column(name = "ACTTYPE")
	private String acttype = new String();
	@Column(name = "LOCATION")
	private String location = new String();
	@Column(name = "MASTERCO")
	private String masterco = new String();
	@Column(name = "POLICYCO")
	private String policyco = new String();
	@Column(name = "STATE")
	private String state = new String();
	@Column(name = "KEYFLD1")
	private String keyfld1 = new String();
	@Column(name = "KEYFLD1")
	private String keyfld2 = new String();
	@Column(name = "KEYFLD3")
	private String keyfld3 = new String();
	@Column(name = "KEYFLD4")
	private String keyfld4 = new String();
	@Column(name = "KEYFLD5")
	private String keyfld5 = new String();
	@Column(name = "USERNAME")
	private String username = new String();

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public char getIssuecode() {
		return issuecode;
	}

	public void setIssuecode(char issuecode) {
		this.issuecode = issuecode;
	}

	public String getFunccode() {
		return funccode;
	}

	public void setFunccode(String funccode) {
		this.funccode = funccode;
	}

	public String getActtype() {
		return acttype;
	}

	public void setActtype(String acttype) {
		this.acttype = acttype;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getMasterco() {
		return masterco;
	}

	public void setMasterco(String masterco) {
		this.masterco = masterco;
	}

	public String getPolicyco() {
		return policyco;
	}

	public void setPolicyco(String policyco) {
		this.policyco = policyco;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getKeyfld1() {
		return keyfld1;
	}

	public void setKeyfld1(String keyfld1) {
		this.keyfld1 = keyfld1;
	}

	public String getKeyfld2() {
		return keyfld2;
	}

	public void setKeyfld2(String keyfld2) {
		this.keyfld2 = keyfld2;
	}

	public String getKeyfld3() {
		return keyfld3;
	}

	public void setKeyfld3(String keyfld3) {
		this.keyfld3 = keyfld3;
	}

	public String getKeyfld4() {
		return keyfld4;
	}

	public void setKeyfld4(String keyfld4) {
		this.keyfld4 = keyfld4;
	}

	public String getKeyfld5() {
		return keyfld5;
	}

	public void setKeyfld5(String keyfld5) {
		this.keyfld5 = keyfld5;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((acttype == null) ? 0 : acttype.hashCode());
		result = prime * result + ((filename == null) ? 0 : filename.hashCode());
		result = prime * result + ((funccode == null) ? 0 : funccode.hashCode());
		result = prime * result + issuecode;
		result = prime * result + ((keyfld1 == null) ? 0 : keyfld1.hashCode());
		result = prime * result + ((keyfld2 == null) ? 0 : keyfld2.hashCode());
		result = prime * result + ((keyfld3 == null) ? 0 : keyfld3.hashCode());
		result = prime * result + ((keyfld4 == null) ? 0 : keyfld4.hashCode());
		result = prime * result + ((keyfld5 == null) ? 0 : keyfld5.hashCode());
		result = prime * result + ((location == null) ? 0 : location.hashCode());
		result = prime * result + ((masterco == null) ? 0 : masterco.hashCode());
		result = prime * result + ((policyco == null) ? 0 : policyco.hashCode());
		result = prime * result + ((state == null) ? 0 : state.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		MetaModelId other = (MetaModelId) obj;
		if (acttype == null) {
			if (other.acttype != null)
				return false;
		} else if (!acttype.equals(other.acttype))
			return false;
		if (filename == null) {
			if (other.filename != null)
				return false;
		} else if (!filename.equals(other.filename))
			return false;
		if (funccode == null) {
			if (other.funccode != null)
				return false;
		} else if (!funccode.equals(other.funccode))
			return false;
		if (issuecode != other.issuecode)
			return false;
		if (keyfld1 == null) {
			if (other.keyfld1 != null)
				return false;
		} else if (!keyfld1.equals(other.keyfld1))
			return false;
		if (keyfld2 == null) {
			if (other.keyfld2 != null)
				return false;
		} else if (!keyfld2.equals(other.keyfld2))
			return false;
		if (keyfld3 == null) {
			if (other.keyfld3 != null)
				return false;
		} else if (!keyfld3.equals(other.keyfld3))
			return false;
		if (keyfld4 == null) {
			if (other.keyfld4 != null)
				return false;
		} else if (!keyfld4.equals(other.keyfld4))
			return false;
		if (keyfld5 == null) {
			if (other.keyfld5 != null)
				return false;
		} else if (!keyfld5.equals(other.keyfld5))
			return false;
		if (location == null) {
			if (other.location != null)
				return false;
		} else if (!location.equals(other.location))
			return false;
		if (masterco == null) {
			if (other.masterco != null)
				return false;
		} else if (!masterco.equals(other.masterco))
			return false;
		if (policyco == null) {
			if (other.policyco != null)
				return false;
		} else if (!policyco.equals(other.policyco))
			return false;
		if (state == null) {
			if (other.state != null)
				return false;
		} else if (!state.equals(other.state))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}
}
