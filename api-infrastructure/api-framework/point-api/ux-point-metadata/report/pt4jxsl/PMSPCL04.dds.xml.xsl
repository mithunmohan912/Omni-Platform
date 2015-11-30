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

<!-- Auto Generated XSLT for printer file DDS PMSPCL04-->
<xsl:template match="record[@name = 'HEADER']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > PMSBCL04                                         <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="locname"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                      PAGE:     <fo:page-number/>   </fo:block>
<!--CSC-Manual Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> REPORTING DATE: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="selmm"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="seldd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="selyy"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           C L A I M A N T   C O U N T   B Y   M A S T E R   C O M P A N Y   C L A I M A N T   C O U N T   B  Y   C L A I M   O F F I C E         C L A I M A N T   C O U N T    B Y   E X A M I N E R             C L A I M A N T   C O U N T    B Y   A D J U S T E R       C L A I M   C O U N T   B Y    M A S T E R   C O M P A N Y   C L A I M   C O U N T   B  Y   C L A I M   O F F I C E         C L A I M   C O U N T    B Y   E X A M I N E R             C L A I M   C O U N T    B Y   A D J U S T E R       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="title"/></xsl:with-param><xsl:with-param name="len">63</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> DATE: <xsl:value-of select="$date"/> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> REPORTING DATE: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="selmm"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="seldd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>/<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="selyy"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Header1"><xsl:with-param name="in_21"><xsl:value-of select="in_21"/></xsl:with-param><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param><xsl:with-param name="in_14"><xsl:value-of select="in_14"/></xsl:with-param></xsl:call-template>									        		DATE: <xsl:value-of select="$date"/> </fo:block>
<!--CSC-Manual End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                          NUMERICAL ANALYSIS                                          TIME: <xsl:value-of select="$time"/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> *** NUMERICAL ANALYSIS ***        OPEN CLAIMS        REOPENED CLAIMS      FIRST &amp; FINALS    CLOSED CLAIMS </fo:block>
<!--CSC-Manual Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ***   MASTER COMPANY CLAIM OFFICE EXAMINER ADJUSTER *** MONTH  YEAR  INCEP MONTH  YEAR  INCEP MONTH  YEAR MONTH  YEAR </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ***   <xsl:call-template name="Header2"><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param><xsl:with-param name="in_14"><xsl:value-of select="in_14"/></xsl:with-param></xsl:call-template>   ***    MONTH  YEAR  INCEP    MONTH  YEAR  INCEP     MONTH  YEAR       MONTH  YEAR </fo:block>
<!--CSC-Manual End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------- </fo:block>

