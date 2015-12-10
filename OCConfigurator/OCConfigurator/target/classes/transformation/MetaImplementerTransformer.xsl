<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes"/>
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:include href="StringUtils.xsl"/>
	<xsl:variable name="templateElements" select="/root/templateElements"/>
	<xsl:template match="/root">
		<SCREENRECORD>
			<PROCESSING_INFO>
				<RqUID>SCREEN_EDIT</RqUID>
			</PROCESSING_INFO>
			<KEY>
				<xsl:value-of select="KEY"/>
			</KEY>
			<xsl:call-template name="ScreenInfo"/>
		</SCREENRECORD>
	</xsl:template>
	<xsl:template name="ScreenInfo">
		<xsl:if test="metadata/title">
			<SCREENINFO>
				<TITLE>
					<xsl:call-template name="TruncateString">
						<xsl:with-param name="targetVar" select="metadata/title"/>
						<xsl:with-param name="allowablelength" select="number(35)"/>
					</xsl:call-template>
				</TITLE>
				<xsl:if test="metadata/properties">
					<xsl:for-each select="metadata/properties">
						<xsl:variable name="propname" select="name"/>
						<xsl:element name="{$propname}">
							<xsl:value-of select="value"/>
						</xsl:element>
					</xsl:for-each>
				</xsl:if>
				<ITEM>
					<xsl:value-of select="ITEM"/>
				</ITEM>
				<COUNTRYWIDE>
					<xsl:choose>
						<xsl:when test="STATE='US'">Y</xsl:when>
						<xsl:otherwise>N</xsl:otherwise>
					</xsl:choose>
				</COUNTRYWIDE>
			</SCREENINFO>
			<xsl:call-template name="DataInfo"/>
		</xsl:if>
	</xsl:template>
	<xsl:template name="DataInfo">
		<xsl:if test="metadata/section/subsection/element">
			<xsl:for-each select="metadata/section/subsection/element">
				<xsl:variable name="elementName" select="translate(name, '_', ' ')"/>
				<xsl:variable name="elementLabel">
					<xsl:call-template name="TruncateString">
						<xsl:with-param name="targetVar" select="label"/>
						<xsl:with-param name="allowablelength" select="number(16)"/>
					</xsl:call-template>
				</xsl:variable>
				<xsl:variable name="type" select="type"/>
				<xsl:variable name="templateElement" select="contains($templateElements, name)"/>
				<xsl:variable name="controlgroupExist" select="child::node()[name()='controlgroup'] != ''"/>
				<xsl:if test="$type!='button' and $type!='hidden' and not($controlgroupExist) and not($templateElement)">
					<DATA>
						<USRLABEL>
							<xsl:call-template name="ToUpper">
								<xsl:with-param name="val" select="$elementLabel"/>
							</xsl:call-template>
						</USRLABEL>
						<RECORDFIELD>
							<xsl:value-of select="$elementName"/>
						</RECORDFIELD>
						<xsl:if test="properties">
							<xsl:variable name="dataTypeOld" select="properties[name='datatype']/value"/>
							<xsl:for-each select="properties">
								<xsl:variable name="propname">
									<xsl:call-template name="ToUpper">
										<xsl:with-param name="val" select="name"/>
									</xsl:call-template>
								</xsl:variable>
								<xsl:variable name="propvalue" select="value"/>
								<xsl:choose>
									<xsl:when test="$propname='INDICATOR'">
										<xsl:choose>
											<xsl:when test="$propvalue='add'">
												<EDIT>Y</EDIT>
												<DYN_ADD>Y</DYN_ADD>
												<ProcMsg>Enqueued for addition</ProcMsg>
												<DELETE_FROMDB>0</DELETE_FROMDB>
											</xsl:when>
											<xsl:when test="$propvalue='update'">
												<EDIT>Y</EDIT>
												<DYN_ADD>N</DYN_ADD>
												<ProcMsg>Enqueued for editing</ProcMsg>
												<DELETE_FROMDB>0</DELETE_FROMDB>
											</xsl:when>
											<xsl:when test="$propvalue='delete'">
												<EDIT>Delete</EDIT>
												<DYN_ADD></DYN_ADD>
												<ProcMsg>Enqueued for deletion</ProcMsg>
												<DELETE_FROMDB>-1</DELETE_FROMDB>
											</xsl:when>
											<xsl:otherwise>
												<EDIT></EDIT>
												<DYN_ADD></DYN_ADD>
												<ProcMsg></ProcMsg>
												<DELETE_FROMDB>0</DELETE_FROMDB>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:when>
									<xsl:when test="$propname='LABEL_OLD'">
										<USRLABEL_OLD>
											<xsl:choose>
												<xsl:when test="not($propvalue='')">
													<xsl:call-template name="TruncateString">
														<xsl:with-param name="targetVar">
															<xsl:call-template name="ToUpper">
																<xsl:with-param name="val" select="$propvalue"/>
															</xsl:call-template>
														</xsl:with-param>
														<xsl:with-param name="allowablelength" select="number(16)"/>
													</xsl:call-template>
												</xsl:when>
												<xsl:otherwise>
													<xsl:call-template name="ToUpper">
														<xsl:with-param name="val" select="$elementLabel"/>
													</xsl:call-template>
												</xsl:otherwise>
											</xsl:choose>
										</USRLABEL_OLD>
									</xsl:when>
									<xsl:when test="$propname='NAME_OLD'">
										<RECORDFIELD_OLD>
											<xsl:choose>
												<xsl:when test="not($propvalue='')">
													<xsl:value-of select="translate($propvalue, '_', ' ')"/>
												</xsl:when>
												<xsl:otherwise>
													<xsl:value-of select="$elementName"/>
												</xsl:otherwise>
											</xsl:choose>
										</RECORDFIELD_OLD>
									</xsl:when>
									<xsl:when test="$propname='DATATYPE_OLD'">
										<DATATYPE_OLD>
											<xsl:choose>
												<xsl:when test="not($propvalue='')">
													<xsl:value-of select="$propvalue"/>
												</xsl:when>
												<xsl:otherwise>
													<xsl:value-of select="$dataTypeOld"/>
												</xsl:otherwise>
											</xsl:choose>
										</DATATYPE_OLD>
									</xsl:when>
									<xsl:when test="$propname='REQUIRED_PT'">
										<REQUIRED>
											<xsl:value-of select="$propvalue"/>
										</REQUIRED>
									</xsl:when>
									<xsl:otherwise>
										<xsl:element name="{$propname}">
											<xsl:value-of select="$propvalue"/>
										</xsl:element>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:for-each>
							<xsl:if test="not(properties/name/.='indicator')">
								<EDIT></EDIT>
								<DYN_ADD></DYN_ADD>
								<ProcMsg></ProcMsg>
								<DELETE_FROMDB>0</DELETE_FROMDB>
							</xsl:if>
							<xsl:if test="not(properties/name/.='label_old')">
								<USRLABEL_OLD>
									<xsl:call-template name="ToUpper">
										<xsl:with-param name="val" select="$elementLabel"/>
									</xsl:call-template>
								</USRLABEL_OLD>
							</xsl:if>
							<xsl:if test="not(properties/name/.='name_old')">
								<RECORDFIELD_OLD>
									<xsl:value-of select="$elementName"/>
								</RECORDFIELD_OLD>
							</xsl:if>
							<xsl:if test="not(properties/name/.='datatype_old')">
								<DATATYPE_OLD>
									<xsl:value-of select="$dataTypeOld"/>
								</DATATYPE_OLD>
							</xsl:if>
						</xsl:if>
						<ErrIndc/>
					</DATA>
				</xsl:if>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>