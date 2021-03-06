CREATE DATABASE test;
CREATE USER 'test'@'%';
ALTER USER 'test'@'%'
IDENTIFIED BY 'test' ;
GRANT Alter ON *.* TO 'test'@'%';
GRANT Create ON *.* TO 'test'@'%';
GRANT Create view ON *.* TO 'test'@'%';
GRANT Delete ON *.* TO 'test'@'%';
GRANT Delete history ON *.* TO 'test'@'%';
GRANT Drop ON *.* TO 'test'@'%';
GRANT Grant option ON *.* TO 'test'@'%';
GRANT Index ON *.* TO 'test'@'%';
GRANT Insert ON *.* TO 'test'@'%';
GRANT References ON *.* TO 'test'@'%';
GRANT Select ON *.* TO 'test'@'%';
GRANT Show view ON *.* TO 'test'@'%';
GRANT Trigger ON *.* TO 'test'@'%';
GRANT Update ON *.* TO 'test'@'%';
GRANT Alter routine ON *.* TO 'test'@'%';
GRANT Create routine ON *.* TO 'test'@'%';
GRANT Create temporary tables ON *.* TO 'test'@'%';
GRANT Execute ON *.* TO 'test'@'%';
GRANT Lock tables ON *.* TO 'test'@'%';
FLUSH PRIVILEGES;