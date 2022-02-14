// start with mongoose
const mongoose = require('mongoose')

// connecting to mongoDB
const db = 'mongodb://127.0.0.1:27017/productdb'
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err=>console.log(err))

// design schema (collumn in SQL)
let productSchema = mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String
})

// create model -> คือ collection (table in SQL) -> model จะเชื่อมกับ collection เพื่ออ้างอิงถึงกันระหว่าง mongoose กับ mongodb
let Product = mongoose.model('products', productSchema)

// exports model
module.exports = Product

// ทำ func สำหรับบันทึกข้อมูล
module.exports.saveData = (model, data)=>{
    model.save(data)
}