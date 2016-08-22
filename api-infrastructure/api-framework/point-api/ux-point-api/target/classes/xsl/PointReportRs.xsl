<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="yes" />

	<xsl:template match="POINTXML">
		<POINTJDBCRs>
		<Rows>
			<xsl:for-each select="file">
					<xsl:if test="not(contains(., 'AsyncProcessTrace'))">
						<Row>
	  						<file><xsl:value-of select="." /></file>
							<date><xsl:value-of select="@date" /></date>
							<title><xsl:value-of select="@title" /></title>
							<userDir><xsl:value-of select="@userDir" /></userDir>
							<rptcreationdate><xsl:value-of select="@rptcreationdate" /></rptcreationdate>
						</Row>
					</xsl:if>
			</xsl:for-each>
		</Rows>
		</POINTJDBCRs>
	</xsl:template>
	
	<xsl:template match="text()" />

</xsl:stylesheet>