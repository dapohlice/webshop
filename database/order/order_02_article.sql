CREATE TABLE orderDB.article
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL,
    name varchar(250),
    timestamp TIMESTAMP,
    price INT
);