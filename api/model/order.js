import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: {type: String, required: true},
            price: {type: Number, required: true},
            qty: {type: Number, required: true},
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            image: {type: String, required: true}
        }
    ],
    shippingAddress:{
        address:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        country:{
            type: String,
            required: true
        },
        postalCode:{
            type: String, 
            required: true
        }
    },
    shippingPrice:{
        type: Number,
        required: true,
        default: 0
    },
    taxPrice:{
        type: Number,
        required: true,
        default: 0
    },
    totalPrice:{
        type: Number,
        required: true,
        default: 0
    },
    isPaid:{
        type: Boolean,
        required: true,
        default: false
    },
    paidAt:{
        type: Date
    },
    isDelivered:{
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt:{
        type: Date
    },
    paymentMethod:{
        type: String,
        required: true
    },
    orderStatus:{
        orderId: {
            type: String,
            required: true
        }
    }
}, {timestamps: true})


const Order = mongoose.model('Order', orderSchema) 

export default Order