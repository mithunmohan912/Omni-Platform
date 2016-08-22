<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="POINTXML">
		<POINTXML>
			<ERROR1>
				<xsl:value-of select="ERROR1" />
			</ERROR1>
			<ERRORSEV1>
				<xsl:value-of select="ERRORSEV1" />
			</ERRORSEV1>
			<ERRORSWITCH1>
				<xsl:value-of select="ERRORSWITCH1" />
			</ERRORSWITCH1>
			<ERRORFIELD1 />

			<xsl:for-each select="BULK_MORT_CHANGE_RECORD_ROW">
				<BASIC_CONTRACT_INFO>
					<BC_LINE_OF_BUSINESS>
						<xsl:value-of select="BC_LINE_OF_BUSINESS" />
					</BC_LINE_OF_BUSINESS>
					<BC_POLICY_COMPANY>
						<xsl:value-of select="BC_POLICY_COMPANY" />
					</BC_POLICY_COMPANY>
					<BC_AGENT_NUMBER>
						<xsl:value-of select="BC_AGENT_NUMBER" />
					</BC_AGENT_NUMBER>
					<BC_STATE>
						<xsl:value-of select="BC_STATE" />
					</BC_STATE>
				</BASIC_CONTRACT_INFO>
				<PROCESSING_INFO>
					<PROC_TRANSACTION_TYPE>
						<xsl:value-of select="PROC_TRANSACTION_TYPE" />
					</PROC_TRANSACTION_TYPE>
					<PROC_PROGRAM_NAME>
						<xsl:value-of select="PROC_PROGRAM_NAME" />
					</PROC_PROGRAM_NAME>
					<PROC_EFFECTIVE_DATE>
						<xsl:value-of select="PROC_EFFECTIVE_DATE" />
					</PROC_EFFECTIVE_DATE>
					<PROC_LDA_SELECT>
						<xsl:value-of select="PROC_LDA_SELECT" />
					</PROC_LDA_SELECT>
					<PROC_PANEL_MODE>
						<xsl:value-of select="PROC_PANEL_MODE" />
					</PROC_PANEL_MODE>
					<PROC_LDA_SYSTEM_DATE_OVERRIDE>
						<xsl:value-of select="PROC_LDA_SYSTEM_DATE_OVERRIDE" />
					</PROC_LDA_SYSTEM_DATE_OVERRIDE>
					<PROC_LDA_SECURITY>
						<xsl:value-of select="PROC_LDA_SECURITY" />
					</PROC_LDA_SECURITY>
					<PROC_LDA_ACCTG_DATE>
						<xsl:value-of select="PROC_LDA_ACCTG_DATE" />
					</PROC_LDA_ACCTG_DATE>
					<PROC_LDA_TRANSSEQ>
						<xsl:value-of select="PROC_LDA_TRANSSEQ" />
					</PROC_LDA_TRANSSEQ>
					<PROC_LDA_ISSUE_CODE>
						<xsl:value-of select="PROC_LDA_ISSUE_CODE" />
					</PROC_LDA_ISSUE_CODE>
					<PROC_LDA_RENEWAL_MODULE>
						<xsl:value-of select="PROC_LDA_RENEWAL_MODULE" />
					</PROC_LDA_RENEWAL_MODULE>
					<PROC_LDA_TYPE_ACTIVITY>
						<xsl:value-of select="PROC_LDA_TYPE_ACTIVITY" />
					</PROC_LDA_TYPE_ACTIVITY>
					<PROC_LDA_CUR_REC_SET_STATUS>
						<xsl:value-of select="PROC_LDA_CUR_REC_SET_STATUS" />
					</PROC_LDA_CUR_REC_SET_STATUS>
					<PROC_LDA_RECORD_IND>
						<xsl:value-of select="PROC_LDA_RECORD_IND" />
					</PROC_LDA_RECORD_IND>
					<PROC_LDA_SET_TYPE_NUMBER>
						<xsl:value-of select="PROC_LDA_SET_TYPE_NUMBER" />
					</PROC_LDA_SET_TYPE_NUMBER>
					<PROC_SUCCESS_INDIC>
						<xsl:value-of select="PROC_SUCCESS_INDIC" />
					</PROC_SUCCESS_INDIC>
				</PROCESSING_INFO>
				<Rows>
					<xsl:for-each select="BULK_POLICIES">
						<Row>
							<SYMBOL_A>
								<xsl:value-of select="SYMBOL_A" />
							</SYMBOL_A>
							<POLICY_A>
								<xsl:value-of select="POLICY_A" />
							</POLICY_A>
							<MODULE_A>
								<xsl:value-of select="MODULE_A" />
							</MODULE_A>
							<MASTERCO_A>
								<xsl:value-of select="MASTERCO_A" />
							</MASTERCO_A>
							<LOCCO_A>
								<xsl:value-of select="LOCCO_A" />
							</LOCCO_A>
							<INDICATOR_A>
								<xsl:value-of select="INDICATOR_A" />
							</INDICATOR_A>
							<ERROR_A>
								<xsl:value-of select="ERROR_A" />
							</ERROR_A>
							<ERRORINDIC_A>
								<xsl:value-of select="ERRORINDIC_A" />
							</ERRORINDIC_A>
							<REASON_A>
								<xsl:value-of select="REASON_A" />
							</REASON_A>
							<CRT_ENDORSE_REC>
								<xsl:value-of select="CRT_ENDORSE_REC" />
							</CRT_ENDORSE_REC>
							<OLD_CLIENT_SEQ>
								<xsl:value-of select="OLD_CLIENT_SEQ" />
							</OLD_CLIENT_SEQ>
							<OLD_ADDR_SEQ>
								<xsl:value-of select="OLD_ADDR_SEQ" />
							</OLD_ADDR_SEQ>
							<OLD_MT_NAME>
								<xsl:value-of select="OLD_MT_NAME" />
							</OLD_MT_NAME>
							<OLD_MT_ADDR1>
								<xsl:value-of select="OLD_MT_ADDR1" />
							</OLD_MT_ADDR1>
							<OLD_MT_ADDR2>
								<xsl:value-of select="OLD_MT_ADDR2" />
							</OLD_MT_ADDR2>
							<OLD_MT_CITY>
								<xsl:value-of select="OLD_MT_CITY" />
							</OLD_MT_CITY>
							<OLD_MT_PC>
								<xsl:value-of select="OLD_MT_PC" />
							</OLD_MT_PC>
							<OLD_MT_STATE>
								<xsl:value-of select="OLD_MT_STATE" />
							</OLD_MT_STATE>
							<NEW_CLIENT_SEQ>
								<xsl:value-of select="NEW_CLIENT_SEQ" />
							</NEW_CLIENT_SEQ>
							<NEW_ADDR_SEQ>
								<xsl:value-of select="NEW_ADDR_SEQ" />
							</NEW_ADDR_SEQ>
							<NEW_MT_NAME>
								<xsl:value-of select="NEW_MT_NAME" />
							</NEW_MT_NAME>
							<NEW_MT_ADDR1>
								<xsl:value-of select="NEW_MT_ADDR1" />
							</NEW_MT_ADDR1>
							<NEW_MT_ADDR2>
								<xsl:value-of select="NEW_MT_ADDR2" />
							</NEW_MT_ADDR2>
							<NEW_MT_CITY>
								<xsl:value-of select="NEW_MT_CITY" />
							</NEW_MT_CITY>
							<NEW_MT_PC>
								<xsl:value-of select="NEW_MT_PC" />
							</NEW_MT_PC>
							<NEW_MT_STATE>
								<xsl:value-of select="NEW_MT_STATE" />
							</NEW_MT_STATE>
						</Row>
					</xsl:for-each>
				</Rows>
			</xsl:for-each>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>