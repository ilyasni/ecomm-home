import { strapiGet } from "@/lib/strapi";

export async function getOrders() {
  return strapiGet(
    "/orders",
    {
      "populate[products][populate]": "*",
      "sort[0]": "createdAt:desc",
    },
    { cache: "no-store" }
  );
}

export async function getOrderById(id: string) {
  return strapiGet(
    `/orders/${id}`,
    {
      "populate[products][populate]": "*",
    },
    { cache: "no-store" }
  );
}

export async function getAddresses() {
  return strapiGet("/addresses", {}, { cache: "no-store" });
}

export async function getUserProfile() {
  return strapiGet(
    "/users/me",
    {
      "populate[addresses]": "*",
      "populate[bonusOperations]": "*",
      "populate[notificationSettings]": "*",
    },
    { cache: "no-store" }
  );
}
