import type { RouteRecordRaw } from "vue-router";

const payment: RouteRecordRaw[] = [
  {
    path: "mercado-pago/:bookingId",
    component: () => import("@/features/payment/mercadoPago.vue"),
    props: true
  },
  {
    path: "summary",
    component: () => import("@/features/payment/payment-summary.vue"),
  },
  {
    path: "",
    component: () => import("@/features/payment/payment.vue"),
  },
];

export default payment;
