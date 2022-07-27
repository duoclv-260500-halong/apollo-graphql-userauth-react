const bcrypt = require('bcrypt')


const usersData = [
    {
        email: "login1@example.com",
        password: bcrypt.hash("password", 5),
        firstname: "Duoc",
        lastname: "Le"
    },
    {
        email: "login2@example.com",
        password: bcrypt.hash("password", 5),
        firstname: "Login1",
        lastname: "Example1"
    },
    {
        email: "login3@example.com",
        password: bcrypt.hash("password", 5),
        firstname: "Duoc",
        lastname: "Le"
    },
    {
        email: "login4@example.com",
        password: bcrypt.hash("password", 5),
        firstname: "Login4",
        lastname: "Example4"
    }
]
module.export = usersData;