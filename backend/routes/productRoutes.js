const express = require("express")
const router = express.Router()

const {fetchAllProducts, fetchSingleProduct, deleteProduct, createProduct, updateProduct, createProductReview, fetchProductReview, deleteProductReview, fetchTopRatedProducts} = require( "../controllers/productsController")
const {protect, isAdmin} = require("../middleware/authMiddleware")

router.route("/topRated").get(fetchTopRatedProducts)

router
    .route("/")
    .get(fetchAllProducts)
    .post(protect, isAdmin, createProduct)

router
    .route("/:id")
    .get(fetchSingleProduct)
    .delete(protect, isAdmin, deleteProduct)
    .put(protect, isAdmin, updateProduct)

router
    .route("/:id/reviews")
    .post(protect, createProductReview)
    .get(protect, fetchProductReview)
    .delete(protect, deleteProductReview)

module.exports = router