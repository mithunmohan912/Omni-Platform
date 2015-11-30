<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="BATDTE">
			<xsl:value-of select="BATDTE"/>
		</xsl:variable>

		<xsl:variable name="BATSEQ">
			<xsl:value-of select="BATSEQ"/>
		</xsl:variable>

		<xsl:variable name="BATCTL">
			<xsl:value-of select="BATCTL"/>
		</xsl:variable>
		
		<xsl:variable name="BATENT">
        	<xsl:value-of select="BATENT"/>
   		</xsl:variable>
   		
   		<xsl:variable name="BATCNT">
        	<xsl:value-of select="BATCNT"/>
   		</xsl:variable>
   		   		
   		<xsl:variable name="REQUEST_CODE">
        	<xsl:value-of select="REQUESTCODE"/>
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
				<rulesIntegrated>Y</rulesIntegrated>
				<com.csc_SessKey>
					<xsl:value-of select="sessionKey" />
				</com.csc_SessKey>
			</SignonRq>

			<InsuranceSvcRq>

				<RqUID><xsl:value-of select="$REQUEST_CODE" /></RqUID>
				<RCVCBPAYRq>
					<PayLoad>
						<RCV_PAYMT_INFO_ROW>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE/>
								<PROC_SUCCESS_INDIC>Y</PROC_SUCCESS_INDIC>
							</PROCESSING_INFO>
							<BATCH_ROW>
								<BATCH_WRIT_DATE><xsl:value-of select="$BATDTE" /></BATCH_WRIT_DATE>
								<BATCH_SEQ_NBR><xsl:value-of select="$BATSEQ" /></BATCH_SEQ_NBR>
								<pre__fill__0/>
								<BATCH_CNTL_AMT><xsl:value-of select="$BATCTL" /></BATCH_CNTL_AMT>
								<pre__fill__1/>
								<BATCH_ENT_AMT><xsl:value-of select="$BATENT" /></BATCH_ENT_AMT>
								<BATCH_ITEM_COUNT><xsl:value-of select="$BATCNT" /></BATCH_ITEM_COUNT>
							</BATCH_ROW>
							<xsl:choose>
								<xsl:when test="$REQUEST_CODE = 'RCVCBPAYDL2Rq'">
									<xsl:for-each select="list/PayLoad[SUCCESS_INDIC='D']">
										<PAYMENT_REC_ROW>
											<TRAN_CASH_WRIT_DATE><xsl:value-of select="WSCASHRECDTE"/></TRAN_CASH_WRIT_DATE>
											<TRAN_CASH_RCD_SEQ><xsl:value-of select="WSCASHRECSEQ"/></TRAN_CASH_RCD_SEQ>
											<TRAN_CUST_NBR><xsl:value-of select="WSCUSTNBR"/></TRAN_CUST_NBR>
											<TRAN_POL_SYM></TRAN_POL_SYM>
											<TRAN_POL_NBR></TRAN_POL_NBR>
											<TRAN_POL_MOD></TRAN_POL_MOD>
											<pre__fill__2/>
											<TRAN_PAYMENT_AMT><xsl:value-of select="WSPAYMENTAMT" /></TRAN_PAYMENT_AMT>
											<TRAN_CHECK_NBR><xsl:value-of select="WSCHECKNBR" /></TRAN_CHECK_NBR>
											<TRAN_MASTER_CO><xsl:value-of select="WSMASTERCO" /></TRAN_MASTER_CO>
											<TRAN_LOCATION><xsl:value-of select="WSLOCATION" /></TRAN_LOCATION>
											<TRAN_RCPT_TYPE><xsl:value-of select="WSRCPTTYPE" /></TRAN_RCPT_TYPE>
											<TRAN_RCPT_DESC/>
											<TRAN_MODE_CODE></TRAN_MODE_CODE>
											<TRAN_SUCCESS_INDIC></TRAN_SUCCESS_INDIC>
											<TRAN_ERROR_MSG></TRAN_ERROR_MSG>
											<TRAN_STATUS><xsl:value-of select="WSSTATUS"/></TRAN_STATUS>
											<TRAN_OVERPAY_IND><xsl:value-of select="WSOVERPAYIND"/></TRAN_OVERPAY_IND>
											<TRAN_USERDATE_03><xsl:value-of select="WSUSRDTE03" /></TRAN_USERDATE_03>
											<TRAN_ORIG_WRIT_DTE><xsl:value-of select="WSORIGWRTDTE"/></TRAN_ORIG_WRIT_DTE>
											<TRAN_ORIG_WRIT_SEQ><xsl:value-of select="WSORIGRECSEQ"/></TRAN_ORIG_WRIT_SEQ>
											<pre__fill__3/>
											<TRAN_AMOUNT_DUE></TRAN_AMOUNT_DUE>
											<TRAN_INSURED_NAME></TRAN_INSURED_NAME>
										</PAYMENT_REC_ROW>
									</xsl:for-each>
								</xsl:when>
								<xsl:when test="$REQUEST_CODE = 'RCVCBPAYDL1Rq'">
									<xsl:for-each select="list/PayLoad[SUCCESS_INDIC='D']">
										<PAYMENT_REC_ROW>
											<TRAN_CASH_WRIT_DATE><xsl:value-of select="WSCASHRECDTE"/></TRAN_CASH_WRIT_DATE>
											<TRAN_CASH_RCD_SEQ><xsl:value-of select="WSCASHRECSEQ"/></TRAN_CASH_RCD_SEQ>
											<TRAN_CUST_NBR><xsl:value-of select="WSCUSTNBR"/></TRAN_CUST_NBR>
											<TRAN_POL_SYM></TRAN_POL_SYM>
											<TRAN_POL_NBR></TRAN_POL_NBR>
											<TRAN_POL_MOD></TRAN_POL_MOD>
											<pre__fill__2/>
											<TRAN_PAYMENT_AMT><xsl:value-of select="WSPAYMENTAMT" /></TRAN_PAYMENT_AMT>
											<TRAN_CHECK_NBR><xsl:value-of select="WSCHECKNBR" /></TRAN_CHECK_NBR>
											<TRAN_MASTER_CO><xsl:value-of select="WSMASTERCO" /></TRAN_MASTER_CO>
											<TRAN_LOCATION><xsl:value-of select="WSLOCATION" /></TRAN_LOCATION>
											<TRAN_RCPT_TYPE><xsl:value-of select="WSRCPTTYPE" /></TRAN_RCPT_TYPE>
											<TRAN_RCPT_DESC/>
											<TRAN_MODE_CODE></TRAN_MODE_CODE>
											<TRAN_SUCCESS_INDIC></TRAN_SUCCESS_INDIC>
											<TRAN_ERROR_MSG></TRAN_ERROR_MSG>
											<TRAN_STATUS><xsl:value-of select="WSSTATUS"/></TRAN_STATUS>
											<TRAN_OVERPAY_IND><xsl:value-of select="WSOVERPAYIND"/></TRAN_OVERPAY_IND>
											<TRAN_USERDATE_03><xsl:value-of select="WSUSRDTE03" /></TRAN_USERDATE_03>
											<TRAN_ORIG_WRIT_DTE><xsl:value-of select="WSORIGWRTDTE"/></TRAN_ORIG_WRIT_DTE>
											<TRAN_ORIG_WRIT_SEQ><xsl:value-of select="WSORIGRECSEQ"/></TRAN_ORIG_WRIT_SEQ>
											<pre__fill__3/>
											<TRAN_AMOUNT_DUE></TRAN_AMOUNT_DUE>
											<TRAN_INSURED_NAME></TRAN_INSURED_NAME>
										</PAYMENT_REC_ROW>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<xsl:for-each select="list/PayLoad">
										<PAYMENT_REC_ROW>
											<xsl:choose>
												<xsl:when test="$REQUEST_CODE = 'RCVCBPAYADDRq'">
													<TRAN_CASH_WRIT_DATE></TRAN_CASH_WRIT_DATE>
													<TRAN_CASH_RCD_SEQ></TRAN_CASH_RCD_SEQ>									
													<TRAN_POL_SYM></TRAN_POL_SYM>
													<TRAN_POL_NBR></TRAN_POL_NBR>
													<TRAN_POL_MOD></TRAN_POL_MOD>		
													<TRAN_MODE_CODE></TRAN_MODE_CODE>
													<TRAN_SUCCESS_INDIC></TRAN_SUCCESS_INDIC>
													<TRAN_ERROR_MSG></TRAN_ERROR_MSG>
													<TRAN_STATUS><xsl:value-of select="WSSTATUS"/></TRAN_STATUS>
													<TRAN_OVERPAY_IND></TRAN_OVERPAY_IND>
													<TRAN_USERDATE_03></TRAN_USERDATE_03>
													<TRAN_ORIG_WRIT_DTE></TRAN_ORIG_WRIT_DTE>
													<TRAN_ORIG_WRIT_SEQ></TRAN_ORIG_WRIT_SEQ>
													<TRAN_AMOUNT_DUE></TRAN_AMOUNT_DUE>
													<TRAN_INSURED_NAME></TRAN_INSURED_NAME>													
													<pre__fill__2/>
													<TRAN_CUST_NBR><xsl:value-of select="WSCUSTNBR"/></TRAN_CUST_NBR>
													<TRAN_PAYMENT_AMT><xsl:value-of select="WSPAYMENTAMT" /></TRAN_PAYMENT_AMT>
													<TRAN_CHECK_NBR><xsl:value-of select="WSCHECKNBR" /></TRAN_CHECK_NBR>
													<TRAN_MASTER_CO><xsl:value-of select="WSMASTERCO" /></TRAN_MASTER_CO>
													<TRAN_LOCATION><xsl:value-of select="WSLOCATION" /></TRAN_LOCATION>
													<TRAN_RCPT_TYPE><xsl:value-of select="WSRCPTTYPE" /></TRAN_RCPT_TYPE>
													<TRAN_RCPT_DESC><xsl:value-of select="WSRCPTDESC" /></TRAN_RCPT_DESC>
													<TRAN_ERROR_MSG/>
													<TRAN_OVERPAY_IND/>
													<TRAN_USERDATE_03/>
													<pre__fill__3/>
												</xsl:when>
												<xsl:otherwise>													
													<TRAN_CASH_WRIT_DATE><xsl:value-of select="WSCASHRECDTE"/></TRAN_CASH_WRIT_DATE>
													<TRAN_CASH_RCD_SEQ><xsl:value-of select="WSCASHRECSEQ"/></TRAN_CASH_RCD_SEQ>
													<TRAN_CUST_NBR><xsl:value-of select="WSCUSTNBR"/></TRAN_CUST_NBR>
													<TRAN_POL_SYM></TRAN_POL_SYM>
													<TRAN_POL_NBR></TRAN_POL_NBR>
													<TRAN_POL_MOD></TRAN_POL_MOD>
													<pre__fill__2/>
													<TRAN_PAYMENT_AMT><xsl:value-of select="WSPAYMENTAMT" /></TRAN_PAYMENT_AMT>
													<TRAN_CHECK_NBR><xsl:value-of select="WSCHECKNBR" /></TRAN_CHECK_NBR>
													<TRAN_MASTER_CO><xsl:value-of select="WSMASTERCO" /></TRAN_MASTER_CO>
													<TRAN_LOCATION><xsl:value-of select="WSLOCATION" /></TRAN_LOCATION>
													<TRAN_RCPT_TYPE><xsl:value-of select="WSRCPTTYPE" /></TRAN_RCPT_TYPE>
													<TRAN_RCPT_DESC/>
													<TRAN_MODE_CODE></TRAN_MODE_CODE>
													<TRAN_SUCCESS_INDIC></TRAN_SUCCESS_INDIC>
													<TRAN_ERROR_MSG></TRAN_ERROR_MSG>
													<TRAN_STATUS><xsl:value-of select="WSSTATUS"/></TRAN_STATUS>
													<TRAN_OVERPAY_IND><xsl:value-of select="WSOVERPAYIND"/></TRAN_OVERPAY_IND>
													<TRAN_USERDATE_03><xsl:value-of select="WSUSRDTE03" /></TRAN_USERDATE_03>
													<TRAN_ORIG_WRIT_DTE><xsl:value-of select="WSORIGWRTDTE"/></TRAN_ORIG_WRIT_DTE>
													<TRAN_ORIG_WRIT_SEQ><xsl:value-of select="WSORIGRECSEQ"/></TRAN_ORIG_WRIT_SEQ>
													<TRAN_AMOUNT_DUE></TRAN_AMOUNT_DUE>
													<TRAN_INSURED_NAME></TRAN_INSURED_NAME>
													<pre__fill__3/>
											</xsl:otherwise>
										</xsl:choose>
										</PAYMENT_REC_ROW>
									</xsl:for-each>
							</xsl:otherwise>
						</xsl:choose>
						</RCV_PAYMT_INFO_ROW>
					</PayLoad>
				</RCVCBPAYRq>

			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>