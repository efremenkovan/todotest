import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Error404 from "../views/Error404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/cards/:id",
    name: "Card",
    component: () => import("../views/Card.vue"),
    props: true
  },
  {
    path: "*",
    name: "Error 404",
    component: Error404
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
