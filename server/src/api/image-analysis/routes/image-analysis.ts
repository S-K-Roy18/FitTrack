export default {
  routes: [
    {
      method: "POST",
      path: "/image-analysis",  // ✅ correct URL
      handler: "image-analysis.analyze", // ✅ REQUIRED
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};