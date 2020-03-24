DROP TABLE IF EXISTS policy_factory_create;

CREATE TABLE policy_factory_create(
    event_id TEXT NOT NULL,
    block_number INT NOT NULL,
    log_index INT NOT NULL,
    transaction_index INT NOT NULL,
    from_address TEXT NOT NULL,
    policy_address TEXT NOT NULL,
    inner_policy TEXT NOT NULL,
    raw_data TEXT NOT NULL,
    PRIMARY KEY(event_id)
);

CREATE INDEX ON policy_factory_create(
	block_number
);
