const express = require("express")
const router = express.Router()
const {protect, isAdmin} = require("../middleware/authMiddleware")

const {authUser, getUserProfile, updateUserProfile, registerUser, getUsers, getUserById, updateUserById, deleteUser} = require("../controllers/userController")


router.route("/login").post(authUser)

router
    .route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

router.route("/signin").post(registerUser)
router.route("/").get(protect, isAdmin,  getUsers)

router
    .route("/:id")
    .delete(protect, isAdmin, deleteUser)
    .get(protect, isAdmin, getUserById)
    .put(protect, isAdmin, updateUserById)

module.exports = router