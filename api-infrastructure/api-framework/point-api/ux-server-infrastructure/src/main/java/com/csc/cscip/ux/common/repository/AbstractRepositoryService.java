package com.csc.cscip.ux.common.repository;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.activation.MimetypesFileTypeMap;

import org.springframework.stereotype.Service;

import com.csc.cscip.ux.common.util.UXRepositoryUtil;

@Service
public abstract class AbstractRepositoryService implements RepositoryService {

	@Override
	public String receiveFile(String repoEndPointURI, String fileName, String childRelPath, String versionNo) throws Exception {
		throw new RuntimeException("Version Number not supported by the given repository. Please do not specify a version number to get the latest version.");
	}

	@Override
	public List<Object> importFile(String repoEndPointURI, String importSourceType, String importSourceURI, String[] childRelPaths) throws Exception {
		List<Object> importedNames = new ArrayList<Object>();
		importPath(repoEndPointURI, importSourceType, importSourceURI, importedNames, "");
		if (childRelPaths != null && !"".equals(childRelPaths.toString())) {
			for (String childRelPath : childRelPaths) {
				importPath(repoEndPointURI, importSourceType, importSourceURI, importedNames, childRelPath);
			}
		}
		return importedNames;
	}

	private void importPath(String repoEndPointURI, String importSourceType, String importSourceURI, List<Object> importedNames, String childRelPath)
			throws Exception {
		List<String> fileNames = UXRepositoryUtil.getFileList(importSourceType, importSourceURI, childRelPath, false);
		for (Object fileName : fileNames) {
			String fileContent = UXRepositoryUtil.receiveFile(importSourceType, importSourceURI, (String) fileName, childRelPath);
			sendFile(repoEndPointURI, (String) fileName, fileContent, new MimetypesFileTypeMap().getContentType((String) fileName), childRelPath,
					"Imported Base Version");
		}
		importedNames.addAll(fileNames);
	}

	@Override
	public List<HashMap<?, ?>> getHistory(String repoEndPointURI, String fileName, String childRelPath) throws Exception {
		throw new RuntimeException("Version History not supported by the given repository.");
	}

	/**
	 * Method to append child directory to the given URL
	 * 
	 * @param url
	 *            - URL String
	 * @param childRelPath
	 *            - Relative path of the child directory to be appended in the Base URI path
	 * @return
	 * @throws Exception
	 */
	protected static String appendURLdir(String url, String childRelPath) throws Exception {
		return url.substring(0, url.indexOf("?")).concat(File.separator).concat(childRelPath).concat(url.substring(url.indexOf("?")));
	}

}
