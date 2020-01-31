db.createUser(
    {
        user: "test",
        pwd: "test",
        roles: [
            {
                role: "readWrite",
                db: "user"
            }
        ]
    }
);

db.createCollection('user');
