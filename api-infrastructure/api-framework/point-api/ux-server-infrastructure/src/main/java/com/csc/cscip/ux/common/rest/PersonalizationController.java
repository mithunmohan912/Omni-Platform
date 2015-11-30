package com.csc.cscip.ux.common.rest;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.dao.personalization.PersonalizationDAO;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.request.UXRestRequest;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXJacksonUtils;

@Controller
public class PersonalizationController extends AbstractRestController {

	@RequestMapping(value = "/personalization/{user}", method = RequestMethod.POST)
	public @ResponseBody
	String savePersonalizationData(@PathVariable String user, HttpServletRequest request, HttpServletResponse response) throws Throwable {

		String personalizationJSON = IOUtils.readContent(request.getInputStream());
		RequestPayLoad RestRequest = UXJacksonUtils.convertFromJSON(personalizationJSON, RequestPayLoad.class);

		PersonalizationDAO personalizationDAOObj = new PersonalizationDAO();
		Map<String, String> personalizationMessage = personalizationDAOObj.updateUserPersonalization(RestRequest, user, false);

		String personalizeMessage = UXJacksonUtils.convertToJSON(personalizationMessage);
		return personalizeMessage;

	}

	@RequestMapping(value = "/personalization/home/{user}", method = RequestMethod.POST)
	public @ResponseBody
	Object saveHomePersonalizationData(@PathVariable String user, HttpServletRequest request) throws Throwable {

		String homePersonalizationJSON = IOUtils.readContent(request.getInputStream());
		RequestPayLoad RestRequest = UXJacksonUtils.convertFromJSON(homePersonalizationJSON, RequestPayLoad.class);

		PersonalizationDAO personalizationDAOObj = new PersonalizationDAO();
		Map<String, String> personalizationMessage = personalizationDAOObj.updateUserPersonalization(RestRequest, user, true);

		return UXJacksonUtils.convertToJSON(personalizationMessage);

	}

}
