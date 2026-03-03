import { Module } from "@medusajs/framework/utils";
import { YookassaPaymentService } from "./service";

export const YOOKASSA_MODULE = "yookassaPayment";

export default Module(YOOKASSA_MODULE, {
  service: YookassaPaymentService,
});
