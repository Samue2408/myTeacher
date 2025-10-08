import type { RouteRecordRaw } from "vue-router";

const landingRoutes: RouteRecordRaw[] = [
  {
    path: "",
    name: "home",
    component: () => import("@/features/landing/pages/homePage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/features/landing/pages/search.vue"),

  },
];

export default landingRoutes;

