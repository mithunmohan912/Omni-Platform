package com.csc.cscip.ux.common.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

@SuppressWarnings("unchecked")
public class UXUtils {

	public static final String ENCRYPTION_ALGORITHM = "AES";

	private static final String UTF_8 = "UTF-8";

	private final static Logger logger = LoggerFactory.getLogger(UXUtils.class);

	private static final SecretKey secretKey;

	static {

		try {
			KeyGenerator keyGen = KeyGenerator.getInstance(ENCRYPTION_ALGORITHM);
			keyGen.init(128);
			secretKey = keyGen.generateKey();
		} catch (final Exception ex) {
			throw new RuntimeException(ex);
		}
	}

	public static String buildServerURL(HttpServletRequest request) {

		String url = request.getRequestURL().toString();
		String uri = request.getRequestURI();

		String serverURL = url.replace(uri, "");

		return serverURL;
	}

	public static String encodeURL(String requestURL) {
		String result = null;
		try {
			result = URLEncoder.encode(requestURL, UTF_8);
		} catch (UnsupportedEncodingException e) {
			logger.error("", e);
		}
		return result;
	}

	public static Properties loadPropertiesFromPath(String filePath) throws IOException {
		Properties properties = new Properties();
		InputStream is = IOUtils.getResourceAsStream(filePath);
		properties.load(is);
		is.close();
		return properties;
	}

	public static Properties loadPropertiesFromContent(String fileContent) throws IOException {
		Properties properties = new Properties();
		if (fileContent != null) {
			properties.load(new StringReader(fileContent));
		}
		return properties;
	}

