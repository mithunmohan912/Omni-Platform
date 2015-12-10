
------------------------------------------------------------------

UPDATE BASSYS0400 SET SUMDESC='Policy Details' WHERE FILENAME='ASBACPP'

UPDATE BASSYS0400 SET SUMDESC='Umbrella Limits' WHERE FILENAME='ASCRCPP'

UPDATE BASSYS0400 SET SUMDESC='Retained Premium' WHERE FILENAME='BASPMNRT'

-------------------------------------------------------------
INSERT INTO BASSYS1400 VALUES('E', 'Error')
INSERT INTO BASSYS1400 VALUES('U', 'Unedited')
UPDATE BASSYS0701 set LOCATION='99',MASTERCO='99',POLICYCO='99' where FUNCCODE like '%Show' and ISSUECODE='N' and FILENAME = 'ASBUCPP' and ACTTYPE = 'NB' 
--------------------------------------------------------------