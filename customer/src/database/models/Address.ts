import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    street: String,
    postalCode: String,
    city: String,
    country: String
});

export const AddressModel = mongoose.model('address', AddressSchema);
