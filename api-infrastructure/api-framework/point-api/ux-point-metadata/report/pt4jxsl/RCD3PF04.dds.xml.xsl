<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format"
	xmlns:fn="http://www.w3.org/2005/02/xpath-functions">
	<xsl:include href="ConvertDateCYYMMDDtoMMDDYYYY.xsl" />
	<xsl:include href="ConvertDateCYYMMDDtoMMDDYY.xsl" />
	<xsl:include href="ConvertTimeHHMMSS.xsl" />
	<xsl:include href="Prepad.xsl" />
	<xsl:include href="Postpad.xsl" />
	<xsl:param name="date" />
	<xsl:param name="time" />
	<xsl:output encoding="UTF-8" />
	<xsl:preserve-space elements="*" />

	<xsl:template match="/">
		<fo:root>
			<fo:layout-master-set>
				<fo:simple-page-master master-name="LandscapeReport"
					page-width="11in" page-height="8.5in" margin-top=".17in"
					margin-bottom=".17in" margin-left=".25in" margin-right=".25in">
					<fo:region-body margin-top="0in" />
					<fo:region-before extent="0in" />
					<fo:region-after extent="0in" />
				</fo:simple-page-master>
				<fo:simple-page-master master-name="PortraitReport"
					page-width="8.5in" page-height="11in" margin-top=".25in"
					margin-bottom=".25in" margin-left=".17in" margin-right=".17in">
					<fo:region-body margin-top="0in" />
					<fo:region-before extent="0in" />
					<fo:region-after extent="0in" />
				</fo:simple-page-master>
			</fo:layout-master-set>

			<fo:page-sequence master-reference="LandscapeReport">
				<fo:flow flow-name="xsl-region-body">
					<xsl:apply-templates select="/POINTXML/file/record" />
				</fo:flow>
			</fo:page-sequence>

		</fo:root>
	</xsl:template>

	<!-- Auto Generated XSLT for printer file DDS RCD3PF04 -->
	<xsl:template match="record[@name = 'ZAPAGHDR']"
		xml:space="preserve">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zacmp" />
				</xsl:with-param>
				<xsl:with-param name="len">
					40
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			NSF Check Report
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zausr" />
				</xsl:with-param>
				<xsl:with-param name="len">
					10
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zapgm" />
				</xsl:with-param>
				<xsl:with-param name="len">
					10
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			<xsl:value-of select="$date" />
			<xsl:value-of select="$time" />
			Page
			<fo:page-number />
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zbqntx" />
				</xsl:with-param>
				<xsl:with-param name="len">
					16
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			From Date:
			<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY">
				<xsl:with-param name="datefld">
					<xsl:call-template name="Prepad">
						<xsl:with-param name="padVar">
							<xsl:value-of select="vbfromdte" />
						</xsl:with-param>
						<xsl:with-param name="len">
							6
						</xsl:with-param>
						<xsl:with-param name="padChar">
							0
						</xsl:with-param>
					</xsl:call-template>
				</xsl:with-param>
			</xsl:call-template>
			To Date:
			<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY">
				<xsl:with-param name="datefld">
					<xsl:call-template name="Prepad">
						<xsl:with-param name="padVar">
							<xsl:value-of select="vbbidt" />
						</xsl:with-param>
						<xsl:with-param name="len">
							6
						</xsl:with-param>
						<xsl:with-param name="padChar">
							0
						</xsl:with-param>
					</xsl:call-template>
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZCKEYHDR']"
		xml:space="preserve">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			NSF Posted Date
			<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY">
				<xsl:with-param name="datefld">
					<xsl:call-template name="Prepad">
						<xsl:with-param name="padVar">
							<xsl:value-of select="vcc4dt" />
						</xsl:with-param>
						<xsl:with-param name="len">
							6
						</xsl:with-param>
						<xsl:with-param name="padChar">
							0
						</xsl:with-param>
					</xsl:call-template>
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZDKEYHDR']"
		xml:space="preserve">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			Location Company
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zdaacd" />
				</xsl:with-param>
				<xsl:with-param name="len">
					2
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			-
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zdhltx" />
				</xsl:with-param>
				<xsl:with-param name="len">
					30
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZEKEYHDR']"
		xml:space="preserve">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			Master Company
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zeabcd" />
				</xsl:with-param>
				<xsl:with-param name="len">
					2
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			-
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zehmtx" />
				</xsl:with-param>
				<xsl:with-param name="len">
					30
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			-----------------------------------------------------------------------------------------------------------------------------------
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre"> Agency Payby Effective Expiration
			Check </fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre"> Sym Policy# Mod Number Code Date Date
			Number Amount </fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			-----------------------------------------------------------------------------------------------------------------------------------
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZFCOLHDG']"
		xml:space="preserve">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZFDTLRCD']"
		xml:space="preserve">
		<!-- FSIT: 168489, Resolution: 59936 - Start -->
		<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" 
			line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param 
			name="padVar"><xsl:value-of select="zfpolsym"/></xsl:with-param><xsl:with-param 
			name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> 
			<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of 
			select="zfpolno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param 
			name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template 
			name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zfpolmod"/></xsl:with-param><xsl:with-param 
			name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> 
			<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of 
			select="zfiwtx"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param 
			name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template 
			name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zfe2st"/></xsl:with-param><xsl:with-param 
			name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> 
			<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template 
			name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vfbqdt"/></xsl:with-param><xsl:with-param 
			name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> 
			<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template 
			name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vfbrdt"/></xsl:with-param><xsl:with-param 
			name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> 
			<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of 
			select="zfd4rcptid"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param 
			name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template 
			name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zfd4amtpay"/></xsl:with-param><xsl:with-param 
			name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> 
			</fo:block> -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zfpolsym" />
				</xsl:with-param>
				<xsl:with-param name="len">
					3
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zfpolno" />
				</xsl:with-param>
				<xsl:with-param name="len">
					7
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zfpolmod" />
				</xsl:with-param>
				<xsl:with-param name="len">
					2
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zfiwtx" />
				</xsl:with-param>
				<xsl:with-param name="len">
					7
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zfe2st" />
				</xsl:with-param>
				<xsl:with-param name="len">
					1
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY">
				<xsl:with-param name="datefld">
					<xsl:call-template name="Prepad">
						<xsl:with-param name="padVar">
							<xsl:value-of select="vfbqdt" />
						</xsl:with-param>
						<xsl:with-param name="len">
							6
						</xsl:with-param>
						<xsl:with-param name="padChar">
							0
						</xsl:with-param>
					</xsl:call-template>
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY">
				<xsl:with-param name="datefld">
					<xsl:call-template name="Prepad">
						<xsl:with-param name="padVar">
							<xsl:value-of select="vfbrdt" />
						</xsl:with-param>
						<xsl:with-param name="len">
							6
						</xsl:with-param>
						<xsl:with-param name="padChar">
							0
						</xsl:with-param>
					</xsl:call-template>
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zfd4rcptid" />
				</xsl:with-param>
				<xsl:with-param name="len">
					8
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="Prepad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zfd4amtpay" />
				</xsl:with-param>
				<xsl:with-param name="len">
					20
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<!-- FSIT: 168489, Resolution: 59936 - End -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZGKEYTTL']"
		xml:space="preserve">
		<!-- FSIT: 168489, Resolution: 59936 - Start -->
		<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" 
			line-height="9pt" white-space="pre" > Total Master Company <xsl:call-template 
			name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zgabcd"/></xsl:with-param><xsl:with-param 
			name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> 
			- <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of 
			select="zgmcowrit"/></xsl:with-param><xsl:with-param name="len">14</xsl:with-param><xsl:with-param 
			name="padChar"> </xsl:with-param></xsl:call-template> </fo:block> -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			Total Master Company
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zgabcd" />
				</xsl:with-param>
				<xsl:with-param name="len">
					2
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			-
			<xsl:call-template name="Prepad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zgmcowrit" />
				</xsl:with-param>
				<xsl:with-param name="len">
					20
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<!-- FSIT: 168489, Resolution: 59936 - End -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZHKEYTTL']"
		xml:space="preserve">
		<!-- FSIT: 168489, Resolution: 59936 - Start -->
		<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" 
			line-height="9pt" white-space="pre" > Total Location Company <xsl:call-template 
			name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zhaacd"/></xsl:with-param><xsl:with-param 
			name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> 
			- <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of 
			select="zhlocwrit"/></xsl:with-param><xsl:with-param name="len">14</xsl:with-param><xsl:with-param 
			name="padChar"> </xsl:with-param></xsl:call-template> </fo:block> -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			Total Location Company
			<xsl:call-template name="Postpad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zhaacd" />
				</xsl:with-param>
				<xsl:with-param name="len">
					2
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
			-
			<xsl:call-template name="Prepad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zhlocwrit" />
				</xsl:with-param>
				<xsl:with-param name="len">
					20
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<!-- FSIT: 168489, Resolution: 59936 - End -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZIKEYTTL']"
		xml:space="preserve">
		<!-- FSIT: 168489, Resolution: 59936 - Start -->
		<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" 
			line-height="9pt" white-space="pre" > Total NSF Posted Date <xsl:call-template 
			name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template 
			name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vic4dt"/></xsl:with-param><xsl:with-param 
			name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> 
			- <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of 
			select="zijava"/></xsl:with-param><xsl:with-param name="len">14</xsl:with-param><xsl:with-param 
			name="padChar"> </xsl:with-param></xsl:call-template> </fo:block> -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			Total NSF Posted Date
			<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY">
				<xsl:with-param name="datefld">
					<xsl:call-template name="Prepad">
						<xsl:with-param name="padVar">
							<xsl:value-of select="vic4dt" />
						</xsl:with-param>
						<xsl:with-param name="len">
							6
						</xsl:with-param>
						<xsl:with-param name="padChar">
							0
						</xsl:with-param>
					</xsl:call-template>
				</xsl:with-param>
			</xsl:call-template>
			-
			<xsl:call-template name="Prepad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zijava" />
				</xsl:with-param>
				<xsl:with-param name="len">
					20
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<!-- FSIT: 168489, Resolution: 59936 - End -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZJFINTTL']"
		xml:space="preserve">
		<!-- FSIT: 168489, Resolution: 59936 - Start -->
		<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" 
			line-height="9pt" white-space="pre" > Final Total NSF Amount - <xsl:call-template 
			name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zji9va"/></xsl:with-param><xsl:with-param 
			name="len">14</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> 
			</fo:block> -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
			Final Total NSF Amount -
			<xsl:call-template name="Prepad">
				<xsl:with-param name="padVar">
					<xsl:value-of select="zji9va" />
				</xsl:with-param>
				<xsl:with-param name="len">
					20
				</xsl:with-param>
				<xsl:with-param name="padChar">
				</xsl:with-param>
			</xsl:call-template>
		</fo:block>
		<!-- FSIT: 168489, Resolution: 59936 - End -->
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
	<xsl:template match="record[@name = 'ZKENDRPT']"
		xml:space="preserve">
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre"> ** END OF REPORT ** </fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
		<fo:block text-align="justify" font-size="9pt" font-family="monospace"
			line-height="9pt" white-space="pre">
		</fo:block>
	</xsl:template>
</xsl:stylesheet>