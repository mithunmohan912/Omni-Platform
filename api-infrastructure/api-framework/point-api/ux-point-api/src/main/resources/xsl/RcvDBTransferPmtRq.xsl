<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="REQUEST_CODE">
			<xsl:value-of select="REQUESTCODE" />
		</xsl:variable>


		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId><xsl:value-of select="USER" /></CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID>
					<xsl:value-of select="$REQUEST_CODE" />
				</RqUID>
				<RCVDBTFRRq>
					<PayLoad>
						<RCV_PYMT_ADJ_INFO_ROW>
							<STATIC_ROW>
								<ST_BATCH_WRIT_DTE>0</ST_BATCH_WRIT_DTE>
								<ST_BATCH_SEQ_NUM>0</ST_BATCH_SEQ_NUM>
								<ST_ORIG_WRT_DTE>0</ST_ORIG_WRT_DTE>
								<ST_ORIG_REC_SEQ>0</ST_ORIG_REC_SEQ>
								<ST_BATCH_CTL_AMT>0</ST_BATCH_CTL_AMT>
								<ST_BATCH_ENT_AMT>0</ST_BATCH_ENT_AMT>
							</STATIC_ROW>
							<CONTROL_HEADER_ROW>
								<CTL_LOC />
								<CTL_MCO />
								<CTL_SYM />
								<CTL_POLNO />
								<CTL_MOD />
								<CTL_CUST_NO />
								<CTL_PYMT_AMT />
								<CTL_CHK_NUM />
							</CONTROL_HEADER_ROW>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE />
								<PROC_EFFECTIVE_DATE />
								<PROC_LDA_SELECT><xsl:value-of select="PROC_LDA_SELECT" /></PROC_LDA_SELECT>
								<PROC_LDA_SYSTEM_DATE_OVERRIDE />
								<PROC_LDA_ACCTG_DATE />
								<PROC_LDA_TYPE_ACTIVITY />
								<PROC_SUCCESS_INDIC>N</PROC_SUCCESS_INDIC>
								<PROC_SPEC_USE1 />
								<PROC_SPEC_USE2 />
								<PROC_SPEC_USE3 />
								<PROC_SPEC_USE4 />
								<PROC_SPEC_USE5 />
							</PROCESSING_INFO>
							<PYMT_ADJ_HDR_ROW>
								<HDR_CUST_OR_POL_LVL />
								<HDR_CASH_WRT_DTE><xsl:value-of select="HDR_CASH_WRT_DTE" /></HDR_CASH_WRT_DTE>
								<HDR_CASH_REC_SEQ><xsl:value-of select="HDR_CASH_REC_SEQ" /></HDR_CASH_REC_SEQ>
								<HDR_ORIG_WRT_DTE />
								<HDR_ORIG_REC_SEQ />
								<HDR_BATCH_NUM_OF_ITEMS><xsl:value-of select="HDR_BATCH_NUM_OF_ITEMS" /></HDR_BATCH_NUM_OF_ITEMS>
								<HDR_LOC><xsl:value-of select="HDR_LOC" /></HDR_LOC>
								<HDR_MCO><xsl:value-of select="HDR_MCO" /></HDR_MCO>
								<HDR_SYM><xsl:value-of select="HDR_SYM" /></HDR_SYM>
								<HDR_POLNO><xsl:value-of select="HDR_POLNO" /></HDR_POLNO>
								<HDR_MOD><xsl:value-of select="HDR_MOD" /></HDR_MOD>
								<HDR_ENTRY_DATE />
								<HDR_PYMT_AMT />
								<HDR_CHK_NUM />
								<HDR_PAY_BY />
								<HDR_RCPT_TYPE />
								<HDR_CUST_NO />
								<HDR_AVAIL_AMT><xsl:value-of select="HDR_AVAIL_AMT" /></HDR_AVAIL_AMT>
								<HDR_CHK_INDIC />
							</PYMT_ADJ_HDR_ROW>
							<xsl:for-each select="list/PayLoad">
								<PYMT_ADJ_DTL_ROW>
									<DTL_FIRST_TIME_SW>N</DTL_FIRST_TIME_SW>
									<DTL_CASH_WRT_DTE />
									<DTL_CASH_REC_SEQ />
									<DTL_ORIG_WRT_DTE />
									<DTL_ORIG_REC_SEQ />
									<DTL_LOC><xsl:value-of select="WSLOCATION" /></DTL_LOC>
									<DTL_MCO><xsl:value-of select="WSMASTERCO" /></DTL_MCO>
									<DTL_SYM><xsl:value-of select="WSSYMBOL" /></DTL_SYM>
									<DTL_POLNO><xsl:value-of select="WSPOLICY" /></DTL_POLNO>
									<DTL_MOD><xsl:value-of select="WSMODULE" /></DTL_MOD>
									<DTL_ACTIVITY_DATE />
									<DTL_REMAINING_BAL>0.00</DTL_REMAINING_BAL>
									<DTL_USR_IND06 />
									<DTL_CHARGE_FEE_INDIC />
									<DTL_REC_NUM><xsl:value-of select="REC_NUM" /></DTL_REC_NUM>
									<DTL_TFR_AMT><xsl:value-of select="WSTRANSFERAMT" /></DTL_TFR_AMT>
									<DTL_ERR_MSG>
									</DTL_ERR_MSG>
									<DTL_SUCCESS_INDIC>
									</DTL_SUCCESS_INDIC>
								</PYMT_ADJ_DTL_ROW>
							</xsl:for-each>
						</RCV_PYMT_ADJ_INFO_ROW>
					</PayLoad>
				</RCVDBTFRRq>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>