package com.csc.eip.bo;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;

public class Message {

	// serialize/deserialize all unmapped properties
	private Map<String, Object> any = new HashMap<String, Object>();;

	public Message() {}

	@JsonAnyGetter
	public Map<String, Object> getAny() {
		return any;
	}

	@JsonAnySetter
	public void setAny(String key, Object value) {
		any.put(key, value);
	}

}
