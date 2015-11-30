package com.csc.cscip.ux.common.util;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ServiceLoader;
import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Repository;
import javax.jcr.RepositoryFactory;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.jcr.version.Version;
import javax.jcr.version.VersionHistory;
import javax.jcr.version.VersionIterator;
import javax.jcr.version.VersionManager;

public class JcrUtils {

	/**
	 * Method to create a JCR Session using the given JCR URL
	 * 
	 * @param url - The given JCR URL with parameters such as username, password and workspaceName
	 * @return
	 * @throws Exception
	 */
	public static Session createJcrSession(String url) throws Exception {
		Map<String, String> params = StringUtils.getQueryParams(url);
		String repoURIType = params.get(JcrConstants.REPOSITORY_URI);
		Repository repository = getRepository(repoURIType, url);
		SimpleCredentials creds = new SimpleCredentials(params.get(JcrConstants.USERNAME), params.get(JcrConstants.PASSWORD).toCharArray());
		Session session = repository.login(creds, params.get(JcrConstants.WORKSPACENAME));
		return session;
	}

	/**
	 * Method to create a Repository by looking up the RepositoryFactory using the ServiceLoader
	 * 
	 * @param repoURIType - The given repository URI type, e.g. org.apache.jackrabbit.repository.uri for Apache Jackrabbit
	 * @param url - The given repository URL
	 * @return
	 * @throws Exception
	 */
	public static Repository getRepository(String repoURIType, String url) throws Exception {
		Map<String, String> parameters = new HashMap<String, String>();
		parameters.put(repoURIType, url);
		Repository repository = null;
		for (RepositoryFactory factory : ServiceLoader.load(RepositoryFactory.class)) {
			repository = factory.getRepository(parameters);
			if (repository != null) {
				break;
			}
		}
		return repository;
	}

	/**
	 * Method to close and logout the given JCR Session
	 * 
	 * @param session
	 */
	public static void closeJcrSession(Session session) {
		session.logout();
	}

	/**
	 * Method to create a folder Node in JCR at a given parent node and relative path
	 * 
	 * @param parentNode - JCR parent node
	 * @param childNodeRelPath - Relative path of the child node to be created
	 * @param session - JCR Session object
	 * @return
	 * @throws Exception
	 */
	public static Node saveFolderNode(Node parentNode, String childNodeRelPath, Session session) throws Exception {
		VersionManager vm = session.getWorkspace().getVersionManager();
		Node node = null;
		if (!parentNode.hasNode(childNodeRelPath)) {
			String immediateParentPath = "";
			if (childNodeRelPath.lastIndexOf(JcrConstants.PATHSEPERATOR) > 0) {
				immediateParentPath = childNodeRelPath.substring(0, childNodeRelPath.lastIndexOf(JcrConstants.PATHSEPERATOR));
				immediateParentPath = session.getRootNode().getNode(immediateParentPath).getPath();
				vm.checkout(immediateParentPath);
			}
			node = parentNode.addNode(childNodeRelPath, JcrConstants.NODETYPE_NT_FOLDER);
			node.addMixin(JcrConstants.MIX_VERSIONABLE);
			session.save();
			vm.checkin(node.getPath());
			if (!"".equals(immediateParentPath)) {
				vm.checkin(immediateParentPath);
			}
		}
		node = parentNode.getNode(childNodeRelPath);
		vm.checkout(node.getPath());
		return node;
	}

	/**
	 * Method to create/update a content Node in JCR at a given parent node with a given name and content
	 * 
	 * @param parentNode - JCR parent node
	 * @param fileName - Name of the file to be created/updated
	 * @param fileContent - Contents of the file to be created/updated
	 * @param mimeType - Mime type of the contents to be created/updated
	 * @param session - JCR Session object
	 * @param vm - Version manager
	 * @param remarks - Remarks to be stored in the version label of the node
	 * @return
	 * @throws Exception
	 */
	public static Node saveOrUpdateContentNode(Node parentNode, String fileName, String fileContent, String mimeType, Session session,
			VersionManager vm, String remarks) throws Exception {
		Node fileNode = null;
		Node contentNode = null;
		if (parentNode.hasNode(fileName)) {
			fileNode = parentNode.getNode(fileName);
			vm.checkout(fileNode.getPath());
			contentNode = fileNode.getNode(JcrConstants.NODETYPE_JCR_CONTENT);
		} else {
			fileNode = parentNode.addNode(fileName, JcrConstants.NODETYPE_NT_FILE);
			fileNode.addMixin(JcrConstants.MIX_VERSIONABLE);
			contentNode = fileNode.addNode(JcrConstants.NODETYPE_JCR_CONTENT, JcrConstants.NODETYPE_NT_RESOURCE);

		}
		Binary binary = session.getValueFactory().createBinary(new ByteArrayInputStream(fileContent.getBytes()));
		contentNode.setProperty(JcrConstants.PROPERTY_JCR_MIMETYPE, mimeType);
		contentNode.setProperty(JcrConstants.PROPERTY_JCR_ENCODING, CommonConstants.CHARSET);
		contentNode.setProperty(JcrConstants.PROPERTY_JCR_DATA, binary);
		contentNode.setProperty(JcrConstants.PROPERTY_JCR_LASTMODIFIED, Calendar.getInstance());
		session.save();
		vm.checkin(fileNode.getPath());
		
		VersionHistory history = vm.getVersionHistory(fileNode.getPath());
		Version headVersion = vm.getBaseVersion(fileNode.getPath());
		history.addVersionLabel(headVersion.getName(), remarks, true);
		return fileNode;
	}

