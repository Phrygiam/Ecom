const mongoose = require("mongoose")
const users = require("./data/users")
const products = require("./data/products")
const User = require("./models/userModel") 
const Product = require("./models/productModel") 
const Order = require("./models/userModel") 
const connectDB = require("./config/db") 

require("dotenv").config()
connectDB()

const importData = async() => {
    
    try {

        // create an array in which we inject dummy users
        const createdUsers = await User.insertMany(users)
        // retrieve the admin id from the array
        const adminUser = createdUsers[0]._id

        // map through the items to inject into the DB and return the same object with the admin signature id
        const sampleProducts = products.map( product => {
            return {
                ...product,
                user: adminUser
            }
        })

        await Product.insertMany(sampleProducts)

        console.log("Data imported")
        process.exit(0)

    } catch (error) {
        console.error(` ${error.message}`)
        process.exit(1)
    }

}

const destroyData = async() => {
    
    try {

        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        

        console.log("Data deleted")
        process.exit(0)
        
    } catch (error) { 
        console.error(` ${error.message}`)
        process.exit(1)
    }
    
}


if (process.argv[2] === "-d") {
    destroyData()
} else (
    importData()
)

// this means that if we type "node backend/seeder -d" we will delete the data,
// otherwise we will inject it

// for sake of simplicity, add the following scripts in package.json:
// "data:import": "node backend/seeder"
// "data:destroy": "node backend/seeder -d"
