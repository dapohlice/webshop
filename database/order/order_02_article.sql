CREATE TABLE orderDB.article
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL,
    name varchar(250),
    timestamp DATETIME,
    price INT
);
DELIMITER $$
CREATE TRIGGER orderDB.articleInsertTrigger
    BEFORE INSERT
    ON orderDB.article FOR EACH ROW
BEGIN
    SET NEW.timestamp = NOW();
END $$
DELIMITER ;