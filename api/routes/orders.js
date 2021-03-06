const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const Order=require("../models/order");
const Product=require("../models/product");
router.get("/",(req,res,next)=>{
    Order.find()
    .select("product quantity _id")
    .populate("product","name")
    .exec()
    .then(doc=>{
        res.status(200).json({
            count: doc.length,
            orders: doc.map(doc=>{
                return{
                    id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:
                    {
                        type: "GET",
                        url: "http://localhost:3000/orders"+doc._id
                    }
                }
            })
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
});
router.post("/",(req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product)
        {
            return res.status(404).json({
                message: "product not found"
            });
        }
        const order=new Order({
            _id: new mongoose.Types.ObjectId,
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
        
    })
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message: "Order was created",
            createdOrder:{
                id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request:{
                type: "GET",
                url: "http://localhost:3000/orders/"+result._id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
    
});
router.get("/:orderId",(req,res,next)=>{
    Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then(order=>{
        if(!order)
        {
            return res.status(404).json({
                message: "Order not Found"
            });
        }
        res.status(200).json({
            order: order,
            request:{
                type: "GET",
                url: "http://localhost:3000/orders"
            }
        });
    })
    .catch(er=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
router.delete("/:orderId",(req,res,next)=>{
    Order.deleteOne({_id: req.params.orderId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Order Deleted",
            request:
            {
                type: "POST",
                url: "http://localhost:3000/orders",
                body: {productId: "ID", quantity: "Number"}
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
module.exports=router;