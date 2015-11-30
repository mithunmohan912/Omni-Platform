<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

   		<xsl:variable name="REQUEST_CODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>
   		<xsl:variable name="PRDNAME">
        	<xsl:value-of select="AccdtYear"/>
   		</xsl:variable>
   		<xsl:variable name="ACTIONCODE">
        	<xsl:value-of select="actionCode"/>
   		</xsl:variable>
   		<xsl:variable name="TOTAL_RECORD">
        	<xsl:value-of select="TOTALRECORD"/>
   		</xsl:variable>
   		
   		<xsl:variable name="PRDIDUSER">
        	<xsl:value-of select="PRDIDUSER"/>
   		</xsl:variable>
   		
		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT4J</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:value-of select="USER" />
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
		<xsl:for-each select="list/PayLoad">
			<InsuranceSvcRq>
				<RqUID><xsl:value-of select="$REQUEST_CODE" /></RqUID>
				<xsl:element name="BASCSHAPRq">
					<PayLoad>					
	                   <KEY_PRDNAME><xsl:value-of select="$PRDNAME"/></KEY_PRDNAME>
	                   
	                   <KEY_PRDMONTH><xsl:value-of select="PRDMONTH"/></KEY_PRDMONTH>
	                   <KEY_PRDSEQ><xsl:value-of select="PRDSEQ"/></KEY_PRDSEQ>
	                   <KEY_USR><xsl:value-of select="$PRDIDUSER"/></KEY_USR>
	                   <KEY_ENV>PIJDC0</KEY_ENV>
	                   <KEY_PRDSTDATE><xsl:value-of select="PRDSTDATE"/></KEY_PRDSTDATE>
	                   <KEY_PRDENDATE><xsl:value-of select="PRDENDATE"/></KEY_PRDENDATE>
	                   <KEY_PRDSTATUS><xsl:value-of select="PRDSTATUS"/></KEY_PRDSTATUS>
	                   <ACTION_TO_PERFORM><xsl:value-of select="$ACTIONCODE"/></ACTION_TO_PERFORM>
	                   <TOTAL_RECORD><xsl:value-of select="$TOTAL_RECORD"/></TOTAL_RECORD>
					</PayLoad>
			  </xsl:element>
		  </InsuranceSvcRq>
	  </xsl:for-each>
	</POINTXML>
		
	</xsl:template>
</xsl:stylesheet>
