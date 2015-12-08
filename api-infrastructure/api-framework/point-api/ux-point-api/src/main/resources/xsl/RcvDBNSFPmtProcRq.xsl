<?xml version="1.0" encoding="UTF-8"?>
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
						<CustLoginId>
							<xsl:value-of select="USER" />
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID>
					<xsl:value-of select="$REQUEST_CODE" />
				</RqUID>
				<xsl:element name="{concat(substring($REQUEST_CODE,0,string-length($REQUEST_CODE)-4),'Rq')}">
					<PayLoad>
						<RCV_PYMT_ADJ_INFO_ROW>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE><xsl:value-of select="HDR_TRAN_TYPE" /></PROC_TRANSACTION_TYPE>
								<PROC_EFFECTIVE_DATE/>
								<PROC_LDA_SELECT />
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
							<STATIC_ROW>
								<ST_BATCH_WRIT_DTE>0</ST_BATCH_WRIT_DTE>
								<ST_BATCH_SEQ_NUM>0</ST_BATCH_SEQ_NUM>
								<ST_ORIG_WRT_DTE>0</ST_ORIG_WRT_DTE>
								<ST_ORIG_REC_SEQ>0</ST_ORIG_REC_SEQ>
								<ST_BATCH_CTL_AMT><xsl:value-of select="ST_BATCH_CTL_AMT" /></ST_BATCH_CTL_AMT>
								<ST_BATCH_ENT_AMT><xsl:value-of select="ST_BATCH_ENT_AMT" /></ST_BATCH_ENT_AMT>
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
							<PYMT_ADJ_HDR_ROW>
								<HDR_CUST_OR_POL_LVL><xsl:value-of select="HDR_CUST_OR_POL_LVL" /></HDR_CUST_OR_POL_LVL>
								<HDR_CASH_WRT_DTE><xsl:value-of select="HDR_CASH_WRT_DTE" /></HDR_CASH_WRT_DTE>
								<HDR_CASH_REC_SEQ><xsl:value-of select="HDR_CASH_REC_SEQ" /></HDR_CASH_REC_SEQ>
								<HDR_ORIG_WRT_DTE><xsl:value-of select="HDR_ORIG_WRT_DTE" /></HDR_ORIG_WRT_DTE>
								<HDR_ORIG_REC_SEQ><xsl:value-of select="HDR_ORIG_REC_SEQ" /></HDR_ORIG_REC_SEQ>
								<HDR_BATCH_NUM_OF_ITEMS><xsl:value-of select="HDR_BATCH_NUM_OF_ITEMS" /></HDR_BATCH_NUM_OF_ITEMS>
								<HDR_LOC><xsl:value-of select="HDR_LOC" /></HDR_LOC>
								<HDR_MCO><xsl:value-of select="HDR_MCO" /></HDR_MCO>
								<HDR_SYM><xsl:value-of select="HDR_SYM" /></HDR_SYM>
								<HDR_POLNO><xsl:value-of select="HDR_POLNO" /></HDR_POLNO>
								<HDR_MOD><xsl:value-of select="HDR_MOD" /></HDR_MOD>
								<HDR_ENTRY_DATE><xsl:value-of select="ENTRYDATE" /></HDR_ENTRY_DATE>
								<HDR_PYMT_AMT><xsl:value-of select="HDR_PYMT_AMT" /></HDR_PYMT_AMT>
								<HDR_CHK_NUM><xsl:value-of select="CHECKNUM" /></HDR_CHK_NUM>
								<HDR_PAY_BY><xsl:value-of select="PAYBY" /></HDR_PAY_BY>
								<HDR_RCPT_TYPE />
								<HDR_CUST_NO ><xsl:value-of select="HDR_CUSTNO" /></HDR_CUST_NO>
								<HDR_AVAIL_AMT />
								<HDR_CHK_INDIC />
							</PYMT_ADJ_HDR_ROW>
							<xsl:choose>
								<xsl:when test="list/PayLoad">
									<xsl:for-each select="list/PayLoad">
										<PYMT_ADJ_DTL_ROW>
											<DTL_FIRST_TIME_SW><xsl:value-of select="DTL_FIRST_TIME_SW" /></DTL_FIRST_TIME_SW>
											<DTL_CASH_WRT_DTE><xsl:value-of select="WSCASHWRTDTE" /></DTL_CASH_WRT_DTE>
											<DTL_CASH_REC_SEQ><xsl:value-of select="WSCASHRECSEQ" /></DTL_CASH_REC_SEQ>
											<DTL_ORIG_WRT_DTE><xsl:value-of select="WSORIGWRTDTE" /></DTL_ORIG_WRT_DTE>
											<DTL_ORIG_REC_SEQ><xsl:value-of select="WSORIGRECSEQ" /></DTL_ORIG_REC_SEQ>
											<DTL_LOC><xsl:value-of select="WSLOCATION" /></DTL_LOC>
											<DTL_MCO><xsl:value-of select="WSMASTERCO" /></DTL_MCO>
											<DTL_SYM><xsl:value-of select="WSSYMBOL" /></DTL_SYM>
											<DTL_POLNO><xsl:value-of select="WSPOLICYNUM" /></DTL_POLNO>
											<DTL_MOD><xsl:value-of select="WSMODULE" /></DTL_MOD>
											<DTL_ACTIVITY_DATE><xsl:value-of select="WSACTDATE" /></DTL_ACTIVITY_DATE>
											<DTL_REMAINING_BAL><xsl:value-of select="WSREMAINBAL" /></DTL_REMAINING_BAL>
											<DTL_USR_IND06><xsl:value-of select="WSUSERINDIC06" /></DTL_USR_IND06>
											<DTL_CHARGE_FEE_INDIC><xsl:value-of select="DTL_CHARGE_FEE_INDIC" /></DTL_CHARGE_FEE_INDIC>
											<DTL_REC_NUM><xsl:value-of select="REC_NUM" /></DTL_REC_NUM>
											<DTL_TFR_AMT />
											<DTL_ERR_MSG />
											<DTL_SUCCESS_INDIC />
										</PYMT_ADJ_DTL_ROW>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<PYMT_ADJ_DTL_ROW>
										<DTL_FIRST_TIME_SW>Y</DTL_FIRST_TIME_SW>
										<DTL_CASH_WRT_DTE>0000000</DTL_CASH_WRT_DTE>
										<DTL_CASH_REC_SEQ>000000</DTL_CASH_REC_SEQ>
										<DTL_ORIG_WRT_DTE>0000000</DTL_ORIG_WRT_DTE>
										<DTL_ORIG_REC_SEQ>000000</DTL_ORIG_REC_SEQ>
										<DTL_LOC/>
										<DTL_MCO/>
										<DTL_SYM/>
										<DTL_POLNO/>
										<DTL_MOD/>
										<DTL_ACTIVITY_DATE/>
										<DTL_REMAINING_BAL>0.00</DTL_REMAINING_BAL>
										<DTL_USR_IND06/>
										<DTL_CHARGE_FEE_INDIC>N</DTL_CHARGE_FEE_INDIC>
										<DTL_REC_NUM>0</DTL_REC_NUM>
										<DTL_TFR_AMT/>
										<DTL_ERR_MSG/>
										<DTL_SUCCESS_INDIC/>
									</PYMT_ADJ_DTL_ROW>
								</xsl:otherwise>
							</xsl:choose>
						</RCV_PYMT_ADJ_INFO_ROW>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>