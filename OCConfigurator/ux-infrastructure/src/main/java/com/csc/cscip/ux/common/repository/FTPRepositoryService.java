package com.csc.cscip.ux.common.repository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class FTPRepositoryService extends AbstractRepositoryService {

	// @Autowired
	// private IntegratedRepositoryService integratedRepositoryService;
	//
	// public void setIntegratedRepositoryService(IntegratedRepositoryService integratedRepositoryService) {
	// this.integratedRepositoryService = integratedRepositoryService;
	// }

	@Override
	public void sendFile(String repoEndPointURI, String fileName, String fileContent, String contentType, String childRelPath, String remarks) throws Exception {
		// integratedRepositoryService.sendFile(repoEndPointURI, fileName, fileContent, contentType, childRelPath, remarks);
	}

	@Override
	public String receiveFile(String repoEndPointURI, String fileName, String childRelPath) throws Exception {
		return null;
		// return integratedRepositoryService.receiveFile(repoEndPointURI, fileName, childRelPath);
	}

	@Override
	public List<String> receiveFileNames(String repoEndPointURI, String childRelPath) throws Exception {
		return null;
		// return integratedRepositoryService.receiveFileNames(repoEndPointURI, childRelPath);
	}

}
