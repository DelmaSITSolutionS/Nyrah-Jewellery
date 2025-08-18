import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [
    react(), 
    tailwindcss()
  ],
   server: {
    host: true, // Listen on all interfaces
    port: 5173,
    allowedHosts:["nyrah.aegisfirewall.com"], // allow external access
  },
});
