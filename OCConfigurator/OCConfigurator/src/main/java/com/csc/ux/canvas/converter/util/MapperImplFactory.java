package com.csc.ux.canvas.converter.util;

import com.csc.ux.canvas.converter.pojo.helper.DefaultMapperImpl;
import com.csc.ux.canvas.converter.pojo.helper.IMapper;

public class MapperImplFactory {
	public static IMapper getMapper(String type){
		IMapper mapper = null;
		if("Default".equals(type)){
			mapper = new DefaultMapperImpl();
		}
		return mapper;
	}
}
