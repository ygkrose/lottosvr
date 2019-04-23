-- Table: maindata

-- DROP TABLE maindata;

CREATE TABLE maindata
(
  nperiod character(10) NOT NULL,
  odate date NOT NULL,
  num1 integer,
  num2 integer,
  num3 integer,
  num4 integer,
  num5 integer,
  num6 integer,
  nums integer,
  totalstake bigint,
  CONSTRAINT mainpk PRIMARY KEY (nperiod, odate)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE maindata
  OWNER TO postgres;
