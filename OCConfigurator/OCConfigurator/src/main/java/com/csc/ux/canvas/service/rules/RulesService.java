package com.csc.ux.canvas.service.rules;

import javax.servlet.http.HttpServletRequest;

public interface RulesService {

	public String getRulesLaunchURL(HttpServletRequest request, String modelName, String modelContent) throws Exception;

}
