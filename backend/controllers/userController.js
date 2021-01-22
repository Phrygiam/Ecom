const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// description: Auth user & get token
// route POST /api/users/login
// acccess: PUBLIC

const authUser = async(req, res) => {

    try {
        const {email, password} = req.body

       
            const userExists = await User.findOne({email})
            if (!userExists) throw Error("Could not find any user with that email")

            const passwordIsTrue = await bcrypt.compare(password, userExists.password)
            if (!passwordIsTrue) throw Error("Invalid password")

            if (userExists && passwordIsTrue) {
                
                const token = jwt.sign({id: userExists._id}, process.env.JWT_SECRET, {expiresIn: "30d"})
                res.header("auth-token", token)
                
                res.json({
                    _id: userExists._id,
                    name: userExists.name,
                    email: userExists.email,
                    isAdmin: userExists.isAdmin,
                    token: token
                })
            }
        
        
    } catch (e) {
        res.status(401).json({error: e.message})
        console.error(e.message)
     }
}



// description: Get user profile
// route GET /api/users/profile
// acccess: PRIVATE

const getUserProfile = async(req, res) => {

    try {
        // we get req.user._id from the "protect" middleware once we auth the user
        
        const user = await User.findById(req.user._id)
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
 
    } catch (e) {
        res.status(401).json({error: e.message})
        console.error(e.message)
     }
    
}


// description: Create a new user
// route POST /api/users/signin
// acccess: PUBLIC

const registerUser = async(req, res) => {

    try {
        
        const {name, email, password} = req.body

        const nameError = !name && "You must enter a valid name"
        const emailError = !name && "You must enter a valid email"
        const passwordError = !name && "You must enter a valid password"

        const saltRounds = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const userExists = await User.findOne({email})
        if (userExists) throw Error("An account with this email already exists")

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        
        if (newUser) {
            res.json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            })
        }
        
       
    } catch (e) {
        res.status(401).json({error: e.message})
        console.error(e.message)
     }
    
}




// description: Update user profile
// route PUT /api/users/profile
// acccess: PRIVATE
const updateUserProfile = async(req, res) => {

    try {
        
        const user = await User.findById(req.user._id)
        
        if(user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            if (req.body.password) {
                const saltRounds = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
                user.password = hashedPassword
            }
        }

        const updatedUser = await user.save()

        const token = jwt.sign({id: updatedUser._id}, process.env.JWT_SECRET, {expiresIn: "30d"})
        res.header("auth-token", token)

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: token
        })
        
    } catch (e) {
        res.status(401).json({error: e.message})
     }
    
}


// description: Get all user profiles
// route GET /api/users
// acccess: PRIVATE/ADMIN

const getUsers = async(req, res) => {
    const users = await User.find({})
    res.json(users)
}


// description: Get user
// route GET /api/users/:id
// acccess: PRIVATE/ADMIN

const getUserById = async(req, res) => {
    
    try {
        const user = await User.findById(req.params.id).select("-password")
        if (user) {
            res.json(user)
        }
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

// desctiption: Update user by Id
// route PUT /api/users/:id
// access: PRIVATE/ADMIN

const updateUserById = async(req, res) => {

    try {
        
        const user = await User.findById(req.params.id)
        
        if(user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.isAdmin = req.body.isAdmin 
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
        
    } catch (e) {
        res.status(404).json({error: e.message})
     }

}

// description: Delete user
// route DELETE /api/users/:id
// acccess: PRIVATE/ADMIN

const deleteUser = async(req, res) => {
    
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            await user.deleteOne()
            res.json({message:"user removed"})
        }
    } catch (error) {
        res.status(404).json({error: error.message})
    }

}



module.exports = {authUser, getUserProfile, updateUserProfile, registerUser, getUsers, getUserById, updateUserById, deleteUser}