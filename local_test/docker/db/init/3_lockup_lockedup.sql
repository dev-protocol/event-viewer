DROP TABLE IF EXISTS lockup_lockedup;

CREATE TABLE lockup_lockedup(
    event_id TEXT NOT NULL,
    block_number INT NOT NULL,
    log_index INT NOT NULL,
    transaction_index INT NOT NULL,
    from_address TEXT NOT NULL,
    property TEXT NOT NULL,
    token_value NUMERIC NOT NULL,
    raw_data TEXT NOT NULL,
    PRIMARY KEY(event_id)
);

CREATE INDEX ON lockup_lockedup(
	block_number
);
