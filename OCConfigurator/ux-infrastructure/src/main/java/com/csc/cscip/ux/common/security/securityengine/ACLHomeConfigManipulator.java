package com.csc.cscip.ux.common.security.securityengine;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.csc.cscip.ux.common.security.acl.CustomLookupStrategy;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;

@SuppressWarnings("unchecked")
public class ACLHomeConfigManipulator {

	public static final String CANNOTEXECUTE = "CANNOTEXECUTE"; /* 1 */
	public static final String INVISIBLE = "INVISIBLE"; /* 2 */
	public static final String DISABLE = "DISABLE"; /* 4 */
	public static final String FILTERED = "FILTERED";/* 8 */

	public static List<String> getSecuredElementListFromAcl(String screenId) throws Exception {
		CustomLookupStrategy lookupStrategy = (CustomLookupStrategy) ApplicationContextProvider.getApplicationContext().getBean("lookupStrategy");
		return lookupStrategy.getSecuredElementList(screenId);
	}

	/**
	 * Receives the Json and function ID to process
	 * Will be applied to Navigation resource JSON
	 * 
	 * @throws Throwable
	 * */

	public static void secureData(Map<String, Object> jsonMap, String functionId, String resourceKey, boolean doDecryption) throws Throwable {

		List<String> securedElementList = getSecuredElementListFromAcl(functionId);
		if (securedElementList.size() > 0) {
			if (jsonMap != null) {
				applyPermissions(jsonMap, securedElementList, functionId, doDecryption);
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

	public static boolean deleteFieldFromMap(Map<String, Object> map, String field, String functionId, boolean doDecryption) throws Exception {
		String[] functionParts = field.split(":");
		//String applicableElement = functionParts[0];
		String securedValue = functionParts[0];	
		Iterator<Map.Entry<String, Object>> iterator = map.entrySet().iterator();
		securedValue = securedValue.replace("9", "");
		if ((map.containsKey("appname") && map.get("appname").equals(securedValue)) || (map.containsKey("name") && map.get("name").equals(securedValue)) || (map.containsKey("id") && map.get("id").equals(securedValue)) || (map.containsKey("text") && map.get("text").equals(securedValue))) {
			if (checkAclPermissions(field, INVISIBLE, functionId)) {
				return true;
			}			
		} else {
			while (iterator.hasNext()) {
				Map.Entry<String, Object> entry = iterator.next();
				if (entry.getValue() instanceof Map) {
					deleteFieldFromMap((Map<String, Object>) entry.getValue(), field, functionId, doDecryption);
				} else if (entry.getValue() instanceof List) {;
					searchFromList((List<Object>) entry.getValue(), field, functionId, doDecryption);
				}
			}
		}
		return false;
	}

	public static void searchFromList(List<Object> list, String field, String functionId, boolean doDecryption) throws Exception {
		for (int i = 0; i < list.size(); i++) {
			if (list.get(i) instanceof Map) {
				if (deleteFieldFromMap((Map<String, Object>) list.get(i), field, functionId, doDecryption)) {
					list.remove(i);
				}
			} else if (list.get(i) instanceof List) {
				searchFromList((List<Object>) list.get(i), field, functionId, doDecryption);
			}
		}
	}

	public static boolean checkAclPermissions(String FunctionElementID, String FunctionPermission, String functionName) {
			
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		PermissionEvaluator permissionEvaluator = (PermissionEvaluator) ApplicationContextProvider.getApplicationContext().getBean("permissionEvaluator");
		
		boolean result = permissionEvaluator.hasPermission(authentication, FunctionElementID, functionName, FunctionPermission);
		return result;
	}
}