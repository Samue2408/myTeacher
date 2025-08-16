import { createRouter, createWebHistory } from "vue-router";
import landingRoutes from "./routes/landing.routes";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [
        ...landingRoutes
      ]
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
