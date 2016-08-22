<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="origdte">
			<xsl:value-of select="origdte"/>
		</xsl:variable>
		
		<xsl:variable name="BATCH_WRIT_DATE">
			<xsl:value-of select="BATCH_WRIT_DATE"/>
		</xsl:variable>
		
		<xsl:variable name="BATCH_SEQ_NBR">
			<xsl:value-of select="BATCH_SEQ_NBR"/>
		</xsl:variable>
		
		<xsl:variable name="origseq">
			<xsl:value-of select="origseq"/>
		</xsl:variable>

		<xsl:variable name="cntrAmount">
			<xsl:value-of select="cntrAmount"/>
		</xsl:variable>
		
		<xsl:variable name="agencymco">
			<xsl:value-of select="agencymco"/>
		</xsl:variable>
		<xsl:variable name="broker">
			<xsl:value-of select="broker"/>
		</xsl:variable>
		
		<xsl:variable name="enteredAmt">
        	<xsl:value-of select="enteredAmt"/>
   		</xsl:variable>
   		
   		<xsl:variable name="avlAmount">
        	<xsl:value-of select="avlAmount"/>
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
				<xsl:element name="{concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'Rq')}">
					<PayLoad>	
					<xsl:element name="{concat('RCV_',substring(REQUESTCODE,4,2),'_POSTG_INFO_ROW')}">				
						
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE/>
								<PROC_SUCCESS_INDIC><xsl:value-of select="$PROC_SUCCESS_INDIC" /></PROC_SUCCESS_INDIC>
							</PROCESSING_INFO>
							<xsl:for-each select="list/PayLoad">
								<PAYMENT_REC_ROW>
									<xsl:choose>
										<xsl:when test="WSCASHWRITDATE = ''">
											<TRAN_CASH_WRIT_DATE>0000000</TRAN_CASH_WRIT_DATE>
											<TRAN_CASH_RCD_SEQ>000000</TRAN_CASH_RCD_SEQ>
										</xsl:when>
										<xsl:otherwise>
											<TRAN_CASH_WRIT_DATE><xsl:value-of select="WSCASHWRITDATE"/></TRAN_CASH_WRIT_DATE>
											<TRAN_CASH_RCD_SEQ><xsl:value-of select="WSCASHRCDSEQ"/></TRAN_CASH_RCD_SEQ>
										</xsl:otherwise>
										</xsl:choose>
									<TRAN_LOCATION><xsl:value-of select="WSLOCATION"/></TRAN_LOCATION>
									<TRAN_MASTER_CO><xsl:value-of select="WSMASTERCO"/></TRAN_MASTER_CO>
									<TRAN_AGENCY><xsl:value-of select="WSAGENCY"/></TRAN_AGENCY>
									<TRAN_SYMBOL><xsl:value-of select="WSSYMBOL"/></TRAN_SYMBOL>
									<TRAN_POLICY><xsl:value-of select="WSPOLICY"/></TRAN_POLICY>
									<TRAN_MODULE><xsl:value-of select="WSMODULE"/></TRAN_MODULE>
									
										<xsl:choose>
											<xsl:when test="WSINSTNBR = ''">
												<TRAN_INST_NBR>00</TRAN_INST_NBR>
												<TRAN_INST_SEQ>0000</TRAN_INST_SEQ>
											</xsl:when>
											<xsl:otherwise>
												<TRAN_INST_NBR><xsl:value-of select="WSINSTNBR"/></TRAN_INST_NBR>
												<TRAN_INST_SEQ><xsl:value-of select="WSINSTSEQ"/></TRAN_INST_SEQ>
											</xsl:otherwise>
										</xsl:choose>
									<TRAN_PAYMENT_AMT><xsl:value-of select="WSPOSTAMT"/></TRAN_PAYMENT_AMT>
									<TRAN_COMMENTS><xsl:value-of select="WSCOMMENT"/></TRAN_COMMENTS>
									<TRAN_SUCCESS_INDIC/>
									<TRAN_ERROR_MSG/>
									<TRAN_STATUS/>
								</PAYMENT_REC_ROW>
							</xsl:for-each>
							<PAYMENT_REC_ROW>
								<TRAN_CASH_WRIT_DATE>9999999</TRAN_CASH_WRIT_DATE>
								<TRAN_CASH_RCD_SEQ>999999</TRAN_CASH_RCD_SEQ>
								<TRAN_COMMENTS>TRAILER REC</TRAN_COMMENTS>
							</PAYMENT_REC_ROW>
							<BATCH_ROW>
								<BATCH_WRIT_DATE><xsl:value-of select="$BATCH_WRIT_DATE" /></BATCH_WRIT_DATE>
								<BATCH_SEQ_NBR><xsl:value-of select="$BATCH_SEQ_NBR" /></BATCH_SEQ_NBR>
								<BATCH_CNTL_AMT><xsl:value-of select="$cntrAmount" /></BATCH_CNTL_AMT>
								<BATCH_ENT_AMT><xsl:value-of select="$enteredAmt" /></BATCH_ENT_AMT>
								<BATCH_AVL_AMT><xsl:value-of select="$avlAmount" /></BATCH_AVL_AMT>
								<BATCH_MASTER_CO><xsl:value-of select="$agencymco" /></BATCH_MASTER_CO>
								<BATCH_AGENCY><xsl:value-of select="$broker" /></BATCH_AGENCY>
								<BATCH_STMT_PER/>
								<BATCH_ORIG_WRIT_DATE><xsl:value-of select="$origdte" /></BATCH_ORIG_WRIT_DATE>
								<BATCH_ORIG_RCD_SEQ><xsl:value-of select="$origseq" /></BATCH_ORIG_RCD_SEQ>
								<BATCH_TYPE><xsl:value-of select="battyp" /></BATCH_TYPE>
								<BATCH_RF_BANK_CODE><xsl:value-of select="BANK_CODE" /></BATCH_RF_BANK_CODE>
								<BATCH_RF_CHECK_NBR><xsl:value-of select="CHECK_NUMBER" /></BATCH_RF_CHECK_NBR>
								<BATCH_RF_CHECK_DATE><xsl:value-of select="CHECK_DATE" /></BATCH_RF_CHECK_DATE>
							</BATCH_ROW>
						</xsl:element>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>
		
	</xsl:template>
</xsl:stylesheet>
