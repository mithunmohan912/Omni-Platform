<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="POINTXML/RCV_PYMT_ADJ_INFO_ROW">
		<POINTXML>
			<HDR_LOC><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_LOC" /></HDR_LOC>
			<HDR_MCO><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_MCO" /></HDR_MCO>
			<HDR_SYM><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_SYM" /></HDR_SYM>
			<HDR_POLNO><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_POLNO" /></HDR_POLNO>
			<HDR_MOD><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_MOD" /></HDR_MOD>
			<AVAL_TRF><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_AVAIL_AMT" /></AVAL_TRF>
			<PROC_LDA_SELECT><xsl:value-of select="PROCESSING_INFO/PROC_LDA_SELECT" /></PROC_LDA_SELECT>
			<HDR_CASH_WRT_DTE><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_CASH_WRT_DTE" /></HDR_CASH_WRT_DTE>
			<HDR_CASH_REC_SEQ><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_CASH_REC_SEQ" /></HDR_CASH_REC_SEQ>
			<HDR_AVAIL_AMT><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_AVAIL_AMT" /></HDR_AVAIL_AMT>
			<HDR_BATCH_NUM_OF_ITEMS><xsl:value-of select="PYMT_ADJ_HDR_ROW/HDR_BATCH_NUM_OF_ITEMS" /></HDR_BATCH_NUM_OF_ITEMS>
			<PROC_SUCCESS_INDIC><xsl:value-of select="PROCESSING_INFO/PROC_SUCCESS_INDIC" /></PROC_SUCCESS_INDIC>
			<Rows>
				<xsl:for-each select="PYMT_ADJ_DTL_ROW ">
					<Row>
						<WSSYMBOL><xsl:value-of select="DTL_SYM" /></WSSYMBOL>
						<WSPOLICY><xsl:value-of select="DTL_POLNO" /></WSPOLICY>
						<WSMODULE><xsl:value-of select="DTL_MOD" /></WSMODULE>
						<WSMASTERCO><xsl:value-of select="DTL_MCO" /></WSMASTERCO>
						<WSTRANSFERAMT><xsl:value-of select="DTL_USR_IND06" /></WSTRANSFERAMT>
						<WSLOCATION><xsl:value-of select="DTL_LOC" /></WSLOCATION>
						<REC_NUM><xsl:value-of select="DTL_REC_NUM" /></REC_NUM>
						<DTL_SUCCESS_INDIC><xsl:value-of select="DTL_SUCCESS_INDIC" /></DTL_SUCCESS_INDIC>
						<DTL_ERR_MSG><xsl:value-of select="DTL_ERR_MSG" /></DTL_ERR_MSG>
					</Row>
				</xsl:for-each>
			</Rows>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>