const { Router } = require("express")
const Cart = require("../models/cart")
const router = Router()
const { db } = require("../models/product")
const { ObjectId } = require("mongodb")
const { body, validationResult } = require("express-validator")
const cart = require("../models/cart")

router.get("/", async (req, res) => {
    try {
        const carts = await Cart.find().populate("product")
        return res.status(200).json(carts)
    } catch (e) {
        console.log(e)
        return res.status(400).json({ message: "что то пошло не так" })
    }
})
// router.get("/:id", async (req, res) => {
//     try {
//         const cart = await Cart.findById(req.params.id)
//         return res.status(200).json(cart)
//     } catch (e) {
//         console.log(e)
//         return res.status(400).json({ message: "somthing went wrong" })
//     }
// })
router.post("/",
    body("product")
        .notEmpty()
        .withMessage("This field is required and owner must have an ID"),
    body("quantity")
        .isNumeric()
        .withMessage("it not number"),
    body("owner")
        .notEmpty()
        .withMessage("This field is required and owner must have an ID"),
    async (req, res) => {
        try {
            const { product, quantity, owner } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                return res.status(400).json({ errors: errors.array() });
            }
            const cart = new Cart({ product, quantity, owner })
            await cart.save()
            return res.status(200).json(cart)
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: "somthing went wrong" })
        }
    }
)
router.delete("/:id", (req, res) => {
    try {

    } catch (e) {
        console.log(e)
        return res.status(400).json({ message: "somthing went wrong" })
    }
})
router.get("/:id", async (req, res) => {
    const userId = req.params.id
    const cart = await Cart.find({ owner: userId }).populate("product")
    res.json(cart)
})
router.patch("/:id", async (req, res) => {
    try {
        const cartItemId = req.params.id
        const { quantity } = req.body
        const cartItem = await Cart.findById(cartItemId)
        if (!cartItem) {
            return res.status(404).json({ message: "товар  не найдена" })
        }
        Object.assign(cartItem, { quantity })
        await cartItem.save
        return res.json(cartItem)
    } catch (e) {
        console.log(e)
        return res.status(400).json({ message: "somthing went wrong" })
    }

})
router.delete("/:id", async (req, res) => {
    try {
        const cartItemId = req.params.id
        const cart = await Cart.findById(cartItemId)
        if (!cart) {
            return res.status(404).json({ message: "такого товара нет" })
        }
        await Cart.remove({id: cartItemId})
        return res.json({ message: "он был удален" })
    } catch (e) {
        console.log(e)
        return res.status(400).json({ essage: "somthing went wrong" })
    }


})




module.exports = router



















// try{

// }catch(e){
//     console.log(e)
//     return res.status(400).json({message:"somthing went wrong"})
// }