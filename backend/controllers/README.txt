
The controllers folder contains all the functions related to backend products calls.
Basically, instead of writing:

router.get("/", async(req, res) => {
    const products = await Product.find({})
    res.json(products)
})

We will write:

const fetchAllProducts = async(req, res) => {
    const products = await Product.find({})
    res.json(products)
})


We will import this function (written in the controllers folder) into the routes folder

router.route("/").get(fetchAllProducts)