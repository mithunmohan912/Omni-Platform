package com.csc.cscip.ux.common.util;

import java.util.Properties;

public class UXAppConfig {

	public static final String APPLICATION = "Application";
	public static final String NAVIGATION = "NAVIGATION";
	
	public static final String JDBC = "JDBC";
	
	public static final String SUPPORT = "SUPPORT";
	public static final String GRID = "GRID";
	public static final String ACTION = "ACTION";
	
	public static final String META_MODEL_REPOSITORY_TYPE = "MetaModelRepositoryType";
	public static final String META_MODEL_REPOSITORY_END_POINT_URI = "MetaModelRepositoryEndPointURI";

	public static final String SUPPORT_DATA_REPOSITORY_TYPE = "SupportDataRepositoryType";
	public static final String SUPPORT_DATA_REPOSITORY_END_POINT_URI = "SupportDataRepositoryEndPointURI";

	public static final String GRID_META_MODEL_REPOSITORY_TYPE = "GridMetaModelRepositoryType";
	public static final String GRID_META_MODEL_REPOSITORY_END_POINT_URI = "GridMetaModelRepositoryEndPointURI";

	public static final String META_MODEL_IMPORT_SOURCE_TYPE = "MetaModelImportSourceType";
	public static final String META_MODEL_IMPORT_SOURCE_URI = "MetaModelImportSourceURI";

	public static final String GRID_META_MODEL_IMPORT_SOURCE_TYPE = "GridMetaModelImportSourceType";
	public static final String GRID_META_MODEL_IMPORT_SOURCE_URI = "GridMetaModelImportSourceURI";

	public static final String SUPPORT_DATA_IMPORT_SOURCE_TYPE = "SupportDataImportSourceType";
	public static final String SUPPORT_DATA_IMPORT_SOURCE_URI = "SupportDataImportSourceURI";
	
	public static final String REPORT_METADATA_REPOSITORY_TYPE = "reportMetaDataType";
	public static final String REPORT_METADATA_REPOSITORY_URI = "reportMetaDataURI";

	public static final String RULES_META_MODEL_REPOSITORY_TYPE = "RulesMetaModelRepositoryType";
	public static final String RULES_META_MODEL_REPOSITORY_END_POINT_URI = "RulesMetaModelRepositoryEndPointURI";

	public static final String ALLOW_EXPRESS_ENTRY = "AllowExpressEntry";

	public static final String ACCESS_CONTROL_ALLOW_ORIGIN = "AccessControlAllowOrigin";
	public static final String ACCESS_CONTROL_ALLOW_HEADERS = "AccessControlAllowHeaders";
	private static Properties properties;

	public void setProperties(Properties properties) {
		UXAppConfig.properties = properties;
	}

	public static String getProperty(String key) {
		return properties.getProperty(key);
	}

	public static Integer getPropertyAsInt(String key) {
		return new Integer(getProperty(key));
	}

}
