import { FastifyInstance } from "fastify";
import { signUp } from "./controllers/auth/sign-up";
import { signIn } from "./controllers/auth/sign-in";
import { profile } from "./controllers/me/profile";
import { verifyJWT } from "./middlewares/verify-jwt";
import { refreshSession } from "./controllers/auth/refresh-session";
import { signUpStore } from "./controllers/auth/sign-up-store";
import { signOut } from "./controllers/auth/sign-out";
import { stores } from "./controllers/me/stores";
import { registerProduct } from "./controllers/products/register-product";
import { getProducts } from "./controllers/products/get-products";
import { deleteProduct } from "./controllers/products/delete-product";
import { registerOrder } from "./controllers/orders/register-order";
import { updateOrderItems } from "./controllers/orders/update-order-items";
import { updateOrderName } from "./controllers/orders/update-order-name";
import { cleanOrder } from "./controllers/orders/clean-order";
import { deleteOrder } from "./controllers/orders/delete-order";
import { openOrder } from "./controllers/orders/open-order";
import { getOrders } from "./controllers/orders/get-orders";

export async function appRoutes(app: FastifyInstance) {
  app.post('/auth/sign-up', signUp)
  app.post('/auth/sign-up/store', signUpStore)
  app.post('/auth/sign-in', signIn)
  app.get('/auth/sign-out', signOut)
  app.get('/auth/refresh-session', refreshSession)

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.get('/me/stores', { onRequest: [verifyJWT] }, stores)

  app.post('/store/register-product', { onRequest: [verifyJWT] }, registerProduct)
  app.post('/store/get-products', { onRequest: [verifyJWT] }, getProducts)
  app.post('/store/delete-product', { onRequest: [verifyJWT] }, deleteProduct)
  //order
  app.post('/store/register-order', { onRequest: [verifyJWT] }, registerOrder)
  app.post('/store/update-order-items', { onRequest: [verifyJWT] }, updateOrderItems)
  app.post('/store/update-order-name', { onRequest: [verifyJWT] }, updateOrderName)
  app.post('/store/clean-order', { onRequest: [verifyJWT] }, cleanOrder)
  app.post('/store/delete-order', { onRequest: [verifyJWT] }, deleteOrder)
  app.post('/store/open-order', { onRequest: [verifyJWT] }, openOrder)
  app.post('/store/get-orders', { onRequest: [verifyJWT] }, getOrders)
}