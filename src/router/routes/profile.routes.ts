import type { RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const profile: RouteRecordRaw[] = [ 
  {
    path: ":id",
    name: "profile",
    component: () => import("@/features/profile/pages/profile.vue"),
    props: true,
    
  },
  {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
];

export default profile;

