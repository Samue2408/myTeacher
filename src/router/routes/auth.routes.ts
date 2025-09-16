import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/user",
    redirect: "/user/login",
  },
  {
    path: "/user/login",
    name: "login",
    component: () => import("@/auth/components/login/login.vue"),
  },
];

export default authRoutes;
