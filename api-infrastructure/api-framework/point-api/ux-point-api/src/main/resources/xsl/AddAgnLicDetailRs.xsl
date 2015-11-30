<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="yes" />
	<xsl:template match="POINTXML">
		<POINTXML>
			<xsl:for-each select="*">
				<xsl:choose>
					<xsl:when test = "local-name() = 'AGENCY_LIC_RECORDS_ROW'" >
						 <xsl:for-each select="*">
							<xsl:choose>
	                           <xsl:when test="local-name() = 'AGENCY_LIC_INFO'">
		                           <xsl:element name="{local-name()}">
		                             <xsl:for-each select="*">
		                               <xsl:element name="{local-name()}">
		                                 <xsl:value-of select="." />
		                               </xsl:element>
		                             </xsl:for-each>
		                           </xsl:element>
	                           </xsl:when>
							</xsl:choose>
						</xsl:for-each>
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
		</POINTXML>
	</xsl:template>
	<xsl:template match="text()" />
</xsl:stylesheet>