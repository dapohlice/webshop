create table userDB.user_groups_group(
    userId bigint NOT NULL,
    groupId bigint NOT NULL,
    CONSTRAINT PK_user_groups_group PRIMARY KEY (userId,groupId),
    FOREIGN KEY (userId) REFERENCES userDB.user(Id),
    FOREIGN KEY (groupId) REFERENCES userDB.group(Id)
);