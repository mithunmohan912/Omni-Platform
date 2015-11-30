<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />
	<xsl:template match="PayLoad">
		<xsl:variable name="ClientCode">
        	<xsl:call-template name="GetClientCode"/>
   		</xsl:variable>
		<xsl:variable name="RqCode">
        	<xsl:call-template name="RefactorRqCode"/>
   		</xsl:variable>
   		<xsl:variable name="calltype">
        	<xsl:value-of select="method"/>
   		</xsl:variable>
		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name><xsl:value-of select="$ClientCode" /></Name>
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
			<InsuranceSvcRq>
				<RqUID>
					<xsl:value-of select="$RqCode" />
				</RqUID>

				<xsl:element name="{concat(substring($RqCode,0,string-length($RqCode)-4),'Rq')}">
					<PayLoad>
						<xsl:for-each select="*">
						<xsl:choose>
						<xsl:when test="local-name()='KEY' and not($calltype='GET')">
						</xsl:when>
						<xsl:otherwise>
							<xsl:element name="{local-name()}">
								<xsl:value-of select="." />
							</xsl:element>
							</xsl:otherwise>
						</xsl:choose>
						</xsl:for-each>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
	<xsl:template name="GetClientCode">
		<xsl:choose>
			<xsl:when test="REQUESTCODE = 'MINRTOVRADDRq' or REQUESTCODE = 'MINRTOVRINQRq' or REQUESTCODE = 'MINRTOVRCHGRq' or REQUESTCODE = 'MINRTOVRDFTRq'">
				<xsl:value-of select="'PT4J'" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="'PT'" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="RefactorRqCode">
		<xsl:choose>
			<xsl:when test="method='GET'">
				<xsl:choose>
					<xsl:when test="REQUESTCODE = 'QUTPROCSISRRq' or REQUESTCODE = 'QUTPROCSISSRq'">
						<xsl:value-of select="'CPPBCONTISSRq'" />
					</xsl:when>
					<xsl:when test="REQUESTCODE = 'QUTPROCSIBIRq'">
						<xsl:value-of select="'CPPBCONTIBIRq'" />
					</xsl:when>
					<xsl:when test="REQUESTCODE = 'QUTPROCSCPYRq' or REQUESTCODE = 'QUTPROCSCRSRq' or REQUESTCODE = 'QUTPROCSXPYRq' or REQUESTCODE = 'QUTPROCSCNBRq' or REQUESTCODE = 'QUTPROCSCRBRq' or REQUESTCODE = 'QUTPROCSXNBRq' or REQUESTCODE = 'QUTPROCSXRBRq'">
						<xsl:value-of select="'CPPBCONTQUTRq'" />
					</xsl:when>
				   	<xsl:when test="contains(REQUESTCODE, 'ADDRq')">
						<xsl:value-of select="concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'DFTRq')" />
					</xsl:when>
					<xsl:when test="contains(REQUESTCODE, 'CHGRq') or contains(REQUESTCODE,'DLTRq')">
						<xsl:value-of select="concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'INQRq')" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="REQUESTCODE" />
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="REQUESTCODE" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>