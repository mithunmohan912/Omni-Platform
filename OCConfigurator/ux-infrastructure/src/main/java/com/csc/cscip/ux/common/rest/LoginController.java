package com.csc.cscip.ux.common.rest;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.dao.personalization.ApplicationDAO;
import com.csc.cscip.ux.common.dao.personalization.PersonalizationDAO;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.security.authentication.UserTransfer;
import com.csc.cscip.ux.common.security.util.TokenUtils;
import com.csc.cscip.ux.common.util.UXJacksonUtils;

@Controller
@SuppressWarnings("unchecked")
public class LoginController extends AbstractRestController {

	/*
	 * @Autowired
	 * private UserDetailsService userService;
	 */

	private PersonalizationDAO personalizationDAO = new PersonalizationDAO();
	private ApplicationDAO applicationDAO = new ApplicationDAO();

	/*
	 * @Autowired
	 * 
	 * @Qualifier("authenticationManager")
	 * private AuthenticationManager authManager;
	 * 
	 * @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	 * public @ResponseBody
	 * UserTransfer authenticate(HttpServletRequest request, HttpServletResponse response) throws Throwable {
	 * 
	 * String username = request.getParameter("username");
	 * String password = request.getParameter("password");
	 * 
	 * UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
	 * Authentication authentication = this.authManager.authenticate(authenticationToken);
	 * SecurityContextHolder.getContext().setAuthentication(authentication);
	 * 
	 * Map<String, Boolean> roles = new HashMap<String, Boolean>();
	 * 
	 * /*
	 * Reload user as password of authentication principal will be null after authorization and
	 * password is needed for token generation
	 * 
	 * UserDetails userDetails = this.userService.loadUserByUsername(username);
	 * 
	 * for (GrantedAuthority authority : userDetails.getAuthorities()) {
	 * roles.put(authority.toString(), Boolean.TRUE);
	 * }
	 * 
	 * String userPersonalization = getUserPersonalization(username);
	 * UserTransfer userTransfer = new UserTransfer(userDetails.getUsername(), roles, TokenUtils.createToken(userDetails), userPersonalization);
	 * 
	 * // Avoid to have the pages cached in browser's cache
	 * response.addHeader("Pragma", "No-cache");
	 * response.addHeader("Cache-Control", "no-cache,no-store,max-age=0");
	 * response.addIntHeader("Expires", 1);
	 * 
	 * return userTransfer;
	 * }
	 */
	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public @ResponseBody
	UserTransfer authenticate_PT(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String username = request.getParameter("username");
		String password = request.getParameter("password");

		List<Map<String, String>> rows = executeStmt(Type.SP, "BASCMDCENT('" + username.toUpperCase() + "   ')");

		Object index = new String("");
		Object query1 = null; // To store the System Override Date
		Object[] query2 = new String[3]; // To store the User Information
		Object query3 = null; // To store the User Email-Id
		Map<Object, Object> locList = new HashMap<Object, Object>(); // To store the List of Locations
		Map<Object, Object> mcoList = new HashMap<Object, Object>(); // To store the List of Master Companies
		Object[][] query6 = new String[50][3]; // To store the Main Menu Options
		Object[][] query7 = new String[500][11]; // To store all the Menu Options
		Object[] query8 = new String[2]; // To store the Security Restirctions for a User
		int count6 = 0, count7 = 0;
		String SecurityIndic = "N";
		Object pco = null;
		Object agency = new String();
		for (Iterator<Map<String, String>> rowIter = rows.iterator(); rowIter.hasNext();) {
			Map<String, String> rs = rowIter.next();
			index = rs.get("OUT-INDEX");
			if (index.equals("1")) {
				query1 = (String) rs.get("OUT-SYS-OVR"); // System Override Date
			} else if (index.equals("2")) {
				query2[0] = rs.get("OUT-ALLOPT"); // User Information
				query2[1] = rs.get("OUT-DFTLOC");
				query2[2] = rs.get("OUT-DFTMCO");
			} else if (index.equals("3")) {
				query3 = (String) rs.get("OUT-EMAIL"); // Email
			} else if (index.equals("4")) {
				Object LOC = rs.get("OUT-D301LOC");
				Object nameAddress = rs.get("OUT-NAMEADD");
				locList.put(LOC, nameAddress); // List of Locations
			} else if (index.equals("5")) {
//				Object LOC = rs.get("OUT-D301-LOC");
				Object MCO = rs.get("OUT-D301-MCO");
				Object nameAddress = rs.get("OUT-NAME-ADD");
				mcoList.put(MCO, nameAddress); // List of Master Companies
			} else if (index.equals("6")) {
				query6[count6][0] = rs.get("OUT-URL"); // Main Menu options
				query6[count6][1] = rs.get("OUT-MENUID");
				query6[count6][2] = rs.get("OUT-SEQUENCE");
				count6++;
			} else if (index.equals("7")) {
				query7[count7][0] = rs.get("OUT-MENU-ID"); // List of other menu options
				query7[count7][1] = rs.get("OUT-SEQ");
				query7[count7][2] = rs.get("OUT-MENUPGM");
				query7[count7][3] = rs.get("OUT-DESC");
				query7[count7][4] = rs.get("OUT-URL-ALL");
				query7[count7][5] = rs.get("OUT-PGMNAME");
				query7[count7][6] = rs.get("OUT-LDASEL");
				query7[count7][7] = rs.get("OUT-LAUNCH");
				query7[count7][8] = rs.get("OUT-ICONFG");
				query7[count7][9] = rs.get("OUT-ICONBG");
				query7[count7][10] = rs.get("OUT-INQONLY");
				count7++;
			} else if (index.equals("8")) {
				query8[0] = rs.get("OUT-COMPANY"); // User Security Restrictions
				query8[1] = rs.get("OUT-AGNMNBR");
			}
		}

		if (query8[0] != null) {
			if (!"".equals(query8[0])) {
				SecurityIndic = "P";
				pco = query8[0];
				agency = "";
			}
		} else if (query8[1] != null) {
			if (!"".equals(query8[1])) {
				SecurityIndic = "A";
				agency = query8[1];
				pco = "";
			}
		}

		Object systemOverrideDate = new String("       ");
		Object fullSystemOverrideDate = new String();
		// Object userInformation = new String[4];
		// Object allOpt = new String();
		Object LOC = new String();
		Object MCO = new String();
		// Object email = new String();

		// Using query1 to retrieve the system override date
		if (query1 != null) {
			systemOverrideDate = query1;
		}

		if (!systemOverrideDate.equals("")) {
			fullSystemOverrideDate = ((String) systemOverrideDate).substring(3, 5) + "/" + ((String) systemOverrideDate).substring(5, 7) + "/"
					+ ((String) systemOverrideDate).substring(1, 3);
		} else {
			fullSystemOverrideDate = "  /  /  ";
		}

		Object[] userInfo = new String[5];
		for (int i = 0; i < 5; i++)
			userInfo[i] = " ";
		String userFound = "N";
		// Using query2 to retrieve the user information
		if (query2[0] != null || query2[1] != null || query2[2] != null) {
			userInfo[0] = query2[0];// All Options
			userInfo[1] = query2[1];// Location Company
			userInfo[2] = query2[2];// Master Company
			userFound = "Y";
		}
		// If the user was found on the authorized user file (PMSPMM01), then access the BASSYSMM01 to
		// see if the user has an Email address set up.
		if (userFound.equals("Y") && query3 != null) {
			userInfo[3] = query3;// Email address
		}
//		allOpt = userInfo[0];
		LOC = userInfo[1];
		MCO = userInfo[2];
//		email = userInfo[3];

		if (userFound == "N") {
			throw new BadCredentialsException("No options available. Please check the User Profile entry in PMSPMM01 table.");
		}

		String userPersonalization = getUserPersonalization(username);
		UserTransfer userTransfer = new UserTransfer(username, null, TokenUtils.createToken(username, password), userPersonalization, LOC.toString(),
				MCO.toString(), locList, mcoList, fullSystemOverrideDate, SecurityIndic, pco, agency);

		// Avoid to have the pages cached in browser's cache
		response.addHeader("Pragma", "No-cache");
		response.addHeader("Cache-Control", "no-cache,no-store,max-age=0");
		response.addIntHeader("Expires", 1);

		return userTransfer;
	}

