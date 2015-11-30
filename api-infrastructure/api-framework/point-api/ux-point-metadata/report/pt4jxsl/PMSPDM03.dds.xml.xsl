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

<!-- Auto Generated XSLT for printer file DDS PMSPDM03-->
<xsl:template match="record[@name = 'REPHEADERS']" xml:space="preserve">
<!-- FSIT: 174188, Resolution: 62449 - Start -->
<fo:block page-break-before="always"/>
<!-- FSIT: 174188, Resolution: 62449 - End -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  PMSBDM03                                         <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="locheader"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                     DATE: <xsl:value-of select="$date"/> </fo:block>
<!-- FSIT: 174188, Resolution: 62449 - Start -->
<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  REPORT DATE: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="sysovrride"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                            E X P I R A T I O N   L I S T                                      PAGE:        0 PAGE: <fo:page-number/> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  REPORT DATE: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="sysovrride"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                            E X P I R A T I O N   L I S T                                      <xsl:call-template name="Header2"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT: 174188, Resolution: 62449 - End -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                                                      TIME: <xsl:value-of select="$time"/> </fo:block>
<!-- FSIT: 174188, Resolution: 62449 - Start -->
<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  RENEWAL CLOSED DATE: <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="rendate"/></xsl:with-param></xsl:call-template> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  <xsl:call-template name="Header3"><xsl:with-param name="in_77"><xsl:value-of select="in_77"/></xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT: 174188, Resolution: 62449 - End -->
<!-- FSIT: 174188, Resolution: 62449 - Start
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  CLOSED AGENT                                      FROM: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="lastrundat"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   TO: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="endrangdat"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">               <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtline1"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcoline1"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="pcoline1"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">      AGENCY:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtline2"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>     MCO:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcoline2"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>     PCO:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="pcoline2"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtline3"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcoline3"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="pcoline3"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtzip"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                               <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcozip"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                               <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="pcozip"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">            LINE OF BUSINESS         ISSUE                                                 EFFECTIVE   EXPIRATION </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">              DESCRIPTION            CODE    INSURED NAME                 SYM  POL  MOD       DATE        DATE      COMMENTS </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block> -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="Header4"><xsl:with-param name="in_10"><xsl:value-of select="in_10"/></xsl:with-param><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_91"><xsl:value-of select="in_91"/></xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT: 174188, Resolution: 62449 - End -->
<!-- FSIT: 174188, Resolution: 62449 - Start -->
<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="messagelin"/></xsl:with-param><xsl:with-param name="len">21</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="Header5"><xsl:with-param name="in_91"><xsl:value-of select="in_91"/></xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT: 174188, Resolution: 62449 - End -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<xsl:template match="record[@name = 'REPDETAIL']" xml:space="preserve">
<!-- FSIT: 174188, Resolution: 62449 - Start
 <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="lobdesc"/></xsl:with-param><xsl:with-param name="len">35</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="issuecode"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="insrdname"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="astrskid"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="policynmbr"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="effectdat"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="expiredat"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="comments"/></xsl:with-param><xsl:with-param name="len">16</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" ><xsl:call-template name="REPDETAIL1"><xsl:with-param name="in_10"><xsl:value-of select="in_10"/></xsl:with-param><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT: 174188, Resolution: 62449 - End -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<!-- FSIT: 174188, Resolution: 62449 - Start
 <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        ********************* </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="REPDETAIL2"><xsl:with-param name="in_10"><xsl:value-of select="in_10"/></xsl:with-param><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT: 174188, Resolution: 62449 - End -->
<!-- FSIT: 174188, Resolution: 62449 - Start
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        *   BEG OF REPORT   * </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="REPDETAIL3"><xsl:with-param name="in_10"><xsl:value-of select="in_10"/></xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT: 174188, Resolution: 62449 - End -->
<!-- FSIT: 174188, Resolution: 62449 - Start
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        *   END OF REPORT   * </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="REPDETAIL4"><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT: 174188, Resolution: 62449 - End -->
<!-- FSIT: 174188, Resolution: 62449 - Start
fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        ********************* </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="REPDETAIL5"><xsl:with-param name="in_10"><xsl:value-of select="in_10"/></xsl:with-param><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT: 174188, Resolution: 62449 - End -->
</xsl:template>
<!-- FSIT: 174188, Resolution: 62449 - Start -->
<xsl:template name="Header1">	
	<xsl:param name="in_10"/>
	<xsl:param name="in_11"/>
	<xsl:param name="in_91"/>
	<xsl:if test="($in_10 ='false') and ($in_11 ='false') and ($in_91 ='false')" >
		<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="locheader"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>
	</xsl:if>
