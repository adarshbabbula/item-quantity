const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const dateQuantityRoutes = require("./routes/datesQuantity");
const itemRoutes = require("./routes/item");

mongoose.connect("mongodb://localhost:27017/item-quantity",{ useNewUrlParser: true })
    .then(()=>{
      console.log("Connected to Data Base");
    })
    .catch((err)=>{
      console.log(err);
    });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Autherization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
});
app.use('/api/dateQuantities',dateQuantityRoutes);
app.use('/api/items',itemRoutes);
module.exports = app;
