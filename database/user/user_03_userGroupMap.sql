create table userDB.webuser_groups_webgroup(
    webuserId bigint NOT NULL,
    webgroupId bigint NOT NULL,
    CONSTRAINT PK_user_groups_group PRIMARY KEY (webuserId,webgroupId),
    FOREIGN KEY (webuserId) REFERENCES userDB.webuser(Id),
    FOREIGN KEY (webgroupId) REFERENCES userDB.webgroup(Id)
);