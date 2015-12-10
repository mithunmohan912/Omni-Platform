package com.csc.ux.canvas.converter.util;

import org.w3c.dom.Node;

import com.csc.ux.canvas.converter.pojo.vpl.VplElement;

public class ElementFactory {
	
	private enum DataType {edit,result,checkbox,combobox,radiogroup,picture,border,pushbutton,line};
	
	public static VplElement getInstance(Node chNode) throws Exception{
		String name = chNode.getNodeName();
		String vplElemPackage = ConverterConstants.VPL_ELEMENTS_PACKAGE;
		String className = determineClassName(name);
		if("".equals(className)){
			return null;
		}
		Class<?> elemClass = Class.forName(vplElemPackage.concat(determineClassName(name)));
		return (VplElement)elemClass.newInstance();
	}

	private static String determineClassName(String name) {
		String elemClassName = "";
		DataType dType = DataType.valueOf(name);
		switch(dType){
		case edit:
			elemClassName = "EditElement";
			break;
		case result:
			elemClassName = "ResultElement";
			break;
		case checkbox:
			elemClassName = "CheckboxElement";
			break;
		case combobox:
			elemClassName = "SelectElement";
			break;
		case radiogroup:
			elemClassName = "RadioElement";
			break;
		case picture:
			elemClassName = "PictureElement";
			break;
		case border:
			elemClassName = "";
			break;
		case pushbutton:
			elemClassName = "ButtonElement";
			break;
		default:
			elemClassName = "";
			break;
		}
		return elemClassName;
	}
}
