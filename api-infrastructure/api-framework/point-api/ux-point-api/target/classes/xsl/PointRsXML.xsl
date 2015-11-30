<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="yes" />

	<xsl:template match="POINTXML">
		<POINTXML>
			<xsl:for-each select="*">
				<xsl:choose>
					<xsl:when test = "local-name() = 'InsuranceSvcRs' and count(*/PayLoad) > 0" >
					 <xsl:for-each select="*/PayLoad/*">
						<xsl:choose>
							<xsl:when test="local-name() != 'method'">
								<xsl:element name="{local-name()}">
									<xsl:value-of select="." />
								</xsl:element>
							</xsl:when>
						</xsl:choose>
					</xsl:for-each>
					</xsl:when>
					<xsl:when test="local-name() = 'POLICY_KEY' or local-name() = 'POLICY_INFO' or local-name() = 'TRANSACTION_FIELDS' or local-name() = 'PREMIUM_FIELDS' or local-name() = 'USER_FIELDS' or local-name() = 'PROCESSING_INFO'">
						<xsl:for-each select="*">
							<xsl:element name="{local-name()}">
								<xsl:value-of select="." />
							</xsl:element>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="local-name() = 'AGENCY_LIC_RECORDS_ROW'">
                        <xsl:for-each select="*">
                            <xsl:choose>
                              <xsl:when test="local-name() = 'BASIC_CONTRACT_INFO' or local-name() = 'PROCESSING_INFO' or local-name() = 'AGENCY_LIC_KEY' or local-name() = 'AGENCY_LIC_INFO'">
                                <xsl:for-each select="*">
                                  <xsl:element name="{local-name()}">
                                    <xsl:value-of select="." />
                                  </xsl:element>
                                </xsl:for-each>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:element name="{local-name()}">
                                    <xsl:value-of select="." />
                                </xsl:element>
                              </xsl:otherwise>
                            </xsl:choose>
                        </xsl:for-each>
                    </xsl:when>
					<xsl:otherwise>
						<xsl:element name="{local-name()}">
							<xsl:value-of select="." />
						</xsl:element>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</POINTXML>
	</xsl:template>
	<!-- Allow multi-request responses to retain their structure -->
	<xsl:template match="MULTIRECCALLRs">
		<xsl:copy-of select="/"/>
	</xsl:template>

	<xsl:template match="text()" />

</xsl:stylesheet>