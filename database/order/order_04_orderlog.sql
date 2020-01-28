CREATE TABLE orderDB.orderlog(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order BIGINT NOT NULL,
    timestamp TIMESTEMP NOT NULL,
    user varchar(250) NOT NULL,
    status ORDER_STATUS NOT NULL,
    info text,
    FOREIGN KEY (order) REFERENCES orderDB.order(Id)
);