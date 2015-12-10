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

import com.csc.cscip.ux.common.dao.DataAccessObject.Filter;
import com.csc.cscip.ux.common.dao.DataAccessObject.ResultSetProcessor;
import com.csc.cscip.ux.common.dao.acl.*;
import com.csc.cscip.ux.common.dao.userconfig.*;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXJacksonUtils;


@Controller
@SuppressWarnings("unchecked")
public class UserConfigurationController extends AbstractRestController{
	
	@RequestMapping(value = "/userinfo/{userid}", method = RequestMethod.GET)
	public @ResponseBody
	String getUserInfo(@PathVariable String userid, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserConfigDAO userConfigDAO = new UserConfigDAO();

		Object userInfo = userConfigDAO.getUserInfo(userid);		

		Map<String, Object> usersMap = new HashMap<String, Object>();
		usersMap.put("userInfo", userInfo);

		return UXJacksonUtils.convertToJSON(usersMap);
	}
	
	@RequestMapping(value = "/userinfo", method = RequestMethod.GET)
	public @ResponseBody
	String getAllUserInfo(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserConfigDAO userConfigDAO = new UserConfigDAO();
		final List<Object> AllUerList = new ArrayList<Object>();

		userConfigDAO.getUserList(new ResultSetProcessor() {
			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> allUsersMap = new HashMap<String, Object>();
					allUsersMap.put("userID", rs.getString("userID"));
					allUsersMap.put("Email", rs.getString("Email"));
					allUsersMap.put("Organization", rs.getString("Organization"));
					allUsersMap.put("FirstName", rs.getString("FirstName"));
					allUsersMap.put("MiddleName", rs.getString("MiddleName"));
					allUsersMap.put("LastName", rs.getString("LastName"));
					AllUerList.add(allUsersMap);
				}

				return AllUerList;
			}
		});		

		Map<String, Object> usersMap = new HashMap<String, Object>();
		usersMap.put("userInfo", AllUerList);

		return UXJacksonUtils.convertToJSON(usersMap);
	}
	
	@RequestMapping(value = "/userinfo", method = RequestMethod.POST)
	public @ResponseBody
	String insertUserInfo(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String userConfigJSON = IOUtils.readContent(request.getInputStream());
		Map<String, Object> userPayLoadMap = UXJacksonUtils.convertFromJSON(userConfigJSON, RequestPayLoad.class);		
		Map<String, Object> userInfoList = (Map<String, Object>) userPayLoadMap.get("userInfo");
		
		UserConfigDAO userConfigDAO = new UserConfigDAO();
		
		String UserID = (String) userInfoList.get("UserID");
		String Email = (String) userInfoList.get("Email");
		String Organization = (String) userInfoList.get("Organization");
		String OrganizationUnit = (String) userInfoList.get("OrganizationUnit");
		String FirstName = (String) userInfoList.get("FirstName");
		String MiddleName = (String) userInfoList.get("MiddleName");
		String LastName = (String) userInfoList.get("LastName");
		String Prefix = (String) userInfoList.get("Prefix");
		String Suffix = (String) userInfoList.get("Suffix");
		String CommonName = (String) userInfoList.get("CommonName");
		String DateOfBirth = (String) userInfoList.get("DateOfBirth");
		String Gender = (String) userInfoList.get("Gender");
		String ContactName = (String) userInfoList.get("ContactName");
		String UserType = (String) userInfoList.get("UserType");
		String HomePhoneNum = (String) userInfoList.get("HomePhoneNum");
		String HomePhoneExt = (String) userInfoList.get("HomePhoneExt");
		String BusinessPhoneNum = (String) userInfoList.get("BusinessPhoneNum");
		String BusinessPhoneExt = (String) userInfoList.get("BusinessPhoneExt");
		String HomeAddress = (String) userInfoList.get("HomeAddress");
		String HomeCity = (String) userInfoList.get("HomeCity");
		String HomeState = (String) userInfoList.get("HomeState");
		String HomeZip = (String) userInfoList.get("HomeZip");
		String HomeCountry = (String) userInfoList.get("HomeCountry");
		String BusinessAddress = (String) userInfoList.get("BusinessAddress");
		String BusinessCity = (String) userInfoList.get("BusinessCity");
		String BusinessState = (String) userInfoList.get("BusinessState");
		String BusinessZip = (String) userInfoList.get("BusinessZip");
		String BusinessCountry = (String) userInfoList.get("BusinessCountry");
		String Status = (String) userInfoList.get("Status");
		String EnterpriseCd = (String) userInfoList.get("EnterpriseCd");
		Boolean LockedInd = (Boolean) userInfoList.get("LockedInd");
		String InformationOrderingSuffixCd = (String) userInfoList.get("InformationOrderingSuffixCd");
		String UserReferenceNbr = (String) userInfoList.get("UserReferenceNbr");
		String UserReferenceTypeCd = (String) userInfoList.get("UserReferenceTypeCd");
		String UserSecQuestionCd1 = (String) userInfoList.get("UserSecQuestionCd1");
		String UserSecQuestionCd2 = (String) userInfoList.get("UserSecQuestionCd2");
		String UserSecQuestionCd3 = (String) userInfoList.get("UserSecQuestionCd3");
		String UserSecAnswerTxt1 = (String) userInfoList.get("UserSecAnswerTxt1");
		String UserSecAnswerTxt2 = (String) userInfoList.get("UserSecAnswerTxt2");
		String UserSecAnswerTxt3 = (String) userInfoList.get("UserSecAnswerTxt3");
		Boolean UserPasswordExpiredInd  = (Boolean) userInfoList.get("UserPasswordExpiredInd");
		
		userConfigDAO.deleteEntry(UserID);
		userConfigDAO.insertUser(UserID, Email, Organization, OrganizationUnit, FirstName, MiddleName, LastName, Prefix, Suffix, CommonName, DateOfBirth, Gender, ContactName, UserType, HomePhoneNum, HomePhoneExt, BusinessPhoneNum, BusinessPhoneExt, HomeAddress, HomeCity, HomeState, HomeZip, HomeCountry, BusinessAddress, BusinessCity, BusinessState, BusinessZip, BusinessCountry, Status, EnterpriseCd, LockedInd, InformationOrderingSuffixCd, UserReferenceNbr, UserReferenceTypeCd, UserSecQuestionCd1, UserSecQuestionCd2, UserSecQuestionCd3, UserSecAnswerTxt1, UserSecAnswerTxt2, UserSecAnswerTxt3, UserPasswordExpiredInd);

		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "User information updated successfully.";
		userInfoMessage.put("Message", resultMessage);
		return UXJacksonUtils.convertToJSON(userInfoMessage);

	}
	
	@RequestMapping(value = "/homeappsinfo", method = RequestMethod.GET)
	public @ResponseBody
	String getAllHomeApps(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		HomePageConfigDAO homepageDAO = new HomePageConfigDAO();
		final List<Object> AllAppList = new ArrayList<Object>();

		homepageDAO.getAppList(new ResultSetProcessor() {
			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> allAppsMap = new HashMap<String, Object>();
					allAppsMap.put("APP_ID", rs.getString("APP_ID"));
					allAppsMap.put("APPNAME", rs.getString("APPNAME"));
					allAppsMap.put("APP_TITLE", rs.getString("APP_TITLE"));				
					AllAppList.add(allAppsMap);
				}

				return AllAppList;
			}
		});		

		Map<String, Object> appsMap = new HashMap<String, Object>();
		appsMap.put("homeAppsInfo", AllAppList);

		return UXJacksonUtils.convertToJSON(appsMap);
	}

	@RequestMapping(value = "/userroles/{userId}",method = RequestMethod.GET)
	public @ResponseBody
	String getAllUserRoles(@PathVariable String userId, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserRoleDAO userRoleDAO = new UserRoleDAO();
		final List<Object> AllUserRolesList = new ArrayList<Object>();

		userRoleDAO.selectAllUserRoles(userId, new ResultSetProcessor() {
			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> allUserRolesMap = new HashMap<String, Object>();
					allUserRolesMap.put("UserID", rs.getString("UserID"));
					allUserRolesMap.put("Role", rs.getString("Role"));				
					AllUserRolesList.add(allUserRolesMap);
				}

				return AllUserRolesList;
			}
		});		

		Map<String, Object> usersMap = new HashMap<String, Object>();
		usersMap.put("UserRoles", AllUserRolesList);

		return UXJacksonUtils.convertToJSON(usersMap);
	}
	@RequestMapping(value = "/userroles", method = RequestMethod.POST)
	public @ResponseBody
	String insertUserRoleInfo(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String userRoleJSON = IOUtils.readContent(request.getInputStream());
		Map<String, Object> userPayLoadMap = UXJacksonUtils.convertFromJSON(userRoleJSON, RequestPayLoad.class);		
		Map<String, Object> userRoleList = (Map<String, Object>) userPayLoadMap.get("UserRoles");

		UserRoleDAO userRoleDAO = new UserRoleDAO();

		String UserID = (String) userRoleList.get("UserID");
		String Role = (String) userRoleList.get("Role");
		
		userRoleDAO.deleteEntry(UserID,Role);
		userRoleDAO.insertUser(UserID,Role);

		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "User Roles information updated successfully.";
		userInfoMessage.put("Message", resultMessage);
		return UXJacksonUtils.convertToJSON(userInfoMessage);
}
	
	@RequestMapping(value = "/userroles/{userId}/{Role}",method = RequestMethod.DELETE)
	public @ResponseBody
	String deleteUserRole(@PathVariable String userId,@PathVariable String Role, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserRoleDAO userRoleDAO = new UserRoleDAO();
	
		userRoleDAO.deleteEntry(userId, Role);
	
		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "User Role assignment is deleted successfully.";
		userInfoMessage.put("Message", resultMessage);
		return UXJacksonUtils.convertToJSON(userInfoMessage);
	}
	@RequestMapping(value = "/roleusers/{role}",method = RequestMethod.GET)
	public @ResponseBody
	String selectAllRoles(@PathVariable String role, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserRoleDAO userRoleDAO = new UserRoleDAO();
		final List<Object> AllRolesList = new ArrayList<Object>();

		userRoleDAO.selectAllRoles(role, new ResultSetProcessor() {
			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> allUserRolesMap = new HashMap<String, Object>();
					allUserRolesMap.put("UserID", rs.getString("UserID"));
					allUserRolesMap.put("Role", rs.getString("Role"));				
					AllRolesList.add(allUserRolesMap);
				}
				return AllRolesList;
			}
		});	
		Map<String, Object> usersMap = new HashMap<String, Object>();
		usersMap.put("RoleUsers", AllRolesList);

		return UXJacksonUtils.convertToJSON(usersMap);
	}
	@RequestMapping(value = "/useragencies/{userId}",method = RequestMethod.GET)
	public @ResponseBody
	String getAllUserAgencies(@PathVariable String userId, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserAgencyDAO userAgencyDAO = new UserAgencyDAO();
		final List<Object> AllUserAgenciesList = new ArrayList<Object>();

		userAgencyDAO.selectAllUserAgencies(userId, new ResultSetProcessor() {
			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> allUserAgenciesMap = new HashMap<String, Object>();
					allUserAgenciesMap.put("UserID", rs.getString("UserID"));
					allUserAgenciesMap.put("AgencyID", rs.getString("AgencyID"));
					allUserAgenciesMap.put("AgencyOrderNbr", rs.getString("AgencyOrderNbr"));
					AllUserAgenciesList.add(allUserAgenciesMap);
				}

				return AllUserAgenciesList;
			}
		});		

		Map<String, Object> usersMap = new HashMap<String, Object>();
		usersMap.put("UserAgencies", AllUserAgenciesList);

		return UXJacksonUtils.convertToJSON(usersMap);
	}
	@RequestMapping(value = "/agencyusers/{agencyId}",method = RequestMethod.GET)
	public @ResponseBody
	String getAllAgencyUsers(@PathVariable String agencyId, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserAgencyDAO userAgencyDAO = new UserAgencyDAO();
		final List<Object> AllAgencyUsersList = new ArrayList<Object>();

		userAgencyDAO.selectAllAgencies(agencyId, new ResultSetProcessor() {
			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> allAgencyUsersMap = new HashMap<String, Object>();
					allAgencyUsersMap.put("UserID", rs.getString("UserID"));
					allAgencyUsersMap.put("AgencyID", rs.getString("AgencyID"));
					allAgencyUsersMap.put("AgencyOrderNbr", rs.getString("AgencyOrderNbr"));
					AllAgencyUsersList.add(allAgencyUsersMap);
				}

				return AllAgencyUsersList;
			}
		});		

		Map<String, Object> usersMap = new HashMap<String, Object>();
		usersMap.put("AgencyUsers", AllAgencyUsersList);

		return UXJacksonUtils.convertToJSON(usersMap);
	}
	@RequestMapping(value = "/useragencies", method = RequestMethod.POST)
	public @ResponseBody
	String insertUserAgencyInfo(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String userAgencyJSON = IOUtils.readContent(request.getInputStream());
		Map<String, Object> userPayLoadMap = UXJacksonUtils.convertFromJSON(userAgencyJSON, RequestPayLoad.class);		
		Map<String, Object> userAgencyList = (Map<String, Object>) userPayLoadMap.get("UserAgencies");

		UserAgencyDAO userAgencyDAO = new UserAgencyDAO();

		String UserID = (String) userAgencyList.get("UserID");
		String AgencyID = (String) userAgencyList.get("AgencyID");		
		
		userAgencyDAO.insertUser(UserID,AgencyID);
	
		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "User Agency information updated successfully.";
		userInfoMessage.put("Message", resultMessage);
		return UXJacksonUtils.convertToJSON(userInfoMessage);
}
	@RequestMapping(value = "/useragencies/{userId}/{agencyId}",method = RequestMethod.DELETE)
	public @ResponseBody
	String deleteUserAgency(@PathVariable String userId, @PathVariable String agencyId,HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserAgencyDAO userAgencyDAO = new UserAgencyDAO();
	
		userAgencyDAO.deleteuserAgency(userId, agencyId);
	
		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "Agency ID: "+agencyId+" is deleted successfully.";
		userInfoMessage.put("Message", resultMessage);
		return UXJacksonUtils.convertToJSON(userInfoMessage);
	}
	
	@RequestMapping(value = "/userlocation",method = RequestMethod.GET)
	public @ResponseBody
	String getAllUserLocation(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserLocationDAO userLocationDAO = new UserLocationDAO();
		final List<Object> AllUserLocationList = new ArrayList<Object>();

		userLocationDAO.selectAllLocations(new ResultSetProcessor() {
			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> allUserLocationMap = new HashMap<String, Object>();
					allUserLocationMap.put("AGNUMCO", rs.getString("AGNUMCO"));
					allUserLocationMap.put("AGNUPCO", rs.getString("AGNUPCO"));
					allUserLocationMap.put("AGNUNBR", rs.getString("AGNUNBR"));
					allUserLocationMap.put("UNDCODE", rs.getString("UNDCODE"));
					allUserLocationMap.put("UNDDESC", rs.getString("UNDDESC"));
					allUserLocationMap.put("UNDDFT", rs.getString("UNDDFT"));
					allUserLocationMap.put("EFFDATE", rs.getDate("EFFDATE"));
					allUserLocationMap.put("EXPDATE", rs.getDate("EXPDATE"));
					allUserLocationMap.put("UNDTYPCDE", rs.getString("UNDTYPCDE"));
					AllUserLocationList.add(allUserLocationMap);
				}

				return AllUserLocationList;
			}
		});		

		Map<String, Object> usersMap = new HashMap<String, Object>();
		usersMap.put("UserLocations", AllUserLocationList);

		return UXJacksonUtils.convertToJSON(usersMap);
	}
	
	@RequestMapping(value = "/functionsList", method = RequestMethod.GET)
	public @ResponseBody
	String geAclFunctionsList(HttpServletRequest request, HttpServletResponse response) throws Throwable {
		
		UserConfigDAO userConfigDAO = new UserConfigDAO();

		final List<Object> functionList = new ArrayList<Object>();

		userConfigDAO.listAllFunctions(new ResultSetProcessor() {

			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> aclFunctionsMap = new HashMap<String, Object>();
					aclFunctionsMap.put("RestrictionName", rs.getString("RestrictionName"));
					aclFunctionsMap.put("Category", rs.getString("Category"));
					aclFunctionsMap.put("Mask", rs.getString("Mask"));
					
					functionList.add(aclFunctionsMap);
				}

				return functionList;
			}
		});
		
		Map<String, Object> functionsMap = new HashMap<String, Object>();
		functionsMap.put("restrictionsList", functionList);

		return UXJacksonUtils.convertToJSON(functionsMap);

	}
	
	@RequestMapping(value = "/functionsList/{function}", method = RequestMethod.DELETE)
	public @ResponseBody
	String deleteAclFunction(@PathVariable String function,HttpServletRequest request, HttpServletResponse response) throws Throwable {
		
		UserConfigDAO userConfigDAO = new UserConfigDAO();
		AclElementDAO aclElementDAO = new AclElementDAO();
		function = function.replace("!","/");
		Map <String,Object> aclElems = aclElementDAO.selectRow(new Filter("object_id_identity",function));
		
		Long aclObjectId = (Long) aclElems.get("id");
		Long aclObjectClassId = (Long) aclElems.get("object_id_class");
		
		userConfigDAO.deleteFunction(aclObjectId,aclObjectClassId);
	
		List<Object> count = aclElementDAO.selectFunctionId(aclObjectClassId);
		
		if(count.size() == 0)
		{
			aclElementDAO.deleteFunctionId(aclObjectClassId);
		}
		
		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "Restriction "+function+" is deleted successfully.";
		userInfoMessage.put("Message", resultMessage);
		return UXJacksonUtils.convertToJSON(userInfoMessage);

	}
	
	@RequestMapping(value = "/rolefunction/{function}/{roleId}",method = RequestMethod.DELETE)
	public @ResponseBody
	String deleteAclRoleFunction(@PathVariable String function,@PathVariable Long roleId,HttpServletRequest request, HttpServletResponse response) throws Throwable {

		AclElementDAO aclElementDAO = new AclElementDAO();
		AclEntryDAO aclEntryDAO = new AclEntryDAO();
		function = function.replace("!","/");
		Long functionId = aclElementDAO.selectElementIdByName(function);
		
		aclEntryDAO.deleteEntry(functionId,roleId);
	
		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "Restriction : " +function+" is deleted successfully.";
		userInfoMessage.put("Message", resultMessage);
		return UXJacksonUtils.convertToJSON(userInfoMessage);
	}
	
	@RequestMapping(value = "/user/{userId}",method = RequestMethod.DELETE)
	public @ResponseBody
	String deleteUser(@PathVariable String userId,HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserConfigDAO userConfigDAO = new UserConfigDAO();
	
		userConfigDAO.deleteEntry(userId);
	
		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "User Id: "+userId+" is deleted successfully.";
		userInfoMessage.put("Message", resultMessage);
		return UXJacksonUtils.convertToJSON(userInfoMessage);
	}
	@RequestMapping(value = "/roles", method = RequestMethod.POST)
	public @ResponseBody
	String insertRoleInfo(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String roleJSON = IOUtils.readContent(request.getInputStream());
		Map<String, Object> userPayLoadMap = UXJacksonUtils.convertFromJSON(roleJSON, RequestPayLoad.class);		
		Map<String, Object> userAgencyList = (Map<String, Object>) userPayLoadMap.get("Role");

		AclGroupsDAO aclGroupDAO = new AclGroupsDAO();

		String groupID = (String) userAgencyList.get("Role_Name");
		String description = (String) userAgencyList.get("Role_Description");		
		
		aclGroupDAO.insertGroup(groupID,description);
	
		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "Role " + groupID + " is created successfully.";
		userInfoMessage.put("Message", resultMessage);		
		return UXJacksonUtils.convertToJSON(userInfoMessage);
	}
	
	@RequestMapping(value = "/roles/{Role}",method = RequestMethod.DELETE)
	public @ResponseBody
	String deleteRole(@PathVariable String Role, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		AclGroupsDAO aclGroupDAO = new AclGroupsDAO();
		
		aclGroupDAO.deleteRole(Role);
	
		Map<String, String> userInfoMessage = new HashMap<String, String>();
		String resultMessage = "Role: " + Role +" is deleted successfully.";
		userInfoMessage.put("Message", resultMessage);
		return UXJacksonUtils.convertToJSON(userInfoMessage);
	}
	
	@RequestMapping(value = "/rolefunctions/{roleId}", method = RequestMethod.GET)
	public @ResponseBody
	String getAllRoleFunctions(@PathVariable String roleId, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		UserConfigDAO userConfigDAO = new UserConfigDAO();
		final List<Object> AllRoleFunctiosList = new ArrayList<Object>();

		userConfigDAO.listAllRoleFunctions(roleId, new ResultSetProcessor() {
			@Override
			public Object processResultSet(ResultSet rs) throws SQLException {

				while (rs.next()) {
					Map<String, Object> allRoleFunctionsMap = new HashMap<String, Object>();
					allRoleFunctionsMap.put("RoleId", rs.getString("sid_id"));
					allRoleFunctionsMap.put("FunctionId", rs.getString("object_id_identity"));
					allRoleFunctionsMap.put("Category", rs.getString("class"));
					AllRoleFunctiosList.add(allRoleFunctionsMap);
				}

				return AllRoleFunctiosList;
			}
		});		

		Map<String, Object> usersMap = new HashMap<String, Object>();
		usersMap.put("RoleFunctionInfo", AllRoleFunctiosList);

		return UXJacksonUtils.convertToJSON(usersMap);
	}


}
