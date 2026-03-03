import { factories } from "@strapi/strapi";

const CART_UID = "api::cart.cart" as any;
export default factories.createCoreRouter(CART_UID);
