package com.csc.ux.canvas.dao;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

public interface MetaModelDAO {
	public String getMetaModel(Object metaModelId);

	public List<List<Object>> fetchHierarchyUsingMetaModelName(String modelName);
	
	@Transactional
	public String getMessageName(String modelName);
}
