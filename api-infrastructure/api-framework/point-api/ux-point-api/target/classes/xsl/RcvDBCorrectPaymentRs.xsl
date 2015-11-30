<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="POINTXML">

		<POINTXML>
			<HDR_MCO><xsl:value-of select="HDR_MCO" /></HDR_MCO>
			<ENTRYDATE><xsl:value-of select="HDR_ENTRY_DATE" /></ENTRYDATE>
			<PAYMTAMT><xsl:value-of select="HDR_PYMT_AMT" /></PAYMTAMT>
			<CHECKNUM><xsl:value-of select="HDR_CHK_NUM" /></CHECKNUM>
			<PAYBY><xsl:value-of select="HDR_PAY_BY" /></PAYBY>
			<HDR_LOC><xsl:value-of select="HDR_LOC" /></HDR_LOC>
			<HDR_ORIG_WRT_DTE><xsl:value-of select="HDR_ORIG_WRT_DTE" /></HDR_ORIG_WRT_DTE>
			<HDR_ORIG_REC_SEQ><xsl:value-of select="HDR_ORIG_REC_SEQ" /></HDR_ORIG_REC_SEQ>
			<HDR_CASH_WRT_DTE><xsl:value-of select="HDR_CASH_WRT_DTE" /></HDR_CASH_WRT_DTE>
			<HDR_CASH_REC_SEQ><xsl:value-of select="HDR_CASH_REC_SEQ" /></HDR_CASH_REC_SEQ>
			<HDR_SYM><xsl:value-of select="HDR_SYM" /></HDR_SYM>
			<HDR_POLNO><xsl:value-of select="HDR_POLNO" /></HDR_POLNO>
			<HDR_MOD><xsl:value-of select="HDR_MOD" /></HDR_MOD>
			<HDR_PYMT_AMT><xsl:value-of select="HDR_PYMT_AMT" /></HDR_PYMT_AMT>
			<HDR_CUST_NO><xsl:value-of select="HDR_CUST_NO" /></HDR_CUST_NO>
			<HDR_BATCH_NUM_OF_ITEMS><xsl:value-of select="HDR_BATCH_NUM_OF_ITEMS" /></HDR_BATCH_NUM_OF_ITEMS>
			<PROC_SUCCESS_INDIC><xsl:value-of select="PROC_SUCCESS_INDIC" /></PROC_SUCCESS_INDIC>
			<Rows>
				<Row>
					<WSREMAINBAL><xsl:value-of select="DTL_REMAINING_BAL" /></WSREMAINBAL>
					<WSUSERINDIC06><xsl:value-of select="DTL_USR_IND06" /></WSUSERINDIC06>
					<WSACTDATE><xsl:value-of select="DTL_ACTIVITY_DATE" /></WSACTDATE>
					<WSCASHRECSEQ><xsl:value-of select="DTL_CASH_REC_SEQ" /></WSCASHRECSEQ>
					<WSLOCATION><xsl:value-of select="DTL_LOC" /></WSLOCATION>
					<WSMODULE><xsl:value-of select="DTL_MOD" /></WSMODULE>
					<WSSYMBOL><xsl:value-of select="DTL_SYM" /></WSSYMBOL>
					<WSORIGWRTDTE><xsl:value-of select="DTL_ORIG_WRT_DTE" /></WSORIGWRTDTE>
					<WSCASHWRTDTE><xsl:value-of select="DTL_CASH_WRT_DTE" /></WSCASHWRTDTE>
					<WSPOLICYNUM><xsl:value-of select="DTL_POLNO" /></WSPOLICYNUM>
					<WSORIGRECSEQ><xsl:value-of select="DTL_ORIG_REC_SEQ" /></WSORIGRECSEQ>
					<WSMASTERCO><xsl:value-of select="DTL_MCO" /></WSMASTERCO>
					<DTL_FIRST_TIME_SW><xsl:value-of select="DTL_FIRST_TIME_SW" /></DTL_FIRST_TIME_SW>
					<DTL_CHARGE_FEE_INDIC><xsl:value-of select="DTL_CHARGE_FEE_INDIC" /></DTL_CHARGE_FEE_INDIC>
					<REC_NUM><xsl:value-of select="DTL_REC_NUM" /></REC_NUM>
					<DTL_SUCCESS_INDIC><xsl:value-of select="DTL_SUCCESS_INDIC" /></DTL_SUCCESS_INDIC>
					<DTL_ERR_MSG><xsl:value-of select="DTL_ERR_MSG" /></DTL_ERR_MSG>
				</Row>
			</Rows>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>