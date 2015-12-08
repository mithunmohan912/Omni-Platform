<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
   		   		
   		<xsl:variable name="REQUEST_CODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>
       
       <xsl:variable name="MCO">
        	<xsl:value-of select="BC_KEY_MASTER_COMPANY"/>
   		</xsl:variable>
       
       <xsl:variable name="LOC">
        	<xsl:value-of select="BC_KEY_LOCATION"/>
   		</xsl:variable>
       
       <xsl:variable name="SYMBOL">
        	<xsl:value-of select="BC_KEY_SYMBOL"/>
   		</xsl:variable>
       
       <xsl:variable name="POLICYNUM">
        	<xsl:value-of select="BC_KEY_POLICY_NUMBER"/>
   		</xsl:variable>
       
       <xsl:variable name="MODULE">
        	<xsl:value-of select="BC_KEY_MODULE"/>
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
			</SignonRq>

			<InsuranceSvcRq>

				<RqUID><xsl:value-of select="$REQUEST_CODE" /></RqUID>
				<xsl:element name="{concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'Rq')}">
					<PayLoad>
						<END_INFO_ROW>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE/>
								<PROC_EFFECTIVE_DATE/>
								<PROC_PROGRAM_NAME/>
								<PROC_LDA_SELECT/>
								<PROC_PANEL_MODE/>
                                <PROC_LDA_SYSTEM_DATE_OVERRIDE/>
		                        <PROC_LDA_SECURITY/>
							    <PROC_LDA_ACCTG_DATE/>
								<PROC_LDA_TRANSSEQ/>
								<PROC_LDA_ISSUE_CODE/>
								<PROC_LDA_RENEWAL_MODULE/>
								<PROC_LDA_TYPE_ACTIVITY/>
								<PROC_LDA_CUR_REC_SET_STATUS/>
								<PROC_LDA_RECORD_IND/>
								<PROC_SUCCESS_INDIC/>							
							</PROCESSING_INFO>
							<KEY_INFO>
							<LOCATION><xsl:value-of select="$LOC"/></LOCATION>
							<MASTER_CO><xsl:value-of select="$MCO"/></MASTER_CO>
							<SYMBOL><xsl:value-of select="$SYMBOL"/></SYMBOL>
							<POL_NO><xsl:value-of select="$POLICYNUM"/></POL_NO>
							<POL_MODULE><xsl:value-of select="$MODULE"/></POL_MODULE>
							</KEY_INFO>
							<xsl:for-each select="list/PayLoad">
								      <END_REC_ROW>
								      <FORM_NUM><xsl:value-of select="FORMID"/></FORM_NUM>
		         					  <SPECIMEN><xsl:value-of select="SPECIMEN"/></SPECIMEN>
									  <FORM_DESC><xsl:value-of select="FORMDESC"/></FORM_DESC>
									  <ADDL_FORM_DESC><xsl:value-of select="AFORMDESC"/></ADDL_FORM_DESC>
		                              <PRT_SEQ_NUM><xsl:value-of select="PRINTSEQ"/></PRT_SEQ_NUM>
									  <FTR_SEQ_NUM><xsl:value-of select="FOOTERNUM"/></FTR_SEQ_NUM>
									  <STATE><xsl:value-of select="STATE"/></STATE>
									  <FORM_ID><xsl:value-of select="FORMID"/></FORM_ID>
		                              <FORM_SEQ><xsl:value-of select="FORMSEQ"/></FORM_SEQ>
							     	  <FORM_SEQ_IT><xsl:value-of select="FORMSEQIT"/></FORM_SEQ_IT>
		                              <TRAN_SUCCESS_INDIC/>
                                     </END_REC_ROW>
							</xsl:for-each>
						</END_INFO_ROW>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>