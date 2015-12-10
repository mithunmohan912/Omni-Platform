package com.csc.cscip.ux.common.security.securityengine;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.csc.cscip.ux.common.security.acl.CustomLookupStrategy;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;
import com.csc.cscip.ux.common.util.UXUtils;

@SuppressWarnings("unchecked")
public class ACLJSONManipulator {

	public static final String CANNOTEXECUTE = "CANNOTEXECUTE"; /* 1 */
	public static final String INVISIBLE = "INVISIBLE"; /* 2 */
	public static final String DISABLE = "DISABLE"; /* 4 */
	public static final String FILTERED = "FILTERED";/* 8 */

	public static List<String> getSecuredElementListFromAcl(String screenId) throws Exception {
		CustomLookupStrategy lookupStrategy = (CustomLookupStrategy) ApplicationContextProvider.getApplicationContext().getBean("lookupStrategy");
		return lookupStrategy.getSecuredElementList(screenId);
	}

	/**
	 * Receives the Json and the screen ID to process
	 * Will be applied to MetaModel screen and DataModel
	 * 
	 * @throws Throwable
	 * */

	public static void secureData(Map<String, Object> jsonMap, String screenId, boolean doDecryption) throws Throwable {

		List<String> securedElementList = getSecuredElementListFromAcl(screenId);
		if (securedElementList.size() > 0) {
			if (jsonMap != null) {
				applyPermissions(jsonMap, securedElementList, screenId, doDecryption);
			}
		}
	}

	public static void applyPermissions(Map<String, Object> jsonMap, List<String> securedElementList, String screenId, boolean doDecryption) throws Exception {
		for (String securedElement : securedElementList) {
			
			deleteFieldFromMap((Map<String, Object>)jsonMap, securedElement, screenId, doDecryption);
			
			Iterator<Map.Entry<String, Object>> iterator = jsonMap.entrySet().iterator();
			while (iterator.hasNext()) {
				Map.Entry<String, Object> entry = iterator.next();
				if (entry.getValue() instanceof Map) {
					if (deleteFieldFromMap((Map<String, Object>) entry.getValue(), securedElement, screenId, doDecryption)) {
						iterator.next();
						iterator.remove();
					}
				} else if (entry.getValue() instanceof List) {
					searchFromList((List<Object>) entry.getValue(), securedElement, screenId, doDecryption);
				}
			}
		}
	}

	public static boolean deleteFieldFromMap(Map<String, Object> map, String field, String screenId, boolean doDecryption) throws Exception {
		Iterator<Map.Entry<String, Object>> iterator = map.entrySet().iterator();
		if (map.containsKey("name") && map.get("name").equals(field) || map.containsKey("field") && map.get("field").equals(field)) {
			if (checkAclPermissions(field, INVISIBLE, screenId) || checkAclPermissions(field, FILTERED, screenId)) {
				return true;
			}
			if (checkAclPermissions(field, DISABLE, screenId)) {
				map.put("disabled", "true");
			}
		} else if (map.containsKey(field)) { // for Data Model
			if (checkAclPermissions(field, FILTERED, screenId)) {
				String newValue = UXUtils.encryptOrDecrypt((String) map.get(field), doDecryption);
				map.put(field, newValue);
			}
		} else {
			while (iterator.hasNext()) {
				Map.Entry<String, Object> entry = iterator.next();
				if (entry.getValue() instanceof Map) {
					deleteFieldFromMap((Map<String, Object>) entry.getValue(), field, screenId, doDecryption);
				} else if (entry.getValue() instanceof List) {
					searchFromList((List<Object>) entry.getValue(), field, screenId, doDecryption);
				}
			}
		}
		return false;
	}

	public static void searchFromList(List<Object> list, String field, String screenId, boolean doDecryption) throws Exception {
		for (int i = 0; i < list.size(); i++) {
			if (list.get(i) instanceof Map) {
				if (deleteFieldFromMap((Map<String, Object>) list.get(i), field, screenId, doDecryption)) {
					list.remove(i);
				}
			} else if (list.get(i) instanceof List) {
				searchFromList((List<Object>) list.get(i), field, screenId, doDecryption);
			}
		}
	}

	public static boolean checkAclPermissions(String ScreenElementID, String ScreenPermission, String screenName) {
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		PermissionEvaluator permissionEvaluator = (PermissionEvaluator) ApplicationContextProvider.getApplicationContext().getBean("permissionEvaluator");

		boolean result = permissionEvaluator.hasPermission(authentication, ScreenElementID, screenName, ScreenPermission);
		return result;
	}

}