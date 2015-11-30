package com.csc.cscip.ux.common.repository;

import java.util.HashMap;
import java.util.List;

public interface RepositoryService {

	String REPO_TYPE_FILE = "file";
	String REPO_TYPE_FTP = "ftp";
	String REPO_TYPE_JCR = "jcr";

	void sendFile(String repoEndPointURI, String fileName, String fileContent, String contentType, String childRelPath, String remarks) throws Exception;

	String receiveFile(String repoEndPointURI, String fileName, String childRelPath) throws Exception;

	String receiveFile(String repoEndPointURI, String fileName, String childRelPath, String versionNo) throws Exception;

	List<String> receiveFileNames(String repoEndPointURI, String childRelPath) throws Exception;

	List<Object> importFile(String repoEndPointURI, String importSourceType, String importSourceURI, String[] childRelPaths) throws Exception;

	List<HashMap<?, ?>> getHistory(String repoEndPointURI, String fileName, String childRelPath) throws Exception;
}
