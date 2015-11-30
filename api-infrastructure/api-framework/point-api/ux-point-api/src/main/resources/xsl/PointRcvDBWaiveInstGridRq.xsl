<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
   		   		
   		<xsl:variable name="REQUEST_CODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>
       
       <xsl:variable name="MCO">
        	<xsl:value-of select="MASTERLOC"/>
   		</xsl:variable>
       
       <xsl:variable name="LOC">
        	<xsl:value-of select="LOC"/>
   		</xsl:variable>
       
       <xsl:variable name="SYMBOL">
        	<xsl:value-of select="SYMBOL"/>
   		</xsl:variable>
       
       <xsl:variable name="POLICYNUM">
        	<xsl:value-of select="POLNUM"/>
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
				<xsl:element name="{concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'Rq')}">
					<PayLoad>
						<RCV_REVERSE_WAIVE_INFO_ROW>
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
								<REVERSE_WAIVE_RECORD_ROW>
									 <TRAN_KEY_LOCCOMP><xsl:value-of select="$LOC"/></TRAN_KEY_LOCCOMP>
                                     <TRAN_KEY_MASCOMP><xsl:value-of select="$MCO"/></TRAN_KEY_MASCOMP>
                                     <TRAN_KEY_SYMBOL><xsl:value-of select="$SYMBOL"/></TRAN_KEY_SYMBOL>
									 <TRAN_KEY_POLNUM><xsl:value-of select="$POLICYNUM"/></TRAN_KEY_POLNUM>
                                     <TRAN_KEY_MODULE><xsl:value-of select="$MODULE"/></TRAN_KEY_MODULE>
                                     <TRAN_INST><xsl:value-of select="INST"/></TRAN_INST>
                                     <TRAN_PREM_TRANSACTION><xsl:value-of select="TRAN_PREM_TRANSACTION"/></TRAN_PREM_TRANSACTION>
		                             <TRAN_PREM_COLLECTABLE><xsl:value-of select="TRAN_PREM_COLLECTABLE"/></TRAN_PREM_COLLECTABLE>
		                             <TRAN_PREM_PAID><xsl:value-of select="TRAN_PREM_PAID"/></TRAN_PREM_PAID>
		                             <TRAN_PREM_WAIVED><xsl:value-of select="TRAN_PREM_WAIVED"/></TRAN_PREM_WAIVED>
		                             <TRAN_PREM_REVERSEAMT><xsl:value-of select="TRAN_PREM_REVERSEAMT"/></TRAN_PREM_REVERSEAMT>
		                             <TRAN_PREM_SUCCESS_INDIC><xsl:value-of select="TRAN_PREM_SUCCESS_INDIC"/></TRAN_PREM_SUCCESS_INDIC>
		                             <TRAN_PREM_ERROR_MSG><xsl:value-of select="TRAN_PREM_ERROR_MSG"/></TRAN_PREM_ERROR_MSG>
		                             <TRAN_SC_TRANSACTION><xsl:value-of select="TRAN_SC_TRANSACTION"/></TRAN_SC_TRANSACTION>
		                             <TRAN_SC_COLLECTABLE><xsl:value-of select="TRAN_SC_COLLECTABLE"/></TRAN_SC_COLLECTABLE>
		                             <TRAN_SC_PAID><xsl:value-of select="TRAN_SC_PAID"/></TRAN_SC_PAID>
		                             <TRAN_SC_WAIVED><xsl:value-of select="TRAN_SC_WAIVED"/></TRAN_SC_WAIVED>
		                             <TRAN_SC_REVERSEAMT><xsl:value-of select="TRAN_SC_REVERSEAMT"/></TRAN_SC_REVERSEAMT>
		                             <TRAN_SC_SUCCESS_INDIC><xsl:value-of select="TRAN_SC_SUCCESS_INDIC"/></TRAN_SC_SUCCESS_INDIC>
		                             <TRAN_SC_ERROR_MSG><xsl:value-of select="TRAN_SC_ERROR_MSG"/></TRAN_SC_ERROR_MSG>
		                             <TRAN_NSF_TRANSACTION><xsl:value-of select="TRAN_NSF_TRANSACTION"/></TRAN_NSF_TRANSACTION>
		                             <TRAN_NSF_COLLECTABLE><xsl:value-of select="TRAN_NSF_COLLECTABLE"/></TRAN_NSF_COLLECTABLE>
		                             <TRAN_NSF_PAID><xsl:value-of select="TRAN_NSF_PAID"/></TRAN_NSF_PAID>
		                             <TRAN_NSF_WAIVED><xsl:value-of select="TRAN_NSF_WAIVED"/></TRAN_NSF_WAIVED>
		                             <TRAN_NSF_REVERSEAMT><xsl:value-of select="TRAN_NSF_REVERSEAMT"/></TRAN_NSF_REVERSEAMT>
		                             <TRAN_NSF_SUCCESS_INDIC><xsl:value-of select="TRAN_NSF_SUCCESS_INDIC"/></TRAN_NSF_SUCCESS_INDIC>
		                             <TRAN_NSF_ERROR_MSG><xsl:value-of select="TRAN_NSF_ERROR_MSG"/></TRAN_NSF_ERROR_MSG>
		                             <TRAN_NONPREM_TRANSACTION><xsl:value-of select="TRAN_NONPREM_TRANSACTION"/></TRAN_NONPREM_TRANSACTION>
		                             <TRAN_NONPREM_COLLECTABLE><xsl:value-of select="TRAN_NONPREM_COLLECTABLE"/></TRAN_NONPREM_COLLECTABLE>
		                             <TRAN_NONPREM_PAID><xsl:value-of select="TRAN_NONPREM_PAID"/></TRAN_NONPREM_PAID>
		                             <TRAN_NONPREM_WAIVED><xsl:value-of select="TRAN_NONPREM_WAIVED"/></TRAN_NONPREM_WAIVED>
		                             <TRAN_NONPREM_REVERSEAMT><xsl:value-of select="TRAN_NONPREM_REVERSEAMT"/></TRAN_NONPREM_REVERSEAMT>
		                             <TRAN_NONPREM_SUCCESS_INDIC><xsl:value-of select="TRAN_NONPREM_SUCCESS_INDIC"/></TRAN_NONPREM_SUCCESS_INDIC>
		                             <TRAN_NONPREM_ERROR_MSG><xsl:value-of select="TRAN_NONPREM_ERROR_MSG"/></TRAN_NONPREM_ERROR_MSG>
		                             <TRAN_BALFWD_TRANSACTION><xsl:value-of select="TRAN_BALFWD_TRANSACTION"/></TRAN_BALFWD_TRANSACTION>
		                             <TRAN_BALFWD_COLLECTABLE><xsl:value-of select="TRAN_BALFWD_COLLECTABLE"/></TRAN_BALFWD_COLLECTABLE>
		                             <TRAN_BALFWD_PAID><xsl:value-of select="TRAN_BALFWD_PAID"/></TRAN_BALFWD_PAID>
		                             <TRAN_BALFWD_WAIVED><xsl:value-of select="TRAN_BALFWD_WAIVED"/></TRAN_BALFWD_WAIVED>
		                             <TRAN_BALFWD_REVERSEAMT><xsl:value-of select="TRAN_BALFWD_REVERSEAMT"/></TRAN_BALFWD_REVERSEAMT>
		                             <TRAN_BALFWD_SUCCESS_INDIC><xsl:value-of select="TRAN_BALFWD_SUCCESS_INDIC"/></TRAN_BALFWD_SUCCESS_INDIC>
		                             <TRAN_BALFWD_ERROR_MSG><xsl:value-of select="TRAN_BALFWD_ERROR_MSG"/></TRAN_BALFWD_ERROR_MSG>
		                             <TRAN_WAIVE_TOTAL><xsl:value-of select="TRAN_WAIVE_TOTAL"/></TRAN_WAIVE_TOTAL>
		                             <TRAN_REC_TOTAL><xsl:value-of select="TRAN_REC_TOTAL"/></TRAN_REC_TOTAL>
		                             <TRAN_PREM_WAIVE_TYPE><xsl:value-of select="TRAN_PREM_WAIVE_TYPE"/></TRAN_PREM_WAIVE_TYPE>
		                             <TRAN_PREM_COMM_CHARGE/>
                                     </REVERSE_WAIVE_RECORD_ROW>
							</xsl:for-each>
						</RCV_REVERSE_WAIVE_INFO_ROW>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>