<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'DETAIL1']" xml:space="preserve">
<!--CSC-Manual Start-->
<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                               <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="openmon"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="openyr"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="openinc"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="reopmon"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="reopyr"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="reopinc"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="fafmon"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="fafyr"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="closmon"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="closyr"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  N/A    </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                              <xsl:call-template name="Detail1Open"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="openmon"><xsl:value-of select="openmon"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="openyr"><xsl:value-of select="openyr"/></xsl:with-param><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="openinc"><xsl:value-of select="openinc"/></xsl:with-param> </xsl:call-template>    <xsl:call-template name="Detail1ReOpen"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="reopmon"><xsl:value-of select="reopmon"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="reopyr"><xsl:value-of select="reopyr"/></xsl:with-param><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="reopinc"><xsl:value-of select="reopinc"/></xsl:with-param></xsl:call-template>     <xsl:call-template name="Detail1faf"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="fafmon"><xsl:value-of select="fafmon"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="fafyr"><xsl:value-of select="fafyr"/></xsl:with-param></xsl:call-template>       <xsl:call-template name="Detail1Clos"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="closmon"><xsl:value-of select="closmon"/></xsl:with-param><xsl:with-param name="closyr"><xsl:value-of select="closyr"/></xsl:with-param></xsl:call-template> </fo:block>
<!--CSC-Manual End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'DETAIL2']" xml:space="preserve">
<!--CSC-Manual Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > TOTAL FOR MASTER COMPANY: CLAIM OFFICE: EXAMINER: ADJUSTER: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcocode"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> ***ALL VALUES SELECTED*** <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="clmocode"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> ***ALL VALUES SELECTED*** <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="examcode"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> ***ALL VALUES SELECTED*** <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="adjcode"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> ***ALL VALUES SELECTED*** <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="mcodesc"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="adjdesc"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > TOTAL FOR <xsl:call-template name="trimmed"><xsl:with-param name="string"><xsl:call-template name="Header2"><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param><xsl:with-param name="in_14"><xsl:value-of select="in_14"/></xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template>: <xsl:call-template name="Detail2"><xsl:with-param name="in_09"><xsl:value-of select="in_09"/></xsl:with-param><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param><xsl:with-param name="in_14"><xsl:value-of select="in_14"/></xsl:with-param><xsl:with-param name="mcocode"><xsl:value-of select="mcocode"/></xsl:with-param><xsl:with-param name="mcodesc"><xsl:value-of select="mcodesc"/></xsl:with-param><xsl:with-param name="clmocode"><xsl:value-of select="clmocode"/></xsl:with-param><xsl:with-param name="examcode"><xsl:value-of select="examcode"/></xsl:with-param><xsl:with-param name="adjcode"><xsl:value-of select="adjcode"/></xsl:with-param><xsl:with-param name="adjdesc"><xsl:value-of select="adjdesc"/></xsl:with-param></xsl:call-template>   </fo:block>
<!--CSC-Manual End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'NODATA']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                    *** NO RECORDS MATCHED THE SELECTED CRITERIA *** </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>

</xsl:template><xsl:template match="record[@name = 'BNRHEAD']" xml:space="preserve">
<!--CSC-Manual Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > PMSBCL04                                                          PAGE:     <fo:page-number/>0                                                     </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > PMSBCL04                                                          PAGE:     <fo:page-number/></fo:block>
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                             CLAIM ACTIVITY REPORTCLAIMANT ACTIVITY REPORT DATE:<xsl:value-of select="$date"/> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                           <xsl:call-template name="BnrheadHeader1"><xsl:with-param name="in_21"><xsl:value-of select="in_21"/></xsl:with-param></xsl:call-template>                DATE: <xsl:value-of select="$date"/> </fo:block>
<!--CSC-Manual End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                      FOR THE REPORTING PERIOD: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="enddate2"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           TIME: <xsl:value-of select="$time"/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                              ********************* </fo:block>
<!--CSC-Manual Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                              *    BEG OF REPORT  * </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                              *    END OF REPORT  * </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                              <xsl:call-template name="BnrheadHeader2"><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template> </fo:block>
<!--CSC-Manual End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                              ********************* </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                    REPORT OPTIONS                VALUES SELECTED </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                    --------------                --------------- </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                    FOR LOCATION:                 <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="locno"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<!--CSC-Manual Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                    FOR MASTER COMPANY: FOR CLAIM OFFICE: FOR EXAMINER: FOR ADJUSTER: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="selcode"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                  ***ALL VALUES SELECTED*** </fo:block>
-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                    <xsl:call-template name="BnrheadHeader3"><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param><xsl:with-param name="in_14"><xsl:value-of select="in_14"/></xsl:with-param></xsl:call-template><xsl:call-template name="BnrheadHeader3In09"><xsl:with-param name="in_09"><xsl:value-of select="in_09"/></xsl:with-param><xsl:with-param name="selcode"><xsl:value-of select="selcode"/></xsl:with-param></xsl:call-template>  </fo:block>
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                    REPORTING PERIOD:             MONTHLY </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                    REPORTING PERIOD:             YEARLY </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                    REPORTING PERIOD:             INCEPTION </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="BnrheadMonthly"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param></xsl:call-template></fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="BnrheadYearly"><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template></fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="BnrheadInception"><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param></xsl:call-template></fo:block>
<!--CSC-Manual End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<!--CSC-Manual Start-->
<xsl:template name="Header1">
	<xsl:param name="in_21"/>
	<xsl:param name="in_11"/>
	<xsl:param name="in_12"/>
	<xsl:param name="in_13"/>
	<xsl:param name="in_14"/>
	<xsl:choose>
	<xsl:when test="($in_21 ='false') and ($in_11 ='true')">
		<xsl:value-of select="'C L A I M A N T   C O U N T   B Y   M A S T E R   C O M P A N Y'"/>
	</xsl:when>
	<xsl:when test="($in_21 ='false') and ($in_12 ='true')">
		<xsl:value-of select="'  C L A I M A N T   C O U N T   B Y   C L A I M   O F F I C E  '"/>
	</xsl:when>
	<xsl:when test="($in_21 ='false') and ($in_13 ='true')">
		<xsl:value-of select="'      C L A I M A N T   C O U N T   B Y   E X A M I N E R      '"/>
	</xsl:when>
	<xsl:when test="($in_21 ='false') and ($in_14 ='true')">
		<xsl:value-of select="'      C L A I M A N T   C O U N T   B Y   A D J U S T E R      '"/>
	</xsl:when>
	<xsl:when test="($in_21 ='true') and ($in_11 ='true')">
		<xsl:value-of select="'   C L A I M   C O U N T   B Y   M A S T E R   C O M P A N Y   '"/>
	</xsl:when>
	<xsl:when test="($in_21 ='true') and ($in_12 ='true')">
		<xsl:value-of select="'     C L A I M   C O U N T   B Y   C L A I M   O F F I C E     '"/>
	</xsl:when>
	<xsl:when test="($in_21 ='true') and ($in_13 ='true')">
		<xsl:value-of select="'         C L A I M   C O U N T   B Y   E X A M I N E R         '"/>
	</xsl:when>
	<xsl:when test="($in_21 ='true') and ($in_14 ='true')">
		<xsl:value-of select="'         C L A I M   C O U N T   B Y   A D J U S T E R         '"/>
	</xsl:when>
	</xsl:choose>
