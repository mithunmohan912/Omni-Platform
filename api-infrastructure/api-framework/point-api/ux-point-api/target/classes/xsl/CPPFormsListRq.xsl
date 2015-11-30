<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">


		<!-- TODO: Auto-generated template -->
		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:call-template name="cvtToUpper">
								<xsl:with-param name="user" select="User" />
							</xsl:call-template>
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID>
					<xsl:value-of select="REQUESTCODE" />
				</RqUID>
				<xsl:element name="{concat(substring(REQUESTCODE,0,9),'Rq')}">
					<PayLoad>
						<ENDR_INFO_ROW>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE />
								<PROC_EFFECTIVE_DATE />
								<PROC_PROGRAM_NAME />
								<PROC_LDA_SELECT />
								<PROC_PANEL_MODE />
								<PROC_LDA_SYSTEM_DATE_OVERRIDE />
								<PROC_LDA_SECURITY />
								<PROC_LDA_ACCTG_DATE />
								<PROC_LDA_TRANSSEQ />
								<PROC_LDA_ISSUE_CODE />
								<PROC_LDA_RENEWAL_MODULE />
								<PROC_LDA_TYPE_ACTIVITY />
								<PROC_LDA_CUR_REC_SET_STATUS />
								<PROC_LDA_RECORD_IND />
								<PROC_SUCCESS_INDIC />
							</PROCESSING_INFO>
							<KEY_INFO>
								<LOCATION>
									<xsl:value-of select="LOC" />
								</LOCATION>
								<MASTER_CO>
									<xsl:value-of select="MASTERLOC" />
								</MASTER_CO>
								<SYMBOL>
									<xsl:value-of select="SYMBOL" />
								</SYMBOL>
								<POL_NO>
									<xsl:value-of select="POLNUM" />
								</POL_NO>
								<POL_MODULE>
									<xsl:value-of select="MODULE" />
								</POL_MODULE>
							</KEY_INFO>
							<xsl:for-each select="list/PayLoad">
								<ENDR_REC_ROW>
									<FORM_NUM>
										<xsl:value-of select="BEB8NB" />
									</FORM_NUM>
									<SPECIMEN>
										<xsl:value-of select="Specimen" />
									</SPECIMEN>
									<FORM_DESC>
										<xsl:value-of select="A6N7TX" />
									</FORM_DESC>
									<ADDL_FORM_DESC />
									<PRT_SEQ_NUM>
										<xsl:value-of select="PRINTSEQ" />
									</PRT_SEQ_NUM>
									<FTR_SEQ_NUM>0</FTR_SEQ_NUM>
									<TRAN_SUCCESS_INDIC />
									<BEAGTX>
										<xsl:value-of select="BEAGTX" />
									</BEAGTX>
									<BEBRNB>
										<xsl:value-of select="BEBRNB" />
									</BEBRNB>
									<BEEGNB>
										<xsl:value-of select="BEEGNB" />
									</BEEGNB>
									<BEB9NB>
										<xsl:value-of select="BEB9NB" />
									</BEB9NB>
									<BEB7NB>
										<xsl:value-of select="BEB7NB" />
									</BEB7NB>
									<FORM_SEQ_IT>
										<xsl:value-of select="FORMSEQIT" />
									</FORM_SEQ_IT>
								</ENDR_REC_ROW>
							</xsl:for-each>
						</ENDR_INFO_ROW>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
	<xsl:template name="cvtToUpper">
		<xsl:param name="user" />
		<xsl:value-of
			select="translate($user, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</xsl:template>

</xsl:stylesheet>