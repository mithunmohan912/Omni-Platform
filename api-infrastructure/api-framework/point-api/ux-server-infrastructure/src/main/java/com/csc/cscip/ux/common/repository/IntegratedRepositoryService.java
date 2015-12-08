package com.csc.cscip.ux.common.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csc.cscip.ux.common.integration.IntegrationService;

@Service
public abstract class IntegratedRepositoryService extends AbstractRepositoryService {

	@Autowired
	protected IntegrationService integrationService;

	public void setIntegrationService(IntegrationService integrationService) {
		this.integrationService = integrationService;
	}

	@Override
	public void sendFile(String repoEndPointURI, String fileName, String fileContent, String contentType, String childRelPath, String remarks) throws Exception {
		if (childRelPath != null && !"".equals(childRelPath.trim())) {
			repoEndPointURI = appendURLdir(repoEndPointURI, childRelPath);
		}
		String endPointURI = repoEndPointURI + "&fileName=" + fileName + "&fileExist=Override";
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", contentType);
		integrationService.send(endPointURI, headers, fileContent, String.class);
	}

	@Override
	public String receiveFile(String repoEndPointURI, String fileName, String childRelPath) throws Exception {
		if (childRelPath != null && !"".equals(childRelPath.trim())) {
			repoEndPointURI = appendURLdir(repoEndPointURI, childRelPath);
		}
		String endPointURI = repoEndPointURI + "&fileName=" + fileName;
		String fileContent = integrationService.receive(endPointURI, String.class);
		return fileContent;
	}

	@Override
	public List<String> receiveFileNames(String repoEndPointURI, String childRelPath) throws Exception {
		if (childRelPath != null && !"".equals(childRelPath.trim())) {
			repoEndPointURI = appendURLdir(repoEndPointURI, childRelPath);
		}
		return integrationService.receiveHeaders(repoEndPointURI, "CamelFileName");
	}

}
