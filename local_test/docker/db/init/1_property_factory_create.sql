DROP TABLE IF EXISTS property_factory_create;

CREATE TABLE property_factory_create(
    event_id TEXT NOT NULL,
    block_number INT NOT NULL,
    log_index INT NOT NULL,
    transaction_index INT NOT NULL,
    from_address TEXT NOT NULL,
    policy TEXT NOT NULL,
    inner_policy TEXT NOT NULL,
    raw TEXT NOT NULL,
    PRIMARY KEY(event_id)
);

create index on property_factory_create(
	block_number
);
