create table userDB.user(
    id bigint AUTO_INCREMENT PRIMARY KEY,
    firstname varchar(250) NOT NULL,
    lastname varchar(250) NOT NULL,
    mail varchar(1000) NOT NULL,
    loginname varchar(20),
    pword varchar(250),
    status boolean NOT NULL DEFAULT TRUE
);
DELIMITER $$
CREATE TRIGGER userDB.user_input_trigger 
BEFORE INSERT
   ON userDB.user FOR EACH ROW
BEGIN
	if CHAR_LENGTH(NEW.firstname ) < 3 OR CHAR_LENGTH(NEW.lastname) < 3
    then
      SIGNAL sqlstate '45001' set message_text = "First- and Lastname must be longer then 3 chars!";
    end if ;

	SET @cname = 1;
	SET @flength = 1;
	SET @lname = "none";
	WHILE(@cname > 0) DO
		SET @lname = CONCAT(SUBSTRING(NEW.firstname,1,@flength),".",SUBSTRING(NEW.lastname,1,20-@flength));

		SELECT count(id) FROM userDB.user WHERE loginname = @lname INTO @cname;
		SET @flength = @flength+1;
	END WHILE;

	SET NEW.loginname = @lname;
END $$
DELIMITER ;