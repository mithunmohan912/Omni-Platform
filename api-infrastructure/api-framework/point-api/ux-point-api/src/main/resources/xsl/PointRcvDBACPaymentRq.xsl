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
   		<xsl:variable name="PROC_SUCCESS_INDIC">
        	<xsl:value-of select="PROC_SUCCESS_INDIC"/>
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
				<RqUID><xsl:value-of select="$REQUEST_CODE" /></RqUID>
				<RCVACPAYRq>
					<PayLoad>
					<RCV_AB_PAYMT_INFO_ROW>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE/>
								<PROC_SUCCESS_INDIC><xsl:value-of select="$PROC_SUCCESS_INDIC" /></PROC_SUCCESS_INDIC>
							</PROCESSING_INFO>
							<BATCH_ROW>
								<BATCH_WRIT_DATE><xsl:value-of select="$BATDTE" /></BATCH_WRIT_DATE>
								<BATCH_SEQ_NBR><xsl:value-of select="$BATSEQ" /></BATCH_SEQ_NBR>
								<BATCH_CNTL_AMT><xsl:value-of select="$BATCTL" /></BATCH_CNTL_AMT>
								<BATCH_ENT_AMT><xsl:value-of select="$BATENT" /></BATCH_ENT_AMT>
								<BATCH_ITEM_COUNT><xsl:value-of select="$BATCNT" /></BATCH_ITEM_COUNT>
							</BATCH_ROW>
							<xsl:choose>
								<xsl:when test="$PROC_SUCCESS_INDIC = 'D'">
									<xsl:for-each select="list/PayLoad[SUCCESS_INDIC='D']">
										<PAYMENT_REC_ROW>
											<xsl:choose>
												<xsl:when test="$REQUEST_CODE = 'RCVACPAYCHGRq'">
													<TRAN_CASH_WRIT_DATE><xsl:value-of select="WSCASHRECDTE" /></TRAN_CASH_WRIT_DATE>
													<TRAN_CASH_RCD_SEQ><xsl:value-of select="WSCASHRECSEQ" /></TRAN_CASH_RCD_SEQ>
													<TRAN_RCPT_DESC/>
													<TRAN_COMMENTS/>
												 </xsl:when>
									   			 <xsl:otherwise>
												    <TRAN_CASH_WRIT_DATE/>
												    <TRAN_CASH_RCD_SEQ/>
												    <TRAN_RCPT_DESC><xsl:value-of select="WSRCPTDESC" /></TRAN_RCPT_DESC>
													<TRAN_COMMENTS><xsl:value-of select="WSCOMMENT" /></TRAN_COMMENTS>
												</xsl:otherwise>
											</xsl:choose>
											<TRAN_PAYBLS_BANK_CDE/>
											<TRAN_LOCATION><xsl:value-of select="WSLOCATION" /></TRAN_LOCATION>
											<TRAN_MASTER_CO><xsl:value-of select="WSMASTERCO" /></TRAN_MASTER_CO>
											<TRAN_AGNY_NBR><xsl:value-of select="WSAGENCYNBR" /></TRAN_AGNY_NBR>
											<TRAN_PAYMENT_AMT><xsl:value-of select="WSPAYMENTAMT" /></TRAN_PAYMENT_AMT>
											<TRAN_CHECK_NBR><xsl:value-of select="WSCHECKNBR" /></TRAN_CHECK_NBR>
											<TRAN_RCPT_TYPE><xsl:value-of select="WSRCPTTYPE" /></TRAN_RCPT_TYPE>
											<TRAN_SUCCESS_INDIC/>
											<TRAN_ERROR_MSG/>
											<TRAN_STATUS/>
										</PAYMENT_REC_ROW>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<xsl:for-each select="list/PayLoad">
										<PAYMENT_REC_ROW>
											<xsl:choose>
												<xsl:when test="$REQUEST_CODE = 'RCVACPAYCHGRq'">
													<TRAN_CASH_WRIT_DATE><xsl:value-of select="WSCASHRECDTE" /></TRAN_CASH_WRIT_DATE>
													<TRAN_CASH_RCD_SEQ><xsl:value-of select="WSCASHRECSEQ" /></TRAN_CASH_RCD_SEQ>
													<TRAN_RCPT_DESC/>
													<TRAN_COMMENTS/>
												</xsl:when>
											    <xsl:otherwise>
												    <TRAN_CASH_WRIT_DATE/>
												    <TRAN_CASH_RCD_SEQ/>
												    <TRAN_RCPT_DESC><xsl:value-of select="WSRCPTDESC" /></TRAN_RCPT_DESC>
													<TRAN_COMMENTS><xsl:value-of select="WSCOMMENT" /></TRAN_COMMENTS>
												</xsl:otherwise>
											</xsl:choose>
											<TRAN_PAYBLS_BANK_CDE/>
											<TRAN_LOCATION><xsl:value-of select="WSLOCATION" /></TRAN_LOCATION>
											<TRAN_MASTER_CO><xsl:value-of select="WSMASTERCO" /></TRAN_MASTER_CO>
											<TRAN_AGNY_NBR><xsl:value-of select="WSAGENCYNBR" /></TRAN_AGNY_NBR>
											<TRAN_PAYMENT_AMT><xsl:value-of select="WSPAYMENTAMT" /></TRAN_PAYMENT_AMT>
											<TRAN_CHECK_NBR><xsl:value-of select="WSCHECKNBR" /></TRAN_CHECK_NBR>
											<TRAN_RCPT_TYPE><xsl:value-of select="WSRCPTTYPE" /></TRAN_RCPT_TYPE>
											<TRAN_SUCCESS_INDIC/>
											<TRAN_ERROR_MSG/>
											<TRAN_STATUS/>
										</PAYMENT_REC_ROW>
								</xsl:for-each>
							</xsl:otherwise>
						</xsl:choose>
					</RCV_AB_PAYMT_INFO_ROW>
					</PayLoad>
				</RCVACPAYRq>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>