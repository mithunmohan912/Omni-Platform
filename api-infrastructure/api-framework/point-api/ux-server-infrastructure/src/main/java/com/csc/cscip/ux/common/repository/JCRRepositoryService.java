package com.csc.cscip.ux.common.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import javax.activation.MimetypesFileTypeMap;
import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.Session;
import javax.jcr.version.VersionManager;
import org.springframework.stereotype.Service;
import com.csc.cscip.ux.common.util.JcrConstants;
import com.csc.cscip.ux.common.util.JcrUtils;
import com.csc.cscip.ux.common.util.StringUtils;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;

@Service
public class JCRRepositoryService extends AbstractRepositoryService {
	private String getCurrentNodeName(String baseURI, String childRelPath) throws Exception {
		String currentNodeName = StringUtils.getQueryParams(baseURI).get("node");
		if (currentNodeName == null || "".equals(currentNodeName)) {
			throw new RuntimeException("Retrieve service failed because no node parameter provided in the URI.");
		}
		return currentNodeName.concat((childRelPath != null && !"".equals(childRelPath)) ? JcrConstants.PATHSEPERATOR.concat(childRelPath)
				: "");
	}

	@Override
	public String receiveFile(String repoEndPointURI, String fileName, String childRelPath) throws Exception {
		Session session = JcrUtils.createJcrSession(repoEndPointURI);
		String currentNodeName = getCurrentNodeName(repoEndPointURI, childRelPath);

		String fileContent;
		try {
			fileContent = JcrUtils.getNodeContent(session.getRootNode().getNode(currentNodeName), fileName);
		} catch (Exception ex) {
			fileContent = null;
		}
		JcrUtils.closeJcrSession(session);
		return fileContent;
	}

	@Override
	public String receiveFile(String repoEndPointURI, String fileName, String childRelPath, String versionNo) throws Exception {
		Session session = JcrUtils.createJcrSession(repoEndPointURI);
		String currentNodeName = getCurrentNodeName(repoEndPointURI, childRelPath);

		String fileContent;
		try {
			fileContent = JcrUtils.getNodeContentbyVersion(session.getRootNode().getNode(currentNodeName), fileName, versionNo, session);
		} catch (Exception ex) {
			fileContent = null;
		}
		JcrUtils.closeJcrSession(session);
		return fileContent;
	}

	@Override
	public List<String> receiveFileNames(String repoEndPointURI, String childRelPath) throws Exception {
		Session session = JcrUtils.createJcrSession(repoEndPointURI);
		String currentNodeName = getCurrentNodeName(repoEndPointURI, childRelPath);

		List<String> files = JcrUtils.getAllNodes(session.getRootNode().getNode(currentNodeName));
		JcrUtils.closeJcrSession(session);
		return files;
	}

	@Override
	public void sendFile(String repoEndPointURI, String fileName, String fileContent, String contentType, String childRelPath,
			String remarks) throws Exception {
		Session session = JcrUtils.createJcrSession(repoEndPointURI);
		VersionManager vm = session.getWorkspace().getVersionManager();

		String currentNodeName = getCurrentNodeName(repoEndPointURI, childRelPath);
		Node currentNode;
		try {
			currentNode = session.getRootNode().getNode(currentNodeName);
			vm.checkout(currentNode.getPath());
		} catch (PathNotFoundException ex) {
			currentNode = JcrUtils.saveFolderNode(session.getRootNode(), currentNodeName, session);
		}
		JcrUtils.saveOrUpdateContentNode(currentNode, fileName, fileContent, contentType, session, vm, remarks);
		vm.checkin(currentNode.getPath());
		JcrUtils.closeJcrSession(session);
	}

	@Override
	public List<Object> importFile(String repoEndPointURI, String importSourceType, String importSourceURI, String[] childRelPaths)
			throws Exception {
		Session session = JcrUtils.createJcrSession(repoEndPointURI);
		VersionManager vm = session.getWorkspace().getVersionManager();

		String currentNodeName = getCurrentNodeName(repoEndPointURI, "");
		List<Object> importedNames = new ArrayList<Object>();

		Node currentNode = JcrUtils.saveFolderNode(session.getRootNode(), currentNodeName, session);
		List<String> fileNames = UXRepositoryUtil.getFileList(importSourceType, importSourceURI, "", false);
		for (Object fileName : fileNames) {
			if (!currentNode.hasNode((String) fileName)) {
				String fileContent = UXRepositoryUtil.receiveFile(importSourceType, importSourceURI, (String) fileName, "");
				Node contentNode = JcrUtils.saveOrUpdateContentNode(currentNode, (String) fileName, fileContent,
						new MimetypesFileTypeMap().getContentType((String) fileName), session, vm, "Imported Base Version");
				importedNames.add(contentNode.getPath());
			}
		}

		if (childRelPaths != null) {
			for (String childRelPath : childRelPaths) {
				Node childNode = JcrUtils.saveFolderNode(currentNode, childRelPath, session);
				fileNames = UXRepositoryUtil.getFileList(importSourceType, importSourceURI, childRelPath, false);
				for (Object fileName : fileNames) {
					if (!childNode.hasNode((String) fileName)) {
						String fileContent = UXRepositoryUtil.receiveFile(importSourceType, importSourceURI, (String) fileName,
								childRelPath);
						Node newContentNode = JcrUtils.saveOrUpdateContentNode(childNode, (String) fileName, fileContent,
								new MimetypesFileTypeMap().getContentType((String) fileName), session, vm, "Imported Base Version");
						importedNames.add(newContentNode.getPath());
					}
				}
				vm.checkin(childNode.getPath());
			}
		}
		vm.checkin(currentNode.getPath());
		JcrUtils.closeJcrSession(session);
		return importedNames;
	}

	@Override
	public List<HashMap<?, ?>> getHistory(String repoEndPointURI, String fileName, String childRelPath) throws Exception {
		Session session = JcrUtils.createJcrSession(repoEndPointURI);
		String currentNodeName = getCurrentNodeName(repoEndPointURI, childRelPath);
		List<HashMap<?, ?>> versionHistory;
		try {
			versionHistory = JcrUtils.getVersionHistory(session.getRootNode().getNode(currentNodeName), fileName, session);
		} catch (Exception ex) {
			versionHistory = null;
		}
		JcrUtils.closeJcrSession(session);
		return versionHistory;
	}
}