</xsl:template>



<xsl:template name="Header2">
	<xsl:param name="in_11"/>
	<xsl:param name="in_12"/>
	<xsl:param name="in_13"/>
	<xsl:param name="in_14"/>
	<xsl:choose>
	<xsl:when test="$in_11 ='true'">
	<xsl:value-of select="'MASTER COMPANY'"/>
	</xsl:when>
	<xsl:when test="$in_12 ='true'">
		<xsl:value-of select="' CLAIM OFFICE '"/>
	</xsl:when>
	<xsl:when test="$in_13 ='true'">
		<xsl:value-of select="'   EXAMINER   '"/>
	</xsl:when>
	<xsl:when test="$in_14 ='true'">
		<xsl:value-of select="'   ADJUSTER   '"/>
	</xsl:when>
	</xsl:choose>
</xsl:template>


<xsl:template name="trimmed">
	<xsl:param name="string"/>
   <xsl:value-of select='normalize-space($string)'/>
</xsl:template>

<xsl:template name="Detail2">
	<xsl:param name="in_09"/>
	<xsl:param name="in_11"/>
	<xsl:param name="in_12"/>
	<xsl:param name="in_13"/>
	<xsl:param name="in_14"/>
	<xsl:param name="mcocode"/>
	<xsl:param name="mcodesc"/>
	<xsl:param name="clmocode"/>
	<xsl:param name="examcode"/>
	<xsl:param name="adjcode"/>
	<xsl:param name="adjdesc"/>
	<xsl:choose>
	<xsl:when test="($in_09 ='false') and ($in_11 ='true')">
	<xsl:call-template name="Postpad"><xsl:with-param name="padVar"  select="$mcocode"/><xsl:with-param name="len" select="'2'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template><xsl:value-of select="' '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"  select="$mcodesc"/><xsl:with-param name="len" select="'30'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:when>
	<xsl:when test="($in_09 ='true') and ($in_11 ='true')">
		<xsl:value-of select="'***ALL VALUES SELECTED***'"/>
	</xsl:when>
	<xsl:when test="($in_09 ='false') and ($in_12 ='true')">
		<xsl:call-template name="Postpad"><xsl:with-param name="padVar"  select="$clmocode"/><xsl:with-param name="len" select="'3'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:when>
	<xsl:when test="($in_09 ='true') and ($in_12 ='true')">
		<xsl:value-of select="'***ALL VALUES SELECTED***'"/>
	</xsl:when>
	<xsl:when test="($in_09 ='false') and ($in_13 ='true')">
		<xsl:call-template name="Postpad"><xsl:with-param name="padVar"  select="$examcode"/><xsl:with-param name="len" select="'2'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:when>
	<xsl:when test="($in_09 ='true') and ($in_13 ='true')">
			<xsl:value-of select="'***ALL VALUES SELECTED***'"/>
	</xsl:when>
	<xsl:when test="($in_09 ='false') and ($in_14 ='true')">
		<xsl:call-template name="Postpad"><xsl:with-param name="padVar"  select="$adjcode"/><xsl:with-param name="len" select="'6'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template><xsl:value-of select="' '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"  select="$adjdesc"/><xsl:with-param name="len" select="'30'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:when>
	<xsl:when test="($in_09 ='true') and ($in_14 ='true')">
			<xsl:value-of select="'***ALL VALUES SELECTED***'"/>
	</xsl:when>
	</xsl:choose>
