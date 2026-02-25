import { factories } from "@strapi/strapi";

const WISHLIST_UID = "api::wishlist.wishlist" as any;
export default factories.createCoreController(WISHLIST_UID);
