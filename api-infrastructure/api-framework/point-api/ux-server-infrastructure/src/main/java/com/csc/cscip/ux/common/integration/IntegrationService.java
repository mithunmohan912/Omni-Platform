package com.csc.cscip.ux.common.integration;

import java.util.List;
import java.util.Map;

public interface IntegrationService {

	Object send(String endPointURI, Map<String, String> headers, Object payLoad);

	<T> T send(String endPointURI, Map<String, String> headers, Object payLoad, Class<T> returnType);

	<T> T receive(String endPointURI, Class<T> returnType);

	List<String> receiveHeaders(String endPointURI, String headerName);
}
