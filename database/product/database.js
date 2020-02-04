// Create Database her
// Default Database name: product
db.createUser(
    {
        user: "testuser",
        pwd: "12test34",
        roles: [
            {
                role: "readWrite",
                db: "product"
            }
        ]
    }
);

db.createCollection('article');
