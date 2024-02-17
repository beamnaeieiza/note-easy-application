import { Request, ResponseToolkit } from "@hapi/hapi";
import { DataSource, getRepository, Repository } from "typeorm";
import { getSystemErrorMap } from "util";
import { AppDataSource } from "../data-source";
import { Customer } from "../entity/Customer";

export class CustomerController {
  async getAllCustomers(request: Request, h: ResponseToolkit) {
    try {
      const customerRepository = AppDataSource.getRepository(Customer);
      const customers = await customerRepository.find();
      return h.response(customers).code(200);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getCustomerById(request: Request, h: ResponseToolkit) {
    try {
      const { id } = request.params;
      const customerRepository = AppDataSource.getRepository(Customer);
      const customers = await customerRepository.findOne(id);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async createCustomer(request: Request, h: ResponseToolkit) {
    try {
      const { firstName, lastName, age, username, password } =
        request.payload as Customer;
      const customerRepository = AppDataSource.getRepository(Customer);

      const newCustomer = new Customer();
      newCustomer.firstName = firstName;
      newCustomer.lastName = lastName;
      newCustomer.age = age;
      newCustomer.username = username;
      newCustomer.password = password;

      await customerRepository.save(newCustomer);

      console.log(newCustomer);

      return h.response(newCustomer).code(201);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async loginCustomer(request: Request, h: ResponseToolkit) {
    try {
      console.log("test");
      const { username, password } = request.payload as {
        username: string;
        password: string;
      };

      console.log("Username:", username);
      console.log("Password:", password);
      console.log("test");
      console.log(request.payload);
      const customerRepository = AppDataSource.getRepository(Customer);

      const customer = await customerRepository.findOne({
        where: { username: username },
      });

      if (customer && customer.password === password) {
        return h.response(customer).code(200);
      } else {
        return h.response({ error: "Invalid username or password" }).code(401);
      }
    } catch (error) {
      console.error("Error logging in customer:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async deleteCustomer(request: Request, h: ResponseToolkit) {
    try {
      const { customerId } = request.params;
      const customerRepository = AppDataSource.getRepository(Customer);

      const customer = await customerRepository.findOne({
        where: { customer_id: customerId },
      });
      if (!customer) {
        return h.response({ error: "Customer not found" }).code(404);
      }
      await customerRepository.delete(customerId);

      return h.response({ message: "Customer deleted successfully" }).code(200);
    } catch (error) {
      console.error("Error deleting customer:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }
}
