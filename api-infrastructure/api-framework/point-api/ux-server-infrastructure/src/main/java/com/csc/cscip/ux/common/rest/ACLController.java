package com.csc.cscip.ux.common.rest;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.dao.DataAccessObject.ResultSetProcessor;
import com.csc.cscip.ux.common.dao.acl.AclElementDAO;
import com.csc.cscip.ux.common.dao.acl.AclEntryDAO;
import com.csc.cscip.ux.common.dao.acl.AclGroupsDAO;
import com.csc.cscip.ux.common.dao.acl.AclScreenDAO;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXJacksonUtils;

@Controller
@SuppressWarnings("unchecked")
public class ACLController extends AbstractRestController {

	@RequestMapping(value = "/usergroups", method = RequestMethod.GET)
	public @ResponseBody
	String geAcltUserGroups(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		AclGroupsDAO aclGroupsDAO = new AclGroupsDAO();

		final List<Object> roleUserList = new ArrayList<Object>();

		aclGroupsDAO.processAllGroups(new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> aclGroupsMap = new HashMap<String, Object>();
					aclGroupsMap.put("groupId", rs.getInt("id"));
					aclGroupsMap.put("principal", rs.getInt("principal"));
					aclGroupsMap.put("groupName", rs.getString("sid"));
					aclGroupsMap.put("description", rs.getString("description"));
					roleUserList.add(aclGroupsMap);
				}

				return roleUserList;
			}
		});

		Map<String, Object> groupsMap = new HashMap<String, Object>();
		groupsMap.put("usergroups", roleUserList);

		return UXJacksonUtils.convertToJSON(groupsMap);

	}

	@RequestMapping(value = "/userfunctions", method = RequestMethod.GET)
	public @ResponseBody
	String geAclFunctions(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		AclScreenDAO aclScreenDAO = new AclScreenDAO();

		final List<Object> functionUserList = new ArrayList<Object>();

		aclScreenDAO.processAllFunctions(new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> aclFunctionsMap = new HashMap<String, Object>();
					aclFunctionsMap.put("functionId", rs.getInt("id"));
					aclFunctionsMap.put("functionName", rs.getString("class"));				

					functionUserList.add(aclFunctionsMap);
				}

				return functionUserList;
			}
		});

		Map<String, Object> functionsMap = new HashMap<String, Object>();
		functionsMap.put("userfunctions", functionUserList);

		return UXJacksonUtils.convertToJSON(functionsMap);

	}
	
		
	@RequestMapping(value = "/accesscontrol", method = RequestMethod.POST)
	public @ResponseBody
	String updateAclConfigurations(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String aclConfigJSON = IOUtils.readContent(request.getInputStream());
		Map<String, Object> aclPayLoadMap = UXJacksonUtils.convertFromJSON(aclConfigJSON, RequestPayLoad.class);

		String screenName = (String) aclPayLoadMap.get("screen");
		List<Map<String, String>> aclElementList = (List<Map<String, String>>) aclPayLoadMap.get("elements");

		Map<String, Long> aclGroupsMap = new HashMap<String, Long>();

		AclGroupsDAO aclGroupsDAO = new AclGroupsDAO();
		AclEntryDAO aclEntryDAO = new AclEntryDAO();

		AclScreenDAO aclScreenDAO = new AclScreenDAO();
		Long screenId = aclScreenDAO.getScreenId(screenName);
		if (screenId == null) {
			screenId = aclScreenDAO.insertScreenId(screenName);
		}

		AclElementDAO aclElementDAO = new AclElementDAO();
		Map<Object, Object> aclElementsMap = aclElementDAO.selectAllElements(screenId);
		int counter = 0;
		for (Map<String, String> aclElement : aclElementList) {

			String userGroup = aclElement.get("usergroup");

			Long groupId = aclGroupsMap.get(userGroup);
			if (groupId == null) {
				groupId = aclGroupsDAO.getGroupId(userGroup);
				aclGroupsMap.put(userGroup, groupId);
			}

			String elementName = aclElement.get("name");

			Long elementId = (Long) aclElementsMap.get(elementName);
			if (elementId == null) {
				elementId = aclElementDAO.insertElement(screenId, elementName, groupId);
			}

			int result = 0;

			String elemenMask = aclElement.get("mask");

			Integer mask = aclEntryDAO.selectMask(groupId, elementId);
			if (mask == null) {
				if (new Integer(elemenMask).intValue() != 0) {
					result = aclEntryDAO.insertEntry(groupId, elementId, elemenMask);
				}
			} else if (mask.intValue() != new Integer(elemenMask).intValue()) {
				if (new Integer(elemenMask).intValue() != 0) {
					result = aclEntryDAO.updateEntry(elementId, groupId, elemenMask);
				} else {
					result = aclEntryDAO.deleteEntry(elementId, groupId);
				}
			}

			if (result != 0) {
				counter++;
			}
		}

		Map<String, String> aclMessage = new HashMap<String, String>();
		if (counter > 0) {
			String resultMessage ="The function was assigned to the restriction successfully.";
			aclMessage.put("Message", resultMessage);
		}

		return UXJacksonUtils.convertToJSON(aclMessage);

	}

	@RequestMapping(value = "/accesscontrol/{screenName}", method = RequestMethod.GET)
	public @ResponseBody
	String getAclConfigurations(@PathVariable String screenName, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		AclScreenDAO aclScreenDAO = new AclScreenDAO();
		AclEntryDAO aclEntryDAO = new AclEntryDAO();

		Long screenId = aclScreenDAO.getScreenId(screenName);

		//List<Map<String, Object>> elementsList = (List<Map<String, Object>>) aclEntryDAO.processAllEntries(screenId, new ResultSetProcessor() {
		List<Map<String, Object>> elementsList = screenId==null?new ArrayList<Map<String,Object>>():(List<Map<String, Object>>) aclEntryDAO.processAllEntries(screenId, new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				List<Map<String, Object>> elementsList = new ArrayList<Map<String, Object>>();

				while (rs.next()) {

					Map<String, Object> elementMap = new HashMap<String, Object>();

					elementMap.put("element", rs.getObject(1));
					elementMap.put("name", rs.getObject(1));
					elementMap.put("usergroup", rs.getObject(2));
					elementMap.put("mask", rs.getObject(3));

					elementsList.add(elementMap);
				}

				return elementsList;
			}
		});

		Map<String, Object> aclConfigMap = new HashMap<String, Object>();
		aclConfigMap.put("screenId", screenName);
		aclConfigMap.put("elements", elementsList);

		return UXJacksonUtils.convertToJSON(aclConfigMap);
	}
	
	@RequestMapping(value = "/functions/{screenName}", method = RequestMethod.GET)
	public @ResponseBody
	String getAclfunctions(@PathVariable String screenName, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		AclScreenDAO aclScreenDAO = new AclScreenDAO();
		
		String screenType = screenName.split(":")[1];
		
		
		List<Map<String, Long>> screenIds = (List<Map<String, Long>>) aclScreenDAO.getScreenIds(screenType,new ResultSetProcessor() {
			
			List<Map<String, Long>> screenIds = new ArrayList<Map<String, Long>>();
			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					
					Map<String, Long> acl = new HashMap<String, Long>();
					acl.put("id", rs.getLong(1));
					screenIds.add(acl);
				}

				return screenIds;
			}
		});
		
		List<Map<String, Object>> elements = (List<Map<String, Object>>) new ArrayList<Map<String, Object>>();
		int index=0;
		for(Map<String, Long> screenId : screenIds){
			
			Long Id = (Long) screenId.get("id");
			AclElementDAO aclElementDAO = new AclElementDAO();
			List<Object> functions = aclElementDAO.getAllFunctions(Id);
			String restrictionClass = aclScreenDAO.getScreenName(Id);
			
			for( Object function : functions)
			{
				Map<String, Object> elem = new HashMap<String, Object>();
				elem.put("RestrictionName", function);
				elem.put("Category", restrictionClass);
				elements.add(index,elem);
				index++;
			}
		}
		
		Map<String, Object> aclConfigMap = new HashMap<String, Object>();
		aclConfigMap.put("elements", elements);
		aclConfigMap.put("screenName", screenName);

		return UXJacksonUtils.convertToJSON(aclConfigMap);
	}
	
	@RequestMapping(value = "/restrictionCategory/{restrictionName}", method = RequestMethod.GET)
	public @ResponseBody
	String getRestrictionCategory(@PathVariable String restrictionName, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		AclScreenDAO aclScreenDAO = new AclScreenDAO();
		AclElementDAO aclElementDAO = new AclElementDAO();
		
		Long objectId = aclElementDAO.selectElementObjectId(restrictionName);
		String restrictionCategory = aclScreenDAO.getScreenName(objectId);
		
		Map<String, Object> aclConfigMap = new HashMap<String, Object>();
		aclConfigMap.put("RestrictionName", restrictionName);
		aclConfigMap.put("RestrictionCategory", restrictionCategory);

		return UXJacksonUtils.convertToJSON(aclConfigMap);
	}
	
}
