DROP TABLE IF EXISTS property_authentication;

CREATE TABLE property_authentication(
	id BIGSERIAL NOT NULL,
    block_number INT NOT NULL,
    property TEXT NOT NULL,
    metrics TEXT NOT NULL,
    market TEXT NOT NULL,
    authentication_id TEXT NOT NULL,
	PRIMARY KEY(id)
);


CREATE INDEX ON property_authentication(
	property
);
