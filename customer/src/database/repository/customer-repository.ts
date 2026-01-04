import { InferSchemaType } from "mongoose";
import { APIError } from "../../utils";
import { AddressModel, CustomerModel, CustomerSchema } from "../models";

class CustomerRepository {
    async CreateCustomer({ email, password, phone, salt }: {
        email: string;
        password: string;
        phone: string;
        salt: string;
    }) {
        try {
            const customer = new CustomerModel({
                email,
                password,
                salt,
                phone,
                address: [],
            });
            const customerResult = await customer.save();
            return customerResult;
        } catch (err) {
            throw new APIError("Unable to Create Customer");
        }
    }

    async CreateAddress({ _id, street, postalCode, city, country }: {
        _id: string;
        street: string;
        postalCode: string;
        city: string;
        country: string;
    }) {
        try {
            const profile = await CustomerModel.findById(_id);

            if (profile) {
                const newAddress = new AddressModel({
                    street,
                    postalCode,
                    city,
                    country,
                });

                await newAddress.save();

                profile.address.push(newAddress._id);
            }

            return await profile?.save();
        } catch (err) {
            throw new APIError("Error on Create Address");
        }
    }

    async FindCustomer({ email }: { email: string }) {
        try {
            const existingCustomer = await CustomerModel.findOne({ email: email });
            return existingCustomer;
        } catch (err) {
            throw new APIError("Unable to Find Customer");
        }
    }

    async FindCustomerById({ id }: { id: string }) {
        try {
            const existingCustomer = await CustomerModel.findById(id)
                .populate("address");
            return existingCustomer;
        } catch (err) {
            throw new APIError("Unable to Find Customer");
        }
    }

    async Wishlist(customerId: string) {
        try {
            const profile = await CustomerModel.findById(customerId).populate(
                "wishlist"
            );

            return profile?.wishlist;
        } catch (err) {
            throw new APIError("Unable to Get Wishlist ");
        }
    }

    async AddWishlistItem(customerId: string, { _id, name, description, banner, available, price }: {
        _id: string,
        name: string,
        description: string,
        banner: string,
        available: boolean,
        price: number
    }) {
        const product = {
            _id,
            name,
            description,
            banner,
            available,
            price,
        }
        try {
            const profile = await CustomerModel.findById(customerId).populate(
                "wishlist"
            );

            if (profile) {
                let wishlist = profile.wishlist;

                if (wishlist.length > 0) {
                    let isExist = false;
                    wishlist.map((item) => {
                        if (item._id.toString() === product._id.toString()) {
                            const index = wishlist.indexOf(item);
                            wishlist.splice(index, 1);
                            isExist = true;
                        }
                    });

                    if (!isExist) {
                        wishlist.push(product);
                    }
                } else {
                    wishlist.push(product);
                }

                profile.wishlist = wishlist;
            }

            const profileResult = await profile?.save();

            return profileResult?.wishlist;
        } catch (err) {
            throw new APIError("Unable to Add to WishList");
        }
    }

    async AddCartItem(customerId: string,
        { _id, name, banner, price }: {
            _id: string,
            name: string,
            banner: string,
            price: number
        },
        qty: number,
        isRemove: boolean) {
        const product = { _id, name, banner, price };

        try {
            const profile = await CustomerModel.findById(customerId).populate(
                "cart"
            );

            if (profile) {
                const cartItem = {
                    product,
                    unit: qty,
                };

                let cartItems = profile.cart;

                if (cartItems.length > 0) {
                    let isExist = false;
                    cartItems.map((item) => {
                        if (item.product._id.toString() === product._id.toString()) {
                            if (isRemove) {
                                cartItems.splice(cartItems.indexOf(item), 1);
                            } else {
                                item.unit = qty;
                            }
                            isExist = true;
                        }
                    });

                    if (!isExist) {
                        cartItems.push(cartItem);
                    }
                } else {
                    cartItems.push(cartItem);
                }

                profile.cart = cartItems;

                const cartSaveResult = await profile.save();

                return cartSaveResult;
            }

            throw new Error("Unable to add to cart!");
        } catch (err) {
            throw new APIError("Unable to Create Customer");
        }
    }

    async AddOrderToProfile(customerId: string, order: InferSchemaType<typeof CustomerSchema>["orders"][number]) {
        try {
            const profile = await CustomerModel.findById(customerId);

            if (profile) {
                if (profile.orders == undefined) {
                    profile.orders = [];
                }
                profile.orders.push(order);

                profile.cart = [];

                const profileResult = await profile.save();

                return profileResult;
            }

            throw new Error("Unable to add to order!");
        } catch (err) {
            throw new APIError("Unable to Create Customer");
        }
    }
}

export default CustomerRepository;
