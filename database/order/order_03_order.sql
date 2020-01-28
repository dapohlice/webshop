DEFINE ORDER_STATUS ENUM(
    'created','ordered','payed','packed','shiped','cancel',
    'return','return_checked','return_failed','payed_back');
CREATE TABLE orderDB.order(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mail varchar(1000) NOT NULL,
    address BIGINT NOT NULL,
    status ORDER_STATUS NOT NULL,
    timestamp TIMESTAMP,
    FOREIGN KEY (address) REFERENCES orderDB.address(Id)
);
