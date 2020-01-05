const routes = [
  {
    path: "/",
    redirect: "/scrapes"
  },
  {
    path: "/scrapes",
    component: () => import("layouts/MyLayout.vue"),
    children: [{ path: "", component: () => import("pages/Scrapes.vue") }]
  },
  {
    path: "/clients",
    component: () => import("layouts/MyLayout.vue"),
    children: [{ path: "", component: () => import("pages/Clients.vue") }]
  },
  {
    path: "/upload",
    component: () => import("layouts/MyLayout.vue"),
    children: [{ path: "", component: () => import("pages/Upload.vue") }]
  },
  {
    path: "/values",
    component: () => import("layouts/MyLayout.vue"),
    children: [{ path: "", component: () => import("pages/Values.vue") }]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
