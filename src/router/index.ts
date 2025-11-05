import { createRouter, createWebHistory } from "vue-router";
import landingRoutes from "./routes/landing.routes";
import authRoutes from "./routes/auth.routes";
import profile from "./routes/profile.routes";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "@/stores/userStore";
import payment from "./routes/payment.routes";
import bookings from "./routes/bookings.routes";

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
      path: "/bookings",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [...bookings],
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// Hook para activar las transiciones en navegación
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const user = useUserStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    auth.showLoginModal = true;

    if (!from.name) {
      return next({ name: "home" });
    }

    next(false);
  } 
  else {
    if (!user.currentUser) {
      await auth.restoreSession();
    }

    // Verificación para el perfil
    if (to.name === "profile" && to.params.id !== user.currentUser?._id) {
      return next(`/profile/${user.currentUser._id}`);
    }
    next();
  } 
    
  
});

export default router;
