<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="cashdate">
			<xsl:value-of select="cashdate"/>
		</xsl:variable>

		<xsl:variable name="origDate">
			<xsl:value-of select="origDate"/>
		</xsl:variable>

		<xsl:variable name="origSeq">
			<xsl:value-of select="origSeq"/>
		</xsl:variable>
		
		<xsl:variable name="checkamt">
        	<xsl:value-of select="checkAmt"/>
   		</xsl:variable>
   		
   		<xsl:variable name="suspamt">
        	<xsl:value-of select="suspAmt"/>
   		</xsl:variable>
   		   		
   		<xsl:variable name="MCO">
        	<xsl:value-of select="MCO"/>
   		</xsl:variable>
   		
	    <xsl:variable name="agency">
            <xsl:value-of select="agency"/>
   	    </xsl:variable>   
   	    
   	    <xsl:variable name="check">
            <xsl:value-of select="check"/>
   	    </xsl:variable> 
   	    
   	    <xsl:variable name="checkDate">
            <xsl:value-of select="checkDate"/>
   	    </xsl:variable> 
   	    
   	     <xsl:variable name="recTyp">
            <xsl:value-of select="recTyp"/>
   	    </xsl:variable> 
   	    
   	    <xsl:variable name="LOC">
            <xsl:value-of select="LOC"/>
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
			</SignonRq>

			<InsuranceSvcRq>

				<RqUID><xsl:value-of select="$REQUEST_CODE" /></RqUID>
				<RCVBBTFRRq>
					<PayLoad>
						<RCV_AB_TFR_INFO_ROW>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE/>
								<PROC_SUCCESS_INDIC/>
							</PROCESSING_INFO>
							<BATCH_ROW>	
							<BATCH_WRIT_DATE><xsl:value-of select="$cashdate" /></BATCH_WRIT_DATE>
		                    <BATCH_SEQ_NBR/>
		                    <BATCH_ORIG_DATE><xsl:value-of select="$origDate" /></BATCH_ORIG_DATE>
		                    <BATCH_ORIG_SEQ><xsl:value-of select="$origSeq" /></BATCH_ORIG_SEQ>
		                    <pre_fill_0>0</pre_fill_0>
		                    <BATCH_PAYT_AMT><xsl:value-of select="$checkamt" /></BATCH_PAYT_AMT>
		                    <pre_fill_1>0</pre_fill_1>
		                    <BATCH_AVL_AMT><xsl:value-of select="$suspamt" /></BATCH_AVL_AMT>
		                    <BATCH_MASTER_CO><xsl:value-of select="$MCO" /></BATCH_MASTER_CO>
		                    <BATCH_AGENCY><xsl:value-of select="$agency" /></BATCH_AGENCY>
		                    <BATCH_BANK_CDE/>
		                    <BATCH_CHECK_NBR><xsl:value-of select="$check" /></BATCH_CHECK_NBR>
		                    <BATCH_RCPT_TYPE><xsl:value-of select="$recTyp" /></BATCH_RCPT_TYPE>
		                    <BATCH_ACTY_TYPE/>
		                    <BATCH_NBR_ITEMS><xsl:value-of select="BATCH_NBR_ITEMS" /></BATCH_NBR_ITEMS>
		                    <BATCH_CASH_WRIT_DATE><xsl:value-of select="$cashdate" /></BATCH_CASH_WRIT_DATE>
		                    <BATCH_CASH_RCD_SEQ/>
		                    <BATCH_CHECK_DATE><xsl:value-of select="$checkDate" /></BATCH_CHECK_DATE>
							</BATCH_ROW>
							<xsl:for-each select="list/PayLoad">
								<PAYMENT_REC_ROW>
							        <TRAN_LOCATION><xsl:value-of select="$LOC"/></TRAN_LOCATION>
							        <TRAN_MASTER_CO><xsl:value-of select="WSBATMCO"/></TRAN_MASTER_CO>
							        <TRAN_AGENCY><xsl:value-of select="WSBATAGENCY"/></TRAN_AGENCY>
							        <pre_fill_2>0</pre_fill_2>
							        <TRAN_PAYMENT_AMT><xsl:value-of select="WSPAYMENTAMT"/></TRAN_PAYMENT_AMT>
							        <TRAN_COMMENTS><xsl:value-of select="WSCOMMENT"/></TRAN_COMMENTS>
							        <TRAN_SUCCESS_INDIC/>
							        <TRAN_ERROR_MSG/>
							        <TRAN_STATUS>1</TRAN_STATUS>   			
								</PAYMENT_REC_ROW>
							</xsl:for-each>
						</RCV_AB_TFR_INFO_ROW>
					</PayLoad>
				</RCVBBTFRRq>

			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>
