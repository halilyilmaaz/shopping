const  app  = require("../../app");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Order = require('../models/order.js');
const Product = require('../models/product.js');
const checkAuth = require('../middleware/check-auth.js');


router.get('/',(req,res,next)=>{
    Order
    .find()
    .then(result => {
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
    
});

router.post('/',(req,res,next)=>{
    const order = new Order({
        _id : mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productID
    });
    order
    
    .save()
    
    .then(result => {
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
    
});

router.get('/:orderID',(req,res,next)=>{
    res.status(200).json({
        message : 'orders wew created',
        orderID: req.params.orderID
    });
});

router.delete('/:orderID',(req,res,next)=>{
    res.status(200).json({
        message : 'orders deleted',
        orderID: req.params.orderID
    });
});

module.exports = router;
