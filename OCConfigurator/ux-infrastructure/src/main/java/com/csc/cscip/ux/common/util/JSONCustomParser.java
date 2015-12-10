package com.csc.cscip.ux.common.util;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JSONCustomParser {
	Object data;

	public JSONCustomParser(String jsonString) {
		try {
			data = new JSONObject(jsonString);
		} catch (JSONException e) {
			try {
				data = new JSONArray(jsonString);
			} catch (JSONException ex) {
				ex.printStackTrace();
			}
		}
	}

	public Object getAbstractJsonObject() {
		return data;
	}

	public List<Object> parseForData(String data, boolean removeDuplicates) {
		ValueFinder valFinder = new ValueFinder();
		valFinder.setValues(data, removeDuplicates);
		valFinder.traverseForStringValue(this.data);
		return valFinder.foundInstances;
	}

	class ValueFinder {
		List<Object> foundInstances = new ArrayList<Object>();
		String value;
		boolean removeDuplicates;

		public void setValues(String value, boolean removeDuplicates) {
			this.value = value;
			this.removeDuplicates = removeDuplicates;
		}

		public void traverseForStringValue(Object root) {
			if (root == null) {
				return;
			} else if (root instanceof JSONObject) {
				JSONObject self = (JSONObject) root;
				// if the key exists in this object.. save it!
				if (self.has(value)) {
					try {
						Object obj = self.get(value);
						if(obj instanceof JSONArray) {
							loopThruArray(obj);
						} else {
							if (!removeDuplicates || notRepeat(obj)) {
								foundInstances.add(obj);
							}
						}
					} catch (JSONException e) {}
					return;
				}
				// otherwise, you need to dive deeper..
				JSONArray names = self.names();
				for (int i = 0; i < names.length(); i++) {
					try {
						String temp = names.getString(i);
						if (self.get(temp) instanceof JSONObject || self.get(temp) instanceof JSONArray) {
							traverseForStringValue(self.get(temp));
						}
					} catch (JSONException e) {}
				}
			} else if (root instanceof JSONArray) {
				JSONArray self = (JSONArray) root;
				// iterate through the array...
				for (int i = 0; i < self.length(); i++) {
					try {
						Object temp = self.get(i);
						if (temp != null && temp != JSONObject.NULL) {
							if (temp instanceof JSONObject || temp instanceof JSONArray) {
								traverseForStringValue(temp);
							}
							else if (temp instanceof String && ((String) temp).equals(value)) {
								Object obj = self.get(i);
								if(obj instanceof JSONArray) {
									loopThruArray(obj);
								} else {
									if (!removeDuplicates || notRepeat(obj)) {
										foundInstances.add(obj);
									}
								}
							}
						}
					} catch (JSONException e) {}
				}
			}
		}

		private void loopThruArray(Object obj) {
			JSONArray objects = (JSONArray) obj;
			// iterate through the array...
			for (int i = 0; i < objects.length(); i++) {
				Object temp = null;
				try {
					temp = objects.get(i);
				} catch (JSONException e) {}
				if (temp != null && temp != JSONObject.NULL) {
					if (temp instanceof JSONArray) {
						loopThruArray(temp);
					} else { 
						if (!removeDuplicates || notRepeat(temp)) {
							foundInstances.add(temp);
						}
					}
				}
			}			
		}

		private boolean notRepeat(Object obj) {
			for (Object item : foundInstances) {
				if (item.equals(obj)) {
					return false;
				}
			}
			return true;
		}
	}
}