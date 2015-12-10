

CREATE TABLE USER_PERSONALIZATION
( 
USERNAME varchar(255),
APPS_ADDED VARCHAR(255),
USER_HOME_SCREEN varchar(max), 
USER_GREETING varchar(255), 
USER_BANNER varchar(255), 
USER_THEME varchar(255), 
USER_FONT varchar(255), 
USER_OPTIONBAR varchar(255),
FAVOURITE_EXPRSPROC varchar(255)
);



----------------------------------------------------------------

CREATE TABLE APPLICATIONS
(
APP_ID int PRIMARY KEY,
APPNAME varchar(255),
APP_TITLE varchar(255),
APP_ICON varchar(255),
APP_TARGET varchar(255),
EXPRESSPROCESSING varchar(10),
EPHEADER varchar(255),
APP_URL varchar(255)
);



------------------------------------------------------------------
CREATE TABLE APPLICATION_TABS
(
TAB_ID int PRIMARY KEY,
TAB_TEXT varchar(255),
TAB_TITLE varchar(255),
TAB_CLASS varchar(255),
ASSOCIATED_APPLICATION VARCHAR(255)
);



--------------------------------------------------------------------
CREATE TABLE APPLICATION_TAB_LINKS
(
LINK_NO int PRIMARY KEY, 
LINK_ID varchar(255) NOT NULL, 
LINK_TITLE varchar(255),
LINK_ICON varchar(255),
LINK_URL varchar(255),
LINK_TEXT varchar(255),
EXPRESS_PROCS varchar(255),
ASSOCIATED_TABID varchar(255),
LINK_ACTION varchar(255)
);

