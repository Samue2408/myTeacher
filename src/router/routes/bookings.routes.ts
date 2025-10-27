import type { RouteRecordRaw } from "vue-router";

const bookings: RouteRecordRaw[] = [
  {
    path: "",
    component: () => import("@/features/bookings/bookings.vue"),
  },
];

export default bookings;
