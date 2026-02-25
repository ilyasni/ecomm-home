import { factories } from "@strapi/strapi";

const ORDER_UID = "api::order.order" as any;
export default factories.createCoreService(ORDER_UID);
