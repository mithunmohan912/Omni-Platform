package com.csc.cscip.ux.pointin.util;

public class Crypt {
	
	public String sEncrypt(String sInput) {
		int[] aCode = new int[200];
		int iCode = 0;
		int iMax = 0;
		int iCodeMax = 0;
		int iLoc = 0;
		String sOutput = "";
		int iFactor = 0;
		int iHex = 0;
		aCode = getCode();
		iCodeMax = aCode.length;
		iMax = sInput.length();
		sOutput = "01";
		while (iLoc < iMax){
			iFactor = iMult(aCode[iCode], hToi(sOutput.substring(2 * iLoc ,2 * iLoc + 2 )));
			iHex = iMult(iFactor, ctoi(sInput.substring(iLoc, iLoc + 1)));
			sOutput = sOutput + itoh(iHex);
			iCode = iCode + 1;
			if (iCode >= iCodeMax) {
				iCode = 0;
			}
			iLoc++;
		}
		return sOutput.substring(2);
	}

	private int[] getCode() {
		String sSeed = "";
		int iCodeMax = 0;
		int iSeed = 0;
		int iCode = 0;
		int iHex = 0;
		int iInt = 0;
		int[] aInt = new int[10];
		aInt[0] = 1;
		aInt[1] = 12;
		aInt[2] = 68;
		aInt[3] = 128;
		aInt[4] = 29;
		aInt[5] = 90;
		aInt[6] = 3;
		aInt[7] = 39;
		aInt[8] = 245;
		aInt[9] = 179;
		sSeed = sGetSeed();
		iCodeMax = sSeed.length() / 2;
		int[] aCode = new int[iCodeMax];
		iHex = 1;
		iInt = 0;
		while (iCode < iCodeMax) {
			iSeed = hToi(sSeed.substring(iHex - 1, iHex + 1));
			aCode[iCode] = iMult(iSeed, aInt[iInt]);
			if (aCode[iCode] == 0) {
				aCode[iCode] = 1;
			}
			iHex = iHex + 2;
			iInt = iInt + 1;
			if (iInt > 9) {
				iInt = 0;
			}
			iCode++;
		}
		return aCode;
	}

	private String sGetSeed() {
		String sSeed = null;
		String sTemp = null;
		sSeed = GetCryptSeed();
		sSeed = sSeed.trim();
		if (sSeed.length() > 0) {
			sTemp = sSeed;
			while (sSeed.length() <= 20) {
				sSeed = sSeed + sTemp;
			}
		} else {
			sSeed = "28010101010101010101";
		}
		return sSeed;
	}

	private String GetCryptSeed() {
		return "28010101010101010101";
	}

	private int hToi(String sChar) {
		int iHex = 0;
		int iChar;
		String strChar = "";
		int intValA = Integer.parseInt(asciiVals('A'));
		int intValF = Integer.parseInt(asciiVals('F'));
		int intVala = Integer.parseInt(asciiVals('a'));
		int intValf = Integer.parseInt(asciiVals('f'));
		while (sChar.length() > 0) {
			iHex = iHex * 16;
			strChar = asciiVals(sChar.charAt(0));
			iChar = Integer.parseInt(strChar);
			if (iChar >= intValA && iChar <= intValF) {
				iHex = iHex + iChar - intValA + 10;
			} else if (iChar >= intVala && iChar <= intValf) {
				iHex = iHex + iChar - intVala + 10;
			} else {
				iHex = iHex + iChar - Integer.parseInt(asciiVals('0'));
			}
			if (sChar.length() > 0) {
				sChar = sChar.substring(1);
			} else {
				sChar = "";
			}
		}
		return iHex;
	}

	private String asciiVals(char str) {
		int intValue = 0;
		String strValue = "";
		intValue = (int) str;
		strValue = Integer.toString(intValue);
		return strValue;
	}

	private String itoh(int iHex) {
		String sHex = "";
		if (iHex < 16) {
			sHex = "0" + Integer.toHexString(iHex);
		} else {
			sHex = Integer.toHexString(iHex);
		}
		return sHex.toLowerCase();
	}

	private int iMult(int iInput, int iTimes) {
		return (iInput * iTimes) % 251;
	}

	private int ctoi(String sChar) {
		int iChar = 0;
		if (sChar.length() > 0) {
			iChar = Integer.parseInt(asciiVals(sChar.charAt(0)));
			if (iChar <= 5) {
				iChar = 32;
			}
			iChar = iChar - 5;
		}
		return iChar;
	}
}