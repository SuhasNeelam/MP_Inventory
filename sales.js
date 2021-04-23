const express = require('express')
const router = express.Router()
const Sale = require('./sale')
const bodyParser = require('body-parser')

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

router.post('/', async (req, res) => {
    const sale = new Sale({
        purchase_date: req.body.purchase_date,
        product_id: req.body.product_id,
        unit_price: req.body.unit_price,
        quantity: req.body.quantity,
        total_sales: req.body.total_sales,
    })
    try {
        const newSale = await sale.save()
        // console.log(newSale)
        res.json(newSale)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router