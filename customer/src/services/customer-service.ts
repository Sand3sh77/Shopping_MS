import { CustomerRepository } from "../database";
import { APIError, GenerateSignature, ValidatePassword } from "../utils";

class CustomerService {
    private repository: CustomerRepository;

    constructor() {
        this.repository = new CustomerRepository();
    }

}