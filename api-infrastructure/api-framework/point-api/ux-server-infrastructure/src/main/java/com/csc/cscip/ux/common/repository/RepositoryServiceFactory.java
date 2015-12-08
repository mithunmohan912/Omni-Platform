package com.csc.cscip.ux.common.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RepositoryServiceFactory {

	@Autowired
	private FSRepositoryService fSRepositoryService;

	@Autowired
	private FTPRepositoryService fTPRepositoryService;

	@Autowired
	private JCRRepositoryService jcrRepositoryService;

	public RepositoryService getRepositoryService(String repoType) {

		if (repoType.equalsIgnoreCase(RepositoryService.REPO_TYPE_FILE)) {
			return fSRepositoryService;
		} else if (repoType.equalsIgnoreCase(RepositoryService.REPO_TYPE_FTP)) {
			return fTPRepositoryService;
		} else if (repoType.equalsIgnoreCase(RepositoryService.REPO_TYPE_JCR)) {
			return jcrRepositoryService;
		}
		throw new RuntimeException("Invalid repository type provided.");
	}
}
