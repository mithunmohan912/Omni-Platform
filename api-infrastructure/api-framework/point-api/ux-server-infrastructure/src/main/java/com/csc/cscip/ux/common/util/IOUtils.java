package com.csc.cscip.ux.common.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class IOUtils {

	public static InputStream getResourceAsStream(String fileName) throws FileNotFoundException {
		InputStream is = IOUtils.class.getResourceAsStream(fileName);
		if (is == null) {
			is = IOUtils.class.getClassLoader().getResourceAsStream(fileName);
		}
		if (is == null) {
			throw new FileNotFoundException(fileName);
		}
		return is;
	}

	public static String readContent(String fileName) throws IOException {
		return readContent(fileName, true);
	}

	public static String readContent(String fileName, boolean appendNewLine) throws IOException {

		return readContent(getResourceAsStream(fileName), true, appendNewLine);
	}

	public static String readContent(InputStream is) throws IOException {
		return readContent(is, false);
	}

	public static String readContent(InputStream is, boolean closeStream) throws IOException {
		return readContent(is, closeStream, false);
	}

	public static String readContent(InputStream is, boolean closeStream, boolean appendNewLine) throws IOException {
		StringBuilder content = new StringBuilder();
		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		String line = null;
		while ((line = br.readLine()) != null) {
			content.append(line);
			if (appendNewLine) {
				content.append("\n");
			}
		}
		if (closeStream) {
			is.close();
		}
		return content.toString();
	}

	/**
	 * Method to get a list of all sub directories for a give directory folder in file URI pattern (file://C:/xxx)
	 * 
	 * @param fileURI
	 * @return
	 * @throws Exception
	 */
	public static String[] getSubDirectoryList(String fileURI) throws Exception {
		fileURI = fileURI.substring(fileURI.indexOf(':'));
		Pattern pattern = Pattern.compile("\\w");
		Matcher matcher = pattern.matcher(fileURI);
		String[] subDirectories = {};
		if (matcher.find()) {
			fileURI = fileURI.substring(matcher.start(), fileURI.indexOf("?"));
			File file = new File(fileURI);
			subDirectories = file.list(new FilenameFilter() {
				public boolean accept(File current, String name) {
					return new File(current, name).isDirectory();
				}
			});
		}
		return subDirectories;
	}	
}
