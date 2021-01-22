const bcrypt = require("bcryptjs")

const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: bcrypt.hashSync("iamtheadmin", 10),
        isAdmin: true
    },

    {
        name: "Syndra",
        email: "syndra@gmail.com",
        password: bcrypt.hashSync("iamsyndra", 10)
    },

    {
        name:"Kane",
        email: "kane@example.com",
        password: bcrypt.hashSync("iamkane", 10)
    }
]

module.exports = users