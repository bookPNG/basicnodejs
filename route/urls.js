//manage urls routing
const route = require('express').Router() // get routing in Express.js
const Model = require('../models/products.js') // get model
const path = require('path')
const multer = require('multer') // upload file
const Product = require('../models/products.js')
const session = require('express-session')

// ระบุปลายทาง กับชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './public/images/products') // ตำแหน่งจัดเก็บไฟล์
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now()+'.jpg') // ตั้งชื่อไฟล์ใหม่
    }
})

// เริ่มการ upload
const upload = multer({
    storage: storage
})

// const template = path.join(__dirname, '../templates/')

route.get('/', (req, res)=>{
    Product.find().exec((err, doc)=>{
        res.render('index.ejs', {data: doc})
    })
})

route.get('/form', (req, res)=>{
    // use cookie
    // if(req.cookies.login){
    //     res.render('form.ejs')
    // }else{
    //     res.render('admin.ejs')
    // }

    // use session
    if(req.session.login){
        res.render('form.ejs')
    }else{
        res.render('admin.ejs')
    }
})

route.post('/login', (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    if(username === 'admin' && password === '555'){
        // use cookie
        // res.cookie('username', username, {maxAge: 30000})
        // res.cookie('password', password, {maxAge: 30000})
        // res.cookie('login', true, {maxAge: 30000})

        // use session
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge = 30000
        res.redirect('/manage')
    }else{
        res.render('404.ejs')
    }
})

route.get('/logout', (req, res)=>{
    // use cookie
    // res.clearCookie('username')
    // res.clearCookie('password')
    // res.clearCookie('login')
    // res.redirect('/manage')

    // use session
    req.session.destroy((err)=>{
        res.redirect('/manage')
    })
})

route.get('/manage', (req, res)=>{
    // use cookie
    // if(req.cookies.login){
    //     Product.find().exec((err, doc)=>{
    //         res.render('manage.ejs', {data: doc})
    //     })
    // }else{
    //     res.render('admin.ejs')
    // }

    // use session
    // console.log(req.sessionID);
    // console.log(req.session);
    if(req.session.login){
        Product.find().exec((err, doc)=>{
            res.render('manage.ejs', {data: doc})
        })
    }else{
        res.render('admin.ejs')
    }
})

route.post('/insert', upload.single('image'), (req, res)=>{
    // console.log(req.file);
    let data = new Model({
        name: req.body.name,
        price: req.body.price,
        image: req.file.filename,
        description: req.body.description
    })
    console.log(data);
    Model.saveData(data, (err)=>{
        if(err) console.log(err);
    })
    res.redirect('/')
})

route.get('/delete/:id', (req, res)=>{
    Product.findByIdAndDelete(req.params.id, {useFindAndModify: false}).exec((err)=>{
        if(err) console.log(err);
        res.redirect('/manage')
    })
    console.log('delete --> ', req.params.id);
})

route.get('/product/:id', (req, res)=>{
    const product_id = req.params.id
    // console.log(product_id);
    Product.findOne({_id: product_id}).exec((err, doc)=>{
        // console.log(doc);
        res.render('product.ejs', {data: doc})
    })
})

route.post('/edit', (req, res)=>{
    const edit_id = req.body.edit_id
    Product.findOne({_id: edit_id}).exec((err, doc)=>{
        // console.log(doc);
        res.render('edit.ejs', {data: doc})
    })
})

route.post('/update', (req, res)=>{
    const update_id = req.body.update_id
    let data = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    }
    // console.log(data);
    // console.log(update_id);
    Product.findByIdAndUpdate(update_id, data, {useFindAndModify: false}).exec((err)=>{
        res.redirect('/manage')
    })
})


module.exports = route