<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="LOC">
			<xsl:value-of select="LOC"/>
		</xsl:variable>

		<xsl:variable name="MCO">
			<xsl:value-of select="MCO"/>
		</xsl:variable>
		
		<xsl:variable name="TOTAL_RECORD">
			<xsl:value-of select="TOTAL_RECORD"/>
		</xsl:variable>
		
		<xsl:variable name="REQUESTCODE">
			<xsl:value-of select="REQUESTCODE"/>
		</xsl:variable>
		
		<xsl:variable name="ACTION">
			<xsl:value-of select="action"/>
		</xsl:variable>
		
		<xsl:variable name="TARGET">
			<xsl:value-of select="target"/>
		</xsl:variable>

		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT4J</Name>
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
		<xsl:for-each select="list/PayLoad">
			<InsuranceSvcRq>
				<RqUID><xsl:value-of select="$REQUESTCODE" /></RqUID>
				<xsl:element name="{concat(substring($REQUESTCODE,0,string-length($REQUESTCODE)-4),'Rq')}">
					<PayLoad>
						<xsl:variable name="action">
   							<xsl:choose>
								<xsl:when test="GEN">
									<xsl:value-of select="$TARGET" />
								</xsl:when>
								<xsl:otherwise/>
							</xsl:choose>
						</xsl:variable>
						<KEY_LOCATION_COMPANY><xsl:value-of select="$LOC" /></KEY_LOCATION_COMPANY>
						<KEY_MASTER_COMPANY><xsl:value-of select="$MCO" /></KEY_MASTER_COMPANY>
						<TOTAL_RECORD><xsl:value-of select="$TOTAL_RECORD" /></TOTAL_RECORD>
						<action><xsl:value-of select="$ACTION" /></action>
						<Symbol><xsl:value-of select="Symbol" /></Symbol>
						<Policy><xsl:value-of select="Policy" /></Policy>
						<Module><xsl:value-of select="Module" /></Module>
						<Location><xsl:value-of select="Location" /></Location>
						<MasterCo><xsl:value-of select="MasterCo" /></MasterCo>
						<TransDate><xsl:value-of select="TransDate" /></TransDate>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
			</xsl:for-each>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>