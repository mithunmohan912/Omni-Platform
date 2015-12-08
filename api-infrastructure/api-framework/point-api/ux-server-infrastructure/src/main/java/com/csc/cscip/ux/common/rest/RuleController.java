package com.csc.cscip.ux.common.rest;

import java.io.FileNotFoundException;
import java.io.StringReader;
import java.util.Properties;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;

@Controller
public class RuleController extends AbstractRestController {

	private static Properties validaitonRules = new Properties();;

	@RequestMapping(value = "/rules/validation/{name}", method = RequestMethod.GET)
	public @ResponseBody
	Object getValidationRules(@PathVariable String name, HttpServletResponse response) throws Throwable {
		
		String validationProp = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.RULES_META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.RULES_META_MODEL_REPOSITORY_END_POINT_URI), "validation.properties", "");
		validaitonRules.load(new StringReader(validationProp));
		
		String validationJSON = (String) validaitonRules.get(name);
		return validationJSON;
	}

	@RequestMapping(value = "/rules/viewstate/{name}", method = RequestMethod.GET)
	public @ResponseBody
	Object getViewStateRules(@PathVariable String name) throws Throwable {
		try{
		return UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.RULES_META_MODEL_REPOSITORY_TYPE),
				UXAppConfig.getProperty(UXAppConfig.RULES_META_MODEL_REPOSITORY_END_POINT_URI), name.concat(".json"), "viewstate");
		}catch(FileNotFoundException e){
			return null;
		}
		
	}

}
