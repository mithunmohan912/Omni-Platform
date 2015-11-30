package com.csc.cscip.ux.common.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Properties;
import java.util.Random;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEParameterSpec;

import com.sun.org.apache.xml.internal.security.utils.Base64;

public class EncryptTool {
	
	private Cipher encryptCipher;
	private Cipher decryptCipher;
	private String encryptionKey;
	private sun.misc.BASE64Encoder encoder = new sun.misc.BASE64Encoder();
	private sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
	
	final private String keyFilePath = "/resources/directlink/Key.properties";
	final private String charset = "UTF-8";	
	final private byte[] defaultSalt = { (byte) 0xa3, (byte) 0x21, (byte) 0x24, (byte) 0x2c, (byte) 0xf2, (byte) 0xd2, (byte) 0x3e, (byte) 0x19 };
	
	/**
	 * The simplest constructor which will use a default password and salt to
	 * encode the string.
	 * 
	 * @throws SecurityException
	 * @throws IOException 
	 */
	public EncryptTool() throws SecurityException, IOException {
		getKeyFromFile(keyFilePath);
		setupEncryptor(encryptionKey, defaultSalt);
	}
	
	public EncryptTool(String encryptKey, String salt) throws SecurityException, IOException {
		if((encryptKey.isEmpty() || encryptKey == null) && (salt.isEmpty() || salt == null)){
			setupEncryptor(encryptionKey, defaultSalt);
		} else if((!encryptKey.isEmpty() && encryptKey != null) && (salt.isEmpty() || salt == null)){
			setupEncryptor(encryptKey, defaultSalt);
		} else if((encryptKey.isEmpty() || encryptKey == null) && (!salt.isEmpty() && salt != null)){
			setupEncryptor(encryptionKey, salt.getBytes());
		}
	}
	
	public EncryptTool(String keyFilePath) throws SecurityException, IOException {
		getKeyFromFile(keyFilePath);
		setupEncryptor(encryptionKey, defaultSalt);
	}
	
	/**
	 * Method which get the key from the Key.properties file. This key will be 
	 * use to encrypt and decrypt the URL.
	 * 
	 * @exception IOException
	 */
	public void getKeyFromFile(String path) throws IOException {
		if(path.isEmpty()){
			path = keyFilePath;
		}
		InputStream iStream = getClass().getResourceAsStream(path);
		Properties keyProperties = new Properties();
		keyProperties.load(iStream);
		if(keyProperties.containsKey("key")){
			encryptionKey = keyProperties.getProperty("key");
		}
	}
	
	/**
	 * Method to generate a random key.
	 * 
	 * @return encoded random Key.
	 */
	public static String keyGenerator(){
		byte[] key = new byte[16];
		new Random().nextBytes(key);
		return Base64.encode(key);
	}


	public void init(char[] pass, byte[] salt, int iterations) throws SecurityException {
		try {
			PBEParameterSpec ps = new javax.crypto.spec.PBEParameterSpec(salt,20);

			SecretKeyFactory kf = SecretKeyFactory.getInstance("PBEWithMD5AndDES");

			SecretKey k = kf.generateSecret(new javax.crypto.spec.PBEKeySpec(pass));

			encryptCipher = Cipher.getInstance(CommonConstants.ENCRYPT_ALGORYTHM);

			encryptCipher.init(Cipher.ENCRYPT_MODE, k, ps);

			decryptCipher = Cipher.getInstance(CommonConstants.ENCRYPT_ALGORYTHM);

			decryptCipher.init(Cipher.DECRYPT_MODE, k, ps);
		} catch (Exception e) {
			throw new SecurityException("Could not initialize CryptoLibrary: "+ e.getMessage());
		}
	}

	/**
	 * 
	 * method to decrypt a string.
	 * 
	 * @param str
	 *            Description of the Parameter
	 * 
	 * @return String the encrypted string.
	 * 
	 * @exception SecurityException
	 *                Description of the Exception
	 */
	public synchronized String encrypt(String str) throws SecurityException {
		try {

			byte[] utf8 = str.getBytes(charset);

			byte[] enc = encryptCipher.doFinal(utf8);

			// return URLEncoder.encode(encoder.encode(enc), charset);
			return Base64.encode(encoder.encode(enc).getBytes(charset));
		} catch (Exception e) {
			throw new SecurityException("Could not encrypt: " + e.getMessage());
		}
	}

	/**
	 * 
	 * method to encrypting a string.
	 * 
	 * @param str
	 *            Description of the Parameter
	 * 
	 * @return String the encrypted string.
	 * 
	 * @exception SecurityException
	 *                Description of the Exception
	 */
	public synchronized String decrypt(String str) throws SecurityException {
		try {

			byte[] dec = decoder.decodeBuffer(new String(Base64.decode(str)));
			byte[] utf8 = decryptCipher.doFinal(dec);

			return new String(utf8, charset);

		} catch (Exception e) {
			throw new SecurityException("Could not decrypt: " + e.getMessage());
		}
	}

	private void setupEncryptor(String encryptionKey, byte[] salt) {

		java.security.Security.addProvider(new com.sun.crypto.provider.SunJCE());

		char[] pass = encryptionKey.toCharArray();

		int iterations = 3;

		init(pass, salt, iterations);
	}
	
}
