package com.csc.cscip.ux.common.util;

import java.io.InvalidObjectException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeSet;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class UXSupportMetaDataUtil {

	@SuppressWarnings("serial")
	private static class SortedProperties extends Properties {
		@Override
		public synchronized Enumeration<Object> keys() {
			return Collections.enumeration(new TreeSet<Object>(super.keySet()));
		}
	};

	public static String updateSupportMetaData(String metaModelContent, String remarks) throws Exception {

		SortedProperties supportProperties = new SortedProperties();
		Map<String, List<String>> supportMap = new HashMap<String, List<String>>();

		JSONCustomParser jParser = new JSONCustomParser(metaModelContent);
		if (findSupportData(jParser, supportMap)) {
			String supportGroup = (String) jParser.parseForData("groupid", true).get(0);
			String supportName = (String) jParser.parseForData("formid", true).get(0);

			if (supportGroup != null && supportName != null && !"".equals(supportGroup.trim()) && !"".equals(supportName.trim())) {

				String supportRepositoryEndPointURI = UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_END_POINT_URI);
				String fileName = supportName.concat(".properties");

				if (checkSupportFileExistence(supportRepositoryEndPointURI, fileName, supportProperties, supportGroup)) {
					updateSupportProperties(supportMap, supportProperties);
				} else {
					createSupportProperties(supportMap, supportProperties);
				}

				if (!supportProperties.isEmpty()) {
					StringWriter sw = new StringWriter();
					supportProperties.store(sw, null);
					UXRepositoryUtil.sendFile(UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_TYPE),
							supportRepositoryEndPointURI, fileName, sw.toString(), CommonConstants.TEXT_CONTENT_TYPE, supportGroup, remarks);
				}
			} else {
				throw new InvalidObjectException("Metamodel does not contain a valid groupid and/or formid.");
			}
		}
		return metaModelContent;
	}

	@SuppressWarnings("unchecked")
	private static boolean findSupportData(JSONCustomParser jParser, Map<String, List<String>> supportMap) throws Exception {
		boolean supportFound = false;
		List<?> list = jParser.parseForData("element", true);
		for (Object obj : list) {
			if (obj instanceof JSONObject) {
				Map<String, Object> elem = ConversionUtil.convertJSONStringtoMap(obj.toString());
				if (elem.containsKey("properties") && elem.get("properties") instanceof List) {
					List<Map<String, Object>> props = (List<Map<String, Object>>) elem.get("properties");
					Map<String, Object> propValues = new HashMap<String, Object>();
					for (Map<String, Object> prop : props) {
						propValues.put((String) prop.get("name"), prop.get("value"));
					}
					if (propValues.containsKey("supportType")) {
						supportFound = true;
						if (propValues.get("supportType").equals("generic")) {
							supportMap.put((String) elem.get("name"),
									Arrays.asList((String) propValues.get("supportType"), (String) propValues.get("lookUp")));
						} else if (propValues.get("supportType").equals("query")) {
							supportMap.put((String) elem.get("name"),
									Arrays.asList((String) propValues.get("supportType"), (String) propValues.get("query")));
						}
					}

				}
			}
		}
		return supportFound;
	}

	private static boolean checkSupportFileExistence(String supportDataRepositoryEndPointURI, String fileName,
			SortedProperties supportProperties, String childRelPath) throws Exception {
		boolean supportExists = false;
		String supportFileContents = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.SUPPORT_DATA_REPOSITORY_TYPE),
				supportDataRepositoryEndPointURI, fileName, childRelPath);
		if (supportFileContents != null) {
			supportExists = true;
			supportProperties.load(new StringReader(supportFileContents));
		}
		return supportExists;
	}

	private static void createSupportProperties(Map<String, List<String>> supportMap, SortedProperties supportProperties) {
		for (Map.Entry<String, List<String>> entry : supportMap.entrySet()) {
			String elemName = entry.getKey();
			List<String> list = entry.getValue();
			if (list.size() >= 2) {
				String type = list.get(0);
				String details = list.get(1);
				setProperty(elemName, type, details, supportProperties);
			}
		}
	}

	private static void updateSupportProperties(Map<String, List<String>> supportMap, SortedProperties supportProperties) {
		for (Map.Entry<String, List<String>> entry : supportMap.entrySet()) {
			String elemName = entry.getKey();
			List<String> list = entry.getValue();
			if (list.size() >= 2) {
				String type = list.get(0);
				String details = list.get(1);
				if (supportProperties.containsKey(elemName.concat(".type"))) {
					updateProperty(elemName, type, details, supportProperties);
				} else {
					setProperty(elemName, type, details, supportProperties);
				}
			}
		}
	}

	private static void setProperty(String elemName, String type, String details, SortedProperties supportProperties) {
		if (type.equals("generic")) {
			supportProperties.put(elemName.concat(".type"), "SP");
			if (!elemName.equalsIgnoreCase(details)) {
				supportProperties.put(elemName.concat(".lookup"), details.replaceAll("(\\w)(_)+(\\w)", "$1 $3"));
			}
		} else if (type.equals("query")) {
			supportProperties.put(elemName.concat(".type"), "SQL");
			supportProperties.put(elemName.concat(".supportinfo"), details);
		}
	}

	private static void updateProperty(String elemName, String type, String details, SortedProperties supportProperties) {
		String oldType = supportProperties.getProperty(elemName.concat(".type"));
		if (oldType.equals("SP")) {
			oldType = "generic";
		} else if (oldType.equals("SQL")) {
			oldType = "query";
		}
		if (!type.equals(oldType)) {
			supportProperties.remove(elemName.concat(".type"));
			supportProperties.remove(elemName.concat(".supportinfo"));
			supportProperties.remove(elemName.concat(".lookup"));
			setProperty(elemName, type, details, supportProperties);
		} else {
			if (oldType.equals("generic")) {
				supportProperties.remove(elemName.concat(".lookup"));
			}
			setProperty(elemName, type, details, supportProperties);
		}
	}
}
