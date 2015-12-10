
---------------------------------- table for user groups---------------------------------------------------------------------------------

CREATE TABLE acl_sid (
  id         bigint IDENTITY(1,1) NOT NULL,
  principal  numeric(3) NOT NULL,
  sid        varchar(100) NOT NULL,
  /* Keys */
  CONSTRAINT acl_sid_pk_
    PRIMARY KEY (id)
);


CREATE INDEX acl_sid_sid
  ON acl_sid
  (sid);

CREATE UNIQUE INDEX acl_sid_unique_uk_1
  ON acl_sid
  (sid, principal);
  
 

 -- -----------------------------------table for screen Names-----------------------------------------------------------------------------------
 
 
 CREATE TABLE acl_class (
  id       bigint IDENTITY(1,1) NOT NULL,
  "class"  varchar(255) NOT NULL,
  /* Keys */
  CONSTRAINT acl_class_pk_acl_child_permissions
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX acl_class_unique_uk_2
  ON acl_class
  ("class");
  
 
 
 -----------------------------------------table for sceen elements-------------------------------------------------------------------------------------
 CREATE TABLE acl_object_identity (
  id                  bigint IDENTITY(1,1) NOT NULL ,
  object_id_class     bigint NOT NULL,
  object_id_identity  varchar(255),
  parent_object       bigint,
  owner_sid           bigint,
  entries_inheriting  numeric(3) NOT NULL,
  havechild           numeric(3),
  belongsto           varchar(255),
  /* Keys */
  CONSTRAINT acl_object_identity_pk_acl_entry
    PRIMARY KEY (id),
  /* Foreign keys */
  CONSTRAINT foreign_fk_1
    FOREIGN KEY (parent_object)
    REFERENCES acl_object_identity(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION, 
  CONSTRAINT foreign_fk_2
    FOREIGN KEY (object_id_class)
    REFERENCES acl_class(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION, 
  CONSTRAINT foreign_fk_3
    FOREIGN KEY (owner_sid)
    REFERENCES acl_sid(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE INDEX acl_object_identity_foreign_fk_1
  ON acl_object_identity
  (parent_object);

CREATE INDEX acl_object_identity_foreign_fk_3
  ON acl_object_identity
  (owner_sid);

CREATE UNIQUE INDEX acl_object_identity_unique_uk_3
  ON acl_object_identity
  (object_id_class, object_id_identity);


 ---------------------------------------------table for mask on elements---------------------------------------------------------------------------------

CREATE TABLE acl_entry (
  id             bigint IDENTITY(1,1) NOT NULL,
  acl_object_id  bigint NOT NULL,
  ace_order      integer NOT NULL,
  sid_id         bigint NOT NULL,
  mask           integer NOT NULL,
  granting       smallint NOT NULL,
  audit_success  smallint NOT NULL,
  audit_failure  smallint NOT NULL,
  /* Keys */
  CONSTRAINT acl_entry_pk_acl_class
    PRIMARY KEY (id),
  /* Foreign keys */
  CONSTRAINT foreign_fk_4
    FOREIGN KEY (acl_object_id)
    REFERENCES acl_object_identity(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION, 
  CONSTRAINT foreign_fk_5
    FOREIGN KEY (sid_id)
    REFERENCES acl_sid(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE INDEX acl_entry_foreign_fk_5
  ON acl_entry
  (sid_id);

CREATE UNIQUE INDEX acl_entry_unique_uk_4
  ON acl_entry
  (acl_object_id, ace_order, sid_id);
  
