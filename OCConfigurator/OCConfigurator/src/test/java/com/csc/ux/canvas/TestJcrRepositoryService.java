package com.csc.ux.canvas;

import java.util.List;
import java.util.Properties;

import javax.activation.MimetypesFileTypeMap;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;

import org.apache.camel.CamelContext;
import org.apache.camel.impl.DefaultCamelContext;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.csc.cscip.ux.common.repository.FSRepositoryService;
import com.csc.cscip.ux.common.repository.JCRRepositoryService;
import com.csc.cscip.ux.common.util.CommonConstants;
import com.csc.cscip.ux.common.util.ConversionUtil;
import com.csc.cscip.ux.common.util.JcrConstants;
import com.csc.cscip.ux.common.util.JcrUtils;
import com.csc.cscip.ux.common.util.UXAppConfig;

public class TestJcrRepositoryService {
	private static Session session;
	private static Node rootNode;
	private static CamelContext camelContext = new DefaultCamelContext();
	private static String localRepositoryEndPointURI;

	
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {

		String url = "http://basvdevpntwa9:9082/jackrabbit/rmi?username=admin&password=admin&workspaceName=dev&node=metamodel&repoURIType=org.apache.jackrabbit.repository.uri";
		
		//localRepositoryEndPointURI = "file://C:/UX-POINTIN/exports_0618/output/?noop=true&idempotent=false";
	//	remoteRepositoryEndPointURI = "ftp://anonymous@20.15.37.14/UX-POINTIN?password=anonymous&passiveMode=false&download=true&maximumReconnectAttempts=0&throwExceptionOnConnectFailed=true&localWorkDirectory=metamodel";

		
		session = JcrUtils.createJcrSession(url);
		rootNode = session.getRootNode();
		System.out.println("Workspace: " + session.getWorkspace().getName());

		Properties properties = new Properties();
		properties.load(TestJcrRepositoryService.class.getResourceAsStream("/OCConfigurator-config.properties"));
		new UXAppConfig().setProperties(properties);

		camelContext.start();
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
		session.logout();
		camelContext.stop();
	}

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
		session.save();
	}

	/*@Test
	public void testCreateNodes() throws RepositoryException {
		listChildren("", rootNode);
		Node testnode = rootNode.addNode("testnode");
		Node hello = testnode.addNode("hello");
		Node world = hello.addNode("world");
		world.setProperty("message", "Hello, JCR World!");
	}

	@Test
	public void testGetNodes() throws RepositoryException {
		NodeIterator nodeIter = rootNode.getNodes("testnode*");
		int i = 1;
		while (nodeIter.hasNext()) {
			Node node = nodeIter.nextNode();
			try {
				Node childNode = node.getNode("hello/world");
				System.out.println(childNode.getPath());
				System.out.println(childNode.getProperty("message").getString());
				Assert.assertEquals("Node path not matching", (i != 1) ? "/testnode[" + i + "]/hello/world" : "/testnode/hello/world",
						childNode.getPath());
				Assert.assertEquals("Message not matching", "Hello, JCR World!", childNode.getProperty("message").getString());
			} catch (PathNotFoundException e) {
				System.out.println(node.getPath() + "/" + e.getMessage() + " not found!");
			}
			i++;
		}
	}

	@Test
	public void testDeleteNodes() throws RepositoryException {
		NodeIterator nodeIter = rootNode.getNodes("testnode*");
		while (nodeIter.hasNext()) {
			try {
				Node node = nodeIter.nextNode();
				String path = node.getPath();
				node.remove();
				System.out.println("Node deleted: " + path);
			} catch (PathNotFoundException e) {
				System.out.println(e.getMessage());
			}
		}
	}

	private static void listChildren(String indent, Node node) throws RepositoryException {
		System.out.println(indent + node.getName());
		NodeIterator ni = node.getNodes();
		while (ni.hasNext()) {
			listChildren(indent + "  ", ni.nextNode());
		}
	}

	@Test
	public void testMetaModelNode() throws RepositoryException {
		VersionManager vm = session.getWorkspace().getVersionManager();
		if (!rootNode.hasNode("metamodel")) {
			Node mmNode = rootNode.addNode("metamodel", "nt:folder");
			mmNode.addMixin("mix:versionable");
			session.save();
			vm.checkin("/metamodel");
		}
	}

	@Test
	public void testImportMetaModels() throws Exception {
		VersionManager vm = session.getWorkspace().getVersionManager();
		vm.checkout("/metamodel");
		Node mmNode = rootNode.getNode("metamodel");

		FSRepositoryService fSRepositoryService = new FSRepositoryService();
		fSRepositoryService.setIntegrationService(integrationService);
		List<Object> metaModelNames = fSRepositoryService.receiveFileNames("file://C:/UX-POINTIN/metamodel?noop=true&idempotent=false", "");
		for (Object mmName : metaModelNames) {
			if (!mmNode.hasNode((String) mmName)) {
				String content = fSRepositoryService.receiveFile("file://C:/UX-POINTIN/metamodel?noop=true&idempotent=false",
						(String) mmName, "");
				Node newMMnode = mmNode.addNode((String) mmName, "nt:file");
				Node newMMcontent = newMMnode.addNode("jcr:content", "nt:resource");
				newMMcontent.setProperty("jcr:mimeType", "application/json");
				newMMcontent.setProperty("jcr:encoding", "UTF-8");
				Binary binary = session.getValueFactory().createBinary(new ByteArrayInputStream(content.getBytes()));
				newMMcontent.setProperty("jcr:data", binary);
				newMMcontent.setProperty("jcr:lastModified", Calendar.getInstance());
				newMMnode.addMixin("mix:versionable");
				session.save();
				vm.checkin("/metamodel/" + (String) mmName);
			}
		}
		vm.checkin("/metamodel");
	}

	@Test
	public void testVersionHistory() throws Exception {
		VersionManager vm = session.getWorkspace().getVersionManager();
		Node node = rootNode.getNode("metamodel/ALR_FORMS.json");
		vm.checkout(node.getPath());
		Node content = node.getNode(JcrConstants.NODETYPE_JCR_CONTENT);

		String contentStr = content.getProperty(JcrConstants.PROPERTY_JCR_DATA).getString();
		contentStr = contentStr.replaceFirst("Manual Forms Entry", "Manual Forms Entry v1.6");

		Binary binary = session.getValueFactory().createBinary(new ByteArrayInputStream(contentStr.getBytes()));
		content.setProperty(JcrConstants.PROPERTY_JCR_DATA, binary);
		session.save();
		vm.checkin(node.getPath());

		VersionHistory history = vm.getVersionHistory(node.getPath());
		Version headVersion = vm.getBaseVersion(node.getPath());
		history.addVersionLabel(headVersion.getName(), "v1.6", true);

		System.out.println("***History***");
		System.out.println("Versionable Identifier: " + history.getVersionableIdentifier());
		System.out.println("***Properties***");
		for (PropertyIterator pi = history.getProperties(); pi.hasNext();) {
			Property prop = (Property) pi.next();
			System.out.println(prop.getName());
			System.out.println(prop.getValue().toString());
			System.out.println("*********************");
		}
		System.out.println(Arrays.asList(history.getVersionLabels()));
		for (VersionIterator it = history.getAllVersions(); it.hasNext();) {
			Version version = (Version) it.next();
			System.out.println("\t***Version...***");
			System.out.println("\tVersion Identifier: " + version.getIdentifier());
			System.out.println("\tVersion Path: " + version.getPath());
			System.out.println("\tVersion Index: " + version.getIndex());
			System.out.println("\tVersion Depth: " + version.getDepth());
			System.out.println("\tVersion Name:" + version.getName());
			System.out.println("\tVersion Created Date: " + version.getCreated().getTime());
			System.out.println("\t***Properties***");
			for (PropertyIterator pi = version.getProperties(); pi.hasNext();) {
				Property prop = (Property) pi.next();
				System.out.println("\t" + prop.getName());
				try {
					System.out.println("\t" + prop.getValue());
				} catch (javax.jcr.ValueFormatException e) {
					System.out.println("\tValue could not be retrieved.");
				}
				System.out.println("\t*********************\n");
			}
			System.out.println(Arrays.asList(history.getVersionLabels(version)));
		}
		System.out.println("Printing contents of a previous version 1.1 ....");
		System.out.println(history.getVersion("1.1").getFrozenNode().getNode(JcrConstants.NODETYPE_JCR_CONTENT).getProperty(JcrConstants.PROPERTY_JCR_DATA).getString());
	}

	@Test
	public void testUpdateSupport() throws Exception {
		VersionManager vm = session.getWorkspace().getVersionManager();
		Node node = rootNode.getNode("support/BASE/Basic_Contract.properties");
		vm.checkout(node.getPath());
		Node content = node.getNode(JcrConstants.NODETYPE_JCR_CONTENT);

		String contentStr = content.getProperty(JcrConstants.PROPERTY_JCR_DATA).getString();
		System.out.println("******************Here is the original content...");
		System.out.println(contentStr);

		Scanner keyboard = new Scanner(System.in);
		System.out.println("Enter new content followed by a terminating string of \"UPDATE_DONE\"");
		keyboard.useDelimiter("UPDATE_DONE");
		contentStr = keyboard.next();

		Binary binary = session.getValueFactory().createBinary(new ByteArrayInputStream(contentStr.getBytes()));
		content.setProperty(JcrConstants.PROPERTY_JCR_DATA, binary);
		session.save();
		vm.checkin(node.getPath());
	}
	*/
	@Test
	public void testExportMetaModels() throws Exception {
		Node parentNode = session.getRootNode();
		
		traverseNodeAndExport(parentNode);
	}
	
	private void traverseNodeAndExport(Node node) throws Exception{
		if (node.hasNodes()) {
			NodeIterator nodes = node.getNodes();
			while (nodes.hasNext()) {
				Node childNode = nodes.nextNode();
				if (childNode.getPrimaryNodeType().getName().equals(JcrConstants.NODETYPE_NT_FILE)) {
					exportFile(childNode);
				}else if(childNode.getPrimaryNodeType().getName().equals(JcrConstants.NODETYPE_NT_FOLDER)){
					traverseNodeAndExport(childNode);
				}
			}
		}
	}
	
	private void exportFile(Node node) throws Exception{
		String fileContent = node.getNode(JcrConstants.NODETYPE_JCR_CONTENT).getProperty(JcrConstants.PROPERTY_JCR_DATA).getString();
		String relPath = node.getParent().getPath();
		String fileName = node.getName();
		FSRepositoryService fSRepositoryService = new FSRepositoryService();
		//fSRepositoryService.setIntegrationService(integrationService);
		System.out.println("***Processing*** -  " + relPath + JcrConstants.PATHSEPERATOR + fileName);
		fSRepositoryService.sendFile("C:/UX-POINTIN/exports", fileName, fileContent, CommonConstants.JSON_CONTENT_TYPE, relPath, "Export");
	}
	
	//@Test
	public void updateMetaModels() throws Exception {
		FSRepositoryService fSRepositoryService = new FSRepositoryService();
		JCRRepositoryService jcrRepositoryService = new JCRRepositoryService();
		String url = "http://basvdevpntwa9:9082/jackrabbit/rmi?username=admin&password=admin&workspaceName=dev&node=metamodel&repoURIType=org.apache.jackrabbit.repository.uri";
		
		//fSRepositoryService.setIntegrationService(integrationService);
		//jcrRepositoryService.setIntegrationService(integrationService);
		
		Node mmNode = rootNode.getNode("metamodel");
		
		ObjectMapper jacksonObjectMapper = new ObjectMapper();
		List<String> fileNames = fSRepositoryService.receiveFileNames(localRepositoryEndPointURI,"");
		for(Object fileName : fileNames){
			String fileContent = fSRepositoryService.receiveFile(localRepositoryEndPointURI, (String)fileName, "");
			fileContent  = ConversionUtil.prettifyJSON(fileContent);
			jcrRepositoryService.sendFile(url, (String)fileName, fileContent, new MimetypesFileTypeMap().getContentType((String) fileName), "", "SVN Merge");
			System.out.println("done -- "+ fileName);
			
		}
	}
}
