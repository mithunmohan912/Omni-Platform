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
                </fo:flow>
            </fo:page-sequence>

        </fo:root>
    </xsl:template>

<!-- Auto Generated XSLT for printer file DDS DSPFLDAP-->
<xsl:template match="record[@name = 'HEADER']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:value-of select="$date"/> <xsl:value-of select="$time"/>                                 DISPLAY FILE FIELD ATTRIBUTES          POSITION ORDER NAME ORDER         PAGE <fo:page-number/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> LIBRARY- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whlib"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>            FILE- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whfile"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                 NBR RCD FMTS- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whcnt"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                   RCD FORMAT- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whname"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>            NBR FIELDS- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whnfld"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                      TYPE- PHY LGLJOIN LGL                                          NBR- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whrcde"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>            RCD LENGTH- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whrlen"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                      TEXT- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="attxt"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                BASED ON- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="apbof"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> FIELD       TYPE     --KEY--    FIELD   BUFFER    BUFFER   TEXT </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> NAME                 SEQ NBR    LENGTH  LENGTH  POSITION </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                      NO FIELDS/FILES FOUND </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'DETAIL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whflde"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>            <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="fldtyp"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="apkseq"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="apkeyn"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whfldb"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whfldd"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whfldp"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whibo"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>          <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whfobo"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="whftxt"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template></xsl:stylesheet>