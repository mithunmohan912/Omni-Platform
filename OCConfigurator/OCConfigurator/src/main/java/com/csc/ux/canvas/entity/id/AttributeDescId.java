package com.csc.ux.canvas.entity.id;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class AttributeDescId implements Serializable {
	private static final long serialVersionUID = 1L;
	@Column(name = "AJBUNB")
	public int setTypeNumber = 0;
	@Column(name = "AJAJTX")
	public String attributeName = "";

	public void setSetTypeNumber(int setTypeNumber) {
		this.setTypeNumber = setTypeNumber;
	}

	public void setAttributeName(String attributeName) {
		this.attributeName = attributeName;
	}

	public int getSetTypeNumber() {
		return setTypeNumber;
	}

	public String getAttributeName() {
		return (attributeName == null) ? "Not available" : attributeName.trim();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((attributeName == null) ? 0 : attributeName.hashCode());
		result = prime * result + setTypeNumber;
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
		AttributeDescId other = (AttributeDescId) obj;
		if (attributeName == null) {
			if (other.attributeName != null)
				return false;
		} else if (!attributeName.equals(other.attributeName))
			return false;
		if (setTypeNumber != other.setTypeNumber)
			return false;
		return true;
	}
};
