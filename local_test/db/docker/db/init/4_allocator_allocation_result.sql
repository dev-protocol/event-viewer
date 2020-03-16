DROP TABLE IF EXISTS allocator_allocation_result;

CREATE TABLE allocator_allocation_result(
    event_id TEXT NOT NULL,
    block_number INT NOT NULL,
    log_index INT NOT NULL,
    transaction_index INT NOT NULL,
    metrics TEXT NOT NULL,
    arg_value NUMERIC NOT NULL,
    market TEXT NOT NULL,
    property TEXT NOT NULL,
    lockup_value NUMERIC NOT NULL,
    result NUMERIC NOT NULL,
    raw_data TEXT NOT NULL,
    PRIMARY KEY(event_id)
);

CREATE INDEX ON allocator_allocation_result(
	block_number
);
