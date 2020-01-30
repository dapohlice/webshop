/*
 * Address
 */
INSERT INTO orderDB.address(firstname,lastname,street,streetnumber,plz,town,state,country) VALUES
	('Rick','Sanchez','Crazy Street','137','01370','Maintown','Califonia','United States'),
	('Hans','Meier','Robert-Blum-Straße','45a','01556','Stadt',NULL,'Deutschland'),
	('Josephine','Herrmann','Herrmann-Meier-Straße','15 a','04897','Musterstadt',NULL,'Deutschland'),
	('Homer','Simpson','Evergreenterace','74','00001','Springfield','State','United States'),
	('Chloé','Dubois','Rue de France','22','056891','Paris',NULL,'France'),
	('Clara','Moreau','Place Antoine-Furetière','1562','052357','Paris',NULL,'France');
/**
 * Article
 */	
INSERT INTO orderDB.article(article_id,name,price) VALUES
	(0,'T-Shirt',1200),
	(0,'Hoodie',4490),
	(0,'T-Shirt V',1500),
	(0,'T-Shirt Red',1200),
	(0,'Hoodie Black',5090),
	(0,'Calendar 2020',2200);
/**
 * Order
 */

INSERT INTO orderDB.`order`(mail,addressId,statusId) VALUES
	('hans.meiser@gmx.de',2,0),
	('rick.sanchez@secret.net',1,6),
	('jos1992',3,3),
	('h.simpson@aol.com',4,2),
	('chloe.du89',5,1),
	('moreau5.1976',6,5);

INSERT INTO orderDB.orderlog(orderId,statusId,user,info) VALUES
	(1,1,"dummy","message"),
	(1,2,"dummy","message"),
	(1,3,"dummy","message"),
	(1,4,"dummy","message"),
	(1,5,"dummy","message"),
	(1,6,"dummy","message"),
	(3,1,"dummy","message"),
	(3,2,"dummy","message"),
	(3,3,"dummy","message"),
	(4,1,"dummy","message"),
	(4,2,"dummy","message"),
	(4,3,"dummy","message"),
	(4,4,"dummy","message"),
	(5,1,"dummy","message"),
	(6,1,"dummy","message"),
	(6,2,"dummy","message"),
	(6,3,"dummy","message"),
	(6,4,"dummy","message"),
	(6,5,"dummy","message");


/**
 * ArticleOrderMap
 */
INSERT INTO orderDB.articleOrderMap	(articleId,orderId,amount,property) VALUES
		(1,1,1,'M'),
		(2,1,1,'M'),
		(3,2,1,'L'),
		(4,2,1,'L'),
		(5,2,1,'L'),
		(6,4,7,''),
		(1,3,2,'XXL'),
		(1,3,2,'XXL'),
		(5,5,2,'S'),
		(4,6,1,'S'),
		(6,6,10,'');
