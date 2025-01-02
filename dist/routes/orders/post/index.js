"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/routes/orders/post/index.ts
var post_exports = {};
__export(post_exports, {
  default: () => post_default
});
module.exports = __toCommonJS(post_exports);

// db.ts
var import_client = require("@prisma/client");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var prisma = new import_client.PrismaClient();
var db_default = prisma;

// src/routes/orders/post/index.ts
var createOrder = (fastify) => __async(void 0, null, function* () {
  fastify.post("/orders", (request, reply) => __async(void 0, null, function* () {
    const data = request.body;
    try {
      const order = yield db_default.orders.create({
        data: {
          total: data.total,
          discounts: data.discounts,
          client_id: data.clientId,
          shipping_cost: data.shippingCost,
          payment_method: Number(data.paymentMethod),
          zip_code: data.zipCode,
          street: data.street,
          city: data.city,
          uf: data.uf,
          number: Number(data.number),
          neighborhood: data.neighborhood,
          status: Number(data.status)
        }
      });
      const id = order.order_id;
      if (data && Array.isArray(data.productId) && data.productId.length > 0) {
        data.productId.map((productId, key) => __async(void 0, null, function* () {
          yield db_default.items_orders.create({
            data: {
              order_id: Number(id),
              product_id: Number(productId),
              quantity_ordered: Number(data.quantityOrdered[key]),
              quantity_served: Number(data.quantityServed[key]),
              discount_type: Number(data.discountType[key]),
              discount_value: Number(data.discountValue[key])
            }
          });
          const product = yield db_default.products.findUnique({
            where: { product_id: Number(productId) }
          });
          yield db_default.products.update({
            where: { product_id: Number(productId) },
            data: {
              stock: Number(product == null ? void 0 : product.stock) - Number(data.quantityServed)
            }
          });
        }));
      }
      reply.status(200).send(order);
    } catch (error) {
      reply.status(500).send(error);
    }
  }));
});
var post_default = createOrder;