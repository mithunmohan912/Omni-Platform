package com.csc.ux.canvas.entity.id;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class AttributeId implements Serializable {
	private static final long serialVersionUID = 1L;
	@Column(name = "AJBUNB")
	public int setTypeNumber = 0;
	@Column(name = "AJAJTX")
	public String attributeName = "";
	@Column(name = "AJCCTX")
	public String attributeHeading = "";
	@Column(name = "AJBDST")
	public char requiredByRating = ' ';
	@Column(name = "AJDPST")
	public char displayIndicator = ' ';
	@Column(name = "AJAANB")
	public int startPosition = 0;
	@Column(name = "AJALTX")
	public char dataType = ' ';
	@Column(name = "AJABNB")
	public int length = 0;
	@Column(name = "AJA4NB")
	public int decimalPositions = 0;
	@Column(name = "AJE5TX")
	public char levelIndicator = ' ';
	@Column(name = "AJAAVN")
	public String recordWrittenUser = "";
	@Column(name = "AJAKDT")
	public int recordWrittenDate = 0;
	@Column(name = "AJABTM")
	public int recordWrittenTime = 0;

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

	public void setAttributeHeading(String attributeHeading) {
		this.attributeHeading = attributeHeading;
	}

	public void setRequiredByRating(char requiredByRating) {
		this.requiredByRating = requiredByRating;
	}

	public void setDisplayIndicator(char displayIndicator) {
		this.displayIndicator = displayIndicator;
	}

	public void setStartPosition(int startPosition) {
		this.startPosition = startPosition;
	}

	public void setDataType(char dataType) {
		this.dataType = dataType;
	}

	public void setLength(int length) {
		this.length = length;
	}

	public void setDecimalPositions(int decimalPositions) {
		this.decimalPositions = decimalPositions;
	}

	public void setLevelIndicator(char levelIndicator) {
		this.levelIndicator = levelIndicator;
	}

	public void setRecordWrittenUser(String recordWrittenUser) {
		this.recordWrittenUser = recordWrittenUser;
	}

	public void setRecordWrittenDate(int recordWrittenDate) {
		this.recordWrittenDate = recordWrittenDate;
	}

	public void setRecordWrittenTime(int recordWrittenTime) {
		this.recordWrittenTime = recordWrittenTime;
	}

	public String getAttributeHeading() {
		return attributeHeading.trim();
	}

	public char getRequiredByRating() {
		return requiredByRating;
	}

	public char getDisplayIndicator() {
		return displayIndicator;
	}

	public int getStartPosition() {
		return startPosition;
	}

	public char getDataType() {
		return (dataType == ' ') ? 'T' : dataType;
	}

	public int getLength() {
		return length;
	}

	public int getDecimalPositions() {
		return decimalPositions;
	}

	public char getLevelIndicator() {
		return levelIndicator;
	}

	public String getRecordWrittenUser() {
		return recordWrittenUser.trim();
	}

	public int getRecordWrittenDate() {
		return recordWrittenDate;
	}

	public int getRecordWrittenTime() {
		return recordWrittenTime;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((attributeHeading == null) ? 0 : attributeHeading.hashCode());
		result = prime * result + ((attributeName == null) ? 0 : attributeName.hashCode());
		result = prime * result + dataType;
		result = prime * result + decimalPositions;
		result = prime * result + displayIndicator;
		result = prime * result + length;
		result = prime * result + levelIndicator;
		result = prime * result + recordWrittenDate;
		result = prime * result + recordWrittenTime;
		result = prime * result + ((recordWrittenUser == null) ? 0 : recordWrittenUser.hashCode());
		result = prime * result + requiredByRating;
		result = prime * result + setTypeNumber;
		result = prime * result + startPosition;
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
		AttributeId other = (AttributeId) obj;
		if (attributeHeading == null) {
			if (other.attributeHeading != null)
				return false;
		} else if (!attributeHeading.equals(other.attributeHeading))
			return false;
		if (attributeName == null) {
			if (other.attributeName != null)
				return false;
		} else if (!attributeName.equals(other.attributeName))
			return false;
		if (dataType != other.dataType)
			return false;
		if (decimalPositions != other.decimalPositions)
			return false;
		if (displayIndicator != other.displayIndicator)
			return false;
		if (length != other.length)
			return false;
		if (levelIndicator != other.levelIndicator)
			return false;
		if (recordWrittenDate != other.recordWrittenDate)
			return false;
		if (recordWrittenTime != other.recordWrittenTime)
			return false;
		if (recordWrittenUser == null) {
			if (other.recordWrittenUser != null)
				return false;
		} else if (!recordWrittenUser.equals(other.recordWrittenUser))
			return false;
		if (requiredByRating != other.requiredByRating)
			return false;
		if (setTypeNumber != other.setTypeNumber)
			return false;
		if (startPosition != other.startPosition)
			return false;
		return true;
	}

};
