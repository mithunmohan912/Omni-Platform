<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="BAS9_NUM_05">
			<xsl:value-of select="BAS9_NUM_05"/>
		</xsl:variable>

		<xsl:variable name="BAS9_NUM_04">
			<xsl:value-of select="BAS9_NUM_04"/>
		</xsl:variable>
		
		<xsl:variable name="KEY_CLIENT_SEQUENCE_NUMBER">
			<xsl:value-of select="KEY_CLIENT_SEQUENCE_NUMBER"/>
		</xsl:variable>
		
		<xsl:variable name="KEY_ADDRESS_SEQUENCE_NUMBER">
			<xsl:value-of select="KEY_ADDRESS_SEQUENCE_NUMBER"/>
		</xsl:variable>
		
		<xsl:variable name="BC_REASON_AMEND_DIGIT1">
			<xsl:value-of select="BC_REASON_AMEND_DIGIT1"/>
		</xsl:variable>
		
		<xsl:variable name="BC_REASON_AMEND_DIGIT2">
			<xsl:value-of select="BC_REASON_AMEND_DIGIT2"/>
		</xsl:variable>
		
		<xsl:variable name="BC_REASON_AMEND_DIGIT3">
			<xsl:value-of select="BC_REASON_AMEND_DIGIT3"/>
		</xsl:variable>
		
		<xsl:variable name="CRT_ENDORSE_REC">
			<xsl:value-of select="CRT_ENDORSE_REC"/>
		</xsl:variable>
		
		<xsl:variable name="ERRORMSG">
			<xsl:value-of select="errorMsg"/>
		</xsl:variable>
		
		<xsl:variable name="SUCCESS">
			<xsl:value-of select="success"/>
		</xsl:variable>
		
		<xsl:variable name="REQUESTCODE">
			<xsl:value-of select="REQUESTCODE"/>
		</xsl:variable>
		
		<xsl:variable name="TARGET">
			<xsl:value-of select="target"/>
		</xsl:variable>

		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:value-of select="User" />
						</CustLoginId>
					</CustId>
				</SignonPswd>
				<rulesIntegrated>Y</rulesIntegrated>
				<com.csc_SessKey>
					<xsl:value-of select="sessionKey" />
				</com.csc_SessKey>
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID><xsl:value-of select="$REQUESTCODE" /></RqUID>
				<xsl:element name="{concat(substring($REQUESTCODE,0,string-length($REQUESTCODE)-4),'Rq')}">
					<PayLoad>
						<BULK_MORT_CHANGE_RECORD_ROW>
							<PROCESSING_INFO>
							<target><xsl:value-of select="$TARGET" /></target>
							<PROC_SUCCESS_INDIC></PROC_SUCCESS_INDIC>
							</PROCESSING_INFO>
							<xsl:for-each select="list/PayLoad">
							<BULK_POLICIES>
								<LOCCO_A><xsl:value-of select="POLLOCATION" /></LOCCO_A> 
					    		<MASTERCO_A><xsl:value-of select="POLMASTER0CO" /></MASTERCO_A>
					    		<SYMBOL_A><xsl:value-of select="POLSYMBOL" /></SYMBOL_A> 
					    		<POLICY_A><xsl:value-of select="POLPOLICY0NUM" /></POLICY_A> 
					    		<MODULE_A><xsl:value-of select="POLMODULE" /></MODULE_A> 
								<INDICATOR_A><xsl:value-of select="POLSYMBOL" /></INDICATOR_A>   		
								<POLBLK_MORT_APP_FLAG></POLBLK_MORT_APP_FLAG>
								<OLD_CLIENT_SEQ><xsl:value-of select="$BAS9_NUM_05" /></OLD_CLIENT_SEQ>
								<OLD_ADDR_SEQ><xsl:value-of select="$BAS9_NUM_04" /></OLD_ADDR_SEQ>
								<NEW_CLIENT_SEQ><xsl:value-of select="$KEY_CLIENT_SEQUENCE_NUMBER" /></NEW_CLIENT_SEQ>
								<NEW_ADDR_SEQ><xsl:value-of select="$KEY_ADDRESS_SEQUENCE_NUMBER" /></NEW_ADDR_SEQ>
								<REASON1_A><xsl:value-of select="$BC_REASON_AMEND_DIGIT1" /></REASON1_A>
								<REASON2_A><xsl:value-of select="$BC_REASON_AMEND_DIGIT2" /></REASON2_A>
								<REASON3_A><xsl:value-of select="$BC_REASON_AMEND_DIGIT3" /></REASON3_A>
								<CRT_ENDORSE_REC><xsl:value-of select="$CRT_ENDORSE_REC" /></CRT_ENDORSE_REC>
								<ERROR_A><xsl:value-of select="$ERRORMSG" /></ERROR_A>
								<ERRORINDIC_A><xsl:value-of select="$SUCCESS" /></ERRORINDIC_A>
							</BULK_POLICIES>
							</xsl:for-each>
						</BULK_MORT_CHANGE_RECORD_ROW>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>