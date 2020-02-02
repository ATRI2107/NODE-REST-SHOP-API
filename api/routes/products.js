const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');
const Product=require('../models/product');
router.get("/",(req,res,next)=>{
    Product.find()
    .select("name price _id")
    .exec()
    .then(doc=>{
        const response={
            count: doc.length,
            products: doc.map(docs=>{
                return{
                    name: docs.name,
                    price: docs.price,
                    _id: docs._id,
                    request:{
                        type: 'GET',
                        url: "http://localhost:3000/products/"+docs._id
                    }

                }
            })
        }
        res.status(200).json(response);
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/',(req,res,next)=>{
    const product=new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Successfully created the product',
            createdproduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request:{
                    type: 'GET',
                    url: "http://localhost:3000/products"+result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    });
    
});
router.get("/:productId",(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id)
    .select("name price _id")
    .exec()
    .then(doc=>{
        console.log(doc);
        if(doc)
        {
            res.status(200).json({
                product: doc,
                request:{
                    type: "GET",
                    description: "To get all the products",
                    url: "http://localhost:3000/products"
                }
            });
        }
        else{
            res.status(400).json({
                message: "No valid entry for the provided ID"
            });
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            err: err
        });
    });
});
router.patch("/:productId",(req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
    for(const ops of req.body)
    {
        updateOps[ops.propName]=ops.newVal;
    }
    Product.updateOne({_id:id},{$set: updateOps})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: "Product Updated",
            request: {
                type: "GET",
                url: "http://localhost:3000/products/"+id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});
router.delete("/:productId",(req,res,next)=>{
   const id=req.params.productId;
   Product.remove({_id: id})
   .exec()
   .then(result=>{
       res.status(200).json(result);
   })
   .catch(err=>{
       console.log(err);
       res.status(500).json({
           error: err
       });
   });
});
module.exports=router;