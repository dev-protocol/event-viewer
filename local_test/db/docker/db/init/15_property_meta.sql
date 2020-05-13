DROP TABLE IF EXISTS property_meta;

CREATE TABLE property_meta(
	author TEXT NOT NULL,
    property TEXT NOT NULL,
    sender TEXT NOT NULL,
    block_number INT NOT NULL,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    PRIMARY KEY(author, property)
);


CREATE INDEX ON property_meta(
	author
);
