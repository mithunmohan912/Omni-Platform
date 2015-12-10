//*******************************************************************************
// * Copyright (c) 2012 CSC.
// *
// * The information contained in this document is the exclusive property of
// * CSC.  This work is protected under USA copyright law
// * and the copyright laws of given countries of origin and international
// * laws, treaties and/or conventions. No part of this document may be
// * reproduced or transmitted in any form or by any means, electronic or
// * mechanical including photocopying or by any informational storage or
// * retrieval system, unless as expressly permitted by CSC.
// ******************************************************************************
package com.csc.cscip.ux.common.report;

import java.awt.Color;
import java.io.IOException;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellUtil;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.webflow.context.ExternalContext;
import org.springframework.webflow.execution.RequestContext;

public class UXReportUtils {
	public static final float TABLE_ROW_HEIGHT = 15f;
	public static final String SHEET_NAME = "Sheet1";
	public static final String EXCEL_EXT = ".xlsx";
	public static final short TABLE_FONT_HEIGHT_IN_POINTS = 10;
	public static final short TITLE_FONT_HEIGHT_IN_POINTS = 18;
	public static final short COMMON_DATA_FONT_HEIGHT_IN_POINTS = 11;
	public static final XSSFColor TABLE_HEADER_BACKGROUND = new XSSFColor(new Color(202, 198, 198));
	public static final XSSFColor TABLE_PARENT_ROW_BACKGROUND = new XSSFColor(new Color(245, 245, 245));
	public static final XSSFColor TABLE_SUB_ROW_BACKGROUND = new XSSFColor(new Color(201, 224, 242));
	public static final XSSFColor BORDER_LABEL_ROW_BACKGROUND = new XSSFColor(new Color(197, 217, 241));

	/**
	 * I don't know why there is no CellUtil.createCell with Date value, so I create this method.
	 * 
	 * 
	 * @param row
	 * @param column
	 * @param value
	 * @param style
	 * @return
	 */
	public static Cell createCell(Row row, int column, Date value, CellStyle style) {
		Cell cell = row.createCell(column);
		setCellValue(cell, value);
		cell.setCellStyle(style);

		return cell;
	}

	public static Cell createCell(Row row, int column, Double value, CellStyle style) {
		Cell cell = row.createCell(column);
		setCellValue(cell, value);
		cell.setCellStyle(style);

		return cell;
	}

	public static Cell createCell(Row row, int column, Double value, CellStyle style, int type) {
		Cell cell = createCell(row, column, value, style);
		cell.setCellType(type);
		return cell;
	}

	public static Cell createCell(Row row, int column, Date value) {
		Cell cell = row.createCell(column);
		setCellValue(cell, value);

		return cell;
	}

	public static Cell createCell(Row row, int column, String value, CellStyle style, int type) {
		Cell cell = CellUtil.createCell(row, column, value, style);
		cell.setCellType(type);
		return cell;
	}

	public static Cell createCell(Row row, int column, String value, CellStyle style) {
		Cell cell = CellUtil.createCell(row, column, value, style);
		return cell;
	}

	public static Cell createCell(Row row, int column, Date value, CellStyle style, int type) {
		Cell cell = createCell(row, column, value, style);
		cell.setCellType(type);
		return cell;
	}

	private static void setCellValue(Cell cell, Double value) {
		if (value != null) {
			cell.setCellValue(value);
		}
	}

	private static void setCellValue(Cell cell, Date value) {
		if (value != null) {
			cell.setCellValue(value);
		}
	}

	/**
	 * Download Excel file.
	 * 
	 * 
	 * @param requestContext
	 * @param fileName
	 * @param wb
	 * @throws IOException
	 */
	public static void downloadExcelFile(RequestContext requestContext, String fileName, XSSFWorkbook wb) throws IOException {
		fileName += EXCEL_EXT;
		ExternalContext externalContext = requestContext.getExternalContext();
		HttpServletResponse response = (HttpServletResponse) externalContext.getNativeResponse();
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		response.setHeader("Content-Disposition", "attachment; filename=" + fileName + "; charset=utf-8");

		OutputStream out = response.getOutputStream();
		wb.write(out);
		out.close();
		externalContext.recordResponseComplete();
	}

	public static Double convertToDouble(String value) {
		Double result = null;
		if (StringUtils.isNotBlank(value)) {
			result = Double.valueOf(value);
		}
		return result;
	}
	
	public static Date convertStringToDate(String str) throws ParseException {
		Date date = null;
		if (StringUtils.isNotBlank(str)){
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			date = df.parse(str);
		}
		return date;
			
	}

	// Common styles
	public static Font createTableHeaderFont(XSSFWorkbook wb) {
		Font font = wb.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		font.setFontHeightInPoints(UXReportUtils.TABLE_FONT_HEIGHT_IN_POINTS);
		return font;
	}

