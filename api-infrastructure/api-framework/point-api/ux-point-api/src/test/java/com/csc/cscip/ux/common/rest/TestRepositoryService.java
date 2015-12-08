package com.csc.cscip.ux.common.rest;

import java.io.IOException;
import java.util.Properties;

import org.apache.camel.CamelContext;
import org.apache.camel.ConsumerTemplate;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.impl.DefaultCamelContext;
import org.junit.BeforeClass;

import com.csc.cscip.ux.common.integration.CamelIntegrationService;
import com.csc.cscip.ux.common.integration.IntegrationService;
import com.csc.cscip.ux.common.repository.FSRepositoryService;
import com.csc.cscip.ux.common.repository.FTPRepositoryService;
import com.csc.cscip.ux.common.util.IOUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;

public class TestRepositoryService {

	private String localRepositoryEndPointURI = "file:metamodel?noop=true&idempotent=false";
	private String remoteRepositoryEndPointURI = "ftp://anonymous@20.15.37.14/UX-POINTIN?password=anonymous&passiveMode=false&download=true&maximumReconnectAttempts=0&throwExceptionOnConnectFailed=true&localWorkDirectory=metamodel";

	@BeforeClass
	public static void setupClass() throws IOException {
		Properties properties = new Properties();
		properties.load(TestRepositoryService.class.getResourceAsStream("/app-config.properties"));
		new UXAppConfig().setProperties(properties);
	}

	// @Test
	public void testFSSend() throws Exception {

		FSRepositoryService fSRepositoryService = new FSRepositoryService();
//		fSRepositoryService.setIntegrationService(getIntegrationService());

		fSRepositoryService.sendFile(localRepositoryEndPointURI, "test.json", "test2", "application/json", "", "TestRepositoryService: Junit test");
	}

	// @Test
	public void testFSReceive() throws Exception {

		FSRepositoryService fSRepositoryService = new FSRepositoryService();
//		fSRepositoryService.setIntegrationService(getIntegrationService());

		String fileContent = fSRepositoryService.receiveFile(localRepositoryEndPointURI, "test.json", "");
		System.out.println(fileContent);
	}

	// @Test
	public void testFTPSend() throws Exception {

		FTPRepositoryService ftpRepositoryService = new FTPRepositoryService();
//		ftpRepositoryService.setIntegrationService(getIntegrationService());

		String fileName = "Unit_Screen.json";
		String fileContent = IOUtils.readContent("/metamodel/" + fileName);

		ftpRepositoryService.sendFile(remoteRepositoryEndPointURI, fileName, fileContent, "application/json", "", "TestRepositoryService: Junit test");
	}

//	@Test
	public void testFTPReceive() throws Exception {

		FTPRepositoryService ftpRepositoryService = new FTPRepositoryService();
//		ftpRepositoryService.setIntegrationService(getIntegrationService());

		String fileContent = ftpRepositoryService.receiveFile(remoteRepositoryEndPointURI, "CPP_Policy_Level.json", "");
		System.out.println(fileContent);
	}

	private IntegrationService getIntegrationService() throws Exception {
		CamelContext camelContext = new DefaultCamelContext();
		camelContext.start();

		ConsumerTemplate consumerTemplate = camelContext.createConsumerTemplate();
		ProducerTemplate template = camelContext.createProducerTemplate();

		CamelIntegrationService integrationService = new CamelIntegrationService(camelContext, template, consumerTemplate);
		return integrationService;
	}

}
