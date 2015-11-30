package com.csc.cscip.ux.pointin.rest.processor;

import com.csc.cscip.ux.common.rest.processor.AbstractServiceProcessor;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCProcessorCallbackContext;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.StringUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXJacksonUtils;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;
import com.csc.cscip.ux.common.util.UXUtils;

import java.io.IOException;
import java.util.Properties;

@SuppressWarnings("unchecked")
public class SupportDataProcessor extends AbstractServiceProcessor<RequestPayLoad, JDBCResponsePayLoad> {

	@Override
	public ServiceProcessorCallback getRequestProcessorCallback(final RequestPayLoad elementSupportInfo) {

		return new ServiceProcessorCallback() {

			@Override
			public void processCallback(ServiceProcessorCallbackContext context) {

				JDBCProcessorCallbackContext jdbcContext = (JDBCProcessorCallbackContext) context;

				JDBCInfo jdbcInfo = jdbcContext.getJDBCInfo();

				if (jdbcInfo.getType() == Type.SP && (jdbcInfo.getStmt() == null || !jdbcInfo.getStmt().contains("("))) {

					String stmt = (jdbcInfo.getStmt() == null) ? "ATTRIBPROC6" : jdbcInfo.getStmt();

					String key = StringUtils.righPad((String) jdbcInfo.getPayLoad().get("KEY"), 192);
					
					key = key.substring(0,192);

					String lookup = (String) elementSupportInfo.get("lookup");
					String element = (lookup == null) ? (String) elementSupportInfo.get("name") : lookup;
					element = StringUtils.righPad(element.replace("_", " "), 20);

					jdbcInfo.setStmt(stmt + "('" + key + " " + element + "')");

				}

			}
		};
	}

	public Object produceRequest(RequestPayLoad elementSupportInfo, ServiceProcessorCallback callback) throws Throwable {
		return getDelegate().produceRequest(elementSupportInfo.get("jdbcInfo"), getRequestProcessorCallback(elementSupportInfo));
	}

	@Override
	public ServiceProcessorCallback getResponseProcessorCallback(final RequestPayLoad elementSupportInfo, final JDBCResponsePayLoad jdbcResponsePayLoad) {

		return new ServiceProcessorCallback() {

			@Override
			public void processCallback(ServiceProcessorCallbackContext context) {

				JDBCProcessorCallbackContext jdbcContext = (JDBCProcessorCallbackContext) context;

				JDBCInfo jdbcInfo = jdbcContext.getJDBCInfo();

				JDBCResponsePayLoad jdbcResponsePayLoad = jdbcContext.getResponsePayLoad();

				jdbcResponsePayLoad.getPayLoad().put("name", elementSupportInfo.get("name"));

				String[] defaultSelectInfo;

				if (jdbcInfo.getType() == Type.SP) {

					defaultSelectInfo = new String[] { "ATTR-VALUE", "ATTR-DESCRIPTION" };

					String selectInfo = jdbcInfo.getSelectInfo();

					if (selectInfo != null) {

						String[] selectInfoArr = selectInfo.split(",");

						// Override value node
						defaultSelectInfo[0] = selectInfoArr[0];
						// Override description node
						if (selectInfoArr.length == 2) {
							defaultSelectInfo[1] = selectInfoArr[1];
						}
					}
				} else {
					defaultSelectInfo = new String[] { "value", "description" };
				}

				jdbcResponsePayLoad.getPayLoad().put("valueNode", defaultSelectInfo[0]);
				jdbcResponsePayLoad.getPayLoad().put("descriptionNode", defaultSelectInfo[1]);

			}
		};
	}

	@Override
	public Object consumeResponse(String responseXML, RequestPayLoad elementSupportInfo, JDBCResponsePayLoad jdbcResponsePayLoad, ServiceProcessorCallback callback) throws Throwable {
		return getDelegate().consumeResponse(responseXML, elementSupportInfo.get("jdbcInfo"), jdbcResponsePayLoad, getResponseProcessorCallback(elementSupportInfo, jdbcResponsePayLoad));
	}

}
