package com.csc.ux.canvas.converter.pojo.helper;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Properties;

import org.apache.commons.beanutils.PropertyUtils;

import com.csc.cscip.ux.common.util.UXUtils;
import com.csc.ux.canvas.converter.pojo.meta.IMetaElement;
import com.csc.ux.canvas.converter.pojo.vpl.VplElement;

public class DefaultMapperImpl implements IMapper {
	
	public void mapSrcDestProperties(String vplElemClass, VplElement srcElement, IMetaElement destElem) throws IOException, IllegalAccessException, InvocationTargetException, NoSuchMethodException {
		String sourceProperties = "";
		String destProperties = "";
		
		Properties mapperPrps = new Properties();
		mapperPrps = UXUtils.loadPropertiesFromPath("/DefaultMapper.properties");
		
		mapGenericProperties(mapperPrps, srcElement, destElem);
		
		if(mapperPrps.getProperty(vplElemClass.concat(".SRC_PROPS")) != null){
			sourceProperties = mapperPrps.getProperty(vplElemClass.concat(".SRC_PROPS"));
		}else{
			return;
		}
		if(mapperPrps.getProperty(vplElemClass.concat(".DEST_PROPS")) != null){
			destProperties = mapperPrps.getProperty(vplElemClass.concat(".DEST_PROPS"));
		}else{
			return;
		}
		setAutoFormat(srcElement, destElem);
		String[] srcProps = sourceProperties.split(",");
		String[] destProps = destProperties.split(",");
	
		for(int i=0; i<srcProps.length; i++){
			String srcProperty = srcProps[i].trim();
			String destProperty = destProps[i].trim();
			
			PropertyUtils.setProperty(destElem, destProperty, PropertyUtils.getProperty(srcElement, srcProperty));
		}
		
	}

	private void setAutoFormat(VplElement srcElement, IMetaElement destElem) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
		if(PropertyUtils.getProperty(srcElement, "uppercase") != null && PropertyUtils.getProperty(srcElement, "zerofill") != null 
				&& PropertyUtils.getProperty(srcElement, "zerofill").equals("true")	&& PropertyUtils.getProperty(srcElement, "uppercase").equals("true")){
			PropertyUtils.setProperty(destElem, "autoformat","true");
			PropertyUtils.setProperty(destElem, "regexp","^[0-9A-Z]*$");
		}else if(PropertyUtils.getProperty(srcElement, "zerofill") != null && PropertyUtils.getProperty(srcElement, "zerofill").equals("true")){
			PropertyUtils.setProperty(destElem, "autoformat","true");
			PropertyUtils.setProperty(destElem, "regexp","^[.]?[0-9]+[.]?[0-9]*$");
		}else if(PropertyUtils.getProperty(srcElement, "uppercase") != null && PropertyUtils.getProperty(srcElement, "uppercase").equals("true")){
			PropertyUtils.setProperty(destElem, "autoformat","true");
		}

	}

	private static void mapGenericProperties(Properties mapperPrps, VplElement srcElement, IMetaElement destElem) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
		
		String[] srcProps = mapperPrps.getProperty("DEFAULT_SRC_PROPS").split(",");
		String[] destProps = mapperPrps.getProperty(("DEFAULT_DEST_PROPS")).split(",");
	
		for(int i=0; i<srcProps.length; i++){
			String srcProperty = srcProps[i];
			String destProperty = destProps[i];
			
			PropertyUtils.setProperty(destElem, destProperty, PropertyUtils.getProperty(srcElement, srcProperty));
		}
	}

}
