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
public class ACLSupportDataManipulator {
	
	public static final String TRANSLATE = "TRANSLATE"; /* 1 */	
	public static final String INVISIBLE = "INVISIBLE"; /* 2 */
	public static final String ENCRYPT = "ENCRYPT"; /* 3 */
	public static final String DECRYPT = "DECRYPT"; /* 4 */
	
	public static List<String> getSecuredElementListFromAcl(String functionId) throws Exception {
		CustomLookupStrategy lookupStrategy = (CustomLookupStrategy) ApplicationContextProvider.getApplicationContext().getBean("lookupStrategy");
		return lookupStrategy.getSecuredElementList(functionId);
	}
	
	/**
	 * Receives the Support Data PayLoad and the Function ID to process
	 * Will be applied to Support Data 
	 * 
	 * @throws Throwable
	 * */

	public static void secureData(Map<String, Object> jsonMap, String functionId, boolean doDecryption) throws Throwable {

		List<String> securedElementList = getSecuredElementListFromAcl(functionId);
		if (securedElementList.size() > 0) {
			if (jsonMap != null) {
				applyPermissions(jsonMap, securedElementList, functionId, doDecryption);
			}
		}
	}

	public static void applyPermissions(Map<String, Object> jsonMap, List<String> securedElementList, String functionId, boolean doDecryption) throws Exception {
		for (String securedElement : securedElementList) {
			
			String[] functionParts = securedElement.split(":");
			String applicableElement = functionParts[0];
			String securedValue = functionParts[1];						
			
			indentifyFieldFromMap((Map<String, Object>)jsonMap, applicableElement, securedValue, functionId, doDecryption);	
			
			Iterator<Map.Entry<String, Object>> iterator = jsonMap.entrySet().iterator();
			while (iterator.hasNext()) {
				Map.Entry<String, Object> entry = iterator.next();
				if (entry.getValue() instanceof Map) {
					indentifyFieldFromMap((Map<String, Object>) entry.getValue(), applicableElement, securedValue, functionId, doDecryption);			
				}else if (entry.getValue() instanceof List) {
					searchFromList((List<Object>) entry.getValue(), applicableElement, securedValue, functionId, doDecryption);
				}		
				
			}
		}
	}
	
	public static boolean indentifyFieldFromMap(Map<String, Object> map, String applicableElement, String securedValue, String functionId, boolean doDecryption) throws Exception {
		boolean valueMatched = false;
		for (Map.Entry<String, Object> jsonMapentry : map.entrySet()) {	
		    if(jsonMapentry.getKey().equals("payLoad")){
		    Map<String,String> payLoadMap = (Map<String, String>) jsonMapentry.getValue();
		    if((payLoadMap.containsKey("name") && payLoadMap.get("name").equals(applicableElement))||(payLoadMap.containsKey("value") && payLoadMap.get("value").equals(applicableElement))){
		    	valueMatched=true;
		    	}	
		    }
		    
		    if(jsonMapentry.getKey().equals("rows") && valueMatched){
		    	List<Map<String,String>> rowsList = (List<Map<String, String>>) jsonMapentry.getValue();
		    	for (Iterator<Map<String, String>> rowIter = rowsList.iterator(); rowIter.hasNext();) {
					Map<String, String> row = rowIter.next();
					if((row.get("value").equals(securedValue)) && checkAclPermissions(applicableElement+':'+securedValue, INVISIBLE, functionId) ){
						rowIter.remove();
					}
				}
		    }
		}
		return false;
	}


	public static void searchFromList(List<Object> list, String applicableElement, String securedValue, String functionId, boolean doDecryption) throws Exception {
		for (int i = 0; i < list.size(); i++) {
			if (list.get(i) instanceof Map) {
				indentifyFieldFromMap((Map<String, Object>) list.get(i), applicableElement, securedValue, functionId, doDecryption);							
			} else if (list.get(i) instanceof List) {
				searchFromList((List<Object>) list.get(i), applicableElement, securedValue, functionId, doDecryption);
			}
		}
	}

	
	public static boolean checkAclPermissions(String FunctionElementID, String FunctionPermission, String functionName) {
		//this code will be uncommented after the Authorization Engine is coded
		//return true;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		PermissionEvaluator permissionEvaluator = (PermissionEvaluator) ApplicationContextProvider.getApplicationContext().getBean("permissionEvaluator");
		
		boolean result = permissionEvaluator.hasPermission(authentication, FunctionElementID, functionName, FunctionPermission);
		return result;
	}
}