	public String getUserPersonalization(String user) throws Throwable {

		Map<String, Object> personalizationMap = new HashMap<String, Object>();

		Map<String, Object> userPersonalizationMap = personalizationDAO.getUserPersonalization(user);
		if(userPersonalizationMap==null){
			throw new BadCredentialsException("No options available. Please check the User Profile entry in USER_PERSONALIZATION table.");
		}
		String favouriteExpressOpt = (String) userPersonalizationMap.get("FAVOURITE_EXPRSPROC");
		String addedApps = (String) userPersonalizationMap.get("APPS_ADDED");

		personalizationMap.put("userhomescreen", getPersonalizedApplications(addedApps, favouriteExpressOpt));
		personalizationMap.put("usergreeting", userPersonalizationMap.get("USER_GREETING"));
		personalizationMap.put("userbanner", userPersonalizationMap.get("USER_BANNER"));
		personalizationMap.put("usertheme", userPersonalizationMap.get("USER_THEME"));
		personalizationMap.put("userfont", userPersonalizationMap.get("USER_FONT"));
		personalizationMap.put("userOptionBar", userPersonalizationMap.get("USER_OPTIONBAR"));
		personalizationMap.put("favExpressOptions", favouriteExpressOpt);

		String personalizationJSON = UXJacksonUtils.convertToJSON(personalizationMap);
		return personalizationJSON;
	}

	// function to fetch Application on the home screen
	public String getPersonalizedApplications(String addedApps, String favExpOpt) throws Throwable {

		String[] addedAppIds = {};
		// checking if addedApps is not empty
		if (addedApps.trim().length() > 0) {
			// removing comma from the end if added
			if (addedApps.charAt(addedApps.length() - 1) == ',') {
				addedApps = addedApps.substring(0, addedApps.length() - 1);
			}
			addedAppIds = addedApps.split(",");
		}
		List<Map<String, Object>> applicationList = (List<Map<String, Object>>) applicationDAO.getPersonalizedApplications(addedAppIds, favExpOpt);
		Map<String, Object> applications = new HashMap<String, Object>();

		applications.put("homeConfigList", applicationList);

		return UXJacksonUtils.convertToJSON(applications);
	}

	@ExceptionHandler(AuthenticationException.class)
	public static void handleException(AuthenticationException exception, HttpServletResponse httpServletResponse) throws Throwable {
		handleException(HttpServletResponse.SC_FORBIDDEN, exception, httpServletResponse);
	}

}
