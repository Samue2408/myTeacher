import { createRouter, createWebHistory } from "vue-router";
import landingRoutes from "./routes/landing.routes";
import authRoutes from "./routes/auth.routes";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [...landingRoutes]
    },
    {
      path: "/user",
      component: ()=> import("@/auth/auth.vue"),
      children: [...authRoutes]
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
