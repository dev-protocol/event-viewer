DROP TABLE IF EXISTS metrics_factory_destroy;

CREATE TABLE metrics_factory_destroy(
    event_id TEXT NOT NULL,
    block_number INT NOT NULL,
    log_index INT NOT NULL,
    transaction_index INT NOT NULL,
    from_address TEXT NOT NULL,
    metrics TEXT NOT NULL,
    raw_data TEXT NOT NULL,
    PRIMARY KEY(event_id)
);

CREATE INDEX ON metrics_factory_destroy(
	block_number
);
