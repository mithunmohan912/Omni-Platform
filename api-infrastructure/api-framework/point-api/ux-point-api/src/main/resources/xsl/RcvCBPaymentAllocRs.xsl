<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="POINTXML">
	<xsl:for-each select="RCV_CB_ALLOC_INFO_ROW ">
		<POINTXML>
			<HDR_BATCH_WRIT_DTE><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_BATCH_WRIT_DTE" /></HDR_BATCH_WRIT_DTE>
			<HDR_BATCH_SEQ_NUM><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_BATCH_SEQ_NUM" /></HDR_BATCH_SEQ_NUM>
			<HDR_CUST_NAME><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_CUST_NAME" /></HDR_CUST_NAME>
			<HDR_RCPT_TYPE><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_RCPT_TYPE" /></HDR_RCPT_TYPE>
			<HDR_CHECK_NBR><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_CHECK_NBR" /></HDR_CHECK_NBR>
			<HDR_PYMT_AMT><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_PYMT_AMT" /></HDR_PYMT_AMT>
			<HDR_ALLOC_AMT><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_ALLOC_AMT" /></HDR_ALLOC_AMT>
			<HDR_AVAIL_AMT><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_AVAIL_AMT" /></HDR_AVAIL_AMT>
			<HDR_CUST_BAL><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_CUST_BAL" /></HDR_CUST_BAL>
			<HDR_MIN_DUE><xsl:value-of select="CB_ALLOC_HDR_ROW/HDR_MIN_DUE" /></HDR_MIN_DUE>
			<PROC_SUCCESS_INDIC><xsl:value-of select="PROCESSING_INFO/PROC_SUCCESS_INDIC" /></PROC_SUCCESS_INDIC>
			<Rows>
				<xsl:for-each select="CB_ALLOC_DTL_ROW ">
					<Row>
						<WSCASHWRITDTE><xsl:value-of select="DTL_CASH_WRT_DTE" /></WSCASHWRITDTE>
						<WSCASHRECSEQ><xsl:value-of select="DTL_CASH_REC_SEQ" /></WSCASHRECSEQ>
						<WSORIGWRITDTE><xsl:value-of select="DTL_ORIG_WRT_DTE" /></WSORIGWRITDTE>
						<WSORIGRECSEQ><xsl:value-of select="DTL_ORIG_REC_SEQ" /></WSORIGRECSEQ>
						<WSLOCATION><xsl:value-of select="DTL_LOC" /></WSLOCATION>
						<WSMASTERCO><xsl:value-of select="DTL_MCO" /></WSMASTERCO>
						<WSSYMBOL><xsl:value-of select="DTL_SYM" /></WSSYMBOL>
						<WSPOLICYNUM><xsl:value-of select="DTL_POLNO" /></WSPOLICYNUM>
						<WSMODULE><xsl:value-of select="DTL_MOD" /></WSMODULE>
						<WSLOB><xsl:value-of select="DTL_LOB" /></WSLOB>
						<WSPAYBY><xsl:value-of select="DTL_PAYBY" /></WSPAYBY>
						<WSEFFDATE><xsl:value-of select="DTL_EFFDTE" /></WSEFFDATE>
						<WSPOLCUSTBAL><xsl:value-of select="DTL_POL_BAL" /></WSPOLCUSTBAL>
						<WSPOLMINDUE><xsl:value-of select="DTL_POL_MIN_DUE" /></WSPOLMINDUE>
						<WSPOLPYMTAMT><xsl:value-of select="DTL_POL_PYMT_AMT" /></WSPOLPYMTAMT>
						<WSTFRPOLCLT><xsl:value-of select="DTL_TFR_POL_CLT" /></WSTFRPOLCLT>
						<WSTFRMCO><xsl:value-of select="DTL_SYM" /></WSTFRMCO>
						<WSSUSPIND><xsl:value-of select="DTL_SUSP_IND" /></WSSUSPIND>
						<WSERROR><xsl:value-of select="DTL_ERR_MSG" /></WSERROR>
						<WSERRORINDIC><xsl:value-of select="DTL_SUCCESS_IND" /></WSERRORINDIC>
					</Row>
				</xsl:for-each>
			</Rows>
		</POINTXML>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>