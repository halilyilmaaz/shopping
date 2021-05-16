const express = require('express');
const app = require('../../app');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth.js');

const storage = multer.diskStorage({
    destination:  function(req,file,cb){
       cb(null,'uploads/');    
    },
    filename:  function(req,file,cb){
        cb(null,file.originalname + '-' + Date.now());
    }
});

const upload =multer({storage: storage});


const Product = require('../models/product.js');
const Order = require('../models/order.js');



router.get('/', (req,res,next)=>{
    
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        
        const response = {
            count : docs.length,
            
            products: docs.map(docs=>{
                return {
                    name: docs.name,
                    price: docs.price,
                    productImage: docs.productImage,
                    _id: docs._id,
                    
                    
                }
                
            })
        }
        if(docs.length > 0){
            res.status(200).json(response);
        }else{
            res.status(404).json({message: 'no entry found'})
        }
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    })
    
});

router.post('/',upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const file = req.file;
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then((result =>{console.log(result);
        res.status(201).json({
            message: 'created successfuly',
            createProducts: product
        })
    }))
    .catch((err =>{console.log(err);
        
        res.status(500).json({
            error: err
        })
    }));
    
    
    
});

router.get('/:productID',(req,res,next)=>{
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({message: `bu id ye sahip bir dokuman yok `})
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});

// update
router.patch('/:productID',(req,res,next)=>{
    const id = req.params.productID
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id },{$set : updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
    res.status(200).json({
        message : 'update product'
    });
});

router.delete('/:productID',(req,res,next)=>{
    const id = req.params.productID;
    Product.remove({
        _id: id
    }).exec()
    .then(result => {
        if(result){
            res.status(200).json({
                message : 'silindi'
            });
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
    
});


module.exports = router;