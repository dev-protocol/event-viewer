DROP TABLE IF EXISTS reward_calculation_result;

CREATE TABLE reward_calculation_result(
    alocator_allocation_result_event_id TEXT NOT NULL,
    block_number INT NOT NULL,
    metrics TEXT NOT NULL,
    lockup NUMERIC NOT NULL,
    allocate_result NUMERIC NOT NULL,
    holder_reward NUMERIC NOT NULL,
    staking_reward NUMERIC NOT NULL,
    policy TEXT NOT NULL,
    PRIMARY KEY(alocator_allocation_result_event_id)
);


CREATE INDEX ON reward_calculation_result(
    block_number
);
