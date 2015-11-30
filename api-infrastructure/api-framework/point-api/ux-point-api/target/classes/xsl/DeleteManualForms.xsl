<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
		
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
				<RqUID><xsl:value-of select="REQUESTCODE" /></RqUID>
				<xsl:element name="{concat(substring(REQUESTCODE,0,9),'Rq')}">
					<PayLoad>
						<ALR_IMPLEMENTED_RECORD_ROW>
							<ALR_KEY>
								<KEY_LOCATION_COMPANY><xsl:value-of select="KEY_LOCATION"/></KEY_LOCATION_COMPANY>
								<KEY_MASTER_COMPANY><xsl:value-of select="KEY_MASTER_COMPANY"/></KEY_MASTER_COMPANY>
								<KEY_SYMBOL><xsl:value-of select="KEY_SYMBOL"/></KEY_SYMBOL>
								<KEY_POLICY_NUMBER><xsl:value-of select="KEY_POLICY_NUMBER"/></KEY_POLICY_NUMBER>
								<KEY_MODULE><xsl:value-of select="KEY_MODULE"/></KEY_MODULE>
								<KEY_INSURANCE_LINE><xsl:value-of select="KEY_INSURANCE_LINE"/></KEY_INSURANCE_LINE>
								<KEY_FORM_SEQUENCE_NUMBER><xsl:value-of select="KEY_FORM_SEQUENCE_NUMBER"/></KEY_FORM_SEQUENCE_NUMBER>
								<KEY_RECORD_STATUS><xsl:value-of select="KEY_RECORD_STATUS"/></KEY_RECORD_STATUS>
							</ALR_KEY>
							<ALR_COMMON_FIELDS>
								<COM_REQUEST_CODE>CPPFORMSDLTRq</COM_REQUEST_CODE>
								<ACTION_CODE><xsl:value-of select="ACTION_CODE"/></ACTION_CODE>
								<PROC_TRANSACTION_TYPE><xsl:value-of select="PROC_TRANSACTION_TYPE"/></PROC_TRANSACTION_TYPE>
								<PROC_EFFECTIVE_DATE><xsl:value-of select="PROC_EFFECTIVE_DATE"/></PROC_EFFECTIVE_DATE>
								<BC_LINE_OF_BUSINESS><xsl:value-of select="BC_LINE_OF_BUSINESS"/></BC_LINE_OF_BUSINESS>
								<BC_POLICY_COMPANY><xsl:value-of select="BC_POLICY_COMPANY"/></BC_POLICY_COMPANY>
								<BC_STATE><xsl:value-of select="BC_STATE"/></BC_STATE>
							</ALR_COMMON_FIELDS>
						</ALR_IMPLEMENTED_RECORD_ROW>
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