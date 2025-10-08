import type { RouteRecordRaw } from "vue-router";

const tutoringProfile: RouteRecordRaw[] = [ 
  {
    path: ":id",
    name: "TutorProfile",
    component: () => import("@/features/tutoringProfile/pages/tutoringProfile.vue"),
    props: true
  }
];

export default tutoringProfile;