</xsl:template>

<xsl:template name="Detail1Open">
	<xsl:param name="in_01"/>
	<xsl:param name="openmon"/>
	<xsl:param name="in_02"/>
	<xsl:param name="openyr"/>
	<xsl:param name="in_03"/>
	<xsl:param name="openinc"/>
	<xsl:if test="$in_01 ='true'">
	<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$openmon"/><xsl:with-param name="len" select="'5'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_01 ='false'">
		<xsl:value-of select="' N/A '"/>
	</xsl:if>
	<xsl:if test="$in_02 ='true'">
		<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$openmon"/><xsl:with-param name="len" select="'6'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_02 ='false'">
		<xsl:value-of select="'  N/A '"/>
	</xsl:if>
	<xsl:if test="$in_03 ='true'">
		<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$openinc"/><xsl:with-param name="len" select="'7'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_03 ='false'">
		<xsl:value-of select="'   N/A '"/>
	</xsl:if>
</xsl:template>



	<xsl:template name="Detail1ReOpen">
	<xsl:param name="in_01"/>
	<xsl:param name="reopmon"/>
	<xsl:param name="in_02"/>
	<xsl:param name="reopyr"/>
	<xsl:param name="in_03"/>
	<xsl:param name="reopinc"/>
	<xsl:if test="$in_01 ='true'">
	<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$reopmon"/><xsl:with-param name="len" select="'5'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_01 ='false'">
		<xsl:value-of select="' N/A '"/>
	</xsl:if>
	<xsl:if test="$in_02 ='true'">
		<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$reopyr"/><xsl:with-param name="len" select="'6'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_02 ='false'">
		<xsl:value-of select="'  N/A '"/>
	</xsl:if>
	<xsl:if test="$in_03 ='true'">
		<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$reopinc"/><xsl:with-param name="len" select="'7'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_03 ='false'">
		<xsl:value-of select="'   N/A '"/>
	</xsl:if>
	</xsl:template>


<xsl:template name="Detail1faf">
	<xsl:param name="in_01"/>
	<xsl:param name="fafmon"/>
	<xsl:param name="in_02"/>
	<xsl:param name="fafyr"/>
	<xsl:if test="$in_01 ='true'">
	<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$fafmon"/><xsl:with-param name="len" select="'5'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_01 ='false'">
		<xsl:value-of select="' N/A '"/>
	</xsl:if>
	<xsl:if test="$in_02 ='true'">
		<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$fafyr"/><xsl:with-param name="len" select="'6'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_02 ='false'">
		<xsl:value-of select="'  N/A '"/>
	</xsl:if>
	</xsl:template>

