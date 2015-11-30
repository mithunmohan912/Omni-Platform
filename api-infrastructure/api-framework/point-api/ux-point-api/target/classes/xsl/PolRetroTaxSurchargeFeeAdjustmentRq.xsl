<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
		<xsl:variable name="REQUESTCODE">
			<xsl:value-of select="REQUESTCODE" />
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
							<xsl:call-template name="cvtToUpper">
								<xsl:with-param name="user" select="User" />
							</xsl:call-template>
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
				<InsuranceSvcRq>
					<RqUID>
						<xsl:value-of select="$REQUESTCODE" />
					</RqUID>
					<xsl:element name="{concat(substring($REQUESTCODE,0,9),'Rq')}">
						<PayLoad>
							<START_XML>
								<PROCESSING_INFO />
								<POLICY_KEY>
									<KEY_POL_LOC><xsl:value-of select="KEY_POL_LOC"/></KEY_POL_LOC>
									<KEY_POL_MCO><xsl:value-of select="KEY_POL_MCO"/></KEY_POL_MCO>
									<KEY_POL_PCO><xsl:value-of select="KEY_POL_PCO"/></KEY_POL_PCO>
									<KEY_POL_SYMBOL><xsl:value-of select="KEY_POL_SYMBOL"/></KEY_POL_SYMBOL>
									<KEY_POL_NUMBER><xsl:value-of select="KEY_POL_NUMBER"/></KEY_POL_NUMBER>
									<KEY_POL_MODULE><xsl:value-of select="KEY_POL_MODULE"/></KEY_POL_MODULE>
									<KEY_POL_LOB><xsl:value-of select="KEY_POL_LOB"/></KEY_POL_LOB>
								</POLICY_KEY>
								<POLICY_INFO>
									<POLICY_INSURED_NAME><xsl:value-of select="POLICY_INSURED_NAME"/></POLICY_INSURED_NAME>
									<POLICY_EFFECTIVE_DATE><xsl:value-of select="POLICY_EFFECTIVE_DATE"/></POLICY_EFFECTIVE_DATE>
									<POLICY_EXPIRATION_DATE><xsl:value-of select="POLICY_EXPIRATION_DATE"/></POLICY_EXPIRATION_DATE>
									<POLICY_RATING_METHOD><xsl:value-of select="POLICY_RATING_METHOD"/></POLICY_RATING_METHOD>
									<POLICY_CUSTOMER_NUMBER />
								</POLICY_INFO>
								<xsl:for-each select="list/PayLoad">
									<PREMIUM_FIELDS>
										<PREM_STATE><xsl:value-of select="STATE"/></PREM_STATE>
										<PREM_MAJOR_PERIL><xsl:value-of select="PREM_MAJOR_PERIL"/></PREM_MAJOR_PERIL>
										<PREM_CLASS_NUMBER><xsl:value-of select="PREM_CLASS_NUMBER"/></PREM_CLASS_NUMBER>
										<PREM_RATE_FACTOR><xsl:value-of select="PREM_RATE_FACTOR"/></PREM_RATE_FACTOR>
										<PREM_MAJOR_PERIL_AMOUNT><xsl:value-of select="PREM_MAJOR_PERIL_AMOUNT"/></PREM_MAJOR_PERIL_AMOUNT>
										<REQUESTCODE><xsl:value-of select="$REQUESTCODE"/></REQUESTCODE>
										<TRANSEQ>0</TRANSEQ>
										<itemSeq><xsl:value-of select="itemSeq"/></itemSeq>
									</PREMIUM_FIELDS>
								</xsl:for-each>
							</START_XML>
						</PayLoad>
					</xsl:element>
				</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
	<xsl:template name="cvtToUpper">
		<xsl:param name="user" />
		<xsl:value-of
			select="translate($user, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</xsl:template>

</xsl:stylesheet>