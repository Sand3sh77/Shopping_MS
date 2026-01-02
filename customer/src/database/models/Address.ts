import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    street: String,
    postalCode: String,
    city: String,
    country: String
});

export const Address = mongoose.model('address', AddressSchema);
