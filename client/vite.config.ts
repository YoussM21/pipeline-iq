import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// During dev, proxy /api to the Express server so the client uses same-origin
// calls in both dev and production.
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
