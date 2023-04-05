import FileProductManager from "./file-managers/product.manager.js";
import DbProductManager from "./db-managers/product.manager.js";
import FileCartManager from "./file-managers/cart.manager.js";
import DbCartManager from "./db-managers/cart.manager.js";

const config = {
  persistenceType: "db",
};

let ProductManager, CartManager;

if (config.persistenceType === "db") {
  ProductManager = DbProductManager;
  CartManager = DbCartManager;
} else if (config.persistenceType === "file") {
  ProductManager = FileProductManager;
  CartManager = FileCartManager;
} else {
  throw new Error("Unknown persistence type");
}

export { ProductManager, CartManager };