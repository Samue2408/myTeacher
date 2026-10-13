import type { RouteRecordRaw } from "vue-router";

const payment: RouteRecordRaw[] = [
  {
    path: "mercado-pago/:bookingId/:preferenceId",
    component: () => import("@/features/payment/mercadoPago.vue"),
    props: true
  },
  {
    path: "summary",
    component: () => import("@/features/payment/payment-summary.vue"),
  },
  {
    path: "success",
    redirect: "payment/result"
  },
  {
    path: "success",
    redirect: "payment/result"
  },
  {
    path: "result",
    component: () => import("@/features/payment/payment-result.vue"),
  },
  {
    path: "",
    component: () => import("@/features/payment/payment.vue"),
  },
];

export default payment;
