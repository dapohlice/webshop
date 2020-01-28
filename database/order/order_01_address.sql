create table orderDB.address(
    id bigint AUTO_INCREMENT PRIMARY KEY,
    firstname varchar(250) NOT NULL,
    lastname varchar(250) NOT NULL,
    street varchar(250) NOT NULL,
    streetnumber varchar(50),
    plz varchar(7) NOT NULL,
    town varchar(250) NOT NULL,
    state varchar(250),
    country varchar(250) NOT NULL
);