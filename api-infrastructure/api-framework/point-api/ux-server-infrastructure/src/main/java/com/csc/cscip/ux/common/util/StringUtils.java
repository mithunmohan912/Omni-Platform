package com.csc.cscip.ux.common.util;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

public class StringUtils {
	/**
	 * Method to pad the string with spaces till the provided maximum length.
	 * 
	 * @param data - source data as string
	 * @param maxLen - maximum length of padding
	 * @return - padded string
	 */
	public static String righPad(String data, int maxLen) {
		int elementLen = data.length();
		if (elementLen < maxLen) {
			StringBuilder builder = new StringBuilder(data);
			while (elementLen < maxLen) {
				builder.append(" ");
				elementLen++;
			}
			data = builder.toString();
		}
		return data;
	}

	/**
	 * Method for concatenation of strings into target. If target length > length of concatenated string then remaining part of target will
	 * be added to the end of the concatenated string.
	 * 
	 * @param target - target for concatenation
	 * @param maxLen - maximum length of concatenated string
	 * @param part1 - first part for concatenation
	 * @param parts - other parts for concatenation
	 * @return concatenated string
	 */
	public static String concat(String target, int maxLen, String part1, String... parts) {
		if (target == null) {
			target = "";
		}
		StringBuffer buf = new StringBuffer(maxLen);
		buf.append(part1);
		for (int i = 0; i < parts.length; i++) {
			buf.append(parts[i]);
		}
		if (buf.length() < target.length())
			buf.append(target.substring(buf.length()));
    
   		return trimAfter(buf.toString(), maxLen);
	}

    /**
   	 * Pad the string with spaces/zero till the provided maximum length.
   	 * @param data - source data as string
   	 * @param maxLen - maximum length of padding
   	 * @return - padded string
   	 */
   	public static String fill(String prpValue, String filler, int size) {
   		if(filler.equals(" ")){
   			while(prpValue.length() < size){
   				prpValue = prpValue + " ";
   			}
   		} else if(filler.equals("0")){
   			while(prpValue.length() < size){
   				prpValue = "0" + prpValue;
   			}
   		}
   		
   		return prpValue;
   	}

	/**
	 * Method to truncate string to given length
	 * 
	 * @param source - source data as string
	 * @param length - length
	 * @return - trimmed string
	 */
	public static String trimAfter(String source, int length) {
		if (source == null)
			return source;
		if (source.length() > length)
			return source.substring(0, length);
		else
			return source;
	}

	/**
	 * Method to extract query parameters from a URL string
	 * 
	 * @param url - URL String
	 * @return - Map of query parameters
	 * @throws Exception
	 */
	public static Map<String, String> getQueryParams(String url) throws Exception {
		Map<String, String> params = new HashMap<String, String>();
		String[] urlParts = url.split("\\?");
		if (urlParts.length > 1) {
			String query = urlParts[1];
			for (String param : query.split("&")) {
				String[] pair = param.split("=");
				String key = URLDecoder.decode(pair[0], CommonConstants.CHARSET);
				String value = "";
				if (pair.length > 1) {
					value = URLDecoder.decode(pair[1], CommonConstants.CHARSET);
				}
				params.put(key, value);
			}
		}
		return params;
	}
}
