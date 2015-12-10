package com.csc.ux.canvas.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserLabelDetailRecord {
	private String usrLabel;
	private String usrRecField;
	private String usrEntryField;
	private int usrPosition;
	private char usrDataType;
	private int usrRecLength;
	private char usrErrorCode;
	private char usrIndA;
	private char usrIndB;
	private char usrIndC;
	private char usrIndD;

	public UserLabelDetailRecord() {
		usrLabel = "";
		usrRecField = "";
		usrEntryField = "";
		usrPosition = 0;
		usrDataType = ' ';
		usrRecLength = 0;
		usrErrorCode = ' ';
		usrIndA = ' ';
		usrIndB = ' ';
		usrIndC = ' ';
		usrIndD = ' ';
	}

	public UserLabelDetailRecord(String label, String recField, String entryField, int position, char datatype,
			int recLength, char errCd, char indA, char indB, char indC, char indD) {
		usrLabel = label;
		usrRecField = recField;
		usrEntryField = entryField;
		usrPosition = position;
		usrDataType = datatype;
		usrRecLength = recLength;
		usrErrorCode = errCd;
		usrIndA = indA;
		usrIndB = indB;
		usrIndC = indC;
		usrIndD = indD;
	}

	public static Map<String, UserLabelDetailRecord> mapRowsFromDatabase(UserLabelRecords userLabelRecords) {
		Map<String, UserLabelDetailRecord> rows = new HashMap<String, UserLabelDetailRecord>(16);
		for (int i = 1; i < 17; i++) {
			UserLabelDetailRecord row = new UserLabelDetailRecord();
			String rowKey = "";
			switch (i) {
			case 1:
				rowKey = userLabelRecords.getId().getCkcfcd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCkr7tx());
				row.setUsrRecField(userLabelRecords.getId().getCkcfcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkczcd());
				row.setUsrPosition(userLabelRecords.getId().getCkfpnb());
				row.setUsrDataType(userLabelRecords.getId().getCkisst());
				row.setUsrRecLength(userLabelRecords.getId().getCkf9nb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjdst());
				row.setUsrIndA(userLabelRecords.getId().getCkkgst());
				row.setUsrIndB(userLabelRecords.getId().getCkkxst());
				row.setUsrIndC(userLabelRecords.getId().getCkldst());
				row.setUsrIndD(userLabelRecords.getId().getCklsst());
				break;
			case 2:
				rowKey = userLabelRecords.getId().getCkcgcd().trim(); 
				row.setUsrLabel(userLabelRecords.getId().getCkr8tx());
				row.setUsrRecField(userLabelRecords.getId().getCkcgcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc0cd());
				row.setUsrPosition(userLabelRecords.getId().getCkfqnb());
				row.setUsrDataType(userLabelRecords.getId().getCkitst());
				row.setUsrRecLength(userLabelRecords.getId().getCkganb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjest());
				row.setUsrIndA(userLabelRecords.getId().getCkkhst());
				row.setUsrIndB(userLabelRecords.getId().getCkk1st());
				row.setUsrIndC(userLabelRecords.getId().getCklmst());
				row.setUsrIndD(userLabelRecords.getId().getCkl6st());
				break;
			case 3:
				rowKey = userLabelRecords.getId().getCkchcd().trim(); 
				row.setUsrLabel(userLabelRecords.getId().getCkr9tx());
				row.setUsrRecField(userLabelRecords.getId().getCkchcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc1cd());
				row.setUsrPosition(userLabelRecords.getId().getCkfrnb());
				row.setUsrDataType(userLabelRecords.getId().getCkiust());
				row.setUsrRecLength(userLabelRecords.getId().getCkgbnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjfst());
				row.setUsrIndA(userLabelRecords.getId().getCkkist());
				row.setUsrIndB(userLabelRecords.getId().getCkk2st());
				row.setUsrIndC(userLabelRecords.getId().getCklnst());
				row.setUsrIndD(userLabelRecords.getId().getCkl7st());
				break;
			case 4:
				rowKey = userLabelRecords.getId().getCkcicd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksatx());
				row.setUsrRecField(userLabelRecords.getId().getCkcicd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc2cd());
				row.setUsrPosition(userLabelRecords.getId().getCkfsnb());
				row.setUsrDataType(userLabelRecords.getId().getCkivst());
				row.setUsrRecLength(userLabelRecords.getId().getCkgcnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjgst());
				row.setUsrIndA(userLabelRecords.getId().getCkkjst());
				row.setUsrIndB(userLabelRecords.getId().getCkk3st());
				row.setUsrIndC(userLabelRecords.getId().getCklost());
				row.setUsrIndD(userLabelRecords.getId().getCkl8st());
				break;
			case 5:
				rowKey = userLabelRecords.getId().getCkcjcd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksbtx());
				row.setUsrRecField(userLabelRecords.getId().getCkcjcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc3cd());
				row.setUsrPosition(userLabelRecords.getId().getCkftnb());
				row.setUsrDataType(userLabelRecords.getId().getCkiwst());
				row.setUsrRecLength(userLabelRecords.getId().getCkgdnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjhst());
				row.setUsrIndA(userLabelRecords.getId().getCkkkst());
				row.setUsrIndB(userLabelRecords.getId().getCkk4st());
				row.setUsrIndC(userLabelRecords.getId().getCklpst());
				row.setUsrIndD(userLabelRecords.getId().getCkl9st());
				break;
			case 6:
				rowKey = userLabelRecords.getId().getCkckcd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksctx());
				row.setUsrRecField(userLabelRecords.getId().getCkckcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc4cd());
				row.setUsrPosition(userLabelRecords.getId().getCkfunb());
				row.setUsrDataType(userLabelRecords.getId().getCkixst());
				row.setUsrRecLength(userLabelRecords.getId().getCkgenb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjist());
				row.setUsrIndA(userLabelRecords.getId().getCkklst());
				row.setUsrIndB(userLabelRecords.getId().getCkk5st());
				row.setUsrIndC(userLabelRecords.getId().getCklqst());
				row.setUsrIndD(userLabelRecords.getId().getCkmast());
				break;
			case 7:
				rowKey = userLabelRecords.getId().getCkclcd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksdtx());
				row.setUsrRecField(userLabelRecords.getId().getCkclcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc5cd());
				row.setUsrPosition(userLabelRecords.getId().getCkfvnb());
				row.setUsrDataType(userLabelRecords.getId().getCkiyst());
				row.setUsrRecLength(userLabelRecords.getId().getCkgfnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjjst());
				row.setUsrIndA(userLabelRecords.getId().getCkkmst());
				row.setUsrIndB(userLabelRecords.getId().getCkk6st());
				row.setUsrIndC(userLabelRecords.getId().getCklrst());
				row.setUsrIndD(userLabelRecords.getId().getCkmbst());
				break;
			case 8:
				rowKey = userLabelRecords.getId().getCkcmcd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksetx());
				row.setUsrRecField(userLabelRecords.getId().getCkcmcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc6cd());
				row.setUsrPosition(userLabelRecords.getId().getCkfwnb());
				row.setUsrDataType(userLabelRecords.getId().getCkizst());
				row.setUsrRecLength(userLabelRecords.getId().getCkggnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjkst());
				row.setUsrIndA(userLabelRecords.getId().getCkknst());
				row.setUsrIndB(userLabelRecords.getId().getCkk7st());
				row.setUsrIndC(userLabelRecords.getId().getCkltst());
				row.setUsrIndD(userLabelRecords.getId().getCkmcst());
				break;
			case 9:
				rowKey = userLabelRecords.getId().getCkcncd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksftx());
				row.setUsrRecField(userLabelRecords.getId().getCkcncd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc7cd());
				row.setUsrPosition(userLabelRecords.getId().getCkfxnb());
				row.setUsrDataType(userLabelRecords.getId().getCki0st());
				row.setUsrRecLength(userLabelRecords.getId().getCkghnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjlst());
				row.setUsrIndA(userLabelRecords.getId().getCkkost());
				row.setUsrIndB(userLabelRecords.getId().getCkk8st());
				row.setUsrIndC(userLabelRecords.getId().getCklust());
				row.setUsrIndD(userLabelRecords.getId().getCkmdst());
				break;
			case 10:
				rowKey = userLabelRecords.getId().getCkcocd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksgtx());
				row.setUsrRecField(userLabelRecords.getId().getCkcocd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc8cd());
				row.setUsrPosition(userLabelRecords.getId().getCkfynb());
				row.setUsrDataType(userLabelRecords.getId().getCki1st());
				row.setUsrRecLength(userLabelRecords.getId().getCkginb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjmst());
				row.setUsrIndA(userLabelRecords.getId().getCkkpst());
				row.setUsrIndB(userLabelRecords.getId().getCkk9st());
				row.setUsrIndC(userLabelRecords.getId().getCklvst());
				row.setUsrIndD(userLabelRecords.getId().getCkmest());
				break;
			case 11:
				rowKey = userLabelRecords.getId().getCkcpcd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCkshtx());
				row.setUsrRecField(userLabelRecords.getId().getCkcpcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkc9cd());
				row.setUsrPosition(userLabelRecords.getId().getCkfznb());
				row.setUsrDataType(userLabelRecords.getId().getCki2st());
				row.setUsrRecLength(userLabelRecords.getId().getCkgjnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjnst());
				row.setUsrIndA(userLabelRecords.getId().getCkkqst());
				row.setUsrIndB(userLabelRecords.getId().getCklbst());
				row.setUsrIndC(userLabelRecords.getId().getCklwst());
				row.setUsrIndD(userLabelRecords.getId().getCkmfst());
				break;
			case 12:
				rowKey = userLabelRecords.getId().getCkcqcd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksitx());
				row.setUsrRecField(userLabelRecords.getId().getCkcqcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkdacd());
				row.setUsrPosition(userLabelRecords.getId().getCkf0nb());
				row.setUsrDataType(userLabelRecords.getId().getCki3st());
				row.setUsrRecLength(userLabelRecords.getId().getCkgknb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjost());
				row.setUsrIndA(userLabelRecords.getId().getCkkrst());
				row.setUsrIndB(userLabelRecords.getId().getCklcst());
				row.setUsrIndC(userLabelRecords.getId().getCklxst());
				row.setUsrIndD(userLabelRecords.getId().getCkmgst());

				break;
			case 13:
				rowKey = userLabelRecords.getId().getCkcrcd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksjtx());
				row.setUsrRecField(userLabelRecords.getId().getCkcrcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkdbcd());
				row.setUsrPosition(userLabelRecords.getId().getCkf1nb());
				row.setUsrDataType(userLabelRecords.getId().getCki4st());
				row.setUsrRecLength(userLabelRecords.getId().getCkglnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjpst());
				row.setUsrIndA(userLabelRecords.getId().getCkksst());
				row.setUsrIndB(userLabelRecords.getId().getCklest());
				row.setUsrIndC(userLabelRecords.getId().getCklyst());
				row.setUsrIndD(userLabelRecords.getId().getCkmhst());
				break;
			case 14:
				rowKey = userLabelRecords.getId().getCkcscd().trim(); 
				row.setUsrLabel(userLabelRecords.getId().getCksktx());
				row.setUsrRecField(userLabelRecords.getId().getCkcscd());
				row.setUsrEntryField(userLabelRecords.getId().getCkdccd());
				row.setUsrPosition(userLabelRecords.getId().getCkf2nb());
				row.setUsrDataType(userLabelRecords.getId().getCki5st());
				row.setUsrRecLength(userLabelRecords.getId().getCkgmnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjqst());
				row.setUsrIndA(userLabelRecords.getId().getCkktst());
				row.setUsrIndB(userLabelRecords.getId().getCklfst());
				row.setUsrIndC(userLabelRecords.getId().getCklzst());
				row.setUsrIndD(userLabelRecords.getId().getCkmist());
				break;
			case 15:
				rowKey = userLabelRecords.getId().getCkctcd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksltx());
				row.setUsrRecField(userLabelRecords.getId().getCkctcd());
				row.setUsrEntryField(userLabelRecords.getId().getCkddcd());
				row.setUsrPosition(userLabelRecords.getId().getCkf3nb());
				row.setUsrDataType(userLabelRecords.getId().getCki6st());
				row.setUsrRecLength(userLabelRecords.getId().getCkgnnb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjrst());
				row.setUsrIndA(userLabelRecords.getId().getCkkust());
				row.setUsrIndB(userLabelRecords.getId().getCklgst());
				row.setUsrIndC(userLabelRecords.getId().getCkl0st());
				row.setUsrIndD(userLabelRecords.getId().getCkmjst());
				break;
			case 16:
				rowKey = userLabelRecords.getId().getCkcucd().trim();
				row.setUsrLabel(userLabelRecords.getId().getCksmtx());
				row.setUsrRecField(userLabelRecords.getId().getCkcucd());
				row.setUsrEntryField(userLabelRecords.getId().getCkdecd());
				row.setUsrPosition(userLabelRecords.getId().getCkf4nb());
				row.setUsrDataType(userLabelRecords.getId().getCki7st());
				row.setUsrRecLength(userLabelRecords.getId().getCkgonb());
				row.setUsrErrorCode(userLabelRecords.getId().getCkjsst());
				row.setUsrIndA(userLabelRecords.getId().getCkkvst());
				row.setUsrIndB(userLabelRecords.getId().getCklhst());
				row.setUsrIndC(userLabelRecords.getId().getCkl1st());
				row.setUsrIndD(userLabelRecords.getId().getCkmkst());
				break;
			}
			if (!"".equals(rowKey)) {
				rows.put(rowKey, row);
			}
		}
		return rows;
	}

	public void mapRowsToDatabase(UserLabelRecords userLabelRecords, List<UserLabelDetailRecord> rows) {
		for (int i = 0; i < 20 && i < rows.size(); i++) {
			UserLabelDetailRecord row = rows.get(i);
			switch (i) {
			case 0:
				userLabelRecords.getId().setCkr7tx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcfcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkczcd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfpnb(row.getUsrPosition());
				userLabelRecords.getId().setCkisst(row.getUsrDataType());
				userLabelRecords.getId().setCkf9nb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjdst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkgst(row.getUsrIndA());
				userLabelRecords.getId().setCkkxst(row.getUsrIndB());
				userLabelRecords.getId().setCkldst(row.getUsrIndC());
				userLabelRecords.getId().setCklsst(row.getUsrIndD());
				break;
			case 1:
				userLabelRecords.getId().setCkr8tx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcgcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc0cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfqnb(row.getUsrPosition());
				userLabelRecords.getId().setCkitst(row.getUsrDataType());
				userLabelRecords.getId().setCkganb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjest(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkhst(row.getUsrIndA());
				userLabelRecords.getId().setCkk1st(row.getUsrIndB());
				userLabelRecords.getId().setCklmst(row.getUsrIndC());
				userLabelRecords.getId().setCkl6st(row.getUsrIndD());
				break;
			case 2:
				userLabelRecords.getId().setCkr9tx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkchcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc1cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfrnb(row.getUsrPosition());
				userLabelRecords.getId().setCkiust(row.getUsrDataType());
				userLabelRecords.getId().setCkgbnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjfst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkist(row.getUsrIndA());
				userLabelRecords.getId().setCkk2st(row.getUsrIndB());
				userLabelRecords.getId().setCklnst(row.getUsrIndC());
				userLabelRecords.getId().setCkl7st(row.getUsrIndD());
				break;
			case 3:
				userLabelRecords.getId().setCksatx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcicd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc2cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfsnb(row.getUsrPosition());
				userLabelRecords.getId().setCkivst(row.getUsrDataType());
				userLabelRecords.getId().setCkgcnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjgst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkjst(row.getUsrIndA());
				userLabelRecords.getId().setCkk3st(row.getUsrIndB());
				userLabelRecords.getId().setCklost(row.getUsrIndC());
				userLabelRecords.getId().setCkl8st(row.getUsrIndD());
				break;
			case 4:
				userLabelRecords.getId().setCksbtx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcjcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc3cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkftnb(row.getUsrPosition());
				userLabelRecords.getId().setCkiwst(row.getUsrDataType());
				userLabelRecords.getId().setCkgdnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjhst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkkst(row.getUsrIndA());
				userLabelRecords.getId().setCkk4st(row.getUsrIndB());
				userLabelRecords.getId().setCklpst(row.getUsrIndC());
				userLabelRecords.getId().setCkl9st(row.getUsrIndD());
				break;
			case 5:
				userLabelRecords.getId().setCksctx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkckcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc4cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfunb(row.getUsrPosition());
				userLabelRecords.getId().setCkixst(row.getUsrDataType());
				userLabelRecords.getId().setCkgenb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjist(row.getUsrErrorCode());
				userLabelRecords.getId().setCkklst(row.getUsrIndA());
				userLabelRecords.getId().setCkk5st(row.getUsrIndB());
				userLabelRecords.getId().setCklqst(row.getUsrIndC());
				userLabelRecords.getId().setCkmast(row.getUsrIndD());
				break;
			case 6:
				userLabelRecords.getId().setCksdtx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkclcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc5cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfvnb(row.getUsrPosition());
				userLabelRecords.getId().setCkiyst(row.getUsrDataType());
				userLabelRecords.getId().setCkgfnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjjst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkmst(row.getUsrIndA());
				userLabelRecords.getId().setCkk6st(row.getUsrIndB());
				userLabelRecords.getId().setCklrst(row.getUsrIndC());
				userLabelRecords.getId().setCkmbst(row.getUsrIndD());
				break;
			case 7:
				userLabelRecords.getId().setCksetx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcmcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc6cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfwnb(row.getUsrPosition());
				userLabelRecords.getId().setCkizst(row.getUsrDataType());
				userLabelRecords.getId().setCkggnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjkst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkknst(row.getUsrIndA());
				userLabelRecords.getId().setCkk7st(row.getUsrIndB());
				userLabelRecords.getId().setCkltst(row.getUsrIndC());
				userLabelRecords.getId().setCkmcst(row.getUsrIndD());
				break;
			case 8:
				userLabelRecords.getId().setCksftx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcncd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc7cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfxnb(row.getUsrPosition());
				userLabelRecords.getId().setCki0st(row.getUsrDataType());
				userLabelRecords.getId().setCkghnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjlst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkost(row.getUsrIndA());
				userLabelRecords.getId().setCkk8st(row.getUsrIndB());
				userLabelRecords.getId().setCklust(row.getUsrIndC());
				userLabelRecords.getId().setCkmdst(row.getUsrIndD());
				break;
			case 9:
				userLabelRecords.getId().setCksgtx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcocd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc8cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfynb(row.getUsrPosition());
				userLabelRecords.getId().setCki1st(row.getUsrDataType());
				userLabelRecords.getId().setCkginb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjmst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkpst(row.getUsrIndA());
				userLabelRecords.getId().setCkk9st(row.getUsrIndB());
				userLabelRecords.getId().setCklvst(row.getUsrIndC());
				userLabelRecords.getId().setCkmest(row.getUsrIndD());
				break;
			case 10:
				userLabelRecords.getId().setCkshtx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcpcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkc9cd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkfznb(row.getUsrPosition());
				userLabelRecords.getId().setCki2st(row.getUsrDataType());
				userLabelRecords.getId().setCkgjnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjnst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkqst(row.getUsrIndA());
				userLabelRecords.getId().setCklbst(row.getUsrIndB());
				userLabelRecords.getId().setCklwst(row.getUsrIndC());
				userLabelRecords.getId().setCkmfst(row.getUsrIndD());
				break;
			case 11:
				userLabelRecords.getId().setCksitx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcqcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkdacd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkf0nb(row.getUsrPosition());
				userLabelRecords.getId().setCki3st(row.getUsrDataType());
				userLabelRecords.getId().setCkgknb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjost(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkrst(row.getUsrIndA());
				userLabelRecords.getId().setCklcst(row.getUsrIndB());
				userLabelRecords.getId().setCklxst(row.getUsrIndC());
				userLabelRecords.getId().setCkmgst(row.getUsrIndD());
				break;
			case 12:
				userLabelRecords.getId().setCksjtx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcrcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkdbcd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkf1nb(row.getUsrPosition());
				userLabelRecords.getId().setCki4st(row.getUsrDataType());
				userLabelRecords.getId().setCkglnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjpst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkksst(row.getUsrIndA());
				userLabelRecords.getId().setCklest(row.getUsrIndB());
				userLabelRecords.getId().setCklyst(row.getUsrIndC());
				userLabelRecords.getId().setCkmhst(row.getUsrIndD());
				break;
			case 13:
				userLabelRecords.getId().setCksktx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcscd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkdccd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkf2nb(row.getUsrPosition());
				userLabelRecords.getId().setCki5st(row.getUsrDataType());
				userLabelRecords.getId().setCkgmnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjqst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkktst(row.getUsrIndA());
				userLabelRecords.getId().setCklfst(row.getUsrIndB());
				userLabelRecords.getId().setCklzst(row.getUsrIndC());
				userLabelRecords.getId().setCkmist(row.getUsrIndD());
				break;
			case 14:
				userLabelRecords.getId().setCksltx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkctcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkddcd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkf3nb(row.getUsrPosition());
				userLabelRecords.getId().setCki6st(row.getUsrDataType());
				userLabelRecords.getId().setCkgnnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjrst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkust(row.getUsrIndA());
				userLabelRecords.getId().setCklgst(row.getUsrIndB());
				userLabelRecords.getId().setCkl0st(row.getUsrIndC());
				userLabelRecords.getId().setCkmjst(row.getUsrIndD());
				break;
			case 15:
				userLabelRecords.getId().setCksmtx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcucd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkdecd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkf4nb(row.getUsrPosition());
				userLabelRecords.getId().setCki7st(row.getUsrDataType());
				userLabelRecords.getId().setCkgonb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjsst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkvst(row.getUsrIndA());
				userLabelRecords.getId().setCklhst(row.getUsrIndB());
				userLabelRecords.getId().setCkl1st(row.getUsrIndC());
				userLabelRecords.getId().setCkmkst(row.getUsrIndD());
				break;
			case 16:
				userLabelRecords.getId().setCksntx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcvcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkdfcd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkf5nb(row.getUsrPosition());
				userLabelRecords.getId().setCki8st(row.getUsrDataType());
				userLabelRecords.getId().setCkgpnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjtst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkwst(row.getUsrIndA());
				userLabelRecords.getId().setCklist(row.getUsrIndB());
				userLabelRecords.getId().setCkl2st(row.getUsrIndC());
				userLabelRecords.getId().setCkmlst(row.getUsrIndD());
				break;
			case 17:
				userLabelRecords.getId().setCksotx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcwcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkdgcd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkf6nb(row.getUsrPosition());
				userLabelRecords.getId().setCki9st(row.getUsrDataType());
				userLabelRecords.getId().setCkgqnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjust(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkyst(row.getUsrIndA());
				userLabelRecords.getId().setCkljst(row.getUsrIndB());
				userLabelRecords.getId().setCkl3st(row.getUsrIndC());
				userLabelRecords.getId().setCkmmst(row.getUsrIndD());
				break;
			case 18:
				userLabelRecords.getId().setCksptx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcxcd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkdhcd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkf7nb(row.getUsrPosition());
				userLabelRecords.getId().setCkjast(row.getUsrDataType());
				userLabelRecords.getId().setCkgrnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjvst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkkzst(row.getUsrIndA());
				userLabelRecords.getId().setCklkst(row.getUsrIndB());
				userLabelRecords.getId().setCkl4st(row.getUsrIndC());
				userLabelRecords.getId().setCkmnst(row.getUsrIndD());
				break;
			case 19:
				userLabelRecords.getId().setCksqtx(changeCorruptData(row.getUsrLabel()));
				userLabelRecords.getId().setCkcycd(changeCorruptData(row.getUsrRecField()));
				userLabelRecords.getId().setCkdicd(changeCorruptData(row.getUsrEntryField()));
				userLabelRecords.getId().setCkf8nb(row.getUsrPosition());
				userLabelRecords.getId().setCkjbst(row.getUsrDataType());
				userLabelRecords.getId().setCkgsnb(row.getUsrRecLength());
				userLabelRecords.getId().setCkjwst(row.getUsrErrorCode());
				userLabelRecords.getId().setCkk0st(row.getUsrIndA());
				userLabelRecords.getId().setCkllst(row.getUsrIndB());
				userLabelRecords.getId().setCkl5st(row.getUsrIndC());
				userLabelRecords.getId().setCkmost(row.getUsrIndD());
				break;
			}
		}
	}

	public List<UserLabelDetailRecord> getDefaults(List<UserLabelDetailRecord> rows) {
		UserLabelDetailRecord row = new UserLabelDetailRecord("", "", "", 0, ' ', 0, ' ', ' ', ' ', ' ', ' ');
		rows = new ArrayList<UserLabelDetailRecord>(1);
		rows.add(row);
		return rows;
	}

	public char getUsrDataType() {
		return usrDataType;
	}

	public void setUsrDataType(char usrDataType) {
		this.usrDataType = usrDataType;
	}

	public String getUsrEntryField() {
		return usrEntryField.trim();
	}

	public void setUsrEntryField(String usrEntryField) {
		this.usrEntryField = usrEntryField;
	}

	public char getUsrErrorCode() {
		return usrErrorCode;
	}

	public void setUsrErrorCode(char usrErrorCode) {
		this.usrErrorCode = usrErrorCode;
	}

	public char getUsrIndA() {
		return usrIndA;
	}

	public void setUsrIndA(char usrIndA) {
		this.usrIndA = usrIndA;
	}

	public char getUsrIndB() {
		return usrIndB;
	}

	public void setUsrIndB(char usrIndB) {
		this.usrIndB = usrIndB;
	}

	public char getUsrIndC() {
		return usrIndC;
	}

	public void setUsrIndC(char usrIndC) {
		this.usrIndC = usrIndC;
	}

	public char getUsrIndD() {
		return usrIndD;
	}

	public void setUsrIndD(char usrIndD) {
		this.usrIndD = usrIndD;
	}

	public String getUsrLabel() {
		return usrLabel.trim();
	}

	public void setUsrLabel(String usrLabel) {
		this.usrLabel = usrLabel;
	}

	public int getUsrPosition() {
		return usrPosition;
	}

	public void setUsrPosition(int usrPosition) {
		this.usrPosition = usrPosition;
	}

	public String getUsrRecField() {
		return usrRecField.trim();
	}

	public void setUsrRecField(String usrRecField) {
		this.usrRecField = usrRecField;
	}

	public int getUsrRecLength() {
		return usrRecLength;
	}

	public void setUsrRecLength(int usrRecLength) {
		this.usrRecLength = usrRecLength;
	}

	public String changeCorruptData(String value) {
		if (("".equalsIgnoreCase(value))) {
			char ch = ' ';
			value = Character.toString(ch);
		}
		return value;
	}
}
