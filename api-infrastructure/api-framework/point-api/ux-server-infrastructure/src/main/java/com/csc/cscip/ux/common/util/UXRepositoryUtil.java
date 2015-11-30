package com.csc.cscip.ux.common.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.csc.cscip.ux.common.repository.RepositoryServiceFactory;

public class UXRepositoryUtil {

	private static RepositoryServiceFactory metaModelRSF = ApplicationContextProvider.getApplicationContext().getBean(RepositoryServiceFactory.class);

	/**
	 * Method to send an object to the given repository URI with the given name and contents
	 * 
	 * @param repoEndPointType
	 *            - file, ftp, jcr
	 * @param repoEndPointURI
	 *            - Repository URI
	 * @param fileName
	 *            - Name of the object to be sent
	 * @param fileContent
	 *            - Contents of the object to be sent
	 * @param contentType
	 *            - Content-Type of the object
	 * @param childRelPath
	 *            - Relative path of the child folder/node to the base URI
	 * @param remarks
	 *            - Remarks to be stored in the repository version
	 * @throws Exception
	 */
	public static void sendFile(String repoEndPointType, String repoEndPointURI, String fileName, String fileContent, String contentType, String childRelPath,
			String remarks) throws Exception {
		metaModelRSF.getRepositoryService(repoEndPointType).sendFile(repoEndPointURI, fileName, fileContent, contentType, childRelPath, remarks);
	}

	/**
	 * Method to get an object from the given repository URI with the given name and the head/latest version
	 * 
	 * @param repoEndPointType
	 *            - file, ftp, jcr
	 * @param repoEndPointURI
	 *            - Repository URI
	 * @param fileName
	 *            - Name of the object to be retrieved
	 * @param childRelPath
	 *            - Relative path of the child folder/node to the base URI
	 * @return
	 * @throws Exception
	 */
	public static String receiveFile(String repositoryType, String repoEndPointURI, String fileName, String childRelPath) throws Exception {
		return metaModelRSF.getRepositoryService(repositoryType).receiveFile(repoEndPointURI, fileName, childRelPath);
	}

	/**
	 * Method to get an object from the given repository URI with the given name and given version number
	 * 
	 * @param repoEndPointType
	 *            - file, ftp, jcr
	 * @param repoEndPointURI
	 *            - Repository URI
	 * @param fileName
	 *            - Name of the object to be retrieved
	 * @param childRelPath
	 *            - Relative path of the child folder/node to the base URI
	 * @param versionNo
	 *            - Version number to be retrieved
	 * @return
	 * @throws Exception
	 */
	public static String receiveFile(String repositoryType, String repoEndPointURI, String fileName, String childRelPath, String versionNo) throws Exception {
		return metaModelRSF.getRepositoryService(repositoryType).receiveFile(repoEndPointURI, fileName, childRelPath, versionNo);
	}

	/**
	 * Method to get the list of contents in the given repository URI with a boolean switch that determines if names are to be trimmed
	 * 
	 * @param repoEndPointType
	 *            - file, ftp, jcr
	 * @param repoEndPointURI
	 *            - Repository URI
	 * @param childRelPath
	 *            - Relative path of the child folder/node to the base URI
	 * @param trimNames
	 *            - Boolean switch that determines whether list of names should have the extension trimmed or not. Default = true.
	 * @return
	 * @throws Exception
	 */
	public static List<String> getFileList(String repoEndPointType, String repoEndPointURI, String childRelPath, boolean trimNames) throws Exception {
		List<String> rcvdFileNames = metaModelRSF.getRepositoryService(repoEndPointType).receiveFileNames(repoEndPointURI, childRelPath);
		if (trimNames) {
			List<String> trimmedFileNames = new ArrayList<String>();
			String trimmedFileName = "";
			for (String fileName : rcvdFileNames) {
				trimmedFileName = ((String) fileName);
				trimmedFileName = (trimmedFileName.lastIndexOf(".") >= 0) ? trimmedFileName.substring(0, trimmedFileName.lastIndexOf(".")) : trimmedFileName;
				trimmedFileNames.add(trimmedFileName);
			}
			return trimmedFileNames;
		} else {
			return rcvdFileNames;
		}
	}

	/**
	 * Method to import the contents from a given import source to the metamodel repository
	 * 
	 * @param repoEndPointType
	 *            - file, ftp, jcr
	 * @param repoEndPointURI
	 *            - Repository URI
	 * @param importSourceType
	 *            - file, ftp, jcr
	 * @param importSourceURI
	 *            - URI of the import source
	 * @param childRelPath
	 *            - Relative paths of the child folders/nodes to the base URI
	 * @return
	 * @throws Exception
	 */
	public static List<Object> importFile(String repoEndPointType, String repoEndPointURI, String importSourceType, String importSourceURI,
			String[] childRelPath) throws Exception {
		return metaModelRSF.getRepositoryService(repoEndPointType).importFile(repoEndPointURI, importSourceType, importSourceURI, childRelPath);
	}

	/**
	 * Method to get the version history of an object from the given repository URI with the given name
	 * 
	 * @param repoEndPointType
	 *            - file, ftp, jcr
	 * @param repoEndPointURI
	 *            - Repository URI
	 * @param fileName
	 *            - Name of the object whose versions need to be retrieved
	 * @param childRelPath
	 *            - Relative path of the child folder/node to the base URI
	 * @return
	 * @throws Exception
	 */
	public static List<HashMap<?, ?>> getHistory(String repositoryType, String repoEndPointURI, String fileName, String childRelPath) throws Exception {
		return metaModelRSF.getRepositoryService(repositoryType).getHistory(repoEndPointURI, fileName, childRelPath);
	}
}