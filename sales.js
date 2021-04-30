const express = require('express')
const app = express()
const router = express.Router()
const Sale = require('./sale')
const Product = require('./product')
const bodyParser = require('body-parser')
const axios = require('axios')
const puppeteer = require('puppeteer')
// const pdf = require("pdf-creator-node");
// const fs = require("fs");
// const path = require('path')
// const html = fs.readFileSync(path.join(__dirname, "./template.hbs"), "utf8")

// app.use(express.static(path.join(__dirname, '/public')))


// const options = {
//     format: "A4",
//     orientation: "portrait",
//     border: "10mm"
// }

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
            const date = req.body.purchase_date
            console.log(date)
            const sale = new Sale({
                purchase_date: date,
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
                    message: "Shortage"
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

const createPdf = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const options = {
        path: 'output.pdf',
        format: 'A4'
    }

    await page.goto('http://localhost:3000/sale', { waitUntil: 'networkidle2' })
    await page.pdf(options)

    await browser.close()
}

router.get('/pdf', async (req, res) => {
    console.log("download")
    try {
        // const sales = await Sale.find().lean()
        // const document = {
        //     html: html,
        //     data: {
        //         sales: sales,
        //     },
        //     path: "./output.pdf",
        //     type: "",
        // }
        // pdf
        //     .create(document, options)
        //     .then((res) => {
        //         console.log(res)
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //     })
        createPdf()
        res.redirect('/')
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


module.exports = router