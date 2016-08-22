package com.csc.cscip.ux.pointin.rest.processor;

import java.util.Map;

import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.UXJacksonUtils;

@SuppressWarnings("unchecked")
public class PICSDataProcessor extends EditableGridDataProcessor {
	
	@Override
	public Object consumeResponse(String responseXML, Map requestPayLoad, Map responsePayLoad, ServiceProcessorCallback callback) throws Throwable {

		if (responseXML.contains("<exception>")) {
			String responseJSON = ConversionUtil.convertXMLtoJSON(responseXML);
			return responseJSON;
		}
		String gridData= ConversionUtil.convertXMLtoJSON(responseXML);
		Object map = UXJacksonUtils.convertFromJSON(gridData, Map.class).get("POINTXML");
		responsePayLoad.put("gridData", map);
		return responsePayLoad;
	}
}
