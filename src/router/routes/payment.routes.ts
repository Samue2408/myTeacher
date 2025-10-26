import type { RouteRecordRaw } from "vue-router";

const payment: RouteRecordRaw[] = [
  {
    path: "",
    component: () => import("@/features/payment/payment.vue"),
  },
];

export default payment;