<xsl:template name="Detail1Clos">
	<xsl:param name="in_01"/>
	<xsl:param name="in_02"/>
	<xsl:param name="closmon"/>
	<xsl:param name="closyr"/>
	<xsl:if test="$in_01 ='true'">
	<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$closmon"/><xsl:with-param name="len" select="'5'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_01 ='false'">
		<xsl:value-of select="' N/A '"/>
	</xsl:if>
	<xsl:if test="$in_02 ='true'">
		<xsl:call-template name="Prepad"><xsl:with-param name="padVar"  select="$closyr"/><xsl:with-param name="len" select="'6'"/><xsl:with-param name="padChar" select="' '"/></xsl:call-template>
	</xsl:if>
	<xsl:if test="$in_02 ='false'">
		<xsl:value-of select="'  N/A '"/>
	</xsl:if>
	</xsl:template>

<xsl:template name="BnrheadHeader1">
	<xsl:param name="in_21"/>
	<xsl:if test="$in_21 ='true'">
		<xsl:value-of select="'   CLAIM ACTIVITY REPORT'"/>
	</xsl:if>
	<xsl:if test="$in_21 ='false'">
		<xsl:value-of select="'CLAIMANT ACTIVITY REPORT'"/>
	</xsl:if>
</xsl:template>

<xsl:template name="BnrheadHeader2">
	<xsl:param name="in_04"/>
	<xsl:if test="$in_04 ='true'">
		<xsl:value-of select="'*    BEG OF REPORT  *'"/>
	</xsl:if>
	<xsl:if test="$in_04 ='false'">
		<xsl:value-of select="'*    END OF REPORT  *'"/>
	</xsl:if>
</xsl:template>


<xsl:template name="BnrheadHeader3">
	<xsl:param name="in_11"/>
	<xsl:param name="in_12"/>
	<xsl:param name="in_13"/>
	<xsl:param name="in_14"/>
	<xsl:choose>
	<xsl:when test="$in_11 ='true'">
		<xsl:value-of select="'FOR MASTER COMPANY:           '"/>
	</xsl:when>
	<xsl:when test="$in_12 ='true'">
		<xsl:value-of select="'FOR CLAIM OFFICE:             '"/>
	</xsl:when>
	<xsl:when test="$in_13 ='true'">
		<xsl:value-of select="'FOR EXAMINER:                 '"/>
	</xsl:when>
	<xsl:when test="$in_14 ='true'">
		<xsl:value-of select="'FOR ADJUSTER:                 '"/>
	</xsl:when>
	</xsl:choose>
</xsl:template>


<xsl:template name="BnrheadHeader3In09">
	<xsl:param name="in_09"/>
	<xsl:param name="selcode"/>
	<xsl:if test="$in_09 ='false'">
	<xsl:value-of select="$selcode"/>
	</xsl:if>
	<xsl:if test="$in_09 ='true'">
			<xsl:value-of select="'***ALL VALUES SELECTED***'"/>
	</xsl:if>
</xsl:template>

<xsl:template name="BnrheadMonthly">
	<xsl:param name="in_01"/>
	<xsl:if test="$in_01 ='true'">
		<xsl:value-of select="'                    REPORTING PERIOD:             MONTHLY'"/>
	</xsl:if>
</xsl:template>

<xsl:template name="BnrheadYearly">
	<xsl:param name="in_02"/>
	<xsl:if test="$in_02 ='true'">
		<xsl:value-of select="'                    REPORTING PERIOD:             YEARLY'"/>
	</xsl:if>
</xsl:template>
<xsl:template name="BnrheadInception">
	<xsl:param name="in_03"/>
	<xsl:if test="$in_03 ='true'">
		<xsl:value-of select="'                    REPORTING PERIOD:             INCEPTION'"/>
	</xsl:if>
</xsl:template>
<!--CSC-Manual End-->
</xsl:stylesheet>