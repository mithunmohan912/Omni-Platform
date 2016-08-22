<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />
	<xsl:template match="DecisionReply">
		<POINTXML>
			<xsl:for-each select="MsgStatus/MsgStatusCd">
				<xsl:element name="{local-name()}">
					<xsl:value-of select="." />
				</xsl:element>
			</xsl:for-each>
			<xsl:for-each select="com.csc_UnderwritingDecision/*">
				<xsl:choose>
					<xsl:when test="local-name()='com.csc_UnderwritingRule'">
						<xsl:variable name="count">
							<xsl:number />
						</xsl:variable>
						<xsl:for-each select="./*">
							<xsl:choose>
								<xsl:when test="local-name() != 'com.csc_UnderwritingDecisionCd'">
									<xsl:element name="{local-name()}{$count}">
										<xsl:value-of select="." />
									</xsl:element>
								</xsl:when>
							</xsl:choose>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="local-name()='com.csc_DecisionResultInfo'">
						<xsl:for-each select="./com.csc_ResultField">
							<xsl:variable name="name">
								<xsl:value-of select="./com.csc_Name" />
							</xsl:variable>
							<xsl:variable name="value">
								<xsl:value-of select="./com.csc_Value" />
							</xsl:variable>
							<xsl:element name="{$name}">
								<xsl:value-of select="$value" />
							</xsl:element>
						</xsl:for-each>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="local-name() = 'com.csc_UnderwritingDecisionCd'">
								<xsl:variable name="decision">
									<xsl:value-of select="." />
								</xsl:variable>
								<xsl:element name="{local-name()}">
									<xsl:value-of select="$decision" />
								</xsl:element>
							</xsl:when>
							<xsl:otherwise>
								<xsl:element name="{local-name()}">
									<xsl:value-of select="." />
								</xsl:element>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
			<xsl:for-each select="ExtendedStatus">				
					<xsl:variable name="errorcode">
						<xsl:value-of select="ExtendedStatusCd" />
					</xsl:variable>
					<xsl:variable name="type">
						<xsl:value-of select="com.csc_ExtendedStatusType" />
					</xsl:variable>
					<xsl:variable name="screen">
						<xsl:value-of select="com.csc_PageReference" />
					</xsl:variable>
					<xsl:variable name="field">
						<xsl:value-of select="com.csc_FieldReference" />
					</xsl:variable>
					<xsl:variable name="description">
						<xsl:value-of select="ExtendedStatusDesc" />
					</xsl:variable>
					<xsl:element name="{concat('ErrorCode',position())}">
						<xsl:value-of select="$errorcode" />
					</xsl:element>
					<xsl:element name="{concat('Type',position())}">
						<xsl:value-of select="$type" />
					</xsl:element>
					<xsl:element name="{concat('ScreenName',position())}">
						<xsl:value-of select='$screen' />
					</xsl:element>
					<xsl:element name="{concat('FieldName',position())}">
						<xsl:value-of select='$field' />
					</xsl:element>
					<xsl:element name="{concat('Description',position())}">
						<xsl:value-of select="$description" />
					</xsl:element>
					<xsl:element name="ErrorCount">
						<xsl:value-of select="position()" />
					</xsl:element>
			</xsl:for-each>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>