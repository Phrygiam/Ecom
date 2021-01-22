const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const protect = async(req, res, next) => {
    const token = req.header("auth-token")
    if (!token) return res.status(401).send("Access denied")

   try{
      
      const verified = jwt.verify(token, process.env.JWT_SECRET)
      
      req.user = await User.findById(verified.id).select("-password")
      
      next()
     } catch (e) {
      res.status(400).send("Invalid token")
    }
}

const isAdmin = async(req, res, next) => {
    
      if (req.user && req.user.isAdmin) {
          next()
        } else {
           res.status(401).send("Not authorized")
        }    
     
}

module.exports = {protect, isAdmin}