	public static Font createLabelFont(XSSFWorkbook wb) {
		Font font = wb.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		return font;
	}

	public static Font createTitleFont(XSSFWorkbook wb) {
		Font font = wb.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		font.setFontHeightInPoints(UXReportUtils.TITLE_FONT_HEIGHT_IN_POINTS);
		return font;
	}

	public static Font createReportDateFont(XSSFWorkbook wb) {
		Font font = wb.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);

		return font;
	}

	public static Font createCommonDataFont(XSSFWorkbook wb) {
		Font font = wb.createFont();
		font.setFontHeightInPoints(UXReportUtils.COMMON_DATA_FONT_HEIGHT_IN_POINTS);
		return font;
	}

	public static Font createTableDataFont(XSSFWorkbook wb) {
		Font font = wb.createFont();
		font.setFontHeightInPoints(UXReportUtils.TABLE_FONT_HEIGHT_IN_POINTS);
		return font;
	}

	public static XSSFCellStyle createLabelStyle(XSSFWorkbook wb) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setBorderTop(CellStyle.BORDER_THICK);
		style.setBorderRight(CellStyle.BORDER_THICK);
		style.setBorderBottom(CellStyle.BORDER_THICK);
		style.setBorderLeft(CellStyle.BORDER_THICK);
		style.setFillForegroundColor(BORDER_LABEL_ROW_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		return style;
	}

	public static XSSFCellStyle createLabelStyle1(XSSFWorkbook wb) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setBorderTop(CellStyle.BORDER_THICK);
		style.setBorderRight(CellStyle.BORDER_THICK);
		style.setBorderBottom(CellStyle.BORDER_THICK);
		style.setBorderLeft(CellStyle.BORDER_THICK);
		style.setFillForegroundColor(BORDER_LABEL_ROW_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setAlignment(HorizontalAlignment.CENTER);
		return style;
	}

	public static XSSFCellStyle createLabelStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle labelStyle = createLabelStyle(wb);
		labelStyle.setFont(font);
		return labelStyle;
	}

	public static XSSFCellStyle createLabelStyle1(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = createLabelStyle1(wb);
		style.setFont(font);
		return style;
	}

	public static XSSFCellStyle createTableHeaderStyle(XSSFWorkbook wb) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFillForegroundColor(UXReportUtils.TABLE_HEADER_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		style.setWrapText(true);

		return style;
	}

	public static XSSFCellStyle createTableHeaderStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = createTableHeaderStyle(wb);
		style.setFont(font);

		return style;
	}

	public static XSSFCellStyle createTitleStyle(XSSFWorkbook wb) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		return style;
	}

	public static XSSFCellStyle createTitleStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = createTitleStyle(wb);
		style.setFont(font);

		return style;
	}

	public static XSSFCellStyle createParentRowStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setFillForegroundColor(TABLE_PARENT_ROW_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		style.setDataFormat((short) 0x31);
		return style;
	}
	
	public static XSSFCellStyle createParentRowCurrencyStyle(XSSFWorkbook wb, Font font, short format) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setFillForegroundColor(TABLE_PARENT_ROW_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		style.setDataFormat(format);

		return style;
	}

	public static XSSFCellStyle createParentRowDateStyle(XSSFWorkbook wb, Font font, short format) {
		XSSFCellStyle parentRowDateStyle = wb.createCellStyle();
		parentRowDateStyle.setFont(font);
		parentRowDateStyle.setFillForegroundColor(TABLE_PARENT_ROW_BACKGROUND);
		parentRowDateStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		parentRowDateStyle.setWrapText(true);
		parentRowDateStyle.setDataFormat(format);

		return parentRowDateStyle;
	}	

	public static Font createCommonDataBorderFont(XSSFWorkbook wb) {
		Font font = wb.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		font.setFontHeightInPoints(UXReportUtils.COMMON_DATA_FONT_HEIGHT_IN_POINTS);
		return font;
	}

	
	public static XSSFCellStyle createCommonDataBorderStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setAlignment(CellStyle.ALIGN_LEFT);
		// style.setBorderRight(BorderStyle.THIN);
		return style;
	}
	
	public static XSSFCellStyle createReportDateBorderStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setAlignment(CellStyle.ALIGN_RIGHT);
		//style.setBorderRight(BorderStyle.THIN);
		return style;
	}	
	
	
