import { factories } from "@strapi/strapi";

const ORDER_UID = "api::order.order" as any;
export default factories.createCoreRouter(ORDER_UID);
