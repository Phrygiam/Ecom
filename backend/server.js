const express = require("express")
const cors = require("cors")
const app = express()
const connectDB = require("./config/db")
const path = require("path")
const morgan = require("morgan")

require("dotenv").config()
connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}...`))
app.use(cors())
app.use(express.json())

// routes middleware

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

const productRoutes = require("./routes/productRoutes")
app.use("/api/products", productRoutes)

const userRoutes = require("./routes/userRoute")
app.use("/api/users", userRoutes)

const orderRoutes = require("./routes/orderRoutes")
app.use("/api/orders", orderRoutes)

const uploadRoutes = require("./routes/uploadRoutes")
app.use("/api/upload", uploadRoutes)
app.use("/uploads", express.static(path.join(__dirname, "../uploads"))) 

app.get("/api/config/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID)
})


if (process.env.NODE_ENV === "production") {

    app.use(express.static(path.join(__dirname, "../frontend/build")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"))
    })

}