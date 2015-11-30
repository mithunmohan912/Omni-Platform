package com.csc.cscip.ux.pointin.rest.processor;

import java.util.Map;

import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCProcessor;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.rest.processor.xml.XMLProcessorCallbackContext;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.util.ConversionUtil;

public class PointJDBCXMLProcessor extends JDBCProcessor {

	@Override
	public String produceRequest(JDBCInfo jdbcInfo, ServiceProcessorCallback callback) throws Throwable {
		return "<PT4JPROC><SQLStmt>" + super.produceRequest(jdbcInfo, callback) + "</SQLStmt></PT4JPROC>";
	}

	private ServiceProcessorCallback SPResponseCallback = new ServiceProcessorCallback() {

		@Override
		public void processCallback(ServiceProcessorCallbackContext context) {
			XMLProcessorCallbackContext xmlContext = (XMLProcessorCallbackContext) context;
			xmlContext.overrideTagForClass("POINTJDBCRs", JDBCResponsePayLoad.class);
			xmlContext.overrideTagForClass("Row", Map.class);
			xmlContext.overrideTagForField("Rows", JDBCResponsePayLoad.class, "rows");
		}

	};

	private ServiceProcessorCallback SQLResponseCallback = new ServiceProcessorCallback() {

		@Override
		public void processCallback(ServiceProcessorCallbackContext context) {
			XMLProcessorCallbackContext xmlContext = (XMLProcessorCallbackContext) context;
			xmlContext.overrideTagForClass("PT4JSQLRs", JDBCResponsePayLoad.class);
			xmlContext.overrideTagForClass("Row", Map.class);
			xmlContext.overrideTagForField("Rows", JDBCResponsePayLoad.class, "rows");
		}

	};

	@Override
	public ServiceProcessorCallback getResponseProcessorCallback(JDBCInfo jdbcInfo, JDBCResponsePayLoad responsePayLoad) {
		return jdbcInfo.getType() == Type.SP ? SPResponseCallback : SQLResponseCallback;
	}

	@Override
	public Object consumeResponse(String responseXML, JDBCInfo jdbcInfo, JDBCResponsePayLoad responsePayLoad, ServiceProcessorCallback callback) throws Throwable {

		if (responseXML.contains("<exception>")) {
			String responseJSON = ConversionUtil.convertXMLtoJSON(responseXML);
			return responseJSON;
		}

		return super.consumeResponse(responseXML, jdbcInfo, responsePayLoad, callback);
	}

	protected String getValue(String type, Map<String, String> valueInfo, RequestPayLoad payLoad) {

		String prpValue = super.getValue(type, valueInfo, payLoad);

		if (prpValue == null) {
			if (type != null && type.equals("KEY")) {

				String payLoadKey = (String) payLoad.get("KEY");

				String startIndex = valueInfo.get("startIndex");
				String endIndex = valueInfo.get("endIndex");

				int startIndexValue = 0;
				if (startIndex != null) {
					startIndexValue = Integer.parseInt(startIndex);
				}

				int endIndexValue = payLoadKey.length();
				if (endIndex != null && endIndex != "") {
					endIndexValue = Integer.parseInt(endIndex);
				}

				prpValue = payLoadKey.substring(startIndexValue, endIndexValue);
			}
		}

		return prpValue;
	}

}
