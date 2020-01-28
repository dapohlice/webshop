CREATE TABLE orderDB.articleOrderMap(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article BIGINT NOT NULL,
    order BIGINT NOT NULL,
    amount INT NOT NULL,
    property varchar(250),
    FOREIGN KEY (order) REFERENCES orderDB.order(Id),
    FOREIGN KEY (article) REFERENCES orderDB.article(Id)
);