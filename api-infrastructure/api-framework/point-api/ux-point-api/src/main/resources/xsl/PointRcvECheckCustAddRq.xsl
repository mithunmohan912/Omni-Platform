<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

   		<xsl:variable name="TRAN_CUST_NBR">
        	<xsl:value-of select="TRAN_CUST_NBR"/>
   		</xsl:variable>
   		   		
   		<xsl:variable name="REQUEST_CODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="NO_PAYMENT">
        	<xsl:value-of select="noPayment"/>
   		</xsl:variable>

		
		<POINTXML>

			<SignonRq>
				<ClientApp>
					<Name>PT</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:value-of select="User" />
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
				<RCVECHKCRq>
					<PayLoad>
						<ACH_ECHK_INFO_ROW>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE/>
							</PROCESSING_INFO>
							<BANKACCT_REC_ROW>
								<ACCT_BANK_NAME><xsl:value-of select="ACCT_BANK_NAME"/></ACCT_BANK_NAME>
								<ACCT_ACCOUNT_NAME><xsl:value-of select="ACCT_ACCOUNT_NAME"/></ACCT_ACCOUNT_NAME>
								<ACCT_TRANSIT_ROUTING_NO><xsl:value-of select="ACCT_TRANSIT_ROUTING_NO"/></ACCT_TRANSIT_ROUTING_NO>
								<ACCT_ACCOUNT_NUMBER><xsl:value-of select="ACCT_ACCOUNT_NUMBER"/></ACCT_ACCOUNT_NUMBER>
								<ACCT_TRANSACTION_CODE><xsl:value-of select="ACCT_TRANSACTION_CODE"/></ACCT_TRANSACTION_CODE>
								<ACCT_CHECK_NBR><xsl:value-of select="ACCT_CHECK_NBR"/></ACCT_CHECK_NBR>
								<ACCT_CHECK_DTE><xsl:value-of select="ACCT_CHECK_DTE"/></ACCT_CHECK_DTE>
								<ACCT_MEMO_COMMENT><xsl:value-of select="ACCT_MEMO_COMMENT"/></ACCT_MEMO_COMMENT>
								<ACCT_PAYMENT_AMT><xsl:value-of select="TRAN_PAYMENT_AMT"/></ACCT_PAYMENT_AMT>
							</BANKACCT_REC_ROW>
							<xsl:choose>
								<xsl:when test="$NO_PAYMENT = 'Y'">
									<PAYMENT_REC_ROW>
										<TRAN_CUST_NBR><xsl:value-of select="$TRAN_CUST_NBR" /></TRAN_CUST_NBR>
										<TRAN_LOCATION><xsl:value-of select="TRAN_LOCATION" /></TRAN_LOCATION>
										<TRAN_MASTER_CO><xsl:value-of select="TRAN_MASTER_CO" /></TRAN_MASTER_CO>
										<TRAN_POL_SYM></TRAN_POL_SYM>
										<TRAN_POL_NBR></TRAN_POL_NBR>
										<TRAN_POL_MOD></TRAN_POL_MOD>
										<TRAN_PAYMENT_AMT></TRAN_PAYMENT_AMT>
									</PAYMENT_REC_ROW>
								</xsl:when>
								<xsl:otherwise>
									<xsl:for-each select="list/PayLoad[WSPAYAMOUNT != '']">
										<PAYMENT_REC_ROW>
											<TRAN_CUST_NBR><xsl:value-of select="$TRAN_CUST_NBR" /></TRAN_CUST_NBR>
											<TRAN_LOCATION><xsl:value-of select="WSLOCATION" /></TRAN_LOCATION>
											<TRAN_MASTER_CO><xsl:value-of select="WSMASTER" /></TRAN_MASTER_CO>
											<TRAN_POL_SYM><xsl:value-of select="WSSYMBOL" /></TRAN_POL_SYM>
											<TRAN_POL_NBR><xsl:value-of select="WSPOLICY" /></TRAN_POL_NBR>
											<TRAN_POL_MOD><xsl:value-of select="WSMODULE" /></TRAN_POL_MOD>
											<TRAN_PAYMENT_AMT><xsl:value-of select="WSPAYAMOUNT" /></TRAN_PAYMENT_AMT>
										</PAYMENT_REC_ROW>
									</xsl:for-each>
								</xsl:otherwise>
							</xsl:choose>
						</ACH_ECHK_INFO_ROW>
					</PayLoad>
				</RCVECHKCRq>

			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>