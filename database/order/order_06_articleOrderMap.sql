CREATE TABLE orderDB.articleOrderMap(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    articleId BIGINT NOT NULL,
    orderId BIGINT NOT NULL,
    amount INT NOT NULL,
    property varchar(250),
    FOREIGN KEY (orderId) REFERENCES orderDB.orders(Id),
    FOREIGN KEY (articleId) REFERENCES orderDB.article(Id)
);