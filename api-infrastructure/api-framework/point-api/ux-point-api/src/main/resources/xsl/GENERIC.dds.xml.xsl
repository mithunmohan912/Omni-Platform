<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                              xmlns:fo="http://www.w3.org/1999/XSL/Format"
                              xmlns:fn="http://www.w3.org/2005/02/xpath-functions">
   <xsl:output encoding="UTF-8"/>
	<xsl:preserve-space elements="*"/>
	   <xsl:template match="/">
	        <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
		<fo:layout-master-set>
		<fo:simple-page-master master-name="simple"
		page-height="29.7cm" 
		page-width="21cm"
		margin-top="1cm" 
		margin-bottom="2cm" 
		margin-left="2.5cm" 
		margin-right="2.5cm">
		<fo:region-body margin-top="3cm"/>
		<fo:region-before extent="3cm"/>
		<fo:region-after extent="1.5cm"/>
		</fo:simple-page-master>
		</fo:layout-master-set>
		
		<fo:page-sequence master-reference="simple">
		<fo:flow flow-name="xsl-region-body">
		<fo:block font-size="12pt" 
					font-family="sans-serif" 
					line-height="15pt"
					space-after.optimum="3pt"
					text-align="justify">
					
					<xsl:value-of select="."/>
					
			</fo:block>
		<!--xsl:apply-templates select="/"/-->
		</fo:flow>
		</fo:page-sequence>
		
		</fo:root> 

    </xsl:template>	
                              
                  

			<xsl:template match="POINTXML2">
			<fo:block font-size="12pt" 
			font-family="sans-serif" 
			line-height="15pt"
			space-after.optimum="3pt"
			text-align="justify">
			
			<xsl:value-of select="."/>
			
			</fo:block>
			</xsl:template>


                              
</xsl:stylesheet>                              