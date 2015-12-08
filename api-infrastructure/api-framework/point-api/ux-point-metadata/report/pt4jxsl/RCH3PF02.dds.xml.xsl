<?xml version="1.0" encoding="ISO-8859-1"?>
<!--********************************************************************************************-->
<!--* Programmer : Neha Roy               Date      : 12/23/2011                     	       *-->
<!--* FSIT Number: 153255		                                  		            	       *-->
<!--* Resolution : 46556		                                                       		   *-->
<!--* Description: Added a new XSL to change the date format.                                  *--> 														
<!--*********************************************************************************************-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                              xmlns:fo="http://www.w3.org/1999/XSL/Format"
                              xmlns:fn="http://www.w3.org/2005/02/xpath-functions">
    <!-- FSIT - 153255 RESL - 55560 Start -->
    <xsl:include href="ConvertDateCMMYYYY.xsl"/>
    <!-- FSIT - 153255 RESL - 55560 End -->
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

<!-- Auto Generated XSLT for printer file DDS RCH3PF02-->
<xsl:template match="record[@name = 'ZAPAGHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                       AGENCY STATEMENT BY GROUP NUMBER </fo:block>
<!-- FSIT - 153255 RESL - 55560 Start -->
<!--fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  STMT PERIOD <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zbswtx"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>            <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zboetx"/></xsl:with-param><xsl:with-param name="len">17</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>             PAGE:       <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zbjtnb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  STMT PERIOD <xsl:call-template name="cvtdateCMMYYYY"><xsl:with-param name="datefld"><xsl:value-of select="zbswtx"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zboetx"/></xsl:with-param><xsl:with-param name="len">17</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>             PAGE:       <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zbjtnb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<!-- FSIT - 153255 RESL - 55560 End -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZCKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zchltx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>         DATE:    <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="vca9dt"/></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZDKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZEKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > To      <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zeg8tx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> To    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zehmtx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> Agent:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zesvtx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> MCO:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zep1tx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zeiutx"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zeg9tx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zeabcd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zep3tx"/></xsl:with-param><xsl:with-param name="len">33</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">         <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zenmad"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> -------------------------------------------------------------------------------- </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> Sym Policy Mod   Insured''s Name </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> Acct     Eff     Tr  Comm      Gross Prem                  Payments/  Net Amount </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> Date     Date    Cd  Rate       / SC         Commission  Adjustments     Due </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> -------------------------------------------------------------------------------- </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZFKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zfp5tx"/></xsl:with-param><xsl:with-param name="len">49</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZGKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  Group Number <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zggroup"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZHKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZIKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZJKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zjgbtx"/></xsl:with-param><xsl:with-param name="len">14</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zjmptx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zjomtx"/></xsl:with-param><xsl:with-param name="len">14</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZKKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZLKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZMKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZNKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZOCOLHDG']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZODTLRCD']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zoswtx"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="voavdt"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zob6st"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zop6tx"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zoduva"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zoixva"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>             <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zofkva"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZPCOLHDG']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZPDTLRCD']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zpswtx"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vpwritdate"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zpb8st"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zpqitx"/></xsl:with-param><xsl:with-param name="len">25</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zpccva"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZQKEYTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZRKEYTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > Total Policy <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zrgbtx"/></xsl:with-param><xsl:with-param name="len">14</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  . . . . . . . . . . . . . . . . . .  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zrruva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZSKEYTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  Total Group Number <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zsgroup"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                    <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zsrvclval"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZTKEYTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="ztpwtx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="ztrvva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="ztrwva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="ztrxva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="ztryva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                    </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZUKEYTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > Past Due             <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuuzva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuu0va"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuu1va"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuu2va"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> Due  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vuewtx"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuutva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuuuva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuuvva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuuwva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> Due  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vuextx"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuvhva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuvgva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuvfva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuveva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> TOTAL AGENT <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zuiutx"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zur1va"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zur0va"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zur2va"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zurzva"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">   ***  Listed below are payments received but not yet applied.  *** </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                           </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> Total Suspended Payments                              <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zuvuva"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZVCOLHDG']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZVDTLRCD']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zvpolsym"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zvpolno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zvpolmod"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zvmptx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zvd4amtpay"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZWKEYTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > AGENT           UNAPPLIED                             <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zwvtva"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZXFINTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > Total Suspended Payments                              <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zxvuva"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'YAKEYTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'YBKEYTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'YCFINTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  File update requested for previously updated period.  FILE WAS NOT UPDATED. </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'YDENDRPT']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template></xsl:stylesheet>