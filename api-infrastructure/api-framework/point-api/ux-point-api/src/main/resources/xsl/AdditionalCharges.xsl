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
					<Name>PT4J</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:call-template name="cvtToUpper"><xsl:with-param name="user" select="User" /></xsl:call-template>
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
			<xsl:for-each select="list/PayLoad">
			<InsuranceSvcRq>
				<RqUID><xsl:value-of select="$REQUESTCODE"/></RqUID>
				<xsl:element name="{concat(substring($REQUESTCODE,0,9),'Rq')}">
					<PayLoad>
						<PolicyKey><xsl:value-of select="$PolicyKey"/></PolicyKey>
						<ChargeDescription><xsl:value-of select="DESCRIPTIONVALUE"/></ChargeDescription>
						<Trans0Stat><xsl:value-of select="TRANS0STAT"/></Trans0Stat>
						<CovSeq><xsl:value-of select="COVSEQ"/></CovSeq>
						<TranSeq><xsl:value-of select="TRANSEQ"/></TranSeq>
						<Status><xsl:value-of select="STATUS"/></Status>
						<ChargeType><xsl:value-of select="CHARGETYPE"/></ChargeType>
						<Amount><xsl:value-of select="USEFACTOR"/></Amount>
						<TOTAL_RECORD><xsl:value-of select="$TOTAL_RECORD"/></TOTAL_RECORD>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
			</xsl:for-each>
		</POINTXML>
		
	</xsl:template>
	<xsl:template name="cvtToUpper">
		<xsl:param name="user"/>
		<xsl:value-of select="translate($user, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</xsl:template>
	
</xsl:stylesheet>