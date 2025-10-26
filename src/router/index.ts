import { createRouter, createWebHistory } from "vue-router";
import landingRoutes from "./routes/landing.routes";
import authRoutes from "./routes/auth.routes";
import profile from "./routes/profile.routes";
import { useAuthStore } from "../stores/authStore";
import payment from "./routes/payment.routes";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [...landingRoutes],
    },
    {
      path: "/user",
      component: () => import("@/auth/auth.vue"),
      children: [...authRoutes],
    },
    {
      path: "/profile",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [...profile],
      meta: { requiresAuth: true }, // para requerir Autenticacion
    },
    {
      path: "/payment",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [...payment],
      meta: { requiresAuth: true },
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// Hook para activar las transiciones en navegación
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    auth.showLoginModal = true;

    // Si no vienes de ninguna ruta (ej: primera carga de la app), no uses transición
    if (!from.name) {
      return next({ name: "home" });
    }

    next(false);
  } else {
    // Si el navegador no soporta View Transitions, sigue normal
    if (!document.startViewTransition) {
      return next();
    }

    // Si no vienes de ninguna ruta (ej: primera carga de la app), no uses transición
    if (!from.name) {
      return next();
    }

    // Envolver la navegación en la transición
    document.startViewTransition(() => {
      next();
    });
  }
});

export default router;