</xsl:template>
<xsl:template name="Header2">
	<xsl:param name="in_01"/>
	<xsl:if test="($in_01 ='false')">
		<xsl:value-of select="'PAGE:        0'"/>
	</xsl:if>
	<xsl:if test="($in_01 ='true')">
		<xsl:value-of select="'PAGE:        '"/><fo:page-number/>
	</xsl:if>
</xsl:template>
<xsl:template name="Header3">
	<xsl:param name="in_77"/>
	<xsl:if test="($in_77 ='true')">
	<xsl:value-of select="'RENEWAL CLOSED DATE: '"/><xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="rendate"/></xsl:with-param></xsl:call-template>
	</xsl:if>
</xsl:template>

<xsl:template name="Header4">
<xsl:param name="in_10"/>
	<xsl:param name="in_11"/>
	<xsl:param name="in_91"/>
	<xsl:if test="($in_10 ='false') and ($in_11 ='false') and ($in_91 ='false')" >
	<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  CLOSED AGENT                                      FROM: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="lastrundat"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template>   TO: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="endrangdat"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:value-of select = "'               '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtline1"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select = "'           '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcoline1"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select = "'           '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="pcoline1"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">      AGENCY:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtline2"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template>     MCO:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcoline2"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template>     PCO:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="pcoline2"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:value-of select = "'     '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select = "'   '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtline3"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select="'           '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcoline3"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="pcoline3"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:value-of select = "'                                   '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agtzip"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select = "'                               '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcozip"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select = "'                               '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="pcozip"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">            LINE OF BUSINESS         ISSUE                                                 EFFECTIVE   EXPIRATION </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">              DESCRIPTION            CODE    INSURED NAME                 SYM  POL  MOD       DATE        DATE      COMMENTS </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
</xsl:if>
</xsl:template>

<xsl:template name="Header5">
	<xsl:param name="in_91"/>
	<xsl:if test="($in_91='true')">
	<xsl:value-of select="'                                                      '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="messagelin"/></xsl:with-param><xsl:with-param name="len">21</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template>
	</xsl:if>
</xsl:template>

<xsl:template name="REPDETAIL1" >
	<xsl:param name="in_10"/>
	<xsl:param name="in_11"/>

	<xsl:if test="($in_10='false') and ($in_11='false')">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" ><xsl:value-of select="'  '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="lobdesc"/></xsl:with-param><xsl:with-param name="len">35</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select="'  '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="issuecode"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select="'   '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="insrdname"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="astrskid"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="policynmbr"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select="'    '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="effectdat"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select="'    '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="expiredat"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select="'    '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="comments"/></xsl:with-param><xsl:with-param name="len">16</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template> </fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
	</xsl:if> 

</xsl:template>

<xsl:template name="REPDETAIL2" >
	<xsl:param name="in_10"/>
	<xsl:param name="in_11"/>
	
	<xsl:if test="($in_10='true') or ($in_11='true')">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        ********************* </fo:block>
	</xsl:if>
</xsl:template>

<xsl:template name="REPDETAIL3" >
	<xsl:param name="in_10"/>
	<xsl:if test="($in_10='true')">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        *   BEG OF REPORT   * </fo:block>
	</xsl:if>
</xsl:template>

<xsl:template name="REPDETAIL4" >
	<xsl:param name="in_10"/>
	<xsl:param name="in_11"/>
	
	<xsl:if test="($in_10='true') or ($in_11='true')">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        *   END OF REPORT   * </fo:block>
	</xsl:if>
</xsl:template>

<xsl:template name="REPDETAIL5" >
	<xsl:param name="in_10"/>
	<xsl:param name="in_11"/>
	<xsl:if test="($in_10='true') or ($in_11='true')">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                        ********************* </fo:block>
	</xsl:if>
</xsl:template>
<!-- FSIT: 174188, Resolution: 62449 - End -->
</xsl:stylesheet>