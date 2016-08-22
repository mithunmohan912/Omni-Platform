package com.csc.cscip.ux.pointin.rest.processor;

import com.csc.cscip.ux.common.rest.processor.AbstractServiceProcessor;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCProcessorCallbackContext;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.util.StringUtils;

@SuppressWarnings("unchecked")
public class GridDataProcessor extends AbstractServiceProcessor<JDBCInfo, JDBCResponsePayLoad> {

	private ServiceProcessorCallback requestCallback = new ServiceProcessorCallback() {

		@Override
		public void processCallback(ServiceProcessorCallbackContext context) {

			JDBCProcessorCallbackContext jdbcContext = (JDBCProcessorCallbackContext) context;

			RequestPayLoad payLoad = jdbcContext.getJDBCInfo().getPayLoad();

			String maxKeySize = (String) payLoad.get("maxKeySize");
			if (maxKeySize != null) {
				int maxKeySizeValue = Integer.parseInt(maxKeySize);

				String payLoadKey = payLoad.get("KEY").toString();
				if (payLoadKey.length() < maxKeySizeValue) {
					payLoadKey = StringUtils.righPad(payLoadKey, maxKeySizeValue);
					payLoad.put("KEY", payLoadKey);
				}
			}

		}
	};

	@Override
	public ServiceProcessorCallback getRequestProcessorCallback(JDBCInfo jdbcInfo) {
		return requestCallback;
	}

	@Override
	public Object produceRequest(JDBCInfo jdbcInfo, ServiceProcessorCallback callback) throws Throwable {
		return getDelegate().produceRequest(jdbcInfo, getRequestProcessorCallback(jdbcInfo));
	}

//	private ServiceProcessorCallback responseCallback = new ServiceProcessorCallback() {
//
//		@Override
//		public void processCallback(ServiceProcessorCallbackContext context) {
//
//			JDBCProcessorCallbackContext jdbcContext = (JDBCProcessorCallbackContext) context;
//
//			List<Map<String, String>> rows = jdbcContext.getResponsePayLoad().getRows();
//
//			for (Iterator<Map<String, String>> rowIter = rows.iterator(); rowIter.hasNext();) {
//
//				Map<String, String> row = rowIter.next();
//				Map<String, String> newRow = new HashMap<String, String>();
//
//				// int counter = 0;
//				for (Iterator<Entry<String, String>> columnIter = row.entrySet().iterator(); columnIter.hasNext();) {
//
//					Entry<String, String> column = columnIter.next();
//
//					/*
//					 * if (!(column.getValue().equals(""))) { counter++; }
//					 */
//					if (column.getKey().contains("-")) {
//						String newColumnName = column.getKey().replaceAll("-", "");
//						columnIter.remove();
//						newRow.put(newColumnName, column.getValue());
//					}
//				}
//
//				row.putAll(newRow);
//
//				/*
//				 * if (counter < 3) { rowIter.remove(); }
//				 */
//			}
//		}
//	};
//
//	@Override
//	public ServiceProcessorCallback getResponseProcessorCallback(JDBCInfo jdbcInfo, JDBCResponsePayLoad jdbcResponsePayLoad) {
//		return responseCallback;
//	}

	@Override
	public Object consumeResponse(String responseData, JDBCInfo jdbcInfo, JDBCResponsePayLoad jdbcResponsePayLoad, ServiceProcessorCallback callback) throws Throwable {
		return getDelegate().consumeResponse(responseData, jdbcInfo, jdbcResponsePayLoad, getResponseProcessorCallback(jdbcInfo, jdbcResponsePayLoad));
	}

}