	/**
	 * Method to get the content of the given node name in JCR at a given parent node
	 * 
	 * @param node - JCR node
	 * @param fileName - Name of the file whose contents need to be retrieved
	 * @return
	 * @throws Exception
	 */
	public static String getNodeContent(Node node, String fileName) throws Exception {
		return node.getNode(fileName).getNode(JcrConstants.NODETYPE_JCR_CONTENT).getProperty(JcrConstants.PROPERTY_JCR_DATA).getString();
	}

	/**
	 * Method to get the content of the given version number of a given node name in JCR at a given parent node
	 * 
	 * @param node - JCR node
	 * @param fileName - Name of the file whose contents need to be retrieved
	 * @param versionNo - Version number of the file to be retrieved
	 * @param session - JCR session object
	 * @return
	 * @throws Exception
	 */
	public static String getNodeContentbyVersion(Node node, String fileName, String versionNo, Session session) throws Exception {
		VersionManager vm = session.getWorkspace().getVersionManager();
		VersionHistory history = vm.getVersionHistory(node.getNode(fileName).getPath());
		return history.getVersion(versionNo).getFrozenNode().getNode(JcrConstants.NODETYPE_JCR_CONTENT)
				.getProperty(JcrConstants.PROPERTY_JCR_DATA).getString();
	}

	/**
	 * Method to get a list of all child node names in JCR for a given parent node
	 * 
	 * @param parentNode - JCR parent node
	 * @return
	 * @throws Exception
	 */
	public static List<String> getAllNodes(Node parentNode) throws Exception {
		List<String> nodeNames = new ArrayList<String>();
		if (parentNode.hasNodes()) {
			NodeIterator nodes = parentNode.getNodes();
			while (nodes.hasNext()) {
				Node childNode = nodes.nextNode();
				if (childNode.getPrimaryNodeType().getName().equals(JcrConstants.NODETYPE_NT_FILE)) {
					nodeNames.add(childNode.getName());
				}
			}
		}
		return nodeNames;
	}

	/**
	 * Method to get the version History of the given node name in JCR at a given parent node
	 * 
	 * @param parentNode - JCR parent node
	 * @param fileName - Name of the file whose version history need to be retrieved
	 * @param session
	 * @return
	 * @throws Exception
	 */
	public static List<HashMap<?, ?>> getVersionHistory(Node parentNode, String fileName, Session session) throws Exception {
		VersionManager vm = session.getWorkspace().getVersionManager();
		if (parentNode.hasNode(fileName)) {
			VersionHistory history = vm.getVersionHistory(parentNode.getNode(fileName).getPath());
			List<HashMap<?, ?>> versionHistory = new ArrayList<HashMap<?, ?>>();
			for (VersionIterator it = history.getAllVersions(); it.hasNext();) {
				Version version = (Version) it.next();
				if (!version.getName().equalsIgnoreCase(JcrConstants.PROPERTY_JCR_ROOT_VERSION)) {
					HashMap<Object, Object> versionMap = new HashMap<Object, Object>();
					versionMap.put("VersionNumber", version.getName());
					versionMap.put("VersionDate", version.getCreated().getTime().toString());
					versionMap.put("VersionTags", Arrays.asList(history.getVersionLabels(version)));
					versionMap.put("VersionId", version.getIdentifier());
					versionHistory.add(versionMap);
				}
			}
			Collections.reverse(versionHistory);
			return versionHistory; 
		}
		return null;
	}
}
