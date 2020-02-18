DROP TABLE IF EXISTS allocator_before_allocation;

CREATE TABLE allocator_before_allocation(
    event_id TEXT NOT NULL,
    block_number INT NOT NULL,
    log_index INT NOT NULL,
    transaction_index INT NOT NULL,
    blocks NUMERIC NOT NULL,
    mint NUMERIC NOT NULL,
    token_value NUMERIC NOT NULL,
    market_value NUMERIC NOT NULL,
    assets NUMERIC NOT NULL,
    total_assets NUMERIC NOT NULL,
    raw_data TEXT NOT NULL,
    PRIMARY KEY(event_id)
);

CREATE INDEX ON allocator_before_allocation(
	block_number
);
