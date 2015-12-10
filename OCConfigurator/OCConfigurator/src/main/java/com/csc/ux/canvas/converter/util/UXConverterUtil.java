package com.csc.ux.canvas.converter.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import com.csc.cscip.ux.common.util.UXUtils;
import com.csc.ux.canvas.converter.pojo.helper.Option;
import com.csc.ux.canvas.converter.pojo.helper.SupportInfo;

@Service
public class UXConverterUtil {
	public List<?> isNotEmpty(List<?> files) {
		return files == null ? Collections.EMPTY_LIST : files;
	}

	public Document convertTextToDom(String xmlContent) throws Exception {
		return XMLDocument.parseDoc(xmlContent);
	}

	public static void constructDynamicOptions(Node chNode, List<SupportInfo> supportInfo, String elemName) throws Exception {
		if (isSqlQuery(chNode)) {
			supportInfo.add(addSqlQueryInfo(chNode, elemName));
		} else {
			supportInfo.add(addStoredProcedureInfo(chNode, elemName));
		}
	}

	private static SupportInfo addSqlQueryInfo(Node chNode, String elemName) throws Exception {
		SupportInfo suppInfo = new SupportInfo();
		Node queryNode = XMLDocument.docGetNodeByXPath(chNode.getOwnerDocument(), "//attribute[name='" + elemName + "']/Support");
		if (queryNode != null && queryNode.hasChildNodes()) {
			String fldSet = XMLDocument.docGetDOMValueByXPath(queryNode, "fieldset");
			String tableSet = XMLDocument.docGetDOMValueByXPath(queryNode, "tableset");
			String whereClause = XMLDocument.docGetDOMValueByXPath(queryNode, "whereclause");
			String orderBy = XMLDocument.docGetDOMValueByXPath(queryNode, "orderBy");
			suppInfo.setElement(elemName);
			suppInfo.setType("SQL");
			suppInfo.setFieldSet(fldSet);
			suppInfo.setTableSet(tableSet);
			suppInfo.setWhereClause(whereClause);
			suppInfo.setOrderBy(orderBy);
		}
		return suppInfo;
	}

	private static SupportInfo addStoredProcedureInfo(Node chNode, String elemName) throws Exception {
		SupportInfo suppInfo = new SupportInfo();
		Node procNode = XMLDocument.docGetNodeByXPath(chNode.getOwnerDocument(), "//attribute[name='" + elemName + "']");
		String procedure = XMLDocument.docGetDOMValueByXPath(procNode, "Procedure");
		suppInfo.setElement(elemName);
		suppInfo.setType("SP");
		suppInfo.setProcName(procedure);
		String lookup = null;
		String choice = XMLDocument.docGetDOMValueByXPath(chNode, "choices/choice");
		if (choice != null && choice.contains("PP Look up Attribute Values")) {
			lookup = choice.substring(29, choice.length() - 2);
		} else if (choice != null && choice.contains("Default Look up Attribute Values")) {
			lookup = choice.substring(34, choice.length() - 2);
		}
		suppInfo.setLookup(lookup);
		return suppInfo;
	}

	private static boolean isSqlQuery(Node chNode) throws Exception {
		String tableSet = XMLDocument.docGetDOMValueByXPath(chNode, "choices/choice/tableset");
		if (tableSet != null && tableSet.trim().length() > 0) {
			return true;
		}
		return false;
	}

	public static void constructStaticOptions(Node chNode, List<Option> options, String id) throws Exception {
		Node optionsParent = XMLDocument.docGetNodeByXPath(chNode, "choices");
		NodeList optionNodes = optionsParent.getChildNodes();
		for (int i = 0; i < optionNodes.getLength(); i++) {
			Node optionNode = optionNodes.item(i);
			if ("#text".equals(optionNode.getNodeName()) || "unknown_page_element".equals(optionNode.getNodeName())) {
				continue;
			}
			Option option = new Option();
			String value = XMLDocument.docGetDOMValueByXPath(optionNode, "item");
			String description = XMLDocument.docGetDOMValueByXPath(optionNode, "value");
			option.setValue(value);
			option.setDescription(description);
			options.add(option);
		}

	}

	public static List<Double> determineElementSizes(List<Double> elemWidths) {
		double denominator = getSum(elemWidths);
		List<Double> elemSizes = new ArrayList<Double>();
		double totalLength = Integer.parseInt(ConverterConstants.DEFAULT_TOTAL_FIELD_SPAN);
		for (double width : elemWidths) {
			double size = Math.ceil(width * totalLength / denominator) <= 3 ? Math.ceil(width * totalLength / denominator) : Math
					.ceil(width * totalLength / denominator) - 1;
			elemSizes.add(size);
		}
		return elemSizes;
	}

	private static double getSum(List<Double> elemWidths) {
		double sum = 0;
		for (double width : elemWidths) {
			sum += width;
		}
		return sum;
	}

	public String[] getGroupAndFormId(String modelName) throws IOException {
		String[] resp = new String[2];

		Properties mapperPrps = new Properties();
		mapperPrps = UXUtils.loadPropertiesFromPath("/SupportMapper.properties");

		resp[0] = "BASE";
		if (mapperPrps.getProperty(modelName.concat(".GRP_ID")) != null && !mapperPrps.getProperty(modelName.concat(".GRP_ID")).equals("")) {
			resp[0] = mapperPrps.getProperty(modelName.concat(".GRP_ID"));
		}
		resp[1] = mapperPrps.getProperty(modelName.concat(".FORM_ID"));
		return resp;
	}

	public static void constructDynamicSqlTextField(Node chNode, List<SupportInfo> supportInfo, String elemName) throws Exception {
		supportInfo.add(addSqlQueryInfo(chNode, elemName));
	}
}
