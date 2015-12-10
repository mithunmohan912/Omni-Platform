package com.csc.ux.canvas.service.metamodel;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public interface MetaModelService {
	public String fetchMetaModelName(HttpServletRequest request);

	public String fetchDefaultTemplateName();

	public String genMetaModelName();

	public boolean publishMetaModel(HttpServletRequest request, String modelName, String modelContent) throws Exception;

	public List<List<Object>> fetchHierarchyUsingMetaModelName(String modelName);

	public String executeQuery(String sqlQuery, Map<?, ?> params) throws Exception;
}
