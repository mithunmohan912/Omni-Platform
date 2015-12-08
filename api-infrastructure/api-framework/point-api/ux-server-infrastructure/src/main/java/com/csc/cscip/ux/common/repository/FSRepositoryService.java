package com.csc.cscip.ux.common.repository;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class FSRepositoryService extends AbstractRepositoryService {

	// @Autowired
	// private IntegratedRepositoryService camelRepositoryService;
	//
	// public void setCamelRepositoryService(IntegratedRepositoryService camelRepositoryService) {
	// this.camelRepositoryService = camelRepositoryService;
	// }

	@Override
	public void sendFile(String repoEndPointURI, String fileName, String fileContent, String contentType, String childRelPath, String remarks) throws Exception {
		BufferedWriter bw = new BufferedWriter(new FileWriter(prepareURL(repoEndPointURI, childRelPath) + File.separator + fileName));
		bw.write(fileContent);
		bw.close();
		//camelRepositoryService.sendFile(repoEndPointURI, fileName, fileContent, contentType, childRelPath, remarks);
	}

	@Override
	public String receiveFile(String repoEndPointURI, String fileName, String childRelPath) throws Exception {

		StringBuilder fileContent = new StringBuilder();

		BufferedReader br = new BufferedReader(new FileReader(prepareURL(repoEndPointURI, childRelPath) + File.separator + fileName));
		String line = br.readLine();
		while (line != null) {
			fileContent.append(line);
			fileContent.append("\n");
			line = br.readLine();
		}

		br.close();
		return fileContent.toString();
		// return camelRepositoryService.receiveFile(repoEndPointURI, fileName, childRelPath);
	}

	@Override
	public List<String> receiveFileNames(String repoEndPointURI, String childRelPath) throws Exception {
		String url = prepareURL(repoEndPointURI, childRelPath);

		File file= new File(url);
		return Arrays.asList(file.list(new FilenameFilter() {
			@Override
			public boolean accept(File dir, String name) {
				return name.contains(".json");
			}
		}));
		
		//return camelRepositoryService.receiveFileNames(repoEndPointURI, childRelPath);
	}

	
	private String prepareURL(String repoEndPointURI, String childRelPath) {
		
		String url = repoEndPointURI;
		if(childRelPath != null){
			url += File.separator + childRelPath;
		}
		return url;
	}

}
