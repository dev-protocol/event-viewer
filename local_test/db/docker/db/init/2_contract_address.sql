DROP TABLE IF EXISTS contract_address;

CREATE TABLE contract_address(
    batch_name TEXT NOT NULL,
    contract_address TEXT NOT NULL,
    PRIMARY KEY(batch_name)
);

INSERT INTO contract_address VALUES ('allocator-allocation-result', '0xF743b637425EA171018980cF086082C474d7974F');
INSERT INTO contract_address VALUES ('allocator-before-allocation', '0xF743b637425EA171018980cF086082C474d7974F');
INSERT INTO contract_address VALUES ('lockup-lockedup', '0x3d40fab11ee30e3aa1900ccfafd190f0851a6157');
INSERT INTO contract_address VALUES ('market-factory-create', '0x1C98ad0777973F879EB0Ca89fdD7c90Fc762bA5a');
INSERT INTO contract_address VALUES ('metrics-factory-create', '0xC6eDBd2bcD3dD5f13b9AFA578458A37A42a53040');
INSERT INTO contract_address VALUES ('metrics-factory-destroy', '0xC6eDBd2bcD3dD5f13b9AFA578458A37A42a53040');
INSERT INTO contract_address VALUES ('policy-factory-create', '0xca0f09564b1d0182b907352c631734d65c457d77');
INSERT INTO contract_address VALUES ('property-factory-create', '0xcb90fc08d405b75f5242cfe8f8d0397de19d149c');

