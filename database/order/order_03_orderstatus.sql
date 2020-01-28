CREATE TABLE orderDB.orderstatus(
    id TINYINT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    nextId TINYINT,
    needsPermission BOOLEAN
);

INSERT INTO orderDB.orderstatus(id,name,nextId,needsPermission) VALUES
    (0,'Created',   1,FALSE),
    (1,'Ordered',   2,FALSE),
    (2,'Payed',     3,FALSE),
    (3,'Packed',    4,FALSE),
    (4,'Shiped',    NULL,TRUE),
    (5,'Canceled',  NULL,TRUE),
    (6,'Returned',  NULL,FALSE),
    (7,'Return Checked',    9,FALSE),
    (8,'Return Failed',     7,FALSE),
    (9,'Payed Back',        NULL,TRUE);
