import { Server } from "@hapi/hapi";
import { CustomerController } from "../controllers/customerController";

export const initCustomerRoutes = (server: Server) => {
  const customerController = new CustomerController();

  server.route({
    method: "GET",
    path: "/customers",
    handler: customerController.getAllCustomers.bind(customerController),
  });

  server.route({
    method: "GET",
    path: "/customers/{id}",
    handler: customerController.getCustomerById.bind(customerController),
  });

  server.route({
    method: "POST",
    path: "/customers/login",
    handler: customerController.loginCustomer.bind(customerController),
  });

  server.route({
    method: "POST",
    path: "/customers/create",
    handler: customerController.createCustomer.bind(customerController),
  });

  server.route({
    method: "DELETE",
    path: "/customers/delete/{customerId}",
    handler: customerController.deleteCustomer.bind(customerController),
  });
};
