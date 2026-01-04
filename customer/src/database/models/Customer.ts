import mongoose, { Schema } from "mongoose";

export const CustomerSchema = new mongoose.Schema({
    email: String,
    password: String,
    phone: String,
    address: [
        { type: Schema.Types.ObjectId, ref: 'address', require: true }
    ],
    cart: [
        {
            product: {
                _id: { type: String, require: true },
                name: { type: String },
                banner: { type: String },
                price: { type: Number }
            },
            unit: { type: Number, require: true }
        }
    ],
    wishlist: [
        {
            _id: { type: String, require: true },
            name: { type: String },
            description: { type: String },
            banner: { type: String },
            available: { type: Boolean },
            price: { type: Number }
        }
    ],
    orders: [
        {
            _id: { type: String, require: true },
            amount: { type: String },
            date: { type: Date, default: Date.now() },
        }
    ]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
        }
    },
    timestamps: true
});

export const CustomerModel = mongoose.model('customer', CustomerSchema);

