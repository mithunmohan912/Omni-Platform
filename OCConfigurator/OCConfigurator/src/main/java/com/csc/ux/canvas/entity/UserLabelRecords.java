package com.csc.ux.canvas.entity;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import com.csc.ux.canvas.entity.id.UserLabelRecordsId;

@Entity
@Table(name = "ASCKREP")
public class UserLabelRecords {
	@EmbeddedId
	private UserLabelRecordsId id = new UserLabelRecordsId();

	public UserLabelRecordsId getId() {
		return id;
	}

	public void setId(UserLabelRecordsId id) {
		this.id = id;
	}
}
