import * as Hapi from "@hapi/hapi";
import { CustomerController } from "./src/controllers/customerController";
import { AppDataSource } from "./src/data-source";
import { initCustomerRoutes } from "./src/routes/customerRoutes";
import { initNoteRoutes } from "./src/routes/noteRoutes";

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: true,
    },
  });

  initCustomerRoutes(server);
  initNoteRoutes(server);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Welcome to note-easy application!";
    },
  });

  AppDataSource.initialize()
    .then(async () => {
      console.log("Data Source has been initialized!");
    })
    .catch((error) => console.log(error));

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
