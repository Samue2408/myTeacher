import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "",
    redirect: "/user/login",
  },
  {
    path: "login",
    name: "login",
    component: () => import("@/auth/components/login/login.vue"),
  },
];

export default authRoutes;
