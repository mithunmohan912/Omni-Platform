<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
   		   		
   		<xsl:variable name="REQUEST_CODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>
       
       <xsl:variable name="MCO">
        	<xsl:value-of select="MCO"/>
   		</xsl:variable>
       
       <xsl:variable name="LOC">
        	<xsl:value-of select="LOC"/>
   		</xsl:variable>
       
       <xsl:variable name="SYMBOL">
        	<xsl:value-of select="SYMBOL"/>
   		</xsl:variable>
       
       <xsl:variable name="POLICYNUM">
        	<xsl:value-of select="POLICYNUM"/>
   		</xsl:variable>
       
       <xsl:variable name="MODULE">
        	<xsl:value-of select="MODULE"/>
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
				<RCVADACTRq>
					<PayLoad>
						<ADJ_NEXT_ACTIVITY_ROW>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE/>
								<PROC_EFFECTIVE_DATE/>
								<PROC_LDA_SELECT/>
                                <PROC_LDA_SYSTEM_DATE_OVERRIDE/>
                                <PROC_LDA_ACCTG_DATE/>
                                <PROC_LDA_TYPE_ACTIVITY/>
                                <PROC_SUCCESS_INDIC/>
                                <PROC_SPEC_USE1/>
                                <PROC_SPEC_USE2/>
                                <PROC_SPEC_USE3/>
                                <PROC_SPEC_USE4/>
                                <PROC_SPEC_USE5/>								
							</PROCESSING_INFO>
							<xsl:for-each select="list/PayLoad">
								<ADJ_NEXT_INFO>
									 <KEY_LOCATION_COMPANY><xsl:value-of select="$LOC"/></KEY_LOCATION_COMPANY>
                                     <KEY_MASTER_COMPANY><xsl:value-of select="$MCO"/></KEY_MASTER_COMPANY>
                                     <KEY_SYMBOL><xsl:value-of select="$SYMBOL"/></KEY_SYMBOL>
									 <KEY_POLICY_NUMBER><xsl:value-of select="$POLICYNUM"/></KEY_POLICY_NUMBER>
                                     <KEY_MODULE><xsl:value-of select="$MODULE"/></KEY_MODULE>
                                     <KEY_INSTALLMENT_NUM><xsl:value-of select="WSINST"/></KEY_INSTALLMENT_NUM>
                                     <ADJ_INST_NUM><xsl:value-of select="WSINST"/></ADJ_INST_NUM>
                                     <ADJ_DUE_DATE><xsl:value-of select="WSDUEDATE"/></ADJ_DUE_DATE>
                                     <ADJ_INSTALLMENT_BAL><xsl:value-of select="WSINSTBAL"/></ADJ_INSTALLMENT_BAL>
                                     <ADJ_SCHEDULED_DATE><xsl:value-of select="WSDUEDATE"/></ADJ_SCHEDULED_DATE>
                                     <ADJ_SCHEDULED_NOTICE><xsl:value-of select="WSSCDACT"/></ADJ_SCHEDULED_NOTICE>
                                     <ADJ_SCHEDULED_REASON><xsl:value-of select="WSSCDACT"/></ADJ_SCHEDULED_REASON>
                                     <ADJ_ADJUSTED_DATE><xsl:value-of select="WSADJDATE"/></ADJ_ADJUSTED_DATE>
                                     <ADJ_ADJUSTED_NOTICE><xsl:value-of select="WSADJACT"/></ADJ_ADJUSTED_NOTICE>
                                     <ADJ_ADJUSTED_REASON/>
                                     <REC_TYPE><xsl:value-of select="WSRECORDTYPE"/></REC_TYPE>
                                     <TRAN_PREM_SUCCESS_INDIC/>
                                     <TRAN_PREM_ERROR_MSG/>
                                     </ADJ_NEXT_INFO>
							</xsl:for-each>
						</ADJ_NEXT_ACTIVITY_ROW>
					</PayLoad>
				</RCVADACTRq>

			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>