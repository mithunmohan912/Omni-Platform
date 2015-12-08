<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="REQUEST_CODE">
			<xsl:value-of select="REQUESTCODE" />
		</xsl:variable>
		<xsl:variable name="DTL_LOCATION">
			<xsl:value-of select="DTL_LOCATION" />
		</xsl:variable>
		<xsl:variable name="DTL_MCO_01">
			<xsl:value-of select="DTL_MCO_01" />
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
				<RqUID><xsl:value-of select="$REQUEST_CODE" /></RqUID>
				<xsl:element name="{concat(substring($REQUEST_CODE,0,string-length($REQUEST_CODE)-4),'Rq')}">
					<PayLoad>
						<RCV_CB_ALLOC_INFO_ROW>
							<PROCESSING_INFO>
								<PROC_SUCCESS_INDIC>N</PROC_SUCCESS_INDIC>
							</PROCESSING_INFO>
							<CB_ALLOC_HDR_ROW>
								<HDR_BATCH_WRIT_DTE><xsl:value-of select="HDR_BATCH_WRIT_DTE" /></HDR_BATCH_WRIT_DTE>
								<HDR_BATCH_SEQ_NUM><xsl:value-of select="HDR_BATCH_SEQ_NUM" /></HDR_BATCH_SEQ_NUM>
								<pre_fill_0 />
								<HDR_BATCH_CTL_AMT />
								<HDR_ORIG_WRT_DTE><xsl:value-of select="HDR_ORIG_WRT_DTE" /></HDR_ORIG_WRT_DTE>
								<HDR_ORIG_REC_SEQ><xsl:value-of select="HDR_ORIG_REC_SEQ" /></HDR_ORIG_REC_SEQ>
								<HDR_CUST_NBR><xsl:value-of select="HDR_CUST_NBR" /></HDR_CUST_NBR>
								<HDR_CUST_NAME><xsl:value-of select="HDR_CUST_NAME" /></HDR_CUST_NAME>
								<HDR_CHECK_NBR><xsl:value-of select="HDR_CHECK_NBR" /></HDR_CHECK_NBR>
								<HDR_RCPT_TYPE><xsl:value-of select="HDR_RCPT_TYPE" /></HDR_RCPT_TYPE>
								<pre_fill_1 />
								<HDR_PYMT_AMT><xsl:value-of select="HDR_PYMT_AMT" /></HDR_PYMT_AMT>
								<pre_fill_2 />
								<HDR_ALLOC_AMT><xsl:value-of select="HDR_ALLOC_AMT" /></HDR_ALLOC_AMT>
								<pre_fill_3 />
								<HDR_AVAIL_AMT><xsl:value-of select="HDR_AVAIL_AMT" /></HDR_AVAIL_AMT>
								<pre_fill_4 />
								<HDR_CUST_BAL><xsl:value-of select="HDR_CUST_BAL" /></HDR_CUST_BAL>
								<pre_fill_5 />
								<HDR_MIN_DUE><xsl:value-of select="HDR_MIN_DUE" /></HDR_MIN_DUE>
							</CB_ALLOC_HDR_ROW>
							<xsl:for-each select="list/PayLoad">
								<CB_ALLOC_DTL_ROW>
									<DTL_CASH_WRT_DTE><xsl:value-of select="WSCASHWRITDTE" /></DTL_CASH_WRT_DTE>
									<DTL_CASH_REC_SEQ><xsl:value-of select="WSCASHRECSEQ" /></DTL_CASH_REC_SEQ>
									<DTL_ORIG_WRT_DTE><xsl:value-of select="WSORIGWRITDTE" /></DTL_ORIG_WRT_DTE>
									<DTL_ORIG_REC_SEQ><xsl:value-of select="WSORIGRECSEQ" /></DTL_ORIG_REC_SEQ>
									<DTL_CASH_ACTIVITY>T</DTL_CASH_ACTIVITY>
									<DTL_LOC><xsl:value-of select="WSLOCATION" /></DTL_LOC>
									<DTL_MCO><xsl:value-of select="WSMASTERCO" /></DTL_MCO>
									<DTL_SYM><xsl:value-of select="WSSYMBOL" /></DTL_SYM>
									<DTL_POLNO><xsl:value-of select="WSPOLICYNUM" /></DTL_POLNO>
									<DTL_MOD><xsl:value-of select="WSMODULE" /></DTL_MOD>
									<DTL_LOB><xsl:value-of select="WSLOB" /></DTL_LOB>
									<DTL_PAYBY><xsl:value-of select="WSPAYBY" /></DTL_PAYBY>
									<DTL_LOCATION><xsl:value-of select="$DTL_LOCATION" /></DTL_LOCATION>
									<DTL_MCO_01><xsl:value-of select="$DTL_MCO_01" /></DTL_MCO_01>
									<DTL_TFR_MCO><xsl:value-of select="WSMASTERCO" /></DTL_TFR_MCO>
									<DTL_TFR_POL_CLT><xsl:value-of select="WSTFRPOLCLT" /></DTL_TFR_POL_CLT>
									<DTL_EFFDTE><xsl:value-of select="WSEFFDATE" /></DTL_EFFDTE>
									<pre_fill_6><xsl:value-of select="pre_fill_6" /></pre_fill_6>
									<DTL_POL_BAL><xsl:value-of select="WSPOLCUSTBAL" /></DTL_POL_BAL>
									<pre_fill_7><xsl:value-of select="pre_fill_7" /></pre_fill_7>
									<DTL_POL_MIN_DUE><xsl:value-of select="WSPOLMINDUE" /></DTL_POL_MIN_DUE>
									<pre_fill_8><xsl:value-of select="pre_fill_8" /></pre_fill_8>
									<DTL_POL_PYMT_AMT><xsl:value-of select="WSPOLPYMTAMT" /></DTL_POL_PYMT_AMT>
									<DTL_USER_DATE_01 />
									<DTL_SUSP_IND><xsl:value-of select="WSSUSPIND" /></DTL_SUSP_IND>
									<DTL_BATCH_STATUS />
									<DTL_SUCCESS_IND />
									<DTL_ERR_MSG />
								</CB_ALLOC_DTL_ROW>
							</xsl:for-each>
						</RCV_CB_ALLOC_INFO_ROW>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>
