CREATE TABLE orderDB.orderlog(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    orderId BIGINT NOT NULL,
    timestamp DATETIME,
    user varchar(250) NOT NULL,
    statusId TINYINT NOT NULL,
    info text,
    FOREIGN KEY (orderId) REFERENCES orderDB.orders(Id),
    FOREIGN KEY (statusId) REFERENCES orderDB.orderstatus(Id)
);

DELIMITER $$
CREATE TRIGGER orderDB.orderlogInsertTrigger
    BEFORE INSERT
    ON orderDB.orderlog FOR EACH ROW
BEGIN
    SET NEW.timestamp = NOW();
END $$
DELIMITER ;
