package com.csc.ux.canvas.entity;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import com.csc.ux.canvas.entity.id.AttributeId;

@Entity
@Table(name = "ASAJREP")
public class Attribute {
	@EmbeddedId
	private AttributeId id = new AttributeId();

	public AttributeId getId() {
		return id;
	}

	public void setId(AttributeId id) {
		this.id = id;
	}
};
