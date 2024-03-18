import { createRouter, createWebHistory } from "vue-router";

import EmployeeHome from "@/layouts/page/emulation";

const routers = [
  { path: "/emulation", component: EmployeeHome, name: "EmployeeHomeRouter" },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routers,
});

export default router;
