INSERT INTO userDB.webuser(firstname ,lastname,mail,pword) VALUES 
    ('admin','dmin','admin@localhost','$2b$08$LLb8STorFozh/t9urB31heDb.sNmAL0ENnx.y52inEWKKJT.ABTz6'),
    ('Adrian','Neubert','adri.an@gmx.de','$2b$08$LLb8STorFozh/t9urB31heDb.sNmAL0ENnx.y52inEWKKJT.ABTz6'),
    ('Lukas','Klausnitzer','lukas.k@luke.de','$2b$08$LLb8STorFozh/t9urB31heDb.sNmAL0ENnx.y52inEWKKJT.ABTz6'),
    ('Sahar','Momenzadeh','sarah.m@mail.net','$2b$08$LLb8STorFozh/t9urB31heDb.sNmAL0ENnx.y52inEWKKJT.ABTz6'),
    ('Alexander','Pohl','ap@pa.de','$2b$08$LLb8STorFozh/t9urB31heDb.sNmAL0ENnx.y52inEWKKJT.ABTz6');

INSERT INTO userDB.webgroup(groupname,auth_user,auth_product,auth_group,auth_normalOrders,auth_allOrders)
    VALUE("Admin",true,true,true,true,true);

INSERT INTO userDB.webuser_groups_webgroup(webuserId,webgroupId) VALUES
    (1,1),
    (2,1),
    (3,1),
    (4,1),
    (5,1);
