package com.csc.ux.canvas.entity;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import com.csc.ux.canvas.entity.id.MetaModelId;

@Entity
@Table(name = "BASSYS07L1")
public class MetaModel {
	@EmbeddedId
	private MetaModelId id = new MetaModelId();
	@Column(name = "RCLKURL")
	private String rclkurl = new String();
	@Column(name = "RCLKPGM")
	private String rclkpgm = new String();
	@Column(name = "RCLKPGM")
	private String rclkreqst = new String();

	public MetaModelId getId() {
		return id;
	}

	public void setId(MetaModelId id) {
		this.id = id;
	}

	public String getRclkurl() {
		return rclkurl;
	}

	public void setRclkurl(String rclkurl) {
		this.rclkurl = rclkurl;
	}

	public String getRclkpgm() {
		return rclkpgm;
	}

	public void setRclkpgm(String rclkpgm) {
		this.rclkpgm = rclkpgm;
	}

	public String getRclkreqst() {
		return rclkreqst;
	}

	public void setRclkreqst(String rclkreqst) {
		this.rclkreqst = rclkreqst;
	}
};
