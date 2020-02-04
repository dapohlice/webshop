DELIMITER $$
CREATE EVENT orderDB.deleteExpireredOrders_Sheduler
ON SCHEDULE EVERY 1 MINUTE
DO
   BEGIN
		DECLARE var_done INT DEFAULT 0;
		DECLARE order_id BIGINT;
		DECLARE address_id BIGINT;
	
	   	DECLARE curOrder CURSOR FOR SELECT o.id,o.addressId FROM orderDB.orders o WHERE o.statusId = 0 AND o.`timestamp` + INTERVAL 10 MINUTE < NOW();
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET var_done = 1;
		
		OPEN curOrder;
		
		deleteOrder: LOOP
			FETCH NEXT FROM curOrder INTO order_id, address_id;
			IF var_done = 1 THEN LEAVE deleteOrder;
			END IF;
			DELETE FROM orderDB.articleOrderMap WHERE orderId = order_id;
			DELETE FROM orderDB.orders WHERE id = order_id;
			DELETE FROM orderDB.address WHERE id = address_id;
		END LOOP deleteOrder;
		CLOSE curOrder;
   END $$
DELIMITER ;


