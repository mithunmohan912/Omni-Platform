<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="RCDUSER">
			<xsl:value-of select="User"/>
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

				<RqUID><xsl:value-of select="REQUESTCODE" /></RqUID>

				<xsl:element
					name="{concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'Rq')}">

					<PayLoad>
						<SUBJ_INFO_ROW>
							
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE/>
								<PROC_EFFECTIVE_DATE/>
								<PROC_PROGRAM_NAME/>
								<PROC_LDA_SELECT/>
								<PROC_PANEL_MODE/>
								<PROC_LDA_SYSTEM_DATE_OVERRIDE/>
								<PROC_LDA_SECURITY/>
								<PROC_LDA_ACCTG_DATE/>
								<PROC_LDA_TRANSSEQ/>
								<PROC_LDA_ISSUE_CODE/>
								<PROC_LDA_RENEWAL_MODULE/>
								<PROC_LDA_TYPE_ACTIVITY/>
								<PROC_LDA_CUR_REC_SET_STATUS/>
								<PROC_LDA_RECORD_IND/>
								<PROC_SUCCESS_INDIC/>
								
							</PROCESSING_INFO>
							
							
							<KEY_INFO>
								<LOCATION><xsl:value-of select="LOCATION" /></LOCATION>
								<MASTER_CO><xsl:value-of select="MASTER_CO" /></MASTER_CO>
								<SYMBOL><xsl:value-of select="SYMBOL" /></SYMBOL>
								<POL_NO><xsl:value-of select="POL_NO" /></POL_NO>
								<POL_CO><xsl:value-of select="POL_CO" /></POL_CO>
								<STATE><xsl:value-of select="STATE" /></STATE>
								<LOB><xsl:value-of select="LOB" /></LOB>
								<POL_MODULE><xsl:value-of select="POL_MODULE" /></POL_MODULE>
								<DUE_DATE_LIMIT><xsl:value-of select="dueDateLimit" /></DUE_DATE_LIMIT>
								<MAX_NUMBER_OF_DAYS><xsl:value-of select="maxNumberOfDays" /></MAX_NUMBER_OF_DAYS>
							</KEY_INFO>
							

							<xsl:for-each select="list/PayLoad">

								<SUBJ_REC_ROW>
									<SUBJECTIVITIES><xsl:value-of select="SUBDESC"/></SUBJECTIVITIES>
									<DTE_COMPLETED><xsl:value-of select="DTE_COMPLETED"/></DTE_COMPLETED>
									<WAIVED><xsl:value-of select="WAIVED"/></WAIVED>
									<WAIVED_REASON><xsl:value-of select="WAIVED_REASON"/></WAIVED_REASON>
									<DUE_DTE><xsl:value-of select="BINDEREFFEDATE"/></DUE_DTE>
									<DUE_DTE_BINDER_EXP_DTE><xsl:value-of select="DUE_DTE_BINDER_EXP_DTE"/></DUE_DTE_BINDER_EXP_DTE>
									<NUMBER_OF_DAYS><xsl:value-of select="NUMDAYS"/></NUMBER_OF_DAYS>
									<INCLUDE_ON_RENEWAL><xsl:value-of select="INCLUDE_ON_RENEWAL"/></INCLUDE_ON_RENEWAL>
									<SUB_CODE><xsl:value-of select="SUBCODE"/></SUB_CODE>
									<SEQUENCE><xsl:value-of select="SEQUENCE"/></SEQUENCE>
									<DEFIND1><xsl:value-of select="DEFIND1"/></DEFIND1>
									<DEFINDINDICATOR><xsl:value-of select="DEFINDINDICATOR"/></DEFINDINDICATOR>
									<BASIND01><xsl:value-of select="BASIND01"/></BASIND01>
									<BASIND02><xsl:value-of select="BASIND02"/></BASIND02>
									<BASIND03><xsl:value-of select="BASIND03"/></BASIND03>
									<BASIND05><xsl:value-of select="BASIND05"/></BASIND05>
									<RCDUSER><xsl:value-of select="$RCDUSER"/></RCDUSER>
									<SUBJTYPE><xsl:value-of select="SUBJTYPE"/></SUBJTYPE>
									<VALREQ><xsl:value-of select="ISVALREQ"/></VALREQ>
									<TRAN_SUCCESS_INDIC></TRAN_SUCCESS_INDIC>
									<TRAN_ERROR_MSG></TRAN_ERROR_MSG>
								</SUBJ_REC_ROW>

							</xsl:for-each>
						</SUBJ_INFO_ROW>

					</PayLoad>

				</xsl:element>

			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>