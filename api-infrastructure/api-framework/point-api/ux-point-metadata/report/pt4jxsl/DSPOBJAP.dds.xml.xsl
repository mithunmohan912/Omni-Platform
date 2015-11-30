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

<!-- Auto Generated XSLT for printer file DDS DSPOBJAP-->
<xsl:template match="record[@name = 'HEADER']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:value-of select="$date"/> <xsl:value-of select="$time"/>                                OBJECT ATTRIBUTES BY CREATE DATE OBJECT ATTRIBUTES                        PAGE <fo:page-number/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                  FOR:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="objlst"/></xsl:with-param><xsl:with-param name="len">38</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> --------------- OBJECT ---------------  -- CREATE ---  -- CHANGE ---  ----------------- SOURCE FILE ----------------- </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> NAME       TYPE    ATTRIB   OWNER        DATE   TIME    DATE   TIME   NAME       LIBRARY    MEMBER      -- MBR CHG -- </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                                          DATE   TIME </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        NO OBJECTS IN LIBRARY </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'DETAIL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odobnm"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odobtp"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odobat"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odobow"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>            <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odcdat"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odctim"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odldat"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odltim"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odsrcf"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odsrcl"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odsrcm"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>            <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odsrcd"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="odsrct"/></xsl:with-param><xsl:with-param name="len">0</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'TOTAL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > TOTAL NUMBER OF OBJECTS:  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="totobj"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template></xsl:stylesheet>