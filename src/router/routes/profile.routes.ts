import type { RouteRecordRaw } from "vue-router";

const profile: RouteRecordRaw[] = [ 
  {
    path: ":id",
    name: "profile",
    component: () => import("@/features/profile/pages/profile.vue"),
    props: true
  }
];

export default profile;

