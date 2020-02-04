CREATE TABLE orderDB.orders(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mail varchar(1000) NOT NULL,
    addressId BIGINT NOT NULL,
    statusId TINYINT NOT NULL,
    timestamp DATETIME,
    FOREIGN KEY (addressId) REFERENCES orderDB.address(Id),
    FOREIGN KEY (statusId) REFERENCES orderDB.orderstatus(Id)
);

DELIMITER $$
CREATE TRIGGER orderDB.orderInsertTrigger
    BEFORE INSERT
    ON orderDB.orders FOR EACH ROW
BEGIN
    SET NEW.timestamp = NOW();
END $$
DELIMITER ;
