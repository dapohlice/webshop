create table userDB.webgroup(
    id bigint AUTO_INCREMENT PRIMARY KEY,
    groupname varchar(250) NOT NULL,
    auth_user boolean NOT NULL DEFAULT FALSE,
    auth_product boolean NOT NULL DEFAULT FALSE,
    auth_group boolean NOT NULL DEFAULT FALSE,
    auth_normalOrders boolean NOT NULL DEFAULT FALSE,
    auth_allOrders boolean NOT NULL DEFAULT FALSE
);