package com.csc.cscip.ux.common.security.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.codec.Hex;

import com.csc.cscip.ux.common.util.UXAppConfig;

public class TokenUtils {

	public static final String MAGIC_KEY = "obfuscate";

/*	public static String createToken(UserDetails userDetails) {

		int sessionTimeout = UXAppConfig.getPropertyAsInt("SessionTimeout");
		long expires = System.currentTimeMillis() + 1000L * sessionTimeout;

		StringBuilder tokenBuilder = new StringBuilder();
		tokenBuilder.append(userDetails.getUsername());
		tokenBuilder.append("-");
		tokenBuilder.append(expires);
		tokenBuilder.append("-");
		tokenBuilder.append(TokenUtils.computeSignature(userDetails, expires));

		return tokenBuilder.toString();
	}
*/	
	public static String createToken(String username, String password) {

		int sessionTimeout = UXAppConfig.getPropertyAsInt("SessionTimeout");
		long expires = System.currentTimeMillis() + 1000L * sessionTimeout;

		StringBuilder tokenBuilder = new StringBuilder();
		tokenBuilder.append(username);
		tokenBuilder.append("-");
		tokenBuilder.append(expires);
		tokenBuilder.append("-");
		tokenBuilder.append(TokenUtils.computeSignature_PT(username, password, expires));

		return tokenBuilder.toString();
	}

	public static String computeSignature(UserDetails userDetails, long expires) {

		StringBuilder signatureBuilder = new StringBuilder();
		signatureBuilder.append(userDetails.getUsername());
		signatureBuilder.append("-");
		signatureBuilder.append(expires);
		signatureBuilder.append("-");
		signatureBuilder.append(userDetails.getPassword());
		signatureBuilder.append("-");
		signatureBuilder.append(TokenUtils.MAGIC_KEY);

		MessageDigest digest;
		try {
			digest = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException("No MD5 algorithm available!");
		}

		return new String(Hex.encode(digest.digest(signatureBuilder.toString().getBytes())));
	}

	public static String computeSignature_PT(String username, String password, long expires) {

		StringBuilder signatureBuilder = new StringBuilder();
		signatureBuilder.append(username);
		signatureBuilder.append("-");
		signatureBuilder.append(expires);
		signatureBuilder.append("-");
		signatureBuilder.append(password);
		signatureBuilder.append("-");
		signatureBuilder.append(TokenUtils.MAGIC_KEY);

		MessageDigest digest;
		try {
			digest = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException("No MD5 algorithm available!");
		}

		return new String(Hex.encode(digest.digest(signatureBuilder.toString().getBytes())));
	}

	public static String getUserNameFromToken(String authToken) {

		if (null == authToken) {
			return null;
		}

		String[] parts = authToken.split("-");
		return parts[0];
	}

	public static boolean validateToken(String authToken, UserDetails userDetails) {

		String[] parts = authToken.split("-");
		long expires = Long.parseLong(parts[1]);
		String signature = parts[2];

		if (expires < System.currentTimeMillis()) {
			return false;
		}

		return signature.equals(TokenUtils.computeSignature(userDetails, expires));
	}
}
