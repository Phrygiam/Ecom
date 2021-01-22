const { json } = require("express")
const Product = require("../models/productModel")
const Order = require("../models/orderModel")

// desccription: Fetch all products
// route GET /api/products
// acccess: PUBLIC
const fetchAllProducts = async(req, res) => {
     
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword, 
            $options: "i" 
        }
    } : {}

   
    const pageSize = 4
    
    const page = Number(req.query.pageNumber) || 1
   
    const count = await Product.countDocuments({...keyword})
   
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))

    res.json({products, page, pages: Math.ceil(count/pageSize)})
}

// desccription: Fetch one specific product
// route GET /api/products/:id
// acccess: PUBLIC
const fetchSingleProduct = async(req, res) => {

    try {
        const product = await Product.findById(req.params.id)
        res.json(product)
    } catch (error) {
        res.status(404).json({error: "Product not found"})
    }   
             
}

// desccription: Delete one specific product
// route DELETE /api/products/:id
// acccess: PRIVATE / ADMIN

const deleteProduct = async( req, res) => {

    try {
        const product = Product.findById(req.params.id)
        
        if (product) {
            await product.deleteOne()
            res.json({message: "Product successfully removed"})
        } else {
            res.status(401).json({error: "Not authorized"})
        }
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

// desccription: Create one specific product
// route POST /api/products
// acccess: PRIVATE / ADMIN

const createProduct = async( req, res) => {

    try {
        
        const product = await Product.create({
            name: req.body.name,
            user: req.user._id,
            image: req.body.image,
            brand: req.body.brand,
            category: req.body.category,
            countInStock: req.body.countInStock,
            numReviews: 0,
            description: req.body.description,
            price: req.body.price
        })

        const createdProduct = await product.save()
        res.status(201).json(createdProduct)

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// desccription: Update one specific product
// route PUT /api/products/:id
// acccess: PRIVATE / ADMIN

const updateProduct = async(req, res) => {

    try {
        const {name, price, description, brand, countInStock, category, image} = req.body

        const product = await Product.findById(req.params.id)

        if(product) {
            product.name = name
            product.category = category
            product.description = description
            product.price = price
            product.brand = brand
            product.image = image
            product.countInStock = countInStock

            const updatedProduct = await product.save()
            res.status(201).json(updatedProduct)
        }

    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

// desccription: Create a new review
// route POST /api/products/:id/reviews
// acccess: PRIVATE 

const createProductReview = async(req, res) => {

    try {
        const {rating, comment, productId} = req.body

        const product = await Product.findById(req.params.id)
        const order = await Order.findOne({"user": req.user._id, "orderItems.product": productId })
       
        if(product) {
            
            const alreadyReviewed = product.reviews.find(review => 
                review.user.toString() === req.user._id.toString()
            )

            if (alreadyReviewed) {
                
                product.reviews.map( review => {
                   if(review.user.toString() === req.user._id.toString()) {
                       review.name = req.user.name
                       review.rating = Number(rating),
                       review.comment = comment,
                       review.user = req.user._id,
                       review.verified = order && order.isPaid ? true : false
                   }
                })

                product.numReviews = product.reviews.length
                product.rating = product.reviews.reduce( (accumulator, item) => accumulator + item.rating, 0) / product.reviews.length

                await product.save()
                res.status(201).json({message: "Review modified!"})
                
            } else {
                
                const review = {
                    name: req.user.name,
                    rating: Number(rating),
                    comment: comment,
                    user: req.user._id,
                    verified: order && order.isPaid ? true : false
                }

                product.reviews.push(review)
                
                product.numReviews = product.reviews.length
                
                product.rating = product.reviews.length > 0 ? product.reviews.reduce( (accumulator, item) => accumulator + item.rating, 0) / product.reviews.length : 0

                await product.save()
                res.status(201).json({message: "Review added!"})
                
            }
        }

    } catch (error) {
        res.status(404).json({error: error.message})
    }
}


// description: Fetch existing review
// route GET /api/products/:id/reviews
// acccess: PRIVATE 

const fetchProductReview = async( req, res) => {

    try {
    
        const product = await Product.findById(req.params.id)

            if (product) {

                const alreadyReviewed = product.reviews.find(review => 
                    review.user.toString() === req.user._id.toString()
                )

                if(alreadyReviewed) {

                    product.reviews.map( review => {
                        if(review.user.toString() === req.user._id.toString()) {
                            res.status(201).json({
                                rating: review.rating,
                                comment: review.comment
                            })
                        }
                    })
                }
            }
    } catch (error) {
        res.status(404).json({error: error.message})
    }
            
}

// description: delete existing review
// route DELETE /api/products/:id/reviews
// access: PRIVATE

const deleteProductReview = async(req, res) => {

    try {
        
        await Product.findOneAndUpdate(
            {
            _id: req.params.id,
            "reviews.user": req.user._id
            },
            {$pull: {reviews: {user: req.user._id}}}
        )

        const product = await Product.findById(req.params.id)

        product.numReviews = product.reviews.length
        product.rating = product.reviews.length > 0 ? product.reviews.reduce( (accumulator, item) => accumulator + item.rating, 0) / product.reviews.length : 0

        await product.save()

        res.status(200).json({message: "Review deleted!"})
        
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}


// description: get the top rated products
// route GET /api/products/topRated
// access: PUBLIC

const fetchTopRatedProducts = async(req, res) => {

    try {
        const products = await Product.find({}).sort({rating: -1}).limit(4)
        res.json(products)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}


module.exports = {fetchAllProducts, fetchSingleProduct, deleteProduct, createProduct, updateProduct, createProductReview, fetchProductReview, deleteProductReview, fetchTopRatedProducts}