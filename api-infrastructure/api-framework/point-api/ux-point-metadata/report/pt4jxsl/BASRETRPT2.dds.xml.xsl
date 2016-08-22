<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                              xmlns:fo="http://www.w3.org/1999/XSL/Format"
                              xmlns:fn="http://www.w3.org/2005/02/xpath-functions">
	<xsl:include href="ConvertDateCYYMMDDtoMMDDYYYY.xsl"/>
	<xsl:include href="ConvertDateCYYMMDDtoMMDDYY.xsl"/>
	<xsl:include href="ConvertTimeHHMMSS.xsl"/>
	<xsl:include href="Prepad.xsl"/>
	<xsl:include href="Postpad.xsl"/>
	<xsl:param name="date"/>
	<xsl:param name="time"/>
	<xsl:output encoding="UTF-8"/>
	<xsl:preserve-space elements="*"/>
 <xsl:template match="/">
        <fo:root>
            <fo:layout-master-set>
                <fo:simple-page-master master-name="LandscapeReport"
                    page-width="11in"
                    page-height="8.5in"
                    margin-top=".17in"
                    margin-bottom=".17in"
                    margin-left=".25in"
                    margin-right=".25in">
                    <fo:region-body margin-top="0in"/>
                    <fo:region-before extent="0in"/>
                    <fo:region-after  extent="0in"/>
                </fo:simple-page-master>
                <fo:simple-page-master master-name="PortraitReport"
                    page-width="8.5in"
                    page-height="11in"
                    margin-top=".25in"
                    margin-bottom=".25in"
                    margin-left=".17in"
                    margin-right=".17in">
                    <fo:region-body margin-top="0in"/>
                    <fo:region-before extent="0in"/>
                    <fo:region-after  extent="0in"/>
                </fo:simple-page-master>
            </fo:layout-master-set>

            <fo:page-sequence master-reference="LandscapeReport">
                <fo:flow flow-name="xsl-region-body">
                <xsl:apply-templates select="/POINTXML/file/record"/>
               <fo:block id="last-page"/>
                </fo:flow>
            </fo:page-sequence>

        </fo:root>
 </xsl:template>
 <xsl:template match="record[@name = 'DHDR1']" xml:space="preserve">
 <fo:block page-break-before="always"/>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  BASRETR02                                  ERRORS LIST OF RETROACTIVE TREATY ADJUSTMENT PROCESS                            PAGE: <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="dpage"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<fo:page-number-citation-last ref-id="last-page"/></fo:block>
</xsl:template>
<xsl:template match="record[@name = 'DHDR2']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                                                                      DATE: <xsl:value-of select="$date"/> </fo:block>
</xsl:template>
<xsl:template match="record[@name = 'DHDR3']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                                                                      TIME: <xsl:value-of select="$time"/> </fo:block>
</xsl:template>
<xsl:template match="record[@name = 'DHDR4']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------------------------- </fo:block>
</xsl:template>
<xsl:template match="record[@name = 'DHDR5']" xml:space="preserve">
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> CONTRACT      POLICY            CLAIM          ERROR DESCRIPTION </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> -------------------------------------------------------------------------------------------------------------------------------------------------------  </fo:block>
</xsl:template>
<xsl:template match="record[@name = 'DDTL1']" xml:space="preserve">
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="contract"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="policy"/></xsl:with-param><xsl:with-param name="len">16</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="claimno"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="errordesc"/></xsl:with-param><xsl:with-param name="len">100</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<xsl:template match="record[@name = 'DENDRPT']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                             *** END OF REPORT ***</fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
</xsl:template>

</xsl:stylesheet>