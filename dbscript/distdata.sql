-- Table: distdata

-- DROP TABLE distdata;

CREATE TABLE distdata
(
  nperiod character(10) NOT NULL,
  s1 bigint,
  s2 bigint,
  s3 bigint,
  s4 bigint,
  s5 bigint,
  s6 bigint,
  s7 bigint,
  s8 bigint,
  CONSTRAINT distpk PRIMARY KEY (nperiod)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE distdata
  OWNER TO postgres;