//	public static XSSFCellStyle createTitleBorderStyle(XSSFWorkbook wb, Font font) {
//		XSSFCellStyle style = wb.createCellStyle();
//		style.setFont(font);
//		style.setAlignment(CellStyle.ALIGN_CENTER);
//		return style;
//	}
	
	public static XSSFCellStyle createTableHeaderBorderStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setFillForegroundColor(UXReportUtils.TABLE_HEADER_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		style.setWrapText(true);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);

		return style;
	}
	
	public static XSSFCellStyle createChildRowBorderStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setWrapText(true);
		style.setBorderBottom(BorderStyle.DOTTED);
		style.setBorderLeft(BorderStyle.DOTTED);
		style.setBorderRight(BorderStyle.DOTTED);
		return style;
	}
	
	public static XSSFCellStyle createChildRowCurrencyBorderStyle(XSSFWorkbook wb, Font font, short format) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setWrapText(true);
		style.setDataFormat(format);
		style.setBorderBottom(BorderStyle.DOTTED);
		style.setBorderLeft(BorderStyle.DOTTED);
		style.setBorderRight(BorderStyle.DOTTED);

		return style;
	}
	
	
	public static XSSFCellStyle createChildRowStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setFillForegroundColor(TABLE_SUB_ROW_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		style.setDataFormat((short) 0x31);

		return style;
	}
	
	public static XSSFCellStyle createChildRowDateBorderStyle(XSSFWorkbook wb, Font font, short format) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setWrapText(true);
		style.setDataFormat(format);
		style.setBorderBottom(BorderStyle.DOTTED);
		style.setBorderLeft(BorderStyle.DOTTED);
		style.setBorderRight(BorderStyle.DOTTED);
		return style;
	}

	public static XSSFCellStyle createChildRowCurrencyStyle(XSSFWorkbook wb, Font font, short format) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setFillForegroundColor(TABLE_SUB_ROW_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		style.setDataFormat(format);
		return style;
	}

	public static XSSFCellStyle createChildRowDateStyle(XSSFWorkbook wb, Font font, short format) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setFillForegroundColor(TABLE_SUB_ROW_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		style.setDataFormat(format);

		return style;
	}
	
	public static XSSFCellStyle createChildRowPercentStyle(XSSFWorkbook wb, Font font, short format) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setFillForegroundColor(TABLE_SUB_ROW_BACKGROUND);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		style.setDataFormat(format);

		return style;
	}

	// Bill Account List - Begin
	public static XSSFCellStyle createParentRowStyle(XSSFWorkbook wb, Font font, HorizontalAlignment align) {
		XSSFCellStyle style = createParentRowStyle(wb, font);
		style.setAlignment(align);
		return style;
	}

	public static XSSFCellStyle createParentRowDateStyle(XSSFWorkbook wb, Font font, short format, HorizontalAlignment align) {
		XSSFCellStyle style = createParentRowDateStyle(wb, font, format);
		style.setAlignment(align);
		return style;
	}

	public static XSSFCellStyle createParentRowCurrencyStyle(XSSFWorkbook wb, Font font, short format, HorizontalAlignment align) {
		XSSFCellStyle style = createParentRowCurrencyStyle(wb, font, format);
		style.setAlignment(align);
		return style;
	}

	public static XSSFCellStyle createChildRowStyle(XSSFWorkbook wb, Font font, HorizontalAlignment align) {
		XSSFCellStyle style = createChildRowStyle(wb, font);
		style.setAlignment(align);
		return style;
	}

	public static XSSFCellStyle createChildRowCurrencyStyle(XSSFWorkbook wb, Font font, short format, HorizontalAlignment align) {
		XSSFCellStyle style = createChildRowCurrencyStyle(wb, font, format);
		style.setAlignment(align);
		return style;
	}

	public static XSSFCellStyle createChildRowDateStyle(XSSFWorkbook wb, Font font, short format, HorizontalAlignment align) {
		XSSFCellStyle style = createChildRowDateStyle(wb, font, format);
		style.setAlignment(align);
		return style;
	}

	public static XSSFCellStyle createChildRowPercentStyle(XSSFWorkbook wb, Font font, short format, HorizontalAlignment align) {
		XSSFCellStyle style = createChildRowPercentStyle(wb, font, format);
		style.setAlignment(align);
		return style;
	}

	// Bill Account List - End

	public static XSSFCellStyle createReportDateStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		return style;
	}

	public static XSSFCellStyle createCommonDataStyle(XSSFWorkbook wb, Font font) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);

		return style;
	}

	public static XSSFCellStyle createCommonCurrencyDataStyle(XSSFWorkbook wb, Font font, short format) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setDataFormat(format);
		return style;
	}

	public static XSSFCellStyle createCommonDateDataStyle(XSSFWorkbook wb, Font font, short format) {
		XSSFCellStyle style = wb.createCellStyle();
		style.setFont(font);
		style.setDataFormat(format);
		style.setAlignment(HorizontalAlignment.LEFT);

		return style;
	}
}
