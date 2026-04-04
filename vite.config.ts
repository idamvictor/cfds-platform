import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const getPackageChunkName = (id: string) => {
  const normalizedId = id.replace(/\\/g, "/");
  const modulePath = normalizedId.split("/node_modules/")[1];

  if (!modulePath) {
    return "vendor";
  }

  const parts = modulePath.split("/");
  const packageName = parts[0].startsWith("@")
    ? `${parts[0]}-${parts[1]}`
    : parts[0];

  return `vendor-${packageName.replace("@", "").replace(/\//g, "-")}`;
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (
            id.includes("react/") ||
            id.includes("react-dom/") ||
            id.includes("scheduler")
          ) {
            return "react-vendor";
          }

          if (id.includes("react-router")) {
            return "router-vendor";
          }

          if (id.includes("@tanstack/react-query")) {
            return "query-vendor";
          }

          if (id.includes("recharts")) {
            return "charts-vendor";
          }

          if (
            id.includes("lucide-react") ||
            id.includes("react-feather")
          ) {
            return "icons-vendor";
          }

          if (
            id.includes("laravel-echo") ||
            id.includes("pusher-js") ||
            id.includes("socket.io-client")
          ) {
            return "realtime-vendor";
          }

          if (id.includes("@radix-ui")) {
            return "ui-vendor";
          }

          return getPackageChunkName(id);
        },
      },
    },
  },
  define: {
    'process.env.VITE_PUSHER_APP_KEY': JSON.stringify(process.env.VITE_PUSHER_APP_KEY),
    'process.env.VITE_PUSHER_APP_CLUSTER': JSON.stringify(process.env.VITE_PUSHER_APP_CLUSTER),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_MAX_UPLOAD_SIZE': process.env.VITE_MAX_UPLOAD_SIZE
  }
});
