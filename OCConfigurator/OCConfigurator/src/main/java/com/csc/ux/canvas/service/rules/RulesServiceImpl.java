package com.csc.ux.canvas.service.rules;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.csc.cscip.ux.common.integration.IntegrationService;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.ux.canvas.CanvasConfig;
import com.csc.ux.canvas.dao.MetaModelDAO;

@Service
public class RulesServiceImpl implements RulesService {

	@Autowired
	private IntegrationService integrationService;
	@Autowired
	private CanvasConfig canvasConfig;
	@Autowired
	private MetaModelDAO metaModelDAO;

	@Override
	public String getRulesLaunchURL(HttpServletRequest request, String modelName, String modelContent) throws Exception {
		String requestXML = ConversionUtil.convertJSONtoXML(modelContent, "root");
		String messageName = metaModelDAO.getMessageName(modelName);
		String payLoad = ConversionUtil.transformXMLusingXSLTWithParams(requestXML, "GeneratePayLoad.xsl",
				canvasConfig.getTransformerURL(), "MessageName", messageName);
		String rulesReponse = handleRequest("LaunchRules", payLoad);
		return StringEscapeUtils.unescapeHtml(ConversionUtil.transformXMLusingXSLT(rulesReponse, "HandleRulesResponse.xsl",
				canvasConfig.getTransformerURL()));
	}

	private String handleRequest(String resource, String requestPayLoad) {
		return integrationService.send("direct:" + resource, null, requestPayLoad, String.class);
	}

}
