const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Product = require('./product')

app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs')

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

mongoose.connect('mongodb://localhost:27017/inventory_base', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(express.json())

const productsRouter = require('./products')
const salesRouter = require('./sales')

app.use('/', productsRouter)
app.use('/sale', salesRouter)

app.listen(3000, () => console.log('server started'))
