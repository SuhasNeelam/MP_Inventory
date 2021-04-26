const express = require('express')
const router = express.Router()
const Sale = require('./sale')
const Product = require('./product')
const bodyParser = require('body-parser')
const axios = require('axios')

router.use(bodyParser.urlencoded({ extended: false }))

router.use(bodyParser.json())

router.get('/', async (req, res) => {
    try {
        console.log("getS")
        const sales = await Sale.find()
        // console.log(products)
        res.render("sales.ejs", { sales: sales })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/', async (req, res) => {
    try {
        console.log("deleteS")
        const sales = await Sale.findOneAndDelete({ product_id: req.body.product_id })
        // console.log(products)
        res.json(sales)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    console.log("USale")
    try {
        const product = await Product.findOne({ product_id: req.body.product_id })
        if (product != null) {
            const sale = new Sale({
                purchase_date: req.body.purchase_date,
                product_id: req.body.product_id,
                unit_price: product.selling_price,
                quantity: req.body.quantity,
                total_sales: ((parseInt)(product.selling_price) * (parseInt)(req.body.quantity)),
            })
            if (((parseInt)(product.quantity) - (parseInt)(sale.quantity)) >= 0) {
                // console.log(product)
                // console.log(sale)
                const newSale = await sale.save()
                // console.log(newSale)
                const updProd = JSON.parse(JSON.stringify(product))
                updProd.quantity = ((parseInt)(product.quantity) - (parseInt)(sale.quantity))

                console.log("asidalsd", updProd)
                axios.post('http://127.0.0.1:3000/editProductFinal', updProd).then(res => {
                    // console.log(res)
                    console.log("axios post")
                }).catch(err => console.log(err))
                res.redirect('/sale')
            }
            else {
                const error = {
                    message: "No specified stock"
                }
                res.render('errorPage.ejs', { error: error })
            }
        }
        else {
            const error = {
                message: "No Such Product"
            }
            res.render('errorPage.ejs', { error: error })
        }
        // console.log(newSale)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router