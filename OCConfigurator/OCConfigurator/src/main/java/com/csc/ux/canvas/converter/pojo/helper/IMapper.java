package com.csc.ux.canvas.converter.pojo.helper;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import com.csc.ux.canvas.converter.pojo.meta.IMetaElement;
import com.csc.ux.canvas.converter.pojo.vpl.VplElement;

public interface IMapper {
	public void mapSrcDestProperties(String vplElemClass, VplElement srcElement, IMetaElement destElem) throws IOException, IllegalAccessException, InvocationTargetException, NoSuchMethodException ;
}