	public static Map<String, Object> applyExpressEntryRules(Map<String, Object> oldMetamodel) throws Throwable {

		Map<String, Object> newMetamodel = new HashMap<String, Object>();
		Map<String, Object> newMetaData = new HashMap<String, Object>();

		List<Map<String, Object>> staticElementList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> requiredElementList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> nonRequiredElementList = new ArrayList<Map<String, Object>>();

		Map<String, Object> oldMetadata = (Map<String, Object>) oldMetamodel.get("metadata");

		Set<Entry<String, Object>> oldMetadataEntries = oldMetadata.entrySet();

		for (Entry<String, Object> oldMetadataEntry : oldMetadataEntries) {

			if (oldMetadataEntry.getValue() instanceof String) {

				newMetaData.put(oldMetadataEntry.getKey(), oldMetadataEntry.getValue());

			} else {

				List<Map<String, Object>> oldSections = (List<Map<String, Object>>) oldMetadataEntry.getValue();

				for (int i = 0; i < oldSections.size(); i++) {
					Map<String, Object> oldSection = oldSections.get(i);

					Set<Entry<String, Object>> oldSectionEntrySet = oldSection.entrySet();
					for (Entry<String, Object> oldSectionEntry : oldSectionEntrySet) {

						if (!(oldSectionEntry.getValue() instanceof String)) {

							List<Map<String, Object>> oldSubSectionList = (List<Map<String, Object>>) oldSectionEntry.getValue();

							for (int j = 0; j < oldSubSectionList.size(); j++) {

								Map<String, Object> oldSubSection = oldSubSectionList.get(j);

								Set<Entry<String, Object>> oldSubSectionEntrySet = oldSubSection.entrySet();
								for (Entry<String, Object> oldSubSectionEntry : oldSubSectionEntrySet) {

									if (!(oldSubSectionEntry.getValue() instanceof String)) {

										List<Map<String, Object>> oldElementList = (List<Map<String, Object>>) oldSubSectionEntry.getValue();
										for (int k = 0; k < oldElementList.size(); k++) {

											Map<String, Object> oldElement = oldElementList.get(k);
											updateSpan(oldElement);
											if (isStaticElement(oldElement)) {
												staticElementList.add(oldElement);
											} else if (oldElement.get("required") != null && oldElement.get("required").equals("required")) {
												requiredElementList.add(oldElement);
											} else if (!(oldElement.get("type").equals("hidden"))) {
												nonRequiredElementList.add(oldElement);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}

		if (requiredElementList.isEmpty() || nonRequiredElementList.isEmpty()) {
			return oldMetamodel;
		}

		// Metadata
		newMetamodel.put("metadata", newMetaData);

		// section
		List<Map<String, Object>> sectionList = new ArrayList<Map<String, Object>>();
		Map<String, Object> newSectionMap = new HashMap<String, Object>();
		newSectionMap.put("sectionsize", "12");
		sectionList.add(newSectionMap);
		newMetaData.put("section", sectionList);

		// subsection
		List<Map<String, Object>> newSubsectionList = new ArrayList<Map<String, Object>>();

		// Static subsection
		Map<String, Object> staticSubSection = new HashMap<String, Object>();
		staticSubSection.put("title", "Primary Information");
		staticSubSection.put("id", "collapseStatic");

		// Required element
		staticSubSection.put("element", staticElementList);
		newSubsectionList.add(staticSubSection);

		// Required subsection
		Map<String, Object> requiredSubSection = new HashMap<String, Object>();
		requiredSubSection.put("title", "Required");
		requiredSubSection.put("id", "collapseMandatory");

		// Required element
		requiredSubSection.put("element", requiredElementList);
		newSubsectionList.add(requiredSubSection);

		// Non-required subsection
		Map<String, Object> nonRequiredSubSection = new HashMap<String, Object>();
		nonRequiredSubSection.put("title", "Optional");
		nonRequiredSubSection.put("id", "collapseNonMandatory");
		nonRequiredSubSection.put("autocollapse", "true");

		// Non-required Element
		nonRequiredSubSection.put("element", nonRequiredElementList);
		newSubsectionList.add(nonRequiredSubSection);

		newSectionMap.put("subsection", newSubsectionList);

		return newMetamodel;
	}

	private static void updateSpan(Map<String, Object> oldElement) {
		if ("12".equals(oldElement.get("fieldspan"))) {
			oldElement.put("fieldspan", "6");
		}

	}

	private static boolean isStaticElement(Map<String, Object> oldElement) {
		boolean result = false;
		if ("grouptext".equals(oldElement.get("type"))) {
			List<Map<String, Object>> ctrlGrpElems = (List<Map<String, Object>>) oldElement.get("controlgroup");
			for (Map<String, Object> ctrGrpElem : ctrlGrpElems) {
				result = true;
				if (ctrGrpElem.get("disabled") == null || "false".equals(ctrGrpElem.get("disabled"))) {
					result = false;
					break;
				}
			}
		} else {
			if ("true".equals(oldElement.get("disabled"))) {
				result = true;
			}
		}
		return result;
	}

	private static Map<String, Map<String, Object>> behavrMap;
	private static Map<String, Map<String, Object>> custombehavrMap;

	public static Map<String, Object> loadBehavior(String fileName) throws Throwable {
		////This behavior map contains registry for base screens
		if (behavrMap == null) {
			InputStream is = UXUtils.class.getResourceAsStream("/BehaviorRegistryList.json");
			behavrMap = UXJacksonUtils.convertFromJSON(is, Map.class);
			is.close();
		}
		//This behavior map contains registry for customer screens
		if (custombehavrMap == null) {
			InputStream is = UXUtils.class.getResourceAsStream("/BehaviorRegistryList_Custom.json");
			custombehavrMap = UXJacksonUtils.convertFromJSON(is, Map.class);
			is.close();
		}
		Map<String, Object> formBehvr = null;
		
		formBehvr = custombehavrMap.get(fileName);
		if(formBehvr == null){
			formBehvr = behavrMap.get(fileName);
		}
		return formBehvr;
	}

	private static Map<String, Object>  dataDictionaryMap;
	
	public static Map<String, Object> loadStaticDataDictionary(String fileName)throws Throwable {
		if(dataDictionaryMap == null){
			InputStream is = UXUtils.class.getResourceAsStream("/DataDictionary.json");
			dataDictionaryMap = UXJacksonUtils.convertFromJSON(is, Map.class);
			is.close();
		}
		
		Map<String, Object> dataDictionary = new HashMap<String, Object>();
		String  model = null;
		model = (String)dataDictionaryMap.get(fileName);
		
		InputStream is = UXUtils.class.getResourceAsStream("/models/"+model+".json");
		List<Object> elements = UXJacksonUtils.convertFromJSON(is, List.class);
		is.close();
		
		dataDictionary.put("ShortNameDef", elements);
		
		return dataDictionary;
	}
	private static String encode(byte[] elementValue) {
		return new BASE64Encoder().encode(elementValue);
	}

	private static byte[] decode(String encodedValue) throws IOException {
		return new BASE64Decoder().decodeBuffer(encodedValue);
	}

	public static String encryptOrDecrypt(String elementValue, boolean doDecrypt) throws Exception {
		Cipher myCypherOut = Cipher.getInstance(UXUtils.ENCRYPTION_ALGORITHM);
		String value = "";

		if (doDecrypt) {
			myCypherOut.init(Cipher.DECRYPT_MODE, secretKey);
			value = new String(myCypherOut.doFinal(decode(elementValue)));
		} else {
			myCypherOut.init(Cipher.ENCRYPT_MODE, secretKey);
			value = encode(myCypherOut.doFinal(elementValue.getBytes()));
		}

		return value;
	}

	public static void parseQuery(String query, Map<String, Object> paramMap) {
		String[] params = query.split("&");
		for (String param : params) {
			String[] paramPair = param.split("=");
			paramMap.put(paramPair[0], paramPair[1]);
		}
	}
	
	public static String formatDate(String date, String format) {

		String convertedDate = "";
		if (date!=null) {

			// Temp code : to handle bug in service layer
			if(date.length() == 15){
				date = date.substring(8);
			}

			String dd = "", mm = "", yyyy = "", c  = "0";
			String yy1 = "19", yy2 = "";

			if (date.indexOf("-") != -1) { // YYYY-MM-DD

				String[] datePart = date.split("-");
				dd = datePart[2]; 
				mm = datePart[1]; 
				yy2 = datePart[0].substring(2, 4);

			} else if (date.indexOf("/") != -1) {

				String[] datePart = date.split("/");
				if (datePart[2].length() == 2) { // MM/DD/YY

					yy2 = datePart[2];
					dd = datePart[1]; 
					mm = datePart[0];

				} else { // MM/DD/YYYY

					dd = datePart[1]; 
					mm = datePart[0]; 
					yy2 = datePart[2].substring(2, 4);
				}

			} else if (date.length() == 7) { // CYYMMDD

				c = date.substring(0, 1);
				yy2 = date.substring(1, 3);

				dd = date.substring(5, 7); 
				mm = date.substring(3, 5);
			}else if (date.length() == 6) { // MMDDYY

				yy2 = date.substring(4, 6);
				dd = date.substring(2, 4);
				mm = date.substring(0, 2);
			}

			if ( (yy2.compareTo("39")==-1) || (yy2.compareTo("39")==0)) {
				yy1 = "20";
				c = "1";
			}
			yyyy = yy1 + yy2;

			if(format.equals("mm/dd/yyyy")) {
				convertedDate = mm + '/' + dd + '/' + yyyy; 
			//
			} else if (format.equals("mm/dd/yy")) {
				convertedDate = mm + '/' + dd + '/' + yyyy.substring(2, 4);
			//
			} else if (format.equals("yyyy-mm-dd")) {
				convertedDate = yyyy + '-' + mm + '-' + dd;
			//
			} else if (format.equals("yymmdd")) {
				convertedDate = yyyy.substring(2, 4) + mm + dd;
			//
			} else if (format.equals("mmddyy")) {
				convertedDate =  mm + dd + yyyy.substring(2, 4);
			//
			} else { // CYYMMDD
				convertedDate = c + yyyy.substring(2, 4) + mm + dd;
			}


		}
		return convertedDate;
	}

}
