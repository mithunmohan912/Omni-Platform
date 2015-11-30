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

<!-- Auto Generated XSLT for printer file DDS PMSPMP02-->
<xsl:template match="record[@name = 'HEADER1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  PMSBMP02-<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="reportnum"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="locname"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                      PAGE:     <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="pageno"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER2']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  ACCTG DATE: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="acctgmm"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="acctgyy"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                          <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="reportlit"/></xsl:with-param><xsl:with-param name="len">45</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                             DATE: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="reportmm"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="reportdd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="reportyy"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER3']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                                                     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="reporttype"/></xsl:with-param><xsl:with-param name="len">16</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                                  TIME:    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="timehour"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>:<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="timeminute"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER6']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >     TO     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agencyadd1"/></xsl:with-param><xsl:with-param name="len">29</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>          FROM    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcoadd1"/></xsl:with-param><xsl:with-param name="len">32</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER7']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >   AGENCY:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agencyadd2"/></xsl:with-param><xsl:with-param name="len">29</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>          MCO:    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcoadd2"/></xsl:with-param><xsl:with-param name="len">32</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER8']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >            <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agencyadd3"/></xsl:with-param><xsl:with-param name="len">29</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agencyzip1"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcoadd3"/></xsl:with-param><xsl:with-param name="len">32</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcozipcode"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER9']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >            <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agencyadd4"/></xsl:with-param><xsl:with-param name="len">29</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agencyzip2"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER10']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > AGENCY  PROD   POLICY                            COVERAGE    EFF   EXP   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="transdesc"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="commdesc"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER11D']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > NUMBER  CODE   NUMBER         INSURED NAME       DESCRIPTION DATE  DATE  CODE    RATE     WRIT PREM           COMM        NET PREM </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'HEADER11S']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > NUMBER  CODE   NUMBER          INSURED NAME      DESCRIPTION DATE  DATE                   WRIT PREM           COMM        NET PREM </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'DETAIL1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agencynumd"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prodcoded"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="symbold"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="policynod"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="moduled"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="insurednmd"/></xsl:with-param><xsl:with-param name="len">21</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="covdescd"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="coveffmmd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="coveffyyd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="covexpmmd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="covexpyyd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="transcoded"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="transalphd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="comratsumd"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="writpremd"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="commpaidd"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="netpremd"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'SUMMARY1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agencynums"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prodcodes"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="symbols"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="policynos"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mods"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="insurednms"/></xsl:with-param><xsl:with-param name="len">21</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="covdescs"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="coveffmms"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="coveffyys"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="covexpmms"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="covexpyys"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>              <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="writprems"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="commpaids"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="netprems"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'TOTALLINE1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                                                  TOTAL  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="totlit1"/></xsl:with-param><xsl:with-param name="len">23</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>       <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="totwrprem1"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="totcomm1"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="totnetpre1"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'TOTALLINE2']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                               TOTAL  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="totlit2"/></xsl:with-param><xsl:with-param name="len">49</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="totwrprem2"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="totcomm2"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="totnetpre2"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ERRHEAD1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                                         ******NO DATA SELECTED FOR THIS RUN****** </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ERRHEAD2']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                                         ******INVALID PARAMETERS IN LINKAGE******<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="invparm1"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="invparm2"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="invparm3"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ERRHEAD3']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="norecslit"/></xsl:with-param><xsl:with-param name="len">132</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'BANNEREC1']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="banarea1"/></xsl:with-param><xsl:with-param name="len">132</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>
</fo:block>
</xsl:template><xsl:template match="record[@name = 'BANNEREC2']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="banarea2"/></xsl:with-param><xsl:with-param name="len">132</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>
</fo:block>
</xsl:template><xsl:template match="record[@name = 'DASHHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'BLANKLINE']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="blankfield"/></xsl:with-param><xsl:with-param name="len">132</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template></xsl:stylesheet>