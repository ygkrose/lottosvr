-- Table: orgseq

-- DROP TABLE orgseq;

CREATE TABLE orgseq
(
  nperiod character(10) NOT NULL,
  seq1 integer,
  seq2 integer,
  seq3 integer,
  seq4 integer,
  seq5 integer,
  seq6 integer,
  seqs integer,
  CONSTRAINT orgseqpk PRIMARY KEY (nperiod)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE orgseq
  OWNER TO postgres;
