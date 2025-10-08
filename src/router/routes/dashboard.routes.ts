import type { RouteRecordRaw } from "vue-router";

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    redirect: "/user/home",
  },
];

export default dashboardRoutes;
