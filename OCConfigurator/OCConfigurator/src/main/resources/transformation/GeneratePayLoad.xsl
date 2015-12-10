<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="MessageName"/>
	<xsl:output omit-xml-declaration="yes" />
	<xsl:strip-space elements="*"/>
	<xsl:template match="/root">
	<!--ModelName=string&XMLMessage=string&MessageName=string&PayloadNode=string&EventName=string&ENVID=string-->
		<xsl:variable name="PayloadNodeName"><xsl:choose><xsl:when test="metadata/eventName='OnLoad'">POINTXML</xsl:when><xsl:otherwise>PayLoad</xsl:otherwise> </xsl:choose> </xsl:variable>
		<xsl:variable name="Output" >ModelName=Custom\<xsl:value-of select="concat(metadata/name,metadata/eventName)"></xsl:value-of>&#38;ENVID=&#38;MessageName=POINTXML&#38;PayloadNode=<xsl:value-of select="$PayloadNodeName"></xsl:value-of> &#38;EventName=<xsl:value-of select="concat(metadata/name,metadata/eventName)"></xsl:value-of>&#38;</xsl:variable>
		<xsl:variable name="XMLContent"></xsl:variable>
		<xsl:value-of select="$Output" disable-output-escaping="yes"/>XMLMessage=<xsl:choose><xsl:when test="metadata/eventName='OnSave'"><xsl:call-template name="SaveContentXML"><xsl:with-param name="MessageName" select="$MessageName"/> </xsl:call-template> </xsl:when> <xsl:when test="metadata/eventName='OnLoad'"><xsl:call-template name="LoadContentXML"></xsl:call-template> </xsl:when> </xsl:choose>
  </xsl:template>
	<xsl:template name="SaveContentXML" >
		<xsl:param name="MessageName"/>
		<POINTXML>  			<SignonRq> 				<ClientApp> 					<Name>PT</Name> 				</ClientApp> 				<SignonPswd> 					<CustId> 						<CustLoginId>LAB01</CustLoginId> 					</CustId> 				</SignonPswd> 				<rulesIntegrated>Y</rulesIntegrated> 				<com.csc_SessKey>E547A36A375D9E2329B9544C1539D5D1</com.csc_SessKey> 			</SignonRq> 			<InsuranceSvcRq> 				<RqUID></RqUID> 			<xsl:element name="{$MessageName}"> 					<PayLoad><xsl:if test="metadata/section/subsection/element"> 							<xsl:for-each select="metadata/section/subsection/element"> 								<xsl:variable name="type" select="type"/> 								<xsl:variable name="controlgroupExist" select="child::node()[name()='controlgroup'] != ''"/> 								<xsl:choose> 									<xsl:when test="not($controlgroupExist)"> 										<xsl:variable name="Tag" select="normalize-space(name)"></xsl:variable> 										<xsl:element name="{$Tag}" ></xsl:element> 										<!--<xsl:value-of select="normalize-space(name)"/>,--> 									</xsl:when> 									<xsl:otherwise> 										<xsl:variable name="Tag" select="normalize-space(name)"></xsl:variable> 										<xsl:element name="{$Tag}" ></xsl:element> 										<!--<xsl:value-of select="normalize-space(name)"/>,--> 										<xsl:for-each select="controlgroup"> 											<xsl:variable name="Tag2" select="normalize-space(name)"></xsl:variable> 											<xsl:element name="{$Tag2}" ></xsl:element> 											 										</xsl:for-each> 									</xsl:otherwise> 								</xsl:choose> 							</xsl:for-each> 						</xsl:if>  						</PayLoad> 				</xsl:element> 			</InsuranceSvcRq> 		</POINTXML>
	</xsl:template>
	<xsl:template name="LoadContentXML" >
		<xsl:if test="metadata/eventName='OnSave'"></xsl:if>
		<POINTXML><xsl:if test="metadata/section/subsection/element"> 							<xsl:for-each select="metadata/section/subsection/element"> 								<xsl:variable name="type" select="type"/> 								<xsl:variable name="controlgroupExist" select="child::node()[name()='controlgroup'] != ''"/> 								<xsl:choose> 									<xsl:when test="not($controlgroupExist)"> 										<xsl:variable name="Tag" select="normalize-space(name)"></xsl:variable> 										<xsl:element name="{$Tag}" ></xsl:element> 										<!--<xsl:value-of select="normalize-space(name)"/>,--> 									</xsl:when> 									<xsl:otherwise> 										<xsl:variable name="Tag" select="normalize-space(name)"></xsl:variable> 										<xsl:element name="{$Tag}" ></xsl:element> 										<!--<xsl:value-of select="normalize-space(name)"/>,--> 										<xsl:for-each select="controlgroup"> 											<xsl:variable name="Tag2" select="normalize-space(name)"></xsl:variable> 											<xsl:element name="{$Tag2}" ></xsl:element> 											<!--<xsl:value-of select="normalize-space(name)"/>,--> 										</xsl:for-each> 									</xsl:otherwise> 								</xsl:choose> 							</xsl:for-each> 						</xsl:if></POINTXML>
	</xsl:template>


</xsl:stylesheet>