const express = require('express')
const router = express.Router()
const Product = require('./product')
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: false }))

router.use(bodyParser.json())

router.get('/', async (req, res) => {
    try {
        console.log("get")
        const products = await Product.find()
        // console.log(products)
        res.render("home.ejs", { products: products })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/addProduct', async (req, res) => {
    try {
        console.log("getP")
        res.render("addProduct.ejs")
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/addProduct', async (req, res) => {
    console.log("postP")
    const product = new Product({
        product_id: req.body.product_id,
        brand: req.body.brand,
        category: req.body.category,
        name: req.body.name,
        size: req.body.size,
        quantity: req.body.quantity,
        cost_price: req.body.cost_price,
        selling_price: req.body.selling_price,
    })
    try {
        const newProduct = await product.save()
        console.log(newProduct)
        res.redirect("/")
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/deleteProduct/:pid', async (req, res) => {
    console.log("Del")
    try {
        const delProduct = await Product.findByIdAndDelete(req.params.pid)
        console.log(delProduct)
        res.redirect("/")
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/editProduct/:pid', async (req, res) => {
    console.log("Upd")
    try {
        const edProduct = await Product.findById(req.params.pid)
        // console.log(edProduct)
        res.render("editProduct.ejs", { product: edProduct })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/editProductFinal', (req, res) => {
    console.log("UpdF")
    Product.updateOne(
        { _id: req.body._id },
        {
            $set: {
                quantity: req.body.quantity,
                cost_price: req.body.cost_price,
                selling_price: req.body.selling_price,
            }
        }
    ).then(result => {
        res.redirect("/")
    })
        .catch(err => console.log("Updation Error"))
})


module.exports = router

