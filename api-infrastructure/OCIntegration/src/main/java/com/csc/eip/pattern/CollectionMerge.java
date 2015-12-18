package com.csc.eip.pattern;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.csc.eip.bo.SystemRecord;
import com.csc.eip.util.Constants;

public class CollectionMerge {

	static Logger log = Logger.getLogger(CollectionMerge.class.getName());
	public static int statCounter = 1;
	public Map<String, Integer> mapperPageNumber = new HashMap<String, Integer>();

	public static void test(String args[]) {

		String sorList = "{SOR1,SOR2}";
		sorList = sorList.replaceAll(Constants.CURLY_BRACES_REG_EXP, Constants.EMPTY_STRING)
				.replaceAll(Constants.BLANK_SPACES_REG_EXP, Constants.EMPTY_STRING);
		String[] sorListArray = sorList.split(Constants.COMMA_DELIMITER);
		int totalWidth = 0;
		int sorSize = sorListArray.length;
		int size = 50;
		int width = 16;
		//Math.floorDiv(size, sorSize);
		ArrayList<SystemRecord> systemRecordList = new ArrayList<SystemRecord>();

		for (int i = 0; i <= sorListArray.length - 1; i++) {
			String sor = sorListArray[i];
			if (i == sorListArray.length - 1) {
				width = size - totalWidth;
			}
			totalWidth = totalWidth + width;
			SystemRecord systemRecord = new SystemRecord(sor, true, width);
			if (systemRecord.getName().equals("SOR1")) {
				systemRecord.setLength(80);
			}
			if (systemRecord.getName().equals("SOR2")) {
				systemRecord.setLength(90);
			}
			if (systemRecord.getName().equals("SOR3")) {
				systemRecord.setLength(3);
			}
			if (systemRecord.getName().equals("SOR4")) {
				systemRecord.setLength(60);
			}
			log.info("SOR - Name : " + systemRecord.getName() + " Size : " + systemRecord.getLength() + " Width : "
					+ systemRecord.getWidth() + " Flag : " + systemRecord.isEnable());

			systemRecordList.add(systemRecord);
		}

		for (int i = 0; i < 10; i++) {
			process(systemRecordList, 50);
			log.info(
					"-----------------------------------------------------------------------------------------------------------");
		}

	}

	public static void process(ArrayList<SystemRecord> systemRecordList, int totalResultCount) {
		int nextPageNumber = statCounter;

		int thisInstanceResultCount = 0;
		boolean exitFlag = false;
		int thisIterationResultCount = 1;
		int widthSet = 0;
		int total = 0;
		while (totalResultCount >= total && !exitFlag
				&& (totalResultCount >= thisInstanceResultCount || totalResultCount >= widthSet)
				&& (thisIterationResultCount > 0 || statCounter == 1)) {
			thisIterationResultCount = 0;
			total = 0;
			for (SystemRecord systemRecord : systemRecordList) {
				// exitFlag = false;
				if (totalResultCount < systemRecord.getWidth()) {
					exitFlag = true;
				}
				if (!exitFlag) {
					int resultCount = 0;
					resultCount = callSOR(systemRecord, statCounter);
					thisInstanceResultCount = thisInstanceResultCount + resultCount;
					thisIterationResultCount = thisIterationResultCount + resultCount;
					log.info("Result Count from - " + systemRecord.getName() + " page : " + statCounter + " - "
							+ resultCount);
					totalResultCount = totalResultCount - resultCount;
					widthSet = systemRecord.getWidth();

					if (resultCount == systemRecord.getWidth()) {
						total = total + systemRecord.getWidth();
					} else {
						continue;
					}
				}
			}
			log.info("Total of SORs that resulted in full result-set---" + total);
			nextPageNumber = statCounter + 1;
			statCounter = nextPageNumber;

		}

	}

	public static int callSOR(SystemRecord sor, int pageNumber) {
		if (sor.getLength() - (sor.getWidth() * statCounter) >= 0) {
			return sor.getWidth();
		} else if (sor.getLength() < sor.getWidth() && statCounter == 1) {
			return sor.getLength();
		} else if (sor.getLength() - (sor.getWidth() * (statCounter - 1)) < sor.getWidth()
				&& sor.getLength() - (sor.getWidth() * (statCounter - 1)) >= 0) {
			return sor.getLength() - (sor.getWidth() * (statCounter - 1));
		} else {
			return 0;
		}
	}

}
