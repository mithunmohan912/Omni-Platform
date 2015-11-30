<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
		<xsl:variable name="PolicyKey">
			<xsl:value-of select="PolicyKey"/>
		</xsl:variable>
		<xsl:variable name="TOTAL_RECORD">
			<xsl:value-of select="TOTAL_RECORD"/>
		</xsl:variable>
		<xsl:variable name="REQUESTCODE">
			<xsl:value-of select="REQUESTCODE"/>
		</xsl:variable>
		
		<!-- TODO: Auto-generated template -->
		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:call-template name="cvtToUpper"><xsl:with-param name="user" select="User" /></xsl:call-template>
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID><xsl:value-of select="$REQUESTCODE"/></RqUID>
				<xsl:element name="{concat(substring($REQUESTCODE,0,9),'Rq')}">
					<PayLoad>
						<ADJ_ROW>
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
									<ROW_COUNT><xsl:value-of select="ROW_COUNT"/></ROW_COUNT>
									<KEY_LOCATION_COMPANY><xsl:value-of select="KEY_LOCATION_COMPANY"/></KEY_LOCATION_COMPANY>
									<KEY_MASTER_COMPANY><xsl:value-of select="KEY_MASTER_COMPANY"/></KEY_MASTER_COMPANY>
									<KEY_SYMBOL><xsl:value-of select="KEY_SYMBOL"/></KEY_SYMBOL>
									<KEY_POLICY_NUMBER><xsl:value-of select="KEY_POLICY_NUMBER"/></KEY_POLICY_NUMBER>
									<KEY_MODULE><xsl:value-of select="KEY_MODULE"/></KEY_MODULE>
									<KEY_INSTALLMENT_NUM><xsl:value-of select="KEY_INSTALLMENT_NUM"/></KEY_INSTALLMENT_NUM>
									<KEY_TRANS_CODE><xsl:value-of select="KEY_TRANS_CODE"/></KEY_TRANS_CODE>
									<CUR_AMT><xsl:value-of select="CUR_AMT"/></CUR_AMT>
									<CUR_DUE_DATE><xsl:value-of select="CUR_DUE_DATE"/></CUR_DUE_DATE>
									<CUR_BILL_DATE><xsl:value-of select="CUR_BILL_DATE"/></CUR_BILL_DATE>
									<ADJ_AMT><xsl:value-of select="ADJ_AMT"/></ADJ_AMT>
									<ADJ_DUE_DATE><xsl:value-of select="ADJ_DUE_DATE"/></ADJ_DUE_DATE>
									<ADJ_BILL_DATE><xsl:value-of select="ADJ_BILL_DATE"/></ADJ_BILL_DATE>
									<ADJ_SCIND><xsl:value-of select="ADJ_SCIND"/></ADJ_SCIND>
									<ADJ_EFTIND><xsl:value-of select="ADJ_EFTIND"/></ADJ_EFTIND>
									<ADJ_CALCAMT><xsl:value-of select="ADJ_CALCAMT"/></ADJ_CALCAMT>
									<TRAN_PREM_SUCCESS_INDIC><xsl:value-of select="TRAN_PREM_SUCCESS_INDIC"/></TRAN_PREM_SUCCESS_INDIC>
									<TRAN_PREM_ERROR_MSG><xsl:value-of select="TRAN_PREM_ERROR_MSG"/></TRAN_PREM_ERROR_MSG>
								</ADJ_NEXT_INFO>
							</xsl:for-each>
						</ADJ_ROW>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>
		
	</xsl:template>
	<xsl:template name="cvtToUpper">
		<xsl:param name="user"/>
		<xsl:value-of select="translate($user, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</xsl:template>
	
</xsl:stylesheet>