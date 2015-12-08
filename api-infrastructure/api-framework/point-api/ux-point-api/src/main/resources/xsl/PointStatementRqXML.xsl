<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />
	<xsl:template match="PayLoad">

		<xsl:variable name="LOC">
			<xsl:value-of select="LOC"/>
		</xsl:variable>
		<xsl:variable name="MASTERLOC">
			<xsl:value-of select="MASTERLOC"/>
		</xsl:variable>
		<xsl:variable name="PCO">
			<xsl:value-of select="PCO"/>
		</xsl:variable>
		<xsl:variable name="LOB">
			<xsl:value-of select="LOB"/>
		</xsl:variable>
		<xsl:variable name="INSLINE">
			<xsl:value-of select="INSLINE"/>
		</xsl:variable>
		<xsl:variable name="SYMBOL">
			<xsl:value-of select="SYMBOL"/>
		</xsl:variable>
		<xsl:variable name="POLNUM">
			<xsl:value-of select="POLNUM"/>
		</xsl:variable>
		<xsl:variable name="MODULE">
			<xsl:value-of select="MODULE"/>
		</xsl:variable>
		<xsl:variable name="REQUESTCODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>
   		<xsl:variable name="TRANSMODE">
        	<xsl:value-of select="TRANSMODE"/>
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
				
				<xsl:for-each select ="*/PayLoad">
					<InsuranceSvcRq>
					  <RqUID><xsl:value-of select="$REQUESTCODE" /></RqUID>
					  <LOCATION_COMPANY><xsl:value-of select="$LOC" /></LOCATION_COMPANY>
					  <MASTER_COMPANY><xsl:value-of select="$MASTERLOC" /></MASTER_COMPANY>
					  <POLICY_COMPANY><xsl:value-of select="$PCO" /></POLICY_COMPANY>
					  <LINE_OF_BUSINESS><xsl:value-of select="$LOB" /></LINE_OF_BUSINESS>
					  <SYMBOL><xsl:value-of select="$SYMBOL" /></SYMBOL>
					  <POLICY_NUMBER><xsl:value-of select="$POLNUM" /></POLICY_NUMBER>
					  <MODULE><xsl:value-of select="$MODULE" /></MODULE>
					  <INSURANCELINE><xsl:value-of select="$INSLINE" /></INSURANCELINE>
					  <TYPE_ACTIVITY><xsl:value-of select="$TRANSMODE" /></TYPE_ACTIVITY>
					  <QUESTION_CODE><xsl:value-of select="QUESTIONCD" /></QUESTION_CODE>
					  <QUESTION_ANSWER><xsl:value-of select="RESPONSEIND" /></QUESTION_ANSWER>
					  <COVERAGE_CODE><xsl:value-of select="COVERAGECODE" /></COVERAGE_CODE>
					  <QUESTION_GROUP_CODE><xsl:value-of select="QUESTIONGROUPCD" /></QUESTION_GROUP_CODE>
					  <TEXTAREA_RemarksTxt><xsl:value-of select="TA1QUESTIONITEMFIELDVALUE" /></TEXTAREA_RemarksTxt>
					  <xsl:for-each select="list/PayLoad">
                        <xsl:copy-of select="./*"></xsl:copy-of>
                      </xsl:for-each>
					</InsuranceSvcRq>				
				</xsl:for-each>
				
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>