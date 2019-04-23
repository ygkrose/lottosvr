-- Table: distdata

-- DROP TABLE distdata;

CREATE TABLE distdata
(
  period character(10) NOT NULL,
  s1 integer,
  s2 integer,
  s3 integer,
  s4 integer,
  s5 integer,
  s6 integer,
  s7 integer,
  s8 integer
)
WITH (
  OIDS=FALSE
);
ALTER TABLE distdata
  OWNER TO postgres;
  
  
  -- Table: maindata

-- DROP TABLE maindata;

CREATE TABLE maindata
(
  period character(10) NOT NULL,
  date date NOT NULL,
  num1 integer NOT NULL,
  num2 integer NOT NULL,
  num3 integer NOT NULL,
  num4 integer NOT NULL,
  num5 integer NOT NULL,
  num6 integer NOT NULL,
  nums integer NOT NULL,
  avg integer,
  range integer,
  totalstake bigint
)
WITH (
  OIDS=FALSE
);
ALTER TABLE maindata
  OWNER TO postgres;

  -- Table: orgseq

-- DROP TABLE orgseq;

CREATE TABLE orgseq
(
  period character(10),
  seq1 integer NOT NULL,
  seq2 integer NOT NULL,
  seq3 integer NOT NULL,
  seq4 integer NOT NULL,
  seq5 integer NOT NULL,
  seq6 integer NOT NULL,
  seqs integer NOT NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE orgseq
  OWNER TO postgres;

-- Table: distmoney

-- DROP TABLE distmoney;

CREATE TABLE distmoney
(
  period character(10) NOT NULL,
  m1 character(12),
  m2 character(12),
  m3 character(12),
  m4 character(12),
  m5 character(12),
  m6 character(12),
  m7 character(12),
  m8 character(12)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE distmoney
  OWNER TO postgres;
