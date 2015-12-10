package com.csc.ux.canvas.entity;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import com.csc.ux.canvas.entity.id.AttributeDescId;

@Entity
@Table(name = "ASAJREL1")
public class AttributeDesc {
	@EmbeddedId
	private AttributeDescId id = new AttributeDescId();
	@Column(name = "AJELTX")
	public String setTypeDescription = "";
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

	public AttributeDescId getId() {
		return id;
	}

	public void setId(AttributeDescId id) {
		this.id = id;
	}

	public void setSetTypeDescription(String setTypeDescription) {
		this.setTypeDescription = setTypeDescription;
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

	public String getSetTypeDescription() {
		return (setTypeDescription == null) ? "Not available" : setTypeDescription.trim();
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
};
