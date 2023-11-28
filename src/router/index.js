import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/generator",
    name: "generator",
    component: () => import("../views/Generator.vue"),
  },
  {
    path: "/translator",
    name: "translator",
    component: () => import("../views/Translator.vue"),
  },
  {
    path: "/license",
    name: "license",
    component: () => import("../views/License.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
