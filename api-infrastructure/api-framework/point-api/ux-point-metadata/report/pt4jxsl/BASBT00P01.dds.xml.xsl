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

<!-- Auto Generated XSLT for printer file DDS BASBT00P01-->
<xsl:template match="record[@name = 'HEADER1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > BASBT00R01                              <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="hl1title"/></xsl:with-param><xsl:with-param name="len">50</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                                                                                                                                             Page:<fo:page-number/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER2']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > User: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="hl2user"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="hl2title"/></xsl:with-param><xsl:with-param name="len">50</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                                                                                                                                             Date:<xsl:value-of select="$date"/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER3']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="hl3environment"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="hl3title"/></xsl:with-param><xsl:with-param name="len">50</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>         <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="hl3dest"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                                                                                                                        Time:<xsl:value-of select="$time"/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'DASHLINE1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'COLHEAD1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > Policy       MCO State Reason 1                                 Reason 2                                 Op Recvd  Pending   Pending   Crit         Referred             Fine Amount Date Paid Comment1                       Comment2                       Comment3 </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'COLHEAD2']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > Number                                                                                                   Date      Date      Reslvd    Reslvd Date    to </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'DETAIL1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dsymbol"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dpolicy"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dmodule"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dmco"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dstate"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dreas1"/></xsl:with-param><xsl:with-param name="len">40</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dreas2"/></xsl:with-param><xsl:with-param name="len">40</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="drcvdte"/></xsl:with-param></xsl:call-template>  <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="dpnddte"/></xsl:with-param></xsl:call-template>  <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="dpndrdte"/></xsl:with-param></xsl:call-template>  <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="dcritrdte"/></xsl:with-param></xsl:call-template>     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dreferd"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dpdamt"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="dpddte"/></xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dcmt1"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dcmt2"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dcmt3"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'TOTAL1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="tot1desc"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="tot19nbrrecs"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'EORLINE']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > *** End of Report *** </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'BLANK']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >   </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template></xsl:stylesheet>