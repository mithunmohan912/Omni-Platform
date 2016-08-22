package com.csc.cscip.ux.pointin.rest.processor;

import com.csc.cscip.ux.common.rest.processor.AbstractServiceProcessor;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.pointin.util.Crypt;
import com.csc.cscip.ux.pointin.util.SurroundProductConfig;

public class MediaURLResolver extends AbstractServiceProcessor<RequestPayLoad, ResponsePayLoad> {

	@Override
	public Object produceRequest(RequestPayLoad requestPayLoad, com.csc.cscip.ux.common.rest.processor.ServiceProcessor.ServiceProcessorCallback callback) throws Throwable {

		String source = SurroundProductConfig.getProperty("Source");
		String level = SurroundProductConfig.getProperty("Level");
		String enterprise = SurroundProductConfig.getProperty("Enterprise");
		String userType = SurroundProductConfig.getProperty("UserType");
		String userOrg = SurroundProductConfig.getProperty("UserOrg");
		String cryptAlgorithm = SurroundProductConfig.getProperty("CryptAlgorithm");
		String navView = SurroundProductConfig.getProperty("NavView");
		String pageUrl = SurroundProductConfig.getProperty("PageUrl");

		String param = (String) requestPayLoad.get("param");
		String policy = (String) requestPayLoad.get("policy");

		// TODO User Id is hard coded
		String key = "Source:" + source + ",Level:" + level + ",Enterprise:" + enterprise + ",UserType:" + userType + ",UserId:LAB01,UserOrg:" + userOrg + ",CryptAlgorithm:" + cryptAlgorithm + ",Tab:" + param + ",NavView:" + navView + ",MMDocNum:" + policy;
		Crypt crypt = new Crypt();
		String result = crypt.sEncrypt(key);

		String url = pageUrl + "?userlist=" + result;

		return url;
	}

	@Override
	public Object consumeResponse(String responseData, RequestPayLoad requestPayLoad, ResponsePayLoad responsePayLoad, com.csc.cscip.ux.common.rest.processor.ServiceProcessor.ServiceProcessorCallback callback) throws Throwable {
		// TODO Auto-generated method stub
		return null;
	}

}
